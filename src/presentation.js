import * as THREE from 'three';


// ─── PALETTE ─────────────────────────────────────────────────────────────────
const P = {
    plugin: '#c9a55a',
    webgl: '#3dd6c8',
    webgpu: '#8c6ef0',
    three: '#f23a5d',
    avenir: '#2eb8f5',
};
const HX = {
    plugin: 0xc9a55a,
    webgl: 0x3dd6c8,
    webgpu: 0x8c6ef0,
    three: 0xf23a5d,
    avenir: 0x2eb8f5,
};

// ─── SLIDES ──────────────────────────────────────────────────────────────────
const SLIDES = [
    {
        sceneId: 0, subjectNum: 1, tot: 1, idx: 1,
        subject: "L'ère des plugins", title: "L'ère des plugins",
        subtitle: "Flash · Silverlight · Java Applets — le web 3D avant 2011",
        color: P.plugin, hx: HX.plugin
    },

    {
        sceneId: 1, subjectNum: 2, tot: 3, idx: 1,
        subject: "L'arrivée de WebGL", title: "L'arrivée de WebGL",
        subtitle: "2011 : le rendu GPU natif directement dans le navigateur",
        color: P.webgl, hx: HX.webgl
    },

    {
        sceneId: 1, subjectNum: 2, tot: 3, idx: 2,
        subject: "L'arrivée de WebGL", title: "Son pipeline graphique",
        subtitle: "Vertex Shader → Rasterisation → Fragment Shader → Framebuffer",
        color: P.webgl, hx: HX.webgl
    },

    {
        sceneId: 1, subjectNum: 2, tot: 3, idx: 3,
        subject: "L'arrivée de WebGL", title: "La transition",
        subtitle: "De plugins propriétaires à un standard ouvert du W3C",
        color: P.webgl, hx: HX.webgl
    },

    {
        sceneId: 2, subjectNum: 3, tot: 1, idx: 1,
        subject: "La révolution de WebGPU", title: "La révolution de WebGPU",
        subtitle: "Compute shaders, accès bas niveau — le GPU sans contrainte",
        color: P.webgpu, hx: HX.webgpu
    },

    {
        sceneId: 3, subjectNum: 4, tot: 4, idx: 1,
        subject: "Three.js", title: "Three.js",
        subtitle: "L'abstraction WebGL open-source la plus utilisée au monde",
        color: P.three, hx: HX.three
    },

    {
        sceneId: 3, subjectNum: 4, tot: 4, idx: 2,
        subject: "Three.js", title: "Vertex & Fragment Shader",
        subtitle: "Les deux étapes clés du pipeline GPU",
        color: P.three, hx: HX.three
    },

    {
        sceneId: 3, subjectNum: 4, tot: 4, idx: 3,
        subject: "Three.js", title: "Coder avec Three.js",
        subtitle: "Scene · Camera · Renderer — en quelques lignes",
        color: P.three, hx: HX.three
    },

    {
        sceneId: 3, subjectNum: 4, tot: 4, idx: 4,
        subject: "Three.js", title: "Les autres alternatives",
        subtitle: "Babylon.js · PlayCanvas · A-Frame · React Three Fiber",
        color: P.three, hx: HX.three
    },

    {
        sceneId: 4, subjectNum: 5, tot: 3, idx: 1,
        subject: "L'avenir de l'écosystème", title: "L'avenir de l'écosystème",
        subtitle: "Où va le web 3D dans les prochaines années ?",
        color: P.avenir, hx: HX.avenir
    },

    {
        sceneId: 4, subjectNum: 5, tot: 3, idx: 2,
        subject: "L'avenir de l'écosystème", title: "Les limites actuelles",
        subtitle: "Complexité d'accès, adoption fragmentée, debugging difficile",
        color: P.avenir, hx: HX.avenir
    },

    {
        sceneId: 4, subjectNum: 5, tot: 3, idx: 3,
        subject: "L'avenir de l'écosystème", title: "WebXR",
        subtitle: "AR & VR natives dans le navigateur — sans installation",
        color: P.avenir, hx: HX.avenir
    },
];

