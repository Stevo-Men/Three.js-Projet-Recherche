
// ─── Body text size tokens ─────────────────────────────────────────────────────
const BODY_SIZES = {
    xs: 'clamp(0.68rem, 0.88vw, 0.80rem)',
    sm: 'clamp(0.76rem, 1.0vw, 0.90rem)',
    md: 'clamp(0.85rem, 1.2vw, 1.05rem)',
    lg: 'clamp(1.0rem, 1.4vw, 1.2rem)',
    xl: 'clamp(1.5rem, 2.8vw, 2.5rem)',
};

export default function BodyContent({ body, bodyStyle = {}, isVisible, accentColor }: { body: string, bodyStyle?: { fontSize?: string, lineHeight?: number }, isVisible: boolean, accentColor: string }) {
    if (!body) return null;
    const { fontSize = 'md', lineHeight = 1.65 } = bodyStyle;
    const blocks = body.split('\n\n').map(b => b.trim()).filter(Boolean);
    let animIdx = 0;

    return (
        <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: BODY_SIZES[fontSize as keyof typeof BODY_SIZES] || BODY_SIZES.md,
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

                // Section heading: lone # line
                if (lines.length === 1 && lines[0].startsWith('# ')) {
                    const idx = animIdx++;
                    return (
                        <div key={bi} style={{
                            marginTop: bi > 0 ? '12px' : '0',
                            marginBottom: '2px',
                            fontSize: '1.2em',
                            fontWeight: 800,
                            letterSpacing: '0.1em',
                            color: accentColor || 'rgba(255,255,255,0.6)',
                            opacity: isVisible ? 1 : 0,
                            transition: `opacity 0.45s ease ${0.18 + idx * 0.06}s`
                        }}>
                            {lines[0].slice(2)}
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
