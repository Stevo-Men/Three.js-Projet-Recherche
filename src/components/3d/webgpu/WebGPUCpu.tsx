import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function WebGPUCpu({ position, hx }: { position: THREE.Vector3, hx: string }) {
    const cpuRef = useRef<THREE.Mesh<any, any>>(null);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.8);
        if (cpuRef.current) {
            cpuRef.current.rotation.x += delta * 0.08;
            cpuRef.current.rotation.y += delta * 0.12;
            cpuRef.current.material.opacity = 0.35 + pulse * 0.25;
        }
    });

    return (
        <mesh ref={cpuRef} position={position.toArray()}>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshBasicMaterial color={hx} wireframe transparent opacity={0.5} />
        </mesh>
    );
}
