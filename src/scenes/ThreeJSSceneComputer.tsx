
import { useGLTF, useTexture } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';

import { CodeScreen } from '../components/3d/CodeScreen';
import { LogoScreen } from '../components/3d/LogoScreen';
import { DemoCube } from '../components/3d/DemoCube';
// ─── Code snippets ────────────────────────────────────────────────────────────
const CODE_INIT = `// 1. Scene
const scene = new THREE.Scene();

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  75,   // champ de vision (degrés)
  window.innerWidth / window.innerHeight, // ratio d'aspect
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




// ─── Main ThreeJSScene ────────────────────────────────────────────────────────
export function ThreeJSScene({ activeSlide, activeEffects = {} }: { activeSlide: number, activeEffects?: Record<string, boolean> }) {
    const { scene } = useGLTF('/models/computer/scene.gltf');

    // Slide 6 = Three.js 1st slide: logo
    const showLogo = activeSlide === 6;
    // Slide 7 = Three.js 2nd slide: intro Scene/Camera/Renderer code
    const showCode1 = activeSlide === 7;
    // Slide 8+ = Three.js 3rd slide onward: object-creation code + demo cube
    const showCode2 = activeSlide >= 8;
    const showCube = activeSlide >= 8;
    // Slide 9+ = Matériaux
    const showMaterials = activeSlide >= 9;
    // Slide 10+ = Lumières
    const showLights = activeSlide >= 10;

    return (
        <group position={[70, -1, 0]}>
            {/* Always-on ambient for the computer model */}
            <ambientLight intensity={0.9} />
            <directionalLight position={[3, 4, 5]} intensity={0.6} color="#ffffff" />

            {/* Group computer and screens so they rotate together */}
            <group position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
                {/* Computer model
                      Raw bbox: Y max ~1927 units, Z max ~738 units
                      scale 0.003 → max height ~5.8 u, front face Z ≈ 738×0.003 = 2.21
                      local Y centre ≈ -467.5 → position.y = +1.4 to compensate         */}
                <Select enabled={!!activeEffects.outline}>
                    <primitive
                        object={scene}
                        scale={[0.003, 0.003, 0.003]}
                    />
                </Select>

                {/* Logo screen — slide 6: intro */}
                <LogoScreen
                    visible={showLogo}
                    position={[0.1, 0.55, 0.94]}
                />

                {/* Code screen — ON the monitor face (z ≈ 2.25, y ≈ 0.5) */}
                <CodeScreen
                    code={CODE_INIT}
                    visible={showCode1}
                    position={[0.1, 0.55, 0.94]}
                />

                {/* Code screen — slide 8+: adding objects + render loop */}
                <CodeScreen
                    code={CODE_OBJECTS}
                    visible={showCode2}
                    position={[0.1, 0.55, 0.94]}
                />
            </group>

            {/* Rotating demo cube — appears from slide 8 */}
            <DemoCube
                visible={showCube}
                showMaterials={showMaterials}
                showLights={showLights}
            />
        </group>
    );
}

useGLTF.preload('/models/computer/scene.gltf');
useTexture.preload('/images/threejs_logo.png');
