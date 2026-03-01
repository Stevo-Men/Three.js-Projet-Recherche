import * as THREE from 'three';

// ─── WORLD ANCHORS (one per subject scene) ────────────────────────────────────
const SC = [
    new THREE.Vector3(0, 0, -5),   // 0 · Plugin Era
    new THREE.Vector3(-10, 0, -45),    // 1 · WebGL
    new THREE.Vector3(15, 0, -80),    // 2 · WebGPU
    new THREE.Vector3(-5, 0, -115),   // 3 · Three.js
    new THREE.Vector3(10, 0, -150),   // 4 · L'avenir
];

// ─── SLIDE DEFINITIONS ────────────────────────────────────────────────────────
// Sub-slides of the same subject share the same sceneId (same 3D objects),
// but orbit that scene from a different camPos/lookAt → "same scene, new angle".
const SLIDES = [
    {
        sceneId: 0, subjectNum: 1, tot: 1, idx: 1,
        subject: "Introduction",
        title: "Vue d'ensemble",
        subtitle: "Plan de présentation",
        bullets: ["L’ère des plugins avant WebGL", "L'arrivée de WebGL", "La révolution de WebGPU", "Three.js", "L'avenir de l'écosystème"], // Nouvelle propriété
        color: '#00ff00', hex: 0x00ff00,
        cam: new THREE.Vector3(10, 15, -120), look: new THREE.Vector3(10, 1, -150)
    },
    // ① L'ère des plugins ─────────────────────────────────────────────────────
    {
        sceneId: 0, subjectNum: 2, tot: 1, idx: 2,
        subject: "L'ère des plugins avant WebGL",
        title: "L'ère des plugins",
        subtitle: "Flash · Silverlight · Java Applets — le web 3D avant 2011",
        color: '#ff8c42', hex: 0xff8c42,
        cam: new THREE.Vector3(0, 4, 8), look: new THREE.Vector3(0, 1, -5)
    },

    // ② L'arrivée de WebGL ────────────────────────────────────────────────────
    {
        sceneId: 1, subjectNum: 2, tot: 3, idx: 1,
        subject: "L'arrivée de WebGL",
        title: "L'arrivée de WebGL",
        subtitle: "2011 : le rendu GPU natif directement dans le navigateur",
        color: '#4cc9f0', hex: 0x4cc9f0,
        cam: new THREE.Vector3(-10, 5, -30), look: new THREE.Vector3(-10, 1, -45)
    },

    {
        sceneId: 1, subjectNum: 2, tot: 3, idx: 2,
        subject: "L'arrivée de WebGL",
        title: "Son pipeline graphique",
        subtitle: "Vertex Shader → Rasterisation → Fragment Shader → Framebuffer",
        color: '#4cc9f0', hex: 0x4cc9f0,
        cam: new THREE.Vector3(-26, 4, -38), look: new THREE.Vector3(-10, 1, -45)
    },

    {
        sceneId: 1, subjectNum: 2, tot: 3, idx: 3,
        subject: "L'arrivée de WebGL",
        title: "La transition",
        subtitle: "De plugins propriétaires à un standard ouvert du W3C",
        color: '#4cc9f0', hex: 0x4cc9f0,
        cam: new THREE.Vector3(4, 3, -38), look: new THREE.Vector3(-10, 1, -45)
    },

    // ③ La révolution de WebGPU ───────────────────────────────────────────────
    {
        sceneId: 2, subjectNum: 3, tot: 1, idx: 1,
        subject: "La révolution de WebGPU",
        title: "La révolution de WebGPU",
        subtitle: "Compute shaders, accès bas niveau — le GPU sans contrainte",
        color: '#9b5de5', hex: 0x9b5de5,
        cam: new THREE.Vector3(15, 6, -66), look: new THREE.Vector3(15, 1, -80)
    },

    // ④ Three.js ──────────────────────────────────────────────────────────────
    {
        sceneId: 3, subjectNum: 4, tot: 4, idx: 1,
        subject: "Three.js",
        title: "Three.js",
        subtitle: "L'abstraction WebGL open-source la plus utilisée au monde",
        color: '#f72585', hex: 0xf72585,
        cam: new THREE.Vector3(-5, 6, -100), look: new THREE.Vector3(-5, 1, -115)
    },

    {
        sceneId: 3, subjectNum: 4, tot: 4, idx: 2,
        subject: "Three.js",
        title: "Vertex & Fragment Shader",
        subtitle: "Les deux étapes clés du pipeline GPU",
        color: '#f72585', hex: 0xf72585,
        cam: new THREE.Vector3(-21, 4, -108), look: new THREE.Vector3(-5, 1, -115)
    },

    {
        sceneId: 3, subjectNum: 4, tot: 4, idx: 3,
        subject: "Three.js",
        title: "Coder avec Three.js",
        subtitle: "Scene · Camera · Renderer — en quelques lignes",
        color: '#f72585', hex: 0xf72585,
        cam: new THREE.Vector3(11, 3, -108), look: new THREE.Vector3(-5, 1, -115)
    },

    {
        sceneId: 3, subjectNum: 4, tot: 4, idx: 4,
        subject: "Three.js",
        title: "Les autres alternatives",
        subtitle: "Babylon.js · PlayCanvas · A-Frame · React Three Fiber",
        color: '#f72585', hex: 0xf72585,
        cam: new THREE.Vector3(-5, 11, -101), look: new THREE.Vector3(-5, 1, -115)
    },

    // ⑤ L'avenir ──────────────────────────────────────────────────────────────
    {
        sceneId: 4, subjectNum: 5, tot: 3, idx: 1,
        subject: "L'avenir de l'écosystème",
        title: "L'avenir de l'écosystème",
        subtitle: "Où va le web 3D dans les prochaines années ?",
        color: '#4361ee', hex: 0x4361ee,
        cam: new THREE.Vector3(10, 6, -135), look: new THREE.Vector3(10, 1, -150)
    },

    {
        sceneId: 4, subjectNum: 5, tot: 3, idx: 2,
        subject: "L'avenir de l'écosystème",
        title: "Les limites actuelles",
        subtitle: "Complexité d'accès, adoption fragmentée, debugging difficile",
        color: '#4361ee', hex: 0x4361ee,
        cam: new THREE.Vector3(26, 4, -143), look: new THREE.Vector3(10, 1, -150)
    },

    {
        sceneId: 4, subjectNum: 5, tot: 3, idx: 3,
        subject: "L'avenir de l'écosystème",
        title: "WebXR",
        subtitle: "AR & VR natives dans le navigateur — sans installation",
        color: '#4361ee', hex: 0x4361ee,
        cam: new THREE.Vector3(10, 12, -136), look: new THREE.Vector3(10, 1, -150)
    },
];

