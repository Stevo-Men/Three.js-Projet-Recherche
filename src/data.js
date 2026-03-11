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
        subject: "L'avènement de WebGL", title: "Li limite",
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
        subject: "Three.js", title: "Shaders",
        subtitle: "Reprendre le contrôle via des matériaux custom",
        color: P.three, hx: HX.three,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 4, subjectNum: 4, tot: 6, idx: 3,
        subject: "Three.js", title: "Code",
        subtitle: "Scene, Camera, Renderer — Les 3 piliers de l'API",
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
        subject: "L'avenir de l'écosystème", title: "Un web en mutation",
        subtitle: "IA générative 3D, outils no-code, web implicite",
        color: P.avenir, hx: HX.avenir,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 5, subjectNum: 5, tot: 3, idx: 2,
        subject: "L'avenir de l'écosystème", title: "Les limites actuelles",
        subtitle: "Complexité d'accès, adoption fragmentée, debugging difficile",
        color: P.avenir, hx: HX.avenir,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 5, subjectNum: 5, tot: 3, idx: 3,
        subject: "L'avenir de l'écosystème", title: "WebXR",
        subtitle: "AR & VR natives dans le navigateur — sans installation",
        color: P.avenir, hx: HX.avenir,
        bodyPos: [-4, -1.5, 1]
    }
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
        { pos: [0, 1.5, 7], target: [0, -0.5, 0] },
        { pos: [0, 1.5, 7], target: [0, -0.5, 0] },
        { pos: [0, 1.5, 7], target: [0, -0.5, 0] },
        { pos: [0, 1.5, 7], target: [0, -0.5, 0] },
        { pos: [0, 1.5, 7], target: [0, -0.5, 0] },
        { pos: [0, 1.5, 7], target: [0, -0.5, 0] },
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
        cta: null,
    },
    // 1 – Plugin Era
    {
        eyebrow: 'LE WEB 3D AVANT 2011',
        body: `L'ère des plugins\n\n• Adobe Flash (via Stage3D), Unity Web Player ou VRML\n
        • L'utilisateur devait télécharger et mettre à jour le plugin.\n
        • Failles critiques constantes\n• Non supporté sur mobile\n\n
        Le rendu logiciel\n\n
        • Dessin pixel par pixel via le CPU(Canvas 2D ou Applets Java).\n
        • Calculer la position, la lumière et la couleur de chaque pixel un par un.\n
        • Performances catastrophiques(< 15 FPS) \n
        • Graphismes limités au "Fil de fer"(Wireframe) ou couleurs plates`,
        cta: null,
    },
    // 1 – WebGL arrival
    {
        eyebrow: 'UN TOURNANT POUR LE WEB',
        body: `ORIGINE\n
            • Dérivé d'OpenGL ES 2.0 par le Khronos Group (2011).\n
ROLE\n
            • API JavaScript de bas niveau\n
            • sert de pont direct et sécurisé entre la page web et la carte graphique de l'utilisateur.\n
CONCEPT\n
            • Transformer des vecteurs mathématiques(triangles) en une grille de pixels.`,
        cta: null,
    },
    // 2 – Pipeline
    {
        eyebrow: 'DU CODE AU PIXEL',
        body: `
CPU(Séquentiel) : Le Cerveau

        • Gère la logique, les calculs complexes et l'état global.
        • Envoie des instructions de haut niveau au GPU.

    GPU(Parallèle) : Les ouvriers

        • Spécialisé dans le calcul matriciel en parallèle.
        • Exécute des milliers de calculs simples simultanément.`,
        cta: null,
    },
    // 3 – Transition
    {
        eyebrow: 'La limite',
        body: `
        Le problème: Les "Draw Calls"(Appels de dessin).

        • Pour dessiner 1 objet, le CPU doit parler au GPU.\n
        • Pour dessiner 10 000 objets, le CPU sature, même si le GPU dort.`,
        cta: null,
    },
    // 4 – WebGPU
    {
        eyebrow: 'AU-DELÀ DU RENDU',
        body: `WebGPU expose le GPU dans sa totalité — pas uniquement\npour le rendu, mais pour le calcul généraliste(GPGPU).\n\n
1. Réduction de l'Overhead (La surcouche)\n
WebGL: Doit traduire les commandes pour le GPU.\n
WebGPU: Parle la langue native des GPU modernes(Vulkan, Metal, DirectX 12).L'envoi des commandes est immédiat.\n
2. Le Multithreading
WebGL: force le CPU à préparer les commandes sur un seul fil(Main Thread).\n
WebGPU: répartit ce travail sur tous les cœurs du processeur.\n
3. Les Compute Shaders\n
WebGL: Le GPU ne sait que colorier des pixels.\n
WebGPU: Le GPU se transforme en supercalculateur autonome(simulation de fluides, IA, collisions).\n
       
            `,
        cta: 'SPEC WEBGPU →',
    },
    // 5 – Three.js
    {
        eyebrow: 'L\'ABSTRACTION DE RÉFÉRENCE',
        body: `Librairie Javascript orientée objet.\n
        Créé par Ricardo Cabello en 2010.\n
        Réduit des dizaines de lignes complexes en quelques lignes intutifs.\n
        Utilisé par des énormes entreprises comme Ikea, Tesla, NASA, Rockstar Games, TikTok, Bombardier et bien d'autres. \n
        
         il est maintenant la norme pour le développement 3D sur le web.\n\n`,

        cta: null,
    },
    // 6 – Vertex / Fragment
    {
        eyebrow: 'LE CŒUR DU PIPELINE GPU',
        body: `Le Vertex Shader traite chaque sommet de la géométrie\n— position, normales, coordonnées UV — et les projette\ndans l'espace écran.\n\nLe Fragment Shader calcule ensuite la couleur finale\nde chaque pixel : texture, lumière, ombre, effet.`,
        cta: null,
    },
    // 7 – Code Three.js
    {
        eyebrow: 'Les objets Three.js',
        body: `Une scène Three.js repose sur trois primitives.\n\n

        1. Scene — Le conteneur de scène qui contient tous les éléments 3D.\n
        2. Camera — définit le point de vue de l'utilisateur et la projection.\n
        3. Renderer — exécute le pipeline WebGL et produit l'image finale dans le canvas.\n

        Three.js vient avec de nombreux objets prédéfinis pour les lumières, les matériaux, les géométries, les effets spéciaux, etc.
`,
        cta: null,
    },
    // 8 – Matériaux
    {
        eyebrow: 'MATÉRIAUX',
        body: `Les matériaux (MeshStandardMaterial, MeshPhysicalMaterial) réagissent avec la lumière pour produire des reflets, de la rugosité et du métal.\n\nC'est la base du PBR (Physically Based Rendering).`,
        cta: null,
    },
    // 9 – Lumières
    {
        eyebrow: 'LUMIÈRES',
        body: `Three.js introduit des objets lumineux (AmbientLight, DirectionalLight, PointLight...) pour éclairer la scène.\n\nSans lumière, les matériaux réagissant à la lumière apparaîtront noirs.`,
        cta: null,
    },
    // 10 – Alternatives
    {
        eyebrow: 'UN ÉCOSYSTÈME RICHE',
        body: `Three.js est loin d'être le seul.\n\n
        • Babylon.js : Game engine en plus d'être un framework 3D.\n 
        • A-Frame : Framework spécialisé pour la réalité virtuelle et augmentée.\n
        • React Three Fiber : Renderer React pour Three.js.\n`,

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
    { side: 'right', top: '22%' },  // 8  Matériaux
    { side: 'left', top: '22%' },  // 9  Lumières
    { side: 'right', top: '14%' },  // 10  Alternatives
    { side: 'left', top: '14%' },  // 11  Avenir
    { side: 'right', top: '38%' },  // 12 Limites
    { side: 'left', top: '28%' },  // 13 WebXR
];
