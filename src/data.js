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
        sceneId: 0, subjectNum: 0, tot: 2, idx: 1,
        subject: "Plan de la présentation", title: "Sommaire",
        subtitle: "Les grandes étapes du Web 3D",
        color: P.sommaire, hx: HX.sommaire
    },
    {
        sceneId: 0, subjectNum: 1, tot: 2, idx: 2,
        subject: "L'ère des plugins", title: "L'ère des plugins",
        subtitle: "Flash · Silverlight · Java Applets — le web 3D avant 2011",
        color: P.plugin, hx: HX.plugin
    },

    {
        sceneId: 1, subjectNum: 2, tot: 3, idx: 1,
        subject: "L'avènement de WebGL", title: "L'avènement de WebGL",
        subtitle: "Un accès GPU standardisé, sans installation",
        color: P.webgl, hx: HX.webgl
    },
    {
        sceneId: 1, subjectNum: 2, tot: 3, idx: 2,
        subject: "L'avènement de WebGL", title: "Le pipeline de rendu",
        subtitle: "De la géométrie aux pixels : le voyage des données",
        color: P.webgl, hx: HX.webgl
    },
    {
        sceneId: 1, subjectNum: 2, tot: 3, idx: 3,
        subject: "L'avènement de WebGL", title: "Un nouveau paradigme",
        subtitle: "Du code propriétaire aux standards open-source",
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
        subject: "Three.js", title: "Shaders",
        subtitle: "Reprendre le contrôle via des matériaux custom",
        color: P.three, hx: HX.three
    },
    {
        sceneId: 3, subjectNum: 4, tot: 4, idx: 3,
        subject: "Three.js", title: "Code",
        subtitle: "Scene, Camera, Renderer — Les 3 piliers de l'API",
        color: P.three, hx: HX.three
    },
    {
        sceneId: 3, subjectNum: 4, tot: 4, idx: 4,
        subject: "Three.js", title: "L'écosystème",
        subtitle: "React Three Fiber, Babylon, A-Frame, PlayCanvas...",
        color: P.three, hx: HX.three
    },

    {
        sceneId: 4, subjectNum: 5, tot: 3, idx: 1,
        subject: "L'avenir de l'écosystème", title: "Un web en mutation",
        subtitle: "IA générative 3D, outils no-code, web implicite",
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
    }
];

// Per-scene Camera Anchors
export const SCENE_CAMS = [
    // 0: Plugin Era
    [
        { pos: [0, 1.5, 6.5], target: [0, 0, 0] },
        { pos: [0, 0, 5], target: [0, 0, 0] }
    ],
    // 1: WebGL (tot: 3)
    [
        { pos: [0, 0.5, 6], target: [0, 0, 0] },
        { pos: [1.5, -0.5, 4.5], target: [0, -0.2, 0] },
        { pos: [-1.2, 0.8, 5.2], target: [0, 0, 0] },
    ],
    // 2: WebGPU (tot: 1)
    [
        { pos: [0, 0.2, 5.5], target: [0, 0.2, 0] }
    ],
    // 3: Three.js (tot: 4)
    [
        { pos: [0, 0, 8], target: [0, 0, 0] },
        { pos: [1.8, 1.2, 6], target: [0, 0, 0] },
        { pos: [-2, -1, 5.5], target: [0, 0, 0] },
        { pos: [0, 2.5, 6.5], target: [0, 0, 0] },
    ],
    // 4: L'avenir (tot: 3)
    [
        { pos: [0, 0, 5.5], target: [0, 0, 0] },
        { pos: [1.5, 0.5, 4.5], target: [0, 0, 0] },
        { pos: [-1, -0.5, 6], target: [0, 0, 0] },
    ]
];

