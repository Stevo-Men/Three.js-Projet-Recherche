import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import * as THREE from 'three';
import { SLIDES } from '../data';

// ─── Code snippets ────────────────────────────────────────────────────────────
const CODE_INIT = `// 1. Scene
const scene = new THREE.Scene();

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  75,   // champ de vision (degrés)
  window.innerWidth / window.innerHeight,
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

const CODE_MATERIAL = `// Géométrie + Matériau → Mesh
const geometry = new THREE.SphereGeometry(1, 1, 1);

const chromeMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0xffffff),
  roughness: 0.05,
  metalness: 1.0,
  envMapIntensity: 2.0,
});

const sphere = new THREE.Mesh(geometry, chromeMat);
scene.add(sphere);

// Lumière directionnelle
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

// Boucle de rendu avec animation
renderer.setAnimationLoop(() => {
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
});`;

// ─── Canvas code renderer ─────────────────────────────────────────────────────
function createCodeTexture(code, accentHex = '#ffaa00') {
    const W = 640, H = 480;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

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
    const dots = [['#ff5f57', 14], ['#ffbd2e', 32], ['#28c940', 50]];
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
    lines.forEach((line, i) => {
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
                ctx.fillText(m[0], x, y);
                x += ctx.measureText(m[0]).width;
                remaining = remaining.slice(m[0].length);
                continue;
            }

            // Decimal numbers
            if (/^\d/.test(remaining)) {
                const m = remaining.match(/^\d+(\.\d+)?/);
                ctx.fillStyle = C.number;
                ctx.fillText(m[0], x, y);
                x += ctx.measureText(m[0]).width;
                remaining = remaining.slice(m[0].length);
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

// ─── Floating code screen ─────────────────────────────────────────────────────
function CodeScreen({ code, visible, position = [0, 0, 0], rotation = [0, 0, 0] }) {
    const meshRef = useRef();
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
            <planeGeometry args={[3.5, 2.625]} />
            <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
        </mesh>
    );
}

// ─── Floating logo screen ─────────────────────────────────────────────────────
function LogoScreen({ visible, position = [0, 0, 0], rotation = [0, 0, 0] }) {
    const texture = useTexture('/images/threejs_logo.png');

    if (!visible) return null;

    const aspect = texture.image ? texture.image.width / texture.image.height : 1.5;
    let logoHeight = 1.4;
    let logoWidth = logoHeight * aspect;
    if (logoWidth > 3.2) { logoWidth = 3.2; logoHeight = logoWidth / aspect; }

    return (
        <group position={position} rotation={rotation}>
            <mesh>
                <planeGeometry args={[3.5, 2.625]} />
                <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[logoWidth, logoHeight]} />
                <meshBasicMaterial map={texture} transparent />
            </mesh>
        </group>
    );
}

// ─── Demo torus — live result of the code snippet ─────────────────────────────
function DemoCube({ visible, showMaterials, showLights, position = [0, 0.8, 0.94] }) {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current && visible) {
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
        }
    });

    if (!visible) return null;

    return (
        <group position={position}>
            {showLights && (
                <group>
                    <directionalLight position={[5, 5, 5]} intensity={1.8} color="#ffffff" />
                    <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#ffaa44" />
                </group>
            )}
            <mesh ref={meshRef}>

                {showMaterials ? (
                    <meshStandardMaterial color={0xffaa00} roughness={0.3} metalness={0.1} />
                ) : (
                    <meshBasicMaterial color={0xffaa00} wireframe />
                )}
            </mesh>
        </group>
    );
}

// ─── Main ThreeJSScene ────────────────────────────────────────────────────────
export function ThreeJSScene({ activeSlide, activeEffects = {} }) {
    const hx = SLIDES[6].hx;
    const { scene, materials } = useGLTF('/models/car_lowpoly/scene.gltf');
    const groundRef = useRef();

    // Code / logo screens (slides 6–10)
    const showLogo = activeSlide === 6;
    const showCode1 = activeSlide === 7;   // Scene / Camera / Renderer
    const showCode2 = activeSlide === 8;   // Geometry + Mesh
    const showCodeMat = activeSlide === 9 || activeSlide === 10;   // Material & Lights code
    const showCube = activeSlide >= 7 && activeSlide <= 10;

    // Car state
    const showMaterials = activeSlide >= 9;
    const showLights = activeSlide >= 10;

    // Fix wheel texture wrapping on mount


    // Toggle wireframe ↔ full materials on the car
    useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.isMesh) {
                    if (!child.userData.originalMaterial) {
                        child.userData.originalMaterial = child.material;
                    }
                    if (!showMaterials) {
                        if (!child.userData.wireframeMaterial) {
                            child.userData.wireframeMaterial = new THREE.MeshBasicMaterial({
                                color: hx, wireframe: true, transparent: true, opacity: 0.15
                            });
                        }
                        child.material = child.userData.wireframeMaterial;
                    } else {
                        child.material = child.userData.originalMaterial;
                    }
                }
            });
        }
    }, [scene, showMaterials, hx]);

    // Scroll ground + animate wheel textures
    useFrame((state, delta) => {
        if (groundRef.current) {
            groundRef.current.position.x -= delta * 5.0;
            if (groundRef.current.position.x <= -0.5) groundRef.current.position.x += 0.5;
        }
        if (materials) {
            Object.values(materials).forEach(mat => {
                if ((mat.name.includes('pneu') || mat.name.includes('material_0')) && mat.map) {
                    mat.map.offset.y -= delta * 1.5;
                    mat.map.needsUpdate = true;
                }
            });
        }
    });

    // Shared position / rotation for all floating screens
    const SCREEN_POS = [0, 1.6, -1];
    const SCREEN_ROT = [0, 0, 0];

    return (
        <group position={[70, -1, 0]}>
            {/* Scrolling wireframe ground */}
            <group position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh ref={groundRef}>
                    <planeGeometry args={[20, 20, 40, 40]} />
                    <meshBasicMaterial color={hx} wireframe transparent opacity={0.15} />
                </mesh>
            </group>

            {/* Holographic screens — float left of the car */}
            <LogoScreen visible={showLogo} position={SCREEN_POS} rotation={SCREEN_ROT} />
            <CodeScreen code={CODE_INIT} visible={showCode1} position={SCREEN_POS} rotation={SCREEN_ROT} />
            <CodeScreen code={CODE_OBJECTS} visible={showCode2} position={SCREEN_POS} rotation={SCREEN_ROT} />
            <CodeScreen code={CODE_MATERIAL} visible={showCodeMat} position={SCREEN_POS} rotation={SCREEN_ROT} />

            {/* Demo torus — live result of the code, floats right of car */}
            <DemoCube
                visible={showCube}
                showMaterials={showMaterials}
                showLights={showMaterials}
                position={[0, -0.9, -1]}
            />

            {/* Car + lights */}
            <Select enabled={!!activeEffects.outline}>
                <group>
                    {showLights && (
                        <>
                            <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#ffffff" />

                            {/* Phare Gauche */}
                            <spotLight position={[2.9, 0.15, 0.6]} angle={0.4} penumbra={0.3} intensity={80} distance={25} color="#bbddff">
                                <object3D attach="target" position={[10, 0.15, 2]} />
                            </spotLight>
                            <mesh position={[2.9, 0.15, 0.6]} rotation={[0, Math.PI / 2, 0]}>
                                <circleGeometry args={[0.1, 16]} />
                                <meshBasicMaterial color="#ffffff" />
                            </mesh>

                            {/* Phare Droit */}
                            <spotLight position={[2.9, 0.15, -0.6]} angle={0.4} penumbra={0.3} intensity={80} distance={25} color="#bbddff">
                                <object3D attach="target" position={[10, 0.15, -2]} />
                            </spotLight>
                            <mesh position={[2.9, 0.15, 0.6]} rotation={[0, Math.PI / 2, 0]}>
                                <circleGeometry args={[0.1, 16]} />
                                <meshBasicMaterial color="#ffffff" />
                            </mesh>

                            {/* Faisceaux volumétriques */}
                            <mesh position={[5.1, 0.15, 1.2]} rotation={[0, -0.15, Math.PI / 2]}>
                                <coneGeometry args={[2.5, 8, 32, 1, true]} />
                                <shaderMaterial
                                    transparent depthWrite={false}
                                    blending={THREE.AdditiveBlending}
                                    side={THREE.DoubleSide}
                                    uniforms={{ color: { value: new THREE.Color('#bbddff') } }}
                                    vertexShader={`
                                        varying vec3 vNormal;
                                        varying vec3 vViewPosition;
                                        varying float vY;
                                        void main() {
                                            vY = position.y;
                                            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                                            vViewPosition = -mvPosition.xyz;
                                            vNormal = normalMatrix * normal;
                                            gl_Position = projectionMatrix * mvPosition;
                                        }
                                    `}
                                    fragmentShader={`
                                        uniform vec3 color;
                                        varying vec3 vNormal;
                                        varying vec3 vViewPosition;
                                        varying float vY;
                                        void main() {
                                            vec3 normal = normalize(vNormal);
                                            vec3 viewDir = normalize(vViewPosition);
                                            float edgeFade = pow(abs(dot(normal, viewDir)), 1.5);
                                            float lengthFade = pow(smoothstep(-4.0, 4.0, vY), 1.5);
                                            float alpha = edgeFade * lengthFade * 0.5;
                                            gl_FragColor = vec4(color, alpha);
                                        }
                                    `}
                                />
                            </mesh>
                            <mesh position={[5.1, 0.15, -1.2]} rotation={[0, 0.15, Math.PI / 2]}>
                                <coneGeometry args={[2.5, 8, 32, 1, true]} />
                                <shaderMaterial
                                    transparent depthWrite={false}
                                    blending={THREE.AdditiveBlending}
                                    side={THREE.DoubleSide}
                                    uniforms={{ color: { value: new THREE.Color('#bbddff') } }}
                                    vertexShader={`
                                        varying vec3 vNormal;
                                        varying vec3 vViewPosition;
                                        varying float vY;
                                        void main() {
                                            vY = position.y;
                                            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                                            vViewPosition = -mvPosition.xyz;
                                            vNormal = normalMatrix * normal;
                                            gl_Position = projectionMatrix * mvPosition;
                                        }
                                    `}
                                    fragmentShader={`
                                        uniform vec3 color;
                                        varying vec3 vNormal;
                                        varying vec3 vViewPosition;
                                        varying float vY;
                                        void main() {
                                            vec3 normal = normalize(vNormal);
                                            vec3 viewDir = normalize(vViewPosition);
                                            float edgeFade = pow(abs(dot(normal, viewDir)), 1.5);
                                            float lengthFade = pow(smoothstep(-4.0, 4.0, vY), 1.5);
                                            float alpha = edgeFade * lengthFade * 0.5;
                                            gl_FragColor = vec4(color, alpha);
                                        }
                                    `}
                                />
                            </mesh>
                        </>
                    )}
                    <primitive object={scene} scale={[0.3, 0.3, 0.3]} position={[1, 0, 0]} />
                </group>
            </Select>
        </group>
    );
}

useGLTF.preload('/models/car_lowpoly/scene.gltf');
useTexture.preload('/images/threejs_logo.png');
