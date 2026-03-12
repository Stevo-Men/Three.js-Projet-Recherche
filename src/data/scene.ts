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
        { pos: [3, -0.7, 0], target: [-2, 0.5, 0] },  // idx=5  Lumières (face avant de la voiture)
        { pos: [2, -0.7, -2], target: [-2, 0.5, 0] }, // idx=6  Écosystème
    ],
    // 5: L'avenir (tot: 3)
    [
        { pos: [0, 0, 5.5], target: [0, 0, 0] },
        { pos: [1.5, 0.5, 4.5], target: [0, 0, 0] },
        { pos: [-1, -0.5, 6], target: [0, 0, 0] },
    ]
];

export const SCENE_OFFSETS = [0, 10, 20, 30, 70, 100];