// ─── RUNTIME STATE ────────────────────────────────────────────────────────────
let renderer, scene, camera, clock;
let animId, curve;
let scrollT = 0;   // current smoothed T on curve
let targetT = 0;   // scroll destination
let activeSlide = -1;
let hudDots = [];
let hudBullets;
let hudSubjectLine, hudTitle, hudSubtitle, hudSubProgress, hudProgress;
let sceneGroups = new Map(); // sceneId → THREE.Group

// ─── INIT ─────────────────────────────────────────────────────────────────────
export function initPresentation(container) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05050e);
    scene.fog = new THREE.FogExp2(0x05050e, 0.007);

    camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.1, 600);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    // Global ambient
    scene.add(new THREE.AmbientLight(0xffffff, 0.12));

    // Build unique scenes
    const builders = [
        buildPluginScene,
        buildWebGLScene,
        buildWebGPUScene,
        buildThreeJSScene,
        buildAvenirScene,
    ];
    SLIDES.forEach(s => {
        if (!sceneGroups.has(s.sceneId)) {
            const g = builders[s.sceneId](SC[s.sceneId], s.hex);
            scene.add(g);
            sceneGroups.set(s.sceneId, g);
        }
    });

    buildStarfield();

    // Camera path — CatmullRom through all slide cam positions
    const pathPts = [
        SLIDES[0].cam.clone().add(new THREE.Vector3(0, 0, 5)),
        ...SLIDES.map(s => s.cam.clone()),
        SLIDES[SLIDES.length - 1].cam.clone().add(new THREE.Vector3(0, -2, -8)),
    ];
    curve = new THREE.CatmullRomCurve3(pathPts, false, 'catmullrom', 0.5);

    buildHUD(container);
    updateCameraFromT(0);
    updateHUD(0, true);

    // Events
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);

    let lastTY = null;
    window.addEventListener('touchstart', e => { lastTY = e.touches[0].clientY; });
    window.addEventListener('touchmove', e => {
        if (lastTY === null) return;
        nudgeScroll((lastTY - e.touches[0].clientY) * 3);
        lastTY = e.touches[0].clientY;
        e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchend', () => { lastTY = null; });

    animate();
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE BUILDERS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Scene 0 · Plugin Era ──────────────────────────────────────────────────────
// Retro / broken feel: cracked screen, dead cubes, plugin name ghosts
function buildPluginScene(c, color) {
    const g = new THREE.Group();
    const light = new THREE.PointLight(color, 80, 45);
    light.position.copy(c).add(new THREE.Vector3(0, 6, 0));
    g.add(light);

    // Big "dead screen" plane (cracked/grid)
    const screenGeo = new THREE.PlaneGeometry(8, 5.5, 10, 7);
    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x1a0d00, emissive: new THREE.Color(color), emissiveIntensity: 0.06,
        metalness: 0.8, roughness: 0.4, wireframe: false,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.copy(c).add(new THREE.Vector3(0, 2, 0));
    g.add(screen);

    // Wireframe overlay — cracked look
    const crackMat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.18 });
    const crack = new THREE.Mesh(new THREE.PlaneGeometry(8, 5.5, 14, 10), crackMat);
    crack.position.copy(c).add(new THREE.Vector3(0, 2, 0.05));
    g.add(crack);

    // Scattered broken cubes
    const pluginNames = ['FLASH', 'Silverlight', 'Java\nApplet', 'ActiveX', 'VRML'];
    for (let i = 0; i < 20; i++) {
        const s = 0.1 + Math.random() * 0.4;
        const geo = new THREE.BoxGeometry(s, s, s);
        const mat = new THREE.MeshStandardMaterial({
            color, emissive: new THREE.Color(color), emissiveIntensity: 0.3 + Math.random() * 0.4,
            metalness: 0.6, roughness: 0.5, wireframe: Math.random() > 0.5,
        });
        const cube = new THREE.Mesh(geo, mat);
        const angle = Math.random() * Math.PI * 2;
        const rad = 2 + Math.random() * 5;
        cube.position.set(
            c.x + Math.cos(angle) * rad,
            c.y + (Math.random() - 0.5) * 5,
            c.z + Math.sin(angle) * rad * 0.5,
        );
        cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        cube.userData.rotSpeed = new THREE.Vector3(
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3,
        );
        cube.userData.floatOffset = Math.random() * Math.PI * 2;
        g.add(cube);
    }

    // Plugin name ghosts (sprites)
    pluginNames.forEach((name, i) => {
        const angle = (i / pluginNames.length) * Math.PI * 2;
        const pos = c.clone().add(new THREE.Vector3(
            Math.cos(angle) * 4.5, 1.5 + Math.random() * 2, Math.sin(angle) * 2,
        ));
        g.add(makeTextSprite(name, pos, 0.9, 'rgba(255, 140, 66, 0.55)'));
    });

    g.add(makeTextSprite("Le web 3D d'avant", c.clone().add(new THREE.Vector3(0, 5, 0)), 2.0, '#ff8c42'));
    return g;
}

