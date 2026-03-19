import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import * as THREE from 'three';
import { SLIDES } from '../data';


import { LogoScreen } from '../components/3d/LogoScreen';
import { WireframeGround } from '../components/3d/WireframeGround';
import { CarHeadlight } from '../components/3d/CarHeadlight';



// ─── Main ThreeJSScene ────────────────────────────────────────────────────────
export function ThreeJSScene({ activeSlide, activeEffects = {} }: { activeSlide: number, activeEffects?: Record<string, boolean> }) {
    const hx = SLIDES[6].hx;
    const { scene, materials } = useGLTF('/models/car_lowpoly/scene.gltf');
    // Code / logo screens (slides 6–10)
    const showLogo = activeSlide === 6;


    // Car state
    const showMaterials = activeSlide >= 9;
    const showLights = activeSlide >= 10;

    // Fix wheel texture wrapping on mount


    useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                const mesh = child as THREE.Mesh<any, any>;
                if (mesh.isMesh) {
                    if (!mesh.userData.originalMaterial) {
                        mesh.userData.originalMaterial = mesh.material;
                    }
                    if (!showMaterials) {
                        if (!mesh.userData.wireframeMaterial) {
                            mesh.userData.wireframeMaterial = new THREE.MeshBasicMaterial({
                                color: hx, wireframe: true, transparent: true, opacity: 0.15
                            });
                        }
                        mesh.material = mesh.userData.wireframeMaterial;
                    } else {
                        mesh.material = mesh.userData.originalMaterial;
                    }
                }
            });
        }
    }, [scene, showMaterials, hx]);

    const showMaterialsRef = useRef(showMaterials);
    showMaterialsRef.current = showMaterials;

    // Animate wheel textures
    useFrame((_state, delta) => {
        if (showMaterialsRef.current && materials) {
            Object.values(materials).forEach(mat => {
                if ((mat.name.includes('pneu') || mat.name.includes('material_0')) && (mat as any).map) {
                    (mat as any).map.offset.y -= delta * 1.5;
                    (mat as any).map.needsUpdate = true;
                }
            });
        }
    });


    // Logo screen — in front of the car, rotated to face the top-down camera
    const LOGO_POS: [number, number, number] = [3.5, 0.05, 0];
    const LOGO_ROT: [number, number, number] = [-Math.PI / 2, 0, 0];

    return (
        <group position={[70, -1, 0]}>
            {/* Scrolling wireframe ground */}
            <WireframeGround color={hx} isMoving={showMaterials} />

            {/* Holographic screens — float left of the car */}
            <LogoScreen visible={showLogo} position={LOGO_POS} rotation={LOGO_ROT} />



            {/* Car + lights */}
            <Select enabled={!!activeEffects.outline}>
                <group>
                    {showLights && (
                        <>
                            <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#ffffff" />
                            {/* Phare Gauche */}
                            <CarHeadlight
                                spotPosition={[2.9, 0.15, 0.6]}
                                targetPosition={[10, 0.15, 2]}
                                circlePosition={[2.9, 0.15, 0.6]}
                                beamPosition={[5.1, 0.15, 1.2]}
                                beamRotationY={-0.15}
                            />
                            {/* Phare Droit */}
                            <CarHeadlight
                                spotPosition={[2.9, 0.15, -0.6]}
                                targetPosition={[10, 0.15, -2]}
                                circlePosition={[2.9, 0.15, 0.6]}
                                beamPosition={[5.1, 0.15, -1.2]}
                                beamRotationY={0.15}
                            />
                        </>
                    )}
                    <primitive object={scene} scale={[0.3, 0.3, 0.3]} position={[1, 0, 0]} />
                </group>
            </Select>
        </group>
    );
}

useGLTF.preload('/models/car_lowpoly/scene.gltf');
useTexture.preload('/images/threejs_logo.png');
