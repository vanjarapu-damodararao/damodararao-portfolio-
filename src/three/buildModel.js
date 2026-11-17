/* =========================================================
   FROM BLUEPRINT TO BROWSER: procedural hero model.

   Four page-shaped layers, one per layer of a website. Each
   layer's surface is drawn on a canvas so it shows what that
   layer really is:
     01 HTML        → dashed wireframe with <header>, <main>…
     02 CSS         → type, colour swatches, a CSS rule
     03 JavaScript  → code, a toggle, a cursor, motion path
     04 CMS         → content blocks and a Publish button
   On scroll the layers close together, their 3D parts flatten
   into the page, and a finished browser window lands on top:
   the website goes live.

   Look: flat "drawing" tones (MeshBasicMaterial, no lights),
   ink outlines on every edge, pencil hatching on the sides.
   ========================================================= */
import * as THREE from 'three';

export const W = 6; // page width
export const D = 4; // page depth (3:2 like a screen)
export const T = 0.12; // plate thickness
const TOP = T / 2;

const C = {
  ink: 0x16181d,
  top: 0xf4f0e7,
  right: 0xd6cfbf,
  front: 0xe6e0d3,
  survey: 0xff4f1a,
  surveyR: 0xc93a0c,
  surveyF: 0xe8461a,
};

const CW = 900, CH = 600; // canvas size, same 3:2 ratio as the plate
const FONT = { d: 'Archivo, system-ui, sans-serif', s: '"Instrument Serif", Georgia, serif', m: '"JetBrains Mono", ui-monospace, monospace' };
const INK = '#16181D', GRAPH = '#5C6068', ORANGE = '#FF4F1A', DEEP = '#B8360B', PAPER = '#F4F0E7', PAPER2 = '#E2DCCF';

/** Pencil hatching drawn on a small canvas, used on the plate sides. */
function makeHatch() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#d6cfbf';
  g.fillRect(0, 0, 64, 64);
  g.strokeStyle = 'rgba(22,24,29,.28)';
  g.lineWidth = 1.2;
  for (let i = -64; i < 128; i += 8) {
    g.beginPath();
    g.moveTo(i, 64);
    g.lineTo(i + 64, 0);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 1);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- 2D drawings for each layer's surface ---------- */
function base(g) {
  g.fillStyle = PAPER;
  g.fillRect(0, 0, CW, CH);
  g.strokeStyle = 'rgba(22,24,29,.06)';
  g.lineWidth = 1;
  for (let x = 0; x <= CW; x += 30) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, CH); g.stroke(); }
  for (let y = 0; y <= CH; y += 30) { g.beginPath(); g.moveTo(0, y); g.lineTo(CW, y); g.stroke(); }
}
const text = (g, s, x, y, font, color = INK) => { g.font = font; g.fillStyle = color; g.fillText(s, x, y); };
function box(g, x, y, w, h, { fill, stroke = INK, dash, lw = 2 } = {}) {
  if (fill) { g.fillStyle = fill; g.fillRect(x, y, w, h); }
  if (stroke) { g.setLineDash(dash || []); g.lineWidth = lw; g.strokeStyle = stroke; g.strokeRect(x, y, w, h); g.setLineDash([]); }
}

