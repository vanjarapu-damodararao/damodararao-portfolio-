import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { site, navLinks } from '../data/site';
import useReducedMotion from '../hooks/useReducedMotion';

export default function Navbar() {
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);
  const progressRef = useRef(null);
  const menuBtnRef = useRef(null);
  const closeBtnRef = useRef(null);
  const sheetRef = useRef(null);
  const reduced = useReducedMotion();

  // 1) Thin scroll-progress line under the bar
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 2) Highlight the link of the section currently in the middle of the screen
  useEffect(() => {
    const ids = ['home', 'about', 'expertise', 'work', 'skills', 'journey', 'experiments', 'testimonials', 'contact'];
    const map = { skills: 'expertise', journey: 'expertise', experiments: 'work', testimonials: 'contact' };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(map[e.target.id] || e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // 3) Mobile menu: lock scroll, focus, Escape to close, animate links in
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      // keep keyboard focus inside the menu while it's open
      if (e.key === 'Tab' && sheetRef.current) {
        const f = sheetRef.current.querySelectorAll('a,button');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    let tween;
    if (!reduced) tween = gsap.from('.sheet li a', { yPercent: 100, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.15 });
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      tween?.revert();
      menuBtnRef.current?.focus({ preventScroll: true });
    };
  }, [open, reduced]);

  // Close the menu when the screen gets wide enough for the full bar
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 861px)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <header className="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#home" aria-label={`${site.name}, back to top`}>
            <strong>{site.name}</strong>
            <span>{site.shortTitle}</span>
          </a>

          <nav aria-label="Primary" className="nav-links">
            <ul className="links">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} aria-current={active === l.id ? 'true' : undefined}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-r">
            <a className="talk" href="#contact"><i aria-hidden="true" />Let's Talk</a>
            <button
              ref={menuBtnRef}
              className="menu-btn"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen(true)}
            >
              <span className="bars" aria-hidden="true"><i /><i /></span>Menu
            </button>
          </div>
        </div>
        <div className="progress" ref={progressRef} aria-hidden="true" />
      </header>

      <div
        id="site-menu"
        ref={sheetRef}
        className={`sheet ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
      >
        <div className="sheet-top">
          <strong className="sheet-brand">{site.name}</strong>
          <button ref={closeBtnRef} className="menu-btn close" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>
        <ol>
          {navLinks.map((l, i) => (
            <li key={l.id}>
              <a href={`#${l.id}`} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                <small>{String(i + 1).padStart(2, '0')}</small>{l.label}
              </a>
            </li>
          ))}
        </ol>
        <div className="sheet-foot">
          <a className="talk big" href="#contact" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            <span>Let's Talk</span><span aria-hidden="true">→</span>
          </a>
          <p>{site.email}{site.emailIsPlaceholder ? ' (placeholder)' : ''}</p>
        </div>
      </div>
    </>
  );
}
