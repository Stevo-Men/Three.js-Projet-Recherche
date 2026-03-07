import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SLIDES } from '../data';

export function AvenirScene() {
    const hx = SLIDES[9].hx;
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((ring, i) => {
                ring.rotation.x += delta * (0.1 + i * 0.05);
                ring.rotation.y += delta * (0.15 + i * 0.02);
                ring.rotation.z += delta * (0.05 + i * 0.03);
            });
            groupRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <group position={[40, 0, 0]} ref={groupRef}>
            {[0, 1, 2, 3].map(i => (
                <mesh key={i}>
                    <torusGeometry args={[1.5 + i * 0.8, 0.02, 16, 100]} />
                    <meshBasicMaterial
                        color={hx}
                        transparent
                        opacity={0.4 - i * 0.08}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
            {/* Center abstract shape */}
            <mesh>
                <icosahedronGeometry args={[0.5, 1]} />
                <meshBasicMaterial color={hx} wireframe transparent opacity={0.8} />
            </mesh>
        </group>
    );
}
