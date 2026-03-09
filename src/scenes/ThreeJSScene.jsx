import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SLIDES } from '../data';

export function ThreeJSScene() {
    const hx = SLIDES[6].hx;
    const groundRef = useRef();

    // Load the GLTF model. This requires the model to be in public/models/car_lowpoly/
    const { scene } = useGLTF('/models/car_lowpoly/scene.gltf');

    // Grid size is 20, divided into 40 segments -> 0.5 per segment
    // We animate until 0.5 and snap back to 0 for a seamless loop
    useFrame((state, delta) => {
        if (groundRef.current) {
            // Adjust axis (x or y) based on the car's facing direction to simulate moving forward
            // The plane is rotated -Math.PI/2 on X, so its local Y is global Z, and local X is global X
            groundRef.current.position.x -= delta * 5.0; // Moving along its local Y (global Z)

            // Seamless wrap at segment boundary (0.5)
            if (groundRef.current.position.x <= -0.5) {
                groundRef.current.position.x += 0.5;
            }
        }
    });

    return (
        <group position={[40, -1, 0]}>
            <group>
                {/* Wireframe Ground Plane inside a clipping/offset group */}
                <group position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <mesh ref={groundRef}>
                        <planeGeometry args={[20, 20, 40, 40]} />
                        <meshBasicMaterial color={hx} wireframe={true} transparent opacity={0.15} />
                    </mesh>
                </group>

                {/* Car Model (Side angle) */}
                <group rotation={[0, 0, 0]}>
                    <primitive object={scene} scale={[0.3, 0.3, 0.3]} position={[1, 0, 0]} />
                </group>
            </group>
        </group>
    );
}

// Preload the model so it's ready when the scene mounts
useGLTF.preload('/models/car_lowpoly/scene.gltf');
