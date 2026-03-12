import * as THREE from 'three';

// ─── Headlight shaders ────────────────────────────────────────────────────────
const HEADLIGHT_VERTEX_SHADER = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vY;
    void main() {
        vY = position.y;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        vNormal = normalMatrix * normal;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const HEADLIGHT_FRAGMENT_SHADER = `
    uniform vec3 color;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vY;
    void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float edgeFade = pow(abs(dot(normal, viewDir)), 1.5);
        float lengthFade = pow(smoothstep(-4.0, 4.0, vY), 1.5);
        float alpha = edgeFade * lengthFade * 0.5;
        gl_FragColor = vec4(color, alpha);
    }
`;

export interface CarHeadlightProps {
    spotPosition: [number, number, number];
    targetPosition: [number, number, number];
    circlePosition: [number, number, number];
    beamPosition: [number, number, number];
    beamRotationY: number;
}

export function CarHeadlight({ spotPosition, targetPosition, circlePosition, beamPosition, beamRotationY }: CarHeadlightProps) {
    return (
        <>
            <spotLight position={spotPosition} angle={0.4} penumbra={0.3} intensity={80} distance={25} color="#bbddff">
                <object3D attach="target" position={targetPosition} />
            </spotLight>
            <mesh position={circlePosition} rotation={[0, Math.PI / 2, 0]}>
                <circleGeometry args={[0.1, 16]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={beamPosition} rotation={[0, beamRotationY, Math.PI / 2]}>
                <coneGeometry args={[2.5, 8, 32, 1, true]} />
                <shaderMaterial
                    transparent depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                    uniforms={{ color: { value: new THREE.Color('#bbddff') } }}
                    vertexShader={HEADLIGHT_VERTEX_SHADER}
                    fragmentShader={HEADLIGHT_FRAGMENT_SHADER}
                />
            </mesh>
        </>
    );
}