// ── Scene 1 · WebGL Pipeline ──────────────────────────────────────────────────
// Horizontal pipeline of glowing stages + flowing particle stream
function buildWebGLScene(c, color) {
    const g = new THREE.Group();
    const light = new THREE.PointLight(color, 100, 55);
    light.position.copy(c).add(new THREE.Vector3(0, 7, 0));
    g.add(light);

    const stages = [
        { label: 'CPU', sublabel: 'Données', x: -8 },
        { label: 'Vertex\nShader', sublabel: 'GLSL', x: -4 },
        { label: 'Rasteriser', sublabel: '→ pixels', x: 0 },
        { label: 'Fragment\nShader', sublabel: 'GLSL', x: 4 },
        { label: 'Framebuffer', sublabel: 'Écran', x: 8 },
    ];

    const boxGeo = new THREE.BoxGeometry(2.2, 1.4, 0.5);
    stages.forEach((st, i) => {
        const frac = i / (stages.length - 1);
        const stageColor = new THREE.Color().setHSL(0.57 - frac * 0.12, 1.0, 0.55);
        const mat = new THREE.MeshPhysicalMaterial({
            color: stageColor, emissive: stageColor, emissiveIntensity: 0.35,
            metalness: 0.8, roughness: 0.1,
        });
        const box = new THREE.Mesh(boxGeo, mat);
        box.position.set(c.x + st.x, c.y + 2, c.z);
        g.add(box);

        // Wireframe outline
        const wireMat = new THREE.MeshBasicMaterial({ color: stageColor, wireframe: true, transparent: true, opacity: 0.3 });
        const wire = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.5, 0.6), wireMat);
        wire.position.copy(box.position);
        g.add(wire);

        // Label sprite
        g.add(makeTextSprite(st.label, box.position.clone().add(new THREE.Vector3(0, 0, 0.4)), 0.75, '#ffffff'));
        g.add(makeTextSprite(st.sublabel, box.position.clone().add(new THREE.Vector3(0, -1.0, 0)), 0.6, `rgba(76,201,240,0.7)`));

        // Connector arrow to next stage
        if (i < stages.length - 1) {
            const arrowGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8);
            arrowGeo.rotateZ(Math.PI / 2);
            const arrowMat = new THREE.MeshBasicMaterial({ color: stageColor, transparent: true, opacity: 0.5 });
            const arrow = new THREE.Mesh(arrowGeo, arrowMat);
            arrow.position.set(c.x + st.x + 3.05, c.y + 2, c.z);
            g.add(arrow);
        }
    });

    // Particle stream flowing through the pipeline
    const partCount = 300;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    const partPhase = new Float32Array(partCount);
    for (let i = 0; i < partCount; i++) {
        partPhase[i] = Math.random(); // 0-1 position along pipeline
        const xOff = -8 + partPhase[i] * 16;
        const yOff = 2 + (Math.random() - 0.5) * 0.6;
        const zOff = (Math.random() - 0.5) * 0.4;
        partPos[i * 3] = c.x + xOff;
        partPos[i * 3 + 1] = c.y + yOff;
        partPos[i * 3 + 2] = c.z + zOff;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({ color, size: 0.09, transparent: true, opacity: 0.8 });
    const stream = new THREE.Points(partGeo, partMat);
    stream.userData.pipelineStream = { phaseArr: partPhase, center: c };
    g.add(stream);

    // Ground grid
    const grid = new THREE.GridHelper(28, 20, color, color);
    grid.position.copy(c).setY(c.y + 0.3);
    const gridMats = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMats.forEach(m => { m.transparent = true; m.opacity = 0.1; });
    g.add(grid);

    g.add(makeTextSprite('WebGL', c.clone().add(new THREE.Vector3(0, 5.5, 0)), 2.4, '#4cc9f0'));
    return g;
}

