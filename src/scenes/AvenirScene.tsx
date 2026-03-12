import { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════════════ */
const BG = '#0a0a12';
const BG_INT = 0x0a0a12;

const TABS = [
    { key: 'ecommerce', label: '🛒 E-commerce', accent: '#ff6b6b' },
    { key: 'archi', label: '🏗️ Architecture', accent: '#4ecdc4' },
    { key: 'science', label: '🌍 Science', accent: '#45b7d1' },
    { key: 'gaming', label: '🎮 Gaming', accent: '#96ceb4' },
    { key: 'ia', label: '🤖 IA / ML', accent: '#dda0dd' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED PLATFORM — glass disk + glow ring under every mini-scene
═══════════════════════════════════════════════════════════════════════════ */
function buildPlatform(accentHex: string | number) {
    const group = new THREE.Group();
    const disposables: { dispose: () => void }[] = [];

    const diskGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.06, 64);
    const diskMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentHex).multiplyScalar(0.16),
        transparent: true, opacity: 0.40,
        roughness: 0.05, metalness: 0.10,
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.position.y = -1.65;
    group.add(disk);
    disposables.push(diskGeo, diskMat);

    const ringGeo = new THREE.TorusGeometry(1.82, 0.022, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentHex),
        transparent: true, opacity: 0.65,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.65;
    group.add(ring);
    disposables.push(ringGeo, ringMat);

    return {
        group,
        dispose() { disposables.forEach(d => d.dispose()); },
    };
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 0 — E-COMMERCE SNEAKER  (drag-to-rotate)
═══════════════════════════════════════════════════════════════════════════ */
function buildEcommerceScene(accent: string | number) {
    const group = new THREE.Group();
    const geoSet = new Set<THREE.BufferGeometry>();
    const matArr: THREE.Material[] = [];

    function G(g: THREE.BufferGeometry) { geoSet.add(g); return g; }
    function M(opts: THREE.MeshStandardMaterialParameters) {
        const m = new THREE.MeshStandardMaterial(opts);
        matArr.push(m); return m;
    }
    function add(geo: THREE.BufferGeometry, mat: THREE.Material, px = 0, py = 0, pz = 0, rx = 0, ry = 0, rz = 0) {
        const mesh = new THREE.Mesh(G(geo), mat);
        mesh.position.set(px, py, pz);
        mesh.rotation.set(rx, ry, rz);
        group.add(mesh);
        return mesh;
    }

    const ac = M({ color: new THREE.Color(accent), roughness: 0.25, metalness: 0.15 });
    const dark = M({ color: '#111111', roughness: 0.90, metalness: 0.00 });
    const mid = M({ color: '#d4d4d4', roughness: 0.70, metalness: 0.00 });
    const sole = M({ color: '#1e1e1e', roughness: 0.95, metalness: 0.00 });

    // Outsole
    add(new THREE.BoxGeometry(1.52, 0.10, 0.55), sole, 0.00, -0.62, 0);
    // Midsole
    add(new THREE.BoxGeometry(1.40, 0.14, 0.52), mid, 0.00, -0.50, 0);
    // Upper body
    add(new THREE.BoxGeometry(1.08, 0.30, 0.46), ac, 0.04, -0.22, 0);
    // Toe cap (front, sits lower)
    add(new THREE.BoxGeometry(0.36, 0.19, 0.44), ac, 0.60, -0.31, 0);
    // Heel counter
    add(new THREE.BoxGeometry(0.28, 0.26, 0.44), dark, -0.56, -0.26, 0);
    // Tongue
    add(new THREE.BoxGeometry(0.22, 0.50, 0.03), mid, 0.10, 0.05, 0.24);
    // Ankle collar
    add(new THREE.CylinderGeometry(0.20, 0.23, 0.09, 20), ac, -0.10, 0.17, 0);
    // Logo badge
    add(new THREE.CylinderGeometry(0.07, 0.07, 0.01, 16), mid, 0.00, -0.20, 0.24);
    // Laces — 4 horizontal cylinders
    for (let i = 0; i < 4; i++) {
        add(
            new THREE.CylinderGeometry(0.012, 0.012, 0.44, 6),
            mid, -0.22 + i * 0.15, -0.08, 0, 0, 0, Math.PI / 2,
        );
    }

    // ── Drag-rotation state ──────────────────────────────────────────────
    let dragging = false;
    let prev = { x: 0, y: 0 };
    let vel = { x: 0, y: 0 };

    function onMouseDown(e: MouseEvent) {
        dragging = true;
        prev = { x: e.clientX, y: e.clientY };
        vel = { x: 0, y: 0 };
    }
    function onMouseMove(e: MouseEvent) {
        if (!dragging) return;
        const dx = (e.clientX - prev.x) * 0.010;
        const dy = (e.clientY - prev.y) * 0.010;
        group.rotation.y += dx;
        group.rotation.x = Math.max(-1.1, Math.min(1.1, group.rotation.x + dy));
        vel = { x: dy, y: dx };
        prev = { x: e.clientX, y: e.clientY };
    }
    function onMouseUp() { dragging = false; }

    function update(elapsed: number) {
        group.position.y = Math.sin(elapsed * 1.1) * 0.08;
        if (!dragging) {
            group.rotation.y += vel.y;
            group.rotation.x += vel.x;
            vel.x *= 0.90;
            vel.y *= 0.90;
        }
    }

    return {
        group, update, onMouseDown, onMouseMove, onMouseUp,
        dispose() { geoSet.forEach(g => g.dispose()); matArr.forEach(m => m.dispose()); },
    };
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 1 — ARCHITECTURE BUILDING (wireframe overlay, auto-rotate)
═══════════════════════════════════════════════════════════════════════════ */
function buildArchScene(accent: string | number) {
    const group = new THREE.Group();
    const geoSet = new Set<THREE.BufferGeometry>();
    const matArr: THREE.Material[] = [];

    function G(g: THREE.BufferGeometry) { geoSet.add(g); return g; }
    function solid(g: THREE.BufferGeometry, pos: [number, number, number]) {
        const m = new THREE.Mesh(G(g), solidMat); m.position.set(...pos); group.add(m);
    }
    function wire(g: THREE.BufferGeometry, pos: [number, number, number]) {
        const m = new THREE.Mesh(G(g), wireMat); m.position.set(...pos); group.add(m);
    }

    const ac = new THREE.Color(accent);
    const solidMat = new THREE.MeshStandardMaterial({
        color: ac.clone().multiplyScalar(0.22), roughness: 0.55, metalness: 0.25,
    });
    const wireMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accent), wireframe: true, transparent: true, opacity: 0.55,
    });
    const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accent), transparent: true, opacity: 0.72,
    });
    matArr.push(solidMat, wireMat, glowMat);

    // Main tower
    const mainGeo = new THREE.BoxGeometry(0.88, 2.20, 0.68);
    solid(mainGeo, [0, 0, 0]); wire(mainGeo, [0, 0, 0]);

    // Shorter side tower
    const sideGeo = new THREE.BoxGeometry(0.40, 1.30, 0.40);
    solid(sideGeo, [0.60, -0.45, 0]); wire(sideGeo, [0.60, -0.45, 0]);

    // Flat roof
    const roofGeo = new THREE.BoxGeometry(1.04, 0.09, 0.78);
    solid(roofGeo, [0, 1.15, 0]); wire(roofGeo, [0, 1.15, 0]);

    // Windows — 4 rows × 2 cols on front face
    const winGeo = G(new THREE.PlaneGeometry(0.13, 0.16));
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 2; col++) {
            const win = new THREE.Mesh(winGeo, glowMat);
            win.position.set(-0.16 + col * 0.32, -0.75 + row * 0.52, 0.345);
            group.add(win);
        }
    }

    function update(elapsed: number) {
        group.position.y = Math.sin(elapsed * 0.65) * 0.07;
        group.rotation.y += 0.0025;
    }

    return {
        group, update,
        dispose() { geoSet.forEach(g => g.dispose()); matArr.forEach(m => m.dispose()); },
    };
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 2 — SCIENCE GLOBE (200 pulsing surface markers)
═══════════════════════════════════════════════════════════════════════════ */
function buildScienceScene(accent: string | number) {
    const group = new THREE.Group();
    const geoSet = new Set<THREE.BufferGeometry>();
    const matArr: THREE.Material[] = [];

    const ac = new THREE.Color(accent);

    const globeGeo = new THREE.SphereGeometry(1.0, 48, 48);
    geoSet.add(globeGeo);
    const globeSolidMat = new THREE.MeshStandardMaterial({
        color: ac.clone().multiplyScalar(0.12), roughness: 0.10, metalness: 0.70,
        transparent: true, opacity: 0.50,
    });
    const globeWireMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accent), wireframe: true, transparent: true, opacity: 0.12,
    });
    matArr.push(globeSolidMat, globeWireMat);
    group.add(new THREE.Mesh(globeGeo, globeSolidMat));
    group.add(new THREE.Mesh(globeGeo, globeWireMat));

    // Surface markers
    const markerGeo = new THREE.SphereGeometry(0.022, 5, 5);
    const markerMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(accent) });
    geoSet.add(markerGeo);
    matArr.push(markerMat);

    const markers: THREE.Mesh[] = [];
    for (let i = 0; i < 200; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        const m = new THREE.Mesh(markerGeo, markerMat);
        m.position.setFromSphericalCoords(1.02, phi, theta);
        m.userData.phase = Math.random() * Math.PI * 2;
        group.add(m);
        markers.push(m);
    }

    function update(elapsed: number) {
        group.position.y = Math.sin(elapsed * 0.80) * 0.07;
        group.rotation.y += 0.003;
        markers.forEach(m => {
            const s = 0.55 + 0.75 * (0.5 + 0.5 * Math.sin(elapsed * 2.8 + m.userData.phase));
            m.scale.setScalar(s);
        });
    }

    return {
        group, update,
        dispose() { geoSet.forEach(g => g.dispose()); matArr.forEach(m => m.dispose()); },
    };
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 3 — GAMING GEMS (icosahedrons bobbing + click-to-burst)
═══════════════════════════════════════════════════════════════════════════ */
function buildGamingScene(_accent: string | number) {
    const group = new THREE.Group();
    const geoSet = new Set<THREE.BufferGeometry>();
    const matArr: THREE.Material[] = [];

    const GEM_COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#dda0dd', '#ffd93d'];
    const GEM_POSITIONS: [number, number, number][] = [
        [-0.90, 0.00, 0.20],
        [0.90, 0.10, 0.20],
        [0.00, 0.20, -0.45],
        [-0.50, -0.10, -0.25],
        [0.55, 0.15, -0.15],
        [0.05, 0.05, 0.55],
    ];

    const gemGeo = new THREE.IcosahedronGeometry(0.26, 1);
    geoSet.add(gemGeo);

    const gems = GEM_COLORS.map((color, i) => {
        const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.05, metalness: 0.90,
            emissive: new THREE.Color(color).multiplyScalar(0.35),
        });
        matArr.push(mat);
        const mesh = new THREE.Mesh(gemGeo, mat);
        mesh.position.set(...GEM_POSITIONS[i]);
        mesh.userData = {
            baseY: GEM_POSITIONS[i][1],
            phase: i * 1.1,
            speed: 0.80 + i * 0.13,
            alive: true,
            color,
        };
        group.add(mesh);
        return mesh;
    });

    const partGeo = new THREE.SphereGeometry(0.045, 4, 4);
    geoSet.add(partGeo);
    const particles: { mesh: THREE.Mesh, vel: THREE.Vector3, life: number, mat: THREE.Material }[] = [];

    function burstGem(idx: number) {
        const gem = gems[idx];
        if (!gem.userData.alive) return;
        gem.userData.alive = false;
        gem.visible = false;
        for (let i = 0; i < 20; i++) {
            const pm = new THREE.MeshBasicMaterial({
                color: new THREE.Color(gem.userData.color), transparent: true, opacity: 1,
            });
            matArr.push(pm);
            const p = new THREE.Mesh(partGeo, pm);
            p.position.copy(gem.position);
            group.add(p);
            particles.push({
                mesh: p, mat: pm, life: 1.0,
                vel: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.14,
                    Math.random() * 0.10 + 0.04,
                    (Math.random() - 0.5) * 0.14,
                ),
            });
        }
        setTimeout(() => { gem.visible = true; gem.userData.alive = true; }, 2200);
    }

    function update(elapsed: number) {
        group.position.y = Math.sin(elapsed * 0.70) * 0.06;
        gems.forEach(gem => {
            if (gem.userData.alive) {
                gem.position.y = gem.userData.baseY +
                    Math.sin(elapsed * gem.userData.speed + gem.userData.phase) * 0.19;
                gem.rotation.y += 0.018;
                gem.rotation.z += 0.010;
            }
        });
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= 0.022;
            p.mesh.position.addScaledVector(p.vel, 1);
            p.vel.y -= 0.003;
            p.mat.opacity = Math.max(0, p.life);
            p.mesh.scale.setScalar(Math.max(0.01, p.life * 1.2));
            if (p.life <= 0) {
                group.remove(p.mesh);
                p.mat.dispose();
                const mi = matArr.indexOf(p.mat);
                if (mi !== -1) matArr.splice(mi, 1);
                particles.splice(i, 1);
            }
        }
    }

    function onClick(raycaster: THREE.Raycaster) {
        const hits = raycaster.intersectObjects(gems);
        if (hits.length) {
            const idx = gems.indexOf(hits[0].object as any);
            if (idx !== -1) burstGem(idx);
        }
    }

    return {
        group, update, onClick,
        dispose() { geoSet.forEach(g => g.dispose()); matArr.forEach(m => m.dispose()); },
    };
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 4 — IA / ML NEURAL NETWORK (3 layers, wave-opacity connections)
═══════════════════════════════════════════════════════════════════════════ */
function buildNNScene(accent: string | number) {
    const group = new THREE.Group();
    const geoSet = new Set<THREE.BufferGeometry>();
    const matArr: THREE.Material[] = [];

    const ac = new THREE.Color(accent);
    const LAYERS = [4, 6, 4];
    const LAYER_X = [-1.50, 0.00, 1.50];

    // Neurons
    const nGeo = new THREE.SphereGeometry(0.115, 16, 16);
    geoSet.add(nGeo);

    const allNeurons = LAYERS.map((count, li) => {
        const layer: THREE.Mesh[] = [];
        for (let ni = 0; ni < count; ni++) {
            const y = (ni - (count - 1) / 2) * 0.57;
            const mat = new THREE.MeshStandardMaterial({
                color: ac.clone(), roughness: 0.20, metalness: 0.30,
                emissive: ac.clone().multiplyScalar(0.40),
                transparent: true, opacity: 0.90,
            });
            matArr.push(mat);
            const mesh = new THREE.Mesh(nGeo, mat);
            mesh.position.set(LAYER_X[li], y, 0);
            mesh.userData.phase = li * 2.4 + ni * 0.85;
            group.add(mesh);
            layer.push(mesh);
        }
        return layer;
    });

    // Connections between adjacent layers
    const connMats: { mat: THREE.Material, idx: number }[] = [];
    for (let li = 0; li < LAYERS.length - 1; li++) {
        allNeurons[li].forEach(n1 => {
            allNeurons[li + 1].forEach(n2 => {
                const lmat = new THREE.LineBasicMaterial({
                    color: new THREE.Color(accent), transparent: true, opacity: 0.10,
                });
                matArr.push(lmat);
                const lGeo = new THREE.BufferGeometry().setFromPoints([
                    n1.position.clone(), n2.position.clone(),
                ]);
                geoSet.add(lGeo);
                group.add(new THREE.Line(lGeo, lmat));
                connMats.push({ mat: lmat, idx: connMats.length });
            });
        });
    }

    function update(elapsed: number) {
        group.position.y = Math.sin(elapsed * 0.90) * 0.07;
        group.rotation.y = Math.sin(elapsed * 0.28) * 0.22;
        allNeurons.flat().forEach(n => {
            const pulse = 0.5 + 0.5 * Math.sin(elapsed * 2.6 + n.userData.phase);
            (n.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.30 + pulse * 0.80;
            n.scale.setScalar(0.88 + pulse * 0.24);
        });
        connMats.forEach(({ mat, idx }) => {
            mat.opacity = 0.07 + 0.55 * (0.5 + 0.5 * Math.sin(elapsed * 3.2 + idx * 0.42));
        });
    }

    return {
        group, update,
        dispose() { geoSet.forEach(g => g.dispose()); matArr.forEach(m => m.dispose()); },
    };
}

/* ═══════════════════════════════════════════════════════════════════════════
   SLIDE 13 — LES LIMITES  (caged spheres bouncing against wireframe boxes)
═══════════════════════════════════════════════════════════════════════════ */
function buildLimitsScene() {
    const group = new THREE.Group();
    const geoSet = new Set<THREE.BufferGeometry>();
    const matArr: THREE.Material[] = [];

    const COLORS = ['#ff6b6b', '#ffd93d', '#ff9a3c', '#c44dff', '#45b7d1'];

    const cageGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    geoSet.add(cageGeo);

    const cells = COLORS.map((color, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const cx = (col - 1) * 1.32;
        const cy = row * -1.05 + 0.50;

        const cageMat = new THREE.MeshBasicMaterial({
            color: 0x334466, wireframe: true, transparent: true, opacity: 0.45,
        });
        matArr.push(cageMat);
        const cage = new THREE.Mesh(cageGeo, cageMat);
        cage.position.set(cx, cy, 0);
        group.add(cage);

        const sphereGeo = new THREE.SphereGeometry(0.19, 20, 20);
        geoSet.add(sphereGeo);
        const sphereMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color), roughness: 0.10, metalness: 0.50,
            emissive: new THREE.Color(color).multiplyScalar(0.30),
        });
        matArr.push(sphereMat);
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.userData = { cx, cy, phase: i * 1.25 };
        sphere.position.set(cx, cy, 0);
        group.add(sphere);

        return { cage, sphere };
    });

    function update(elapsed: number) {
        group.position.y = Math.sin(elapsed * 0.60) * 0.06;
        cells.forEach(({ cage, sphere }, i) => {
            const { cx, cy, phase } = sphere.userData;
            const LIMIT = 0.24;
            const dx = Math.sin(elapsed * 2.10 + phase) * LIMIT;
            const dy = Math.sin(elapsed * 2.70 + phase * 1.5) * LIMIT;
            sphere.position.set(
                cx + Math.max(-LIMIT, Math.min(LIMIT, dx)),
                cy + Math.max(-LIMIT, Math.min(LIMIT, dy)),
                0,
            );
            cage.scale.setScalar(1 + 0.035 * Math.sin(elapsed * 3.5 + i));
            cage.rotation.y = elapsed * (0.05 + i * 0.02);
        });
    }

    return {
        group, update,
        dispose() { geoSet.forEach(g => g.dispose()); matArr.forEach(m => m.dispose()); },
    };
}

