// Import standard THREE (safe)
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';



(async () => {
  // 1. Check WebGPU Support
  if (!navigator.gpu) {
    document.body.innerHTML = `
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
    document.body.innerHTML = `<h1 style="color:red">Error loading modules: ${e.message}</h1>`;
    return;
  }

  // --- CONFIGURATION ---
  const PARAMS = {
    count: 40000,
    mode: 'GPU',
    speed: 1.0,
    size: 0.05
  };

  // --- SCENE SETUP ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  /* --- STATS --- */
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const renderer = new WebGPURenderer({ antialias: true, forceWebGL: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
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

    const dt = 1 / 60; // approximate delta time if we assume 60fps, or just use 1.0 same as GPU logic which was stateless-ish? 
    // Wait, GPU logic used "speed" uniform but didn't explicitly use delta time in the integration, 
    // it just did "p += v * speed". Implicitly per-frame.
    // GPU Logic Recap:
    // v += force * 0.01 * speed;
    // v *= 0.98;
    // noise...
    // p += v * speed;

    const speed = PARAMS.speed || 1.0;

    for (let i = 0; i < PARAMS.count; i++) {
      let px = cpuPositions[i * 3 + 0];
      let py = cpuPositions[i * 3 + 1];
      let pz = cpuPositions[i * 3 + 2];

      let vx = cpuVelocities[i * 3 + 0];
      let vy = cpuVelocities[i * 3 + 1];
      let vz = cpuVelocities[i * 3 + 2];

      // 1. Attractor (Center 0,0,0)
      // dir = center - p  =>  -p
      const distSq = px * px + py * py + pz * pz;
      const dist = Math.sqrt(distSq);
      const forceMult = 10.0 / (distSq + 0.1);

      // normalize(dir) * forceMult
      // dir is (-px, -py, -pz). Length is dist.
      // normalized is (-px/dist, -py/dist, -pz/dist)
      // So force is (-px/dist * forceMult, ...)

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

      // 3. Curl Noise (Simplified from TSL)
      // v.x += sin(p.y * 0.1 + time) * 0.02;
      // v.y += cos(p.x * 0.1 + time) * 0.02;
      const noiseX = Math.sin(py * 0.1 + t) * 0.02;
      const noiseY = Math.cos(px * 0.1 + t) * 0.02;

      // In GPU code: 
      // finalV = vec3(newV.x + noiseX, newV.y + noiseY, newV.z)
      // It does NOT modify the stored velocity state with noise?
      // Let's check TSL: 
      // "const newV = ...; const finalV = ...; velocityStorage...assign(vec4(finalV, 0))"
      // YES, it assigns finalV back to storage. So Noise IS accumulated?
      // Wait:
      // const newV = v.add(...) .mul(0.98);
      // ...
      // const finalV = ... newV.x + noiseX ...
      // velocityStorage...assign(finalV);
      // So yes, noise is added to the velocity state for the next frame.

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
  let positionBuffer;
  let velocityBuffer;

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

    // We need to tell the material to use the buffer for positioning
    // storage parameters act as nodes.
    // We can directly access the storage at the current instance index
    const currentPos = positionStorage.element(instanceIndex);

    // TSL: positionNode is used to override vertex position
    // CRITICAL FIX: We must ADD the mesh's local geometry position to the instance position!
    // Otherwise all vertices collapse to the center point.
    gpuMaterial.positionNode = positionLocal.add(currentPos);

    gpuMesh = new THREE.InstancedMesh(geometry, gpuMaterial, PARAMS.count);
    gpuMesh.count = PARAMS.count;
    gpuMesh.frustumCulled = false; // Important for GPU-moved objects

    scene.add(gpuMesh);
  }


  // --- INIT ---
  const gui = new GUI();
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

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

})(); 
