/**
 * SlideContent.js
 * ───────────────
 * Floating HTML content panel overlaid on the Three.js scene.
 * Inspired by d2c-lifescience.com: text floats directly over
 * the 3D render, no opaque background, accent left-border.
 *
 * USAGE
 * ─────
 *   import { SlideContent } from './SlideContent.js';
 *   const slides = [ ... ];   // your SLIDES array
 *   const sc = new SlideContent(container, slides);
 *   sc.show(0);               // call on slide change
 *   sc.destroy();             // cleanup
 */

// ─── EXTENDED COPY PER SLIDE ─────────────────────────────────────────────────
// Add a `body` key to your SLIDES array, or use the defaults below.
const SLIDE_COPY = [
    // 0 – Plugin Era
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

// ─── PER-SLIDE POSITION ANCHORS ───────────────────────────────────────────────
// side: 'left' | 'right'
// top: CSS value for vertical placement

const POSITIONS = [
    { side: 'left', top: '12%' },  // 0  Plugin Era
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

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
  .sc-wrap {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 50;
  }

  .sc-panel {
    position: absolute;
    width: clamp(300px, 36vw, 480px);
    pointer-events: none;
    transition:
      opacity 0.55s cubic-bezier(0.25, 1, 0.5, 1),
      transform 0.55s cubic-bezier(0.25, 1, 0.5, 1),
      top 0.6s cubic-bezier(0.25, 1, 0.5, 1),
      left 0.6s cubic-bezier(0.25, 1, 0.5, 1),
      right 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .sc-panel.sc-left  { left: clamp(32px, 5vw, 64px); }
  .sc-panel.sc-right { right: clamp(80px, 7vw, 110px); text-align: left; }

  /* entering */
  .sc-panel.sc-hidden  { opacity: 0; }
  .sc-panel.sc-hidden.sc-left  { transform: translateX(-22px); }
  .sc-panel.sc-hidden.sc-right { transform: translateX( 22px); }
  .sc-panel.sc-visible { opacity: 1; transform: translateX(0); }

  /* ── eyebrow ── */
  .sc-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(0.55rem, 0.9vw, 0.68rem);
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.38);
    margin-bottom: 18px;
    line-height: 1;
  }

  /* ── title row ── */
  .sc-title-row {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 22px;
  }

  .sc-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(0.72rem, 1.1vw, 0.84rem);
    font-weight: 300;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.28);
    flex-shrink: 0;
    padding-top: 0.15em;
  }

  .sc-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.1rem, 4.2vw, 3.4rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.0;
    margin: 0;
    transition: color 0.45s ease;
  }

  /* ── accent divider ── */
  .sc-divider {
    width: 100%;
    height: 1px;
    margin-bottom: 20px;
    transition: background 0.45s ease;
    opacity: 0.55;
  }

  /* ── body text ── */
  .sc-body {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(0.6rem, 0.9vw, 0.72rem);
    font-weight: 300;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.52);
    line-height: 2.05;
    white-space: pre-line;
  }

  /* ── paragraph gap ── */
  .sc-body .sc-para + .sc-para {
    margin-top: 14px;
  }

  /* ── left accent bar ── */
  .sc-panel.sc-left  .sc-inner { border-left: 1px solid; padding-left: 20px; }
  .sc-panel.sc-right .sc-inner { border-left: 1px solid; padding-left: 20px; }

  .sc-inner {
    transition: border-color 0.45s ease;
  }

  /* ── CTA ── */
  .sc-cta {
    display: inline-block;
    margin-top: 24px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
    border: 1px solid rgba(255,255,255,0.18);
    padding: 8px 16px;
    border-radius: 0;
    transition: color 0.3s ease, border-color 0.3s ease;
    pointer-events: all;
    cursor: pointer;
  }
  .sc-cta:hover {
    color: #fff;
    border-color: rgba(255,255,255,0.55);
  }

  /* ── subtitle tag (sub-slide indicator) ── */
  .sc-subtitle-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-top: 10px;
    margin-bottom: 2px;
    opacity: 0.45;
    transition: color 0.45s ease;
  }
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export class SlideContent {
    constructor(container, slides) {
        this._slides = slides;
        this._current = -1;
        this._timer = null;

        // Inject CSS once
        if (!document.getElementById('sc-styles')) {
            const tag = document.createElement('style');
            tag.id = 'sc-styles';
            tag.textContent = CSS;
            document.head.appendChild(tag);
        }

        // Outer wrapper
        this._wrap = document.createElement('div');
        this._wrap.className = 'sc-wrap';
        container.appendChild(this._wrap);

        // Single panel that repositions
        this._panel = document.createElement('div');
        this._panel.className = 'sc-panel sc-left sc-hidden';
        this._wrap.appendChild(this._panel);

        // Inner (bears the left border)
        this._inner = document.createElement('div');
        this._inner.className = 'sc-inner';
        this._panel.appendChild(this._inner);

        // Eyebrow
        this._eyebrow = document.createElement('div');
        this._eyebrow.className = 'sc-eyebrow';
        this._inner.appendChild(this._eyebrow);

        // Title row
        const row = document.createElement('div');
        row.className = 'sc-title-row';
        this._num = document.createElement('span');
        this._num.className = 'sc-num';
        this._titleEl = document.createElement('h2');
        this._titleEl.className = 'sc-title';
        row.appendChild(this._num);
        row.appendChild(this._titleEl);
        this._inner.appendChild(row);

        // Subtitle tag (sub-slide)
        this._subtitleTag = document.createElement('div');
        this._subtitleTag.className = 'sc-subtitle-tag';
        this._inner.appendChild(this._subtitleTag);

        // Divider
        this._divider = document.createElement('div');
        this._divider.className = 'sc-divider';
        this._inner.appendChild(this._divider);

        // Body
        this._bodyWrap = document.createElement('div');
        this._bodyWrap.className = 'sc-body';
        this._inner.appendChild(this._bodyWrap);

        // CTA
        this._ctaEl = document.createElement('button');
        this._ctaEl.className = 'sc-cta';
        this._inner.appendChild(this._ctaEl);
    }

    // ── PUBLIC: call on every slide change ──────────────────────────────────────
    show(index) {
        if (index === this._current) return;
        this._current = index;

        const slide = this._slides[index];
        const copy = SLIDE_COPY[index] || {};
        const pos = POSITIONS[index] || { side: 'left', top: '20%' };

        // Hide → reposition → reveal (staggered)
        this._hide();

        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            this._applyContent(slide, copy, pos, index);
            this._reveal();
        }, 260);
    }

    // ── PRIVATE ─────────────────────────────────────────────────────────────────
    _hide() {
        this._panel.classList.remove('sc-visible');
        this._panel.classList.add('sc-hidden');
    }

    _reveal() {
        this._panel.classList.remove('sc-hidden');
        this._panel.classList.add('sc-visible');
    }

    _applyContent(slide, copy, pos, index) {
        const color = slide.color;

        // Position
        this._panel.style.top = pos.top;
        this._panel.style.left = '';
        this._panel.style.right = '';

        this._panel.classList.remove('sc-left', 'sc-right');
        if (pos.side === 'right') {
            this._panel.classList.add('sc-right');
            this._panel.style.right = 'clamp(80px, 7vw, 110px)';
        } else {
            this._panel.classList.add('sc-left');
            this._panel.style.left = 'clamp(32px, 5vw, 64px)';
        }

        // Accent color
        this._titleEl.style.color = color;
        this._divider.style.background = color;
        this._inner.style.borderColor = color + '55';
        this._subtitleTag.style.color = color;

        // Content
        this._eyebrow.textContent = copy.eyebrow || slide.subject.toUpperCase();

        this._num.textContent = `0${slide.subjectNum}`;
        this._titleEl.textContent = slide.title;

        // Sub-slide indicator (only if multi-slide subject)
        if (slide.tot > 1) {
            this._subtitleTag.textContent = slide.subtitle;
            this._subtitleTag.style.display = 'block';
        } else {
            this._subtitleTag.style.display = 'none';
        }

        // Body: split on double-newline into paragraphs
        const bodyText = copy.body || slide.subtitle;
        this._bodyWrap.innerHTML = '';
        bodyText.split('\n\n').forEach((para, i) => {
            const p = document.createElement('div');
            p.className = 'sc-para' + (i > 0 ? ' sc-para' : '');
            p.style.marginTop = i > 0 ? '14px' : '0';
            p.textContent = para.replace(/\n/g, ' ');
            // Stagger fade-in per paragraph
            p.style.opacity = '0';
            p.style.transition = `opacity 0.45s ease ${0.18 + i * 0.08}s`;
            this._bodyWrap.appendChild(p);
            requestAnimationFrame(() => { requestAnimationFrame(() => { p.style.opacity = '1'; }); });
        });

        // CTA
        if (copy.cta) {
            this._ctaEl.textContent = copy.cta;
            this._ctaEl.style.display = 'inline-block';
            this._ctaEl.style.color = color;
            this._ctaEl.style.borderColor = color + '44';
        } else {
            this._ctaEl.style.display = 'none';
        }
    }

    destroy() {
        clearTimeout(this._timer);
        this._wrap.remove();
        const styleTag = document.getElementById('sc-styles');
        if (styleTag) styleTag.remove();
    }
}