// ── Scene 2 · WebGPU ─────────────────────────────────────────────────────────
// Compute grid of mini cubes + wave plane + rising particles
function buildWebGPUScene(c, color) {
    const g = new THREE.Group();
    const light = new THREE.PointLight(color, 120, 65);
    light.position.copy(c).add(new THREE.Vector3(0, 8, 0));
    g.add(light);
    g.add(new THREE.PointLight(0xffffff, 40, 40).position.set(c.x, c.y + 3, c.z + 8) && new THREE.PointLight(0xffffff, 25, 40));

    // Compute grid: NxN glowing mini-cubes
    const N = 10, GS = 1.5;
    const cubeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    for (let ix = 0; ix < N; ix++) {
        for (let iz = 0; iz < N; iz++) {
            const frac = (ix * N + iz) / (N * N);
            const nodeColor = new THREE.Color().setHSL(0.75 + frac * 0.15, 1.0, 0.55);
            const mat = new THREE.MeshStandardMaterial({
                color: nodeColor, emissive: nodeColor, emissiveIntensity: 0.6,
                metalness: 0.3, roughness: 0.4,
            });
            const cube = new THREE.Mesh(cubeGeo, mat);
            cube.position.set(
                c.x + (ix - N / 2) * GS + GS / 2,
                c.y + 0.5,
                c.z + (iz - N / 2) * GS + GS / 2,
            );
            cube.userData.floatOffset = frac * Math.PI * 2;
            cube.userData.pulseSpeed = 0.5 + Math.random() * 1.5;
            cube.userData.mat = mat;
            g.add(cube);
        }
    }

    // Wave plane
    const waveGeo = new THREE.PlaneGeometry(30, 30, 60, 60);
    waveGeo.rotateX(-Math.PI / 2);
    const waveMat = new THREE.MeshPhysicalMaterial({
        color, emissive: new THREE.Color(color), emissiveIntensity: 0.07,
        metalness: 0.15, roughness: 0.05, transparent: true, opacity: 0.55,
        wireframe: false,
    });
    const wave = new THREE.Mesh(waveGeo, waveMat);
    wave.position.copy(c).setY(c.y - 2);
    wave.userData.isWave = true;
    wave.userData.origPositions = waveGeo.attributes.position.array.slice();
    g.add(wave);

    // Wireframe grid over wave
    const wgGeo = new THREE.PlaneGeometry(30, 30, 30, 30);
    wgGeo.rotateX(-Math.PI / 2);
    const wgMat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.1 });
    const wg = new THREE.Mesh(wgGeo, wgMat);
    wg.position.copy(c).setY(c.y - 1.9);
    g.add(wg);

    // Rising particle column
    const pCount = 800;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 10;
        pPos[i * 3] = c.x + Math.cos(theta) * r;
        pPos[i * 3 + 1] = c.y + Math.random() * 18;
        pPos[i * 3 + 2] = c.z + Math.sin(theta) * r;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    g.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color, size: 0.07, transparent: true, opacity: 0.65 })));

    g.add(makeTextSprite('WebGPU', c.clone().add(new THREE.Vector3(0, 12, 0)), 2.6, '#9b5de5'));
    return g;
}

