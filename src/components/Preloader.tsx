import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { LOGO, LOGO_H, LOGO_W } from '../lib/logo';
import { FOUNDED } from '../lib/data';

/**
 * A logo é riscada a ouro, peça por peça, enquanto o contador corre de 2018 até hoje.
 * Só sai quando a cena 3D já compilou: a prensa do hero começa no instante em que a cortina sobe.
 */
export default function Preloader({ loaded, onDone }: { loaded: boolean; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const year = useRef<HTMLSpanElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const done = useRef(false);

  useEffect(() => {
    const q = gsap.utils.selector(root);
    const now = new Date().getFullYear();
    const counter = { y: FOUNDED };
    const tl = gsap.timeline();
    tl.set(q('.pre__stroke'), { strokeDashoffset: 1 })
      .to(q('.pre__stroke'), { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.18 })
      .to(q('.pre__fill'), { opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.1 }, '-=0.5')
      .to(q('.pre__sheen'), { x: LOGO_W * 2.1, duration: 1.1, ease: 'power2.inOut' }, '-=0.5')
      .to(counter, {
        y: now,
        duration: 1.9,
        ease: 'power1.inOut',
        onUpdate: () => {
          if (year.current) year.current.textContent = String(Math.round(counter.y));
        },
      }, 0.2)
      .from(q('.pre__line'), { scaleX: 0, duration: 1.9, ease: 'power1.inOut' }, 0.2);
    intro.current = tl;
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!loaded || done.current) return;
    const tl = intro.current;
    const go = () => {
      if (done.current) return;
      done.current = true;
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ onComplete: () => root.current?.remove() })
        .to(q('.pre__mark'), { scale: 0.86, autoAlpha: 0, duration: 0.6, ease: 'power3.in' })
        .to(q('.pre__meta'), { autoAlpha: 0, y: 10, duration: 0.4 }, 0)
        .add(onDone, 0.35)
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, 0.3);
    };
    // espera o risco terminar e as fontes chegarem
    Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((r) => {
        if (!tl || tl.progress() === 1) r();
        else tl.eventCallback('onComplete', () => r());
      }),
    ]).then(() => setTimeout(go, 150));
  }, [loaded, onDone]);

  return (
    <div className="pre" ref={root} role="status" aria-label="Carregando">
      <div className="pre__mark">
        <svg viewBox={`-20 -20 ${LOGO_W + 40} ${LOGO_H + 40}`} aria-hidden="true">
          <defs>
            <linearGradient id="preg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#F2D891" />
              <stop offset="0.5" stopColor="#D4AC55" />
              <stop offset="1" stopColor="#9F772B" />
            </linearGradient>
            <linearGradient id="pres" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="prec">
              <path d={LOGO.hair} />
              <path d={LOGO.lock} />
              <path d={LOGO.beard} clipRule="evenodd" />
            </clipPath>
          </defs>
          {[LOGO.hair, LOGO.lock, LOGO.beard].map((d, i) => (
            <g key={i}>
              <path className="pre__fill" d={d} fill="url(#preg)" fillRule="evenodd" opacity="0" />
              <path className="pre__stroke" d={d} pathLength={1} />
            </g>
          ))}
          <g clipPath="url(#prec)">
            <rect className="pre__sheen" x={-LOGO_W} y="0" width={LOGO_W * 0.6} height={LOGO_H} fill="url(#pres)" transform="skewX(-18)" />
          </g>
        </svg>
      </div>
      <div className="pre__meta">
        <span>Desde {FOUNDED}</span>
        <span className="pre__track">
          <span className="pre__line" />
        </span>
        <span ref={year}>{FOUNDED}</span>
      </div>
    </div>
  );
}
