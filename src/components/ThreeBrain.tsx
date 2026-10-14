import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeBrain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      canvas.style.display = 'none';
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    camera.position.set(0, 0, 5.4);

    const rig = new THREE.Group();
    const brain = new THREE.Group();
    rig.add(brain);
    scene.add(rig);

    const cyan = new THREE.Color(0x4fd1ff);
    const violet = new THREE.Color(0x8b5cf6);
    const teal = new THREE.Color(0x2ee6c5);
    const white = new THREE.Color(0xffffff);

    function dir(): [number, number, number] {
      let x: number, y: number, z: number, l: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        l = x * x + y * y + z * z;
      } while (l > 1 || l < 0.0001);
      l = Math.sqrt(l);
      return [x / l, y / l, z / l];
    }

    function fold(x: number, y: number, z: number) {
      return (
        Math.sin(x * 7.3 + Math.sin(y * 5.1) * 1.8) * Math.sin(y * 8.7 + z * 3.3) +
        0.6 * Math.sin(z * 10.1 + x * 4.7) +
        0.4 * Math.sin((x + y + z) * 13.0)
      );
    }

    function hemiSurface(sign: number): [number, number, number] {
      const cx = sign * 0.32,
        ax = 0.5,
        ay = 0.68,
        az = 1.05;
      const d = dir();
      let x = d[0] * ax,
        y = d[1] * ay,
        z = d[2] * az;
      if (x * sign < 0) x *= 0.45;
      if (y < -0.18 * ay) y = -0.18 * ay + (y + 0.18 * ay) * 0.45;
      const k = 1 + 0.055 * fold(x + cx, y, z);
      return [x * k + cx, y * k + 0.08, z * k];
    }

    function hemiInside(sign: number): [number, number, number] {
      const cx = sign * 0.32;
      const d = dir();
      const r = Math.cbrt(Math.random()) * 0.78;
      let x = d[0] * 0.5 * r,
        y = d[1] * 0.68 * r,
        z = d[2] * 1.05 * r;
      if (x * sign < 0) x *= 0.45;
      return [x + cx, y + 0.08, z];
    }

    function cerebellum(): [number, number, number] {
      const d = dir();
      let x = d[0] * 0.42,
        y = d[1] * 0.24,
        z = d[2] * 0.3;
      x += Math.sin(y * 45) * 0.012;
      return [x, y - 0.46, z - 0.78];
    }

    function stem(): [number, number, number] {
      const t = Math.random(),
        a = Math.random() * Math.PI * 2,
        r = 0.09 * (1 - 0.25 * t);
      return [Math.cos(a) * r, -0.48 - t * 0.5, -0.25 - t * 0.15 + Math.sin(a) * r];
    }

    const isSmall = window.innerWidth < 700;
    const N_SURF = isSmall ? 1700 : 2900;
    const N_IN = isSmall ? 160 : 320;
    const N_CER = isSmall ? 150 : 280;
    const N_STEM = 80;
    const N = N_SURF + N_CER + N_STEM + N_IN;
    const N_NET = N_SURF + N_CER;

    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const siz = new Float32Array(N);
    const pha = new Float32Array(N);
    const tmp = new THREE.Color();

    for (let i = 0; i < N; i++) {
      let p: [number, number, number];
      if (i < N_SURF) p = hemiSurface(i % 2 ? 1 : -1);
      else if (i < N_NET) p = cerebellum();
      else if (i < N_NET + N_STEM) p = stem();
      else p = hemiInside(i % 2 ? 1 : -1);

      pos[i * 3] = p[0];
      pos[i * 3 + 1] = p[1];
      pos[i * 3 + 2] = p[2];

      const m = Math.min(1, Math.max(0, (p[1] + 0.5) / 1.3));
      tmp.copy(cyan).lerp(violet, m);
      const rnd = Math.random();
      if (rnd < 0.1) tmp.copy(teal);
      else if (rnd < 0.16) tmp.copy(white);
      col[i * 3] = tmp.r;
      col[i * 3 + 1] = tmp.g;
      col[i * 3 + 2] = tmp.b;

      siz[i] = i >= N_NET + N_STEM ? 0.45 : 0.55 + Math.random() * 0.6;
      pha[i] = Math.random() * 6.283;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));
    pGeo.setAttribute('aPhase', new THREE.BufferAttribute(pha, 1));

    const pMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPx: { value: renderer.getPixelRatio() } },
      vertexShader: `
        uniform float uTime; uniform float uPx;
        attribute vec3 aColor; attribute float aSize; attribute float aPhase;
        varying vec3 vColor; varying float vTw;
        void main(){
          vColor = aColor;
          vTw = 0.62 + 0.38 * sin(uTime * 2.0 + aPhase);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPx * vTw * (30.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor; varying float vTw;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = pow(smoothstep(0.5, 0.0, d), 1.5);
          gl_FragColor = vec4(vColor * (0.7 + a), a * (0.55 + 0.45 * vTw));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pGeo, pMat);
    brain.add(points);

    // Thin neural lines
    const cell = 0.14;
    const grid: Record<string, number[]> = {};
    function gkey(x: number, y: number, z: number) {
      return Math.floor(x / cell) + ',' + Math.floor(y / cell) + ',' + Math.floor(z / cell);
    }
    for (let a = 0; a < N_NET; a++) {
      const kk = gkey(pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2]);
      (grid[kk] || (grid[kk] = [])).push(a);
    }
    const segs: [number, number][] = [];
    for (let s = 0; s < N_NET; s++) {
      const sx = pos[s * 3],
        sy = pos[s * 3 + 1],
        sz = pos[s * 3 + 2];
      const cx0 = Math.floor(sx / cell),
        cy0 = Math.floor(sy / cell),
        cz0 = Math.floor(sz / cell);
      const cand: [number, number][] = [];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = -1; dz <= 1; dz++) {
            const list = grid[`${cx0 + dx},${cy0 + dy},${cz0 + dz}`];
            if (!list) continue;
            for (let q = 0; q < list.length; q++) {
              const j = list[q];
              if (j <= s) continue;
              const ddx = pos[j * 3] - sx,
                ddy = pos[j * 3 + 1] - sy,
                ddz = pos[j * 3 + 2] - sz;
              const dist = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);
              if (dist > 0.03 && dist < 0.17) cand.push([dist, j]);
            }
          }
        }
      }
      cand.sort((u, v) => u[0] - v[0]);
      for (let c = 0; c < cand.length && c < 2; c++) segs.push([s, cand[c][1]]);
    }

    const lPos = new Float32Array(segs.length * 6);
    const lCol = new Float32Array(segs.length * 6);
    for (let e = 0; e < segs.length; e++) {
      const A = segs[e][0],
        B = segs[e][1];
      lPos.set(
        [
          pos[A * 3],
          pos[A * 3 + 1],
          pos[A * 3 + 2],
          pos[B * 3],
          pos[B * 3 + 1],
          pos[B * 3 + 2],
        ],
        e * 6
      );
      lCol.set(
        [
          col[A * 3] * 0.8,
          col[A * 3 + 1] * 0.8,
          col[A * 3 + 2] * 0.8,
          col[B * 3] * 0.8,
          col[B * 3 + 1] * 0.8,
          col[B * 3 + 2] * 0.8,
        ],
        e * 6
      );
    }
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
    lGeo.setAttribute('color', new THREE.BufferAttribute(lCol, 3));
    const lines = new THREE.LineSegments(
      lGeo,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    brain.add(lines);

    // Pulses
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = spriteCanvas.height = 64;
    const sctx = spriteCanvas.getContext('2d')!;
    const sg = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sg.addColorStop(0, 'rgba(255,255,255,1)');
    sg.addColorStop(0.25, 'rgba(160,235,255,0.9)');
    sg.addColorStop(1, 'rgba(79,209,255,0)');
    sctx.fillStyle = sg;
    sctx.fillRect(0, 0, 64, 64);

    const N_PULSE = segs.length ? 70 : 0;
    const pulses: Array<{ seg: number; t: number; v: number }> = [];
    const pulsePos = new Float32Array(N_PULSE * 3);
    for (let pi = 0; pi < N_PULSE; pi++) {
      pulses.push({
        seg: (Math.random() * segs.length) | 0,
        t: Math.random(),
        v: 0.25 + Math.random() * 0.5,
      });
    }
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
    const pulseMesh = new THREE.Points(
      pulseGeo,
      new THREE.PointsMaterial({
        size: 0.13,
        map: new THREE.CanvasTexture(spriteCanvas),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })
    );
    brain.add(pulseMesh);

    function updatePulses(dt: number) {
      for (let n = 0; n < N_PULSE; n++) {
        const pu = pulses[n];
        pu.t += pu.v * dt;
        if (pu.t >= 1) {
          pu.t = 0;
          const cur = segs[pu.seg][1];
          const nextList: number[] = [];
          for (let k = 0; k < 6; k++) {
            const cand = (Math.random() * segs.length) | 0;
            if (segs[cand][0] === cur) {
              nextList.push(cand);
              break;
            }
          }
          pu.seg = nextList.length ? nextList[0] : ((Math.random() * segs.length) | 0);
        }
        const AA = segs[pu.seg][0],
          BB = segs[pu.seg][1],
          tt = pu.t;
        pulsePos[n * 3] = pos[AA * 3] + (pos[BB * 3] - pos[AA * 3]) * tt;
        pulsePos[n * 3 + 1] = pos[AA * 3 + 1] + (pos[BB * 3 + 1] - pos[AA * 3 + 1]) * tt;
        pulsePos[n * 3 + 2] = pos[AA * 3 + 2] + (pos[BB * 3 + 2] - pos[AA * 3 + 2]) * tt;
      }
      pulseGeo.attributes.position.needsUpdate = true;
    }

    let baseX = 0,
      baseY = 0;
    function resize() {
      const w = window.innerWidth,
        h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const visH = 2 * Math.tan(((camera.fov / 2) * Math.PI) / 180) * camera.position.z;
      const visW = visH * camera.aspect;
      if (w > 900) {
        baseX = visW * 0.21;
        baseY = 0.05;
        rig.scale.setScalar(Math.min(1.5, visH / 2.8));
      } else {
        baseX = 0;
        baseY = visH * 0.05;
        rig.scale.setScalar(Math.min(1.1, visW / 2.8));
      }
      rig.position.set(baseX, baseY, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    const mouse = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    function setPointer(cx: number, cy: number) {
      mouse.x = (cx / window.innerWidth) * 2 - 1;
      mouse.y = (cy / window.innerHeight) * 2 - 1;
    }
    const onMouseMove = (ev: MouseEvent) => setPointer(ev.clientX, ev.clientY);
    const onTouchMove = (ev: TouchEvent) => {
      if (ev.touches[0]) setPointer(ev.touches[0].clientX, ev.touches[0].clientY);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    let last = performance.now();
    let animId: number;
    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 0.25 : 1;

    function tick(now: number) {
      animId = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (document.hidden) return;

      const t = now / 1000;
      cur.x += (mouse.x - cur.x) * 0.05;
      cur.y += (mouse.y - cur.y) * 0.05;

      brain.rotation.y = 0.6 + cur.x * 0.85 + Math.sin(t * 0.25) * 0.16 * motion;
      brain.rotation.x = 0.1 + cur.y * 0.4 + Math.sin(t * 0.3) * 0.04 * motion;
      brain.position.y = Math.sin(t * 0.8) * 0.04 * motion;
      rig.position.x = baseX + cur.x * 0.18;
      rig.position.y = baseY - cur.y * 0.12;

      pMat.uniforms.uTime.value = t * motion;
      updatePulses(dt * motion);
      renderer.render(scene, camera);
    }
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      pGeo.dispose();
      pMat.dispose();
      lGeo.dispose();
      pulseGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="brain-canvas" aria-hidden="true" />;
};
