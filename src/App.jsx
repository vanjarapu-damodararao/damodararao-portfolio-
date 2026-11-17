import { useLayoutEffect } from 'react';
import { gsap } from './lib/gsap';
import useReducedMotion from './hooks/useReducedMotion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Expertise from './sections/Expertise';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Experiments from './sections/Experiments';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';

export default function App() {
  const reduced = useReducedMotion();

  // Site-wide scroll reveal: any element with data-reveal fades/slides in once.
  // Content is fully visible in the HTML first; GSAP only animates it in,
  // so nothing is hidden if JavaScript fails.
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // Each section unfolds like a drawing sheet being opened onto the desk:
      // it starts tilted back from its top edge and slightly shaded, then lies flat.
      // clearProps removes the transform afterwards so nothing inside is affected.
      gsap.utils.toArray('main > section.block').forEach((el) => {
        gsap.from(el, {
          rotateX: -9,
          y: 70,
          transformPerspective: 1600,
          transformOrigin: '50% 0%',
          filter: 'brightness(0.94)',
          duration: 1.4,
          ease: 'expo.out',
          clearProps: 'transform,filter',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        });
      });
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
      gsap.utils.toArray('[data-rule]').forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        });
      });
    });
    return () => ctx.revert(); // removes all these animations on unmount
  }, [reduced]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Expertise />
        <Projects />
        <Skills />
        <Experience />
        <Experiments />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
