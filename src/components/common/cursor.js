import gsap from 'gsap';
import React, { useEffect, useRef } from 'react';

const Cursor = ({
    cursorEnlarged = false,
    shape = "circle"
}) => {
    const size = cursorEnlarged ? 80 : 20;
    const borderRadius = shape == "circle" ? "50%" : "10px";
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

    const moveCircle = (x, y) => {
        gsap.set(circle.current, {x, y, xPercent: -50, yPercent: -50});
    }

    const animate = () => {
        const { x, y } = delayedMouse.current;
        delayedMouse.current = {
            x: lerp(x, mouse.current.x, 0.75),
            y: lerp(y, mouse.current.y, 0.75)
        };
        window.requestAnimationFrame(animate);
        moveCircle(delayedMouse.current.x, delayedMouse.current.y);
    }

    const addMouseClickEffect = () => {
        gsap.to(circle.current, { scale: 0.5, rotate: 90, duration: 0.2 });
    }

    const removeMouseClickEffect = () => {
        gsap.to(circle.current, { scale: 1, rotate: 0, duration: 0.2 });
    }

    useEffect(() => {
        animate();
        window.addEventListener("mousemove", manageMouseMove);
        window.addEventListener("mousedown", addMouseClickEffect);
        window.addEventListener("mouseup", removeMouseClickEffect);
        return() => window.removeEventListener("mousemove", manageMouseMove);
    }, [])

    return (
        <div
            ref={circle}
            className={`awesome-cursor ${cursorEnlarged ? 'enlarged' : ''}`}
            style={{
                width: size,
                height: size,
                borderRadius: borderRadius
            }}
        />
    );
}

export default Cursor;