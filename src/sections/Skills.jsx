import SectionHeading from '../components/SectionHeading';
import { skillGroups, levelLabels } from '../data/skills';

/*
  SKILLS: grouped tool lists with an honest level marker.
  No percentage bars. Edit src/data/skills.js
*/
export default function Skills() {
  return (
    <section className="block skills" id="skills" aria-labelledby="skills-h">
      <div className="wrap">
        <SectionHeading index="05" label="Skills & technologies" id="skills-h" title="The tools behind" accent="the experience." />

        <ul className="legend" aria-label="Legend">
          {Object.entries(levelLabels).map(([k, v]) => (
            <li key={k}><i className={`lvl ${k}`} aria-hidden="true" />{v}</li>
          ))}
        </ul>

        <div className="sk-groups">
          {skillGroups.map((g) => (
            <div className="sk-group" key={g.name} data-reveal>
              <h3>{g.name} <span className="serif">{g.note}</span></h3>
              <ul>
                {g.items.map((s) => (
                  <li key={s.name} className={`sk ${s.level}`}>
                    <i className={`lvl ${s.level}`} aria-hidden="true" />
                    {s.name}
                    <span className="sr-only"> ({levelLabels[s.level]})</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
