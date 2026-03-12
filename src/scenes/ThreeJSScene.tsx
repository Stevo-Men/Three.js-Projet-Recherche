import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import * as THREE from 'three';
import { SLIDES } from '../data';

import { CodeScreen } from '../components/3d/CodeScreen';
import { LogoScreen } from '../components/3d/LogoScreen';
import { DemoCube } from '../components/3d/DemoCube';
import { WireframeGround } from '../components/3d/WireframeGround';
import { CarHeadlight } from '../components/3d/CarHeadlight';

// ─── Code snippets ────────────────────────────────────────────────────────────
const CODE_INIT = `// 1. Scene
const scene = new THREE.Scene();

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  75,   // champ de vision (degrés)
  window.innerWidth / window.innerHeight,
  0.1,  // plan proche
  1000  // plan lointain
);
camera.position.z = 5;

// 3. Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(
  window.innerWidth,
  window.innerHeight
);
document.body.appendChild(renderer.domElement);
`;

const CODE_OBJECTS = `// Géométrie + Matériau → Mesh
const geometry = new THREE.TorusGeometry(2.0, 0.05, 16, 100);

const material = new THREE.MeshStandardMaterial({
  color: 0xffaa00,
  roughness: 0.3,
  metalness: 0.1
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Lumière directionnelle
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

// Boucle de rendu avec animation
renderer.setAnimationLoop(() => {
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  renderer.render(scene, camera);
});`;

const CODE_MATERIAL = `// Géométrie + Matériau → Mesh
const geometry = new THREE.SphereGeometry(1, 1, 1);

const chromeMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0xffffff),
  roughness: 0.05,
  metalness: 1.0,
  envMapIntensity: 2.0,
});

const sphere = new THREE.Mesh(geometry, chromeMat);
scene.add(sphere);

// Lumière directionnelle
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

// Boucle de rendu avec animation
renderer.setAnimationLoop(() => {
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
});`;

// ─── Main ThreeJSScene ────────────────────────────────────────────────────────
export function ThreeJSScene({ activeSlide, activeEffects = {} }: { activeSlide: number, activeEffects?: Record<string, boolean> }) {
    const hx = SLIDES[6].hx;
    const { scene, materials } = useGLTF('/models/car_lowpoly/scene.gltf');
    // Code / logo screens (slides 6–10)
    const showLogo = activeSlide === 6;
    const showCode1 = activeSlide === 7;   // Scene / Camera / Renderer
    const showCode2 = activeSlide === 8;   // Geometry + Mesh
    const showCodeMat = activeSlide === 9 || activeSlide === 10;   // Material & Lights code
    const showCube = activeSlide >= 7 && activeSlide <= 10;

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

    // Animate wheel textures
    useFrame((_state, delta) => {
        if (materials) {
            Object.values(materials).forEach(mat => {
                if ((mat.name.includes('pneu') || mat.name.includes('material_0')) && (mat as any).map) {
                    (mat as any).map.offset.y -= delta * 1.5;
                    (mat as any).map.needsUpdate = true;
                }
            });
        }
    });

    // Shared position / rotation for all floating screens
    const SCREEN_POS: [number, number, number] = [0, 1.6, -1];
    const SCREEN_ROT: [number, number, number] = [0, 0, 0];

    return (
        <group position={[70, -1, 0]}>
            {/* Scrolling wireframe ground */}
            <WireframeGround color={hx} />

            {/* Holographic screens — float left of the car */}
            <LogoScreen visible={showLogo} position={SCREEN_POS} rotation={SCREEN_ROT} />
            <CodeScreen code={CODE_INIT} visible={showCode1} position={SCREEN_POS} rotation={SCREEN_ROT} />
            <CodeScreen code={CODE_OBJECTS} visible={showCode2} position={SCREEN_POS} rotation={SCREEN_ROT} />
            <CodeScreen code={CODE_MATERIAL} visible={showCodeMat} position={SCREEN_POS} rotation={SCREEN_ROT} />

            {/* Demo torus — live result of the code, floats right of car */}
            <DemoCube
                visible={showCube}
                showMaterials={showMaterials}
                showLights={showMaterials}
                position={[0, -0.9, -1]}
            />

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
