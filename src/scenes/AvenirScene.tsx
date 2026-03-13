import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
   SLIDE 12 — MORPHING WIREFRAME SHAPE
   Forme en fils de fer qui change doucement :
   fauteuil → globe terrestre → bâtiment → réseau de neurones
═══════════════════════════════════════════════════════════════════════════ */

const MORPH_COUNT = 900;
const HOLD_SEC    = 3.2;   // secondes sur chaque forme
const MORPH_SEC   = 2.4;   // secondes de transition
const WF_COLOR    = '#2eb8f5';
const WF_OPACITY  = 0.55;
const PT_OPACITY  = 0.22;  // particules en fond subtil

/* ── Helpers de génération de positions ───────────────────────────────── */
function sampleBoxSurface(
    w: number, h: number, d: number,
    cx: number, cy: number, cz: number,
): [number, number, number] {
    const areas = [w * h, w * h, w * d, w * d, h * d, h * d];
    const total = areas.reduce((a, b) => a + b, 0);
    let r = Math.random() * total, face = 5, cum = 0;
    for (let i = 0; i < 6; i++) { cum += areas[i]; if (r < cum) { face = i; break; } }
    const u = Math.random() - 0.5, v = Math.random() - 0.5;
    let x = 0, y = 0, z = 0;
    switch (face) {
        case 0: x = u * w; y = v * h; z =  d / 2; break;
        case 1: x = u * w; y = v * h; z = -d / 2; break;
        case 2: x = u * w; y =  h / 2; z = v * d; break;
        case 3: x = u * w; y = -h / 2; z = v * d; break;
        case 4: x =  w / 2; y = u * h; z = v * d; break;
        case 5: x = -w / 2; y = u * h; z = v * d; break;
    }
    return [x + cx, y + cy, z + cz];
}

type BoxDef = { w: number; h: number; d: number; cx: number; cy: number; cz: number; area: number };

function buildMultiBox(parts: BoxDef[], count: number): Float32Array {
    const total = parts.reduce((s, p) => s + p.area, 0);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        let r = Math.random() * total;
        let p = parts[parts.length - 1];
        for (const cp of parts) { if (r < cp.area) { p = cp; break; } r -= cp.area; }
        const [x, y, z] = sampleBoxSurface(p.w, p.h, p.d, p.cx, p.cy, p.cz);
        arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z;
    }
    return arr;
}

