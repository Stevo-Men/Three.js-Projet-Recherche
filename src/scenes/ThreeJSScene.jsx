import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import * as THREE from 'three';
import { SLIDES } from '../data';

export function ThreeJSScene({ activeSlide, activeEffects = {} }) {
    const hx = SLIDES[6].hx;
    const { scene, materials } = useGLTF('/models/car_lowpoly/scene.gltf');
    const groundRef = useRef();

    const showMaterials = activeSlide >= 9;
    const showLights = activeSlide >= 10;

    useEffect(() => {
        if (materials) {
            Object.values(materials).forEach(mat => {
                if ((mat.name.includes('pneu') || mat.name.includes('material_0')) && mat.map) {
                    mat.map.wrapS = THREE.RepeatWrapping;
                    mat.map.wrapT = THREE.RepeatWrapping;
                    mat.map.needsUpdate = true;
                }
            });
        }
    }, [materials]);

    useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.isMesh) {
                    // Save original material if not saved
                    if (!child.userData.originalMaterial) {
                        child.userData.originalMaterial = child.material;
                    }

                    if (!showMaterials) {
                        // Use a wireframe material
                        if (!child.userData.wireframeMaterial) {
                            child.userData.wireframeMaterial = new THREE.MeshBasicMaterial({ color: hx, wireframe: true, transparent: true, opacity: 0.15 });
                        }
                        child.material = child.userData.wireframeMaterial;
                    } else {
                        child.material = child.userData.originalMaterial;
                    }
                }
            });
        }
    }, [scene, showMaterials, hx]);

    useFrame((state, delta) => {
        if (groundRef.current) {
            groundRef.current.position.x -= delta * 5.0;
            if (groundRef.current.position.x <= -0.5) {
                groundRef.current.position.x += 0.5;
            }
        }

        // Animate the wheel textures to simulate rolling because the meshes are merged
        if (materials) {
            Object.values(materials).forEach(mat => {
                if ((mat.name.includes('pneu') || mat.name.includes('material_0')) && mat.map) {
                    mat.map.offset.y -= delta * 1.5;
                    mat.map.needsUpdate = true;
                }
            });
        }
    });

    return (
        <group position={[70, -1, 0]}>
            <group position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh ref={groundRef}>
                    <planeGeometry args={[20, 20, 40, 40]} />
                    <meshBasicMaterial color={hx} wireframe={true} transparent opacity={0.15} />
                </mesh>
            </group>

            <Select enabled={!!activeEffects.outline}>
                <group rotation={[0, 0, 0]}>
                    {showLights && (
                        <>
                            <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#ffffff" />

                            {/* Phare Gauche */}
                            <spotLight position={[3.3, 0.45, 0.6]} angle={0.4} penumbra={0.3} intensity={80} distance={25} color="#bbddff">
                                <object3D attach="target" position={[10, 0.45, 2]} />
                            </spotLight>
                            {/* Ampoule Gauche */}
                            <mesh position={[3.4, 0.45, 0.6]} rotation={[0, Math.PI / 2, 0]}>
                                <circleGeometry args={[0.1, 16]} />
                                <meshBasicMaterial color="#ffffff" />
                            </mesh>

                            {/* Phare Droit */}
                            <spotLight position={[3.3, 0.45, -0.6]} angle={0.4} penumbra={0.3} intensity={80} distance={25} color="#bbddff">
                                <object3D attach="target" position={[10, 0.45, -2]} />
                            </spotLight>
                            {/* Ampoule Droite */}
                            <mesh position={[3.4, 0.45, -0.6]} rotation={[0, Math.PI / 2, 0]}>
                                <circleGeometry args={[0.1, 16]} />
                                <meshBasicMaterial color="#ffffff" />
                            </mesh>

                            {/* Faisceaux volumétriques (Volumetric beams) */}
                            <mesh position={[5.5, 0.45, 1.2]} rotation={[0, -0.15, Math.PI / 2]}>
                                <coneGeometry args={[2.5, 8, 32, 1, true]} />
                                <meshBasicMaterial color="#bbddff" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
                            </mesh>
                            <mesh position={[5.5, 0.45, -1.2]} rotation={[0, 0.15, Math.PI / 2]}>
                                <coneGeometry args={[2.5, 8, 32, 1, true]} />
                                <meshBasicMaterial color="#bbddff" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
                            </mesh>
                        </>
                    )}
                    <primitive object={scene} scale={[0.3, 0.3, 0.3]} position={[1, 0, 0]} />
                </group>
            </Select>
        </group>
    );
}

useGLTF.preload('/models/car_lowpoly/scene.gltf');
