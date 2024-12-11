import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';

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
    const [isMobile, setIsMobile] = useState(true);

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

    const manageMouseMove = (e) => {
        const { clientX, clientY } = e;
        mouse.current = {
            x: clientX,
            y: clientY
        };        
    }

    const lerp = (x, y, a) => x * (1 - a) + y * a;

    const moveCircle = (x, y, rotate) => {
        gsap.set(circle.current, {x, y, xPercent: -50, yPercent: -50, rotate: rotate});
    }

    const animate = () => {
        const { x, y } = delayedMouse.current;
        delayedMouse.current = {
            x: lerp(x, mouse.current.x, 0.75),
            y: lerp(y, mouse.current.y, 0.75)
        };
        window.requestAnimationFrame(animate);

        moveCircle(delayedMouse.current.x, delayedMouse.current.y, (x+y));
    }

    const addMouseClickEffect = () => {
        gsap.to(circle.current, { scale: 0.5, duration: 0.2 });
    }

    const removeMouseClickEffect = () => {
        gsap.to(circle.current, { scale: 1, duration: 0.2 });
    }

    useEffect(() => {
        animate();
        setIsMobile(window.innerWidth <= 768);
        window.addEventListener("mousemove", manageMouseMove);
        window.addEventListener("mousedown", addMouseClickEffect);
        window.addEventListener("mouseup", removeMouseClickEffect);
        return() => window.removeEventListener("mousemove", manageMouseMove);
    }, [])

    return (
        isMobile ? null :
        <div
            ref={circle}
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