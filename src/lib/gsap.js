// Register GSAP plugins once, then import { gsap, ScrollTrigger } from here everywhere.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Development only: lets you inspect animations from the browser console.
if (import.meta.env.DEV) window.__gsap = gsap;

export { gsap, ScrollTrigger };
