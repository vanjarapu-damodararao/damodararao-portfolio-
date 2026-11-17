import { Suspense, lazy, useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import SectionHeading from '../components/SectionHeading';
import useInView from '../hooks/useInView';
import useReducedMotion from '../hooks/useReducedMotion';
import useWebGL from '../hooks/useWebGL';

const WireframeScene = lazy(() => import('../three/WireframeScene'));

/* ---------- 01 Interactive 3D object (loads only when scrolled near) ---------- */
function Demo3D({ reduced }) {
  const ref = useRef(null);
  const near = useInView(ref, { rootMargin: '200px', once: true });
  const visible = useInView(ref);
  const webgl = useWebGL();
  return (
    <div className="demo demo-3d" ref={ref}>
      {webgl && near ? (
        <Suspense fallback={null}><WireframeScene active={visible} reduced={reduced} /></Suspense>
      ) : (
        <p className="demo-note">{webgl ? 'Loading…' : '3D is not available in this browser.'}</p>
      )}
      <span className="demo-hint">drag to spin</span>
    </div>
  );
}

/* ---------- 02 Scroll-based storytelling: a page builds itself as you scroll ---------- */
function DemoScroll({ reduced }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'bottom 35%', scrub: 0.5 } })
        .from('.ss-box', { scaleX: 0, transformOrigin: 'left', stagger: 0.15, ease: 'none' })
        .from('.ss-fill', { opacity: 0, stagger: 0.1 }, '>-0.1')
        .from('.ss-dot', { x: -140, opacity: 0, ease: 'none' }, '>-0.1')
        .to('.ss-step', { color: 'var(--survey)', stagger: 0.25 }, 0);
    }, ref);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <div className="demo demo-scroll" ref={ref}>
      <ol className="ss-steps" aria-hidden="true">
        <li className="ss-step">Structure</li><li className="ss-step">Style</li><li className="ss-step">Behaviour</li>
      </ol>
      <div className="ss-page" aria-hidden="true">
        <div className="ss-box ss-fill" style={{ height: 14, width: '40%' }} />
        <div className="ss-box" style={{ height: 70 }}><span className="ss-fill ss-ink" /></div>
        <div className="ss-row"><div className="ss-box" /><div className="ss-box ss-fill" /><div className="ss-box" /></div>
        <div className="ss-btn ss-box"><span className="ss-dot" /></div>
      </div>
    </div>
  );
}

/* ---------- 03 Creative typography: letters change width & weight near the pointer ---------- */
function DemoType({ reduced }) {
  const ref = useRef(null);
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    const letters = [...el.querySelectorAll('span')];
    const onMove = (e) => {
      letters.forEach((l) => {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        const k = Math.max(0, 1 - d / 160); // 1 = right under the pointer
        l.style.fontVariationSettings = `"wdth" ${62 + k * 63}, "wght" ${300 + k * 600}`;
        l.style.color = k > 0.6 ? 'var(--survey)' : '';
      });
    };
    const reset = () => letters.forEach((l) => { l.style.fontVariationSettings = ''; l.style.color = ''; });
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);
    return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', reset); };
  }, [reduced]);
  return (
    <div className="demo demo-type" ref={ref} aria-label="The word Interactive, which reacts to your pointer">
      <p aria-hidden="true">{[...'INTERACTIVE'].map((c, i) => <span key={i}>{c}</span>)}</p>
    </div>
  );
}

/* ---------- 04 Experimental interaction: an ink field that parts around the pointer ---------- */
function DemoInk({ reduced }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  useEffect(() => {
    const cv = ref.current;
    const cx = cv.getContext('2d');
    let W, H, pts = [], px = -999, py = -999, raf;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      const s = W < 500 ? 18 : 22;
      for (let y = s; y < H; y += s) for (let x = s; x < W; x += s) pts.push({ x, y, ox: x, oy: y });
    };
    const draw = () => {
      cx.clearRect(0, 0, W, H);
      for (const p of pts) {
        const dx = p.ox - px, dy = p.oy - py, d = Math.hypot(dx, dy) || 1, f = Math.max(0, 1 - d / 110);
        p.x += (p.ox + (dx / d) * f * 30 - p.x) * 0.15;
        p.y += (p.oy + (dy / d) * f * 30 - p.y) * 0.15;
        cx.fillStyle = f > 0.35 ? '#FF4F1A' : 'rgba(236,231,220,.75)';
        cx.beginPath(); cx.arc(p.x, p.y, 1.3 + f * 2.4, 0, 7); cx.fill();
      }
      if (visible && !reduced) raf = requestAnimationFrame(draw);
    };
    const setP = (e) => { const r = cv.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; };
    const clear = () => { px = py = -999; };
    size(); draw();
    window.addEventListener('resize', size);
    cv.addEventListener('pointermove', setP);
    cv.addEventListener('pointerleave', clear);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      cv.removeEventListener('pointermove', setP);
      cv.removeEventListener('pointerleave', clear);
    };
  }, [visible, reduced]);
  return <canvas className="demo demo-ink" ref={ref} aria-label="Dot field that moves away from your pointer" />;
}

const experiments = [
  { n: '01', title: 'Interactive 3D objects', text: 'A wireframe of the hero building. Real geometry, drag to spin.', tech: 'Three.js · R3F', Demo: Demo3D, wide: true },
  { n: '02', title: 'Scroll-based storytelling', text: 'Scroll and the page builds itself: structure, then style, then behaviour.', tech: 'GSAP ScrollTrigger', Demo: DemoScroll },
  { n: '03', title: 'Creative typography', text: 'One variable font. Width and weight respond to your pointer.', tech: 'Variable fonts · JS', Demo: DemoType },
  { n: '04', title: 'Experimental interactions', text: 'An ink field that parts around the pointer.', tech: 'Canvas 2D', Demo: DemoInk, wide: true },
];

/*
  EXPERIMENTS: the one dark "blueprint" sheet, so it's clearly separate
  from client work. Every demo here really runs.
*/
export default function Experiments() {
  const reduced = useReducedMotion();
  return (
    <section className="block blueprint" id="experiments" aria-labelledby="xp-h">
      <div className="wrap">
        <SectionHeading index="07" label="Creative experiments" id="xp-h" title="Exploring what's" accent="possible." light>
          <p>Personal explorations, not client projects. Each one is live: try them.</p>
        </SectionHeading>
        <div className="xp-grid">
          {experiments.map(({ n, title, text, tech, Demo, wide }) => (
            <article className={`xp ${wide ? 'wide' : ''}`} key={n} data-reveal>
              <Demo reduced={reduced} />
              <div className="xp-meta">
                <span className="xp-n">Experiment {n}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="xp-tech">{tech}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
