import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function WebGPUWorker({ position, hx, index }: { position: THREE.Vector3, hx: string, index: number }) {
    const meshRef = useRef<THREE.Mesh<any, any>>(null);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        const t = state.clock.elapsedTime;
        const cubePulse = 0.5 + 0.5 * Math.sin(t * 2.2 + index * 0.42);
        meshRef.current.material.opacity = 0.35 + cubePulse * 0.45;
        meshRef.current.rotation.y += delta * 0.4;
        meshRef.current.rotation.x += delta * 0.25;
    });

    return (
        <mesh ref={meshRef} position={position.toArray()}>
            <boxGeometry args={[0.23, 0.23, 0.23]} />
            <meshBasicMaterial color={hx} wireframe transparent opacity={0.55} />
        </mesh>
    );
}
