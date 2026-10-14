import React, { useEffect, useRef } from 'react';

interface NetworkBgProps {
  rgb?: string;
  alpha?: number;
}

export const NetworkBg: React.FC<NetworkBgProps> = ({
  rgb = '111,160,255',
  alpha = 0.26,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LINK_DIST = 150;
    const DOT_ALPHA = 0.55;
    const SPEED = 0.18;
    const DENSITY = 15000;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    const mouse = { x: -9999, y: -9999 };
    let animationFrameId: number;

    function build() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      let n = Math.max(28, Math.min(120, Math.round((w * h) / DENSITY)));
      if (w < 700) n = Math.round(n * 0.7);

      nodes = [];
      for (let i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * SPEED * 2,
          vy: (Math.random() - 0.5) * SPEED * 2,
          r: 0.9 + Math.random() * 1.2,
        });
      }
    }

    function draw(move: boolean) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      if (move) {
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < -20) a.x = w + 20;
          else if (a.x > w + 20) a.x = -20;
          if (a.y < -20) a.y = h + 20;
          else if (a.y > h + 20) a.y = -20;
        }
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx > LINK_DIST || dx < -LINK_DIST || dy > LINK_DIST || dy < -LINK_DIST) continue;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(${rgb},${((1 - d / LINK_DIST) * alpha).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 170) {
          ctx.strokeStyle = `rgba(${rgb},${((1 - md / 170) * 0.4).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = `rgba(${rgb},${DOT_ALPHA})`;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, 6.2832);
        ctx.fill();
      }
    }

    function loop() {
      if (!document.hidden) draw(true);
      animationFrameId = requestAnimationFrame(loop);
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseOut = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    let resizeTimer: any;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        build();
        if (reduce) draw(false);
      }, 150);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseout', onMouseOut);
    window.addEventListener('resize', onResize);

    build();
    if (reduce) draw(false);
    else loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('resize', onResize);
    };
  }, [rgb, alpha]);

  return (
    <canvas
      ref={canvasRef}
      id="net-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