const DRAW = [
  // 01 HTML: structure as a dashed wireframe with tag names
  (g) => {
    base(g);
    const d = { stroke: GRAPH, dash: [10, 7] };
    const tag = (s, x, y) => text(g, s, x, y, `600 22px ${FONT.m}`, DEEP);
    box(g, 40, 40, 820, 80, d); tag('<header>', 56, 72); box(g, 560, 58, 280, 44, d); tag('<nav>', 576, 88);
    box(g, 40, 145, 540, 250, d); tag('<main>', 56, 178); box(g, 70, 200, 340, 46, d); tag('<h1>', 84, 231);
    box(g, 70, 262, 460, 18, { stroke: GRAPH, dash: [6, 6] }); box(g, 70, 292, 380, 18, { stroke: GRAPH, dash: [6, 6] });
    box(g, 70, 330, 150, 44, d); tag('<a>', 84, 360);
    box(g, 605, 145, 255, 250, d); tag('<aside>', 621, 178);
    [40, 320, 600].forEach((x) => box(g, x, 420, 260, 110, d)); tag('<section>', 56, 452);
    box(g, 40, 548, 820, 30, d); tag('<footer>', 56, 572);
  },
  // 02 CSS: type, colour, spacing and a rule
  (g) => {
    base(g);
    text(g, 'Aa', 40, 210, `900 190px ${FONT.d}`);
    text(g, 'Archivo', 50, 260, `600 26px ${FONT.d}`, GRAPH);
    text(g, 'Aa', 330, 190, `italic 150px ${FONT.s}`);
    text(g, 'Instrument Serif', 336, 260, `600 26px ${FONT.d}`, GRAPH);
    const sw = [PAPER2, INK, GRAPH, ORANGE, '#1B2A4A'];
    sw.forEach((c, i) => box(g, 40 + i * 120, 310, 100, 100, { fill: c, stroke: INK }));
    box(g, 640, 40, 220, 370, { fill: INK, stroke: null });
    ['.hero {', '  color: ink;', '  font: Archivo;', '  gap: 24px;', '  padding: 64px;', '}'].forEach((l, i) =>
      text(g, l, 660, 90 + i * 52, `500 24px ${FONT.m}`, i === 0 || i === 5 ? ORANGE : PAPER));
    // spacing ruler
    g.strokeStyle = INK; g.lineWidth = 2;
    g.beginPath(); g.moveTo(40, 470); g.lineTo(860, 470); g.stroke();
    [8, 16, 24, 40, 64, 96, 160].reduce((x, s) => {
      g.beginPath(); g.moveTo(x, 455); g.lineTo(x, 485); g.stroke();
      text(g, String(s), x + 4, 515, `500 20px ${FONT.m}`, GRAPH);
      return x + s * 0.9 + 40;
    }, 40);
    text(g, 'layout · colour · type', 40, 570, `italic 34px ${FONT.s}`, GRAPH);
  },
  // 03 JavaScript: behaviour
  (g) => {
    base(g);
    box(g, 40, 40, 500, 330, { fill: INK, stroke: null });
    [
      ['btn', '.addEventListener(', ORANGE],
      ['  ', "'click', () => {", PAPER],
      ['  ', '  menu.toggle()', PAPER],
      ['  ', '  gsap.to(card,', PAPER],
      ['  ', '    { y: 0 })', PAPER],
      ['  ', '})', PAPER],
    ].forEach(([a, b, c], i) => { text(g, a, 60, 95 + i * 48, `500 25px ${FONT.m}`, ORANGE); text(g, b, a === 'btn' ? 110 : 60, 95 + i * 48, `500 25px ${FONT.m}`, c); });
    // toggle switch
    g.lineWidth = 3; g.strokeStyle = INK; g.beginPath(); g.roundRect(600, 60, 180, 80, 40); g.stroke();
    text(g, 'toggle()', 600, 180, `500 24px ${FONT.m}`, GRAPH);
    // motion path
    g.setLineDash([12, 10]); g.strokeStyle = ORANGE; g.lineWidth = 3;
    g.beginPath(); g.moveTo(80, 520); g.quadraticCurveTo(420, 300, 820, 470); g.stroke(); g.setLineDash([]);
    box(g, 50, 490, 60, 60, { fill: PAPER2, stroke: INK });
    box(g, 790, 440, 60, 60, { fill: ORANGE, stroke: INK });
    // cursor
    g.fillStyle = INK; g.beginPath();
    g.moveTo(640, 220); g.lineTo(640, 300); g.lineTo(660, 282); g.lineTo(676, 318); g.lineTo(690, 311); g.lineTo(674, 276); g.lineTo(700, 274); g.closePath(); g.fill();
    text(g, 'behaviour & motion', 580, 380, `italic 34px ${FONT.s}`, GRAPH);
  },
  // 04 CMS: content management
  (g) => {
    base(g);
    box(g, 40, 40, 200, 520, { fill: PAPER2, stroke: INK });
    ['Pages', 'Posts', 'Media', 'Users', 'Settings'].forEach((s, i) => text(g, s, 64, 100 + i * 56, `600 26px ${FONT.d}`, i === 1 ? DEEP : INK));
    g.fillStyle = ORANGE; g.fillRect(40, 72 + 56, 6, 40);
    [0, 1, 2].forEach((i) => {
      const y = 40 + i * 140;
      box(g, 270, y, 590, 120, { stroke: INK });
      box(g, 285, y + 15, 130, 90, { fill: PAPER2, stroke: INK });
      g.strokeStyle = GRAPH; g.lineWidth = 1.5; g.beginPath(); g.moveTo(285, y + 15); g.lineTo(415, y + 105); g.moveTo(415, y + 15); g.lineTo(285, y + 105); g.stroke();
      box(g, 440, y + 22, 300 - i * 50, 20, { fill: INK, stroke: null });
      box(g, 440, y + 58, 380, 12, { fill: GRAPH, stroke: null });
      box(g, 440, y + 80, 320, 12, { fill: GRAPH, stroke: null });
    });
    box(g, 660, 480, 200, 70, { fill: ORANGE, stroke: INK });
    text(g, 'Publish', 702, 526, `700 30px ${FONT.d}`);
    text(g, 'content', 290, 540, `italic 40px ${FONT.s}`, GRAPH);
  },
  // 05 Browser: the finished, live website
  (g) => {
    base(g);
    g.fillStyle = PAPER; g.fillRect(0, 0, CW, CH);
    box(g, 0, 0, CW, 70, { fill: INK, stroke: null });
    [ORANGE, PAPER, PAPER].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(40 + i * 36, 35, 11, 0, Math.PI * 2); g.fill(); });
    box(g, 170, 16, 560, 38, { fill: '#2A2D34', stroke: null });
    text(g, 'damodararao.dev', 196, 44, `500 22px ${FONT.m}`, PAPER);
    text(g, '● LIVE', 760, 45, `700 22px ${FONT.d}`, ORANGE);
    // page
    text(g, 'DAMODARA RAO', 40, 120, `800 26px ${FONT.d}`);
    ['About', 'Work', 'Contact'].forEach((s, i) => text(g, s, 560 + i * 100, 120, `500 22px ${FONT.d}`, GRAPH));
    g.fillStyle = 'rgba(22,24,29,.15)'; g.fillRect(40, 140, 820, 2);
    text(g, 'Building digital', 40, 225, `italic 66px ${FONT.s}`);
    text(g, 'experiences.', 40, 290, `italic 66px ${FONT.s}`);
    box(g, 40, 325, 220, 60, { fill: INK, stroke: null });
    text(g, 'View work ↗', 66, 364, `600 24px ${FONT.d}`, PAPER);
    box(g, 280, 325, 60, 60, { fill: ORANGE, stroke: null });
    box(g, 520, 170, 340, 215, { fill: PAPER2, stroke: INK });
    g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.moveTo(560, 340); g.lineTo(640, 250); g.lineTo(700, 310); g.lineTo(750, 270); g.lineTo(830, 340); g.stroke();
    [40, 320, 600].forEach((x, i) => {
      box(g, x, 415, 260, 150, { stroke: INK });
      box(g, x + 16, 431, 228, 80, { fill: i === 1 ? ORANGE : PAPER2, stroke: null });
      box(g, x + 16, 528, 150, 14, { fill: INK, stroke: null });
    });
  },
];

