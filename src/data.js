export const P = {
    sommaire: 0xe0e0e0ff,
    plugin: 0xff3366,
    webgl: 0x00ff88,
    webgpu: 0xbb44ff,
    three: 0xffaa00,
    avenir: 0x2eb8f5,
};

// Slightly darker hex for rendering in R3F HTML texts
export const HX = {
    sommaire: '#ffffff',
    plugin: '#ff3366',
    webgl: '#00cc66',
    webgpu: '#aa33ee',
    three: '#ee9900',
    avenir: '#2eb8f5',
};

export const SLIDES = [
    {
        sceneId: 0, subjectNum: 0, tot: 1, idx: 1,
        subject: "Plan de la présentation", title: "Sommaire",
        subtitle: "",
        color: P.sommaire, hx: HX.sommaire,
        bodyPos: null
    },
    {
        sceneId: 1, subjectNum: 1, tot: 1, idx: 1,
        subject: "L'ère des plugins", title: "L'ère des plugins",
        subtitle: "Flash · Silverlight · Java Applets — le web 3D avant 2011",
        color: P.plugin, hx: HX.plugin,
        bodyPos: [-4, -1.5, 1]
    },

    {
        sceneId: 2, subjectNum: 2, tot: 3, idx: 1,
        subject: "L'avènement de WebGL", title: "L'avènement de WebGL",
        subtitle: "Un accès GPU standardisé, sans installation",
        color: P.webgl, hx: HX.webgl,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 2, subjectNum: 2, tot: 3, idx: 2,
        subject: "L'avènement de WebGL", title: "Le pipeline de rendu",
        subtitle: "De la géométrie aux pixels : le voyage des données",
        color: P.webgl, hx: HX.webgl,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 2, subjectNum: 2, tot: 3, idx: 3,
        subject: "L'avènement de WebGL", title: "La limite",
        subtitle: "",
        color: P.webgl, hx: HX.webgl,
        bodyPos: [-4, -1.5, 1]
    },

    {
        sceneId: 3, subjectNum: 3, tot: 1, idx: 1,
        subject: "La révolution de WebGPU", title: "La révolution de WebGPU",
        subtitle: "Compute shaders, accès bas niveau — le GPU sans contrainte",
        color: P.webgpu, hx: HX.webgpu,
        bodyPos: [-4, -1.5, 1]
    },

    {
        sceneId: 4, subjectNum: 4, tot: 6, idx: 1,
        subject: "Three.js", title: "Three.js",
        subtitle: "L'abstraction WebGL open-source la plus utilisée au monde",
        color: P.three, hx: HX.three,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 4, subjectNum: 4, tot: 6, idx: 2,
        subject: "Three.js", title: "L'Architecture",
        subtitle: "Scene · Camera · Renderer — les 3 primitives fondatrices",
        color: P.three, hx: HX.three,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 4, subjectNum: 4, tot: 6, idx: 3,
        subject: "Three.js", title: "Les objets 3D",
        subtitle: "Geometry · Material · Mesh — construire et animer la scène",
        color: P.three, hx: HX.three,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 4, subjectNum: 4, tot: 6, idx: 4,
        subject: "Three.js", title: "Matériaux",
        subtitle: "Donner vie aux géométries",
        color: P.three, hx: HX.three,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 4, subjectNum: 4, tot: 6, idx: 5,
        subject: "Three.js", title: "Lumières",
        subtitle: "Éclairer la scène avec réalisme",
        color: P.three, hx: HX.three,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 4, subjectNum: 4, tot: 6, idx: 6,
        subject: "Three.js", title: "L'écosystème",
        subtitle: "React Three Fiber, Babylon, A-Frame, PlayCanvas...",
        color: P.three, hx: HX.three,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 5, subjectNum: 5, tot: 3, idx: 1,
        subject: "L'avenir de l'écosystème", title: "Cas d'utilisation",
        subtitle: "Là où WebGL, WebGPU et Three.js changent tout",
        color: P.avenir, hx: HX.avenir,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 5, subjectNum: 5, tot: 3, idx: 2,
        subject: "L'avenir de l'écosystème", title: "Les limites actuelles",
        subtitle: "Ce que le web 3D ne peut pas encore faire",
        color: P.avenir, hx: HX.avenir,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 5, subjectNum: 5, tot: 3, idx: 3,
        subject: "L'avenir de l'écosystème", title: "Technologies émergentes",
        subtitle: "Ce que WebGPU rend possible — demain",
        color: P.avenir, hx: HX.avenir,
        bodyPos: [-4, -1.5, 1]
    },
];