/* ═══════════════════════════════════════════════════════════════════════════
   SLIDE 14 — TECHNOLOGIES ÉMERGENTES  (point cloud + glowing core + rays)
═══════════════════════════════════════════════════════════════════════════ */
function buildFutureScene() {
    const group = new THREE.Group();
    const geoSet = new Set<THREE.BufferGeometry>();
    const matArr: THREE.Material[] = [];

    const accent = '#2eb8f5';
    const ac = new THREE.Color(accent);

    // 1 500-point spherical cloud
    const COUNT = 1500;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        const r = 1.20 + (Math.random() - 0.5) * 0.35;
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.cos(phi);
        pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        const c = ac.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.30);
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    ptGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geoSet.add(ptGeo);
    const ptMat = new THREE.PointsMaterial({ size: 0.027, vertexColors: true, transparent: true, opacity: 0.88 });
    matArr.push(ptMat);
    const points = new THREE.Points(ptGeo, ptMat);
    group.add(points);

    // Glowing icosahedron core
    const coreGeo = new THREE.IcosahedronGeometry(0.26, 2);
    geoSet.add(coreGeo);
    const coreMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(accent), roughness: 0, metalness: 1.0,
        emissive: new THREE.Color(accent), emissiveIntensity: 1.5,
    });
    matArr.push(coreMat);
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // 12 ray lines shooting outward from core
    const rayPts: THREE.Vector3[] = [];
    for (let i = 0; i < 12; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        const dir = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta),
        );
        rayPts.push(dir.clone().multiplyScalar(0.30));
        rayPts.push(dir.clone().multiplyScalar(1.50));
    }
    const rayGeo = new THREE.BufferGeometry().setFromPoints(rayPts);
    geoSet.add(rayGeo);
    const rayMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(accent), transparent: true, opacity: 0.40,
    });
    matArr.push(rayMat);
    group.add(new THREE.LineSegments(rayGeo, rayMat));

    function update(elapsed: number) {
        points.rotation.y = elapsed * 0.18;
        points.rotation.x = elapsed * 0.04;
        core.rotation.y = elapsed * 0.55;
        core.rotation.z = elapsed * 0.30;
        group.position.y = Math.sin(elapsed * 0.85) * 0.07;
        coreMat.emissiveIntensity = 1.20 + 0.90 * Math.sin(elapsed * 2.5);
        rayMat.opacity = 0.15 + 0.30 * Math.sin(elapsed * 3.2);
    }

    return {
        group, update,
        dispose() { geoSet.forEach(g => g.dispose()); matArr.forEach(m => m.dispose()); },
    };
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export function AvenirScene({ activeSlide, isVisible }: { activeSlide: number, isVisible: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const threeRef = useRef<{ renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, clock: THREE.Clock } | null>(null);
    const bundleRef = useRef<any>(null);
    const platRef = useRef<any>(null);
    const visRef = useRef(false);
    const animIdRef = useRef<number | null>(null);
    const activeTabRef = useRef(0);

    const [activeTab, setActiveTab] = useState(0);
    const isSlide12 = activeSlide === 12;

    /* ── Three.js initialization (once on mount) ─────────────────────────── */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(BG_INT, 1);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 1.0, 6);
        camera.lookAt(0, 0, 0);

        // 3-point lighting: warm key + cool fill + ambient
        scene.add(new THREE.AmbientLight(0xffffff, 0.55));
        const key = new THREE.DirectionalLight(0xfff4cc, 1.40);
        key.position.set(3, 4, 3);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xaadeff, 0.70);
        fill.position.set(-3, 1, -2);
        scene.add(fill);

        const clock = new THREE.Clock();

        function animate() {
            animIdRef.current = requestAnimationFrame(animate);
            if (!visRef.current) return;          // skip render when hidden
            const elapsed = clock.getElapsedTime();
            bundleRef.current?.update(elapsed);
            renderer.render(scene, camera);
        }

        function resize() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h, false);
        }

        resize();
        animate();
        window.addEventListener('resize', resize);

        threeRef.current = { renderer, scene, camera, clock };

        return () => {
            if (animIdRef.current !== null) {
                cancelAnimationFrame(animIdRef.current);
            }
            window.removeEventListener('resize', resize);
            bundleRef.current?.dispose();
            platRef.current?.dispose();
            renderer.dispose();
            threeRef.current = null;
        };
    }, []);

    /* ── Keep visRef in sync ─────────────────────────────────────────────── */
    useEffect(() => { visRef.current = isVisible; }, [isVisible]);

    /* ── Scene loader ────────────────────────────────────────────────────── */
    const loadScene = useCallback((slideNum: number, tabIdx: number) => {
        const three = threeRef.current;
        if (!three) return;
        const { scene } = three;

        // Tear down previous
        if (bundleRef.current) {
            scene.remove(bundleRef.current.group);
            bundleRef.current.dispose();
            bundleRef.current = null;
        }
        if (platRef.current) {
            scene.remove(platRef.current.group);
            platRef.current.dispose();
            platRef.current = null;
        }

        let bundle, accent;

        if (slideNum === 12) {
            accent = TABS[tabIdx].accent;
            switch (tabIdx) {
                case 0: bundle = buildEcommerceScene(accent); break;
                case 1: bundle = buildArchScene(accent); break;
                case 2: bundle = buildScienceScene(accent); break;
                case 3: bundle = buildGamingScene(accent); break;
                case 4: bundle = buildNNScene(accent); break;
                default: bundle = buildEcommerceScene(TABS[0].accent); accent = TABS[0].accent;
            }
        } else if (slideNum === 13) {
            accent = '#2eb8f5';
            bundle = buildLimitsScene();
        } else if (slideNum === 14) {
            accent = '#2eb8f5';
            bundle = buildFutureScene();
        } else {
            return;
        }

        const platform = buildPlatform(accent);
        scene.add(platform.group);
        scene.add(bundle.group);
        bundleRef.current = bundle;
        platRef.current = platform;
    }, []);

    /* ── Reload when slide or visibility changes ─────────────────────────── */
    useEffect(() => {
        if (!isVisible) return;
        loadScene(activeSlide, activeTabRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSlide, isVisible, loadScene]);

    /* ── Tab switching with fade ─────────────────────────────────────────── */
    const switchTab = useCallback((newIdx: number) => {
        if (newIdx === activeTabRef.current) return;
        const canvas = canvasRef.current;
        if (canvas) canvas.style.opacity = '0';
        setTimeout(() => {
            activeTabRef.current = newIdx;
            setActiveTab(newIdx);
            loadScene(12, newIdx);
            if (canvasRef.current) canvasRef.current.style.opacity = '1';
        }, 250);
    }, [loadScene]);

    /* ── Drag listeners — E-commerce (tab 0) ────────────────────────────── */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isVisible || activeSlide !== 12 || activeTab !== 0) return;

        const onDown = (e: MouseEvent) => bundleRef.current?.onMouseDown?.(e);
        const onMove = (e: MouseEvent) => bundleRef.current?.onMouseMove?.(e);
        const onUp = () => bundleRef.current?.onMouseUp?.();

        canvas.addEventListener('mousedown', onDown);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            canvas.removeEventListener('mousedown', onDown);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [isVisible, activeSlide, activeTab]);

    /* ── Click listener — Gaming (tab 3) ────────────────────────────────── */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isVisible || activeSlide !== 12 || activeTab !== 3) return;

        const onClick = (e: MouseEvent) => {
            const three = threeRef.current;
            if (!three || !bundleRef.current?.onClick) return;
            const rect = canvas.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            const ray = new THREE.Raycaster();
            ray.setFromCamera(new THREE.Vector2(x, y), three.camera);
            bundleRef.current.onClick(ray);
        };

        canvas.addEventListener('click', onClick);
        return () => canvas.removeEventListener('click', onClick);
    }, [isVisible, activeSlide, activeTab]);

    /* ── Cursor hint based on active tab ─────────────────────────────────── */
    const canvasCursor = isSlide12 && activeTab === 0 ? 'grab'
        : isSlide12 && activeTab === 3 ? 'pointer'
            : 'default';

    /* ── Render ─────────────────────────────────────────────────────────── */
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 12,
            background: BG,
            opacity: isVisible ? 1 : 0,
            pointerEvents: isVisible ? 'auto' : 'none',
            transition: 'opacity 0.45s ease',
        }}>
            {/* ── Tab bar — visible only on slide 12 ── */}
            {isSlide12 && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
                    display: 'flex', gap: '2px', padding: '10px 18px',
                    background: 'rgba(10,10,18,0.82)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    boxSizing: 'border-box',
                }}>
                    {TABS.map((tab, i) => {
                        const isActive = activeTab === i;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => switchTab(i)}
                                style={{
                                    padding: '7px 16px',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: isActive
                                        ? `2px solid ${tab.accent}`
                                        : '2px solid transparent',
                                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.40)',
                                    fontFamily: 'monospace',
                                    fontSize: '0.70rem',
                                    letterSpacing: '0.09em',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'color 0.20s ease, border-color 0.20s ease',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            )}

            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    cursor: canvasCursor,
                    transition: 'opacity 0.25s ease',
                }}
            />
        </div>
    );
}
