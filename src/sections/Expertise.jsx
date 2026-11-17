import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import ServiceIcon from '../components/ServiceIcon';
import { expertise } from '../data/expertise';

/*
  EXPERTISE: an expandable schedule (not a card grid).
  Each row opens to show the description; only one is open at a time.
  Content lives in src/data/expertise.js
*/
export default function Expertise() {
  const [open, setOpen] = useState(0);

  return (
    <section className="block expertise" id="expertise" aria-labelledby="exp-h">
      <div className="wrap">
        <SectionHeading index="03" label="Expertise" id="exp-h" title="What I bring" accent="to the table.">
          <p>{expertise.length} services, described plainly. Tap a row to read more.</p>
        </SectionHeading>

        <div className="sched" data-reveal>
          {expertise.map((s, i) => {
            const isOpen = open === i;
            return (
              <div className={`srow ${isOpen ? 'open' : ''}`} key={s.title}>
                <h3>
                  <button
                    className="srow-btn"
                    aria-expanded={isOpen}
                    aria-controls={`svc-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="sn">{String(i + 1).padStart(2, '0')}</span>
                    <span className="st">{s.title}</span>
                    <span className="stech">{s.tech.join(' · ')}</span>
                    <span className="splus" aria-hidden="true" />
                  </button>
                </h3>
                <div className="sbody" id={`svc-${i}`} role="region" aria-label={s.title}>
                  <div className="sbody-in">
                    <ServiceIcon name={s.icon} />
                    <p>{s.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
