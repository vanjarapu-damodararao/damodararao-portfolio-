import { useLayoutEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import Building from './Building';

/**
 * Sets up an orthographic ("architectural drawing") camera.
 * We set the camera's view box ourselves (camera.manual = true) so we can
 * push the building to the right on desktop, away from the text.
 */
function CameraRig({ mobile }) {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const f = mobile ? 12.5 : 14; // how many world units fit vertically
    const a = size.width / size.height;
    const cx = mobile ? f * a * 0.2 : -f * a * 0.12; // horizontal offset (mobile: leave room for labels)
    const cy = mobile ? -0.4 : -f * 0.13; // vertical offset
    let l = -f * a / 2 + cx, r = f * a / 2 + cx, t = f / 2 + cy, b = -f / 2 + cy;
    if (mobile && a < 0.9) {
      const k = 0.9 / a; // narrow phone: zoom out so the building fits
      l *= k; r *= k; t *= k; b *= k;
    }
    Object.assign(camera, { left: l, right: r, top: t, bottom: b, zoom: 1 });
    camera.position.set(10, 8.2, 10);
    camera.lookAt(0, 2.6, 0);
    camera.updateProjectionMatrix();
  }, [camera, size, mobile]);
  return null;
}

/**
 * The hero 3D canvas. Loaded lazily (React.lazy) so text appears first.
 * active=false pauses rendering completely (when scrolled out of view).
 */
export default function HeroScene({ input, labelRefs, mobile, reduced, active }) {
  return (
    <Canvas
      orthographic
      camera={{ manual: true, near: 0.1, far: 100, position: [10, 8.2, 10] }}
      dpr={[1, mobile ? 1.5 : 2]} // lower pixel ratio on phones = faster
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      flat
      aria-hidden="true"
    >
      <CameraRig mobile={mobile} />
      <Building input={input} labelRefs={labelRefs} reduced={reduced} />
    </Canvas>
  );
}
