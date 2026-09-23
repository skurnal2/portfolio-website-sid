import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faRotate, faHand } from '@fortawesome/free-solid-svg-icons';

// Must stay in step with the `cursor: none` block in src/css/global.scss —
// the native cursor is only hidden where this component actually draws a
// replacement, so the two conditions have to be identical.
const CUSTOM_CURSOR_OK =
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

const matchesCursorSupport = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(CUSTOM_CURSOR_OK).matches;

// What the cursor turns into over each kind of thing. First match wins, so
// specific selectors go before general ones.
//   label/icon: a pill with an icon and a word
//   magnet:     the ring snaps around the element
//   text:       an I-beam over form fields
const RULES = [
    ['input, textarea', { mode: 'text' }],
    ['.pj-visual', { mode: 'lens' }],
    ['.pj-link', { mode: 'pill', icon: faArrowUpRightFromSquare, label: 'Open' }],
    ['#theme-info-popup', { mode: 'pill', icon: faRotate, label: 'Shuffle' }],
    // buttons already say what they do, so the ring wraps them instead of
    // covering their label
    ['.spine-stop, .skills-chip, .hero-layers li, .corner-bar a, .corner-cta, .hero-btn, .ct-send', { mode: 'magnet' }],
    // wide rows that animate on their own hover: a ring stretched round them looks skewed
    ['.pj-index button, .ct-direct a', { mode: 'default' }],
    ['a, button, [role="button"]', { mode: 'hover' }],
];

const findRule = (el) => {
    for (const [selector, rule] of RULES) {
        const hit = el && el.closest && el.closest(selector);
        if (hit) return { ...rule, el: hit };
    }
    return { mode: 'default' };
};

const TRAIL = 12;
const RING = 36;