// ─── PER-SCENE CAMERA POSITIONS (subtle, close) ───────────────────────────────
const SCENE_CAMS = [
    { pos: new THREE.Vector3(0, 0.3, 10.0), look: new THREE.Vector3(0, 0.3, 0) }, // plugin
    { pos: new THREE.Vector3(0, 0.8, 9.5), look: new THREE.Vector3(0, 1.0, 0) }, // webgl
    { pos: new THREE.Vector3(0.4, 0.0, 10.0), look: new THREE.Vector3(0, 0.0, 0) }, // webgpu
    { pos: new THREE.Vector3(0, 1.5, 8.5), look: new THREE.Vector3(0, 1.5, 0) }, // three.js
    { pos: new THREE.Vector3(-0.3, 0.3, 10.5), look: new THREE.Vector3(0, 0.3, 0) }, // avenir
];

// Horizontal stride between inactive scene groups
const STRIDE = 40;

// ─── STATE ───────────────────────────────────────────────────────────────────
let renderer, scene, camera, clock, animId;
let targetSlide = 0;
let slideT = 0;
let sceneFloat = 0;
let activeSlide = -1;
let wheelLock = false;

let sceneGroups = new Map(); // sceneId → THREE.Group

// HUD refs
let hudProgress, hudSlideNum, hudSceneLabel;
let hudSubjectLine, hudTitle, hudSubtitle, hudSubProgress;
let hudDots = [];

