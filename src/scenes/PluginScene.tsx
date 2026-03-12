import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SLIDES } from '../data';

export function PluginScene() {
    const hx = SLIDES[1].hx;
    const groupRef = useRef<THREE.Group>(null);

    interface BoxData {
        position: [number, number, number];
        rotation: [number, number, number];
        scale: [number, number, number];
        material: THREE.Material;
        speedX: number;
        speedY: number;
    }

    const boxes = React.useMemo(() => {
        const items: BoxData[] = [];
        const matBroken = new THREE.MeshBasicMaterial({ color: hx, wireframe: true, transparent: true, opacity: 0.15 });
        const matSolid = new THREE.MeshBasicMaterial({ color: hx, transparent: true, opacity: 0.8 });

        for (let i = 0; i < 45; i++) {
            const isSolid = Math.random() > 0.8;
            const s = isSolid ? 0.05 + Math.random() * 0.1 : 0.2 + Math.random() * 0.6;
            items.push({
                position: [
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 4 - 2
                ],
                rotation: [
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                ],
                scale: [s, s, s],
                material: isSolid ? matSolid : matBroken,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2
            });
        }
        return items;
    }, [hx]);

    useFrame((_state, delta) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                child.rotation.x += boxes[i].speedX * delta;
                child.rotation.y += boxes[i].speedY * delta;
            });
        }
    });

    return (
        <group ref={groupRef} position={[10, 0, 0]}>
            {boxes.map((b, i) => (
                <mesh
                    key={i}
                    position={b.position}
                    rotation={b.rotation}
                    scale={b.scale}
                    material={b.material}
                >
                    <boxGeometry args={[1, 1, 1]} />
                </mesh>
            ))}
        </group>
    );
}
