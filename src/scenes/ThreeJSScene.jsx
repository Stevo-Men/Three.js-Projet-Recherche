import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SLIDES } from '../data';

export function ThreeJSScene() {
    const hx = SLIDES[6].hx;
    const coreRef = useRef();
    const orbitGroupRef = useRef();

    const orbitMeshes = React.useMemo(() => {
        const items = [];
        const colors = [0xffaa00, 0xbb44ff, 0x00ff88, 0xff3366]; // Three, WebGPU, WebGL, Plugin

        for (let i = 0; i < 12; i++) {
            const mat = new THREE.MeshBasicMaterial({
                color: colors[i % colors.length],
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });

            items.push({
                position: [
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 8
                ],
                type: i % 3,
                material: mat
            });
        }
        return items;
    }, []);

    useFrame((state, delta) => {
        if (coreRef.current) {
            coreRef.current.rotation.x += delta * 0.15;
            coreRef.current.rotation.y += delta * 0.2;
        }
        if (orbitGroupRef.current) {
            orbitGroupRef.current.rotation.y += delta * 0.05;
            orbitGroupRef.current.rotation.z += delta * 0.02;
            orbitGroupRef.current.children.forEach(child => {
                child.rotation.x += delta * 0.5;
                child.rotation.y += delta * 0.5;
            });
        }
    });

    return (
        <group position={[40, 0, 0]}>
            {/* Core Gem */}
            <mesh ref={coreRef}>
                <octahedronGeometry args={[2, 0]} />
                <meshBasicMaterial color={hx} wireframe={true} transparent opacity={0.6} />
            </mesh>

            {/* Orbiting Ecosystem */}
            <group ref={orbitGroupRef}>
                {orbitMeshes.map((m, i) => (
                    <mesh key={i} position={m.position} material={m.material}>
                        {m.type === 0 && <boxGeometry args={[0.5, 0.5, 0.5]} />}
                        {m.type === 1 && <tetrahedronGeometry args={[0.6, 0]} />}
                        {m.type === 2 && <torusGeometry args={[0.4, 0.1, 8, 16]} />}
                    </mesh>
                ))}
            </group>
        </group>
    );
}