// ─── INIT ─────────────────────────────────────────────────────────────────────
export function initPresentation(container) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08080f);
    // very subtle near fog only — no deep-space feeling
    scene.fog = new THREE.Fog(0x08080f, 28, 60);

    camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 150);
    camera.position.set(0, 0.3, 10);
    camera.lookAt(0, 0.3, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    clock = new THREE.Clock();
    scene.add(new THREE.AmbientLight(0xffffff, 0.04));

    const builders = [
        buildPluginScene, buildWebGLScene, buildWebGPUScene,
        buildThreeJSScene, buildAvenirScene,
    ];
    SLIDES.forEach(s => {
        if (!sceneGroups.has(s.sceneId)) {
            const g = builders[s.sceneId](s.hx);
            g.position.x = s.sceneId * STRIDE;
            scene.add(g);
            sceneGroups.set(s.sceneId, g);
        }
    });

    buildHUD(container);
    updateHUD(0, true);


    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);

    let ty0 = null;
    window.addEventListener('touchstart', e => { ty0 = e.touches[0].clientY; });
    window.addEventListener('touchmove', e => {
        if (ty0 === null) return;
        const dy = ty0 - e.touches[0].clientY;
        if (Math.abs(dy) > 38) { nudge(dy > 0 ? 1 : -1); ty0 = e.touches[0].clientY; }
        e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchend', () => { ty0 = null; });

    animate();
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
function nudge(dir) {
    targetSlide = Math.max(0, Math.min(SLIDES.length - 1, targetSlide + dir));
}
function onWheel(e) {
    e.preventDefault();
    if (wheelLock) return;
    nudge(e.deltaY > 0 ? 1 : -1);
    wheelLock = true;
    setTimeout(() => { wheelLock = false; }, 680);
}
function onKey(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nudge(1);
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') nudge(-1);
}
function jumpTo(i) { targetSlide = i; }

// ─── ANIMATION ───────────────────────────────────────────────────────────────
function animate() {
    animId = requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const elapsed = clock.elapsedTime;

    slideT = THREE.MathUtils.lerp(slideT, targetSlide, 0.08);

    const rs = Math.max(0, Math.min(Math.round(slideT), SLIDES.length - 1));
    if (rs !== activeSlide) updateHUD(rs);

    const iA = Math.min(Math.floor(slideT), SLIDES.length - 1);
    const iB = Math.min(iA + 1, SLIDES.length - 1);
    const fr = slideT - iA;
    const tSF = SLIDES[iA].sceneId + (SLIDES[iB].sceneId - SLIDES[iA].sceneId) * fr;
    sceneFloat = THREE.MathUtils.lerp(sceneFloat, tSF, 0.08);

    sceneGroups.forEach((g, id) => {
        const tx = (id - sceneFloat) * STRIDE;
        g.position.x = THREE.MathUtils.lerp(g.position.x, tx, 0.10);
    });

    const cA = Math.min(Math.floor(sceneFloat), SCENE_CAMS.length - 1);
    const cB = Math.min(Math.ceil(sceneFloat), SCENE_CAMS.length - 1);
    const cf = sceneFloat - Math.floor(sceneFloat);
    const tPos = new THREE.Vector3().lerpVectors(SCENE_CAMS[cA].pos, SCENE_CAMS[cB].pos, cf);
    const tLook = new THREE.Vector3().lerpVectors(SCENE_CAMS[cA].look, SCENE_CAMS[cB].look, cf);
    tPos.x += Math.sin(elapsed * 0.23) * 0.07;
    tPos.y += Math.sin(elapsed * 0.37) * 0.05;
    camera.position.lerp(tPos, 0.04);
    camera.lookAt(tLook);

    sceneGroups.forEach(g => {
        g.traverse(child => {
            if (!child.isMesh && !child.isPoints && !child.isLine) return;
            if (child.userData.rotSpeed) {
                child.rotation.x += child.userData.rotSpeed.x * dt;
                child.rotation.y += child.userData.rotSpeed.y * dt;
                child.rotation.z += child.userData.rotSpeed.z * dt;
            }

            if (child.userData.orbitData) {
                const od = child.userData.orbitData;
                od.angle += od.speed * dt;
                child.position.set(
                    od.cx + Math.cos(od.angle) * od.r,
                    od.cy + Math.sin(od.angle * 0.6) * 0.5,
                    od.cz + Math.sin(od.angle) * od.r,
                );
            }

            if (child.userData.floatBase !== undefined) {
                child.position.y = child.userData.floatBase +
                    Math.sin(elapsed * 0.65 + child.userData.floatOffset) * child.userData.floatAmp;
            }
            if (child.userData.pipeStream) {
                const { phases } = child.userData.pipeStream;
                const pos = child.geometry.attributes.position;
                const speed = 0.11;
                for (let i = 0; i < phases.length; i++) {
                    phases[i] = (phases[i] + speed * dt) % 1;
                    const x = -7.5 + phases[i] * 15;
                    const y = 1.5 + Math.sin(phases[i] * Math.PI * 6 + elapsed * 2.5) * 0.18;
                    pos.setXY(i, x, y);
                }
                pos.needsUpdate = true;
            }

            if (child.userData.computeGrid && child.userData.mat) {
                child.userData.mat.emissiveIntensity =
                    0.35 + 0.65 * (0.5 + 0.5 * Math.sin(elapsed * child.userData.pulseF + child.userData.phaseOff));
            }
            if (child.userData.isWave) {
                const pos = child.geometry.attributes.position;
                const orig = child.userData.origPositions;
                for (let i = 0; i < pos.count; i++) {
                    const ox = orig[i * 3];
                    const oz = orig[i * 3 + 2];
                    pos.setY(i, orig[i * 3 + 1]
                        + Math.sin(ox * 0.45 + elapsed * 1.1) * 0.55
                        + Math.cos(oz * 0.45 + elapsed * 0.85) * 0.45);
                }
                pos.needsUpdate = true;
                child.geometry.computeVertexNormals();
            }
        });
    });

    renderer.render(scene, camera);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE BUILDERS   
// ═══════════════════════════════════════════════════════════════════════════════

// ── Scene 0 · Plugin Era ─── "Broken Screen" ──────────────────────────────────
function buildPluginScene(hx) {
    const g = new THREE.Group();
    const col = new THREE.Color(hx);
    const rgb = hexRGB(hx);

    // Large deformed wireframe grid filling the frame
    const gGeo = new THREE.PlaneGeometry(13, 8.5, 22, 14);
    const gPos = gGeo.attributes.position;
    for (let i = 0; i < gPos.count; i++) {
        const glitch = Math.random() > 0.85 ? 1.8 : 1;
        gPos.setZ(i, (Math.random() - 0.5) * 0.55 * glitch);
    }
    gGeo.computeVertexNormals();
    g.add(new THREE.Mesh(gGeo, new THREE.MeshBasicMaterial({
        color: hx, wireframe: true, transparent: true, opacity: 0.38,
    })));

    // Dark fill behind grid
    const bg = new THREE.Mesh(
        new THREE.PlaneGeometry(13, 8.5),
        new THREE.MeshBasicMaterial({ color: 0x060408, transparent: true, opacity: 0.92, side: THREE.DoubleSide })
    );
    bg.position.z = -0.18;
    g.add(bg);

    // Glitch scan-line strips
    for (let i = 0; i < 5; i++) {
        const h = 0.04 + Math.random() * 0.12;
        const strip = new THREE.Mesh(
            new THREE.PlaneGeometry(13, h),
            new THREE.MeshBasicMaterial({ color: hx, transparent: true, opacity: 0.08 + Math.random() * 0.12 })
        );
        strip.position.set(0, (Math.random() - 0.5) * 8, -0.05);
        g.add(strip);
    }

    // Scattered broken box fragments
    for (let i = 0; i < 12; i++) {
        const s = 0.12 + Math.random() * 0.52;
        const box = wireBox(s, s, s, hx, 0.22 + Math.random() * 0.48);
        box.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 9.5,
            0.5 + Math.random() * 3.5,
        );
        box.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        box.userData.rotSpeed = new THREE.Vector3(
            (Math.random() - 0.5) * 0.22, (Math.random() - 0.5) * 0.22, 0,
        );
        g.add(box);
    }

    // Plugin ghost labels
    ['FLASH', 'SILVERLIGHT', 'JAVA\nAPPLET', 'ActiveX', 'VRML'].forEach((name, i) => {
        const a = (i / 5) * Math.PI * 2;
        const r = 3.0 + (i % 2) * 1.8;
        g.add(makeTextSprite(name,
            new THREE.Vector3(Math.cos(a) * r * 1.5, Math.sin(a) * 2.5, 1),
            0.62, `rgba(${rgb}, 0.5)`));
    });

    // Error cross
    const xMat = new THREE.LineBasicMaterial({ color: hx, transparent: true, opacity: 0.75 });
    [[1], [- 1]].forEach(([d]) => {
        const pts = [new THREE.Vector3(-0.8, -0.8 * d, 2), new THREE.Vector3(0.8, 0.8 * d, 2)];
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), xMat));
    });

    // Light
    const pl = new THREE.PointLight(hx, 50, 20);
    pl.position.set(0, 4, 4);
    g.add(pl);
    return g;
}

