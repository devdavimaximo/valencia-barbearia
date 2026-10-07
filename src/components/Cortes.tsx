import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CUTS, INFO, LINKS } from '../lib/data';
import { useReveal } from '../lib/reveal';
import { scroller } from '../lib/scroller';
import { REDUCED } from '../lib/pointer';

const ROWS = [CUTS.slice(0, 5), CUTS.slice(5)];

export default function Cortes() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  useReveal(root);

  // faixas infinitas: andam sozinhas, aceleram e inclinam com a velocidade da rolagem
  useEffect(() => {
    const rows = Array.from(root.current!.querySelectorAll<HTMLElement>('.reel__track'));
    const state = rows.map(() => ({ x: 0, hover: 1 }));
    let lastY = window.scrollY;
    let vel = 0;
    let visible = false;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(root.current!);

    rows.forEach((r, i) => {
      r.addEventListener('pointerenter', () => gsap.to(state[i], { hover: 0.15, duration: 0.6 }));
      r.addEventListener('pointerleave', () => gsap.to(state[i], { hover: 1, duration: 0.6 }));
    });

    const tick = (_t: number, dt: number) => {
      const y = window.scrollY;
      const v = scroller.lenis ? scroller.velocity : (y - lastY) / Math.max(dt, 1) * 16;
      lastY = y;
      vel += (v - vel) * 0.1;
      if (!visible || REDUCED) return;
      rows.forEach((r, i) => {
        const dir = i % 2 ? 1 : -1;
        const half = r.scrollWidth / 2;
        const s = state[i];
        s.x += dir * (0.045 * dt * s.hover + Math.abs(vel) * 0.6);
        if (s.x <= -half) s.x += half;
        if (s.x > 0) s.x -= half;
        r.style.transform = `translate3d(${s.x}px,0,0) skewX(${gsap.utils.clamp(-8, 8, -vel * 0.35 * dir)}deg)`;
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (open === null) return;
    scroller.lenis?.stop();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % CUTS.length));
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + CUTS.length) % CUTS.length));
    };
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('keydown', key);
      scroller.lenis?.start();
    };
  }, [open]);

  return (
    <section className="cortes" id="cortes" ref={root}>
      <div className="wrap cortes__head">
        <div>
          <p className="kicker" data-rise>
            <span className="kicker__n">§</span> Cortes
          </p>
          <h2 className="h2" data-split>
            O que sai
            <br />
            <em>da cadeira.</em>
          </h2>
        </div>
        <div className="cortes__aside" data-rise="0.1">
          <p>Degradê, social, navalhado, barba desenhada. Toque numa foto para ver de perto ou acompanhe o dia a dia no Instagram.</p>
          <a className="link" href={LINKS.instagram} target="_blank" rel="noreferrer">
            {INFO.instagram} <span>↗</span>
          </a>
        </div>
      </div>

      <div className="reels">
        {ROWS.map((row, ri) => (
          <div className="reel" key={ri}>
            <div className="reel__track">
              {[...row, ...row].map((c, i) => {
                const n = ri === 0 ? i % row.length : ROWS[0].length + (i % row.length);
                const dup = i >= row.length;
                return (
                  <button
                    className="cut"
                    key={i}
                    onClick={() => setOpen(n)}
                    data-cursor="Ver"
                    aria-hidden={dup}
                    tabIndex={dup ? -1 : 0}
                    aria-label={`Ampliar: ${c.name}`}
                  >
                    <img src={c.img} alt={c.name} loading="lazy" draggable={false} />
                    <span className="cut__cap">
                      <em>Nº {String(n + 1).padStart(2, '0')}</em>
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={`lightbox ${open !== null ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Foto ampliada" onClick={() => setOpen(null)}>
        {open !== null && (
          <figure onClick={(e) => e.stopPropagation()}>
            <img key={open} src={CUTS[open].img} alt={CUTS[open].name} />
            <figcaption>
              <span>
                Nº {String(open + 1).padStart(2, '0')} / {String(CUTS.length).padStart(2, '0')}
              </span>
              <strong>{CUTS[open].name}</strong>
              <span className="lightbox__nav">
                <button onClick={() => setOpen((open - 1 + CUTS.length) % CUTS.length)} aria-label="Anterior">
                  ←
                </button>
                <button onClick={() => setOpen((open + 1) % CUTS.length)} aria-label="Próxima">
                  →
                </button>
                <button onClick={() => setOpen(null)} aria-label="Fechar">
                  ✕
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