function buildMorphShapes(): Float32Array[] {
    const N = MORPH_COUNT;

    /* Forme 0 : Fauteuil */
    const chair = buildMultiBox([
        { w: 1.3,  h: 0.13, d: 1.1,  cx:  0,     cy:  0,     cz:  0,     area: 1.3  * 1.1  },
        { w: 1.3,  h: 1.15, d: 0.13, cx:  0,     cy:  0.60,  cz: -0.49,  area: 1.3  * 1.15 },
        { w: 0.14, h: 0.65, d: 1.1,  cx: -0.58,  cy:  0.35,  cz:  0,     area: 0.65 * 1.1  },
        { w: 0.14, h: 0.65, d: 1.1,  cx:  0.58,  cy:  0.35,  cz:  0,     area: 0.65 * 1.1  },
        { w: 0.13, h: 0.90, d: 0.13, cx: -0.55,  cy: -0.51,  cz: -0.44,  area: 0.13 * 0.9  },
        { w: 0.13, h: 0.90, d: 0.13, cx:  0.55,  cy: -0.51,  cz: -0.44,  area: 0.13 * 0.9  },
        { w: 0.13, h: 0.90, d: 0.13, cx: -0.55,  cy: -0.51,  cz:  0.44,  area: 0.13 * 0.9  },
        { w: 0.13, h: 0.90, d: 0.13, cx:  0.55,  cy: -0.51,  cz:  0.44,  area: 0.13 * 0.9  },
    ], N);

    /* Forme 1 : Globe terrestre */
    const globe = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        const r = 1.28 + (Math.random() - 0.5) * 0.08;
        globe[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        globe[i * 3 + 1] = r * Math.cos(phi);
        globe[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    /* Forme 2 : Bâtiment */
    const building = buildMultiBox([
        { w: 1.0,  h: 2.7, d: 0.75, cx: -0.1, cy:  0.25, cz: 0, area: 1.0  * 2.7 },
        { w: 0.5,  h: 1.7, d: 0.50, cx:  0.7,  cy: -0.25, cz: 0, area: 0.5  * 1.7 },
        { w: 1.15, h: 0.1, d: 0.90, cx: -0.1, cy:  1.65, cz: 0, area: 1.15 * 0.9 },
        { w: 0.60, h: 0.1, d: 0.60, cx:  0.7,  cy:  0.60, cz: 0, area: 0.6  * 0.6 },
    ], N);

    /* Forme 3 : Réseau de neurones */
    const nn = new Float32Array(N * 3);
    const LAYERS = [4, 6, 4];
    const LAYER_X = [-1.5, 0, 1.5];
    const layerNodes = LAYERS.map((count, li) =>
        Array.from({ length: count }, (_, ni) =>
            new THREE.Vector3(LAYER_X[li], (ni - (count - 1) / 2) * 0.57, 0)
        )
    );
    const allNodes = layerNodes.flat();
    const conns: [THREE.Vector3, THREE.Vector3][] = [];
    for (let li = 0; li < layerNodes.length - 1; li++)
        layerNodes[li].forEach(a => layerNodes[li + 1].forEach(b => conns.push([a, b])));
    const nodeN = Math.floor(N * 0.45);
    for (let i = 0; i < nodeN; i++) {
        const n = allNodes[i % allNodes.length];
        nn[i * 3]     = n.x + (Math.random() - 0.5) * 0.16;
        nn[i * 3 + 1] = n.y + (Math.random() - 0.5) * 0.16;
        nn[i * 3 + 2] = n.z + (Math.random() - 0.5) * 0.16;
    }
    for (let i = nodeN; i < N; i++) {
        const [a, b] = conns[i % conns.length];
        const t = Math.random();
        nn[i * 3]     = a.x + (b.x - a.x) * t;
        nn[i * 3 + 1] = a.y + (b.y - a.y) * t;
        nn[i * 3 + 2] = a.z + (b.z - a.z) * t;
    }

    return [chair, globe, building, nn];
}

/* ── Définitions des géométries wireframe ────────────────────────────── */
type MeshBox = { args: [number, number, number]; pos: [number, number, number] };

const CHAIR_BOXES: MeshBox[] = [
    { args: [1.3,  0.13, 1.1 ], pos: [ 0,     0,     0    ] }, // assise
    { args: [1.3,  1.15, 0.13], pos: [ 0,     0.60, -0.49 ] }, // dossier
    { args: [0.14, 0.65, 1.1 ], pos: [-0.58,  0.35,  0    ] }, // accoudoir G
    { args: [0.14, 0.65, 1.1 ], pos: [ 0.58,  0.35,  0    ] }, // accoudoir D
    { args: [0.13, 0.9,  0.13], pos: [-0.55, -0.51, -0.44 ] }, // pied AVG
    { args: [0.13, 0.9,  0.13], pos: [ 0.55, -0.51, -0.44 ] }, // pied AVD
    { args: [0.13, 0.9,  0.13], pos: [-0.55, -0.51,  0.44 ] }, // pied ARG
    { args: [0.13, 0.9,  0.13], pos: [ 0.55, -0.51,  0.44 ] }, // pied ARD
];

const BUILD_BOXES: MeshBox[] = [
    { args: [1.0,  2.7,  0.75], pos: [-0.1,  0.25, 0] }, // tour principale
    { args: [0.5,  1.7,  0.50], pos: [ 0.7, -0.25, 0] }, // tour annexe
    { args: [1.15, 0.1,  0.90], pos: [-0.1,  1.65, 0] }, // toit principal
    { args: [0.60, 0.1,  0.60], pos: [ 0.7,  0.60, 0] }, // toit annexe
];

const NN_LAYERS  = [4, 6, 4];
const NN_LAYER_X = [-1.5, 0, 1.5];

/* ── Composant MorphingScene ─────────────────────────────────────────── */
function MorphingScene() {
    const groupRef   = useRef<THREE.Group>(null);
    const morphState = useRef({ idx: 0, timer: 0 });

    /* -- Particules (fond de détail) ------------------------------------ */
    const shapes    = useMemo(() => buildMorphShapes(), []);
    const positions = useMemo(() => new Float32Array(shapes[0]), [shapes]);
    const ptGeo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return g;
    }, [positions]);
    useEffect(() => () => { ptGeo.dispose(); }, [ptGeo]);

    /* -- Refs matériaux wireframe (mis à jour chaque frame) ------------- */
    const chairMats = useRef<(THREE.MeshBasicMaterial | null)[]>(Array(CHAIR_BOXES.length).fill(null));
    const globeMat  = useRef<THREE.MeshBasicMaterial | null>(null);
    const buildMats = useRef<(THREE.MeshBasicMaterial | null)[]>(Array(BUILD_BOXES.length).fill(null));
    const nnLineMats = useRef<THREE.LineBasicMaterial[]>([]);
    const nnNodeMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

    /* -- Géométrie du réseau de neurones -------------------------------- */
    const { nnNodes, nnLineObjs } = useMemo(() => {
        nnLineMats.current = []; // reset à chaque remount
        const layerNodes = NN_LAYERS.map((count, li) =>
            Array.from({ length: count }, (_, ni) =>
                new THREE.Vector3(NN_LAYER_X[li], (ni - (count - 1) / 2) * 0.57, 0)
            )
        );
        const nnNodes = layerNodes.flat();
        const nnLineObjs: THREE.Line[] = [];
        for (let li = 0; li < layerNodes.length - 1; li++) {
            layerNodes[li].forEach(a => {
                layerNodes[li + 1].forEach(b => {
                    const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
                    const mat = new THREE.LineBasicMaterial({ color: WF_COLOR, transparent: true, opacity: 0 });
                    nnLineMats.current.push(mat);
                    nnLineObjs.push(new THREE.Line(geo, mat));
                });
            });
        }
        return { nnNodes, nnLineObjs };
    }, []);
    useEffect(() => () => {
        nnLineObjs.forEach(l => { l.geometry.dispose(); (l.material as THREE.Material).dispose(); });
    }, [nnLineObjs]);

    /* -- Applique une opacité à tous les mats d'une forme --------------- */
    const applyOpacity = (idx: number, op: number) => {
        switch (idx) {
            case 0: chairMats.current.forEach(m => { if (m) m.opacity = op; }); break;
            case 1: if (globeMat.current) globeMat.current.opacity = op; break;
            case 2: buildMats.current.forEach(m => { if (m) m.opacity = op; }); break;
            case 3:
                nnLineMats.current.forEach(m => { m.opacity = op * 0.65; });
                nnNodeMats.current.forEach(m => { if (m) m.opacity = op; });
                break;
        }
    };

    /* -- Animation ------------------------------------------------------ */
    useFrame(({ clock }, delta) => {
        const s     = morphState.current;
        s.timer    += delta;
        const CYCLE = HOLD_SEC + MORPH_SEC;
        const nextIdx = (s.idx + 1) % shapes.length;
        let morphT = 0;

        if (s.timer >= CYCLE) {
            // Avance à la forme suivante
            s.idx   = nextIdx;
            s.timer -= CYCLE;
            for (let i = 0; i < MORPH_COUNT * 3; i++) positions[i] = shapes[s.idx][i];
            (ptGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        } else if (s.timer >= HOLD_SEC) {
            // Phase de transition — morph des particules
            const raw = (s.timer - HOLD_SEC) / MORPH_SEC;
            morphT = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
            const from = shapes[s.idx], to = shapes[nextIdx];
            for (let i = 0; i < MORPH_COUNT * 3; i++)
                positions[i] = from[i] + (to[i] - from[i]) * morphT;
            (ptGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        }

        // Crossfade des wireframes chaque frame
        for (let i = 0; i < 4; i++) {
            let op = 0;
            if      (i === s.idx)            op = (1 - morphT) * WF_OPACITY;
            else if (i === (s.idx + 1) % 4)  op = morphT * WF_OPACITY;
            applyOpacity(i, op);
        }

        // Rotation douce + respiration verticale
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.14;
            groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.45) * 0.12;
        }
    });

    return (
        <group ref={groupRef} position={[1.0, 0.2, 0]}>

            {/* Particules — fond de détail subtil */}
            <points>
                <primitive object={ptGeo} attach="geometry" />
                <pointsMaterial size={0.020} color={WF_COLOR} transparent opacity={PT_OPACITY} sizeAttenuation />
            </points>

            {/* Forme 0 : Fauteuil (visible au départ) */}
            {CHAIR_BOXES.map(({ args, pos }, i) => (
                <mesh key={`chair-${i}`} position={pos}>
                    <boxGeometry args={args} />
                    <meshBasicMaterial
                        ref={(m: THREE.MeshBasicMaterial | null) => { chairMats.current[i] = m; }}
                        color={WF_COLOR}
                        wireframe
                        transparent
                        opacity={WF_OPACITY}
                    />
                </mesh>
            ))}

            {/* Forme 1 : Globe (initialement invisible) */}
            <mesh>
                <sphereGeometry args={[1.28, 18, 12]} />
                <meshBasicMaterial
                    ref={(m: THREE.MeshBasicMaterial | null) => { globeMat.current = m; }}
                    color={WF_COLOR}
                    wireframe
                    transparent
                    opacity={0}
                />
            </mesh>

            {/* Forme 2 : Bâtiment (initialement invisible) */}
            {BUILD_BOXES.map(({ args, pos }, i) => (
                <mesh key={`build-${i}`} position={pos}>
                    <boxGeometry args={args} />
                    <meshBasicMaterial
                        ref={(m: THREE.MeshBasicMaterial | null) => { buildMats.current[i] = m; }}
                        color={WF_COLOR}
                        wireframe
                        transparent
                        opacity={0}
                    />
                </mesh>
            ))}

            {/* Forme 3 : Réseau de neurones — connexions (initialement invisible) */}
            {nnLineObjs.map((line, i) => (
                <primitive key={`nn-line-${i}`} object={line} />
            ))}

            {/* Réseau de neurones — nœuds sphériques */}
            {nnNodes.map((n, i) => (
                <mesh key={`nn-node-${i}`} position={n}>
                    <sphereGeometry args={[0.115, 8, 8]} />
                    <meshBasicMaterial
                        ref={(m: THREE.MeshBasicMaterial | null) => { nnNodeMats.current[i] = m; }}
                        color={WF_COLOR}
                        wireframe
                        transparent
                        opacity={0}
                    />
                </mesh>
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
═══════════════════════════════════════════════════════════════════════════ */
export function AvenirScene({ activeSlide }: { activeSlide: number }) {
    const isSlide12 = activeSlide === 12;
    const isSlide13 = activeSlide === 13;
    const isSlide14 = activeSlide === 14;

    return (
        <group position={[100, 0, 0]}>
            {/* Scoped 3-point lighting for this world region */}
            <ambientLight intensity={0.55} />
            <directionalLight position={[3, 4, 3]} intensity={1.40} color="#fff4cc" />
            <directionalLight position={[-3, 1, -2]} intensity={0.70} color="#aadeff" />

            {/* Slide 12 — forme wireframe qui morphe */}
            {isSlide12 && <MorphingScene />}

            {/* Slide 13 — Les limites */}
            {isSlide13 && <LimitsScene />}

            {/* Slide 14 — Technologies émergentes */}
            {isSlide14 && <FutureScene />}
        </group>
    );
}
