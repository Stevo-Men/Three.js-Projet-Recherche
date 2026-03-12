// Simple syntax highlighter for Three.js/JS snippets
const HighlightedLine = ({ line }: { line: string }) => {
    if (line.trim() === '') return <span>{' '}</span>;
    if (line.trimStart().startsWith('//')) {
        return <span style={{ color: '#6a9955' }}>{line}</span>;
    }

    const keywords = new Set(['const', 'let', 'var', 'new', 'return', 'if', 'for', 'while', 'function']);
    const classes = new Set(['Scene', 'PerspectiveCamera', 'WebGLRenderer', 'TorusGeometry', 'SphereGeometry', 'MeshStandardMaterial', 'MeshBasicMaterial', 'Mesh', 'AmbientLight', 'DirectionalLight', 'PointLight', 'Color']);

    // Single regex to safely split code into parseable tokens
    const tokenRegex = /(=>|\/\/.*|'[^']*'|"[^"]*"|\b(?:const|let|var|new|return|if|for|while|function)\b|\bTHREE\b|\b(?:Scene|PerspectiveCamera|WebGLRenderer|TorusGeometry|SphereGeometry|MeshStandardMaterial|MeshBasicMaterial|Mesh|AmbientLight|DirectionalLight|PointLight|Color)\b|\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?\b|\.[a-zA-Z_]\w*)/g;

    const parts = line.split(tokenRegex);

    return (
        <>
            {parts.map((part, i) => {
                if (!part) return null;
                if (part.startsWith('//')) return <span key={i} style={{ color: '#6a9955' }}>{part}</span>;
                if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) return <span key={i} style={{ color: '#ce9178' }}>{part}</span>;
                if (keywords.has(part)) return <span key={i} style={{ color: '#c586c0' }}>{part}</span>;
                if (part === '=>') return <span key={i} style={{ color: '#c586c0' }}>{part}</span>;
                if (part === 'THREE') return <span key={i} style={{ color: '#4fc1ff' }}>{part}</span>;
                if (classes.has(part)) return <span key={i} style={{ color: '#4ec9b0' }}>{part}</span>;
                if (/^0x[0-9a-fA-F]+$/.test(part) || /^\d+(\.\d+)?$/.test(part)) return <span key={i} style={{ color: '#b5cea8' }}>{part}</span>;
                if (part.startsWith('.')) return <span key={i}>.<span style={{ color: '#dcdcaa' }}>{part.slice(1)}</span></span>;

                return <span key={i}>{part}</span>;
            })}
        </>
    );
};

// ─── IDE-style code panel ──────────────────────────────────────────────────────
export default function CodePanel({ code, isVisible, accentColor }: { code: string, isVisible: boolean, accentColor: string }) {
    if (!code) return null;

    return (
        <div style={{
            borderLeft: `1px solid ${accentColor}55`,
            paddingLeft: '20px',
        }}>
            <div style={{
                padding: '10px 0',
            }}>
                {code.split('\n').map((line: string, li: number) => (
                    <div
                        key={li}
                        style={{
                            display: 'flex',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 'clamp(0.9rem, 1.1vw, 1.2rem)',
                            lineHeight: 1.7,
                            opacity: isVisible ? 1 : 0,
                            transition: `opacity 0.35s ease ${0.4 + li * 0.03}s`,
                        }}
                    >
                        {/* Line number */}
                        <span style={{
                            width: '40px',
                            flexShrink: 0,
                            textAlign: 'right',
                            paddingRight: '14px',
                            color: `${accentColor}55`,
                            fontSize: '0.8em',
                            userSelect: 'none',
                        }}>
                            {li + 1}
                        </span>
                        {/* Code content with Syntax Highlighting */}
                        <span
                            style={{
                                paddingRight: '16px',
                                whiteSpace: 'pre',
                                color: 'rgba(255,255,255,0.9)', // Default text color
                            }}
                        >
                            <HighlightedLine line={line} />
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
