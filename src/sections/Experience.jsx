import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import SectionHeading from '../components/SectionHeading';
import { PhTag } from '../components/Placeholder';
import { experience } from '../data/experience';
import useReducedMotion from '../hooks/useReducedMotion';

const typeLabel = { work: 'Work', project: 'Project', learning: 'Learning' };

/*
  JOURNEY: a timeline whose line draws as you scroll.
  Entries: src/data/experience.js
*/
export default function Experience() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.tl-line', { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: true },
      });
      gsap.utils.toArray('.tl-item').forEach((el) =>
        gsap.from(el, { x: -24, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
      );
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="block journey" id="journey" ref={ref} aria-labelledby="journey-h">
      <div className="wrap">
        <SectionHeading index="06" label="Experience" id="journey-h" title="My development" accent="journey." />
        <div className="timeline">
          <span className="tl-line" aria-hidden="true" />
          <ol>
          {experience.map((e, i) => (
            <li className={`tl-item tl-${e.type}`} key={i}>
              <span className="tl-dot" aria-hidden="true" />
              <p className="tl-period">{e.period}</p>
              <div className="tl-body">
                <h3>{e.title}</h3>
                <p className="tl-org">{e.org} · <span>{typeLabel[e.type]}</span> {e.placeholder && <PhTag />}</p>
                <p>{e.description}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
