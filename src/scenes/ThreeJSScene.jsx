import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import * as THREE from 'three';
import { SLIDES } from '../data';

export function ThreeJSScene({ activeEffects = {} }) {
    const hx = SLIDES[6].hx;
    const groundRef = useRef();

    const { scene } = useGLTF('/models/car_lowpoly/scene.gltf');

    useFrame((state, delta) => {
        if (groundRef.current) {
            groundRef.current.position.x -= delta * 5.0;
            if (groundRef.current.position.x <= -0.5) {
                groundRef.current.position.x += 0.5;
            }
        }
    });

    return (
        <group position={[40, -1, 0]}>
            {/* Wireframe Ground Plane */}
            <group position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh ref={groundRef}>
                    <planeGeometry args={[20, 20, 40, 40]} />
                    <meshBasicMaterial color={hx} wireframe={true} transparent opacity={0.15} />
                </mesh>
            </group>

            {/* Car — wrapped in Select so Outline effect can target it */}
            <Select enabled={!!activeEffects.outline}>
                <group rotation={[0, 0, 0]}>
                    <primitive object={scene} scale={[0.3, 0.3, 0.3]} position={[1, 0, 0]} />
                </group>
            </Select>
        </group>
    );
}

useGLTF.preload('/models/car_lowpoly/scene.gltf');
