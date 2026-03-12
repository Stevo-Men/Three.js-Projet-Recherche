import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Demo torus — live result of the code snippet ─────────────────────────────
export function DemoCube({ visible, showMaterials, showLights, position = [0, 0.8, 0.94] }: { visible: boolean, showMaterials: boolean, showLights: boolean, position?: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh<any, any>>(null);

    useFrame((state) => {
        if (meshRef.current && visible) {
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
        }
    });

    if (!visible) return null;

    return (
        <group position={position}>
            {showLights && (
                <group>
                    <directionalLight position={[5, 5, 5]} intensity={1.8} color="#ffffff" />
                    <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#ffaa44" />
                </group>
            )}
            <mesh ref={meshRef}>
                <torusGeometry args={[2.0, 0.05, 16, 100]} />
                {showMaterials ? (
                    <meshStandardMaterial color={0xffaa00} roughness={0.3} metalness={0.1} />
                ) : (
                    <meshBasicMaterial color={0xffaa00} wireframe />
                )}
            </mesh>
        </group>
    );
}
