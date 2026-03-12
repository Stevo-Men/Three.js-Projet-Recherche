import * as THREE from 'three';

// ─── Canvas code renderer ─────────────────────────────────────────────────────
export function createCodeTexture(code: string, accentHex = '#ffaa00') {
    const W = 640, H = 480;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Subtle border glow
    ctx.strokeStyle = accentHex + '33';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    // Title bar
    ctx.fillStyle = '#161b22';
    ctx.fillRect(0, 0, W, 32);

    // macOS-like window dots
    const dots: [string, number][] = [['#ff5f57', 14], ['#ffbd2e', 32], ['#28c940', 50]];
    dots.forEach(([color, x]) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, 16, 6, 0, Math.PI * 2);
        ctx.fill();
    });

    // Filename
    ctx.fillStyle = '#8b949e';
    ctx.font = '12px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('scene.js', W / 2, 21);
    ctx.textAlign = 'left';

    // Line numbers column
    ctx.fillStyle = '#161b22';
    ctx.fillRect(0, 32, 38, H - 32);
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(38, 32);
    ctx.lineTo(38, H);
    ctx.stroke();

    const LINE_H = 20;
    const MARGIN_X = 48;
    const MARGIN_Y = 54;
    const FONT_SIZE = 12;

    ctx.font = `${FONT_SIZE}px "Courier New", Courier, monospace`;

    const KEYWORDS = [
        'const', 'let', 'var', 'new', 'function', 'return',
        'if', 'else', 'for', 'while', 'import', 'from',
        'true', 'false', 'null', 'undefined'
    ];

    const C = {
        keyword: '#ff7b72',
        string: '#a5d6ff',
        number: '#79c0ff',
        comment: '#6e7681',
        threejs: '#d2a8ff',
        text: '#e6edf3',
        punctuation: '#c9d1d9',
        linenum: '#3d444d',
    };

    const lines = code.split('\n');
    lines.forEach((line: string, i: number) => {
        const y = MARGIN_Y + i * LINE_H;
        if (y > H - 6) return;

        // Line number
        ctx.fillStyle = C.linenum;
        ctx.font = `${FONT_SIZE - 1}px "Courier New", Courier, monospace`;
        ctx.textAlign = 'right';
        ctx.fillText(String(i + 1), 32, y);
        ctx.textAlign = 'left';
        ctx.font = `${FONT_SIZE}px "Courier New", Courier, monospace`;

        // Comment line
        if (line.trimStart().startsWith('//')) {
            ctx.fillStyle = C.comment;
            ctx.fillText(line, MARGIN_X, y);
            return;
        }

        let x = MARGIN_X;
        let remaining = line;

        while (remaining.length > 0) {
            // THREE.Something
            if (remaining.startsWith('THREE.')) {
                const m = remaining.match(/^THREE\.\w+/);
                if (m) {
                    ctx.fillStyle = C.threejs;
                    ctx.fillText(m[0], x, y);
                    x += ctx.measureText(m[0]).width;
                    remaining = remaining.slice(m[0].length);
                    continue;
                }
            }

            // Keywords
            let matched = false;
            for (const kw of KEYWORDS) {
                if (new RegExp(`^${kw}(?=[^a-zA-Z0-9_]|$)`).test(remaining)) {
                    ctx.fillStyle = C.keyword;
                    ctx.fillText(kw, x, y);
                    x += ctx.measureText(kw).width;
                    remaining = remaining.slice(kw.length);
                    matched = true;
                    break;
                }
            }
            if (matched) continue;

            // Hex numbers (0x…)
            if (/^0x[0-9a-fA-F]+/.test(remaining)) {
                const m = remaining.match(/^0x[0-9a-fA-F]+/);
                ctx.fillStyle = C.number;
                ctx.fillText(m![0], x, y);
                x += ctx.measureText(m![0]).width;
                remaining = remaining.slice(m![0].length);
                continue;
            }

            // Decimal numbers
            if (/^\d/.test(remaining)) {
                const m = remaining.match(/^\d+(\.\d+)?/);
                ctx.fillStyle = C.number;
                ctx.fillText(m![0], x, y);
                x += ctx.measureText(m![0]).width;
                remaining = remaining.slice(m![0].length);
                continue;
            }

            // Strings
            if (remaining[0] === '"' || remaining[0] === "'") {
                const q = remaining[0];
                const end = remaining.indexOf(q, 1);
                const str = end > 0 ? remaining.slice(0, end + 1) : q;
                ctx.fillStyle = C.string;
                ctx.fillText(str, x, y);
                x += ctx.measureText(str).width;
                remaining = remaining.slice(str.length);
                continue;
            }

            // Default character
            const ch = remaining[0];
            ctx.fillStyle = ['(', ')', '{', '}', '[', ']', ',', ';', '.'].includes(ch)
                ? C.punctuation : C.text;
            ctx.fillText(ch, x, y);
            x += ctx.measureText(ch).width;
            remaining = remaining.slice(1);
        }
    });

    return new THREE.CanvasTexture(canvas);
}
