import React, { useEffect, useState } from 'react';
import { SLIDES, SLIDE_COPY, POSITIONS } from './data';
import './style.css';

import BodyContent from './components/BodyContent';
import EffectsPanel from './components/EffectsPanel';
import CodePanel from './components/CodePanel';

// ─── Structured body renderer ──────────────────────────────────────────────────
// Format conventions for body strings in data.js:
//   ## Heading text   → accent-colored label (no ## in output)
//   # Heading text   → accent-colored label (no ## in output)
//   • item / - item   → bullet point
//   plain text        → paragraph
//   \n\n              → block separator

// ─── Main HUD ──────────────────────────────────────────────────────────────────
export function HUD({ activeSlide, activeEffects, toggleEffect }: { activeSlide: number, activeEffects: Record<string, boolean>, toggleEffect: (key: string) => void }) {
    const [isVisible, setIsVisible] = useState(false);
    const [content, setContent] = useState<any>(null);

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
    const isCenter = pos.side === 'center';
    const color = slide.color;
    const hexColor = typeof color === 'number' ? `#${color.toString(16).padStart(6, '0')}` : color;
    const isThreeJS = slide.sceneId === 4;

    const panelClasses = `sc-panel ${isCenter ? 'sc-center' : isRight ? 'sc-right' : 'sc-left'} ${isVisible ? 'sc-visible' : 'sc-hidden'}`;

    let sideStyles = {};
    if (isCenter) {
        sideStyles = { left: '50%', transform: 'translateX(-50%)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' };
    } else if (isRight) {
        sideStyles = { right: 'clamp(80px, 7vw, 110px)' };
    } else {
        sideStyles = { left: 'clamp(32px, 5vw, 64px)' };
    }

    const panelStyles: React.CSSProperties = {
        position: 'absolute' as const,
        top: pos.top,
        ...sideStyles,
        maxWidth: pos.width || (isCenter ? '900px' : '560px')
    };

    // Table/Code panels can define their own positions, otherwise fallback to right side
    const tablePos = pos.tablePos || { side: 'right', top: '18%' };
    const codePos = pos.codePos || { side: 'right', top: '12%' };

    const getPanelStyles = (p: any, defaultMaxWidth: string) => {
        const isR = p.side === 'right';
        const isC = p.side === 'center';
        let sStyles = {};
        if (isC) sStyles = { left: '50%', transform: 'translateX(-50%)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' };
        else if (isR) sStyles = { right: 'clamp(40px, 4vw, 80px)' };
        else sStyles = { left: 'clamp(40px, 4vw, 80px)' };

        return {
            position: 'absolute' as const,
            top: p.top,
            ...sStyles,
            maxWidth: defaultMaxWidth,
            width: 'clamp(360px, 35vw, 580px)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.55s ease 0.3s',
        };
    };

    // BodyContent

    return (
        <div className="sc-wrap" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 50 }}>
            <div className={panelClasses} style={panelStyles}>
                <div className="sc-inner" style={{
                    borderColor: `${hexColor}55`,
                    transition: 'border-color 0.45s ease',
                    ...(isCenter ? { borderLeft: 'none', paddingLeft: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' } : { borderLeftStyle: 'solid', borderLeftWidth: '1px', paddingLeft: '20px' })
                }}>

                    <div className="sc-eyebrow" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(0.55rem, 0.9vw, 0.68rem)', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: '18px', marginTop: '18px', lineHeight: 1 }}>
                        {copy.eyebrow || slide.subject.toUpperCase()}
                    </div>

                    <div className="sc-title-row" style={{ display: 'flex', alignItems: 'baseline', justifyContent: isCenter ? 'center' : 'flex-start', gap: '14px', marginBottom: '22px' }}>
                        <span className="sc-num" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(0.72rem, 1.1vw, 0.84rem)', fontWeight: 300, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.28)', flexShrink: 0, paddingTop: '0.15em' }}>
                            0{slide.subjectNum}
                        </span>
                        <h2 className="sc-title" style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4.2vw, 3.4rem)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.0, margin: 0, transition: 'color 0.45s ease', color: hexColor }}>
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
                            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#fff'; (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.55)'; }}
                            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = hexColor; (e.target as HTMLElement).style.borderColor = `${hexColor}44`; }}
                            onClick={() => { if (copy.ctaLink) window.open(copy.ctaLink, '_blank'); }}
                        >
                            {copy.cta}
                        </button>
                    )}
                </div>
            </div>

            {/* Effects panel */}
            {isThreeJS && (
                <EffectsPanel
                    activeEffects={activeEffects}
                    toggleEffect={toggleEffect}
                    accentColor={hexColor}
                />
            )}

            {/* Data table panel */}
            {copy.table && (
                <div
                    className={`sc-panel ${isVisible ? 'sc-visible' : 'sc-hidden'}`}
                    style={{ ...getPanelStyles(tablePos, '640px'), transitionDelay: '0.35s' }}
                >
                    <div style={{
                        borderLeft: `1px solid ${hexColor}55`,
                        paddingLeft: '20px',
                    }}>
                        <div style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 'clamp(0.65rem, 1vw, 0.78rem)',
                            fontWeight: 400,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase' as const,
                            color: 'rgba(255,255,255,0.38)',
                            marginBottom: '14px',
                        }}>

                        </div>

                        <table style={{
                            borderCollapse: 'collapse',
                            width: '100%',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 'clamp(0.78rem, 1.1vw, 0.95rem)',
                        }}>
                            <thead>
                                <tr>
                                    {copy.table.headers.map((h: string, hi: number) => (
                                        <th key={hi} style={{
                                            textAlign: 'left',
                                            padding: '8px 14px',
                                            borderBottom: `1px solid ${hexColor}55`,
                                            color: hexColor,
                                            fontWeight: 600,
                                            letterSpacing: '0.08em',
                                            fontSize: '0.9em',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {copy.table.rows.map((row: string[], ri: number) => (
                                    <tr
                                        key={ri}
                                        style={{
                                            opacity: isVisible ? 1 : 0,
                                            transition: `opacity 0.45s ease ${0.45 + ri * 0.1}s`,
                                        }}
                                    >
                                        {row.map((cell: string, ci: number) => (
                                            <td key={ci} style={{
                                                padding: '10px 14px',
                                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                                                color: ci === 0
                                                    ? hexColor
                                                    : ci === 1
                                                        ? 'rgba(255,255,255,0.55)'
                                                        : 'rgba(255,255,255,0.85)',
                                                fontWeight: ci === 0 ? 600 : 400,
                                                whiteSpace: ci < 2 ? 'nowrap' : 'normal',
                                                lineHeight: 1.5,
                                            }}>
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Code panel */}
            {copy.code && (
                <div
                    className={`sc-panel ${isVisible ? 'sc-visible' : 'sc-hidden'}`}
                    style={getPanelStyles(codePos, '580px')}
                >
                    <div style={{
                        background: 'rgba(18, 18, 24, 0.92)',
                        borderRadius: '8px',
                        border: `1px solid ${hexColor}22`,
                        overflow: 'hidden',
                        backdropFilter: 'blur(12px)',
                        boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 ${hexColor}11`,
                    }}>
                        <CodePanel code={copy.code} isVisible={isVisible} accentColor={hexColor} />
                    </div>
                </div>
            )}
        </div>
    );
}