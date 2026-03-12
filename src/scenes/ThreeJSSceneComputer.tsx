import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import * as THREE from 'three';

// ─── Code snippets ────────────────────────────────────────────────────────────
const CODE_INIT = `// 1. Scene
const scene = new THREE.Scene();

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  75,   // champ de vision (degrés)
  window.innerWidth / window.innerHeight, // ratio d'aspect
  0.1,  // plan proche
  1000  // plan lointain
);
camera.position.z = 5;

// 3. Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(
  window.innerWidth,
  window.innerHeight
);
document.body.appendChild(renderer.domElement);
`;




const CODE_OBJECTS = `// Géométrie + Matériau → Mesh
const geometry = new THREE.TorusGeometry(2.0, 0.05, 16, 100);

const material = new THREE.MeshStandardMaterial({
  color: 0xffaa00,
  roughness: 0.3,
  metalness: 0.1
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Lumière directionnelle
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

// Boucle de rendu avec animation
renderer.setAnimationLoop(() => {
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  renderer.render(scene, camera);
});`;



// ─── Canvas code renderer ─────────────────────────────────────────────────────
function createCodeTexture(code: string, accentHex = '#ffaa00') {
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

    // Code rendering
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
        property: '#e3b341',
        punctuation: '#c9d1d9',
        text: '#e6edf3',
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
        const trimmed = line.trimStart();
        if (trimmed.startsWith('//')) {
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

            // Hex numbers (0x...)
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

// ─── Code Screen plane ────────────────────────────────────────────────────────
function CodeScreen({ code, visible, position = [0, 0, 0], rotation = [-0.12, 0, 0] }: { code: string, visible: boolean, position?: [number, number, number], rotation?: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh<any, any>>(null);

    const texture = useMemo(() => {
        if (!code) return null;
        return createCodeTexture(code);
    }, [code]);

    useEffect(() => {
        return () => { if (texture) texture.dispose(); };
    }, [texture]);

    if (!visible || !texture) return null;

    return (
        <mesh ref={meshRef} position={position} rotation={rotation}>
            <planeGeometry args={[2.0, 1.5]} />
            <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
        </mesh>
    );
}

// ─── Logo Screen plane ────────────────────────────────────────────────────────
function LogoScreen({ visible, position = [0, 0, 0], rotation = [-0.12, 0, 0] }: { visible: boolean, position?: [number, number, number], rotation?: [number, number, number] }) {
    const texture = useTexture('/images/threejs_logo.png');
    const groupRef = useRef<THREE.Group>(null);

    if (!visible || !texture) return null;

    // Calculate original aspect ratio to avoid stretching
    const textureImage = texture.image as { width: number, height: number } | undefined;
    const aspect = textureImage ? textureImage.width / textureImage.height : 1.5;

    // Screen is 2.0 x 1.5 (WxH), so we constrain the logo inside it
    let logoHeight = 0.8;
    let logoWidth = logoHeight * aspect;

    if (logoWidth > 1.8) {
        logoWidth = 1.8;
        logoHeight = logoWidth / aspect;
    }

    return (
        <group ref={groupRef} position={position} rotation={rotation}>
            {/* Black background matching standard screen size */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[2.0, 1.5]} />
                <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
            </mesh>
            {/* Centered logo */}
            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[logoWidth, logoHeight]} />
                <meshBasicMaterial map={texture} transparent={true} />
            </mesh>
        </group>
    );
}

// ─── Demo Torus — represents the "Mesh" added in the code ─────────────────────
function DemoCube({ visible, showMaterials, showLights }: { visible: boolean, showMaterials: boolean, showLights: boolean }) {
    const meshRef = useRef<THREE.Mesh<any, any>>(null);

    useFrame((state) => {
        if (meshRef.current && visible) {
            const t = state.clock.elapsedTime;
            // Wobble on X and Z while spinning on Y to create a "crossed loops" flip

            meshRef.current.rotation.y = t * 1;

        }
    });

    if (!visible) return null;

    return (
        <group position={[0, 0.8, 0.94]}>
            {showLights && (
                <group position={[-0.1, -0.55, -0.94]}>
                    <directionalLight position={[5, 5, 5]} intensity={1.8} color="#ffffff" />
                    <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#ffaa44" />
                </group>
            )}
            <mesh ref={meshRef}>
                <torusGeometry args={[2.0, 0.05, 16, 100]} />
                {showMaterials ? (
                    <meshStandardMaterial
                        color={0xffaa00}
                        roughness={0.3}
                        metalness={0.1}
                    />
                ) : (
                    <meshBasicMaterial color={0xffaa00} wireframe />
                )}
            </mesh>
        </group>
    );
}

// ─── Main ThreeJSScene ────────────────────────────────────────────────────────
export function ThreeJSScene({ activeSlide, activeEffects = {} }: { activeSlide: number, activeEffects?: Record<string, boolean> }) {
    const { scene } = useGLTF('/models/computer/scene.gltf');

    // Slide 6 = Three.js 1st slide: logo
    const showLogo = activeSlide === 6;
    // Slide 7 = Three.js 2nd slide: intro Scene/Camera/Renderer code
    const showCode1 = activeSlide === 7;
    // Slide 8+ = Three.js 3rd slide onward: object-creation code + demo cube
    const showCode2 = activeSlide >= 8;
    const showCube = activeSlide >= 8;
    // Slide 9+ = Matériaux
    const showMaterials = activeSlide >= 9;
    // Slide 10+ = Lumières
    const showLights = activeSlide >= 10;

    return (
        <group position={[70, -1, 0]}>
            {/* Always-on ambient for the computer model */}
            <ambientLight intensity={0.9} />
            <directionalLight position={[3, 4, 5]} intensity={0.6} color="#ffffff" />

            {/* Group computer and screens so they rotate together */}
            <group position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
                {/* Computer model
                      Raw bbox: Y max ~1927 units, Z max ~738 units
                      scale 0.003 → max height ~5.8 u, front face Z ≈ 738×0.003 = 2.21
                      local Y centre ≈ -467.5 → position.y = +1.4 to compensate         */}
                <Select enabled={!!activeEffects.outline}>
                    <primitive
                        object={scene}
                        scale={[0.003, 0.003, 0.003]}
                    />
                </Select>

                {/* Logo screen — slide 6: intro */}
                <LogoScreen
                    visible={showLogo}
                    position={[0.1, 0.55, 0.94]}
                />

                {/* Code screen — ON the monitor face (z ≈ 2.25, y ≈ 0.5) */}
                <CodeScreen
                    code={CODE_INIT}
                    visible={showCode1}
                    position={[0.1, 0.55, 0.94]}
                />

                {/* Code screen — slide 8+: adding objects + render loop */}
                <CodeScreen
                    code={CODE_OBJECTS}
                    visible={showCode2}
                    position={[0.1, 0.55, 0.94]}
                />
            </group>

            {/* Rotating demo cube — appears from slide 8 */}
            <DemoCube
                visible={showCube}
                showMaterials={showMaterials}
                showLights={showLights}
            />
        </group>
    );
}

useGLTF.preload('/models/computer/scene.gltf');
useTexture.preload('/images/threejs_logo.png');