// Per-scene Camera Anchors
export const SCENE_CAMS = [
    // 0: Sommaire
    [
        { pos: [0, 0, 8.5], target: [0, 0, 0] }
    ],
    // 1: Plugin Era
    [
        { pos: [0, 0, 5], target: [0, 0, 0] }
    ],
    // 2: WebGL (tot: 3)
    [
        { pos: [0, 0.5, 6], target: [0, 0, 0] },
        { pos: [1.5, -0.5, 4.5], target: [0, -0.2, 0] },
        { pos: [-1.2, 0.8, 5.2], target: [0, 0, 0] },
    ],
    // 3: WebGPU (tot: 1)
    [
        { pos: [0, 0.2, 5.5], target: [0, 0.2, 0] }
    ],
    // 4: Three.js (tot: 6)
    [
        { pos: [0, 7, 0.1], target: [0, -1, 0] },        // idx=1  top-down sur la voiture
        { pos: [0, 1.5, 7], target: [0, -0.5, 0] },  // idx=2  vue large
        { pos: [0, 0.3, 4], target: [0, 0.5, 0] },  // idx=3  face à l'écran (objets 3D)
        { pos: [0, 0.3, 4], target: [0, 0.5, 0] },  // idx=4  Matériaux
        { pos: [4, 0.5, 2], target: [0, 0.5, 0] },  // idx=5  Lumières (vue de l'avant avec volume beams)
        { pos: [0, 0.3, 4], target: [0, 0.5, 0] }, // idx=6  Écosystème
    ],
    // 5: L'avenir (tot: 3)
    [
        { pos: [0, 0, 5.5], target: [0, 0, 0] },
        { pos: [1.5, 0.5, 4.5], target: [0, 0, 0] },
        { pos: [-1, -0.5, 6], target: [0, 0, 0] },
    ]
];

export const SCENE_OFFSETS = [0, 10, 20, 30, 70, 100];

