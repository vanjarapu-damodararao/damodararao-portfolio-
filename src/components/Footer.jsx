import { useEffect, useRef } from 'react';
import { site, navLinks } from '../data/site';
import { SmartLink } from './Placeholder';
import useReducedMotion from '../hooks/useReducedMotion';

export default function Footer() {
  const fillRef = useRef(null);
  const elevRef = useRef(null);
  const reduced = useReducedMotion();

  // "Datum" marker: a survey staff fills up as you scroll down the page,
  // and the readout shows how far down you are (like a level on a drawing).
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
        if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
        if (elevRef.current) elevRef.current.textContent = `−${String(Math.round(p * 100)).padStart(3, '0')}`;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    document.querySelector('.brand')?.focus({ preventScroll: true });
  };

  return (
    <footer className="footer">
      <div className="wrap">
        <p className="sign" data-reveal>
          Designed &amp; built by <span className="serif">{site.name}</span>
        </p>
        <div className="rule" data-rule />
        <div className="foot-grid">
          <div>
            <strong className="foot-name">{site.name}</strong>
            <p className="muted">{site.title}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="foot-list">
              {navLinks.map((l) => (
                <li key={l.id}><a href={`#${l.id}`}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
          <ul className="foot-list">
            {site.socials.map((s) => (
              <li key={s.label}><SmartLink href={s.url}>{s.label}</SmartLink></li>
            ))}
          </ul>
          <button className="to-top" onClick={toTop} aria-label="Back to top">
            <span className="staff" aria-hidden="true">
              <span className="staff-fill" ref={fillRef} />
            </span>
            <span className="datum" aria-hidden="true">
              <svg viewBox="0 0 28 20" className="tri">
                <path d="M2 2 H26 L14 18 Z" className="tri-o" />
                <path d="M14 2 V18 L2 2 Z" className="tri-f" />
                <path d="M0 2 H28" className="tri-l" />
              </svg>
              <span className="datum-t">Back to top</span>
              <span className="datum-e">EL. ±000 · now <b ref={elevRef}>−000</b></span>
            </span>
          </button>
        </div>
        <p className="copy muted">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