// A coral dot with a trailing dotted ring: the spine's ring, following the mouse.
const Cursor = () => {
    const [enabled, setEnabled] = useState(matchesCursorSupport);
    const [state, setState] = useState({ mode: 'default' });
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const shapeRef = useRef(null);
    const trailRef = useRef(null);
    const stateRef = useRef(state);
    stateRef.current = state;

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
        const query = window.matchMedia(CUSTOM_CURSOR_OK);
        const sync = () => setEnabled(query.matches);
        sync();
        query.addEventListener('change', sync);
        return () => query.removeEventListener('change', sync);
    }, []);

    useEffect(() => {
        if (!enabled) return undefined;

        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const ring = { x: mouse.x, y: mouse.y, w: RING, h: RING };
        const history = Array.from({ length: TRAIL * 2 }, () => ({ ...mouse }));
        const dots = Array.from(trailRef.current.children);
        let dragging = false;
        let visible = false;

        const dotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.08, ease: 'power3' });
        const dotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.08, ease: 'power3' });

        const onMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            dotX(mouse.x);
            dotY(mouse.y);
            if (!visible) {
                visible = true;
                gsap.to([dotRef.current, ringRef.current], { opacity: 1, duration: 0.3 });
            }
        };

        // Things drawn on a canvas (the hero cubes) aren't elements to hover,
        // so they announce themselves with a 'cursor-grab' event instead.
        let overTarget = null;
        let grabbable = false;
        const GRAB = { mode: 'pill', icon: faHand, label: 'Drag' };
        const onOver = (e) => {
            overTarget = e.target;
            if (grabbable) return;
            const next = findRule(e.target);
            const cur = stateRef.current;
            if (next.mode !== cur.mode || next.el !== cur.el) setState(next);
        };
        const onGrab = (e) => {
            grabbable = !!e.detail;
            setState(grabbable ? GRAB : findRule(overTarget));
        };
        window.addEventListener('cursor-grab', onGrab);
        // while something is being dragged, the thing itself is the cursor
        const onHide = (e) => {
            dragging = !!e.detail;
            gsap.to([dotRef.current, ringRef.current], { autoAlpha: e.detail ? 0 : 1, duration: e.detail ? 0.15 : 0.3 });
        };
        window.addEventListener('cursor-hide', onHide);

        const onLeaveWindow = () => {
            visible = false;
            gsap.to([dotRef.current, ringRef.current], { opacity: 0, duration: 0.3 });
        };

        // click: squish, and a dotted ripple out from the pointer
        const onDown = () => {
            gsap.to(shapeRef.current, { scale: 0.8, duration: 0.15 });
            const ripple = document.createElement('span');
            ripple.className = 'cursor-ripple';
            document.body.appendChild(ripple);
            gsap.fromTo(ripple,
                { x: mouse.x, y: mouse.y, xPercent: -50, yPercent: -50, scale: 0.3, opacity: 0.9 },
                { scale: 3.2, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => ripple.remove() });
        };
        const onUp = () => gsap.to(shapeRef.current, { scale: 1, duration: 0.35, ease: 'back.out(3)' });

        // Smoothing by elapsed time, not per frame, so the ring feels the
        // same on a 60Hz and a 144Hz screen, and still catches up if frames drop.
        const ease = (k) => 1 - Math.pow(1 - k, gsap.ticker.deltaRatio(60));
        const tick = () => {
            const s = stateRef.current;
            let tx = mouse.x;
            let ty = mouse.y;
            let tw = RING;
            let th = RING;

            if (s.mode === 'magnet' && s.el) {
                const r = s.el.getBoundingClientRect();
                const cx = r.left + r.width / 2;
                const cy = r.top + r.height / 2;
                // wrap the target, leaning a little toward the pointer
                tx = cx + (mouse.x - cx) * 0.15;
                ty = cy + (mouse.y - cy) * 0.15;
                tw = r.width + 14;
                th = r.height + 14;
            } else if (s.mode === 'pill') {
                tw = s.label ? 104 : 58;
                th = 58;
            } else if (s.mode === 'hover') {
                tw = th = 58;
            } else if (s.mode === 'lens') {
                tw = th = 120;
            } else if (s.mode === 'text') {
                tw = 4;
                th = 30;
            }

            const lag = ease(s.mode === 'magnet' ? 0.28 : 0.2);
            const dx = tx - ring.x;
            const dy = ty - ring.y;
            ring.x += dx * lag;
            ring.y += dy * lag;
            const grow = ease(0.22);
            ring.w += (tw - ring.w) * grow;
            ring.h += (th - ring.h) * grow;

            // stretch along the direction of travel, only as the plain ring
            const speed = Math.min(Math.hypot(dx, dy), 120);
            const stretch = s.mode === 'default' ? speed / 220 : 0;
            gsap.set(ringRef.current, { x: ring.x, y: ring.y, width: ring.w, height: ring.h, xPercent: -50, yPercent: -50 });
            gsap.set(shapeRef.current, {
                rotate: stretch > 0.02 ? Math.atan2(dy, dx) * 180 / Math.PI : 0,
                scaleX: 1 + stretch,
                scaleY: 1 - stretch * 0.45,
            });

            // the dotted trail: only shows when moving fast
            history.unshift({ x: mouse.x, y: mouse.y });
            history.length = TRAIL * 2;
            const fade = dragging ? 0 : Math.min(1, speed / 60);
            dots.forEach((d, i) => {
                const p = history[i * 2 + 1];
                gsap.set(d, { x: p.x, y: p.y, opacity: fade * (1 - i / TRAIL) * 0.8, scale: 1 - i / (TRAIL * 1.4) });
            });

        };
        gsap.ticker.add(tick);

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseover', onOver);
        window.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);
        document.documentElement.addEventListener('mouseleave', onLeaveWindow);
        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', onOver);
            window.removeEventListener('cursor-grab', onGrab);
            window.removeEventListener('cursor-hide', onHide);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
            document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
        };
    }, [enabled]);

    if (!enabled) return null;

    const { mode, icon, label } = state;
    return (
        <>
            <div className="cursor-trail" ref={trailRef} aria-hidden="true">
                {Array.from({ length: TRAIL }, (_, i) => <span key={i} />)}
            </div>
            <div className={`cursor-ring is-${mode}`} ref={ringRef} aria-hidden="true">
                <span className="cursor-shape" ref={shapeRef}><span className="cursor-border" /></span>
                <span className="cursor-content">
                    {icon && <FontAwesomeIcon icon={icon} />}
                    {label && <span>{label}</span>}
                </span>
            </div>
            <div className={`cursor-dot is-${mode}`} ref={dotRef} aria-hidden="true" />
        </>
    );
};

export default Cursor;
