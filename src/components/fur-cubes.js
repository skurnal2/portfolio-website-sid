import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { introTime } from "../lib/intro";
import { track } from "../lib/analytics";

// The hero's two squares as soft, furry 3D cubes.
//
// Fur is shell texturing: each cube is drawn SHELLS times, every copy pushed a
// little further out along the surface normal. A hair map gives each tiny cell
// a hair height; a shell only keeps the pixels whose hair reaches it, tapered
// toward the tip. Thousands of strands, one instanced draw call per cube.
//
// Sizing and placement come from the original CSS squares (.circle), so the
// layout is unchanged at every screen size; the CSS squares are hidden once
// this is running and stay as the fallback if WebGL isn't available.

const VERT = `
attribute float aShell;
uniform float uLength;
uniform vec3 uDisp;
uniform float uTime;
varying vec2 vUv;
varying float vH;
varying vec3 vN;
varying vec3 vView;
void main() {
  vH = aShell;
  vec3 n = normalize(normal);
  vec3 p = position + n * aShell * uLength;
  float bend = aShell * aShell;
  p += uDisp * bend;
  p += vec3(sin(uTime * 1.7 + position.y * 7.0), 0.0, cos(uTime * 1.3 + position.x * 7.0)) * 0.006 * bend;
  vUv = uv;
  vN = normalize(normalMatrix * n);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = `
