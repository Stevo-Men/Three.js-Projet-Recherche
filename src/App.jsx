import React, { useState, useEffect, useCallback } from 'react';
import { SLIDES } from './data';
import { HUD } from './HUD';
import { Experience } from './Experience';
import './style.css';

export default function App() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [wheelLock, setWheelLock] = useState(false);

    const nudge = useCallback((dir) => {
        if (wheelLock) return;

        const next = activeSlide + dir;
        if (next >= 0 && next < SLIDES.length) {
            setWheelLock(true);
            setActiveSlide(next);
            setTimeout(() => setWheelLock(false), 1200);
        }
    }, [activeSlide, wheelLock]);

    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault(); // Might need to be passive: false if attached purely via DOM, but standard React onWheel works too
            if (Math.abs(e.deltaY) < 20) return;
            nudge(e.deltaY > 0 ? 1 : -1);
        };

        const handleKey = (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') nudge(1);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nudge(-1);
        };

        // Attach non-passive wheel listener for preventDefault to work properly over the canvas
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKey);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKey);
        };
    }, [nudge]);

    return (
        <>
            <Experience activeSlide={activeSlide} />
            <HUD activeSlide={activeSlide} />

            {/* Mini Progress HUD */}
            <div id="hud-progress" style={{ width: `${((activeSlide + 1) / SLIDES.length) * 100}%` }}></div>

        </>
    );
}
