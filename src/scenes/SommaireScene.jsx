import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { SLIDES } from '../data';

export function SommaireScene() {
    const hx = SLIDES[0].hx;
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Subtle floating effect
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group position={[0, 0, 0]} ref={groupRef}>
            <Text
                position={[0, 1.5, 0]}
                fontSize={0.5}
                color={hx}
                anchorX="center"
                anchorY="middle"
                font="/fonts/nord-minimal/Web Fonts/NORD-Regular.woff"
            >

            </Text>

        </group>
    );
}