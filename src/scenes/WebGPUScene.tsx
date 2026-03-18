import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SLIDES } from '../data';
import { WebGPUCpu } from '../components/3d/webgpu/WebGPUCpu';
import { WebGPUWorker } from '../components/3d/webgpu/WebGPUWorker';
import { WebGPULink } from '../components/3d/webgpu/WebGPULink';

const HX = SLIDES[5].hx; // '#bb44ff'

export function WebGPUScene() {

    // 4×4 GPU grid — same layout as WebGLScene
    const gpuPositions = useMemo(() => {
        const cols = 4, rows = 4, spacingX = 0.70, spacingZ = 0.65;
        const out: THREE.Vector3[] = [];
        for (let i = 0; i < cols; i++)
            for (let j = 0; j < rows; j++)
                out.push(new THREE.Vector3(
                    (i - (cols - 1) / 2) * spacingX,
                    -1.8,
                    (j - (rows - 1) / 2) * spacingZ - 0.3
                ));
        return out;
    }, []);

    // 4 CPUs and 4 Lozenges (2x2 grid)
    const cpuPositions = useMemo(() => {
        const spacingX = 0.70, spacingZ = 0.65;
        return [
            new THREE.Vector3(-spacingX / 2, 1.4, -spacingZ / 2),
            new THREE.Vector3(spacingX / 2, 1.4, -spacingZ / 2),
            new THREE.Vector3(-spacingX / 2, 1.4, spacingZ / 2),
            new THREE.Vector3(spacingX / 2, 1.4, spacingZ / 2),
        ];
    }, []);

    const lozangePositions = useMemo(() => {
        const spacingX = 0.70, spacingZ = 0.65;
        return [
            new THREE.Vector3(-spacingX / 2, 0.4, -spacingZ / 2),
            new THREE.Vector3(spacingX / 2, 0.4, -spacingZ / 2),
            new THREE.Vector3(-spacingX / 2, 0.4, spacingZ / 2),
            new THREE.Vector3(spacingX / 2, 0.4, spacingZ / 2),
        ];
    }, []);

    // ── Horizontal GPU↔GPU inter-connections (Storage Buffer loops) ────────
    const gpuLinks = useMemo(() => {
        const links: { from: number; to: number }[] = [];
        const cols = 4, rows = 4;
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const idx = i * rows + j;
                // right neighbour
                if (i < cols - 1) {
                    const nIdx = (i + 1) * rows + j;
                    links.push({ from: idx, to: nIdx });
                }
                // bottom neighbour
                if (j < rows - 1) {
                    const nIdx = i * rows + (j + 1);
                    links.push({ from: idx, to: nIdx });
                }
            }
        }
        return links;
    }, []);

    // ── Fast packets flowing GPU↔GPU ───────────────────────────────────────
    const [gpuPackets] = useState(() => {
        return gpuLinks.map(() => ({
            speed: 0.55 + Math.random() * 0.7,
            dir: Math.random() > 0.5 ? 1 : -1,
        }));
    });

    return (
        <group position={[30, 0, 0]}>

            {/* ── 4 CPUs ── */}
            {cpuPositions.map((pos, i) => (
                <WebGPUCpu key={`cpu-${i}`} position={pos} hx={HX} />
            ))}

            {/* ── 4 Command Streams (CPU -> Lozenge -> GPU) ── */}
            {cpuPositions.map((cpuPos, i) => (
                <WebGPUCommandStream
                    key={`stream-${i}`}
                    cpuPos={cpuPos}
                    lozPos={lozangePositions[i]}
                    gpuNodes={gpuPositions.slice(i * 4, i * 4 + 4)}
                    hx={HX}
                    index={i}
                />
            ))}

            {/* ── Fast GPU↔GPU inter-links and data packets ── */}
            {gpuLinks.map((link, i) => (
                <WebGPULink
                    key={`link-${i}`}
                    from={gpuPositions[link.from]}
                    to={gpuPositions[link.to]}
                    hx={HX}
                    initialSpeed={gpuPackets[i].speed}
                    initialDir={gpuPackets[i].dir}
                />
            ))}

            {/* ── GPU worker cubes — autonomous, active ── */}
            {gpuPositions.map((pos, i) => (
                <WebGPUWorker
                    key={`worker-${i}`}
                    position={pos}
                    hx={HX}
                    index={i}
                />
            ))}

        </group>
    );
}

