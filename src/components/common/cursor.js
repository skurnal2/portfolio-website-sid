import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';

// Must stay in step with the `cursor: none` block in src/css/global.scss —
// the native cursor is only hidden where this component actually draws a
// replacement, so the two conditions have to be identical.
const CUSTOM_CURSOR_OK =
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

const matchesCursorSupport = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(CUSTOM_CURSOR_OK).matches;

const Cursor = ({
    cursorScale = false,
    cursorBlendColor = false,
    cursorBlur = false,
    cursorBorder = true,
    cursorBackdropBlur = false,
    cursorBackgroundRGB = "",
    cursorBackgroundOpacity = 1,
    cursorContent = null,
    cursorBorderRadius = "0px"
}) => {
    // Read the media query during the first render so a desktop visitor never
    // gets a frame with no cursor at all.
    const [enabled, setEnabled] = useState(matchesCursorSupport);

    const size = cursorScale * 20;
    const borderRadius = cursorBorderRadius;
    const circle = useRef();
    const mouse = useRef({
        x: 0,
        y: 0
    });

    const delayedMouse = useRef({
        x: 0,
        y: 0
    });

    // Plugging in a mouse, or changing the OS motion setting, should flip this
    // without a reload.
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

        const lerp = (x, y, a) => x * (1 - a) + y * a;

        const manageMouseMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        const addMouseClickEffect = () => {
            gsap.to(circle.current, { scale: 0.5, duration: 0.2 });
        };

        const removeMouseClickEffect = () => {
            gsap.to(circle.current, { scale: 1, duration: 0.2 });
        };

        let frame;
        const animate = () => {
            const { x, y } = delayedMouse.current;
            delayedMouse.current = {
                x: lerp(x, mouse.current.x, 0.75),
                y: lerp(y, mouse.current.y, 0.75)
            };

            if (circle.current) {
                gsap.set(circle.current, {
                    x: delayedMouse.current.x,
                    y: delayedMouse.current.y,
                    xPercent: -50,
                    yPercent: -50
                });
            }

            frame = window.requestAnimationFrame(animate);
        };

        frame = window.requestAnimationFrame(animate);
        window.addEventListener("mousemove", manageMouseMove);
        window.addEventListener("mousedown", addMouseClickEffect);
        window.addEventListener("mouseup", removeMouseClickEffect);

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("mousemove", manageMouseMove);
            window.removeEventListener("mousedown", addMouseClickEffect);
            window.removeEventListener("mouseup", removeMouseClickEffect);
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div
            ref={circle}
            aria-hidden="true"
            className={`
                awesome-cursor
                ${cursorBlendColor ? ' blend' : ''}
                ${cursorBlur ? ' blur' : ''}
                ${cursorBorder ? ' border' : ''}
                ${cursorBackdropBlur ? ' backdrop-blur' : ''}
            `}
            style={{
                width: size,
                height: size,
                borderRadius: borderRadius,
                backgroundColor: `rgba(${cursorBackgroundRGB ? cursorBackgroundRGB : 'var(--color3)'}, ${cursorBackgroundOpacity})`
            }}
        >
            {cursorContent}
        </div>
    );
}

export default Cursor;
