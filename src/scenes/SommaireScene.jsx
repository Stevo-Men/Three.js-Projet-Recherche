import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SLIDES } from '../data';

export function SommaireScene() {
    const hx = SLIDES[0].hx;
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <group position={[0, 0, 0]} ref={groupRef}>
            <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <meshBasicMaterial color={hx} />
            </mesh>
        </group>
    );
}