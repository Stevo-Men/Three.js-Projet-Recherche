import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SLIDES } from '../data';

export function WebGPUScene() {
    const hx = SLIDES[5].hx;
    const groupRef = useRef();

    const boxes = React.useMemo(() => {
        const items = [];
        const mat = new THREE.MeshBasicMaterial({ color: hx, wireframe: true, transparent: true, opacity: 0.3 });
        const cols = 8;
        const rows = 8;
        const spacing = 0.8;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                items.push({
                    position: [
                        (i - cols / 2) * spacing,
                        (Math.random() - 0.5) * 0.5,
                        (j - rows / 2) * spacing
                    ],
                    scale: [0.1 + Math.random() * 0.3, 0.1 + Math.random() * 0.3, 0.1 + Math.random() * 0.3],
                    material: mat,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.5 + Math.random() * 2.0
                });
            }
        }
        return items;
    }, [hx]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                child.position.y += Math.sin(t * boxes[i].speed + boxes[i].phase) * 0.005;
            });
            groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.2;
        }
    });

    return (
        <group position={[30, -1, 0]} ref={groupRef}>
            {boxes.map((b, i) => (
                <mesh
                    key={i}
                    position={b.position}
                    scale={b.scale}
                    material={b.material}
                >
                    <boxGeometry args={[1, 1, 1]} />
                </mesh>
            ))}
        </group>
    );
}
