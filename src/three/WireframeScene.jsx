import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Experiment 01: a wireframe of the hero building on the blueprint sheet.
 * Drag (or swipe) to spin it; it keeps its momentum and slows down.
 */
function Wire({ spin, reduced }) {
  const ref = useRef();
  const { geos, mat } = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: 0xecE7dc, transparent: true, opacity: 0.85 });
    const geos = [];
    for (let i = 0; i < 4; i++) {
      geos.push({ g: new THREE.EdgesGeometry(new THREE.BoxGeometry(3, 0.1, 2)), y: i * 0.85 });
    }
    [[-1.4, -0.9], [1.4, -0.9], [1.4, 0.9], [-1.4, 0.9]].forEach(([x, z]) =>
      geos.push({ g: new THREE.EdgesGeometry(new THREE.BoxGeometry(0.06, 2.55, 0.06)), y: 1.275, x, z })
    );
    geos.push({ g: new THREE.EdgesGeometry(new THREE.BoxGeometry(0.5, 0.06, 0.3)), y: 2.6, x: 0.9, z: 0.5, orange: true });
    return { geos, mat };
  }, []);
  const orangeMat = useMemo(() => new THREE.LineBasicMaterial({ color: 0xff4f1a }), []);
  useEffect(() => () => { geos.forEach((o) => o.g.dispose()); mat.dispose(); orangeMat.dispose(); }, [geos, mat, orangeMat]);

  useFrame((_, dt) => {
    spin.v *= 0.95; // momentum slows down
    ref.current.rotation.y += (reduced ? 0 : 0.25 * dt) + spin.v;
  });

  return (
    <group ref={ref} position={[0, -1.3, 0]}>
      {geos.map((o, i) => (
        <lineSegments key={i} geometry={o.g} material={o.orange ? orangeMat : mat} position={[o.x || 0, o.y, o.z || 0]} />
      ))}
    </group>
  );
}

export default function WireframeScene({ active, reduced }) {
  const spin = useRef({ v: 0, down: false, x: 0 }).current;
  return (
    <div
      className="wire-wrap"
      onPointerDown={(e) => { spin.down = true; spin.x = e.clientX; }}
      onPointerMove={(e) => { if (!spin.down) return; spin.v = (e.clientX - spin.x) * 0.004; spin.x = e.clientX; }}
      onPointerUp={() => (spin.down = false)}
      onPointerLeave={() => (spin.down = false)}
    >
      <Canvas
        camera={{ position: [5, 3.2, 5], fov: 35 }}
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        aria-hidden="true"
      >
        <Wire spin={spin} reduced={reduced} />
      </Canvas>
    </div>
  );
}
