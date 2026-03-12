import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function WebGPULink({ from, to, hx, initialSpeed, initialDir }: { from: THREE.Vector3, to: THREE.Vector3, hx: string, initialSpeed: number, initialDir: number }) {
    const packetRef = useRef<THREE.Mesh<any, any>>(null);
    const progress = useRef(0);
    const dir = useRef(initialDir);

    const lineObj = useMemo(() => {
        const mat = new THREE.LineBasicMaterial({ color: hx, transparent: true, opacity: 0.25 });
        const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()]);
        return new THREE.Line(geo, mat);
    }, [hx, from, to]);

    useFrame((_state, delta) => {
        progress.current += delta * initialSpeed * dir.current;
        if (progress.current > 1) { progress.current = 0; dir.current = Math.random() > 0.3 ? 1 : -1; }
        if (progress.current < 0) { progress.current = 1; dir.current = Math.random() > 0.3 ? -1 : 1; }

        if (packetRef.current) {
            packetRef.current.position.lerpVectors(
                dir.current > 0 ? from : to,
                dir.current > 0 ? to : from,
                progress.current
            );
            const tp = progress.current;
            packetRef.current.material.opacity = tp < 0.1 ? tp / 0.1 : tp > 0.9 ? (1 - tp) / 0.1 : 1;
        }
    });

    return (
        <>
            <primitive object={lineObj} />
            <mesh ref={packetRef}>
                <sphereGeometry args={[0.030, 5, 5]} />
                <meshBasicMaterial color={hx} transparent opacity={1} />
            </mesh>
        </>
    );
}
