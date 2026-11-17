// Layer labels for the hero stack. Kept separate from buildModel.js
// so the page can show labels without downloading Three.js up front.
// `code` is the tiny snippet shown when a visitor hovers a layer.
export const LAYERS = [
  { n: '01', name: 'HTML', detail: 'Structure', code: '<header> <main> <footer>' },
  { n: '02', name: 'CSS', detail: 'Style', code: '.hero { color: var(--ink) }' },
  { n: '03', name: 'JavaScript', detail: 'Behaviour', code: "btn.onclick = () => menu.toggle()" },
  { n: '04', name: 'CMS', detail: 'Content', code: 'WordPress · Webflow · Laravel' },
];