uniform sampler2D uHair;
uniform float uDensity;
uniform float uHairRes;
uniform vec3 uColor;
uniform vec3 uTip;
uniform vec3 uLight;
varying vec2 vUv;
varying float vH;
varying vec3 vN;
varying vec3 vView;
void main() {
  vec2 st = vUv * uDensity;
  vec2 cell = floor(st);
  vec2 local = fract(st) * 2.0 - 1.0;
  float h = texture2D(uHair, (mod(cell, uHairRes) + 0.5) / uHairRes).r;
  if (vH > 0.0) {
    if (h < vH) discard;
    // velvet pile: fat, blunt strands packed close, so the surface reads solid
    float taper = 1.0 - vH / h;
    // (tips thin out, so the silhouette goes soft instead of showing an edge)
    if (length(local) > 0.42 + taper * 0.95) discard;
  }
  vec3 N = normalize(vN);
  vec3 V = normalize(vView);
  float ndv = max(dot(N, V), 0.0);
  float diff = max(dot(N, normalize(uLight)), 0.0) * 0.55 + 0.45;
  // velvet's look: darker where the pile faces you, a soft bright sheen
  // where it turns away (the fibres catch the light side-on)
  float sheen = pow(1.0 - ndv, 2.6);
  float face = mix(0.78, 1.0, 1.0 - ndv);
  // brushed patches, where the pile lies a slightly different way
  float brush = 0.93 + 0.07 * sin(vUv.x * 9.0 + sin(vUv.y * 7.0) * 1.6);
  float tint = texture2D(uHair, (mod(cell, uHairRes) + 0.5) / uHairRes).g;
  float ao = mix(0.72, 1.0, vH);
  vec3 col = mix(uColor, uTip, vH * 0.35) * ao * diff * face * brush * (0.96 + tint * 0.08)
           + uTip * sheen * 0.75;
  gl_FragColor = vec4(col, 1.0);
}`;

const readRGB = (name, fallback) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const [r, g, b] = v.split(",").map((x) => Number(x) / 255);
  return new THREE.Color(r, g, b);
};

const hairTexture = (res) => {
  const data = new Uint8Array(res * res * 4);
  for (let i = 0; i < res * res; i++) {
    // mostly long hairs, some short, the odd bald cell: reads as soft fluff
    const r = Math.random();
    const h = r < 0.02 ? 0.3 : 0.7 + Math.random() * 0.3;
    data[i * 4] = Math.round(h * 255);
    data[i * 4 + 1] = Math.round(Math.random() * 255);
    data[i * 4 + 3] = 255;
  }
  const t = new THREE.DataTexture(data, res, res, THREE.RGBAFormat);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.needsUpdate = true;
  return t;
};

export default function FurCubes({ containerSelector = "#name-container" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.closest(containerSelector);
    if (!canvas || !container) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      container.classList.add("no-fur"); // no WebGL: show the CSS squares instead
      return undefined;
    }
    const mobile = window.matchMedia("(max-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Cost is shells x covered pixels x pixel density, so all three stay modest:
    // the fur is soft enough that 24 layers and 1.25x density look the same.
    const SHELLS = mobile ? 14 : 24;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.25));
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    const HAIR_RES = 64;
    const hair = hairTexture(HAIR_RES);
    // the fur hides fine corner detail, so a light mesh is enough
    const geometry = new RoundedBoxGeometry(1, 1, 1, 4, 0.3);
    const shellAttr = new THREE.InstancedBufferAttribute(new Float32Array(SHELLS).map((_, i) => i / (SHELLS - 1)), 1);
    geometry.setAttribute("aShell", shellAttr);

    const makeCube = (colorVar, fallback) => {
      const base = readRGB(colorVar, fallback);
      const material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uLength: { value: 0.078 },
          uDisp: { value: new THREE.Vector3() },
          uTime: { value: 0 },
          uHair: { value: hair },
          uDensity: { value: mobile ? 70 : 96 },
          uHairRes: { value: HAIR_RES },
          uColor: { value: base.clone().multiplyScalar(0.8) },
          uTip: { value: base.clone().lerp(new THREE.Color(1, 1, 1), 0.35) },
          uLight: { value: new THREE.Vector3(-0.4, 0.8, 1) },
        },
      });
      const mesh = new THREE.InstancedMesh(geometry, material, SHELLS);
      const m = new THREE.Matrix4();
      for (let i = 0; i < SHELLS; i++) mesh.setMatrixAt(i, m);
      mesh.frustumCulled = false;
      // outer group squashes along the collision direction; inner group undoes
      // the outer's rotation, so the cube itself doesn't turn with the squash
      const squash = new THREE.Group();
      const unturn = new THREE.Group();
      unturn.add(mesh);
      squash.add(unturn);
      scene.add(squash);
      return {
        mesh, squash, unturn, hitAngle: 0, material, colorVar, fallback,
        vel: new THREE.Vector3(), lastQ: new THREE.Quaternion(), spin: Math.random() * 10,
        // bounce physics, in world units on the z = 0 plane
        off: new THREE.Vector2(), v: new THREE.Vector2(),
        // jelly wobble: a damped spring that squashes and stretches the cube
        wob: 0, wobV: 0,
      };
    };

    const cubes = [makeCube("--color2", "255, 127, 80"), makeCube("--color3", "64, 164, 175")];
    const squares = Array.from(container.querySelectorAll(".circle"));

    const view = { box: null, perPx: 1, halfW: 1, halfH: 1 };
    // place each cube over its CSS square, in world units on the z = 0 plane
    const layout = () => {
      // the canvas overhangs its container (room for fur and the cubes'
      // movement), so place everything relative to the canvas itself
      const box = canvas.getBoundingClientRect();
      const w = Math.max(1, box.width);
      const h = Math.max(1, box.height);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const worldH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const perPx = worldH / h;
      view.box = box; view.perPx = perPx; view.halfW = (w / 2) * perPx; view.halfH = (h / 2) * perPx;
      cubes.forEach((c, i) => {
        const sq = squares[i];
        if (!sq) return;
        const r = sq.getBoundingClientRect();
        const cx = r.left + r.width / 2 - box.left;
        const cy = r.top + r.height / 2 - box.top;
        c.home = new THREE.Vector3((cx - w / 2) * perPx, -(cy - h / 2) * perPx, i === 0 ? 0.6 : 0);
        c.size = r.width * perPx * 0.66;
        c.squash.position.copy(c.home);
        c.mesh.scale.setScalar(c.size);
        c.radius = c.size * 0.58; // body plus fur
      });
      // The CSS squares overlap by design; the cubes rest just touching
      // instead, so they can bounce off each other.
      const [a, b] = cubes;
      if (a.home && b.home) {
        const mid = a.home.clone().add(b.home).multiplyScalar(0.5);
        const dir = b.home.clone().sub(a.home);
        dir.z = 0;
        if (dir.lengthSq() < 1e-6) dir.set(1, -0.4, 0);
        dir.normalize();
        const need = (a.radius + b.radius) * 1.04;
        const share = a.radius / (a.radius + b.radius);
        a.home.copy(mid).addScaledVector(dir, -need * share);
        b.home.copy(mid).addScaledVector(dir, need * (1 - share));
        a.home.z = 0.6;
        b.home.z = 0;
      }
    };
    layout();
    container.classList.add("has-fur");

    const pointer = { x: 0, y: 0 };
    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Grab a cube and fling it at the other one. The name sits over the
    // canvas, so listen on the whole name block and hit-test the cubes.
    const toWorld = (e) => {
      const b = view.box || canvas.getBoundingClientRect();
      return new THREE.Vector2(
        (e.clientX - b.left - b.width / 2) * view.perPx,
        -(e.clientY - b.top - b.height / 2) * view.perPx,
      );
    };
    let drag = null;
    let bumps = 0; // collisions so far, to tell whether a drag ended in a hit
    let drags = 0; // drag events sent this page load (capped)
    let canGrab = false;
    const setGrab = (on) => {
      if (on === canGrab) return;
      canGrab = on;
      container.classList.toggle("can-grab", on);
      window.dispatchEvent(new CustomEvent("cursor-grab", { detail: on }));
    };
    const cubeAt = (pt) => {
      let best = null;
      cubes.forEach((c) => {
        const d = pt.distanceTo(new THREE.Vector2(c.home.x + c.off.x, c.home.y + c.off.y));
        if (d < c.radius * 0.95 && (!best || d < best.d)) best = { c, d };
      });
      return best?.c;
    };
    const onDown = (e) => {
      if (e.pointerType === "touch" || e.button !== 0 || reduced) return;
      const pt = toWorld(e);
      const c = cubeAt(pt);
      if (!c) return;
      e.preventDefault();
      drag = { c, grab: new THREE.Vector2(c.off.x, c.off.y).sub(pt), target: new THREE.Vector2(c.off.x, c.off.y) };
      c.dragging = true;
      drag.bumpsAtStart = bumps;
      container.setPointerCapture?.(e.pointerId);
      container.classList.add("is-grabbing");
      window.dispatchEvent(new CustomEvent("cursor-hide", { detail: true }));
      start();
    };
    const onMove = (e) => {
      if (drag) {
        drag.target.copy(toWorld(e)).add(drag.grab);
        return;
      }
      if (e.pointerType === "touch") return;
      setGrab(!!cubeAt(toWorld(e)));
    };
    const onUp = (e) => {
      if (!drag) return;
      drag.c.dragging = false;
      // Analytics: one event per drag, once a thrown cube has had a moment
      // to land. The first cube is the small one, the second the large one.
      const { c: thrown, bumpsAtStart } = drag;
      if (drags < 15) {
        drags += 1;
        setTimeout(() => track("cube_drag", {
          cube: thrown === cubes[0] ? "small" : "large",
          result: bumps > bumpsAtStart ? "hit" : "miss",
        }), 1200);
      }
      // a flung cube keeps its speed, within reason
      const max = drag.c.radius * 9;
      if (drag.c.v.length() > max) drag.c.v.setLength(max);
      drag = null;
      container.releasePointerCapture?.(e.pointerId);
      container.classList.remove("is-grabbing");
      window.dispatchEvent(new CustomEvent("cursor-hide", { detail: false }));
      setGrab(!!cubeAt(toWorld(e)));
    };
    const onLeave = () => { if (!drag) setGrab(false); };
    container.addEventListener("pointerdown", onDown);
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerup", onUp);
    container.addEventListener("pointercancel", onUp);
    container.addEventListener("pointerleave", onLeave);

    const recolor = () => cubes.forEach((c) => {
      const base = readRGB(c.colorVar, c.fallback);
      c.material.uniforms.uColor.value.copy(base).multiplyScalar(0.8);
      c.material.uniforms.uTip.value.copy(base).lerp(new THREE.Color(1, 1, 1), 0.35);
    });
    const themeWatch = new MutationObserver(recolor);
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });

    const clock = new THREE.Clock();
    const invQ = new THREE.Quaternion();
    let running = false;
    let frame;
    let intro = 0;

    // one physics step: each cube wanders slowly on its own path and leans
    // toward the pointer, a soft spring keeps it near home, and if the two
    // drift into each other they bounce apart with a small squash
    const step = (dt, t) => {
      cubes.forEach((c, i) => {
        // a slow, smooth wander (sum of sines, different per cube) and a lean
        // toward the pointer; the two paths overlap now and then, so the
        // cubes meet naturally rather than on a timer
        const wx = Math.sin(t * 0.37 + c.spin) * 0.55 + Math.sin(t * 0.61 + c.spin * 2.1) * 0.3;
        const wy = Math.cos(t * 0.29 + c.spin * 1.7) * 0.4 + Math.sin(t * 0.53 + c.spin) * 0.2;
        const lean = i === 0 ? 0.14 : -0.1;
        const tx = (wx + pointer.x * lean) * c.radius * 0.5;
        const ty = (wy - pointer.y * lean) * c.radius * 0.5;
        if (c.dragging && drag) {
          // held: follow the hand closely, and remember how fast it moved
          // so letting go throws the cube
          const nx = c.off.x + (drag.target.x - c.off.x) * Math.min(1, dt * 22);
          const ny = c.off.y + (drag.target.y - c.off.y) * Math.min(1, dt * 22);
          c.v.set((nx - c.off.x) / dt, (ny - c.off.y) / dt);
          c.off.set(nx, ny);
        } else {
          c.v.x += ((tx - c.off.x) * 4 - c.v.x * 1.8) * dt;
          c.v.y += ((ty - c.off.y) * 4 - c.v.y * 1.8) * dt;
          c.off.addScaledVector(c.v, dt);
        }
        // stay inside the canvas
        const limX = view.halfW - c.radius * 0.9;
        const limY = view.halfH - c.radius * 0.9;
        const px = c.home.x + c.off.x;
        const py = c.home.y + c.off.y;
        if (Math.abs(px) > limX) { c.off.x = Math.sign(px) * limX - c.home.x; c.v.x *= -0.5; }
        if (Math.abs(py) > limY) { c.off.y = Math.sign(py) * limY - c.home.y; c.v.y *= -0.5; }
        // jelly wobble rings out
        c.wobV += (-80 * c.wob - 6 * c.wobV) * dt;
        c.wob += c.wobV * dt;
      });
      const [a, b] = cubes;
      const pa = new THREE.Vector2(a.home.x + a.off.x, a.home.y + a.off.y);
      const pb = new THREE.Vector2(b.home.x + b.off.x, b.home.y + b.off.y);
      const n = pb.clone().sub(pa);
      const dist = n.length();
      const minDist = a.radius + b.radius;
      if (dist > 1e-5 && dist < minDist) {
        n.divideScalar(dist);
        // separate, weighted by size
        const push = minDist - dist;
        // a held cube doesn't give way: the other one takes the whole push
        const wa = a.dragging ? 0 : b.dragging ? 1 : b.radius / minDist;
        a.off.addScaledVector(n, -push * wa);
        b.off.addScaledVector(n, push * (1 - wa));
        // bounce: reflect the closing speed, softly
        const closing = b.v.clone().sub(a.v).dot(n);
        if (closing < 0) {
          const j = -1.6 * closing * 0.5;
          if (a.dragging) b.v.addScaledVector(n, 2 * j);
          else if (b.dragging) a.v.addScaledVector(n, -2 * j);
          else { a.v.addScaledVector(n, -j); b.v.addScaledVector(n, j); }
          // squash both along the line between them, as much as the bump deserves
          const hit = Math.min(0.12, -closing * 0.05);
          const angle = Math.atan2(n.y, n.x);
          a.hitAngle = angle;
          b.hitAngle = angle;
          a.wobV += hit * 11;
          b.wobV += hit * 11;
          bumps += 1;
        }
      }
    };

    const render = () => {
      const dt = Math.min(clock.getDelta() || 0.016, 0.05);
      const t = clock.elapsedTime;
      // they grow in at 0.7s into the opening sequence (or as soon as
      // they've loaded, if that's later)
      if (introTime() >= 0.7) intro = Math.min(1, intro + dt * 0.8);
      const pop = 1 - Math.pow(1 - intro, 3);
      const grow = intro >= 1 ? 1 : 1 + 2.2 * Math.pow(intro - 1, 3) + 1.2 * Math.pow(intro - 1, 2); // back-out
      if (!reduced && intro > 0.7) { step(dt / 2, t); step(dt / 2, t); }
      const scrollP = Math.min(1, window.scrollY / Math.max(1, container.offsetHeight));
      cubes.forEach((c, i) => {
        const dir = i === 0 ? 1 : -1;
        c.mesh.rotation.x = 0.35 + Math.sin(t * 0.4 + c.spin) * 0.18 + pointer.y * 0.15 + scrollP * 1.2 * dir + c.v.y * 0.08;
        c.mesh.rotation.y = t * 0.25 * dir + pointer.x * 0.22 + c.spin + c.v.x * 0.08;
        c.mesh.rotation.z = (i === 0 ? -0.2 : 0.18) + Math.sin(t * 0.3 + c.spin) * 0.08;
        c.squash.position.set(
          c.home.x + c.off.x + scrollP * 3 * dir,
          c.home.y + c.off.y + Math.sin(t * 0.8 + c.spin) * 0.05 + - (1 - pop) * 0.9 + scrollP * 1.5,
          c.home.z,
        );
        // squash along the hit direction, bulge across it, ringing out
        const w = c.wob;
        c.squash.rotation.z = c.hitAngle;
        c.unturn.rotation.z = -c.hitAngle;
        c.squash.scale.set(1 - w, 1 + w * 0.6, 1 + w * 0.6);
        c.mesh.scale.setScalar(c.size * Math.max(0.001, grow));
        // fur trails behind the cube's movement and droops a little
        const q = c.mesh.quaternion;
        const turn = q.angleTo(c.lastQ);
        c.lastQ.copy(q);
        c.vel.lerp(new THREE.Vector3(-pointer.x * 0.007 - c.v.x * 0.02, -0.012 - turn * 0.4 - c.v.y * 0.02, 0), 0.12);
        invQ.copy(q).invert();
        c.material.uniforms.uDisp.value.copy(c.vel).applyQuaternion(invQ);
        c.material.uniforms.uTime.value = t;
      });
      renderer.render(scene, camera);
    };

    // Adaptive quality: time real frames once the intro has settled, and if
    // the device can't hold ~45fps, step down (density, then fewer fur
    // layers, then density again). Fast machines never notice.
    const baseRatio = renderer.getPixelRatio();
    const STEPS = [
      () => renderer.setPixelRatio(Math.min(baseRatio, 1)),
      () => setShells(Math.max(10, Math.round(SHELLS * 0.65))),
      () => renderer.setPixelRatio(Math.min(baseRatio, 0.75)),
    ];
    const setShells = (count) => {
      for (let i = 0; i < count; i++) shellAttr.array[i] = i / (count - 1);
      shellAttr.needsUpdate = true;
      cubes.forEach((c) => { c.mesh.count = count; });
    };
    let level = 0;
    let lastT = 0;
    let sampleSum = 0;
    let samples = 0;
    const measure = (now) => {
      if (lastT && intro >= 1) {
        sampleSum += Math.min(now - lastT, 100);
        samples += 1;
        if (samples === 90) {
          if (sampleSum / samples > 22 && level < STEPS.length) {
            STEPS[level]();
            level += 1;
            track("fur_quality", { level });
            layout();
          }
          sampleSum = 0;
          samples = 0;
        }
      }
      lastT = now;
    };

    const loop = (now) => { measure(now || performance.now()); render(); frame = requestAnimationFrame(loop); };
    // a paused loop restarts its timing, so the pause isn't counted as a slow frame
    const start = () => { if (!running && !reduced) { running = true; lastT = 0; clock.getDelta(); loop(); } };
    const stop = () => { running = false; cancelAnimationFrame(frame); };

    // only animate while the hero is on screen and the tab is visible
    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()), { threshold: 0 });
    io.observe(container);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(() => { layout(); if (!running) render(); });
    ro.observe(container);

    if (reduced) { intro = 1; render(); }

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      themeWatch.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerup", onUp);
      container.removeEventListener("pointercancel", onUp);
      container.removeEventListener("pointerleave", onLeave);
      setGrab(false);
      container.classList.remove("can-grab", "is-grabbing");
      container.classList.remove("has-fur");
      cubes.forEach((c) => c.material.dispose());
      geometry.dispose();
      hair.dispose();
      renderer.dispose();
    };
  }, [containerSelector]);

  return <canvas ref={canvasRef} className="fur-canvas" aria-hidden="true" />;
}
