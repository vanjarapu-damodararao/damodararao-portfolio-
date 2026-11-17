/* =========================================================
   EXPERTISE: services shown in the "What I bring" schedule.
   status: 'practised' (you do this regularly)
           'developing' (you can do it, still building depth)
   Adjust honestly; visitors trust a precise list more than a long one.
   icon: one of 'wp' | 'framer' | 'shopify' | 'code' | 'responsive' | 'ux' | 'interactive'
   ========================================================= */

export const expertise = [
  {
    title: 'WordPress Development',
    description:
      'Custom, easy-to-manage WordPress websites with clean structure, so clients can update content without breaking the design.',
    tech: ['WordPress', 'Elementor', 'PHP'],
    status: 'practised',
    icon: 'wp',
  },
  {
    title: 'Framer Development',
    description:
      'Fast, polished marketing sites in Framer with thoughtful interactions and responsive layouts.',
    tech: ['Framer', 'Interactions'],
    status: 'practised',
    icon: 'framer',
  },
  {
    title: 'Shopify Development',
    description:
      'Shopify storefronts set up and customised to feel on-brand and simple to shop.',
    tech: ['Shopify', 'Liquid'],
    status: 'developing', // PLACEHOLDER status: change to 'practised' if accurate
    icon: 'shopify',
  },
  {
    title: 'Frontend Development',
    description:
      'Hand-written HTML, CSS and JavaScript: semantic, accessible and fast, without unnecessary weight.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    status: 'practised',
    icon: 'code',
  },
  {
    title: 'Responsive Web Design',
    description:
      'Layouts designed for every screen, from large desktops to small phones, not just shrunk to fit.',
    tech: ['CSS Grid', 'Flexbox', 'Mobile-first'],
    status: 'practised',
    icon: 'responsive',
  },
  {
    title: 'Interactive Web Experiences',
    description:
      'Purposeful motion and 3D that support the content: the kind of work you see on this page.',
    tech: ['GSAP', 'Three.js', 'React'],
    status: 'developing',
    icon: 'interactive',
  },
];
