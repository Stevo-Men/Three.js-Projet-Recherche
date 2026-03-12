import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SLIDES } from '../data';
import { WebGPUCpu } from '../components/3d/webgpu/WebGPUCpu';
import { WebGPUWorker } from '../components/3d/webgpu/WebGPUWorker';
import { WebGPULink } from '../components/3d/webgpu/WebGPULink';

const HX = SLIDES[5].hx; // '#bb44ff'

export function WebGPUScene() {

    const cmdPacket = useRef<THREE.Mesh<any, any>>(null);
    const cmdProgress = useRef(0);

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

    // CPU position (same as WebGLScene)
    const CPU_POS = useMemo(() => new THREE.Vector3(0, 1.0, 0), []);

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

    // Single thin CPU→GPU line
    const cpuLine = useMemo(() => {
        const mat = new THREE.LineBasicMaterial({ color: HX, transparent: true, opacity: 0.12 });
        const geo = new THREE.BufferGeometry().setFromPoints([
            CPU_POS.clone(),
            new THREE.Vector3(0, -1.8, 0), // center of GPU grid
        ]);
        return new THREE.Line(geo, mat);
    }, [CPU_POS]);

    useFrame((_state, delta) => {
        // ── Single CPU→GPU command packet (slow, rare) ─────────────────────
        cmdProgress.current = (cmdProgress.current + delta * 0.18) % 1;
        if (cmdPacket.current) {
            const t2 = cmdProgress.current;
            cmdPacket.current.position.lerpVectors(
                CPU_POS,
                new THREE.Vector3(0, -1.8, 0),
                t2
            );
            cmdPacket.current.material.opacity =
                t2 < 0.08 ? t2 / 0.08 : t2 > 0.92 ? (1 - t2) / 0.08 : 0.9;
        }
    });

    return (
        <group position={[30, 0, 0]}>

            <WebGPUCpu position={CPU_POS} hx={HX} />

            {/* ── Single thin CPU→GPU line ── */}
            <primitive object={cpuLine} />

            {/* ── Single slow command packet: CPU → GPU ── */}
            <mesh ref={cmdPacket}>
                <sphereGeometry args={[0.04, 6, 6]} />
                <meshBasicMaterial color={HX} transparent opacity={0.9} />
            </mesh>

            {/* ── Fast GPU↔GPU inter-links and data packets ── */}
            {gpuLinks.map((link, i) => (
                <WebGPULink
                    key={i}
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
                    key={i}
                    position={pos}
                    hx={HX}
                    index={i}
                />
            ))}

        </group>
    );
}
