import { useState } from 'react';

/** Checks once whether this browser/device can draw WebGL (3D). */
export default function useWebGL() {
  const [ok] = useState(() => {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
      return false;
    }
  });
  return ok;
}
