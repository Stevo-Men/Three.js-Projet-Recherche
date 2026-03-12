import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
   TAB CONFIG — exported so Experience.tsx can render the HTML tab bar
═══════════════════════════════════════════════════════════════════════════ */
export const TABS = [
    { key: 'ecommerce', label: ' E-commerce', accent: '#ff6b6b' },
    { key: 'archi', label: ' Architecture', accent: '#4ecdc4' },
    { key: 'science', label: ' Science', accent: '#45b7d1' },
    { key: 'gaming', label: ' Gaming', accent: '#96ceb4' },
    { key: 'ia', label: 'IA / ML', accent: '#dda0dd' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   FLOAT — Y-axis sine-wave bob, shared by all mini-scenes
═══════════════════════════════════════════════════════════════════════════ */
function Float({ children, speed = 1.0, amplitude = 0.08 }: {
    children: React.ReactNode; speed?: number; amplitude?: number;
}) {
    const ref = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (ref.current) ref.current.position.y = Math.sin(clock.elapsedTime * speed) * amplitude;
    });
    return <group ref={ref}>{children}</group>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PLATFORM — glass disk + glow ring under every mini-scene
═══════════════════════════════════════════════════════════════════════════ */
function Platform({ accent }: { accent: string }) {
    const dimColor = useMemo(() => new THREE.Color(accent).multiplyScalar(0.16), [accent]);
    return (
        <group position={[0, -1.65, 0]}>
            <mesh>
                <cylinderGeometry args={[1.8, 1.8, 0.06, 64]} />
                <meshStandardMaterial color={dimColor} transparent opacity={0.40} roughness={0.05} metalness={0.10} />
            </mesh>
            <mesh rotation-x={Math.PI / 2}>
                <torusGeometry args={[1.82, 0.022, 16, 80]} />
                <meshBasicMaterial color={accent} transparent opacity={0.65} />
            </mesh>
        </group>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 0 — E-COMMERCE SNEAKER  (drag-to-rotate via pointer capture)
═══════════════════════════════════════════════════════════════════════════ */
function EcommerceScene({ accent }: { accent: string }) {
    const groupRef = useRef<THREE.Group>(null);
    const drag = useRef({ active: false, prev: { x: 0, y: 0 }, vel: { x: 0, y: 0 } });
    const ac = useMemo(() => new THREE.Color(accent), [accent]);

    useFrame(() => {
        const g = groupRef.current;
        const d = drag.current;
        if (!g || d.active) return;
        g.rotation.y += d.vel.y;
        g.rotation.x += d.vel.x;
        d.vel.x *= 0.90;
        d.vel.y *= 0.90;
    });

    const handlers = {
        onPointerDown: (e: any) => {
            e.stopPropagation();
            e.target.setPointerCapture(e.pointerId);
            drag.current = { active: true, prev: { x: e.clientX, y: e.clientY }, vel: { x: 0, y: 0 } };
        },
        onPointerMove: (e: any) => {
            if (!drag.current.active || !groupRef.current) return;
            const dx = (e.clientX - drag.current.prev.x) * 0.010;
            const dy = (e.clientY - drag.current.prev.y) * 0.010;
            groupRef.current.rotation.y += dx;
            groupRef.current.rotation.x = Math.max(-1.1, Math.min(1.1, groupRef.current.rotation.x + dy));
            drag.current.vel = { x: dy, y: dx };
            drag.current.prev = { x: e.clientX, y: e.clientY };
        },
        onPointerUp: (e: any) => {
            drag.current.active = false;
            e.target.releasePointerCapture(e.pointerId);
        },
    };

    return (
        <Float speed={1.1} amplitude={0.08}>
            <group ref={groupRef} {...handlers}>
                {/* Invisible hit volume so drag works between parts */}
                <mesh visible={false}>
                    <boxGeometry args={[2, 1.4, 1]} />
                    <meshBasicMaterial />
                </mesh>
                <mesh position={[0, -0.62, 0]}>
                    <boxGeometry args={[1.52, 0.10, 0.55]} />
                    <meshStandardMaterial color="#1e1e1e" roughness={0.95} />
                </mesh>
                <mesh position={[0, -0.50, 0]}>
                    <boxGeometry args={[1.40, 0.14, 0.52]} />
                    <meshStandardMaterial color="#d4d4d4" roughness={0.70} />
                </mesh>
                <mesh position={[0.04, -0.22, 0]}>
                    <boxGeometry args={[1.08, 0.30, 0.46]} />
                    <meshStandardMaterial color={ac} roughness={0.25} metalness={0.15} />
                </mesh>
                <mesh position={[0.60, -0.31, 0]}>
                    <boxGeometry args={[0.36, 0.19, 0.44]} />
                    <meshStandardMaterial color={ac} roughness={0.25} metalness={0.15} />
                </mesh>
                <mesh position={[-0.56, -0.26, 0]}>
                    <boxGeometry args={[0.28, 0.26, 0.44]} />
                    <meshStandardMaterial color="#111111" roughness={0.90} />
                </mesh>
                <mesh position={[0.10, 0.05, 0.24]}>
                    <boxGeometry args={[0.22, 0.50, 0.03]} />
                    <meshStandardMaterial color="#d4d4d4" roughness={0.70} />
                </mesh>
                <mesh position={[-0.10, 0.17, 0]}>
                    <cylinderGeometry args={[0.20, 0.23, 0.09, 20]} />
                    <meshStandardMaterial color={ac} roughness={0.25} />
                </mesh>
                <mesh position={[0, -0.20, 0.24]}>
                    <cylinderGeometry args={[0.07, 0.07, 0.01, 16]} />
                    <meshStandardMaterial color="#d4d4d4" roughness={0.70} />
                </mesh>
                {[0, 1, 2, 3].map(i => (
                    <mesh key={i} position={[-0.22 + i * 0.15, -0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.012, 0.012, 0.44, 6]} />
                        <meshStandardMaterial color="#d4d4d4" roughness={0.70} />
                    </mesh>
                ))}
            </group>
        </Float>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 1 — ARCHITECTURE BUILDING (wireframe overlay, auto-rotate)
═══════════════════════════════════════════════════════════════════════════ */
function ArchScene({ accent }: { accent: string }) {
    const ref = useRef<THREE.Group>(null);
    const solidColor = useMemo(() => new THREE.Color(accent).multiplyScalar(0.22), [accent]);
    useFrame(() => { if (ref.current) ref.current.rotation.y += 0.0025; });

    return (
        <Float speed={0.65} amplitude={0.07}>
            <group ref={ref}>
                {/* Main tower — solid + wireframe overlay */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.88, 2.20, 0.68]} />
                    <meshStandardMaterial color={solidColor} roughness={0.55} metalness={0.25} />
                </mesh>
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.88, 2.20, 0.68]} />
                    <meshBasicMaterial color={accent} wireframe transparent opacity={0.55} />
                </mesh>
                {/* Side tower */}
                <mesh position={[0.60, -0.45, 0]}>
                    <boxGeometry args={[0.40, 1.30, 0.40]} />
                    <meshStandardMaterial color={solidColor} roughness={0.55} metalness={0.25} />
                </mesh>
                <mesh position={[0.60, -0.45, 0]}>
                    <boxGeometry args={[0.40, 1.30, 0.40]} />
                    <meshBasicMaterial color={accent} wireframe transparent opacity={0.55} />
                </mesh>
                {/* Flat roof */}
                <mesh position={[0, 1.15, 0]}>
                    <boxGeometry args={[1.04, 0.09, 0.78]} />
                    <meshStandardMaterial color={solidColor} roughness={0.55} metalness={0.25} />
                </mesh>
                <mesh position={[0, 1.15, 0]}>
                    <boxGeometry args={[1.04, 0.09, 0.78]} />
                    <meshBasicMaterial color={accent} wireframe transparent opacity={0.55} />
                </mesh>
                {/* Windows — 4 rows × 2 cols */}
                {[0, 1, 2, 3].flatMap(row => [0, 1].map(col => (
                    <mesh key={`w${row}${col}`} position={[-0.16 + col * 0.32, -0.75 + row * 0.52, 0.345]}>
                        <planeGeometry args={[0.13, 0.16]} />
                        <meshBasicMaterial color={accent} transparent opacity={0.72} />
                    </mesh>
                )))}
            </group>
        </Float>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 2 — SCIENCE GLOBE (200 pulsing surface markers)
═══════════════════════════════════════════════════════════════════════════ */
function ScienceScene({ accent }: { accent: string }) {
    const ref = useRef<THREE.Group>(null);
    const markerRefs = useRef<(THREE.Mesh | null)[]>([]);
    const solidColor = useMemo(() => new THREE.Color(accent).multiplyScalar(0.12), [accent]);

    const markerData = useMemo(() => Array.from({ length: 200 }, () => ({
        phi: Math.acos(2 * Math.random() - 1),
        theta: 2 * Math.PI * Math.random(),
        phase: Math.random() * Math.PI * 2,
    })), []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (ref.current) ref.current.rotation.y += 0.003;
        markerRefs.current.forEach((m, i) => {
            if (m) m.scale.setScalar(0.55 + 0.75 * (0.5 + 0.5 * Math.sin(t * 2.8 + markerData[i].phase)));
        });
    });

    return (
        <Float speed={0.8} amplitude={0.07}>
            <group ref={ref}>
                <mesh>
                    <sphereGeometry args={[1.0, 48, 48]} />
                    <meshStandardMaterial color={solidColor} roughness={0.10} metalness={0.70} transparent opacity={0.50} />
                </mesh>
                <mesh>
                    <sphereGeometry args={[1.0, 48, 48]} />
                    <meshBasicMaterial color={accent} wireframe transparent opacity={0.12} />
                </mesh>
                {markerData.map((d, i) => (
                    <mesh
                        key={i}
                        ref={el => { markerRefs.current[i] = el; }}
                        position={[
                            1.02 * Math.sin(d.phi) * Math.cos(d.theta),
                            1.02 * Math.cos(d.phi),
                            1.02 * Math.sin(d.phi) * Math.sin(d.theta),
                        ]}
                    >
                        <sphereGeometry args={[0.022, 5, 5]} />
                        <meshBasicMaterial color={accent} />
                    </mesh>
                ))}
            </group>
        </Float>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 3 — GAMING GEMS (icosahedrons bobbing + click-to-burst)
   Particles are managed imperatively to avoid per-frame React re-renders.
═══════════════════════════════════════════════════════════════════════════ */
const GEM_COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#dda0dd', '#ffd93d'];
const GEM_POSITIONS: [number, number, number][] = [
    [-0.90, 0.00, 0.20], [0.90, 0.10, 0.20], [0.00, 0.20, -0.45],
    [-0.50, -0.10, -0.25], [0.55, 0.15, -0.15], [0.05, 0.05, 0.55],
];

function GamingScene() {
    const groupRef = useRef<THREE.Group>(null);
    const partGroup = useRef<THREE.Group>(null);
    const gemRefs = useRef<(THREE.Mesh | null)[]>([]);
    const partGeo = useMemo(() => new THREE.SphereGeometry(0.045, 4, 4), []);
    useEffect(() => () => { partGeo.dispose(); }, [partGeo]);

    const burst = (idx: number) => {
        const gem = gemRefs.current[idx];
        const pg = partGroup.current;
        if (!gem?.userData.alive || !pg) return;
        gem.userData.alive = false;
        gem.visible = false;
        for (let i = 0; i < 20; i++) {
            const mat = new THREE.MeshBasicMaterial({ color: gem.userData.color, transparent: true, opacity: 1 });
            const mesh = new THREE.Mesh(partGeo, mat);
            mesh.position.copy(gem.position);
            mesh.userData = {
                vel: new THREE.Vector3((Math.random() - 0.5) * 0.14, Math.random() * 0.10 + 0.04, (Math.random() - 0.5) * 0.14),
                life: 1.0,
            };
            pg.add(mesh);
        }
        setTimeout(() => { if (gem) { gem.visible = true; gem.userData.alive = true; } }, 2200);
    };

    useFrame(() => {
        const t = performance.now() / 1000;
        if (groupRef.current) groupRef.current.position.y = Math.sin(t * 0.70) * 0.06;
        gemRefs.current.forEach((gem, i) => {
            if (gem?.userData.alive) {
                gem.position.y = GEM_POSITIONS[i][1] + Math.sin(t * gem.userData.speed + gem.userData.phase) * 0.19;
                gem.rotation.y += 0.018;
                gem.rotation.z += 0.010;
            }
        });
        if (!partGroup.current) return;
        const dead: THREE.Mesh[] = [];
        partGroup.current.children.forEach(child => {
            const m = child as THREE.Mesh;
            m.userData.life -= 0.022;
            m.position.addScaledVector(m.userData.vel, 1);
            m.userData.vel.y -= 0.003;
            (m.material as THREE.MeshBasicMaterial).opacity = Math.max(0, m.userData.life);
            m.scale.setScalar(Math.max(0.01, m.userData.life * 1.2));
            if (m.userData.life <= 0) dead.push(m);
        });
        dead.forEach(m => {
            (m.material as THREE.MeshBasicMaterial).dispose();
            partGroup.current!.remove(m);
        });
    });

    return (
        <group ref={groupRef}>
            <group ref={partGroup} />
            {GEM_COLORS.map((color, i) => (
                <mesh
                    key={color}
                    ref={el => { gemRefs.current[i] = el; }}
                    position={GEM_POSITIONS[i]}
                    userData={{ baseY: GEM_POSITIONS[i][1], phase: i * 1.1, speed: 0.80 + i * 0.13, alive: true, color }}
                    onClick={e => { e.stopPropagation(); burst(i); }}
                >
                    <icosahedronGeometry args={[0.26, 1]} />
                    <meshStandardMaterial color={color} roughness={0.05} metalness={0.90} emissive={color} emissiveIntensity={0.35} />
                </mesh>
            ))}
        </group>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 4 — IA / ML NEURAL NETWORK (3 layers, wave-opacity connections)
═══════════════════════════════════════════════════════════════════════════ */
function NNScene({ accent }: { accent: string }) {
    const groupRef = useRef<THREE.Group>(null);
    const neuronRefs = useRef<(THREE.Mesh | null)[]>([]);
    const connMatRefs = useRef<(THREE.LineBasicMaterial | null)[]>([]);
    const ac = useMemo(() => new THREE.Color(accent), [accent]);

    const LAYERS = [4, 6, 4];
    const LAYER_X = [-1.5, 0, 1.5];

    const neurons = useMemo(() =>
        LAYERS.map((count, li) =>
            Array.from({ length: count }, (_, ni) => ({
                pos: new THREE.Vector3(LAYER_X[li], (ni - (count - 1) / 2) * 0.57, 0),
                phase: li * 2.4 + ni * 0.85,
            }))
        ), []);

    const connGeos = useMemo(() => {
        const geos: THREE.BufferGeometry[] = [];
        for (let li = 0; li < LAYERS.length - 1; li++)
            neurons[li].forEach(n1 => neurons[li + 1].forEach(n2 =>
                geos.push(new THREE.BufferGeometry().setFromPoints([n1.pos, n2.pos]))
            ));
        return geos;
    }, [neurons]);

    useEffect(() => () => { connGeos.forEach(g => g.dispose()); }, [connGeos]);

    // Build Line primitives once
    const lineObjects = useMemo(() =>
        connGeos.map((geo, i) => {
            const mat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.10 });
            connMatRefs.current[i] = mat;
            return new THREE.Line(geo, mat);
        }), [connGeos, accent]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(t * 0.90) * 0.07;
            groupRef.current.rotation.y = Math.sin(t * 0.28) * 0.22;
        }
        const flat = neurons.flat();
        neuronRefs.current.forEach((mesh, i) => {
            if (!mesh) return;
            const pulse = 0.5 + 0.5 * Math.sin(t * 2.6 + flat[i].phase);
            (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.30 + pulse * 0.80;
            mesh.scale.setScalar(0.88 + pulse * 0.24);
        });
        connMatRefs.current.forEach((mat, idx) => {
            if (mat) mat.opacity = 0.07 + 0.55 * (0.5 + 0.5 * Math.sin(t * 3.2 + idx * 0.42));
        });
    });

    return (
        <group ref={groupRef}>
            {neurons.flat().map((n, i) => (
                <mesh key={i} ref={el => { neuronRefs.current[i] = el; }} position={n.pos}>
                    <sphereGeometry args={[0.115, 16, 16]} />
                    <meshStandardMaterial color={ac} roughness={0.20} metalness={0.30} emissive={ac} emissiveIntensity={0.40} transparent opacity={0.90} />
                </mesh>
            ))}
            {lineObjects.map((line, i) => (
                <primitive key={i} object={line} />
            ))}
        </group>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SLIDE 13 — LES LIMITES  (caged spheres bouncing against wireframe boxes)
═══════════════════════════════════════════════════════════════════════════ */
const LIMIT_COLORS = ['#ff6b6b', '#ffd93d', '#ff9a3c', '#c44dff', '#45b7d1'];

function LimitsScene() {
    const groupRef = useRef<THREE.Group>(null);
    const sphereRefs = useRef<(THREE.Mesh | null)[]>([]);
    const cageRefs = useRef<(THREE.Mesh | null)[]>([]);

    const cells = useMemo(() => LIMIT_COLORS.map((color, i) => ({
        color,
        cx: ((i % 3) - 1) * 1.32,
        cy: Math.floor(i / 3) * -1.05 + 0.50,
        phase: i * 1.25,
    })), []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (groupRef.current) groupRef.current.position.y = Math.sin(t * 0.60) * 0.06;
        cells.forEach(({ cx, cy, phase }, i) => {
            const sphere = sphereRefs.current[i];
            const cage = cageRefs.current[i];
            const LIMIT = 0.24;
            if (sphere) sphere.position.set(
                cx + Math.max(-LIMIT, Math.min(LIMIT, Math.sin(t * 2.10 + phase) * LIMIT)),
                cy + Math.max(-LIMIT, Math.min(LIMIT, Math.sin(t * 2.70 + phase * 1.5) * LIMIT)),
                0,
            );
            if (cage) { cage.scale.setScalar(1 + 0.035 * Math.sin(t * 3.5 + i)); cage.rotation.y = t * (0.05 + i * 0.02); }
        });
    });

    return (
        <group ref={groupRef}>
            {cells.map(({ color, cx, cy }, i) => (
                <group key={i}>
                    <mesh ref={el => { cageRefs.current[i] = el; }} position={[cx, cy, 0]}>
                        <boxGeometry args={[0.75, 0.75, 0.75]} />
                        <meshBasicMaterial color={0x334466} wireframe transparent opacity={0.45} />
                    </mesh>
                    <mesh ref={el => { sphereRefs.current[i] = el; }} position={[cx, cy, 0]}>
                        <sphereGeometry args={[0.19, 20, 20]} />
                        <meshStandardMaterial color={color} roughness={0.10} metalness={0.50} emissive={color} emissiveIntensity={0.30} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SLIDE 14 — TECHNOLOGIES ÉMERGENTES  (point cloud + glowing core + rays)
═══════════════════════════════════════════════════════════════════════════ */
function FutureScene() {
    const groupRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const pointsRef = useRef<THREE.Points>(null);
    const coreMat = useRef<THREE.MeshStandardMaterial>(null);
    const rayMat = useRef<THREE.LineBasicMaterial>(null);
    const accent = '#2eb8f5';
    const ac = useMemo(() => new THREE.Color(accent), []);

    const ptGeo = useMemo(() => {
        const COUNT = 1500;
        const pos = new Float32Array(COUNT * 3);
        const col = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            const phi = Math.acos(2 * Math.random() - 1), theta = 2 * Math.PI * Math.random();
            const r = 1.20 + (Math.random() - 0.5) * 0.35;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.cos(phi);
            pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
            const c = ac.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.30);
            col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        g.setAttribute('color', new THREE.BufferAttribute(col, 3));
        return g;
    }, [ac]);

    const rayGeo = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i < 12; i++) {
            const phi = Math.acos(2 * Math.random() - 1), theta = 2 * Math.PI * Math.random();
            const dir = new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
            pts.push(dir.clone().multiplyScalar(0.30), dir.clone().multiplyScalar(1.50));
        }
        return new THREE.BufferGeometry().setFromPoints(pts);
    }, []);

    useEffect(() => () => { ptGeo.dispose(); rayGeo.dispose(); }, [ptGeo, rayGeo]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (groupRef.current) groupRef.current.position.y = Math.sin(t * 0.85) * 0.07;
        if (pointsRef.current) { pointsRef.current.rotation.y = t * 0.18; pointsRef.current.rotation.x = t * 0.04; }
        if (coreRef.current) { coreRef.current.rotation.y = t * 0.55; coreRef.current.rotation.z = t * 0.30; }
        if (coreMat.current) coreMat.current.emissiveIntensity = 1.20 + 0.90 * Math.sin(t * 2.5);
        if (rayMat.current) rayMat.current.opacity = 0.15 + 0.30 * Math.sin(t * 3.2);
    });

    return (
        <group ref={groupRef}>
            <points ref={pointsRef}>
                <primitive object={ptGeo} attach="geometry" />
                <pointsMaterial size={0.027} vertexColors transparent opacity={0.88} />
            </points>
            <mesh ref={coreRef}>
                <icosahedronGeometry args={[0.26, 2]} />
                <meshStandardMaterial ref={coreMat} color={accent} roughness={0} metalness={1} emissive={accent} emissiveIntensity={1.5} />
            </mesh>
            <lineSegments>
                <primitive object={rayGeo} attach="geometry" />
                <lineBasicMaterial ref={rayMat} color={accent} transparent opacity={0.40} />
            </lineSegments>
        </group>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT — lives inside the shared R3F Canvas at world x = 100
   Camera pans here via SCENE_OFFSETS[5] = 100, same as every other scene.
═══════════════════════════════════════════════════════════════════════════ */
export function AvenirScene({ activeSlide, activeTab }: { activeSlide: number; activeTab: number }) {
    const isSlide12 = activeSlide === 12;
    const isSlide13 = activeSlide === 13;
    const isSlide14 = activeSlide === 14;
    const accent = isSlide12 ? TABS[activeTab].accent : '#2eb8f5';

    return (
        <group position={[100, 0, 0]}>
            {/* Scoped 3-point lighting for this world region */}
            <ambientLight intensity={0.55} />
            <directionalLight position={[3, 4, 3]} intensity={1.40} color="#fff4cc" />
            <directionalLight position={[-3, 1, -2]} intensity={0.70} color="#aadeff" />

            {/* Platform accent tracks the active tab */}
            <Platform accent={accent} />

            {/* Slide 12 — tab-based mini-scenes (unmount/remount on switch) */}
            {isSlide12 && activeTab === 0 && <EcommerceScene accent={TABS[0].accent} />}
            {isSlide12 && activeTab === 1 && <ArchScene accent={TABS[1].accent} />}
            {isSlide12 && activeTab === 2 && <ScienceScene accent={TABS[2].accent} />}
            {isSlide12 && activeTab === 3 && <GamingScene />}
            {isSlide12 && activeTab === 4 && <NNScene accent={TABS[4].accent} />}

            {/* Slide 13 — Les limites */}
            {isSlide13 && <LimitsScene />}

            {/* Slide 14 — Technologies émergentes */}
            {isSlide14 && <FutureScene />}
        </group>
    );
}
