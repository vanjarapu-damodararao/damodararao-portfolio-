import SectionHeading from '../components/SectionHeading';
import { testimonials } from '../data/testimonials';

/*
  TESTIMONIALS: hidden automatically while src/data/testimonials.js is empty.
  Only add genuine quotes.
*/
export default function Testimonials() {
  if (!testimonials.length) return null;

  return (
    <section className="block testimonials" id="testimonials" aria-labelledby="test-h">
      <div className="wrap">
        <SectionHeading index="08" label="Testimonials" id="test-h" title="What people" accent="say." />
        <div className="quotes">
          {testimonials.map((t, i) => (
            <figure className="quote" key={i} data-reveal>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption><strong>{t.name}</strong><span>{t.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
