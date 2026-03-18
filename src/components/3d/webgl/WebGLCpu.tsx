// Trigger HMR
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WebGLCpuProps {
    position: THREE.Vector3;
    hx: string;
    speedMult: number;
    targetColor: THREE.Color;
}

export function WebGLCpu({ position, hx, speedMult, targetColor }: WebGLCpuProps) {
    const cpuRef = useRef<THREE.Mesh<any, any>>(null);

    useFrame((_state, delta) => {
        if (cpuRef.current) {
            cpuRef.current.rotation.x += delta * 0.5 * speedMult;
            cpuRef.current.rotation.y += delta * 0.8 * speedMult;
            cpuRef.current.material.color.lerp(targetColor, 0.04);
        }
    });

    return (
        <mesh ref={cpuRef} position={position.toArray()}>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshBasicMaterial color={hx} wireframe />
        </mesh>
    );
}