export const SLIDE_COPY = [
    // 0 - Plan
    {
        eyebrow: 'SOMMAIRE',
        body: `1. L'ère des plugins\n2. L'avènement de WebGL\n3. La révolution de WebGPU\n4. L'écosystème Three.js\n5. Un web en mutation`,
        cta: null,
    },
    // 1 – Plugin Era
    {
        eyebrow: 'LE WEB 3D AVANT 2011',
        body: `Flash, Silverlight et Java Applets étaient les seuls\nmoyens d'afficher du 3D dans un navigateur.\n\nCes plugins propriétaires imposaient des installations\nmanuelles, des failles de sécurité récurrentes et une\ndépendance totale à des éditeurs tiers.`,
        cta: null,
    },
    // 1 – WebGL arrival
    {
        eyebrow: 'UN TOURNANT POUR LE WEB',
        body: `En 2011, WebGL apporte le rendu GPU directement dans\nle navigateur — sans plugin, sans installation.\n\nLe standard, issu de OpenGL ES 2.0, offre pour la\npremière fois un accès natif au pipeline graphique\nvia une simple balise <canvas>.`,
        cta: 'SPECIFICATION W3C →',
    },
    // 2 – Pipeline
    {
        eyebrow: 'DU CODE AU PIXEL',
        body: `Le pipeline WebGL transforme des données 3D en pixels\naffichés à l'écran en plusieurs étapes discrètes.\n\nChaque étape est programmable via des shaders GLSL —\nde petits programmes qui s'exécutent directement\nsur le GPU, en parallèle massif.`,
        cta: null,
    },
    // 3 – Transition
    {
        eyebrow: 'LA FIN DES SILOS PROPRIÉTAIRES',
        body: `WebGL marque le passage d'un web contrôlé par des\nentreprises à un web gouverné par des standards ouverts.\n\nW3C, Khronos Group et les éditeurs de navigateurs\nconvergent pour la première fois autour d'une API\ngraphique commune et libre.`,
        cta: null,
    },
    // 4 – WebGPU
    {
        eyebrow: 'AU-DELÀ DU RENDU',
        body: `WebGPU expose le GPU dans sa totalité — pas uniquement\npour le rendu, mais pour le calcul généraliste (GPGPU).\n\nCompute shaders, pipelines asynchrones, accès mémoire\nexplicite : WebGPU s'aligne sur Metal, Vulkan et D3D12\npour offrir des performances proches du natif.`,
        cta: 'SPEC WEBGPU →',
    },
    // 5 – Three.js
    {
        eyebrow: 'L\'ABSTRACTION DE RÉFÉRENCE',
        body: `Three.js encapsule la complexité de WebGL derrière une\nAPI orientée objet claire et expressive.\n\nCréé par Ricardo Cabello en 2010, il est aujourd'hui\nutilisé par des millions de développeurs et de projets\nallant du dataviz à la création artistique.`,
        cta: 'THREEJS.ORG →',
    },
    // 6 – Vertex / Fragment
    {
        eyebrow: 'LE CŒUR DU PIPELINE GPU',
        body: `Le Vertex Shader traite chaque sommet de la géométrie\n— position, normales, coordonnées UV — et les projette\ndans l'espace écran.\n\nLe Fragment Shader calcule ensuite la couleur finale\nde chaque pixel : texture, lumière, ombre, effet.`,
        cta: null,
    },
    // 7 – Code Three.js
    {
        eyebrow: 'TROIS OBJETS ESSENTIELS',
        body: `Une scène Three.js repose sur trois primitives.\n\nScene — le graphe de scène qui contient tous les\nobjets 3D. Camera — définit le point de vue et la\nprojection. Renderer — exécute le pipeline WebGL\net produit l'image finale dans le canvas.`,
        cta: null,
    },
    // 8 – Alternatives
    {
        eyebrow: 'UN ÉCOSYSTÈME RICHE',
        body: `Three.js n'est pas seul. Babylon.js cible les jeux\net propose un moteur physique intégré. A-Frame et\nReact Three Fiber abstraient davantage encore.\n\nPlayCanvas mise sur un éditeur visuel en ligne.\nChaque outil répond à un contexte différent.`,
        cta: null,
    },
    // 9 – Avenir
    {
        eyebrow: 'UN CHAMP EN PLEINE MUTATION',
        body: `WebGPU, WebXR, l'IA générative 3D et les outils\nno-code transforment profondément l'écosystème.\n\nLa frontière entre le web et les applications\nnatives s'estompe. Le navigateur devient une\nplateforme de création interactive à part entière.`,
        cta: null,
    },
    // 10 – Limites
    {
        eyebrow: 'DES OBSTACLES PERSISTANTS',
        body: `Malgré ses progrès, le web 3D reste complexe à\nmaîtriser : courbe d'apprentissage abrupte, outils\nde debugging limités et adoption fragmentée.\n\nLa performance sur mobile demeure contrainte, et\nl'accessibilité est souvent sacrifiée au profit\nde la richesse visuelle.`,
        cta: null,
    },
    // 11 – WebXR
    {
        eyebrow: 'LE SPATIAL COMPUTING DANS LE BROWSER',
        body: `WebXR Device API permet d'accéder à des casques VR\net des surfaces AR directement depuis le navigateur.\n\nSans installation, sans app store : une URL suffit\npour plonger l'utilisateur dans une expérience\nimersive sur Meta Quest, Vision Pro ou mobile.`,
        cta: 'WEBXR SPEC →',
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
    { side: 'right', top: '14%' },  // 8  Alternatives
    { side: 'left', top: '14%' },  // 9  Avenir
    { side: 'right', top: '38%' },  // 10 Limites
    { side: 'left', top: '28%' },  // 11 WebXR
];
