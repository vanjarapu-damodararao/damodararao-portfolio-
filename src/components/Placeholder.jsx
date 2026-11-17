/* Small helpers that clearly mark content you still need to replace. */

export function PhTag({ children = 'placeholder' }) {
  return <span className="ph-tag">{children}</span>;
}

export function Stamp({ children = 'Placeholder · awaiting content' }) {
  return <span className="stamp">{children}</span>;
}

/**
 * A link that becomes a muted, non-clickable label when the URL is missing.
 * This avoids broken links while your real URLs are still to come.
 */
export function SmartLink({ href, children, missing = 'link to be added', external = true, className = '' }) {
  if (!href) {
    return (
      <span className={`smart-link missing ${className}`} title={missing}>
        {children} <small>({missing})</small>
      </span>
    );
  }
  const isExternal = external && /^https?:\/\//.test(href);
  return (
    <a
      className={`smart-link ${className}`}
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
