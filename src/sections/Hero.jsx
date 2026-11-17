import { Component, Suspense, lazy, useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { site } from '../data/site';
import { LAYERS } from '../three/layers';
import Button from '../components/Button';
import HeroFallback from '../three/HeroFallback';
import useReducedMotion from '../hooks/useReducedMotion';
import useMediaQuery from '../hooks/useMediaQuery';
import useWebGL from '../hooks/useWebGL';
import useInView from '../hooks/useInView';

// Lazy-load the 3D: Three.js downloads in a separate file AFTER the text shows.
const HeroScene = lazy(() => import('../three/HeroScene'));

// If anything in the 3D crashes, show the static drawing instead of a blank area.
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <HeroFallback /> : this.props.children; }
}

export default function Hero() {
  const reduced = useReducedMotion();
  const mobile = useMediaQuery('(max-width: 860px)');
  const webgl = useWebGL();
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const nameRef = useRef(null);
  const labelRefs = useRef([]);
  const visible = useInView(stageRef, { initial: true }); // hero is on screen at page load

  // One shared object the 3D reads every frame (no React re-renders needed)
  const input = useRef({ assemble: 0, hover: -1, mx: 0, my: 0, drag: 0, rx: 0, ry: 0, dragging: false, inside: false, labelHover: false }).current;

  // Fit "DAMODARA RAO" exactly to the page width
  useLayoutEffect(() => {
    const el = nameRef.current;
    const fit = () => {
      const words = [...el.querySelectorAll('.w')];
      el.style.setProperty('--namesize', '100px');
      const pad = parseFloat(getComputedStyle(el).paddingLeft) * 2;
      const avail = el.clientWidth - pad;
      const w = mobile ? words[0].getBoundingClientRect().width : words.reduce((s, x) => s + x.getBoundingClientRect().width, 0) + 22;
      const size = Math.min((100 * avail) / w, mobile ? 160 : 260);
      heroRef.current.style.setProperty('--namesize', `${size}px`);
      el.style.removeProperty('--namesize');
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [mobile]);

  // Intro animation (text) + scroll-driven assembly of the building
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) {
        // No scroll story: show the finished, live website straight away
        input.assemble = 1;
        return;
      }
      // The hero holds still (pinned under the nav) while the layers
      // assemble into the live website, then the page scrolls on.
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: () => `top ${document.querySelector('.nav')?.offsetHeight || 0}px`,
        end: '+=110%',
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (s) => (input.assemble = s.progress),
      });
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.name .c > span', { yPercent: 110, duration: 1.3, stagger: 0.035 }, 0.15)
        .from('.tagline span', { yPercent: 60, opacity: 0, duration: 1, stagger: 0.08 }, 0.4)
        .from(['.hero .role', '.hero .desc', '.hero .ctas .btn', '.avail', '.cue'], { y: 16, opacity: 0, duration: 0.9, stagger: 0.06 }, 0.6);
    }, heroRef);
    return () => ctx.revert();
  }, [reduced, input]);

  // Mouse-follow, drag-to-rotate (mouse or touch), hover tracking
  useEffect(() => {
    const stage = stageRef.current;
    let lastX = 0;
    const onMove = (e) => {
      input.mx = e.clientX / window.innerWidth - 0.5;
      input.my = e.clientY / window.innerHeight - 0.5;
      if (input.dragging) { input.drag += (e.clientX - lastX) * 0.008; lastX = e.clientX; }
    };
    const onDown = (e) => { input.dragging = true; lastX = e.clientX; };
    const onUp = () => {
      if (!input.dragging) return;
      input.dragging = false;
      gsap.to(input, { drag: 0, duration: 2, ease: 'power3.out' }); // ease back
    };
    const enter = () => (input.inside = true);
    const leave = () => { input.inside = false; if (!input.labelHover) input.hover = -1; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointerenter', enter);
    stage.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointerenter', enter);
      stage.removeEventListener('pointerleave', leave);
    };
  }, [input]);

  const nameLetters = (word) =>
    [...word].map((ch, i) => (
      <span className="c" key={i}><span>{ch}</span></span>
    ));

  return (
    <section className="hero" id="home" ref={heroRef} aria-label="Introduction">
      <div className="stage" ref={stageRef}>
        {webgl ? (
          <SceneBoundary>
            <Suspense fallback={null}>
              <HeroScene input={input} labelRefs={labelRefs} mobile={mobile} reduced={reduced} active={visible} />
            </Suspense>
            <div className="labels" aria-hidden="true">
              {LAYERS.map((l, i) => (
                <div
                  key={l.n}
                  className="fl"
                  ref={(el) => (labelRefs.current[i] = el)}
                  onMouseEnter={() => { input.labelHover = true; input.hover = i; }}
                  onMouseLeave={() => { input.labelHover = false; input.hover = -1; }}
                >
                  <span className="lead" />
                  <b>{l.n} {l.name}</b>
                  <em>{l.detail}</em>
                  <code>{l.code}</code>
                </div>
              ))}
              <div className="fl live-stamp" ref={(el) => (labelRefs.current[4] = el)}>
                <span className="lead" />
                <strong><i />Live</strong>
                <em>from blueprint to browser</em>
              </div>
            </div>
          </SceneBoundary>
        ) : (
          <HeroFallback />
        )}
      </div>

      {site.available && (
        <p className="avail"><i aria-hidden="true" />{site.availabilityText}</p>
      )}

      <div className="hero-note">
        <p className="role">{site.title}</p>
        <p className="tagline">
          {site.tagline.map((line) => <span key={line}>{line}</span>)}
        </p>
        <p className="desc">{site.intro}</p>
        <div className="ctas">
          <Button href="#work" variant="solid" arrow="↗">Explore My Work</Button>
          <Button href="#contact">Let's Work Together</Button>
        </div>
      </div>

      <p className="cue" aria-hidden="true"><span />Scroll to launch the website</p>

      <h1 className="name" ref={nameRef}>
        <span className="sr-only">{site.name}, {site.title}</span>
        <span aria-hidden="true">
          {site.name.split(' ').map((w) => (
            <span className="w" key={w}>{nameLetters(w)}</span>
          ))}
        </span>
      </h1>
    </section>
  );
}
