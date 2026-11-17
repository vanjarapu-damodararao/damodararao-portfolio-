/* =========================================================
   SKILLS & TOOLS, grouped by "layer" of a website.
   level: 'practised' | 'familiar' | 'learning'
   These are honest defaults based on what you told me.
   Please review the ones marked VERIFY and adjust.
   ========================================================= */

export const skillGroups = [
  {
    name: 'Frontend',
    note: 'the structure and finish',
    items: [
      { name: 'HTML5', level: 'practised' },
      { name: 'CSS3', level: 'practised' },
      { name: 'JavaScript', level: 'practised' },
      { name: 'Bootstrap', level: 'familiar' }, // VERIFY
      { name: 'React', level: 'learning' },
    ],
  },
  {
    name: 'CMS & Platforms',
    note: 'where clients manage content',
    items: [
      { name: 'WordPress', level: 'practised' },
      { name: 'Elementor', level: 'familiar' }, // VERIFY
      { name: 'Framer', level: 'practised' },
      { name: 'Shopify', level: 'familiar' }, // VERIFY
    ],
  },
  {
    name: 'Backend',
    note: 'logic behind the page',
    items: [{ name: 'PHP', level: 'practised' }],
  },
  {
    name: 'Creative Development',
    note: 'motion and 3D',
    items: [
      { name: 'GSAP', level: 'learning' },
      { name: 'Three.js', level: 'learning' },
      { name: 'React Three Fiber', level: 'learning' },
    ],
  },
];

export const levelLabels = {
  practised: 'Practised',
  familiar: 'Familiar',
  learning: 'Learning',
};
