import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
   SLIDE 12 — WIREFRAME MORPHING
   Un seul LineSegments dont les positions interpolent entre 3 formes :
   globe terrestre → bâtiment → réseau de neurones
═══════════════════════════════════════════════════════════════════════════ */

const N_SEGS = 300;    // nombre de segments (identique pour les 3 formes)
const HOLD_SEC = 3.2;  // secondes immobile sur chaque forme
const MORPH_SEC = 2.4;  // secondes de transition
const WF_COLOR = '#2eb8f5';

type Edge = [THREE.Vector3, THREE.Vector3];

/* ── Globe  ──────────── */
function buildGlobeEdges(r: number): Edge[] {
    const LAT_RINGS = 6, LAT_SEGS = 30;
    const LON_MERS = 12, LON_SEGS = 10;
    const edges: Edge[] = [];

    for (let ri = 1; ri <= LAT_RINGS; ri++) {
        const phi = (ri / (LAT_RINGS + 1)) * Math.PI;
        for (let si = 0; si < LAT_SEGS; si++) {
            const t0 = (si / LAT_SEGS) * Math.PI * 2;
            const t1 = ((si + 1) / LAT_SEGS) * Math.PI * 2;
            edges.push([
                new THREE.Vector3(r * Math.sin(phi) * Math.cos(t0), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(t0)),
                new THREE.Vector3(r * Math.sin(phi) * Math.cos(t1), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(t1)),
            ]);
        }
    }
    for (let li = 0; li < LON_MERS; li++) {
        const theta = (li / LON_MERS) * Math.PI * 2;
        for (let si = 0; si < LON_SEGS; si++) {
            const p0 = (si / LON_SEGS) * Math.PI;
            const p1 = ((si + 1) / LON_SEGS) * Math.PI;
            edges.push([
                new THREE.Vector3(r * Math.sin(p0) * Math.cos(theta), r * Math.cos(p0), r * Math.sin(p0) * Math.sin(theta)),
                new THREE.Vector3(r * Math.sin(p1) * Math.cos(theta), r * Math.cos(p1), r * Math.sin(p1) * Math.sin(theta)),
            ]);
        }
    }
    return edges; // exactement 300
}

/* ── Bâtiment ───────────────── */
function buildBuildingEdges(): Edge[] {
    const boxes = [
        { w: 1.0, h: 2.7, d: 0.75, cx: -0.1, cy: 0.25, cz: 0 },
        { w: 0.5, h: 1.7, d: 0.50, cx: 0.7, cy: -0.25, cz: 0 },
        { w: 1.15, h: 0.1, d: 0.90, cx: -0.1, cy: 1.65, cz: 0 },
        { w: 0.60, h: 0.1, d: 0.60, cx: 0.7, cy: 0.60, cz: 0 },
    ];
    const edges: Edge[] = [];
    boxes.forEach(({ w, h, d, cx, cy, cz }) => {
        const geo = new THREE.BoxGeometry(w, h, d);
        const eGeo = new THREE.EdgesGeometry(geo);
        const pos = eGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < pos.count; i += 2) {
            edges.push([
                new THREE.Vector3(pos.getX(i) + cx, pos.getY(i) + cy, pos.getZ(i) + cz),
                new THREE.Vector3(pos.getX(i + 1) + cx, pos.getY(i + 1) + cy, pos.getZ(i + 1) + cz),
            ]);
        }
        geo.dispose(); eGeo.dispose();
    });
    return edges; // ~48 arêtes
}

/* ── Neural Network ─────────────── */
function buildNNEdges(): Edge[] {
    const LAYERS = [4, 6, 4];
    const LAYER_X = [-1.5, 0, 1.5];
    const NODE_R = 0.13;
    const NODE_SEGS = 10;
    const edges: Edge[] = [];

    const layerNodes = LAYERS.map((count, li) =>
        Array.from({ length: count }, (_, ni) =>
            new THREE.Vector3(LAYER_X[li], (ni - (count - 1) / 2) * 0.57, 0)
        )
    );


    for (let li = 0; li < layerNodes.length - 1; li++)
        layerNodes[li].forEach(a => layerNodes[li + 1].forEach(b => edges.push([a.clone(), b.clone()])));


    layerNodes.flat().forEach(n => {
        for (let i = 0; i < NODE_SEGS; i++) {
            const t0 = (i / NODE_SEGS) * Math.PI * 2;
            const t1 = ((i + 1) / NODE_SEGS) * Math.PI * 2;
            edges.push([
                new THREE.Vector3(n.x + NODE_R * Math.cos(t0), n.y + NODE_R * Math.sin(t0), n.z),
                new THREE.Vector3(n.x + NODE_R * Math.cos(t1), n.y + NODE_R * Math.sin(t1), n.z),
            ]);
        }
    });
    return edges;
}

/* ── Resampling  ── */
function buildEdgeArray(edges: Edge[], N: number): Float32Array {
    const arr = new Float32Array(N * 6);
    for (let i = 0; i < N; i++) {
        const [a, b] = edges[i % edges.length];
        arr[i * 6] = a.x; arr[i * 6 + 1] = a.y; arr[i * 6 + 2] = a.z;
        arr[i * 6 + 3] = b.x; arr[i * 6 + 4] = b.y; arr[i * 6 + 5] = b.z;
    }
    return arr;
}

/* ── Composant ───────────────────────────────────────────────────────── */
function MorphingScene() {
    const groupRef = useRef<THREE.Group>(null);
    const morphState = useRef({ idx: 0, timer: 0 });

    const shapes = useMemo(() => [
        buildEdgeArray(buildGlobeEdges(1.25), N_SEGS),
        buildEdgeArray(buildBuildingEdges(), N_SEGS),
        buildEdgeArray(buildNNEdges(), N_SEGS),
    ], []);

    const positions = useMemo(() => new Float32Array(shapes[0]), [shapes]);

    const geo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return g;
    }, [positions]);
    useEffect(() => () => { geo.dispose(); }, [geo]);

    useFrame(({ clock }, delta) => {
        const s = morphState.current;
        s.timer += delta;
        const CYCLE = HOLD_SEC + MORPH_SEC;
        const nextIdx = (s.idx + 1) % shapes.length;

        if (s.timer >= CYCLE) {
            s.idx = nextIdx;
            s.timer -= CYCLE;
            for (let i = 0; i < N_SEGS * 6; i++) positions[i] = shapes[s.idx][i];
            (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        } else if (s.timer >= HOLD_SEC) {
            const raw = (s.timer - HOLD_SEC) / MORPH_SEC;
            const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
            const from = shapes[s.idx], to = shapes[nextIdx];
            for (let i = 0; i < N_SEGS * 6; i++)
                positions[i] = from[i] + (to[i] - from[i]) * t;
            (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        }

        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.14;
            groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.45) * 0.12;
        }
    });

    return (
        <group ref={groupRef} position={[1.0, 0.2, 0]}>
            <lineSegments>
                <primitive object={geo} attach="geometry" />
                <lineBasicMaterial color={WF_COLOR} transparent opacity={0.60} />
            </lineSegments>
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
            <ambientLight intensity={0.55} />
            <directionalLight position={[3, 4, 3]} intensity={1.40} color="#fff4cc" />
            <directionalLight position={[-3, 1, -2]} intensity={0.70} color="#aadeff" />

            {isSlide12 && <MorphingScene />}
            {isSlide13 && <LimitsScene />}
            {isSlide14 && <FutureScene />}
        </group>
    );
}
