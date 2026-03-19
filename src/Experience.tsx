import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
    EffectComposer, Bloom, DepthOfField,
    ChromaticAberration, Glitch,
    Vignette, Selection,
} from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';

import { SommaireScene } from './scenes/SommaireScene';
import { PluginScene } from './scenes/PluginScene';
import { WebGLScene } from './scenes/WebGLScene';
import { WebGPUScene } from './scenes/WebGPUScene';
import { ThreeJSScene } from './scenes/ThreeJSScene';
import { AvenirScene } from './scenes/AvenirScene';
import { SCENE_CAMS, SLIDES, SCENE_OFFSETS } from './data';

//  Camera Manager
function CameraManager({ activeSlide }: { activeSlide: number }) {
    const vec = new THREE.Vector3();
    const targetVec = new THREE.Vector3();

    useFrame((state) => {
        const slide = SLIDES[activeSlide];
        const sceneId = slide.sceneId;
        const activeBaseX = SCENE_OFFSETS[sceneId] || (sceneId * 10);
        const anchor = SCENE_CAMS[sceneId][slide.idx - 1] || SCENE_CAMS[sceneId][0];

        vec.set(activeBaseX + anchor.pos[0], anchor.pos[1], anchor.pos[2]);
        state.camera.position.lerp(vec, 0.05);

        targetVec.set(activeBaseX + anchor.target[0], anchor.target[1], anchor.target[2]);
        if (!state.camera.userData.target) {
            state.camera.userData.target = new THREE.Vector3(0, 0, 0);
        }
        state.camera.userData.target.lerp(targetVec, 0.05);
        state.camera.lookAt(state.camera.userData.target);
    });

    return null;
}


//  Background Dust
function BackgroundDust() {
    const pointsRef = useRef<THREE.Points>(null);
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

    useFrame((_state, delta) => {
        if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.02;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={300} array={positions} itemSize={3} args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color={0xffffff} transparent opacity={0.1} />
        </points>
    );
}

//  Post Effects 
function PostEffects({ fx, isThreeJS }: { fx: Record<string, boolean>; isThreeJS: boolean }) {
    if (!isThreeJS) return null;

    return (
        <EffectComposer>

            {fx.bloom ? <Bloom luminanceThreshold={1.9} intensity={1.8} mipmapBlur /> : <></>}
            {fx.dof ? <DepthOfField focusDistance={4} focalLength={2.6} bokehScale={3} /> : <></>}
            {fx.chromatic ? (
                <ChromaticAberration
                    blendFunction={BlendFunction.NORMAL}
                    offset={new THREE.Vector2(0.004, 0.004)}
                />
            ) : <></>}
            {fx.glitch ? (
                <Glitch
                    delay={new THREE.Vector2(0.4, 1.0)}
                    duration={new THREE.Vector2(0.1, 0.25)}
                    strength={new THREE.Vector2(0.1, 0.25)}
                    mode={GlitchMode.SPORADIC}
                />
            ) : <></>}

            {fx.vignette ? <Vignette eskil={false} offset={0.45} darkness={0.75} /> : <></>}
        </EffectComposer>
    );
}

//  Experience
export function Experience({ activeSlide, activeEffects }: { activeSlide: number; activeEffects: Record<string, boolean> }) {
    const isThreeJS = SLIDES[activeSlide]?.sceneId === 4;

    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            style={{
                position: 'fixed', top: 0, left: 0,
                width: '100%', height: '100%',
                zIndex: 10,
                pointerEvents: 'none',
            }}
        >
            <ambientLight intensity={0.5} />

            <CameraManager activeSlide={activeSlide} />
            <BackgroundDust />

            <Selection>
                <SommaireScene />
                <PluginScene />
                <WebGLScene activeSlide={activeSlide} />
                <WebGPUScene />
                <ThreeJSScene activeSlide={activeSlide} activeEffects={activeEffects} />
                <AvenirScene activeSlide={activeSlide} />

                <PostEffects fx={activeEffects} isThreeJS={isThreeJS} />
            </Selection>
        </Canvas>
    );
}
