import { useEffect, useState } from 'react';

/**
 * Returns true when the visitor has asked their device to reduce motion
 * (a system accessibility setting). We use it to switch animations off.
 */
export default function useReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange); // cleanup
  }, []);

  return reduced;
}
