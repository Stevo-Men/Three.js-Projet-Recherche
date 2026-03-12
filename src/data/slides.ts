import { P, HX } from './theme';

export const SLIDES = [
    {
        sceneId: 0, subjectNum: 0, tot: 1, idx: 1,
        subject: "Plan de la présentation", title: "Sommaire",
        subtitle: "",
        color: P.sommaire, hx: HX.sommaire,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 1, subjectNum: 1, tot: 1, idx: 1,
        subject: "Avant WebGL", title: "Avant WebGL",
        subtitle: "Plugins et rendu logiciel",
        color: P.plugin, hx: HX.plugin,
        bodyPos: [-4, -1.5, 1]
    },

    {
        sceneId: 2, subjectNum: 2, tot: 3, idx: 1,
        subject: "WebGL débarque et s'impose", title: "Le standard",
        subtitle: "Un accès GPU standardisé, sans installation",
        color: P.webgl, hx: HX.webgl,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 2, subjectNum: 2, tot: 3, idx: 2,
        subject: "WebGL débarque et s'impose", title: "Le pipeline de rendu",
        subtitle: "De la géométrie aux pixels : le voyage des données",
        color: P.webgl, hx: HX.webgl,
        bodyPos: [-4, -1.5, 1]
    },
    {
        sceneId: 2, subjectNum: 2, tot: 3, idx: 3,
        subject: "WebGL débarque et s'impose", title: "La limite",
        subtitle: "",
        color: P.webgl, hx: HX.webgl,
        bodyPos: [-4, -1.5, 1]
    },

    {
        sceneId: 3, subjectNum: 3, tot: 1, idx: 1,
        subject: "La révolution de WebGPU", title: "La révolution de WebGPU",
        subtitle: "Compute shaders, accès bas niveau : WebGL sans contrainte",
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
