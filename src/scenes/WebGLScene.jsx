import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SLIDES } from '../data';

export function WebGLScene() {
    const hx = SLIDES[1].hx;
    const innerRef = useRef();
    const outerRef = useRef();
    const particlesRef = useRef();

    // Create points once
    const { positions, colors } = React.useMemo(() => {
        const p = [];
        const c = [];
        const color = new THREE.Color(hx);
        for (let i = 0; i < 800; i++) {
            const x = (Math.random() - 0.5) * 10;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;
            p.push(x, y, z);

            color.setHSL(0.4, 1.0, 0.4 + Math.random() * 0.4);
            c.push(color.r, color.g, color.b);
        }
        return { positions: new Float32Array(p), colors: new Float32Array(c) };
    }, [hx]);

    useFrame((state, delta) => {
        if (innerRef.current) {
            innerRef.current.rotation.x += delta * 0.2;
            innerRef.current.rotation.y += delta * 0.3;
        }
        if (outerRef.current) {
            outerRef.current.rotation.x -= delta * 0.1;
            outerRef.current.rotation.y -= delta * 0.15;
        }
        if (particlesRef.current) {
            particlesRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <group position={[10, 0, 0]}>
            <mesh ref={innerRef}>
                <icosahedronGeometry args={[1.5, 1]} />
                <meshBasicMaterial color={hx} wireframe={true} transparent opacity={0.3} />
            </mesh>

            <mesh ref={outerRef}>
                <icosahedronGeometry args={[2.2, 2]} />
                <meshBasicMaterial color={hx} wireframe={true} transparent opacity={0.1} />
            </mesh>

            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={800} array={positions} itemSize={3} />
                    <bufferAttribute attach="attributes-color" count={800} array={colors} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={0.03} vertexColors={true} transparent opacity={0.6} />
            </points>
        </group>
    );
}
