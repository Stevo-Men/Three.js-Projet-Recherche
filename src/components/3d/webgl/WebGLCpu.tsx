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
    const cpuRingRef = useRef<THREE.Mesh<any, any>>(null);
    const cpuRing2Ref = useRef<THREE.Mesh<any, any>>(null);

    useFrame((_state, delta) => {
        if (cpuRef.current) {
            cpuRef.current.rotation.x += delta * 0.5 * speedMult;
            cpuRef.current.rotation.y += delta * 0.8 * speedMult;
            cpuRef.current.material.color.lerp(targetColor, 0.04);
        }
        if (cpuRingRef.current) {
            cpuRingRef.current.rotation.z += delta * 0.4 * speedMult;
            cpuRingRef.current.material.color.lerp(targetColor, 0.04);
        }
        if (cpuRing2Ref.current) {
            cpuRing2Ref.current.material.color.lerp(targetColor, 0.04);
        }
    });

    return (
        <>
            <mesh ref={cpuRef} position={position.toArray()}>
                <icosahedronGeometry args={[0.28, 1]} />
                <meshBasicMaterial color={hx} wireframe />
            </mesh>
            <mesh ref={cpuRingRef} position={position.toArray()} rotation={[Math.PI / 3, 0.3, 0]}>
                <torusGeometry args={[0.52, 0.008, 8, 80]} />
                <meshBasicMaterial color={hx} transparent opacity={0.4} />
            </mesh>
            <mesh ref={cpuRing2Ref} position={position.toArray()} rotation={[Math.PI / 2, 0.6, 0]}>
                <torusGeometry args={[0.48, 0.005, 8, 80]} />
                <meshBasicMaterial color={hx} transparent opacity={0.2} />
            </mesh>
        </>
    );
}
