/**
 * Reusable button-style link.
 * variant: 'solid' (dark) or 'outline'
 * arrow: the little arrow at the end ('↗' or '→')
 */
export default function Button({ href, children, variant = 'outline', arrow = '→', className = '', ...rest }) {
  return (
    <a href={href} className={`btn ${variant === 'solid' ? 'solid' : ''} ${className}`} {...rest}>
      <span>{children}</span>
      <span className="arr" aria-hidden="true">{arrow}</span>
    </a>
  );
}