// ── Scene 1 · WebGL ─── "Pipeline" ───────────────────────────────────────────
function buildWebGLScene(hx) {
    const g = new THREE.Group();
    const rgb = hexRGB(hx);

    const stages = [
        { label: 'CPU', sub: 'données', x: -7 },
        { label: 'VERTEX', sub: 'shader', x: -3.5 },
        { label: 'RASTER', sub: '→ pixels', x: 0 },
        { label: 'FRAGMENT', sub: 'shader', x: 3.5 },
        { label: 'BUFFER', sub: 'écran', x: 7 },
    ];

    const BW = 2.4, BH = 1.6, BD = 0.45;

    stages.forEach((st, i) => {
        const frac = i / (stages.length - 1);
        const stageHex = new THREE.Color().setHSL(0.47 - frac * 0.08, 0.85, 0.58);
        const stageHxN = (Math.round(stageHex.r * 255) << 16) | (Math.round(stageHex.g * 255) << 8) | Math.round(stageHex.b * 255);

        // Wireframe box
        const box = wireBox(BW, BH, BD, stageHxN, 0.65);
        box.position.set(st.x, 1.5, 0);
        g.add(box);

        // Faint solid fill
        const solid = new THREE.Mesh(
            new THREE.BoxGeometry(BW, BH, BD),
            new THREE.MeshStandardMaterial({
                color: new THREE.Color(stageHex).multiplyScalar(0.12),
                emissive: stageHex, emissiveIntensity: 0.06,
                transparent: true, opacity: 0.3,
            })
        );
        solid.position.copy(box.position);
        g.add(solid);

        // Stage label
        g.add(makeTextSprite(st.label, new THREE.Vector3(st.x, 1.5, 0.5), 0.62, `#fff`));
        g.add(makeTextSprite(st.sub, new THREE.Vector3(st.x, 0.42, 0), 0.48, `rgba(${rgb}, 0.5)`));

        // Connector
        if (i < stages.length - 1) {
            const nx = stages[i + 1].x;
            g.add(makeLine([
                new THREE.Vector3(st.x + BW / 2, 1.5, 0),
                new THREE.Vector3(nx - BW / 2, 1.5, 0),
            ], hx, 0.45));
            // Arrow tip
            g.add(makeLine([
                new THREE.Vector3(nx - BW / 2 - 0.3, 1.78, 0),
                new THREE.Vector3(nx - BW / 2, 1.5, 0),
                new THREE.Vector3(nx - BW / 2 - 0.3, 1.22, 0),
            ], hx, 0.55));
        }
    });

    // Flowing particle stream
    const N = 450;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(N * 3);
    const phases = new Float32Array(N);
    for (let i = 0; i < N; i++) {
        phases[i] = Math.random();
        pPos[i * 3] = -7.5 + phases[i] * 15;
        pPos[i * 3 + 1] = 1.5;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const stream = new THREE.Points(pGeo, new THREE.PointsMaterial({
        color: hx, size: 0.07, transparent: true, opacity: 0.9,
    }));
    stream.userData.pipeStream = { phases };
    g.add(stream);

    // Thin ground rule
    g.add(makeLine([new THREE.Vector3(-10, 0.3, 0), new THREE.Vector3(10, 0.3, 0)], hx, 0.12));

    // Light
    const pl = new THREE.PointLight(hx, 60, 25);
    pl.position.set(0, 6, 5);
    g.add(pl);
    return g;
}

// ── Scene 2 · WebGPU ─── "Compute" ───────────────────────────────────────────
function buildWebGPUScene(hx) {
    const g = new THREE.Group();

    // Large wireframe icosahedron (main hero)
    const icoGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const icoWire = new THREE.Mesh(icoGeo, new THREE.MeshBasicMaterial({
        color: hx, wireframe: true, transparent: true, opacity: 0.32,
    }));
    icoWire.position.set(0, 0, -2.5);
    icoWire.userData.rotSpeed = new THREE.Vector3(0.035, 0.065, 0.018);
    g.add(icoWire);

    // Faint solid fill inside icosahedron
    const icoSolid = new THREE.Mesh(
        new THREE.IcosahedronGeometry(4.1, 1),
        new THREE.MeshPhysicalMaterial({
            color: 0x04020c,
            emissive: new THREE.Color(hx), emissiveIntensity: 0.07,
            transparent: true, opacity: 0.55,
            metalness: 0.9, roughness: 0.15,
        })
    );
    icoSolid.position.copy(icoWire.position);
    icoSolid.userData.rotSpeed = icoWire.userData.rotSpeed;
    g.add(icoSolid);

    // Compute grid (8×7 glowing nodes) layered in front
    const NX = 8, NZ = 7, GS = 0.88;
    const cubeGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    for (let ix = 0; ix < NX; ix++) {
        for (let iz = 0; iz < NZ; iz++) {
            const frac = (ix * NZ + iz) / (NX * NZ);
            const nc = new THREE.Color().setHSL(0.68 + frac * 0.14, 0.9, 0.6);
            const mat = new THREE.MeshStandardMaterial({
                color: nc, emissive: nc, emissiveIntensity: 0.8,
                metalness: 0.2, roughness: 0.35,
            });
            const cube = new THREE.Mesh(cubeGeo, mat);
            cube.position.set(
                (ix - NX / 2 + 0.5) * GS,
                (iz - NZ / 2 + 0.5) * GS * 0.72,
                1.8,
            );
            cube.userData.computeGrid = true;
            cube.userData.mat = mat;
            cube.userData.pulseF = 0.4 + Math.random() * 1.8;
            cube.userData.phaseOff = frac * Math.PI * 2;
            g.add(cube);

            // Horizontal connector
            if (ix < NX - 1) {
                g.add(makeLine([
                    new THREE.Vector3((ix - NX / 2 + 0.5) * GS, (iz - NZ / 2 + 0.5) * GS * 0.72, 1.8),
                    new THREE.Vector3((ix + 1 - NX / 2 + 0.5) * GS, (iz - NZ / 2 + 0.5) * GS * 0.72, 1.8),
                ], hx, 0.07));
            }
            // Vertical connector
            if (iz < NZ - 1) {
                g.add(makeLine([
                    new THREE.Vector3((ix - NX / 2 + 0.5) * GS, (iz - NZ / 2 + 0.5) * GS * 0.72, 1.8),
                    new THREE.Vector3((ix - NX / 2 + 0.5) * GS, (iz + 1 - NZ / 2 + 0.5) * GS * 0.72, 1.8),
                ], hx, 0.07));
            }
        }
    }

    // Light
    const pl = new THREE.PointLight(hx, 90, 28);
    pl.position.set(0, 6, 5);
    g.add(pl);
    return g;
}

// ── Scene 3 · Three.js ─── "Gem + Ecosystem" ─────────────────────────────────
function buildThreeJSScene(hx) {
    const g = new THREE.Group();
    const col = new THREE.Color(hx);
    const icoC = new THREE.Vector3(0, 1.5, 0);

    // Central icosahedron — metallic gem
    const icoMat = new THREE.MeshPhysicalMaterial({
        color: col.clone().multiplyScalar(0.25),
        emissive: col, emissiveIntensity: 0.14,
        metalness: 0.97, roughness: 0.04,
        transparent: true, opacity: 0.88,
    });
    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(3.0, 2), icoMat);
    ico.position.copy(icoC);
    ico.userData.rotSpeed = new THREE.Vector3(0.055, 0.175, 0.035);
    g.add(ico);

    // Wire overlay (counter-rotate)
    const wireIco = new THREE.Mesh(
        new THREE.IcosahedronGeometry(3.18, 1),
        new THREE.MeshBasicMaterial({ color: hx, wireframe: true, transparent: true, opacity: 0.18 })
    );
    wireIco.position.copy(icoC);
    wireIco.userData.rotSpeed = new THREE.Vector3(-0.038, -0.10, -0.02);
    g.add(wireIco);

    // Outer wire shell
    const outerWire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(3.48, 0),
        new THREE.MeshBasicMaterial({ color: hx, wireframe: true, transparent: true, opacity: 0.09 })
    );
    outerWire.position.copy(icoC);
    outerWire.userData.rotSpeed = new THREE.Vector3(0.018, 0.055, 0.01);
    g.add(outerWire);

    // Orbiting ecosystem dots
    const orbitCols = [0xf23a5d, 0x3dd6c8, 0x8c6ef0, 0xf5a623, 0x2eb8f5, 0x7fff44];
    for (let i = 0; i < 6; i++) {
        const a0 = (i / 6) * Math.PI * 2;
        const s = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 14, 14),
            new THREE.MeshStandardMaterial({ color: orbitCols[i], emissive: orbitCols[i], emissiveIntensity: 2.5 })
        );
        s.position.set(icoC.x + Math.cos(a0) * 5.5, icoC.y, icoC.z + Math.sin(a0) * 5.5);
        s.userData.orbitData = { cx: icoC.x, cy: icoC.y, cz: icoC.z, r: 5.5, angle: a0, speed: 0.28 + i * 0.04 };
        g.add(s);
    }

    // Shader cards (left / right)
    const cards = [
        { label: 'VERTEX\nSHADER', hexN: 0x3dd6c8, col: '#3dd6c8', off: new THREE.Vector3(-5.8, 1.5, 1.5) },
        { label: 'FRAGMENT\nSHADER', hexN: 0x2eb8f5, col: '#2eb8f5', off: new THREE.Vector3(5.8, 1.5, 1.5) },
    ];
    cards.forEach(cd => {
        const pos = new THREE.Vector3().addVectors(icoC, cd.off);
        const ry = cd.off.x > 0 ? -0.38 : 0.38;

        // Faint fill
        const fillCard = new THREE.Mesh(
            new THREE.PlaneGeometry(2.8, 1.9),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(cd.hexN).multiplyScalar(0.2),
                transparent: true, opacity: 0.2, side: THREE.DoubleSide
            })
        );
        fillCard.position.copy(pos);
        fillCard.rotation.y = ry;
        g.add(fillCard);

        // Wire grid overlay
        const wireCard = wireBox(2.8, 1.9, 0.02, cd.hexN, 0.45);
        wireCard.position.copy(pos);
        wireCard.rotation.y = ry;
        g.add(wireCard);

        g.add(makeTextSprite(cd.label, pos.clone().add(new THREE.Vector3(0, 0, 0.2)), 0.72, cd.col));
    });

    // Lights
    const pl1 = new THREE.PointLight(hx, 80, 28);
    pl1.position.set(-3, 7, 4);
    g.add(pl1);
    const pl2 = new THREE.PointLight(0x3dd6c8, 40, 22);
    pl2.position.set(6, 2, 3);
    g.add(pl2);
    return g;
}