// ── Scene 3 · Three.js ────────────────────────────────────────────────────────
// Layered geometry showcase: central gem + shader planes + orbiting elements
function buildThreeJSScene(c, color) {
    const g = new THREE.Group();
    const light1 = new THREE.PointLight(color, 100, 60);
    light1.position.copy(c).add(new THREE.Vector3(-4, 8, 4));
    g.add(light1);
    const light2 = new THREE.PointLight(0xffffff, 50, 40);
    light2.position.copy(c).add(new THREE.Vector3(8, 3, -4));
    g.add(light2);

    // Central "gem" — double icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(2.8, 2);
    const icoMat = new THREE.MeshPhysicalMaterial({
        color, emissive: new THREE.Color(color), emissiveIntensity: 0.08,
        metalness: 0.95, roughness: 0.02,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.copy(c).setY(c.y + 2.5);
    ico.userData.rotSpeed = new THREE.Vector3(0.08, 0.22, 0.05);
    g.add(ico);

    const wireIco = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.95, 1),
        new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.18 }),
    );
    wireIco.position.copy(ico.position);
    wireIco.userData.rotSpeed = new THREE.Vector3(-0.05, 0.14, 0.03);
    g.add(wireIco);

    // Vertex shader / fragment shader plane — like GPU stage cards
    const cardData = [
        { label: 'Vertex\nShader', col: '#4cc9f0', offset: new THREE.Vector3(-5.5, 3, -1) },
        { label: 'Fragment\nShader', col: '#f72585', offset: new THREE.Vector3(5.5, 3, -1) },
    ];
    cardData.forEach(cd => {
        const cardGeo = new THREE.PlaneGeometry(3, 2.2);
        const cardMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(cd.col), emissive: new THREE.Color(cd.col),
            emissiveIntensity: 0.15, metalness: 0.5, roughness: 0.3,
            transparent: true, opacity: 0.7, side: THREE.DoubleSide,
        });
        const card = new THREE.Mesh(cardGeo, cardMat);
        card.position.copy(c).add(cd.offset);
        card.rotation.y = cd.offset.x > 0 ? -0.4 : 0.4;
        g.add(card);
        g.add(makeTextSprite(cd.label, card.position.clone().add(new THREE.Vector3(0, 0, 0.2)), 0.85, cd.col));
    });

    // Orbiting mini spheres (ecosystem dots)
    const orbitColors = [0xf72585, 0x4cc9f0, 0x9b5de5, 0xff8c42, 0x4361ee, 0x7fff00];
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const s = new THREE.Mesh(
            new THREE.SphereGeometry(0.22, 16, 16),
            new THREE.MeshStandardMaterial({ color: orbitColors[i], emissive: orbitColors[i], emissiveIntensity: 2 }),
        );
        s.userData.orbitRadius = 5.5;
        s.userData.orbitAngle = angle;
        s.userData.orbitSpeed = 0.28 + i * 0.04;
        s.userData.orbitCenter = ico.position;
        g.add(s);
    }

    // Ground grid
    const grid = new THREE.GridHelper(35, 22, color, color);
    grid.position.copy(c).setY(c.y + 0.1);
    const gm = Array.isArray(grid.material) ? grid.material : [grid.material];
    gm.forEach(m => { m.transparent = true; m.opacity = 0.1; });
    g.add(grid);

    g.add(makeTextSprite('Three.js', c.clone().add(new THREE.Vector3(0, 8.5, 0)), 3.0, '#f72585'));
    g.add(makeTextSprite('r3f · Drei · Babylon.js · A-Frame · PlayCanvas', c.clone().add(new THREE.Vector3(0, 6.8, 0)), 0.9, 'rgba(247,37,133,0.55)'));
    return g;
}

