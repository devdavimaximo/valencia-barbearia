import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Stamp from '../gl/Stamp';
import Mark from './Mark';
import { INFO, LINKS, openStatus } from '../lib/data';

const WORD = 'Valência'.split('');

export default function Hero({ ready, onLoaded }: { ready: boolean; onLoaded: () => void }) {
  const root = useRef<HTMLElement>(null);
  const [hit, setHit] = useState(false);
  const status = openStatus();

  const onImpact = useCallback(() => setHit(true), []);

  // se não houver WebGL (ou a prensa demorar), o texto entra mesmo assim
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setHit(true), 2200);
    return () => clearTimeout(t);
  }, [ready]);

  useGSAP(
    () => {
      if (!hit) return;
      const q = gsap.utils.selector(root);
      gsap
        .timeline()
        .fromTo(q('.hero__char'), { y: 0, yPercent: 105 }, { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: 0.045 }, 0.05)
        .fromTo(q('.hero__est'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1 }, 0.5)
        .fromTo(q('[data-hero-in]'), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 }, 0.35);
    },
    { scope: root, dependencies: [hit] },
  );

  // saída: a palavra afunda e escurece enquanto o couro inclina (a cena lê o scroll por conta própria)
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      tl.to(q('.hero__word'), { opacity: 0.12, ease: 'none' }, 0)
        .to(q('.hero__side'), { y: -80, opacity: 0, ease: 'none' }, 0)
        .to(q('.hero__shade'), { opacity: 1, ease: 'none' }, 0);
    },
    { scope: root },
  );

  return (
    <section className={`hero ${hit ? 'is-hit' : ''}`} id="topo" ref={root}>
      <Stamp ready={ready} onLoaded={onLoaded} onImpact={onImpact} />
      <Mark className="hero__fallback" />
      <div className="hero__vignette" aria-hidden="true" />
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__stage">
        <div className="hero__side hero__side--l">
          <p className="kicker" data-hero-in>
            Nº 81 · {INFO.district}
          </p>
          <p className="hero__lead" data-hero-in>
            A primeira barbearia clássica de Cachoeirinha. Tesoura, navalha e toalha quente, <em>do jeito que sempre foi.</em>
          </p>
        </div>

        {/* vão reservado para a logo 3D: a cena mede este elemento e encaixa a logo dentro dele */}
        <div className="hero__slot" aria-hidden="true" />

        <div className="hero__side hero__side--r">
          <p className={`status ${status.open ? 'is-open' : ''}`} data-hero-in>
            <i />
            {status.label}
          </p>
          <p className="hero__hours" data-hero-in>
            Seg a Sex · 10h às 20h
            <br />
            <span>Sábado · 10h às 18h</span>
          </p>
          <div className="hero__ctas" data-hero-in>
            <a className="btn btn--gold" href={LINKS.agenda} target="_blank" rel="noreferrer" data-cursor="Agendar">
              Agendar horário
            </a>
            <a className="btn btn--line" href={LINKS.whatsapp} target="_blank" rel="noreferrer" data-cursor="WhatsApp">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="hero__base">
        <div className="hero__est-row" aria-hidden="true">
          <span className="hero__est">Est.</span>
          <span className="hero__est hero__est--rule" />
          <span className="hero__est">Barbearia tradicional</span>
          <span className="hero__est hero__est--rule" />
          <span className="hero__est">MMXVIII</span>
        </div>
        <h1 className="hero__word">
          <span className="sr-only">Barbearia Valência, barbearia tradicional desde 2018 em Cachoeirinha, RS</span>
          <span className="hero__mask" aria-hidden="true">
            {WORD.map((c, i) => (
              <span className="hero__char" key={i}>
                {c}
              </span>
            ))}
          </span>
        </h1>
      </div>
    </section>
  );
}
