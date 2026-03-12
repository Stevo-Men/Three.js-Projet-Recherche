import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// ─── Floating logo screen ─────────────────────────────────────────────────────
export function LogoScreen({ visible, position = [0, 0, 0], rotation = [0, 0, 0] }: { visible: boolean, position?: [number, number, number], rotation?: [number, number, number] }) {
    const texture = useTexture('/images/threejs_logo.png');

    if (!visible) return null;

    const textureImage = texture.image as { width: number, height: number } | undefined;
    const aspect = textureImage ? textureImage.width / textureImage.height : 1.5;
    let logoHeight = 1.4;
    let logoWidth = logoHeight * aspect;
    if (logoWidth > 3.2) { logoWidth = 3.2; logoHeight = logoWidth / aspect; }

    return (
        <group position={position} rotation={rotation}>
            <mesh>
                <planeGeometry args={[3.5, 2.625]} />
                <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[logoWidth, logoHeight]} />
                <meshBasicMaterial map={texture} transparent />
            </mesh>
        </group>
    );
}
