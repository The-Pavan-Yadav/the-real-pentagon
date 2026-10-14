import React, { useEffect, useRef, useState } from 'react';

interface PentagonIntroProps {
  onComplete: () => void;
}

export const PentagonIntro: React.FC<PentagonIntroProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lettersState, setLettersState] = useState<boolean[]>([]);
  const [poweredOn, setPoweredOn] = useState(false);
  const [fading, setFading] = useState(false);

  const TITLE = 'THE PENTAGON';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      onComplete();
      return;
    }

    const PARTICLES = window.innerWidth < 700 ? 900 : 1600;
    const T_CONVERGE = 0.3;
    const T_SHIFT = 2.8;
    const T_TEXT = 3.3;
    const LETTER_GAP = 0.1;
    const T_EXIT = 6.2;

    function sprite(r: number, g: number, b: number) {
      const c = document.createElement('canvas');
      c.width = c.height = 48;
      const x = c.getContext('2d')!;
      const gr = x.createRadialGradient(24, 24, 0, 24, 24, 24);
      gr.addColorStop(0, `rgba(255,255,255,1)`);
      gr.addColorStop(0.2, `rgba(${r},${g},${b},.95)`);
      gr.addColorStop(0.5, `rgba(${r},${g},${b},.25)`);
      gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
      x.fillStyle = gr;
      x.fillRect(0, 0, 48, 48);
      return c;
    }
    const SPR = [sprite(80, 200, 255), sprite(150, 110, 255), sprite(90, 255, 220)];

    function bump(a: number) {
      return 1 + 0.05 * Math.sin(9 * a) + 0.03 * Math.sin(17 * a + 1);
    }
    function hemiPath(g: CanvasRenderingContext2D, sign: number, k: number, ox: number, oy: number) {
      g.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.03) {
        const rb = bump(a);
        const ry = Math.sin(a) > 0 ? 0.5 : 0.62;
        const u = -0.49 + 0.46 * rb * Math.cos(a);
        const v = ry * rb * Math.sin(a);
        const px = ox + sign * u * k,
          py = oy + v * k;
        a === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
      }
      g.closePath();
    }

    function buildBrainPoints(count: number) {
      const W = 460,
        H = 360,
        k = 200,
        ox = W / 2,
        oy = 150;
      const c = document.createElement('canvas');
      c.width = W;
      c.height = H;
      const g = c.getContext('2d', { willReadFrequently: true })!;
      g.lineJoin = 'round';
      g.lineCap = 'round';

      [-1, 1].forEach((sign) => {
        hemiPath(g, sign, k, ox, oy);
        g.fillStyle = 'rgb(90,0,0)';
        g.fill();
        g.strokeStyle = 'rgb(255,0,0)';
        g.lineWidth = 6;
        g.stroke();

        g.save();
        hemiPath(g, sign, k, ox, oy);
        g.clip();
        g.lineWidth = 5;
        for (let i = 0; i < 5; i++) {
          const y0 = -0.42 + i * 0.21;
          g.beginPath();
          for (let x = -0.98; x <= -0.02; x += 0.02) {
            const y = y0 + 0.07 * Math.sin(x * 14 + i * 1.7) + 0.03 * Math.sin(x * 31 + i);
            const px = ox + sign * x * k,
              py = oy + y * k;
            x <= -0.97 ? g.moveTo(px, py) : g.lineTo(px, py);
          }
          g.stroke();
        }
        g.restore();
      });

      g.beginPath();
      g.ellipse(ox, oy + 0.66 * k, 0.09 * k, 0.17 * k, 0, 0, Math.PI * 2);
      g.fillStyle = 'rgb(90,0,0)';
      g.fill();
      g.strokeStyle = 'rgb(255,0,0)';
      g.lineWidth = 5;
      g.stroke();

      const data = g.getImageData(0, 0, W, H).data;
      const edge: [number, number][] = [],
        fill: [number, number][] = [];
      for (let y = 0; y < H; y += 2) {
        for (let x = 0; x < W; x += 2) {
          const r = data[(y * W + x) * 4];
          if (r > 200) edge.push([x, y]);
          else if (r > 60) fill.push([x, y]);
        }
      }

      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < count; i++) {
        const src = Math.random() < 0.62 && edge.length ? edge : fill;
        const p = src[(Math.random() * src.length) | 0] || [W / 2, H / 2];
        pts.push({ x: (p[0] - ox) / k, y: (p[1] - oy) / k });
      }
      return pts;
    }

    const brainPts = buildBrainPoints(PARTICLES);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth,
      H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const parts: any[] = [];
    for (let i = 0; i < PARTICLES; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 250 + Math.random() * Math.max(W, H) * 0.9;
      parts.push({
        sx: W / 2 + Math.cos(ang) * rad,
        sy: H / 2 + Math.sin(ang) * rad,
        tx: brainPts[i].x,
        ty: brainPts[i].y,
        delay: Math.random() * 0.7,
        dur: 1.1 + Math.random() * 0.7,
        size: 0.7 + Math.random() * 1.3,
        spr: SPR[(Math.random() * SPR.length) | 0],
        jitter: Math.random() * Math.PI * 2,
        jitterSpeed: 1 + Math.random() * 2,
      });
    }

    let start = performance.now();
    let animId: number;

    function ease(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    const chars = TITLE.split('');
    const revealed: boolean[] = new Array(chars.length).fill(false);

    function frame(now: number) {
      animId = requestAnimationFrame(frame);
      const t = (now - start) / 1000;
      ctx!.clearRect(0, 0, W, H);

      let shiftProgress = 0;
      if (t > T_SHIFT) shiftProgress = ease(Math.min(1, (t - T_SHIFT) / 1.0));

      const centerY = H / 2 - shiftProgress * (H * 0.16);
      const scale = (Math.min(W, H) * 0.38) * (1 - shiftProgress * 0.22);

      // reveal title letters
      if (t >= T_TEXT) {
        let changed = false;
        chars.forEach((ch, idx) => {
          const lTime = T_TEXT + idx * LETTER_GAP;
          if (t >= lTime && !revealed[idx]) {
            revealed[idx] = true;
            changed = true;
          }
        });
        if (changed) {
          setLettersState([...revealed]);
        }
        if (t >= T_TEXT + chars.length * LETTER_GAP + 0.3) {
          setPoweredOn(true);
        }
      }

      if (t >= T_EXIT && !fading) {
        setFading(true);
        setTimeout(onComplete, 700);
      }

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const pTime = t - T_CONVERGE - p.delay;
        const progress = Math.max(0, Math.min(1, pTime / p.dur));
        const eased = ease(progress);

        const targetX = W / 2 + p.tx * scale;
        const targetY = centerY + p.ty * scale;

        let curX = p.sx + (targetX - p.sx) * eased;
        let curY = p.sy + (targetY - p.sy) * eased;

        if (progress >= 1) {
          const jit = Math.sin(t * p.jitterSpeed + p.jitter) * 1.5;
          curX += jit;
          curY += Math.cos(t * p.jitterSpeed + p.jitter) * 1.5;
        }

        const size = p.size * (progress < 1 ? 16 + (1 - progress) * 20 : 18);
        ctx!.drawImage(p.spr, curX - size / 2, curY - size / 2, size, size);
      }
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [onComplete]);

  return (
    <div
      id="pentagon-intro"
      className={fading ? 'fade-out' : ''}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#041026',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.7s ease',
      }}
    >
      <canvas
        ref={canvasRef}
        id="pi-canvas"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <div
        className="pi-text"
        style={{
          position: 'absolute',
          bottom: '22%',
          textAlign: 'center',
          pointerEvents: 'none',
          width: '100%',
        }}
      >
        <h1
          className="pi-title"
          id="pi-title"
          aria-label={TITLE}
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(28px, 6vw, 54px)',
            letterSpacing: '0.22em',
            color: '#fff',
            textShadow: '0 0 20px rgba(96,165,250,0.8), 0 0 40px rgba(34,211,238,0.5)',
            margin: 0,
          }}
        >
          {TITLE.split('').map((char, index) => (
            <span
              key={index}
              style={{
                display: 'inline-block',
                opacity: lettersState[index] ? 1 : 0,
                transform: lettersState[index] ? 'translateY(0) scale(1)' : 'translateY(18px) scale(0.8)',
                transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
                marginRight: char === ' ' ? '0.5em' : '0.04em',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
        <p
          className="pi-powered"
          id="pi-powered"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            color: '#93c5fd',
            marginTop: '12px',
            letterSpacing: '0.12em',
            opacity: poweredOn ? 1 : 0,
            transform: poweredOn ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          powered by <b>NightBerrieZ</b>
        </p>
      </div>

      <button
        type="button"
        className="pi-skip"
        id="pi-skip"
        onClick={onComplete}
        style={{
          position: 'absolute',
          top: '24px',
          right: '28px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '8px 18px',
          borderRadius: '20px',
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.18em',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        SKIP
      </button>
    </div>
  );
};
