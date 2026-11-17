import { useState } from 'react';
import { Stamp, SmartLink } from './Placeholder';
import MockPage from './MockPage';

/*
  ProjectCard picks a presentation based on project.layout:
  'elevation' | 'cut' | 'motion'. ('list' rows live in Projects.jsx.)
  You normally never edit this file; edit src/data/projects.js instead.
*/

function Meta({ p, num }) {
  return (
    <div className="meta" data-reveal>
      <span className="num" aria-hidden="true">{num}</span>
      <span className="cat">{p.category}</span>
      <h3>{p.title}</h3>
      {p.placeholder && <Stamp />}
      {p.experimental && <span className="exp-badge">Experiment · not client work</span>}
      <p>{p.description}</p>
      <ul className="tags" aria-label="Technologies">
        {p.technologies.map((t) => <li key={t}>{t}</li>)}
      </ul>
      <div className="plinks">
        <SmartLink href={p.liveUrl}>Live site ↗</SmartLink>
        {(p.caseStudyUrl || p.layout === 'elevation') && <SmartLink href={p.caseStudyUrl}>Case study</SmartLink>}
      </div>
    </div>
  );
}

/* Elevation: a browser frame that scrolls through the whole page on hover/focus */
function Elevation({ p, num }) {
  return (
    <article className="proj p-elev">
      <Meta p={p} num={num} />
      <div className="elev" data-reveal tabIndex={0} aria-label={`${p.title}: full-page preview. Hover or focus to scroll through it.`}>
        <div className="browser">
          <div className="bar" aria-hidden="true"><i /><i /><i /><span>{p.urlLabel || p.liveUrl}</span></div>
          <div className="viewport">
            <div className="mock">
              {p.thumbnail
                ? <img src={p.thumbnail} alt={`Full-page screenshot of ${p.title}`} loading="lazy" />
                : <MockPage />}
            </div>
          </div>
        </div>
        <div className="dim" aria-hidden="true"><span>Hover: scroll the full page</span></div>
      </div>
    </article>
  );
}

/* Very small syntax colouring: tags and attributes */
function highlight(text) {
  return text.split(/(<\/?[a-z0-9]+|\s[a-z-]+=)/gi).map((part, i) => {
    if (/^<\/?[a-z0-9]+$/i.test(part)) return <span key={i} className="tok-tag">{part}</span>;
    if (/^\s[a-z-]+=$/i.test(part)) return <span key={i} className="tok-attr">{part}</span>;
    return part;
  });
}

/* Section cut: code on one side, the rendered result on the other */
function Cut({ p, num }) {
  const [hot, setHot] = useState(null);
  const { lines, preview } = p.cut;
  return (
    <article className="proj p-cut">
      <div className="cut" data-reveal>
        <div className="code" aria-label="Code excerpt">
          {lines.map((l, i) => (
            <div
              key={i}
              className={hot === l.key ? 'on' : ''}
              onMouseEnter={() => setHot(l.key)}
              onMouseLeave={() => setHot(null)}
            >
              {highlight(l.text)}
            </div>
          ))}
        </div>
        <div className="res" aria-hidden="true">
          {preview.map((el) => {
            const cls = hot === el.key ? 'on' : '';
            if (el.type === 'h') return <h4 key={el.key} className={cls}>{el.text}</h4>;
            if (el.type === 'a') return <span key={el.key} className={`res-btn ${cls}`}>{el.text}</span>;
            return <p key={el.key} className={cls}>{el.text}</p>;
          })}
        </div>
      </div>
      <Meta p={p} num={num} />
    </article>
  );
}

/* Motion study: three frames that fan out into a sequence */
function Motion({ p, num }) {
  const frames = p.frames || [null, null, null];
  return (
    <article className="proj p-motion">
      <Meta p={p} num={num} />
      <div className="onion" data-reveal tabIndex={0} aria-label={`${p.title}: animation frames. Hover or focus to fan them out.`}>
        {frames.map((src, i) => (
          <div className="fr" key={i}>
            {src ? <img src={src} alt={`${p.title}, frame ${i + 1}`} loading="lazy" /> : <span className="blk" />}
            <small>frame 0{i + 1}</small>
          </div>
        ))}
        <span className="hint">hover to play the sequence</span>
      </div>
    </article>
  );
}

export default function ProjectCard({ project, index }) {
  const num = String(index + 1).padStart(2, '0');
  if (project.layout === 'cut') return <Cut p={project} num={num} />;
  if (project.layout === 'motion') return <Motion p={project} num={num} />;
  return <Elevation p={project} num={num} />;
}
