import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SLIDES } from '../data';

const RED = new THREE.Color('#ff2222');

export function WebGLScene({ activeSlide }: { activeSlide: number }) {
    const hx = SLIDES[2].hx;
    const normalColor = useMemo(() => new THREE.Color(hx), [hx]);
    const cpuRef = useRef<THREE.Mesh<any, any>>(null);
    const cpuRingRef = useRef<THREE.Mesh<any, any>>(null);
    const cpuRing2Ref = useRef<THREE.Mesh<any, any>>(null);
    const packetRefs = useRef<(THREE.Mesh<any, any> | null)[]>([]);
    const cubeRefs = useRef<(THREE.Mesh<any, any> | null)[]>([]);

    // CPU sits at top-center
    const CPU_POS = useMemo(() => new THREE.Vector3(0, 1.0, 0), []);

    // 4 × 4 GPU worker grid at bottom
    const gpuPositions = useMemo(() => {
        const cols = 4, rows = 4, spacingX = 0.70, spacingZ = 0.65;
        const out = [];
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                out.push(new THREE.Vector3(
                    (i - (cols - 1) / 2) * spacingX,
                    -1.8,
                    (j - (rows - 1) / 2) * spacingZ - 0.3
                ));
            }
        }
        return out;
    }, []);

    // Each packet has its own staggered phase
    const packets = useMemo(() =>
        gpuPositions.map(() => ({
            progress: Math.random(),
            speed: 0.22 + Math.random() * 0.30,
        })),
        [gpuPositions]);

    // Lines: CPU → each GPU cube (created once)
    const lineObjects = useMemo(() => {
        const mat = new THREE.LineBasicMaterial({ color: hx, transparent: true, opacity: 0.18 });
        return gpuPositions.map(gPos => {
            const geo = new THREE.BufferGeometry().setFromPoints([
                CPU_POS.clone(),
                gPos.clone(),
            ]);
            return new THREE.Line(geo, mat);
        });
    }, [gpuPositions, hx, CPU_POS]);

    useFrame((_state, delta) => {
        // Is this the "La limite" sub-slide? (sceneId 2, idx 3)
        const slide = SLIDES[activeSlide];
        const isLimitSlide = slide && slide.sceneId === 2 && slide.idx === 3;

        // ─── CPU animation ───────────────────────────────────────────
        const cpuSpeedMult = isLimitSlide ? 0.15 : 1;
        const targetCpuColor = isLimitSlide ? RED : normalColor;

        if (cpuRef.current) {
            cpuRef.current.rotation.x += delta * 0.5 * cpuSpeedMult;
            cpuRef.current.rotation.y += delta * 0.8 * cpuSpeedMult;
            cpuRef.current.material.color.lerp(targetCpuColor, 0.04);
        }
        if (cpuRingRef.current) {
            cpuRingRef.current.rotation.z += delta * 0.4 * cpuSpeedMult;
            cpuRingRef.current.material.color.lerp(targetCpuColor, 0.04);
        }
        if (cpuRing2Ref.current) {
            cpuRing2Ref.current.material.color.lerp(targetCpuColor, 0.04);
        }

        // Only a few packets are active on limit slide (indices 0, 5, 11)
        const activePackets = isLimitSlide ? new Set([0, 5, 11]) : null;

        // ─── Data packets CPU → GPU ──────────────────────────────────
        packets.forEach((packet, i) => {
            packet.progress = (packet.progress + delta * packet.speed) % 1;
            const t = packet.progress;

            const isActive = !activePackets || activePackets.has(i);

            const mesh = packetRefs.current[i];
            if (mesh) {
                // On limit slide, hide inactive packets
                if (!isActive) {
                    mesh.visible = false;
                } else {
                    mesh.visible = true;
                    mesh.position.lerpVectors(CPU_POS, gpuPositions[i], t);
                    mesh.material.opacity = t < 0.08 ? t / 0.08 : t > 0.92 ? (1 - t) / 0.08 : 1;
                }
            }

            // ─── GPU cubes ───────────────────────────────────────────
            const cube = cubeRefs.current[i];
            if (!cube) return;

            if (isLimitSlide) {
                // GPU cubes stay dark by default, only light up briefly when an active packet arrives
                if (isActive && t > 0.88) {
                    const pulse = 1 + (t - 0.88) * 3;
                    cube.scale.setScalar(pulse);
                    cube.material.opacity = 0.7;
                    cube.material.color.lerp(normalColor, 0.3);
                } else {
                    cube.scale.setScalar(1);
                    cube.material.opacity = 0.08;       // dim / off
                    cube.material.color.lerp(new THREE.Color('#222222'), 0.1);
                }
            } else {
                // Normal mode — cubes are visible, pulse on arrival
                cube.material.color.lerp(normalColor, 0.08);
                if (t > 0.88) {
                    const pulse = 1 + (t - 0.88) * 3;
                    cube.scale.setScalar(pulse);
                    cube.material.opacity = 0.7;
                } else {
                    cube.scale.setScalar(1);
                    cube.material.opacity = 0.55;
                }
            }
        });
    });

    return (
        <group position={[20, 0, 0]}>

            {/* ── CPU ── */}
            <mesh ref={cpuRef} position={CPU_POS.toArray()}>
                <icosahedronGeometry args={[0.28, 1]} />
                <meshBasicMaterial color={hx} wireframe />
            </mesh>
            {/* Orbit ring around CPU */}
            <mesh ref={cpuRingRef} position={CPU_POS.toArray()} rotation={[Math.PI / 3, 0.3, 0]}>
                <torusGeometry args={[0.52, 0.008, 8, 80]} />
                <meshBasicMaterial color={hx} transparent opacity={0.4} />
            </mesh>
            {/* Second ring, different tilt */}
            <mesh ref={cpuRing2Ref} position={CPU_POS.toArray()} rotation={[Math.PI / 2, 0.6, 0]}>
                <torusGeometry args={[0.48, 0.005, 8, 80]} />
                <meshBasicMaterial color={hx} transparent opacity={0.2} />
            </mesh>

            {/* ── Connections (CPU → GPU cubes) ── */}
            {lineObjects.map((lineObj, i) => (
                <primitive key={i} object={lineObj} />
            ))}

            {/* ── Data packets flowing down ── */}
            {gpuPositions.map((_, i) => (
                <mesh key={i} ref={el => (packetRefs.current[i] = el)}>
                    <sphereGeometry args={[0.038, 6, 6]} />
                    <meshBasicMaterial color={hx} transparent opacity={1} />
                </mesh>
            ))}

            {/* ── GPU workers — 4×4 cube grid ── */}
            {gpuPositions.map((pos, i) => (
                <mesh key={i} ref={el => (cubeRefs.current[i] = el)} position={pos.toArray()}>
                    <boxGeometry args={[0.23, 0.23, 0.23]} />
                    <meshBasicMaterial color={hx} wireframe transparent opacity={0.55} />
                </mesh>
            ))}

        </group>
    );
}