// ── Scene 4 · L'avenir ─── "Rings / WebXR" ───────────────────────────────────
function buildAvenirScene(hx) {
    const g = new THREE.Group();
    const col = new THREE.Color(hx);
    const rgb = hexRGB(hx);
    const rc = new THREE.Vector3(0, 1, 0);

    // Main torus ring
    const torusMat = new THREE.MeshPhysicalMaterial({
        color: col.clone().multiplyScalar(0.2),
        emissive: col, emissiveIntensity: 0.65,
        metalness: 0.95, roughness: 0.04,
    });
    const torus = new THREE.Mesh(new THREE.TorusGeometry(4.0, 0.10, 10, 110), torusMat);
    torus.position.copy(rc);
    torus.rotation.x = Math.PI / 2.8;
    torus.userData.rotSpeed = new THREE.Vector3(0, 0.09, 0);
    g.add(torus);

    // Inner ring (cyan, counter-rotate)
    const inner = new THREE.Mesh(
        new THREE.TorusGeometry(2.4, 0.07, 8, 90),
        new THREE.MeshStandardMaterial({ color: 0x7df9ff, emissive: 0x7df9ff, emissiveIntensity: 1.1 })
    );
    inner.position.copy(rc);
    inner.rotation.copy(torus.rotation);
    inner.userData.rotSpeed = new THREE.Vector3(0, -0.15, 0);
    g.add(inner);

    // Outer thin ring (tilted differently)
    const outerRing = new THREE.Mesh(
        new THREE.TorusGeometry(5.8, 0.035, 6, 130),
        new THREE.MeshBasicMaterial({ color: hx, transparent: true, opacity: 0.28 })
    );
    outerRing.position.copy(rc);
    outerRing.rotation.x = 1.2;
    outerRing.rotation.z = 0.35;
    outerRing.userData.rotSpeed = new THREE.Vector3(0.03, 0, 0.05);
    g.add(outerRing);

    // XR floating panels (wireframe, all around)
    ['WebXR API', 'AR Mode', 'VR Mode', 'Spatial UI'].forEach((label, i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 5;
        const panelP = new THREE.Vector3(Math.cos(a) * 7, 1 + i * 0.25, Math.sin(a) * 5.5);

        const panel = new THREE.Mesh(
            new THREE.PlaneGeometry(2.6, 1.5, 5, 3),
            new THREE.MeshBasicMaterial({ color: hx, wireframe: true, transparent: true, opacity: 0.38 })
        );
        panel.position.copy(panelP);
        panel.lookAt(new THREE.Vector3(0, panel.position.y, 0));
        panel.userData.floatBase = panelP.y;
        panel.userData.floatAmp = 0.22;
        panel.userData.floatOffset = i * Math.PI * 0.5;
        g.add(panel);

        g.add(makeTextSprite(label, panelP.clone(), 0.65, `rgba(${rgb}, 0.78)`));
    });

    // Sparse particle sphere
    const pN = 480;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pN * 3);
    for (let i = 0; i < pN; i++) {
        const th = Math.random() * Math.PI * 2;
        const ph = Math.random() * Math.PI;
        const r = 4.5 + Math.random() * 7;
        pPos[i * 3] = Math.sin(ph) * Math.cos(th) * r;
        pPos[i * 3 + 1] = Math.sin(ph) * Math.sin(th) * r + 1;
        pPos[i * 3 + 2] = Math.cos(ph) * r;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    g.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
        color: hx, size: 0.06, transparent: true, opacity: 0.38,
    })));

    // Light
    const pl = new THREE.PointLight(hx, 95, 32);
    pl.position.set(0, 7, 5);
    g.add(pl);
    return g;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HUD
