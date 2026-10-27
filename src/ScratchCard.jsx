import { useCallback, useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Fonts used on the canvas (loaded once, before the first draw)      */
/* ------------------------------------------------------------------ */
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Great+Vibes&display=swap';

let fontsPromise;
const ensureFonts = () => {
  if (fontsPromise) return fontsPromise;
  fontsPromise = new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    link.onload = () =>
      Promise.all([
        document.fonts.load('500 24px "Cormorant Garamond"'),
        document.fonts.load('24px "Great Vibes"'),
      ]).then(resolve, resolve);
    link.onerror = resolve;
    document.head.appendChild(link);
    setTimeout(resolve, 3000); // never block the card on a slow network
  });
  return fontsPromise;
};

/* Small seeded PRNG so the star field is identical on every redraw */
const mulberry32 = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const sparkle = (ctx, x, y, r) => {
  const k = r * 0.15;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x + k, y - k, x + r, y);
  ctx.quadraticCurveTo(x + k, y + k, x, y + r);
  ctx.quadraticCurveTo(x - k, y + k, x - r, y);
  ctx.quadraticCurveTo(x - k, y - k, x, y - r);
  ctx.fill();
};

const GOLD = '#c9a24b';
const BRUSH = 38;         // scratch brush diameter (CSS px)
const REVEAL_AT = 0.5;    // fraction cleared that triggers the auto-reveal

export default function ScratchCard({ onReveal }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const touched = useRef(false);
  const doneRef = useRef(false);
  const lastCheck = useRef(0);
  const [revealed, setRevealed] = useState(false);

  /* ---------------- paint the foil layer ---------------- */
  const paintFoil = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctxRef.current = ctx;

    // Night-sky gradient
    const g = ctx.createLinearGradient(0, 0, w, h * 0.6);
    g.addColorStop(0, '#1c3b68');
    g.addColorStop(1, '#0a1b38');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Dust of stars
    const rnd = mulberry32(2026);
    for (let i = 0; i < 30; i++) {
      const x = rnd() * w;
      const y = rnd() * h;
      const r = 0.7 + rnd() * 2.2;
      ctx.fillStyle = `rgba(212,178,110,${0.25 + rnd() * 0.35})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // A few tiny four-point twinkles
    ctx.fillStyle = 'rgba(214,184,120,0.75)';
    [[0.13, 0.2, 7], [0.9, 0.17, 6], [0.55, 0.86, 4], [0.07, 0.62, 3], [0.8, 0.8, 3]].forEach(
      ([px, py, r]) => sparkle(ctx, px * w, py * h, r)
    );

    // Title
    const titleSize = Math.min(42, w * 0.105);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = GOLD;
    ctx.font = `500 ${titleSize}px "Cormorant Garamond", "Playfair Display", serif`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${titleSize * 0.1}px`;
    const title = 'SCRATCH TO REVEAL';
    const ty = h * 0.44;
    ctx.fillText(title, w / 2, ty);
    const tw = ctx.measureText(title).width;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

    // Gold sparkles flanking the title
    const sr = titleSize * 0.7;
    sparkle(ctx, w / 2 - tw / 2 - sr * 1.6, ty, sr);
    sparkle(ctx, w / 2 + tw / 2 + sr * 1.6, ty, sr);

    // Subtitle
    ctx.fillStyle = '#cfd3dc';
    ctx.font = `${Math.min(42, w * 0.105)}px "Great Vibes", cursive`;
    ctx.fillText('our special day', w / 2, h * 0.7);
  }, []);

  useEffect(() => {
    let cancelled = false;
    paintFoil();
    const frame = requestAnimationFrame(() => {
      if (!cancelled) paintFoil();
    });

    ensureFonts().then(() => {
      if (!cancelled) paintFoil();
    });

    // Repaint on resize, but never wipe someone's scratching
    const ro = new ResizeObserver(() => {
      if (!touched.current && !doneRef.current) paintFoil();
    });
    if (wrapRef.current) ro.observe(wrapRef.current);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [paintFoil]);

  /* ---------------- reveal logic ---------------- */
  const reveal = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setRevealed(true);
    onReveal?.();
  }, [onReveal]);

  // Sample the alpha channel to estimate how much foil is gone
  const checkProgress = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || doneRef.current) return;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 8) {
      total++;
      if (data[i] < 128) cleared++;
    }
    if (cleared / total >= REVEAL_AT) reveal();
  }, [reveal]);

  /* ---------------- pointer handling ---------------- */
  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const scratchTo = (p) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = BRUSH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const onPointerDown = (e) => {
    if (doneRef.current) return;
    drawing.current = true;
    touched.current = true;
    canvasRef.current.setPointerCapture(e.pointerId);
    const p = pos(e);
    last.current = p;
    scratchTo(p); // a tap leaves a dot
  };

  const onPointerMove = (e) => {
    if (!drawing.current) return;
    scratchTo(pos(e));
    const now = performance.now();
    if (now - lastCheck.current > 200) {
      lastCheck.current = now;
      checkProgress();
    }
  };

  const onPointerUp = (e) => {
    if (!drawing.current) return;
    drawing.current = false;
    canvasRef.current.releasePointerCapture?.(e.pointerId);
    checkProgress();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      reveal();
    }
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-[min(94vw,620px)] h-[220px] mx-auto rounded-2xl overflow-hidden select-none"
      style={{ boxShadow: '0 10px 30px rgba(31,47,41,0.25)' }}
    >
      {/* ---- The date, always in the DOM beneath the foil ---- */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ background: '#f7f0e6' }}
      >
        <p
          className="whitespace-nowrap leading-none"
          style={{
            fontFamily: '"Great Vibes", cursive',
            color: '#a67c2e',
            fontSize: 'clamp(40px, 12vw, 80px)',
          }}
        >
          1<sup style={{ fontSize: '0.5em', verticalAlign: '0.7em' }}>st</sup> – 2
          <sup style={{ fontSize: '0.5em', verticalAlign: '0.7em' }}>nd</sup> December
        </p>
        <p
          className="mt-2"
          style={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
            color: '#333333',
            fontSize: 30,
            letterSpacing: '0.35em',
            paddingLeft: '0.35em',
          }}
        >
          2026
        </p>
      </div>

      {/* ---- Scratch foil ---- */}
      <canvas
        ref={canvasRef}
        role={revealed ? undefined : 'button'}
        tabIndex={revealed ? -1 : 0}
        aria-label={revealed ? undefined : 'Scratch to reveal the wedding dates. Press Enter to reveal.'}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="absolute inset-0 block w-full h-full cursor-pointer transition-opacity duration-700 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c0a062]"
        style={{
          touchAction: 'none', // stops the page scrolling while you scratch
          opacity: revealed ? 0 : 1,
          pointerEvents: revealed ? 'none' : 'auto',
        }}
      />
    </div>
  );
}