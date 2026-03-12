import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Scrolling wireframe ground ───────────────────────────────────────────────
export function WireframeGround({ color }: { color: string }) {
    const groundRef = useRef<THREE.Mesh<any, any>>(null);

    useFrame((_state, delta) => {
        if (groundRef.current) {
            groundRef.current.position.x -= delta * 5.0;
            if (groundRef.current.position.x <= -0.5) groundRef.current.position.x += 0.5;
        }
    });

    return (
        <group position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh ref={groundRef}>
                <planeGeometry args={[20, 20, 40, 40]} />
                <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
            </mesh>
        </group>
    );
}
