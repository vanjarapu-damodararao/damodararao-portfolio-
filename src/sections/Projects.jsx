import { useEffect, useRef, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import MockPage from '../components/MockPage';
import { projects } from '../data/projects';

/*
  SELECTED WORK: featured projects get their own presentation,
  the rest go into the "More projects" list with a floating preview.
  All content: src/data/projects.js
*/
export default function Projects() {
  const featured = projects.filter((p) => p.layout !== 'list');
  const rest = projects.filter((p) => p.layout === 'list');

  // Floating preview that follows the cursor over list rows (desktop only)
  const floaterRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const target = useRef({ x: 0, y: 0, cx: 0, cy: 0, raf: 0 });

  useEffect(() => () => cancelAnimationFrame(target.current.raf), []);

  const follow = () => {
    const t = target.current;
    t.cx += (t.x - t.cx) * 0.18;
    t.cy += (t.y - t.cy) * 0.18;
    if (floaterRef.current) floaterRef.current.style.transform = `translate(${t.cx}px, ${t.cy}px)`;
    t.raf = requestAnimationFrame(follow);
  };
  const onEnter = (p, e) => {
    const t = target.current;
    t.x = t.cx = e.clientX + 30;
    t.y = t.cy = e.clientY - 100;
    setPreview(p);
    cancelAnimationFrame(t.raf);
    follow();
  };
  const onMove = (e) => {
    target.current.x = e.clientX + 30;
    target.current.y = e.clientY - 100;
  };
  const onLeave = () => {
    setPreview(null);
    cancelAnimationFrame(target.current.raf);
  };

  return (
    <section className="block work" id="work" aria-labelledby="work-h">
      <div className="wrap">
        <div className="work-head">
          <SectionHeading index="04" label="Selected work" id="work-h" title="Selected" accent="work." />
          <p data-reveal>A collection of digital experiences, websites and creative projects. Each type of work is shown in its own way.</p>
        </div>

        {featured.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}

        {rest.length > 0 && (
          <div className="register" data-reveal>
            <h3>More projects <span>{rest.length} entries</span></h3>
            <ul>
              {rest.map((p, i) => {
                const content = (
                  <>
                    <span className="n" aria-hidden="true">{String(featured.length + i + 1).padStart(2, '0')}</span>
                    <span className="t">{p.title}</span>
                    <span className="c">{p.category}{p.experimental ? ' · Experiment' : ''}</span>
                    <span className="s">{p.placeholder ? 'Placeholder' : p.technologies.join(', ')}</span>
                    <span className="go" aria-hidden="true">{p.liveUrl ? '↗' : ''}</span>
                  </>
                );
                const handlers = { onMouseEnter: (e) => onEnter(p, e), onMouseMove: onMove, onMouseLeave: onLeave };
                return (
                  <li key={p.id}>
                    {p.liveUrl ? (
                      <a
                        className="reg-row"
                        href={p.liveUrl}
                        {...(/^https?:/.test(p.liveUrl) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        {...handlers}
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="reg-row nolink" {...handlers}>{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className={`floater ${preview ? 'on' : ''}`} ref={floaterRef} aria-hidden="true">
        {preview && (preview.thumbnail
          ? <img src={preview.thumbnail} alt="" />
          : <div className="floater-mock"><MockPage variant={preview.previewStyle} /></div>)}
      </div>
    </section>
  );
}