export const SLIDE_COPY = [
    // 0 - Plan
    {
        eyebrow: 'SOMMAIRE',
        body: null,
        bodyStyle: {},
        cta: null,
    },
    // 1 – Plugin Era
    {
        eyebrow: 'LE WEB 3D AVANT 2011',
        bodyStyle: { fontSize: 'xs' },
        body:
            `## L'ère des plugins

• Adobe Flash (Stage3D), Unity Web Player, VRML
• Téléchargement et mise à jour du plugin requis
• Failles critiques constantes
• Non supporté sur mobile

## Le rendu logiciel

• Dessin pixel par pixel via le CPU (Canvas 2D ou Applets Java)
• Calcul de position, lumière et couleur de chaque pixel un par un
• Performances catastrophiques (< 15 FPS)
• Graphismes limités au fil de fer (Wireframe) ou couleurs plates`,
        cta: null,
    },
    // 2 – WebGL arrival
    {
        eyebrow: 'UN TOURNANT POUR LE WEB',
        bodyStyle: { fontSize: 'sm' },
        body:
            `## ORIGINE

• Dérivé d'OpenGL ES 2.0 par le Khronos Group (2011)

## RÔLE

• API JavaScript de bas niveau
• Pont direct et sécurisé entre la page web et la carte graphique

## CONCEPT

• Transformer des vecteurs mathématiques (triangles) en une grille de pixels`,
        cta: null,
    },
    // 3 – Pipeline
    {
        eyebrow: 'DU CODE AU PIXEL',
        bodyStyle: { fontSize: 'md' },
        body:
            `## CPU (Séquentiel) — Le Cerveau

• Gère la logique, les calculs complexes et l'état global
• Envoie des instructions de haut niveau au GPU

## GPU (Parallèle) — Les Ouvriers

• Spécialisé dans le calcul matriciel en parallèle
• Exécute des milliers de calculs simples simultanément`,
        cta: null,
    },
    // 4 – La limite
    {
        eyebrow: 'LA LIMITE',
        bodyStyle: { fontSize: 'md' },
        body:
            `Le problème : les "Draw Calls" (appels de dessin).

• Pour dessiner 1 objet, le CPU doit parler au GPU.
• Pour dessiner 10 000 objets, le CPU sature, même si le GPU dort.`,
        cta: null,
    },
    // 5 – WebGPU
    {
        eyebrow: 'AU-DELÀ DU RENDU',
        bodyStyle: { fontSize: 'sm' },
        body:
            `WebGPU expose le GPU dans sa totalité — pas uniquement pour le rendu, mais pour le calcul généraliste (GPGPU).

## 1. Réduction de l'overhead

• WebGL doit traduire les commandes pour le GPU.
• WebGPU parle la langue native des GPU modernes (Vulkan, Metal, DX12). L'envoi est immédiat.

## 2. Le Multithreading

• WebGL force le CPU sur un seul fil (Main Thread).
• WebGPU répartit le travail sur tous les cœurs du processeur.

## 3. Les Compute Shaders

• WebGL : le GPU ne sait que colorier des pixels.
• WebGPU : le GPU devient un supercalculateur (fluides, IA, collisions).`,
        cta: 'SPEC WEBGPU →',
    },
    // 6 – Three.js
    {
        eyebrow: 'L\'ABSTRACTION DE RÉFÉRENCE',
        bodyStyle: { fontSize: 'sm' },
        body:
            `Librairie JavaScript orientée objet créée par Ricardo Cabello en 2010.

Réduit des dizaines de lignes complexes en quelques lignes intuitives.

Utilisé par IKEA, Tesla, NASA, Rockstar Games, TikTok et Bombardier.

Désormais la norme pour le développement 3D sur le web.`,
        cta: null,
    },
    // 7 – L'Architecture Three.js (slide idx=2)
    {
        eyebrow: 'LES 3 PRIMITIVES',
        bodyStyle: { fontSize: 'md' },
        body:
            `Toute scène Three.js repose sur ce trio minimal.

• Scene — le graphe de scène qui contient tous les objets 3D.
• Camera — définit le point de vue et le type de projection (perspective ou orthographique).
• Renderer — exécute le pipeline WebGL et produit l'image dans le <canvas>.`,
        cta: null,
    },
    // 8 – Les objets 3D (slide idx=3)
    {
        eyebrow: 'CONSTRUIRE LA SCÈNE',
        bodyStyle: { fontSize: 'md' },
        body:
            `Un objet visible est toujours un Mesh — assemblage d'une Geometry (la forme) et d'un Material (l'apparence).

• BoxGeometry, SphereGeometry, PlaneGeometry…
• MeshBasicMaterial, MeshStandardMaterial (PBR)…

Une fois créé : scene.add(cube) et il entre dans la boucle de rendu.`,
        cta: null,
    },
    // 9 – Matériaux
    {
        eyebrow: 'MATÉRIAUX',
        bodyStyle: { fontSize: 'lg' },
        body:
            `Les matériaux (MeshStandardMaterial, MeshPhysicalMaterial) réagissent avec la lumière pour produire des reflets, de la rugosité et du métal.

C'est la base du PBR (Physically Based Rendering).`,
        cta: null,
    },
    // 10 – Lumières
    {
        eyebrow: 'LUMIÈRES',
        bodyStyle: { fontSize: 'lg' },
        body:
            `Three.js introduit des objets lumineux (AmbientLight, DirectionalLight, PointLight…) pour éclairer la scène.

Sans lumière, les matériaux réagissant à la lumière apparaîtront noirs.`,
        cta: null,
    },
    // 11 – Alternatives / Écosystème
    {
        eyebrow: 'UN ÉCOSYSTÈME RICHE',
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
        eyebrow: 'DU NAVIGATEUR AU MONDE RÉEL',
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

export const POSITIONS = [
    { side: 'right', top: '25%' }, // 0 Plan
    { side: 'left', top: '12%' },  // 1 Plugin Era
    { side: 'left', top: '18%' },  // 1  WebGL arrival
    { side: 'right', top: '15%' },  // 2  Pipeline
    { side: 'left', top: '52%' },  // 3  Transition
    { side: 'right', top: '22%' },  // 4  WebGPU
    { side: 'left', top: '16%' },  // 5  Three.js
    { side: 'right', top: '42%' },  // 6  Vertex/Fragment
    { side: 'left', top: '46%' },  // 7  Coder
    { side: 'right', top: '22%' },  // 8  Matériaux
    { side: 'left', top: '22%' },  // 9  Lumières
    { side: 'right', top: '14%' },  // 10  Alternatives
    { side: 'left', top: '14%' },   // Cas d'utilisation
    { side: 'right', top: '18%' },  // Limites actuelles
    { side: 'left', top: '16%' },   // Technologies émergentes
];
