import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WebGLWorkerProps {
    position: THREE.Vector3;
    cpuPosition: THREE.Vector3;
    hx: string;
    normalColor: THREE.Color;
    isLimitSlide: boolean;
    isActive: boolean;
    speed: number;
    initialOffset: number;
}

export function WebGLWorker({
    position, cpuPosition, hx, normalColor, isLimitSlide, isActive, speed, initialOffset
}: WebGLWorkerProps) {
    const packetRef = useRef<THREE.Mesh<any, any>>(null);
    const cubeRef = useRef<THREE.Mesh<any, any>>(null);
    const progress = useRef(initialOffset);

    const lineObj = useMemo(() => {
        const mat = new THREE.LineBasicMaterial({ color: hx, transparent: true, opacity: 0.18 });
        const geo = new THREE.BufferGeometry().setFromPoints([
            cpuPosition.clone(),
            position.clone(),
        ]);
        return new THREE.Line(geo, mat);
    }, [hx, cpuPosition, position]);

    useFrame((_state, delta) => {
        progress.current = (progress.current + delta * speed) % 1;
        const t = progress.current;

        if (packetRef.current) {
            if (isLimitSlide && !isActive) {
                packetRef.current.visible = false;
            } else {
                packetRef.current.visible = true;
                packetRef.current.position.lerpVectors(cpuPosition, position, t);
                packetRef.current.material.opacity = t < 0.08 ? t / 0.08 : t > 0.92 ? (1 - t) / 0.08 : 1;
            }
        }

        if (cubeRef.current) {
            if (isLimitSlide) {
                if (isActive && t > 0.88) {
                    const pulse = 1 + (t - 0.88) * 3;
                    cubeRef.current.scale.setScalar(pulse);
                    cubeRef.current.material.opacity = 0.7;
                    cubeRef.current.material.color.lerp(normalColor, 0.3);
                } else {
                    cubeRef.current.scale.setScalar(1);
                    cubeRef.current.material.opacity = 0.08;
                    cubeRef.current.material.color.lerp(new THREE.Color('#222222'), 0.1);
                }
            } else {
                cubeRef.current.material.color.lerp(normalColor, 0.08);
                if (t > 0.88) {
                    const pulse = 1 + (t - 0.88) * 3;
                    cubeRef.current.scale.setScalar(pulse);
                    cubeRef.current.material.opacity = 0.7;
                } else {
                    cubeRef.current.scale.setScalar(1);
                    cubeRef.current.material.opacity = 0.55;
                }
            }
        }
    });

    return (
        <>
            <primitive object={lineObj} />
            <mesh ref={packetRef}>
                <sphereGeometry args={[0.038, 6, 6]} />
                <meshBasicMaterial color={hx} transparent opacity={1} />
            </mesh>
            <mesh ref={cubeRef} position={position.toArray()}>
                <boxGeometry args={[0.23, 0.23, 0.23]} />
                <meshBasicMaterial color={hx} wireframe transparent opacity={0.55} />
            </mesh>
        </>
    );
}
