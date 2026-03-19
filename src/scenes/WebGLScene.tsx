import { useMemo, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SLIDES } from '../data';
import { WebGLCpu } from '../components/3d/webgl/WebGLCpu';
import { WebGLWorker } from '../components/3d/webgl/WebGLWorker';

const RED = new THREE.Color('#ff2222');

export function WebGLScene({ activeSlide }: { activeSlide: number }) {
    const hx = SLIDES[2].hx;
    const normalColor = useMemo(() => new THREE.Color(hx), [hx]);

    // CPU sits at top-center
    const CPU_POS = useMemo(() => new THREE.Vector3(0, 1.4, 0), []);
    // Lozange in the middle
    const LOZANGE_POS = useMemo(() => new THREE.Vector3(0, 0.4, 0), []);

    // GPU worker grid
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

    const [packetsParams] = useState(() =>
        gpuPositions.map(() => ({
            offset: Math.random(),
            speed: 0.22 + Math.random() * 0.30,
        }))
    );

    const slide = SLIDES[activeSlide];
    const isLimitSlide = slide && slide.sceneId === 2 && slide.idx === 3;


    const cpuSpeedMult = isLimitSlide ? 0.15 : 1;
    const targetCpuColor = isLimitSlide ? RED : normalColor;


    const activePackets = useMemo(() => new Set([0, 5, 11]), []);

    const lozangeRef = useRef<THREE.Mesh<any, any>>(null);
    const cpuPacketRef = useRef<THREE.Mesh<any, any>>(null);
    const cpuProgress = useRef(0);

    const cpuToLozangeLine = useMemo(() => {
        const mat = new THREE.LineBasicMaterial({ color: hx, transparent: true, opacity: 0.18 });
        const geo = new THREE.BufferGeometry().setFromPoints([
            CPU_POS.clone(),
            LOZANGE_POS.clone(),
        ]);
        return new THREE.Line(geo, mat);
    }, [hx, CPU_POS, LOZANGE_POS]);

    useFrame((_state, delta) => {
        if (lozangeRef.current) {
            lozangeRef.current.rotation.y += delta * 0.5;
            lozangeRef.current.rotation.x += delta * 0.5;
        }

        const maxPhase = isLimitSlide ? 2 : 1;

        const speed = isLimitSlide ? 0.4 : cpuSpeedMult;

        cpuProgress.current = (cpuProgress.current + (delta * speed * 0.5)) % maxPhase;
        const t = cpuProgress.current;

        if (cpuPacketRef.current) {
            if (t <= 1) {
                cpuPacketRef.current.visible = true;
                cpuPacketRef.current.position.lerpVectors(CPU_POS, LOZANGE_POS, t);
                cpuPacketRef.current.material.opacity = t < 0.08 ? t / 0.08 : t > 0.92 ? (1 - t) / 0.08 : 1;
            } else {
                cpuPacketRef.current.visible = false;
            }

            if (isLimitSlide) {
                cpuPacketRef.current.material.color.lerp(targetCpuColor, 0.1);
            } else {
                cpuPacketRef.current.material.color.lerp(normalColor, 0.1);
            }
        }
    });

    return (
        <group position={[20, 0, 0]}>
            <WebGLCpu
                position={CPU_POS}
                hx={hx}
                speedMult={cpuSpeedMult}
                targetColor={targetCpuColor as THREE.Color}
            />

            <primitive object={cpuToLozangeLine} />
            <mesh ref={cpuPacketRef}>
                <sphereGeometry args={[0.038, 6, 6]} />
                <meshBasicMaterial color={hx} transparent opacity={1} />
            </mesh>

            <mesh ref={lozangeRef} position={LOZANGE_POS.toArray()}>
                <octahedronGeometry args={[0.18, 0]} />
                <meshBasicMaterial color={hx} wireframe transparent opacity={0.8} />
            </mesh>

            {gpuPositions.map((pos, i) => (
                <WebGLWorker
                    key={i}
                    position={pos}
                    cpuPosition={LOZANGE_POS}
                    hx={hx}
                    normalColor={normalColor as THREE.Color}
                    isLimitSlide={isLimitSlide as boolean}
                    isActive={isLimitSlide ? true : (!isLimitSlide || activePackets.has(i))}
                    speed={packetsParams[i].speed}
                    initialOffset={packetsParams[i].offset}
                    syncProgress={cpuProgress}
                />
            ))}
        </group>
    );
}
