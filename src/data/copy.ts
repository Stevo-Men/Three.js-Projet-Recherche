import { SLIDES } from './slides';

export const SLIDE_COPY = [
    // 0 - Plan
    {
        eyebrow: 'SOMMAIRE',
        bodyStyle: { fontSize: 'md', },
        body: `# 1. Avant WebGL

• Le rendu logiciel
• L'ère des plugins

# 2. WebGL débarque et s'impose

• ${SLIDES[2].subtitle}
• ${SLIDES[3].subtitle}
• ${SLIDES[4].title}

# 3. La révolution de WebGPU

• ${SLIDES[5].subtitle}

# 4. L'écosystème Three.js

• ${SLIDES[6].subtitle}
• ${SLIDES[7].subtitle}
• ${SLIDES[8].subtitle}

# 5. Un web en mutation

• ${SLIDES[12].subtitle}
• ${SLIDES[13].subtitle}
• ${SLIDES[14].subtitle}`,



        cta: null,
    },
    // 1 – Plugin Era
    {
        eyebrow: 'LE WEB 3D AVANT 2011',
        bodyStyle: { fontSize: 'md' },
        body:

            `
# Le rendu logiciel

• Rendu graphique pixel par pixel via le CPU (Canvas 2D ou Applets Java)
• Calcul de position, lumière et couleur de chaque pixel un par un
• Performances catastrophiques (< 15 FPS)
• Graphismes limités au fil de fer (Wireframe) ou couleurs plates


# L'ère des plugins

• Adobe Stage3D, Unity Web Player, VRML
• Permet de sortir du navigateur et accéder au système d'exploitation
• Téléchargement et mise à jour du plugin requis
• Failles critiques constantes 
• Non supporté sur mobile`,
        cta: null,
    },
    // 2 – WebGL arrival
    {
        eyebrow: SLIDES[3].subject,
        bodyStyle: { fontSize: 'sm' },
        body:
            `# ORIGINE

• Dérivé d'OpenGL ES 2.0 par le Khronos Group (2011)

# RÔLE

• API JavaScript de bas niveau
• Pont direct et sécurisé entre la page web et la carte graphique

# CONCEPT

• Transformer des vecteurs mathématiques(triangles) en une grille de pixels`,
        table: {
            headers: ['Année', 'Statut', 'Événement'],
            rows: [
                ['2011', 'Expérimental', 'Sortie officielle - Adopté par Chrome et Firefox.'],
                ['2013', 'En croissance', 'Microsoft cède enfin avec IE11.'],
                ['2014', 'Universel', 'Apple active WebGL sur iOS 8. La 3D devient accessible partout.'],
                ['2017', 'Standardisé', 'Sortie de WebGL 2.0 (OpenGL ES 2.0 -> OpenGL ES 3.0).'],
            ],
        },


        cta: null,
    },
    // 3 – Pipeline
    {
        eyebrow: SLIDES[3].subject,
        bodyStyle: { fontSize: 'md' },
        body:
            `# CPU(Séquentiel) — Le Cerveau

• Gère la logique, les calculs et l'état global

• Envoie des instructions de haut niveau(ex: "Dessine cet objet")


# GPU(Parallèle) — Les Ouvriers

• Spécialisé dans le calcul matriciel en parallèle
• Exécute des milliers de calculs simples simultanément`,
        cta: null,
    },
    // 4 – La limite
    {
        eyebrow: SLIDES[3].subject,
        bodyStyle: { fontSize: 'md' },
        body:
            `Le problème: les "Draw Calls"(appels de dessin).

• Pour dessiner 1 objet, le CPU doit parler au GPU.
• Pour dessiner 10 000 objets, le CPU sature, même si le GPU dort.`,
        cta: null,
    },
    // 5 – WebGPU
    {
        eyebrow: SLIDES[5].subject,
        bodyStyle: { fontSize: 'sm' },
        body:
            `WebGPU optimise pleinement l'utilisation du GPU.

# 1. Réduction de la surcouche

• WebGL doit traduire les commandes pour le GPU.
• WebGPU parle la langue native des GPU modernes(Vulkan, Metal, DX12).L'envoi est immédiat. 


# 2. Multithreading

• WebGL force le CPU sur un seul Thread.
• WebGPU répartit le travail sur tous les cœurs du processeur.

# 3. Compute Shaders

• WebGL: le GPU ne sait que colorier des pixels.
• WebGPU: le GPU devient un supercalculateur(fluides, IA, collisions).`,
        table: {
            headers: ['', ''],
            rows: [
                ['WebGL', 'JS → WebGL API → OpenGL ES → Driver natif → GPU'],
                ['WebGPU', 'JS → WebGPU API → Vulkan / Metal / DX12 → GPU'],
            ],
        },
        cta: 'SPEC WEBGPU →',
    },
    // 6 – Three.js
    {
        //eyebrow: 'L\'ABSTRACTION DE RÉFÉRENCE',
        eyebrow: SLIDES[6].subject,
        bodyStyle: { fontSize: 'md' },
        body:
            `Librairie JavaScript orientée objet créée par Ricardo Cabello en 2010.

Réduit des dizaines de lignes complexes en quelques lignes intuitives.

Utilisé par IKEA, Tesla, NASA, Rockstar Games, TikTok et Bombardier.

Désormais la norme pour le développement 3D sur le web.`,
        cta: null,
    },
    // 7 – L'Architecture Three.js (slide idx=2)
    {
        //eyebrow: 'LES 3 PRIMITIVES',
        eyebrow: SLIDES[6].subject,
        bodyStyle: { fontSize: 'md' },
        body:
            `Toute scène Three.js est minimalement composée de ces 3 éléments.

• Scene — le graphe de scène qui contient tous les objets 3D.
• Camera — définit le point de vue et le type de projection (perspective ou orthographique).
• Renderer — exécute le pipeline WebGL et produit l'image dans le <canvas>.`,
        code: `// 1. Scene
const scene = new THREE.Scene();

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  75,   // champ de vision (degrés)
  window.innerWidth / window.innerHeight,
  0.1,  // plan proche
  1000  // plan lointain
);
camera.position.z = 5;

// 3. Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(
  window.innerWidth,
  window.innerHeight
);
document.body.appendChild(renderer.domElement);`,
        cta: null,
    },
    // 8 – Les objets 3D (slide idx=3)
    {
        eyebrow: SLIDES[6].subject,
        bodyStyle: { fontSize: 'md' },
        body:
            `
            Mesh : Geometry (la forme) + Material (l'apparence).

        BoxGeometry, SphereGeometry, PlaneGeometry
  

        Ajouté à la scène : scene.add(meshCube)`,
        code: `// Géométrie + Matériau → Mesh
const geometry = new THREE.BoxGeometry(
  1,1,1
);

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Boucle de rendu avec animation
renderer.setAnimationLoop(() => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
});`,
        cta: null,
    },
    // 9 – Matériaux
    {
        eyebrow: SLIDES[6].subject,
        bodyStyle: { fontSize: 'lg' },
        body:
            `Les matériaux (MeshStandardMaterial, MeshPhysicalMaterial) réagissent avec la lumière pour produire des reflets, de la rugosité et du métal.

            C'est la base du PBR (Physically Based Rendering).`,
        code: `const material = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0xffffff),
  roughness: 0.05,
  metalness: 1.0,
  envMapIntensity: 2.0,
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);`,
        cta: null,
    },
    // 10 – Lumières
    {
        eyebrow: SLIDES[6].subject,
        bodyStyle: { fontSize: 'lg' },
        body:
            `Introduit différents objets lumineux (AmbientLight, DirectionalLight, PointLight…) pour éclairer la scène.

        Sans lumière, les matériaux réagissant à la lumière apparaîtront noirs.`,
        code: `// Lumière ambiante (éclairage global doux)
const ambient = new THREE.AmbientLight(
  0xffffff, 0.4
);
scene.add(ambient);

// Lumière directionnelle (soleil)
const light = new THREE.DirectionalLight(
  0xffffff, 1.5
);
light.position.set(5, 5, 5);
scene.add(light);

// Point lumineux (ampoule)
const point = new THREE.PointLight(
  0xff8800, 2, 10
);
point.position.set(-2, 3, 1);
scene.add(point);`,
        cta: null,
    },
    // 11 – Alternatives / Écosystème
    {
        eyebrow: SLIDES[6].subject,
        bodyStyle: { fontSize: 'md' },
        body:
            `Three.js est loin d'être le seul acteur de l'écosystème 3D web.

• Babylon.js : game engine complet en plus d'être un framework 3D.
• A-Frame : framework spécialisé pour la réalité virtuelle et augmentée.
• React Three Fiber : renderer React pour Three.js.`,
        cta: null,
    },
    // 12 – Cas d'utilisation
    {
        eyebrow: SLIDES[13].subject,
        bodyStyle: { fontSize: 'sm' },
        body:
            `WebGL, WebGPU et Three.js alimentent des industries entières.

• E-commerce : configurateurs 3D interactifs (Nike, IKEA, Tesla) directement dans le navigateur.
• Architecture & BIM : visualisation de bâtiments en temps réel sans logiciel installé.
• Simulation scientifique : dynamique des fluides, cartographie géospatiale (Cesium, deck.gl).
• Jeux & expériences : jeux web, expériences immersives marketing, musées numériques.
• IA & Machine Learning : TensorFlow.js exploite WebGPU pour exécuter des modèles d'IA localement.`,
        cta: null,
    },
    // 13 – Les limites actuelles
    {
        eyebrow: 'CE QUE LE WEB 3D NE PEUT PAS ENCORE FAIRE',
        bodyStyle: { fontSize: 'sm' },
        body:
            `Malgré ses progrès spectaculaires, le web 3D se heurte à des obstacles structurels.

• Mémoire GPU limitée : le navigateur impose un plafond strict sur les scènes très lourdes.
• Support mobile fragmenté : WebGPU n'est pas encore disponible sur tous les navigateurs mobiles.
• Debugging difficile : les outils d'inspection du pipeline GPU sont encore immatures.
• Chargement réseau : les assets 3D restent lourds sur connexion lente (glTF, Draco, KTX2).
• Courbe d'apprentissage : maîtriser shaders, matrices et pipeline GPU demande une expertise rare.`,
        cta: null,
    },
    // 14 – Technologies émergentes
    {
        eyebrow: 'CE QUE WEBGPU REND POSSIBLE — DEMAIN',
        bodyStyle: { fontSize: 'sm' },
        body:
            `WebGPU n'est pas seulement une évolution du rendu — c'est une plateforme de calcul généraliste.

• Gaussian Splatting : rendu de scènes réelles capturées par IA, déjà expérimenté via WebGPU.
• Simulation physique : fluides, tissus, corps mous calculés entièrement sur GPU, sans serveur.
• LLMs dans le navigateur : WebGPU permet d'exécuter de petits modèles de langage localement.
• WebXR + WebGPU : réalité augmentée et virtuelle natives avec rendu GPU haute performance.
• Path tracing temps réel : éclairage global photoréaliste commence à devenir envisageable.`,
        cta: 'WEBGPU EXPLAINER →',
    },
];
