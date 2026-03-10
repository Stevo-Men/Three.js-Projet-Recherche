import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import {
    EffectComposer, Bloom, DepthOfField,
    ChromaticAberration, Glitch, Outline,
    SMAA, Vignette, Selection,
} from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';

import { SommaireScene } from './scenes/SommaireScene';
import { PluginScene } from './scenes/PluginScene';
import { WebGLScene } from './scenes/WebGLScene';
import { WebGPUScene } from './scenes/WebGPUScene';
import { ThreeJSScene } from './scenes/ThreeJSScene';
import { AvenirScene } from './scenes/AvenirScene';
import { SCENE_CAMS, SLIDES, SLIDE_COPY, SCENE_OFFSETS } from './data';

const BODY_FONT = '/fonts/nord-minimal/Web Fonts/NORD-Regular.woff';

// ─── Camera Manager ──────────────────────────────────────────────────────────
function CameraManager({ activeSlide }) {
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

// ─── Slide-driven 3D body text ───────────────────────────────────────────────
function SlideBody3D({ activeSlide }) {
    const groupRef = useRef();
    const targetPos = useRef(new THREE.Vector3());

    useFrame(() => {
        if (!groupRef.current) return;
        const slide = SLIDES[activeSlide];
        if (!slide?.bodyPos) {
            groupRef.current.visible = false;
            return;
        }
        const worldX = (SCENE_OFFSETS[slide.sceneId] || (slide.sceneId * 10)) + slide.bodyPos[0];
        targetPos.current.set(worldX, slide.bodyPos[1], slide.bodyPos[2]);
        groupRef.current.position.lerp(targetPos.current, 0.08);
        groupRef.current.visible = true;
    });

    const slide = SLIDES[activeSlide];
    const copy = SLIDE_COPY[activeSlide];
    if (!slide?.bodyPos || !copy?.body) return null;

    return (
        <group ref={groupRef}>
            <Text
                position={[0, 0.55, 0]}
                fontSize={0.22}
                color={slide.hx}
                anchorX="left"
                font={BODY_FONT}
                maxWidth={5}
            >
                {slide.title}
            </Text>

            <mesh position={[2.5, 0.35, 0]}>
                <planeGeometry args={[5, 0.004]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
            </mesh>

            <Text
                position={[0, 0.1, 0]}
                fontSize={0.11}
                color="#ffffff"
                anchorX="left"
                font={BODY_FONT}
                maxWidth={5}
                lineHeight={1.7}
            >
                {copy.body}
            </Text>
        </group>
    );
}

// ─── Background Dust ──────────────────────────────────────────────────────────
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
        if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.02;
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

// ─── Post Effects (conditionally active on ThreeJS slides only) ───────────────
function PostEffects({ fx, isThreeJS }) {
    if (!isThreeJS) return null;

    return (
        <EffectComposer>
            {fx.smaa && <SMAA />}
            {fx.bloom && <Bloom luminanceThreshold={0.15} intensity={2.2} mipmapBlur />}
            {fx.dof && <DepthOfField focusDistance={0.025} focalLength={0.06} bokehScale={4} />}
            {fx.chromatic && (
                <ChromaticAberration
                    blendFunction={BlendFunction.NORMAL}
                    offset={new THREE.Vector2(0.004, 0.004)}
                />
            )}
            {fx.glitch && (
                <Glitch
                    delay={new THREE.Vector2(0.4, 1.0)}
                    duration={new THREE.Vector2(0.1, 0.25)}
                    strength={new THREE.Vector2(0.1, 0.25)}
                    mode={GlitchMode.SPORADIC}
                />
            )}
            {fx.outline && (
                <Outline
                    blur
                    visibleEdgeColor={0xffaa00}
                    hiddenEdgeColor={0x443300}
                    edgeStrength={6}
                    width={800}
                />
            )}
            {fx.vignette && <Vignette eskil={false} offset={0.45} darkness={0.75} />}
        </EffectComposer>
    );
}

// ─── Experience ───────────────────────────────────────────────────────────────
export function Experience({ activeSlide, activeEffects }) {
    const isThreeJS = SLIDES[activeSlide]?.sceneId === 4;

    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}
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
                <AvenirScene />

                <PostEffects fx={activeEffects} isThreeJS={isThreeJS} />
            </Selection>
        </Canvas>
    );
}