// Helper component to manage the logic/lines for one CPU/Lozenge -> 4 GPUs cluster
function WebGPUCommandStream({
    cpuPos, lozPos, gpuNodes, hx, index
}: {
    cpuPos: THREE.Vector3;
    lozPos: THREE.Vector3;
    gpuNodes: THREE.Vector3[];
    hx: string;
    index: number;
}) {
    const lozangeRef = useRef<THREE.Mesh<any, any>>(null);
    const cpuPacketRef = useRef<THREE.Mesh<any, any>>(null);
    const gpuPacketsRef = useRef<(THREE.Mesh | null)[]>([]);

    // We add a slight offset per cluster so they don't fire exactly identically, looking more independent
    const progress = useRef(index * 0.25);

    const cpuLine = useMemo(() => {
        const mat = new THREE.LineBasicMaterial({ color: hx, transparent: true, opacity: 0.12 });
        const geo = new THREE.BufferGeometry().setFromPoints([cpuPos.clone(), lozPos.clone()]);
        return new THREE.Line(geo, mat);
    }, [cpuPos, lozPos, hx]);

    const gpuCenterLine = useMemo(() => {
        // Single line from lozenge to the centroid of the 4 GPU workers
        const center = gpuNodes.reduce(
            (acc, v) => acc.clone().add(v),
            new THREE.Vector3()
        ).divideScalar(gpuNodes.length);
        const mat = new THREE.LineBasicMaterial({ color: hx, transparent: true, opacity: 0.12 });
        const geo = new THREE.BufferGeometry().setFromPoints([lozPos.clone(), center]);
        return new THREE.Line(geo, mat);
    }, [lozPos, gpuNodes, hx]);

    useFrame((_state, delta) => {
        if (lozangeRef.current) {
            lozangeRef.current.rotation.y += delta * 0.6;
            lozangeRef.current.rotation.x += delta * 0.6;
        }

        // 2-phase cycle: 0->1 (CPU to Lozange), 1->2 (Lozange to GPUs)
        progress.current = (progress.current + delta * 0.4) % 2;
        const p = progress.current;

        if (cpuPacketRef.current) {
            if (p <= 1) {
                cpuPacketRef.current.visible = true;
                cpuPacketRef.current.position.lerpVectors(cpuPos, lozPos, p);
                cpuPacketRef.current.material.opacity = p < 0.08 ? p / 0.08 : p > 0.92 ? (1 - p) / 0.08 : 0.9;
            } else {
                cpuPacketRef.current.visible = false;
            }
        }

        gpuPacketsRef.current.forEach((mesh, i) => {
            if (!mesh) return;
            if (p > 1) {
                const t2 = p - 1;
                mesh.visible = true;
                mesh.position.lerpVectors(lozPos, gpuNodes[i], t2);
                (mesh.material as THREE.Material).opacity = t2 < 0.08 ? t2 / 0.08 : t2 > 0.92 ? (1 - t2) / 0.08 : 0.9;
            } else {
                mesh.visible = false;
            }
        });
    });

    return (
        <>
            <primitive object={cpuLine} />
            <mesh ref={cpuPacketRef}>
                <sphereGeometry args={[0.038, 6, 6]} />
                <meshBasicMaterial color={hx} transparent opacity={0.9} />
            </mesh>

            <mesh ref={lozangeRef} position={lozPos.toArray()}>
                <octahedronGeometry args={[0.18, 0]} />
                <meshBasicMaterial color={hx} wireframe transparent opacity={0.8} />
            </mesh>

            <primitive object={gpuCenterLine} />

            {gpuNodes.map((_node, i) => (
                <mesh key={`packet-${i}`} ref={el => gpuPacketsRef.current[i] = el}>
                    <sphereGeometry args={[0.038, 6, 6]} />
                    <meshBasicMaterial color={hx} transparent opacity={0.9} />
                </mesh>
            ))}
        </>
    );
}
