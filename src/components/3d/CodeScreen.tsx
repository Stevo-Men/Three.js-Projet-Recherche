import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { createCodeTexture } from '../../utils/textureUtils';

// ─── Floating code screen ─────────────────────────────────────────────────────
export function CodeScreen({ code, visible, position = [0, 0, 0], rotation = [0, 0, 0] }: { code: string, visible: boolean, position?: [number, number, number], rotation?: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh<any, any>>(null);
    const texture = useMemo(() => {
        if (!code) return null;
        return createCodeTexture(code);
    }, [code]);

    useEffect(() => {
        return () => { if (texture) texture.dispose(); };
    }, [texture]);

    if (!visible || !texture) return null;

    return (
        <mesh ref={meshRef} position={position} rotation={rotation}>
            <planeGeometry args={[3.5, 2.625]} />
            <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
        </mesh>
    );
}
