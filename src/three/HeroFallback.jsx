/**
 * Static drawing of the building, shown when WebGL (3D) isn't available
 * or the 3D fails to load. It looks deliberate, not like an error.
 */
const Slab = ({ dy, children }) => (
  <g transform={`translate(0,${dy})`}>
    <path d="M200 380 L330 320 L200 260 L70 320Z" fill="#F4F0E7" />
    <path d="M70 320 V330 L200 390 V380Z" fill="#E6E0D3" />
    <path d="M200 380 V390 L330 330 V320Z" fill="#D9D2C3" />
    {children}
  </g>
);

export default function HeroFallback() {
  return (
    <svg className="fallback" viewBox="0 0 400 420" role="img" aria-label="Drawing of a website built in four layers: HTML, CSS, JavaScript and CMS">
      <g fill="none" stroke="#16181D" strokeWidth="1.5" strokeLinejoin="round">
        <Slab dy={0}><path d="M120 322 L200 286 M200 300 L260 328" /></Slab>
        <Slab dy={-86}><path d="M180 336 L220 318 L250 332 L210 350Z" fill="#FF4F1A" /></Slab>
        <Slab dy={-172}><circle cx="160" cy="318" r="9" fill="#F4F0E7" /><circle cx="240" cy="318" r="9" fill="#FF4F1A" /><path d="M169 318 H231" /></Slab>
        <Slab dy={-258}><path d="M110 320 L200 278 L230 292 L140 334Z" fill="#E2DCCF" /></Slab>
        <path d="M40 330 V60" stroke="#FF4F1A" />
        <path d="M34 330 H46 M34 60 H46" stroke="#FF4F1A" />
      </g>
    </svg>
  );
}