// ═══════════════════════════════════════════════════════════════════════════════

function buildHUD(container) {
    // 1px progress line at top
    hudProgress = el('div', 'pres-progress', container);

    // Top-left: scene label  e.g. "─── 02 · WEBGL"
    hudSceneLabel = el('div', 'pres-scene-label', container);

    // Top-right: slide counter  e.g. "01 / 12"
    hudSlideNum = el('div', 'pres-slide-num', container);

    // Bottom-left block
    const block = el('div', 'pres-title-block', container);
    hudSubjectLine = el('span', 'pres-subject-line', block);
    hudTitle = el('h1', 'pres-title', block);
    hudSubtitle = el('p', 'pres-subtitle', block);
    hudSubProgress = el('span', 'pres-sub-progress', block);

    // Right dots
    const dotsWrap = el('div', 'pres-dots', container);
    let lastSubNum = -1;
    SLIDES.forEach((s, i) => {
        if (s.subjectNum !== lastSubNum) {
            if (lastSubNum !== -1) el('div', 'pres-dot-sep', dotsWrap);
            lastSubNum = s.subjectNum;
        }
        const dot = document.createElement('button');
        dot.className = 'pres-dot';
        dot.setAttribute('aria-label', s.title);
        dot.style.setProperty('--accent', s.color);
        dot.addEventListener('click', () => jumpTo(i));
        dotsWrap.appendChild(dot);
        hudDots.push(dot);
    });

    // Scroll hint (fades after first slide)
    const hint = el('div', 'pres-scroll-hint', container);
    hint.innerHTML = '<span>SCROLL ↓</span>';
}

