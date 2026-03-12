
import * as THREE from 'three';

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, cube: THREE.Mesh;
let animationId: number;
let resizeObserver: ResizeObserver;

export function mount(container: HTMLElement) {
    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 4. Object
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 5. Animation Loop
    function animate() {
        animationId = requestAnimationFrame(animate);

        if (cube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }

        renderer.render(scene, camera);
    }
    animate();

    // 6. Resize Handling
    resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    });
    resizeObserver.observe(container);
}

export function unmount() {
    if (animationId) cancelAnimationFrame(animationId);

    if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
    }

    if (resizeObserver) resizeObserver.disconnect();

    // Optional: Dispose geometry/material
    if (cube) {
        if (cube.geometry) cube.geometry.dispose();
        if (cube.material) {
            if (Array.isArray(cube.material)) {
                cube.material.forEach(m => m.dispose());
            } else {
                cube.material.dispose();
            }
        }
    }
}