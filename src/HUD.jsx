import React, { useEffect, useState } from 'react';
import { SLIDES, SLIDE_COPY, POSITIONS } from './data';
import './style.css';

// ─── Body text size tokens ─────────────────────────────────────────────────────
const BODY_SIZES = {
    xs: 'clamp(0.68rem, 0.88vw, 0.80rem)',
    sm: 'clamp(0.76rem, 1.0vw, 0.90rem)',
    md: 'clamp(0.85rem, 1.2vw, 1.05rem)',
    lg: 'clamp(1.0rem, 1.4vw, 1.2rem)',
};

// ─── Structured body renderer ──────────────────────────────────────────────────
// Format conventions for body strings in data.js:
//   ## Heading text   → accent-colored label (no ## in output)
//   • item / - item   → bullet point
//   plain text        → paragraph
//   \n\n              → block separator
function BodyContent({ body, bodyStyle = {}, isVisible, accentColor }) {
    if (!body) return null;
    const { fontSize = 'md', lineHeight = 1.65 } = bodyStyle;
    const blocks = body.split('\n\n').map(b => b.trim()).filter(Boolean);
    let animIdx = 0;

    return (
        <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: BODY_SIZES[fontSize] || BODY_SIZES.md,
            fontWeight: 400,
            letterSpacing: '0.03em',
            color: 'rgba(255,255,255,0.9)',
            lineHeight,
        }}>
            {blocks.map((block, bi) => {
                const lines = block.split('\n').map(l => l.trim()).filter(Boolean);

                // Section heading: lone ## line
                if (lines.length === 1 && lines[0].startsWith('## ')) {
                    const idx = animIdx++;
                    return (
                        <div key={bi} style={{
                            marginTop: bi > 0 ? '12px' : '0',
                            marginBottom: '2px',
                            fontSize: '0.82em',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            color: accentColor || 'rgba(255,255,255,0.6)',
                            opacity: isVisible ? 1 : 0,
                            transition: `opacity 0.45s ease ${0.18 + idx * 0.06}s`,
                        }}>
                            {lines[0].slice(3)}
                        </div>
                    );
                }

                // All-bullet block
                if (lines.every(l => /^[•\-]/.test(l))) {
                    return (
                        <div key={bi} style={{ marginTop: bi > 0 ? '8px' : '0' }}>
                            {lines.map((line, li) => {
                                const idx = animIdx++;
                                return (
                                    <div key={li} style={{
                                        display: 'flex',
                                        gap: '0.6em',
                                        marginTop: li > 0 ? '5px' : '0',
                                        opacity: isVisible ? 1 : 0,
                                        transition: `opacity 0.45s ease ${0.18 + idx * 0.06}s`,
                                    }}>
                                        <span style={{ color: accentColor, flexShrink: 0 }}>›</span>
                                        <span>{line.replace(/^[•\-]\s*/, '')}</span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                }

                // Regular paragraph (join multi-lines with a space)
                const idx = animIdx++;
                return (
                    <div key={bi} style={{
                        marginTop: bi > 0 ? '10px' : '0',
                        opacity: isVisible ? 1 : 0,
                        transition: `opacity 0.45s ease ${0.18 + idx * 0.06}s`,
                    }}>
                        {lines.join(' ')}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Effects config ────────────────────────────────────────────────────────────
const EFFECTS = [
    { key: 'bloom', label: 'Bloom', desc: 'Luminous glow on bright areas' },
    { key: 'dof', label: 'Depth of Field', desc: 'Bokeh lens blur' },
    { key: 'chromatic', label: 'Chromatic', desc: 'RGB channel split' },
    { key: 'glitch', label: 'Glitch', desc: 'Digital signal corruption' },
    { key: 'outline', label: 'Outline', desc: 'Edge detection on geometry' },
    { key: 'smaa', label: 'Antialiasing', desc: 'SMAA edge smoothing' },
    { key: 'vignette', label: 'Vignette', desc: 'Cinematic edge darkening' },
];

// ─── Effects Panel ─────────────────────────────────────────────────────────────
function EffectsPanel({ activeEffects, toggleEffect, accentColor }) {
    return (
        <div style={{
            position: 'fixed',
            bottom: '32px',
            right: 'clamp(80px, 7vw, 110px)',
            zIndex: 60,
            pointerEvents: 'all',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'flex-end',
        }}>
            <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.52rem',
                fontWeight: 400,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.28)',
                marginBottom: '4px',
            }}>
                Post-Processing
            </div>

            {EFFECTS.map(({ key, label, desc }) => {
                const active = activeEffects[key];
                return (
                    <button
                        key={key}
                        onClick={() => toggleEffect(key)}
                        title={desc}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 0',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.62rem',
                            fontWeight: active ? 600 : 300,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: active ? accentColor : 'rgba(255,255,255,0.32)',
                            transition: 'color 0.2s ease',
                            justifyContent: 'flex-end',
                        }}
                    >
                        {label}
                        <span style={{
                            display: 'inline-block',
                            width: '7px',
                            height: '7px',
                            flexShrink: 0,
                            background: active ? accentColor : 'transparent',
                            border: `1px solid ${active ? accentColor : 'rgba(255,255,255,0.2)'}`,
                            transition: 'background 0.2s ease, border-color 0.2s ease',
                            boxShadow: active ? `0 0 6px ${accentColor}` : 'none',
                        }} />
                    </button>
                );
            })}
        </div>
    );
}

// ─── Main HUD ──────────────────────────────────────────────────────────────────
export function HUD({ activeSlide, activeEffects, toggleEffect }) {
    const [isVisible, setIsVisible] = useState(false);
    const [content, setContent] = useState(null);

    useEffect(() => {
        if (activeSlide < 0 || activeSlide >= SLIDES.length) return;

        setIsVisible(false);

        const timer = setTimeout(() => {
            setContent({
                slide: SLIDES[activeSlide],
                copy: SLIDE_COPY[activeSlide] || {},
                pos: POSITIONS[activeSlide] || { side: 'left', top: '20%' },
            });
            setIsVisible(true);
        }, 260);

        return () => clearTimeout(timer);
    }, [activeSlide]);

    if (!content) return null;

    const { slide, copy, pos } = content;
    const isRight = pos.side === 'right';
    const color = slide.color;
    const hexColor = typeof color === 'number' ? `#${color.toString(16).padStart(6, '0')}` : color;
    const isThreeJS = slide.sceneId === 4;

    const panelClasses = `sc-panel ${isRight ? 'sc-right' : 'sc-left'} ${isVisible ? 'sc-visible' : 'sc-hidden'}`;

    const panelStyles = {
        top: pos.top,
        ...(isRight ? { right: 'clamp(80px, 7vw, 110px)' } : { left: 'clamp(32px, 5vw, 64px)' })
    };

    // paragraphs no longer needed — BodyContent handles parsing

    return (
        <div className="sc-wrap" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 50 }}>
            <div className={panelClasses} style={panelStyles}>
                <div className="sc-inner" style={{ borderColor: `${hexColor}55`, transition: 'border-color 0.45s ease', borderLeftStyle: 'solid', borderLeftWidth: '1px', paddingLeft: '20px' }}>

                    <div className="sc-eyebrow" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(0.55rem, 0.9vw, 0.68rem)', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: '18px', marginTop: '18px', lineHeight: 1 }}>
                        {copy.eyebrow || slide.subject.toUpperCase()}
                    </div>

                    <div className="sc-title-row" style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '22px' }}>
                        <span className="sc-num" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(0.72rem, 1.1vw, 0.84rem)', fontWeight: 300, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.28)', flexShrink: 0, paddingTop: '0.15em' }}>
                            0{slide.subjectNum}
                        </span>
                        <h2 className="sc-title" style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.0, margin: 0, transition: 'color 0.45s ease', color: hexColor }}>
                            {slide.title}
                        </h2>
                    </div>

                    {slide.tot > 1 && (
                        <div className="sc-subtitle-tag" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '10px', marginBottom: '2px', transition: 'color 0.45s ease', opacity: 0.45, color: hexColor }}>
                            {slide.subtitle}
                        </div>
                    )}

                    <div className="sc-divider" style={{ width: '100%', height: '1px', marginBottom: '20px', transition: 'background 0.45s ease', opacity: 0.55, background: hexColor }}></div>

                    <div className="sc-body">
                        <BodyContent
                            body={copy.body || slide.subtitle || ''}
                            bodyStyle={copy.bodyStyle}
                            isVisible={isVisible}
                            accentColor={hexColor}
                        />
                    </div>

                    {copy.cta && (
                        <button
                            className="sc-cta"
                            style={{
                                display: 'inline-block', marginTop: '24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', border: `1px solid ${hexColor}44`, padding: '8px 16px', borderRadius: 0, transition: 'color 0.3s ease, border-color 0.3s ease', pointerEvents: 'all', cursor: 'pointer',
                                color: hexColor
                            }}
                            onMouseEnter={(e) => { e.target.style.color = '#fff'; e.target.style.borderColor = 'rgba(255,255,255,0.55)'; }}
                            onMouseLeave={(e) => { e.target.style.color = hexColor; e.target.style.borderColor = `${hexColor}44`; }}
                        >
                            {copy.cta}
                        </button>
                    )}
                </div>
            </div>

            {/* Effects panel — visible only on ThreeJS slides */}
            {isThreeJS && (
                <EffectsPanel
                    activeEffects={activeEffects}
                    toggleEffect={toggleEffect}
                    accentColor={hexColor}
                />
            )}
        </div>
    );
}