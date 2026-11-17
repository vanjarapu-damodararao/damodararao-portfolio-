/**
 * A drawn wireframe "page", shown in place of a project screenshot
 * until a real image is added. variant changes the layout a little.
 */
export default function MockPage({ variant = 'full', label = 'Full-page screenshot' }) {
  if (variant === 'a')
    return (
      <div className="mp">
        <div className="r hd"><i /><b /></div>
        <div className="row3"><div /><div /><div /></div>
        <div className="r acc" />
        <div className="row3"><div /><div /><div /></div>
      </div>
    );
  if (variant === 'b')
    return (
      <div className="mp">
        <div className="r hd"><i /><b /></div>
        <div className="r hx" style={{ height: 150 }}><em>Screens</em></div>
        <div className="r txt" /><div className="r txt s" />
      </div>
    );
  if (variant === 'c')
    return (
      <div className="mp">
        <div className="r band" style={{ height: 120 }} />
        <div className="r txt" /><div className="r txt s" />
        <div className="row3"><div /><div /><div /></div>
      </div>
    );
  if (variant === 'd')
    return (
      <div className="mp">
        <div className="r hx" style={{ height: 260, background: 'var(--paper)' }}>
          <em style={{ color: 'var(--survey-deep)' }}>↑ the hero building</em>
        </div>
      </div>
    );
  return (
    <div className="mp">
      <div className="r hd"><i /><b /></div>
      <div className="r hx"><em>{label}</em></div>
      <div className="r txt" /><div className="r txt s" />
      <div className="row3"><div /><div /><div /></div>
      <div className="r band" />
      <div className="r txt" /><div className="r txt s" />
      <div className="row3"><div /><div /><div /></div>
      <div className="r acc" />
      <div className="r hx" style={{ height: 180 }}><em>Footer</em></div>
    </div>
  );
}
