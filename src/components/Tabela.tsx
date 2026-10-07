import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SERVICES, LINKS } from '../lib/data';
import { useReveal } from '../lib/reveal';
import Seal from './Seal';

export default function Tabela() {
  const root = useRef<HTMLElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  useReveal(root);

  // foto que segue o cursor e inclina com a velocidade
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = float.current!;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    const rTo = gsap.quickTo(el, 'rotation', { duration: 0.8, ease: 'power3' });
    let lastX = 0;
    let lastY = 0;
    let shown = false;
    const show = (row: HTMLElement) => {
      const src = row.dataset.img!;
      if (img.current && !img.current.src.endsWith(src)) img.current.src = src;
      if (shown) return;
      shown = true;
      gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'expo.out', overwrite: true });
    };
    const hide = () => {
      if (!shown) return;
      shown = false;
      gsap.to(el, { autoAlpha: 0, scale: 0.85, duration: 0.3, ease: 'power2.out', overwrite: true });
    };
    // A rolagem move a página sob um cursor parado, e aí o pointerleave não dispara.
    // Por isso a foto segue o que está de fato sob o cursor, tanto ao mover quanto ao rolar.
    const sync = () => {
      const row = (document.elementFromPoint(lastX, lastY) as HTMLElement | null)?.closest<HTMLElement>('.svc');
      if (row && root.current!.contains(row)) show(row);
      else hide();
    };
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
      lastY = e.clientY;
      sync();
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) hide();
    });
    io.observe(root.current!);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', sync, { passive: true });
    document.addEventListener('pointerleave', hide);
    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', sync);
      document.removeEventListener('pointerleave', hide);
    };
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.to(q('.seal__ring'), {
        rotation: 300,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      q('.svc__lead').forEach((el: HTMLElement) => {
        gsap.from(el, { scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
      });
    },
    { scope: root },
  );

  return (
    <section className="tabela paper" id="tabela" ref={root}>
      <div className="wrap">
        <header className="tabela__head">
          <div>
            <p className="kicker" data-rise>
              <span className="kicker__n">§</span> Serviços
            </p>
            <h2 className="h2" data-split>
              Tabela <em>da casa</em>
            </h2>
          </div>
          <Seal className="tabela__seal" />
        </header>

        <div className="tabela__grid">
          {SERVICES.map((g, gi) => (
            <div className="tabela__col" key={g.group}>
              <h3 className="tabela__group" data-rise={gi * 0.08}>
                <span>{String(gi + 1).padStart(2, '0')}</span>
                {g.group}
              </h3>
              <ul>
                {g.items.map((s) => (
                  <li className={`svc ${s.badge ? 'is-star' : ''}`} key={s.name} data-img={s.img} data-rise>
                    <a href={LINKS.agenda} target="_blank" rel="noreferrer" data-cursor="Agendar">
                      <div className="svc__row">
                        <span className="svc__name">
                          {s.name}
                          {s.badge && <b className="svc__badge">{s.badge}</b>}
                        </span>
                        <span className="svc__lead" />
                        <span className="svc__price">
                          {s.price.match(/^\d/) ? (
                            <>
                              <small>R$</small>
                              {s.price}
                            </>
                          ) : (
                            <small className="svc__ask">{s.price}</small>
                          )}
                        </span>
                      </div>
                      <div className="svc__meta">
                        <span>{s.desc}</span>
                        <span>{s.time}</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <footer className="tabela__foot" data-rise>
          <p>Escolha o serviço, o barbeiro e o horário direto na agenda online.</p>
          <a className="btn btn--ink" href={LINKS.agenda} target="_blank" rel="noreferrer" data-cursor="Agendar">
            Ver horários livres
          </a>
        </footer>
      </div>

      <div className="tabela__float" ref={float} aria-hidden="true">
        <img ref={img} src={SERVICES[0].items[0].img} alt="" />
      </div>
    </section>
  );
}
