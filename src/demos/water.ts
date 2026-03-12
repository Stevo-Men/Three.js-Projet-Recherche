
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

let renderer: any, scene: THREE.Scene, camera: THREE.PerspectiveCamera, controls: OrbitControls, gui: GUI;
let resizeObserver: ResizeObserver;
let cleanupEvent: (() => void) | null = null;

// Simulation Params
const PARAMS = {
    damping: 0.99,
    speed: 1.0,
    brushSize: 5.0,
    brushStrength: 5.0,
    color: '#00ffff'
};

export async function mount(container: HTMLElement) {
    if (!navigator.gpu) {
        container.innerHTML = `
            <div style="color: white; padding: 20px; font-family: sans-serif;">
                <h1>WebGPU not supported</h1>
                <p>Your browser does not appear to support WebGPU.</p>
            </div>
        `;
        return;
    }

    // --- IMPORTS ---
    let WebGPURenderer: any, storage: any, uniform: any, Fn: any, vec2: any, vec3: any, float: any, int: any, instanceIndex: any, positionLocal: any, mod: any, vertexIndex: any;

    try {
        const ThreeWebGPU = await import('three/webgpu');
        WebGPURenderer = ThreeWebGPU.WebGPURenderer;

        const ThreeTSL = await import('three/tsl');
        storage = ThreeTSL.storage;
        uniform = ThreeTSL.uniform;
        Fn = ThreeTSL.Fn;
        vec2 = ThreeTSL.vec2;
        vec3 = ThreeTSL.vec3;
        float = ThreeTSL.float;
        int = ThreeTSL.int;
        instanceIndex = ThreeTSL.instanceIndex;
        positionLocal = ThreeTSL.positionLocal;
        mod = ThreeTSL.mod; // Use mod instead of remainder
        vertexIndex = ThreeTSL.vertexIndex;

    } catch (e: any) {
        console.error(e);
        return;
    }

    // --- SETUP ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202030); // Dark Blue-ish gray

    // Add Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(50, 50, 50);
    scene.add(dirLight);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 100);

    renderer = new WebGPURenderer({ antialias: true, forceWebGL: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // --- SIMULATION DATA ---
    const WIDTH = 256; // Simulation Grid Size
    const COUNT = WIDTH * WIDTH;


    // Initial data
    const heightArray = new Float32Array(COUNT);
    const velocityArray = new Float32Array(COUNT);

    const heightStorage = storage(new THREE.InstancedBufferAttribute(heightArray, 1), 'float', COUNT);
    const velocityStorage = storage(new THREE.InstancedBufferAttribute(velocityArray, 1), 'float', COUNT);

    // Uniforms
    const uDamping = uniform(PARAMS.damping);
    const uSpeed = uniform(PARAMS.speed);
    const uBrushPos = uniform(vec2(-1000, -1000));
    const uBrushSize = uniform(PARAMS.brushSize);
    const uBrushStrength = uniform(PARAMS.brushStrength);

    // --- COMPUTE SHADERS ---

    // 1. Interaction & Physics
    // We map 1 thread per grid point.
    // Grid X, Y from instanceIndex

    const computeWater = Fn(() => {
        const index = int(instanceIndex);
        const width = int(WIDTH);

        // x = index % width
        const x = mod(index, width);
        // y = index / width
        const y = index.div(width);

        // Current State
        const h = heightStorage.element(index).toVar();
        const v = velocityStorage.element(index).toVar();

        // Neighbors (Clamp to edges)
        const xL = x.greaterThan(0).select(index.sub(1), index);
        const xR = x.lessThan(width.sub(1)).select(index.add(1), index);
        const yU = y.greaterThan(0).select(index.sub(width), index);
        const yD = y.lessThan(width.sub(1)).select(index.add(width), index);

        const hL = heightStorage.element(xL);
        const hR = heightStorage.element(xR);
        const hU = heightStorage.element(yU);
        const hD = heightStorage.element(yD);

        // Force = Average difference
        // Smoothed laplacian: (hL + hR + hU + hD - 4*h)
        const force = hL.add(hR).add(hU).add(hD).sub(h.mul(4.0));

        // Acceleration
        v.addAssign(force.mul(0.5).mul(uSpeed));

        // Damping
        v.mulAssign(uDamping);

        // Interaction (Brush)
        // Convert grid index to world space approx (assuming plane is -50 to 50)
        // Grid 0..256 -> World -50..50
        const worldX = float(x).div(float(width)).mul(100.0).sub(50.0);
        const worldY = float(y).div(float(width)).mul(100.0).sub(50.0); // Y in grid corresponds to Z in world usually

        const dist = vec2(worldX, worldY).distance(uBrushPos);

        // If dist < size, push down
        const interaction = float(1.0).sub(dist.div(uBrushSize).clamp(0.0, 1.0));
        v.addAssign(interaction.mul(uBrushStrength).mul(-1.0)); // Push down

        // Update Height
        h.addAssign(v);

        // Write Back
        velocityStorage.element(index).assign(v);
        heightStorage.element(index).assign(h);

    })().compute(COUNT);


    // --- VISUALIZATION ---
    // Create a generic Plane with high segmentation
    const geometry = new THREE.PlaneGeometry(100, 100, WIDTH - 1, WIDTH - 1);
    geometry.rotateX(-Math.PI / 2); // Horizontal

    const material = new THREE.MeshPhysicalMaterial({
        color: PARAMS.color,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9, // Glass/Water-like
        thickness: 1.0,
        side: THREE.DoubleSide
    });

    // Vertex Shader Modification via Node System
    // We need to map Vertex Index to Buffer Index
    // PlaneGeometry vertices are ordered row-by-row usually. 
    // We can use vertexIndex logic.

    // TSL Node to read height
    const gridIndex = vertexIndex; // 1:1 mapping for plane segments
    const hNode = heightStorage.element(gridIndex);

    // Displace Y
    const newPos = positionLocal.add(vec3(0, hNode, 0));
    material.positionNode = newPos;

    // Recalculate Normals (Derivative based) manually or let three.js try?
    // With displacement, flat normals won't look great. 
    // Simple trick: Calculate finite difference normals in shader?
    // For now, let's stick to simple displacement and rely on MeshPhysical's glossiness.
    // Or we can define normalNode.

    const waterMesh = new THREE.Mesh(geometry, material);
    scene.add(waterMesh);

    // Container
    const boxGeo = new THREE.BoxGeometry(100, 20, 100);
    const boxMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.95,
        opacity: 0.3,
        transparent: true,
        roughness: 0.1,
        thickness: 0.5,
        side: THREE.BackSide // See inside
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.y = -10;
    scene.add(box);

    const pointLight = new THREE.PointLight(0x00ffff, 2.0, 100);
    pointLight.position.set(0, 20, 0);
    scene.add(pointLight);

    const gridHelper = new THREE.GridHelper(100, 20);
    gridHelper.position.y = -20;
    scene.add(gridHelper);

    // --- INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y=0 plane

    const onPointerMove = (e: MouseEvent | PointerEvent) => {
        const ndc = new THREE.Vector2(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1
        );
        raycaster.setFromCamera(ndc, camera);
        const target = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, target);

        if (target) {
            // Update Uniform
            uBrushPos.value.set(target.x, target.z);
        } else {
            uBrushPos.value.set(-1000, -1000);
        }
    };
    window.addEventListener('pointermove', onPointerMove);


    // --- GUI ---
    gui = new GUI({ container: container });
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '0px';
    gui.domElement.style.right = '0px';
    gui.add(PARAMS, 'speed', 0, 5).onChange(v => uSpeed.value = v);
    gui.add(PARAMS, 'damping', 0.9, 1.0).onChange(v => uDamping.value = v);
    gui.add(PARAMS, 'brushSize', 1, 20).onChange(v => uBrushSize.value = v);
    gui.add(PARAMS, 'brushStrength', 1, 20).onChange(v => uBrushStrength.value = v);
    gui.addColor(PARAMS, 'color').onChange(v => material.color.set(v));


    // --- ANIMATION ---
    function animate() {
        controls.update();

        // Run Compute
        renderer.compute(computeWater);

        renderer.render(scene, camera);
    }

    // --- RESIZE ---
    resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    });
    resizeObserver.observe(container);

    // Store cleanup for unmount
    cleanupEvent = () => {
        window.removeEventListener('pointermove', onPointerMove);
    };
}

export function unmount() {
    if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
    }
    if (gui) gui.destroy();
    if (cleanupEvent) cleanupEvent();
    if (resizeObserver) resizeObserver.disconnect();
}
