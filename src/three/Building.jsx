import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from '../lib/gsap';
import { createBuilding, W, D } from './buildModel';

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Puts the "blueprint to browser" stack into the scene and animates it.
 *
 * input:      shared object written by the hero (mouse, drag, scroll, hover)
 * labelRefs:  HTML labels; 0-3 follow the four layers, 4 is the LIVE stamp
 */
export default function Building({ input, labelRefs, reduced }) {
  const model = useMemo(() => createBuilding({ startDrop: reduced ? 0 : 9 }), []); // eslint-disable-line
  useEffect(() => () => model.dispose(), [model]); // free GPU memory on unmount

  // Intro: layers drop in, from HTML at the bottom to CMS on top
  useEffect(() => {
    const layers = model.floors.slice(0, 4).map((f) => f.userData);
    if (reduced) {
      layers.forEach((u) => (u.drop = 0));
      return;
    }
    const tw = gsap.to(layers, { drop: 0, duration: 1.6, ease: 'expo.out', stagger: 0.16, delay: 0.25 });
    return () => tw.kill();
  }, [model, reduced]);

  const v = useMemo(() => new THREE.Vector3(), []);
  const ray = useMemo(() => new THREE.Raycaster(), []);

  useFrame((state) => {
    const { camera, size, clock, pointer } = state;
    const t = clock.elapsedTime;
    const a = input.assemble; // 0 = exploded drawing, 1 = live website (scroll)
    const gap = 1.55 - 1.33 * smooth(0, 0.8, a);
    const flat = smooth(0.3, 0.8, a); // 3D details press flat into the page
    const live = smooth(0.55, 0.95, a); // the browser lands on top

    // Lean towards the mouse + drag rotation, eased for smoothness
    input.ry += (input.mx * 0.38 + input.drag + a * 0.45 - input.ry) * 0.06;
    input.rx += (input.my * 0.08 - input.rx) * 0.06;
    model.group.rotation.set(input.rx, input.ry, 0);
    // The finished website comes forward a little so it reads clearly
    model.group.scale.setScalar(1 + 0.32 * live);
    model.group.position.y = 1.3 * live;

    // Which layer is under the pointer?
    if (input.inside && !input.dragging && !input.labelHover) {
      ray.setFromCamera(pointer, camera);
      const hit = ray.intersectObjects(model.slabs, false)[0];
      input.hover = hit ? hit.object.userData.floor : -1;
    }

    model.floors.forEach((f, i) => {
      const u = f.userData;
      if (i < 4) {
        u.lift += ((input.hover === i && live < 0.5 ? 0.3 : 0) - u.lift) * 0.12;
        const bob = reduced ? 0 : Math.sin(t * 0.9 + i * 1.1) * 0.04 * (1 - a);
        f.position.y = i * gap + u.drop + bob + u.lift;
        model.parts[i].scale.y = Math.max(0.04, 1 - flat);
      } else {
        // Browser: falls into place and fades in
        f.visible = live > 0.01;
        f.position.y = 4 * gap + (1 - live) * 3;
        u.mats.forEach((m) => (m.opacity = live));
        u.edge.opacity = live;
      }
    });

    // JavaScript layer: the toggle switches on and off
    const knob = model.parts[2].userData.knob;
    if (knob) {
      const on = reduced || Math.sin(t * 1.4) > 0;
      knob.position.x += ((on ? 1.93 : 1.27) - knob.position.x) * 0.15;
    }

    const top = live > 0.01 ? model.floors[4].position.y : model.floors[3].position.y + 0.6;
    model.dimLine.scale.y = top + 0.5;
    model.tick1.position.y = top + 0.5;

    // Move each HTML label to its layer's right-hand corner on screen
    model.group.updateMatrixWorld();
    model.floors.forEach((f, i) => {
      const el = labelRefs.current[i];
      if (!el) return;
      f.localToWorld(v.set(W / 2, 0, -D / 2)).project(camera);
      const x = ((v.x + 1) / 2) * size.width;
      const y = ((1 - v.y) / 2) * size.height;
      el.style.transform = `translate(${x + 6}px, ${y}px) translateY(-50%)`;
      if (i < 4) {
        el.style.opacity = f.userData.drop < 0.4 ? String(1 - smooth(0.5, 0.8, a)) : '0';
        el.classList.toggle('on', input.hover === i);
      } else {
        el.style.opacity = String(smooth(0.85, 1, a));
      }
    });
  });

  return (
    <>
      <primitive object={model.grid} />
      <primitive object={model.group} />
    </>
  );
}
