
// ─── Effects config ────────────────────────────────────────────────────────────
export const EFFECTS = [
    { key: 'bloom', label: 'Bloom', desc: 'Luminous glow on bright areas' },
    { key: 'dof', label: 'Depth of Field', desc: 'Bokeh lens blur' },
    { key: 'chromatic', label: 'Chromatic', desc: 'RGB channel split' },
    { key: 'glitch', label: 'Glitch', desc: 'Digital signal corruption' },

    { key: 'vignette', label: 'Vignette', desc: 'Cinematic edge darkening' },
];

export default function EffectsPanel({ activeEffects, toggleEffect, accentColor }: { activeEffects: Record<string, boolean>, toggleEffect: (key: string) => void, accentColor: string }) {
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
