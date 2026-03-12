import React, { useState, useEffect, useCallback } from 'react';
import { SLIDES } from './data';
import { HUD } from './HUD';
import { Experience } from './Experience';
import './style.css';

const INITIAL_EFFECTS = {
    bloom: false,
    dof: false,
    chromatic: false,
    glitch: false,
    outline: false,
    smaa: false,
    vignette: false,
};

export type EffectKeys = keyof typeof INITIAL_EFFECTS;

interface TimelineProps {
    activeSlide: number;
    setActiveSlide: React.Dispatch<React.SetStateAction<number>>;
}
function Timeline({ activeSlide, setActiveSlide }: TimelineProps) {
    return (
        <div style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            width: '100%',
            height: '24px',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 100,
        }}>
            {SLIDES.map((slide, i) => {
                const isPast = i <= activeSlide;
                const isActive = i === activeSlide;
                return (
                    <div
                        key={i}
                        onClick={() => setActiveSlide(i)}
                        title={slide.title}
                        style={{
                            flex: 1,
                            height: '100%',
                            display: 'flex',
                            alignItems: 'flex-end',
                            cursor: 'pointer',
                            padding: '0 2px',
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                            if (e.currentTarget.firstChild instanceof HTMLElement) {
                                e.currentTarget.firstChild.style.height = '6px';
                                e.currentTarget.firstChild.style.opacity = '1';
                            }
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                            if (e.currentTarget.firstChild instanceof HTMLElement) {
                                e.currentTarget.firstChild.style.height = isActive ? '4px' : '2px';
                                e.currentTarget.firstChild.style.opacity = isPast ? '0.85' : '0.3';
                            }
                        }}
                    >
                        <div style={{
                            width: '100%',
                            height: isActive ? '4px' : '2px',
                            background: slide.hx || '#fff',
                            opacity: isPast ? 0.85 : 0.3,
                            transition: 'height 0.2s ease, opacity 0.2s ease',
                        }}></div>
                    </div>
                );
            })}
        </div>
    );
}

export default function App() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [wheelLock, setWheelLock] = useState(false);
    const [activeEffects, setActiveEffects] = useState(INITIAL_EFFECTS);

    const toggleEffect = useCallback((key: EffectKeys) => {
        setActiveEffects(prev => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const nudge = useCallback((dir: number) => {
        if (wheelLock) return;

        const next = activeSlide + dir;
        if (next >= 0 && next < SLIDES.length) {
            setWheelLock(true);
            setActiveSlide(next);
            setTimeout(() => setWheelLock(false), 1200);
        }
    }, [activeSlide, wheelLock]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (Math.abs(e.deltaY) < 20) return;
            nudge(e.deltaY > 0 ? 1 : -1);
        };

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') nudge(1);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nudge(-1);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKey);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKey);
        };
    }, [nudge]);

    return (
        <>
            <Experience activeSlide={activeSlide} activeEffects={activeEffects} />
            <HUD activeSlide={activeSlide} activeEffects={activeEffects} toggleEffect={(key: string) => toggleEffect(key as EffectKeys)} />

            {/* Interactive Timeline HUD */}
            <Timeline activeSlide={activeSlide} setActiveSlide={setActiveSlide} />
        </>
    );
}