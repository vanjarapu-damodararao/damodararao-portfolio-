/* Small line drawings for each service. They "draw" themselves on hover (see CSS .draw). */
const paths = {
  wp: <><circle cx="24" cy="24" r="17" /><path d="M10 18h28M14 18l7 20 3-9 3 9 7-20" /></>,
  framer: <path d="M14 8h20v12H24zM14 20h10l10 10H24v10L14 30z" />,
  shopify: <><path d="M12 16h24l-2 24H14z" /><path d="M18 16c0-5 2.5-8 6-8s6 3 6 8" /></>,
  code: <path d="M18 14 8 24l10 10M30 14l10 10-10 10M27 10l-6 28" />,
  responsive: <><rect x="6" y="10" width="26" height="20" /><rect x="30" y="18" width="12" height="22" /><path d="M14 36h10" /></>,
  ux: <><rect x="8" y="8" width="32" height="32" /><path d="M8 18h32M18 18v22M24 28h10M24 33h7" /></>,
  interactive: <><path d="M24 6 40 15v18L24 42 8 33V15z" /><path d="M8 15l16 9 16-9M24 24v18" /></>,
};

export default function ServiceIcon({ name }) {
  return (
    <svg className="svc-icon draw" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      {paths[name] || paths.code}
    </svg>
  );
}