function makeSurface(i) {
  const c = document.createElement('canvas');
  c.width = CW; c.height = CH;
  const g = c.getContext('2d');
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  const paint = () => { g.save(); DRAW[i](g); g.restore(); t.needsUpdate = true; };
  paint();
  document.fonts?.ready.then(paint); // redraw once the web fonts are loaded
  return t;
}

// Canvas pixel → plate local position (image top = far edge, -z)
const px = (x) => (x / CW - 0.5) * W;
const pz = (y) => (y / CH - 0.5) * D;

export function createBuilding({ startDrop = 9 } = {}) {
  const disposables = [];
  const track = (o) => (disposables.push(o), o);

  // polygonOffset pushes faces back slightly so the ink lines always draw on top
  const mb = (o) =>
    track(new THREE.MeshBasicMaterial({ polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, ...o }));
  const hatch = track(makeHatch());

  // Box faces order: +x, -x, +y, -y, +z, -z
  const paper = [mb({ color: C.right }), mb({ color: C.front }), mb({ color: C.top }), mb({ color: C.right }), mb({ color: C.front }), mb({ color: C.front })];
  const orange = [mb({ color: C.surveyR }), mb({ color: C.surveyF }), mb({ color: C.survey }), mb({ color: C.surveyR }), mb({ color: C.surveyF }), mb({ color: C.surveyF })];
  const lineMat = track(new THREE.LineBasicMaterial({ color: C.ink }));
  const wireMat = track(new THREE.LineDashedMaterial({ color: C.ink, dashSize: 0.08, gapSize: 0.06 }));

  function solid(w, h, d, x, y, z, parent, mats = paper, lines = lineMat) {
    const g = track(new THREE.BoxGeometry(w, h, d));
    const m = new THREE.Mesh(g, mats);
    m.position.set(x, y, z);
    m.add(new THREE.LineSegments(track(new THREE.EdgesGeometry(g)), lines));
    parent.add(m);
    return m;
  }
  /** Box in canvas pixels, standing on the plate (used for the 3D parts). */
  const onPage = (x, y, w, h, height, parent, mats) =>
    solid((w / CW) * W, height, (h / CH) * D, px(x + w / 2), TOP + height / 2, pz(y + h / 2), parent, mats);
  /** Wireframe-only box: the "structure" before it has any skin. */
  function wire(x, y, w, h, height, parent) {
    const g = track(new THREE.BoxGeometry((w / CW) * W, height, (h / CH) * D));
    const l = new THREE.LineSegments(track(new THREE.EdgesGeometry(g)), wireMat);
    l.computeLineDistances();
    l.position.set(px(x + w / 2), TOP + height / 2, pz(y + h / 2));
    parent.add(l);
  }

  const group = new THREE.Group();
  const floors = [];
  const slabs = [];
  const parts = []; // 3D details per layer: they flatten into the page on assembly

  for (let i = 0; i < 5; i++) {
    const f = new THREE.Group();
    group.add(f);
    floors.push(f);
    const surface = track(makeSurface(i));
    const browser = i === 4;
    const mats = browser
      ? [0, 1, 2, 3, 4, 5].map((k) => mb({ ...(k === 2 ? { map: surface } : { color: k === 1 || k > 3 ? C.front : C.right }), transparent: true }))
      : [mb({ map: hatch }), paper[1], mb({ map: surface }), paper[3], paper[4], paper[5]];
    const slab = solid(W, T, D, 0, 0, 0, f, mats, browser ? track(new THREE.LineBasicMaterial({ color: C.ink, transparent: true })) : lineMat);
    slab.userData.floor = i;
    if (!browser) slabs.push(slab);
    const p = new THREE.Group();
    f.add(p);
    parts.push(p);
    f.userData = { drop: browser ? 0 : startDrop, lift: 0, mats, edge: slab.children[0].material };
  }

  // 01 HTML: dashed wireframe volumes over the layout
  {
    const p = parts[0];
    wire(40, 40, 820, 80, 0.35, p);
    wire(40, 145, 540, 250, 0.55, p);
    wire(605, 145, 255, 250, 0.45, p);
    [40, 320, 600].forEach((x) => wire(x, 420, 260, 110, 0.3, p));
  }
  // 02 CSS: colour swatches rise as small blocks
  {
    const p = parts[1];
    [0.18, 0.3, 0.42, 0.55, 0.24].forEach((h, k) => onPage(40 + k * 120, 310, 100, 100, h, p, k === 3 ? orange : paper));
  }
  // 03 JavaScript: the moving element and the toggle knob
  {
    const p = parts[2];
    onPage(790, 440, 60, 60, 0.35, p, orange);
    onPage(50, 490, 60, 60, 0.2, p);
    const g = track(new THREE.CylinderGeometry(0.2, 0.2, 0.22, 24));
    const knob = new THREE.Mesh(g, [orange[1], orange[2], orange[2]]);
    knob.add(new THREE.LineSegments(track(new THREE.EdgesGeometry(g, 40)), lineMat));
    knob.position.set(px(740), TOP + 0.11, pz(100));
    p.add(knob);
    p.userData.knob = knob;
  }
  // 04 CMS: content cards and the Publish button
  {
    const p = parts[3];
    [0, 1, 2].forEach((i) => onPage(285, 55 + i * 140, 130, 90, 0.16 + i * 0.06, p));
    onPage(660, 480, 200, 70, 0.14, p, orange);
  }

  // Orange dimension line measuring the stack height
  const sMat = track(new THREE.LineBasicMaterial({ color: C.survey }));
  const dim = new THREE.Group();
  dim.position.set(-W / 2 - 0.7, 0, D / 2 + 0.7);
  const dimLine = new THREE.Line(track(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)])), sMat);
  const tickG = track(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.2, 0, 0), new THREE.Vector3(0.2, 0, 0)]));
  const tick0 = new THREE.Line(tickG, sMat);
  const tick1 = new THREE.Line(tickG, sMat);
  dim.add(dimLine, tick0, tick1);
  group.add(dim);

  // Dashed survey footprint on the ground
  const fp = new THREE.LineLoop(
    track(new THREE.BufferGeometry().setFromPoints([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => new THREE.Vector3(a * (W / 2 + 0.35), -0.48, b * (D / 2 + 0.35))))),
    track(new THREE.LineDashedMaterial({ color: C.survey, dashSize: 0.18, gapSize: 0.12 }))
  );
  fp.computeLineDistances();
  group.add(fp);

  // Faint drafting grid (not rotated with the stack)
  const grid = new THREE.GridHelper(18, 36, C.ink, C.ink);
  grid.material.transparent = true;
  grid.material.opacity = 0.06;
  grid.position.y = -0.5;
  track(grid.geometry);
  track(grid.material);

  return {
    group,
    grid,
    floors,
    slabs,
    parts,
    dimLine,
    tick1,
    dispose: () => disposables.forEach((d) => d.dispose && d.dispose()),
  };
}
