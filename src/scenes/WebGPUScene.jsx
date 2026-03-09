import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SLIDES } from '../data';

const HX = SLIDES[5].hx; // '#bb44ff'

export function WebGPUScene() {

    const cpuRef = useRef();
    const cpuRingRef = useRef();
    const cmdPacket = useRef();          // single CPU→GPU command
    const cmdProgress = useRef(0);

    // 4×4 GPU grid — same layout as WebGLScene
    const gpuPositions = useMemo(() => {
        const cols = 4, rows = 4, spacingX = 0.70, spacingZ = 0.65;
        const out = [];
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
    // Each cube connects to its right and bottom neighbour → mesh-like circuit
    const gpuLinks = useMemo(() => {
        const links = [];
        const cols = 4, rows = 4;
        const mat = new THREE.LineBasicMaterial({ color: HX, transparent: true, opacity: 0.25 });
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const idx = i * rows + j;
                // right neighbour
                if (i < cols - 1) {
                    const nIdx = (i + 1) * rows + j;
                    const geo = new THREE.BufferGeometry().setFromPoints([
                        gpuPositions[idx].clone(),
                        gpuPositions[nIdx].clone(),
                    ]);
                    links.push({ line: new THREE.Line(geo, mat), from: idx, to: nIdx });
                }
                // bottom neighbour
                if (j < rows - 1) {
                    const nIdx = i * rows + (j + 1);
                    const geo = new THREE.BufferGeometry().setFromPoints([
                        gpuPositions[idx].clone(),
                        gpuPositions[nIdx].clone(),
                    ]);
                    links.push({ line: new THREE.Line(geo, mat), from: idx, to: nIdx });
                }
            }
        }
        return links;
    }, [gpuPositions]);

    // ── Fast packets flowing GPU↔GPU ───────────────────────────────────────
    // 12 packets racing along the horizontal links, much faster than CPU packets
    const gpuPackets = useMemo(() => {
        return gpuLinks.map((_, i) => ({
            progress: Math.random(),
            speed: 0.55 + Math.random() * 0.7,   // ~3× faster than CPU packets
            dir: Math.random() > 0.5 ? 1 : -1,   // bidirectional
        }));
    }, [gpuLinks]);

    // Refs for GPU packets and cubes
    const gpuPacketRefs = useRef([]);
    const cubeRefs = useRef([]);

    // Single thin CPU→GPU line
    const cpuLine = useMemo(() => {
        const mat = new THREE.LineBasicMaterial({ color: HX, transparent: true, opacity: 0.12 });
        const geo = new THREE.BufferGeometry().setFromPoints([
            CPU_POS.clone(),
            new THREE.Vector3(0, -1.8, 0), // center of GPU grid
        ]);
        return new THREE.Line(geo, mat);
    }, [CPU_POS]);

    const normalColor = useMemo(() => new THREE.Color(HX), []);
    const pulseColor = useMemo(() => new THREE.Color('#ffffff'), []);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        // ── CPU: calm, slow pulse ──────────────────────────────────────────
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.8);   // very slow
        if (cpuRef.current) {
            cpuRef.current.rotation.x += delta * 0.08;
            cpuRef.current.rotation.y += delta * 0.12;
            cpuRef.current.material.opacity = 0.35 + pulse * 0.25;
        }
        if (cpuRingRef.current) {
            cpuRingRef.current.rotation.z += delta * 0.15;
        }

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

        // ── GPU cubes: active, bright ──────────────────────────────────────
        cubeRefs.current.forEach((cube, i) => {
            if (!cube) return;
            // Gentle autonomous pulse per cube (offset by index)
            const cubePulse = 0.5 + 0.5 * Math.sin(t * 2.2 + i * 0.42);
            cube.material.opacity = 0.35 + cubePulse * 0.45;
            cube.rotation.y += delta * 0.4;
            cube.rotation.x += delta * 0.25;
        });

        // ── GPU↔GPU packets: fast, bidirectional ──────────────────────────
        gpuPackets.forEach((pkt, i) => {
            pkt.progress += delta * pkt.speed * pkt.dir;
            if (pkt.progress > 1) { pkt.progress = 0; pkt.dir = Math.random() > 0.3 ? 1 : -1; }
            if (pkt.progress < 0) { pkt.progress = 1; pkt.dir = Math.random() > 0.3 ? -1 : 1; }

            const mesh = gpuPacketRefs.current[i];
            if (!mesh) return;
            const link = gpuLinks[i];
            const from = gpuPositions[link.from];
            const to = gpuPositions[link.to];
            mesh.position.lerpVectors(
                pkt.dir > 0 ? from : to,
                pkt.dir > 0 ? to : from,
                pkt.progress
            );
            const tp = pkt.progress;
            mesh.material.opacity = tp < 0.1 ? tp / 0.1 : tp > 0.9 ? (1 - tp) / 0.1 : 1;
        });
    });

    return (
        <group position={[30, 0, 0]}>

            {/* ── CPU — calm, resting ── */}
            <mesh ref={cpuRef} position={CPU_POS.toArray()}>
                <icosahedronGeometry args={[0.28, 1]} />
                <meshBasicMaterial color={HX} wireframe transparent opacity={0.5} />
            </mesh>
            <mesh ref={cpuRingRef} position={CPU_POS.toArray()} rotation={[Math.PI / 3, 0.3, 0]}>
                <torusGeometry args={[0.52, 0.005, 8, 80]} />
                <meshBasicMaterial color={HX} transparent opacity={0.2} />
            </mesh>

            {/* ── Single thin CPU→GPU line ── */}
            <primitive object={cpuLine} />

            {/* ── Single slow command packet: CPU → GPU ── */}
            <mesh ref={cmdPacket}>
                <sphereGeometry args={[0.04, 6, 6]} />
                <meshBasicMaterial color={HX} transparent opacity={0.9} />
            </mesh>

            {/* ── GPU horizontal mesh lines ── */}
            {gpuLinks.map((link, i) => (
                <primitive key={i} object={link.line} />
            ))}

            {/* ── Fast GPU↔GPU data packets ── */}
            {gpuLinks.map((_, i) => (
                <mesh key={i} ref={el => (gpuPacketRefs.current[i] = el)}>
                    <sphereGeometry args={[0.030, 5, 5]} />
                    <meshBasicMaterial color={HX} transparent opacity={1} />
                </mesh>
            ))}

            {/* ── GPU worker cubes — autonomous, active ── */}
            {gpuPositions.map((pos, i) => (
                <mesh key={i} ref={el => (cubeRefs.current[i] = el)} position={pos.toArray()}>
                    <boxGeometry args={[0.23, 0.23, 0.23]} />
                    <meshBasicMaterial color={HX} wireframe transparent opacity={0.55} />
                </mesh>
            ))}

        </group>
    );
}