// ── Scene 4 · L'avenir / WebXR ────────────────────────────────────────────────
// Futuristic: VR visor ring + expanding holographic grid + XR panels
function buildAvenirScene(c, color) {
    const g = new THREE.Group();
    const light = new THREE.PointLight(color, 120, 70);
    light.position.copy(c).add(new THREE.Vector3(0, 8, 0));
    g.add(light);
    const light2 = new THREE.PointLight(0xaadeff, 40, 40);
    light2.position.copy(c).add(new THREE.Vector3(0, 0, 5));
    g.add(light2);

    // VR visor / headset ring
    const visorGeo = new THREE.TorusGeometry(4.5, 0.18, 12, 120);
    const visorMat = new THREE.MeshPhysicalMaterial({
        color, emissive: new THREE.Color(color), emissiveIntensity: 0.6,
        metalness: 0.9, roughness: 0.05,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.copy(c).setY(c.y + 3);
    visor.rotation.x = Math.PI / 2.5;
    visor.userData.rotSpeed = new THREE.Vector3(0, 0.12, 0);
    g.add(visor);

    // Inner ring (AR)
    const arGeo = new THREE.TorusGeometry(2.5, 0.08, 8, 80);
    const arMat = new THREE.MeshStandardMaterial({ color: 0x7df9ff, emissive: 0x7df9ff, emissiveIntensity: 1.2 });
    const arRing = new THREE.Mesh(arGeo, arMat);
    arRing.position.copy(visor.position);
    arRing.rotation.copy(visor.rotation);
    arRing.userData.rotSpeed = new THREE.Vector3(0, -0.2, 0);
    g.add(arRing);

    // Holographic XR panels (floating cards)
    const panelLabels = ['WebXR API', 'AR Mode', 'VR Mode', 'Spatial UI'];
    panelLabels.forEach((label, i) => {
        const angle = (i / panelLabels.length) * Math.PI * 2 + Math.PI / 4;
        const r = 7;
        const panelPos = c.clone().add(new THREE.Vector3(Math.cos(angle) * r, 3 + i * 0.5, Math.sin(angle) * r));
        const pGeo = new THREE.PlaneGeometry(2.8, 1.6);
        const pMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color), emissive: new THREE.Color(color),
            emissiveIntensity: 0.25, transparent: true, opacity: 0.45, side: THREE.DoubleSide,
        });
        const panel = new THREE.Mesh(pGeo, pMat);
        panel.position.copy(panelPos);
        panel.lookAt(c.clone().setY(panelPos.y));
        panel.userData.floatOffset = i * Math.PI * 0.5;
        g.add(panel);
        g.add(makeTextSprite(label, panelPos.clone().add(new THREE.Vector3(0, 0, 0.1)), 0.85, '#7df9ff'));
    });

    // Expanding holographic floor grid
    const hGrid = new THREE.GridHelper(50, 30, color, color);
    hGrid.position.copy(c).setY(c.y - 0.5);
    const hm = Array.isArray(hGrid.material) ? hGrid.material : [hGrid.material];
    hm.forEach(m => { m.transparent = true; m.opacity = 0.15; });
    g.add(hGrid);

    // Particle burst
    const pbCount = 600;
    const pbGeo = new THREE.BufferGeometry();
    const pbPos = new Float32Array(pbCount * 3);
    for (let i = 0; i < pbCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 5 + Math.random() * 12;
        pbPos[i * 3] = c.x + r * Math.sin(phi) * Math.cos(theta);
        pbPos[i * 3 + 1] = c.y + r * Math.sin(phi) * Math.sin(theta);
        pbPos[i * 3 + 2] = c.z + r * Math.cos(phi);
    }
    pbGeo.setAttribute('position', new THREE.BufferAttribute(pbPos, 3));
    g.add(new THREE.Points(pbGeo, new THREE.PointsMaterial({ color, size: 0.08, transparent: true, opacity: 0.55 })));

    g.add(makeTextSprite("L'avenir", c.clone().add(new THREE.Vector3(0, 10.5, 0)), 2.6, '#4361ee'));
    g.add(makeTextSprite('WebXR · AR · VR · Spatial Computing', c.clone().add(new THREE.Vector3(0, 9, 0)), 1.0, 'rgba(67,97,238,0.65)'));
    return g;
}

