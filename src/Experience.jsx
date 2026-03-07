import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { PluginScene } from './scenes/PluginScene';
import { WebGLScene } from './scenes/WebGLScene';
import { WebGPUScene } from './scenes/WebGPUScene';
import { ThreeJSScene } from './scenes/ThreeJSScene';
import { AvenirScene } from './scenes/AvenirScene';
import { SCENE_CAMS } from './data';

// Helper component to manage the camera lerping based on active slide
function CameraManager({ activeSlide, SLIDES }) {
    const vec = new THREE.Vector3();
    const targetVec = new THREE.Vector3();

    useFrame((state) => {
        // 1. Find which scene we are in
        const slide = SLIDES[activeSlide];
        const sceneId = slide.sceneId;

        // 2. Base X offset for this scene (Spacing is 10 units per scene)
        const activeBaseX = sceneId * 10;

        // 3. Find the specific camera anchor for this slide
        // idx is 1-based, so idx - 1 is the array index
        const anchor = SCENE_CAMS[sceneId][slide.idx - 1] || SCENE_CAMS[sceneId][0];

        // 4. Calculate desired position
        const destX = activeBaseX + anchor.pos[0];
        const destY = anchor.pos[1];
        const destZ = anchor.pos[2];

        // Calculate desired lookAt target
        const targX = activeBaseX + anchor.target[0];
        const targY = anchor.target[1];
        const targZ = anchor.target[2];

        // Lerp camera position
        vec.set(destX, destY, destZ);
        state.camera.position.lerp(vec, 0.05);

        // Lerp camera lookAt (by moving the scene around the camera technically, or just looking)
        targetVec.set(targX, targY, targZ);

        // Smooth lookAt by storing current look target
        if (!state.camera.userData.target) {
            state.camera.userData.target = new THREE.Vector3(0, 0, 0);
        }
        state.camera.userData.target.lerp(targetVec, 0.05);
        state.camera.lookAt(state.camera.userData.target);
    });

    return null;
}

// Optional background particles
function BackgroundDust() {
    const pointsRef = useRef();
    const { positions } = React.useMemo(() => {
        const p = [];
        for (let i = 0; i < 300; i++) {
            p.push(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );
        }
        return { positions: new Float32Array(p) };
    }, []);

    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.02;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={300} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color={0xffffff} transparent opacity={0.1} />
        </points>
    );
}


export function Experience({ activeSlide, SLIDES }) {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}
        >
            <ambientLight intensity={0.5} />

            {/* 
         In your original code, the scene was black. 
         If you need to ensure lighting looks okay, consider <Environment preset="city" /> 
         but for wireframes, BasicMaterial is used so light isn't strictly necessary.
      */}

            <CameraManager activeSlide={activeSlide} SLIDES={SLIDES} />
            <BackgroundDust />

            <PluginScene />    {/* at x: 0 */}
            <WebGLScene />     {/* at x: 10 */}
            <WebGPUScene />    {/* at x: 20 */}
            <ThreeJSScene />   {/* at x: 30 */}
            <AvenirScene />    {/* at x: 40 */}

        </Canvas>
    );
}
