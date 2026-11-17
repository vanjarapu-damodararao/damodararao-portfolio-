import { useEffect, useState } from 'react';

/**
 * Tells you whether an element is on screen.
 * Used to start heavy demos only when visible, and pause them when not.
 * once: true → stays true after the first time (good for lazy loading).
 */
export default function useInView(ref, { rootMargin = '0px', once = false, initial = false } = {}) {
  const [inView, setInView] = useState(initial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once]);

  return inView;
}
