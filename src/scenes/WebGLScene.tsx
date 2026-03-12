import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { SLIDES } from '../data';
import { WebGLCpu } from '../components/3d/webgl/WebGLCpu';
import { WebGLWorker } from '../components/3d/webgl/WebGLWorker';

const RED = new THREE.Color('#ff2222');

export function WebGLScene({ activeSlide }: { activeSlide: number }) {
    const hx = SLIDES[2].hx;
    const normalColor = useMemo(() => new THREE.Color(hx), [hx]);

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

    // Provide random fixed speeds and offsets via state (so it persists and matches useMemo pattern)
    const [packetsParams] = useState(() =>
        gpuPositions.map(() => ({
            offset: Math.random(),
            speed: 0.22 + Math.random() * 0.30,
        }))
    );

    // Is this the "La limite" sub-slide? (sceneId 2, idx 3)
    const slide = SLIDES[activeSlide];
    const isLimitSlide = slide && slide.sceneId === 2 && slide.idx === 3;

    // ─── CPU settings ───────────────────────────────────────────
    const cpuSpeedMult = isLimitSlide ? 0.15 : 1;
    const targetCpuColor = isLimitSlide ? RED : normalColor;

    // Only a few packets are active on limit slide (indices 0, 5, 11)
    const activePackets = useMemo(() => new Set([0, 5, 11]), []);

    return (
        <group position={[20, 0, 0]}>
            <WebGLCpu
                position={CPU_POS}
                hx={hx}
                speedMult={cpuSpeedMult}
                targetColor={targetCpuColor as THREE.Color}
            />

            {gpuPositions.map((pos, i) => (
                <WebGLWorker
                    key={i}
                    position={pos}
                    cpuPosition={CPU_POS}
                    hx={hx}
                    normalColor={normalColor as THREE.Color}
                    isLimitSlide={isLimitSlide as boolean}
                    isActive={!isLimitSlide || activePackets.has(i)}
                    speed={packetsParams[i].speed}
                    initialOffset={packetsParams[i].offset}
                />
            ))}
        </group>
    );
}