// ─── STARFIELD ────────────────────────────────────────────────────────────────
function buildStarfield() {
    const count = 5000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 500;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 250;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 500;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.5 })));
}

// ─── TEXT SPRITE ──────────────────────────────────────────────────────────────
function makeTextSprite(text, position, fontSize, fillStyle) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1024, 256);
    const lines = text.split('\n');
    const lineH = Math.round(fontSize * 18 * 4 / 4) / lines.length;
    ctx.fillStyle = fillStyle;
    ctx.font = `bold ${Math.round(fontSize * 17)}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    lines.forEach((line, li) => {
        const y = canvas.height / 2 + (li - (lines.length - 1) / 2) * (lineH * 1.15);
        ctx.fillText(line, 512, y);
    });
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const spr = new THREE.Sprite(mat);
    spr.scale.set(fontSize * 3.8, fontSize * 0.95, 1);
    spr.position.copy(position);
    return spr;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HUD
// ═══════════════════════════════════════════════════════════════════════════════

function buildHUD(container) {
    // Progress bar
    hudProgress = document.createElement('div');
    hudProgress.className = 'pres-progress';
    container.appendChild(hudProgress);

    // Title block
    const block = document.createElement('div');
    block.className = 'pres-title-block';
    container.appendChild(block);

    hudSubjectLine = document.createElement('span');
    hudSubjectLine.className = 'pres-subject-line';
    block.appendChild(hudSubjectLine);

    hudTitle = document.createElement('h1');
    hudTitle.className = 'pres-title';
    block.appendChild(hudTitle);

    hudSubtitle = document.createElement('p');
    hudSubtitle.className = 'pres-subtitle';
    block.appendChild(hudSubtitle);

    hudSubProgress = document.createElement('span');
    hudSubProgress.className = 'pres-sub-progress';
    block.appendChild(hudSubProgress);

    hudBullets = document.createElement('ul');
    hudBullets.className = 'pres-bullets';
    block.appendChild(hudBullets);

    // Dots — grouped by subject
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'pres-dots';
    container.appendChild(dotsWrap);

    let lastSubject = -1;
    SLIDES.forEach((slide, i) => {
        if (slide.subjectNum !== lastSubject) {
            if (lastSubject !== -1) {
                const sep = document.createElement('div');
                sep.className = 'pres-dot-sep';
                dotsWrap.appendChild(sep);
            }
            lastSubject = slide.subjectNum;
        }
        const dot = document.createElement('button');
        dot.className = 'pres-dot';
        dot.setAttribute('aria-label', `${slide.title}`);
        dot.style.setProperty('--accent', slide.color);
        dot.addEventListener('click', () => jumpToSlide(i));
        dotsWrap.appendChild(dot);
        hudDots.push(dot);
    });

    // Scroll hint
    const hint = document.createElement('div');
    hint.className = 'pres-scroll-hint';
    hint.innerHTML = '<span>↓ Défiler pour naviguer</span>';
    container.appendChild(hint);
}

function updateHUD(slideIndex, force = false) {
    if (slideIndex === activeSlide && !force) return;
    activeSlide = slideIndex;
    const slide = SLIDES[slideIndex];

    hudSubjectLine.textContent = `Partie ${slide.subjectNum}/5 — ${slide.subject}`;
    hudSubjectLine.style.color = slide.color;

    hudTitle.textContent = slide.title;
    hudTitle.style.color = slide.color;
    hudTitle.style.textShadow = `0 0 60px ${slide.color}88`;

    hudSubtitle.textContent = slide.subtitle;

    // Sub-slide progress pill
    if (slide.tot > 1) {
        hudSubProgress.textContent = `${slide.idx} / ${slide.tot}`;
        hudSubProgress.style.borderColor = slide.color + '66';
        hudSubProgress.style.color = slide.color;
        hudSubProgress.style.display = 'inline-block';
    } else {
        hudSubProgress.style.display = 'none';
    }

    // Bullet points
    hudBullets.innerHTML = '';
    if (slide.bullets && slide.bullets.length > 0) {
        slide.bullets.forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            hudBullets.appendChild(li);
        });
    }

    hudDots.forEach((dot, i) => dot.classList.toggle('active', i === slideIndex));
    hudProgress.style.width = `${(slideIndex / (SLIDES.length - 1)) * 100}%`;
    hudProgress.style.background = `linear-gradient(to right, ${slide.color}55, ${slide.color})`;

    const hint = document.querySelector('.pres-scroll-hint');
    if (hint && slideIndex > 0) hint.style.opacity = '0';
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL / NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

function nudgeScroll(delta) {
    targetT = THREE.MathUtils.clamp(targetT + delta / (300 * (SLIDES.length - 1)), 0, 1);
}
function onWheel(e) { e.preventDefault(); nudgeScroll(e.deltaY); }
function jumpToSlide(i) { targetT = i / (SLIDES.length - 1); }

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION LOOP
// ═══════════════════════════════════════════════════════════════════════════════

function animate() {
    animId = requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const elapsed = clock.elapsedTime;

    scrollT = THREE.MathUtils.lerp(scrollT, targetT, 0.055);
    updateCameraFromT(scrollT);

    const raw = scrollT * (SLIDES.length - 1);
    updateHUD(Math.max(0, Math.min(Math.round(raw), SLIDES.length - 1)));

    // Animate all scene objects
    sceneGroups.forEach(group => {
        group.traverse(child => {
            if (!child.isMesh && !child.isPoints) return;

            if (child.userData.rotSpeed) {
                child.rotation.x += child.userData.rotSpeed.x * dt;
                child.rotation.y += child.userData.rotSpeed.y * dt;
                child.rotation.z += child.userData.rotSpeed.z * dt;
            }

            if (child.userData.orbitRadius !== undefined) {
                child.userData.orbitAngle += child.userData.orbitSpeed * dt;
                const oc = child.userData.orbitCenter;
                child.position.set(
                    oc.x + Math.cos(child.userData.orbitAngle) * child.userData.orbitRadius,
                    oc.y + Math.sin(child.userData.orbitAngle * 0.5) * 0.7,
                    oc.z + Math.sin(child.userData.orbitAngle) * child.userData.orbitRadius,
                );
            }

            if (child.userData.floatOffset !== undefined && child.userData.orbitRadius === undefined) {
                child.position.y += Math.sin(elapsed * 0.9 + child.userData.floatOffset) * 0.003;
            }

            if (child.userData.pulseSpeed && child.userData.mat) {
                child.userData.mat.emissiveIntensity = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(elapsed * child.userData.pulseSpeed + child.userData.floatOffset));
            }

            if (child.userData.isWave) {
                const pos = child.geometry.attributes.position;
                const orig = child.userData.origPositions;
                for (let i = 0; i < pos.count; i++) {
                    const ox = orig[i * 3];
                    const oz = orig[i * 3 + 2];
                    pos.setY(i, orig[i * 3 + 1]
                        + Math.sin(ox * 0.3 + elapsed * 1.1) * 0.65
                        + Math.cos(oz * 0.3 + elapsed * 0.85) * 0.65,
                    );
                }
                pos.needsUpdate = true;
                child.geometry.computeVertexNormals();
            }

            if (child.userData.pipelineStream) {
                const { phaseArr, center } = child.userData.pipelineStream;
                const pos = child.geometry.attributes.position;
                const speed = 0.12; // cycles per second
                for (let i = 0; i < phaseArr.length; i++) {
                    phaseArr[i] = (phaseArr[i] + speed * dt) % 1;
                    const xOff = -8 + phaseArr[i] * 16;
                    const yOff = 2 + Math.sin(phaseArr[i] * Math.PI * 6 + elapsed * 3) * 0.2;
                    pos.setX(i, center.x + xOff);
                    pos.setY(i, center.y + yOff);
                }
                pos.needsUpdate = true;
            }
        });
    });

    renderer.render(scene, camera);
}

function updateCameraFromT(t) {
    const ct = THREE.MathUtils.clamp(t, 0.0001, 0.9999);
    const pos = curve.getPoint(ct);
    camera.position.copy(pos);

    const raw = ct * (SLIDES.length - 1);
    const iA = Math.floor(raw);
    const iB = Math.min(iA + 1, SLIDES.length - 1);
    const frac = raw - iA;
    camera.lookAt(SLIDES[iA].look.clone().lerp(SLIDES[iB].look, frac));
}

// ─── RESIZE / CLEANUP ─────────────────────────────────────────────────────────
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export function destroyPresentation() {
    cancelAnimationFrame(animId);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
}
