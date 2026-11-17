import SectionHeading from '../components/SectionHeading';
import { PhTag } from '../components/Placeholder';
import { site } from '../data/site';

/*
  ABOUT: editorial two-column spread.
  To add your photo: put it in /public/images/portrait.jpg and set
  PORTRAIT below to '/images/portrait.jpg'.
*/
const PORTRAIT = '/images/portrait.jpg';

const facets = [
  {
    title: 'Background', sub: 'what I do now',
    text: '2+ years building web applications with React and PHP (Laravel): REST APIs, ERP/CRM systems and client websites. Currently a Web Developer at The Go-To Guy!, previously a Software Developer at Bigapple Lifestyle.',
  },
  {
    title: 'Approach', sub: 'how I build',
    text: 'Semantic structure first, then a careful visual layer, then behaviour. Every layer stays clean so the site is easy to grow and maintain.',
  },
  {
    title: 'Creative technology', sub: "what I'm exploring",
    text: "I'm currently learning React and exploring GSAP and Three.js, the tools behind the interactive building at the top of this page.",
  },
  {
    title: 'Built for visitors', sub: "who it's for",
    text: 'Readable type, clear navigation and fast loading come before effects. Creativity should never cost the visitor their time.',
  },
];

export default function About() {
  return (
    <section className="block" id="about" aria-labelledby="about-h">
      <div className="wrap">
        <SectionHeading index="02" label="About" id="about-h" title="Beyond code." accent="Beyond design." />

        <div className="about-grid">
          <figure className="portrait" data-reveal>
            <span className="tape" aria-hidden="true" />
            <span className="tape r" aria-hidden="true" />
            {PORTRAIT ? (
              <div className="photo">
                <img src={PORTRAIT} alt={`Portrait of ${site.name}`} loading="lazy" width="413" height="531" />
                <span className="mark tl" aria-hidden="true" /><span className="mark br" aria-hidden="true" />
              </div>
            ) : (
              <div className="ph">Portrait photo<br /><PhTag /></div>
            )}
            <figcaption>{site.name}, {site.location}</figcaption>
          </figure>

          <div className="about-copy">
            <p className="lede" data-reveal>
              I'm {site.name}, a Creative Web Developer passionate about building modern digital experiences through{' '}
              <em>thoughtful design</em>, clean development and interactive technologies.
            </p>
            <blockquote className="pull" data-reveal>
              “Structure first. Detail always. A website should feel as considered as it looks.”
            </blockquote>
            <div className="facets">
              {facets.map((f) => (
                <div className="facet" key={f.title} data-reveal>
                  <h3>{f.title} <small>/ {f.sub}</small></h3>
                  <p>{f.text} {f.placeholder && <PhTag>{f.placeholder}</PhTag>}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
