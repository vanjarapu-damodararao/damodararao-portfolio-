/* =========================================================
   PROJECTS: the single place to add or edit your work.

   Every project chooses a `layout`, which decides how it is shown:
     'elevation' → big browser frame that scrolls the full page on hover
                   (best for WordPress / Shopify / full websites).
                   Use a TALL full-page screenshot as `thumbnail`.
     'cut'       → split view: code on the left, result on the right
                   (best for hand-coded HTML / CSS / JS work).
     'motion'    → three frames that fan out like an animation sequence
                   (best for Framer / animated work). Use `frames`.
     'list'      → a row in the "More projects" list with a hover preview.

   Images: put files in /public/projects/ and reference them like
   '/projects/my-site-full.jpg'. Leave null to show a drawn placeholder.

   placeholder: true  → shows the orange "Placeholder" stamp.
   experimental: true → shows the "Experiment" badge (not client work).
   ========================================================= */

export const projects = [
  {
    id: 'wp-01',
    layout: 'elevation',
    placeholder: true,
    title: '[Project title]',
    category: 'WordPress',
    description:
      'Short description: the brief, what you built and the key decisions you made. Replace this text with real project information.',
    technologies: ['WordPress', 'Elementor', 'PHP'],
    thumbnail: null, // e.g. '/projects/wp-01-full.jpg' (tall full-page screenshot)
    liveUrl: null, // e.g. 'https://client-site.com'
    caseStudyUrl: null,
    urlLabel: '[project-url.com]',
  },
  {
    id: 'code-01',
    layout: 'cut',
    placeholder: true,
    title: '[Project title]',
    category: 'Custom Development',
    description:
      'Hand-coded work is shown as a cut through the build: real code next to what it renders. Hover a line to see its element.',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    liveUrl: null,
    caseStudyUrl: null,
    // The code excerpt shown on the left. `key` links a line to a preview element.
    cut: {
      lines: [
        { key: 'h', text: '<h1>Studio launch</h1>' },
        { key: 'p', text: '<p class="lede">' },
        { key: 'p', text: '  Built by hand.</p>' },
        { key: 'a', text: '<a class="btn" href="#">' },
        { key: 'a', text: '  Start</a>' },
      ],
      preview: [
        { key: 'h', type: 'h', text: 'Studio launch' },
        { key: 'p', type: 'p', text: 'Built by hand.' },
        { key: 'a', type: 'a', text: 'Start' },
      ],
    },
  },
  {
    id: 'framer-01',
    layout: 'motion',
    placeholder: true,
    title: '[Project title]',
    category: 'Framer',
    description:
      'Framer work is about motion, so it is shown as frames that fan out into a sequence. Replace with your real Framer project.',
    technologies: ['Framer', 'Interactions'],
    frames: null, // e.g. ['/projects/f1.jpg', '/projects/f2.jpg', '/projects/f3.jpg']
    liveUrl: null,
    caseStudyUrl: null,
  },
  {
    id: 'shopify-01',
    layout: 'list',
    placeholder: true,
    title: '[Shopify store project]',
    category: 'Shopify',
    technologies: ['Shopify', 'Liquid'],
    thumbnail: null,
    liveUrl: null,
    previewStyle: 'a',
  },
  {
    id: 'uiux-01',
    layout: 'list',
    placeholder: true,
    title: '[UI/UX design study]',
    category: 'UI/UX',
    technologies: ['Figma'],
    thumbnail: null,
    liveUrl: null,
    previewStyle: 'b',
  },
  {
    id: 'wp-02',
    layout: 'list',
    placeholder: true,
    title: '[Second WordPress build]',
    category: 'WordPress',
    technologies: ['WordPress'],
    thumbnail: null,
    liveUrl: null,
    previewStyle: 'c',
  },
  {
    id: 'exp-3d',
    layout: 'list',
    placeholder: false,
    experimental: true,
    title: "This portfolio's 3D build",
    category: 'Experimental 3D',
    technologies: ['Three.js', 'React Three Fiber', 'GSAP'],
    thumbnail: null,
    liveUrl: '#home', // links back to the hero
    previewStyle: 'd',
  },
];