function updateHUD(i, force = false) {
    if (i === activeSlide && !force) return;
    activeSlide = i;
    const s = SLIDES[i];

    hudSlideNum.textContent = `${pad(i + 1)} / ${pad(SLIDES.length)}`;
    hudSceneLabel.textContent = `─── ${pad(s.subjectNum)} · ${s.subject.toUpperCase()}`;
    hudSceneLabel.style.color = s.color;

    hudSubjectLine.textContent = `Partie ${s.subjectNum}/5 — ${s.subject}`;
    hudSubjectLine.style.color = s.color;

    hudTitle.textContent = s.title;
    hudTitle.style.color = s.color;

    hudSubtitle.textContent = s.subtitle;

    if (s.tot > 1) {
        hudSubProgress.textContent = `${s.idx} / ${s.tot}`;
        hudSubProgress.style.color = s.color;
        hudSubProgress.style.borderColor = s.color + '55';
        hudSubProgress.style.display = 'inline-block';
    } else {
        hudSubProgress.style.display = 'none';
    }

    hudDots.forEach((d, idx) => d.classList.toggle('active', idx === i));

    const pct = (i / (SLIDES.length - 1)) * 100;
    hudProgress.style.width = `${pct}%`;
    hudProgress.style.background = s.color;

    // Hide scroll hint after slide 0
    const hint = document.querySelector('.pres-scroll-hint');
    if (hint && i > 0) hint.style.opacity = '0';
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function makeTextSprite(text, position, fontSize, fillStyle) {
    const W = 512, H = 128;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    const lines = text.split('\n');
    const lh = H / lines.length;
    ctx.fillStyle = fillStyle;
    ctx.font = `600 ${Math.round(fontSize * 15)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    lines.forEach((ln, li) => ctx.fillText(ln, W / 2, lh * (li + 0.5)));
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const spr = new THREE.Sprite(mat);
    spr.scale.set(fontSize * 4.2, fontSize * 1.05, 1);
    spr.position.copy(position);
    return spr;
}

function wireBox(w, h, d, hexColor, opacity = 0.5) {
    const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshBasicMaterial({ color: hexColor, wireframe: true, transparent: true, opacity })
    );
    return m;
}

function makeLine(points, color, opacity = 0.6) {
    return new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity })
    );
}

function hexRGB(hex) {
    return `${(hex >> 16) & 255}, ${(hex >> 8) & 255}, ${hex & 255}`;
}

function el(tag, className, parent) {
    const e = document.createElement(tag);
    e.className = className;
    parent.appendChild(e);
    return e;
}

function pad(n) { return String(n).padStart(2, '0'); }

// ─── RESIZE / CLEANUP ─────────────────────────────────────────────────────────
function onResize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
}

export function destroyPresentation() {
    cancelAnimationFrame(animId);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
}