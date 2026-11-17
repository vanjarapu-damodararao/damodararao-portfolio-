/**
 * Section heading used across the site.
 * index: '02'      label: small kicker text
 * title: main uppercase words   accent: serif italic ending
 */
export default function SectionHeading({ index, label, title, accent, id, light = false, children }) {
  return (
    <header className={`sec-head ${light ? 'light' : ''}`}>
      <p className="kicker">
        <b>{index}</b> {label}
      </p>
      <h2 className="h2" id={id} data-reveal>
        {title} {accent && <span className="serif">{accent}</span>}
      </h2>
      {children && <div className="sec-intro" data-reveal>{children}</div>}
    </header>
  );
}
