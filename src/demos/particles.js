
import './../style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let renderer, scene, camera, controls, stats, gui;
let animationId;
let resizeObserver;

// Params config
const PARAMS = {
  count: 40000,
  mode: 'GPU',
  speed: 1.0,
  size: 0.05
};

export async function mount(container) {
  // 1. Check WebGPU Support
  if (!navigator.gpu) {
    container.innerHTML = `
            <div style="color: white; padding: 20px; font-family: sans-serif;">
                <h1>WebGPU not supported</h1>
                <p>Your browser does not appear to support WebGPU.</p>
                <p>Please try latest Chrome/Edge or Firefox Nightly.</p>
                <p>Check <a href="https://webgpu.io" style="color: cyan;">webgpu.io</a> for more info.</p>
            </div>
        `;
    return;
  }

  // 2. Dynamic Import
  let WebGPURenderer, wgslFn, positionLocal, instanceIndex, storage, uniform, texture, timeNode, Fn, vec3, vec4, float, sin, cos;
  try {
    // three/webgpu for Renderer
    const ThreeWebGPU = await import('three/webgpu');
    WebGPURenderer = ThreeWebGPU.WebGPURenderer;

    // three/tsl for Nodes (time, instanceIndex, etc)
    const ThreeTSL = await import('three/tsl');
    wgslFn = ThreeTSL.wgslFn;
    positionLocal = ThreeTSL.positionLocal;
    instanceIndex = ThreeTSL.instanceIndex;
    storage = ThreeTSL.storage;
    uniform = ThreeTSL.uniform;
    texture = ThreeTSL.texture;
    timeNode = ThreeTSL.time;
    Fn = ThreeTSL.Fn;
    vec3 = ThreeTSL.vec3;
    vec4 = ThreeTSL.vec4;
    float = ThreeTSL.float;
    sin = ThreeTSL.sin;
    cos = ThreeTSL.cos;

  } catch (e) {
    console.error("Failed to load WebGPU modules:", e);
    container.innerHTML = `<h1 style="color:red">Error loading modules: ${e.message}</h1>`;
    return;
  }

  // --- SCENE SETUP ---
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  /* --- STATS --- */
  stats = new Stats();
  stats.dom.style.position = 'absolute';
  container.appendChild(stats.dom);

  renderer = new WebGPURenderer({ antialias: true, forceWebGL: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // --- GEOMETRY ---
  const geometry = new THREE.BoxGeometry(PARAMS.size, PARAMS.size, PARAMS.size);
  const material = new THREE.MeshNormalMaterial();

  // --- CPU IMPLEMENTATION ---
  let cpuMesh;
  let dummy = new THREE.Object3D();
  let cpuPositions;
  let cpuVelocities;

  function initCPU() {
    if (cpuMesh) {
      scene.remove(cpuMesh);
      cpuMesh.dispose();
    }

    cpuMesh = new THREE.InstancedMesh(geometry, material, PARAMS.count);

    // Initialize Arrays (Same logic as GPU)
    cpuPositions = new Float32Array(PARAMS.count * 3);
    cpuVelocities = new Float32Array(PARAMS.count * 3);

    for (let i = 0; i < PARAMS.count; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;

      cpuPositions[i * 3 + 0] = x;
      cpuPositions[i * 3 + 1] = y;
      cpuPositions[i * 3 + 2] = z;

      cpuVelocities[i * 3 + 0] = (Math.random() - 0.5) * 0.1;
      cpuVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      cpuVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      cpuMesh.setMatrixAt(i, dummy.matrix);
    }

    scene.add(cpuMesh);
  }

  function updateCPU(t) {
    if (!cpuMesh) return;

    const speed = PARAMS.speed || 1.0;

    for (let i = 0; i < PARAMS.count; i++) {
      let px = cpuPositions[i * 3 + 0];
      let py = cpuPositions[i * 3 + 1];
      let pz = cpuPositions[i * 3 + 2];

      let vx = cpuVelocities[i * 3 + 0];
      let vy = cpuVelocities[i * 3 + 1];
      let vz = cpuVelocities[i * 3 + 2];

      // 1. Attractor (Center 0,0,0)
      const distSq = px * px + py * py + pz * pz;
      const dist = Math.sqrt(distSq);
      const forceMult = 10.0 / (distSq + 0.1);

      let fx = 0, fy = 0, fz = 0;
      if (dist > 0.0001) {
        const f = forceMult / dist; // forceMult * (1/dist)
        fx = -px * f;
        fy = -py * f;
        fz = -pz * f;
      }

      // 2. Update Velocity
      vx += fx * 0.01 * speed;
      vy += fy * 0.01 * speed;
      vz += fz * 0.01 * speed;

      vx *= 0.98; // Friction
      vy *= 0.98;
      vz *= 0.98;

      // 3. Curl Noise
      const noiseX = Math.sin(py * 0.1 + t) * 0.02;
      const noiseY = Math.cos(px * 0.1 + t) * 0.02;

      vx += noiseX;
      vy += noiseY;

      // 4. Update Position
      px += vx * speed;
      py += vy * speed;
      pz += vz * speed;

      // Write back to arrays
      cpuPositions[i * 3 + 0] = px;
      cpuPositions[i * 3 + 1] = py;
      cpuPositions[i * 3 + 2] = pz;

      cpuVelocities[i * 3 + 0] = vx;
      cpuVelocities[i * 3 + 1] = vy;
      cpuVelocities[i * 3 + 2] = vz;

      // Update Matrix
      dummy.position.set(px, py, pz);
      dummy.updateMatrix();
      cpuMesh.setMatrixAt(i, dummy.matrix);
    }
    cpuMesh.instanceMatrix.needsUpdate = true;
  }


  // --- GPU IMPLEMENTATION (COMPUTE SHADER) ---
  let gpuMesh;
  let computeNode;

  function initGPU() {
    if (gpuMesh) {
      scene.remove(gpuMesh);
      gpuMesh.dispose();
    }

    // 1. Storage Buffers
    const positionArray = new Float32Array(PARAMS.count * 4);
    const velocityArray = new Float32Array(PARAMS.count * 4);

    for (let i = 0; i < PARAMS.count; i++) {
      positionArray[i * 4 + 0] = (Math.random() - 0.5) * 100;
      positionArray[i * 4 + 1] = (Math.random() - 0.5) * 100;
      positionArray[i * 4 + 2] = (Math.random() - 0.5) * 100;
      positionArray[i * 4 + 3] = 1;

      velocityArray[i * 4 + 0] = (Math.random() - 0.5) * 0.1;
      velocityArray[i * 4 + 1] = (Math.random() - 0.5) * 0.1;
      velocityArray[i * 4 + 2] = (Math.random() - 0.5) * 0.1;
      velocityArray[i * 4 + 3] = 0;
    }

    const positionStorage = storage(new THREE.InstancedBufferAttribute(positionArray, 4), 'vec4', PARAMS.count);
    const velocityStorage = storage(new THREE.InstancedBufferAttribute(velocityArray, 4), 'vec4', PARAMS.count);

    // 2. Compute Shader Logic (TSL)
    computeNode = Fn(() => {
      const p = positionStorage.element(instanceIndex).xyz;
      const v = velocityStorage.element(instanceIndex).xyz;

      // Attractor
      const center = vec3(0);
      const dir = center.sub(p);
      const dist = dir.length();
      const force = dir.normalize().mul(float(10).div(dist.mul(dist).add(0.1)));

      // Update velocity
      const newV = v.add(force.mul(0.01).mul(uniform(PARAMS.speed)))
        .mul(0.98); // friction

      // Curl-ish noise
      const noiseX = sin(p.y.mul(0.1).add(timeNode)).mul(0.02);
      const noiseY = cos(p.x.mul(0.1).add(timeNode)).mul(0.02);

      const finalV = vec3(
        newV.x.add(noiseX),
        newV.y.add(noiseY),
        newV.z
      );

      // Update position
      const finalP = p.add(finalV.mul(uniform(PARAMS.speed)));

      // Write back
      positionStorage.element(instanceIndex).assign(vec4(finalP, 1));
      velocityStorage.element(instanceIndex).assign(vec4(finalV, 0));
    })().compute(PARAMS.count);

    // 3. Visualization
    const gpuMaterial = new THREE.MeshNormalMaterial();

    const currentPos = positionStorage.element(instanceIndex);
    gpuMaterial.positionNode = positionLocal.add(currentPos);

    gpuMesh = new THREE.InstancedMesh(geometry, gpuMaterial, PARAMS.count);
    gpuMesh.count = PARAMS.count;
    gpuMesh.frustumCulled = false;

    scene.add(gpuMesh);
  }


  // --- INIT ---
  gui = new GUI({ container: container }); // Append GUI to container
  gui.domElement.style.position = 'absolute';
  gui.domElement.style.top = '0px';
  gui.domElement.style.right = '0px';

  gui.add(PARAMS, 'count', 1000, 500000, 1000).onChange(() => {
    init();
  });
  gui.add(PARAMS, 'mode', ['CPU', 'GPU']).onChange((val) => {
    if (val === 'CPU') {
      if (gpuMesh) scene.remove(gpuMesh);
      initCPU();
    } else {
      if (cpuMesh) scene.remove(cpuMesh);
      initGPU();
    }
  });
  gui.add(PARAMS, 'speed', 0, 5);

  function init() {
    if (PARAMS.mode === 'CPU') initCPU();
    else initGPU();
  }

  init();

  // --- ANIMATION ---
  function animate() {
    stats.update();
    controls.update();

    if (PARAMS.mode === 'CPU') {
      updateCPU(performance.now() / 1000);
    } else {
      renderer.compute(computeNode);
    }

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
}

export function unmount() {
  if (renderer) {
    renderer.setAnimationLoop(null);
    renderer.dispose();
  }
  if (gui) {
    gui.destroy();
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (stats && stats.dom && stats.dom.parentNode) {
    stats.dom.parentNode.removeChild(stats.dom);
  }

  // Optional: Dispose scene objects if needed for full cleanup
  // traverse and dispose geometries/materials...
}
