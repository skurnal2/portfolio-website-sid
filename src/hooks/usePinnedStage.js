import { useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ANIMATION_OK, SCROLL_EFFECTS_OK, headerOffset } from "../components/common/motion";

gsap.registerPlugin(ScrollTrigger);

// A pinned 3D stage. On wide screens the section locks in place while you
// scroll, and its items come up out of the depth of the page with a tilt:
//
//   mode 'swap'  - one item at a time: each tips forward and away as the next
//                  rises into its place (the items must share one grid cell).
//   mode 'build' - items arrive one after another and stay, then the whole set
//                  tilts away together before the section unpins.
//   mode 'wheel' - an iOS picker: the current item sits big and flat in the
//                  middle, the ones before and after curve away above and below
//                  it, smaller and fainter, and scrolling clicks from one to the
//                  next.
//
// On phones nothing pins (a pinned 80vh box traps the reader); items just
// rise in as they scroll into view. With reduced motion, nothing moves.
// no filter: blur here (blurring large moving cards every frame was the
// biggest cost on the page), and autoAlpha rather than opacity, so a card
// that has faded out is visibility: hidden and the browser skips painting it.
const IN = { z: -700, rotateX: 32, rotateY: -8, y: 60, autoAlpha: 0 };
const REST = { z: 0, rotateX: 0, rotateY: 0, y: 0, autoAlpha: 1 };
const OUT = { z: 380, rotateX: -22, rotateY: 6, y: -80, autoAlpha: 0 };

// Options for 'wheel': `stage` (selector for the box the wheel turns in,
// defaults to the items' parent) and `onIndex` (called with the centred item).
// Mode 'cascade' (option `lead`, default a third): the first `lead` items
// rise in as the section approaches; the rest rise one after another while
// it is pinned, like a deck being dealt.
const WHEEL_HOLD = 0.9;

export default function usePinnedStage(ref, { item, mode = 'build', perItem = 380, stage: stageSel, onIndex, onFrame, lead } = {}) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const mm = gsap.matchMedia();

    mm.add(SCROLL_EFFECTS_OK, () => {
      const items = gsap.utils.toArray(item, root);
      if (!items.length) return;
      gsap.set(items, { transformPerspective: 1400, transformOrigin: '50% 50% -150px' });

      const n = items.length;
      // wheel: after the last item there's a rest, in items' worth of scroll,
      // so arriving on it doesn't carry straight on into the next section
      const hold = mode === 'wheel' ? WHEEL_HOLD : 0;
      const turns = n - 1 + hold;
      const leadCount = Math.min(n, lead ?? Math.ceil(n / 3));
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: root,
          start: () => `top top+=${headerOffset()}`,
          end: () => {
            if (mode === 'build') return `+=${Math.max(260, n * perItem * 0.45)}`;
            if (mode === 'cascade') return `+=${Math.max(300, (n - leadCount) * perItem)}`;
            return `+=${(n + hold) * perItem}`;
          },
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // the picker's detent: come to rest on an item, never between two
          ...(mode === 'wheel' && n > 1
            // each item, and the very end (so the next scroll leaves cleanly)
            ? { snap: { snapTo: [...items.map((_, i) => i / turns), 1], duration: { min: 0.25, max: 0.7 }, delay: 0.08, ease: 'power2.inOut' } }
            : {}),
        },
      });

      if (mode === 'wheel') {
        const stage = stageSel ? root.querySelector(stageSel) : items[0].parentElement;
        const state = { p: 0 };
        let last = -1;
        // Every item stays on the wheel: the centred one full size, the rest
        // smaller, fainter and tipped away the further they are from it.
        const render = () => {
          const unit = stage.clientHeight * 0.26;
          items.forEach((el, i) => {
            const d = i - state.p;          // distance from the centre, in items
            const a = Math.min(Math.abs(d), 3);
            gsap.set(el, {
              y: d * unit,
              rotateX: -d * 24,             // above tips its top away, below its bottom
              scale: 1 - a * 0.13,
              opacity: Math.max(0.12, 1 - a * 0.3),
              zIndex: 100 - Math.round(a * 10),
            });
          });
          const idx = Math.round(state.p);
          if (idx !== last) { last = idx; onIndex?.(idx); }
          onFrame?.();
        };
        render();
        tl.to(state, { p: n - 1, ease: 'none', duration: n - 1, onUpdate: render })
          .to({}, { duration: hold });
        return;
      }

      if (mode === 'cascade') {
        const first = items.slice(0, leadCount);
        const rest = items.slice(leadCount);
        gsap.fromTo(first, IN, {
          ...REST, stagger: 0.12, ease: 'power2.out', immediateRender: true,
          scrollTrigger: { trigger: root, start: 'top 88%', end: () => `top top+=${headerOffset()}`, scrub: 0.8 },
        });
        gsap.set(rest, IN);
        rest.forEach((el, i) => tl.to(el, { ...REST, duration: 1, ease: 'power3.out' }, i * 0.45));
        tl.to({}, { duration: 0.8 });
        const pin = tl.scrollTrigger;
        gsap.fromTo(items, REST, {
          ...OUT, stagger: 0.04, ease: 'power2.in', immediateRender: false,
          scrollTrigger: { start: () => pin.end, end: () => pin.end + Math.max(root.offsetHeight, window.innerHeight * 0.5), scrub: 0.8 },
        });
        return;
      }

      if (mode === 'swap') {
        gsap.set(items.slice(1), IN);
        items.forEach((el, i) => {
          if (i === 0) return;
          tl.to(items[i - 1], { ...OUT, duration: 1, ease: 'power2.in' }, '+=0.9')
            .fromTo(el, IN, { ...REST, duration: 1.1 }, '<+0.35');
        });
        tl.to({}, { duration: 0.9 });
      } else {
        // build: rise in while the section approaches, so it is never empty
        // when it locks...
        gsap.fromTo(items, IN, {
          ...REST,
          stagger: 0.12,
          ease: 'power2.out',
          immediateRender: true,
          scrollTrigger: { trigger: root, start: 'top 88%', end: () => `top top+=${headerOffset()}`, scrub: 0.8 },
        });
        // ...hold while pinned...
        tl.to({}, { duration: 1 });
        // ...then tip away as it scrolls off, starting only once the pin has
        // released (on a short section 'bottom 45%' came before the reveal
        // had even finished, and the two tweens cancelled out)
        const pin = tl.scrollTrigger;
        gsap.fromTo(items, REST, {
          ...OUT,
          stagger: 0.06,
          ease: 'power2.in',
          immediateRender: false,
          scrollTrigger: {
            start: () => pin.end,
            end: () => pin.end + Math.max(root.offsetHeight, window.innerHeight * 0.5),
            scrub: 0.8,
          },
        });
      }
    });

    // phones: no pin, a lighter version of the same rise
    mm.add(`(max-width: 1024px) and ${ANIMATION_OK}`, () => {
      gsap.utils.toArray(item, root).forEach((el) => {
        gsap.fromTo(el,
          { z: -200, rotateX: 18, y: 50, opacity: 0, transformPerspective: 900 },
          { z: 0, rotateX: 0, y: 0, opacity: 1, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 60%', scrub: 0.6 } });
      });
    });

    return () => mm.revert();
  }, [ref, item, mode, perItem, stageSel, onFrame, lead]); // eslint-disable-line react-hooks/exhaustive-deps
}
