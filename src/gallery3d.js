
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as ParticlesDemo from './demos/particles.js';
import * as CubeDemo from './demos/cube.js';
import * as WaterDemo from './demos/water.js';

const demos = [
    {
        id: 'particles',
        name: 'WebGPU Particles',
        module: ParticlesDemo,
        position: new THREE.Vector3(-3, 1.5, -4),
        rotation: new THREE.Euler(0, 0, 0),
        color: 0xff0000,
        image: 'public/images/bongo_fat.png'
    },
    {
        id: 'cube',
        name: 'Rotating Cube',
        module: CubeDemo,
        position: new THREE.Vector3(3, 1.5, -4),
        rotation: new THREE.Euler(0, 0, 0),
        color: 0x00ff00,
        image: 'public/images/bongo_fat_moving.gif'
    },
    {
        id: 'water',
        name: 'Fluid Simulation',
        module: WaterDemo,
        position: new THREE.Vector3(0, 1.5, -6),
        rotation: new THREE.Euler(0, 0, 0),
        color: 0x00ffff,
        image: 'public/images/bongo_fat_moving.gif'
    }
];

let renderer, scene, camera, controls;
let raycaster, mouse;
let paintings = [];
let currentDemoCleanup = null;
let animationId;

export function initGallery(container) {
    // 1. Setup Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101010);
    scene.fog = new THREE.Fog(0x101010, 5, 20);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.7, 5);

    // 2. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 3. Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.target.set(0, 1.5, -5);

    // 4. Room (Floor)
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // 5. Paintings (Demos)
    const loader = new THREE.TextureLoader();
    const paintingGeo = new THREE.BoxGeometry(2, 1.5, 0.1);

    demos.forEach(demo => {
        const tex = loader.load(demo.image);
        const mat = new THREE.MeshBasicMaterial({ map: tex });
        const mesh = new THREE.Mesh(paintingGeo, mat);

        mesh.position.copy(demo.position);
        mesh.rotation.copy(demo.rotation);

        const frameGeo = new THREE.BoxGeometry(2.2, 1.7, 0.05);
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.z = -0.05;
        mesh.add(frame);

        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 256, 64);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(demo.name, 128, 32);

        const labelTex = new THREE.CanvasTexture(canvas);
        const labelMat = new THREE.MeshBasicMaterial({ map: labelTex });
        const labelGeo = new THREE.PlaneGeometry(1, 0.25);
        const label = new THREE.Mesh(labelGeo, labelMat);
        label.position.y = -1.0;
        mesh.add(label);

        mesh.userData = { demo: demo };
        scene.add(mesh);
        paintings.push(mesh);
    });
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);

    // 7. Loop
    function animate() {
        animationId = requestAnimationFrame(animate);
        controls.update();

        // Hover Effect
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(paintings);

        // Reset all scales
        paintings.forEach(p => p.scale.set(1, 1, 1));
        document.body.style.cursor = 'default';

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            hit.scale.set(1.1, 1.1, 1.1);
            document.body.style.cursor = 'pointer';
        }

        renderer.render(scene, camera);
    }
    animate();

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    async function onClick(event) {
        if (event.target !== renderer.domElement) return;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);


        const intersects = raycaster.intersectObjects(paintings, true);

        if (intersects.length > 0) {
            let target = intersects[0].object;
            while (target && (!target.userData || !target.userData.demo)) {
                target = target.parent;
            }

            if (target && target.userData && target.userData.demo) {
                loadDemo(target.userData.demo);
            }
        }
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    async function loadDemo(demo) {
        cancelAnimationFrame(animationId);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('click', onClick);
        window.removeEventListener('resize', onResize);

        container.innerHTML = '';

        const backBtn = document.createElement('button');
        backBtn.innerText = 'Back to Gallery';
        backBtn.style.position = 'absolute';
        backBtn.style.top = '20px';
        backBtn.style.left = '20px';
        backBtn.style.zIndex = '9999';
        backBtn.className = 'back-button';
        backBtn.onclick = () => {
            if (currentDemoCleanup) currentDemoCleanup();
            container.innerHTML = '';
            initGallery(container);
        };
        container.appendChild(backBtn);

        const demoDiv = document.createElement('div');
        demoDiv.style.width = '100%';
        demoDiv.style.height = '100%';
        container.appendChild(demoDiv);

        if (demo.module.mount) {
            await demo.module.mount(demoDiv);
            currentDemoCleanup = demo.module.unmount;
        }
    }
}
