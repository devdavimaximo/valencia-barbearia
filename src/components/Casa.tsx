import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { FOUNDED, INFO, SPACE_IMG, YEARS } from '../lib/data';
import { useReveal } from '../lib/reveal';
import { scroller } from '../lib/scroller';
import { REDUCED } from '../lib/pointer';

/** Poste de barbeiro nas cores da casa: as listras sobem sozinhas e disparam com a rolagem. */
function Pole() {
  const stripes = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (REDUCED) return;
    let y = 0;
    let vel = 0;
    let lastY = window.scrollY;
    const tick = (_t: number, dt: number) => {
      const sy = window.scrollY;
      const v = scroller.lenis ? scroller.velocity : ((sy - lastY) / Math.max(dt, 1)) * 16;
      lastY = sy;
      vel += (v - vel) * 0.08;
      y -= dt * 0.03 + vel * 0.9;
      if (stripes.current) stripes.current.style.backgroundPositionY = `${y}px`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  return (
    <div className="pole" aria-hidden="true">
      <span className="pole__cap pole__cap--top" />
      <div className="pole__glass">
        <div className="pole__stripes" ref={stripes} />
      </div>
      <span className="pole__cap pole__cap--bot" />
    </div>
  );
}

export default function Casa() {
  const root = useRef<HTMLElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const c = { v: 0 };
      gsap.to(c, {
        v: YEARS,
        duration: 2.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: count.current, start: 'top 85%', once: true },
        onUpdate: () => {
          if (count.current) count.current.textContent = String(Math.round(c.v));
        },
      });
      gsap.fromTo(q('.casa__photo img'), { yPercent: -10 }, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: q('.casa__photo')[0], start: 'top bottom', end: 'bottom top', scrub: true },
      });
      gsap.fromTo(q('.casa__year'), { xPercent: 8 }, {
        xPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section className="casa" id="casa" ref={root}>
      <div className="casa__year" aria-hidden="true">
        {FOUNDED}
      </div>
      <div className="wrap casa__grid">
        <Pole />

        <div className="casa__text">
          <p className="kicker" data-rise>
            <span className="kicker__n">§</span> Desde {FOUNDED}
          </p>
          <h2 className="h2" data-split>
            A primeira barbearia
            <br />
            <em>clássica</em> de Cachoeirinha.
          </h2>
          <p className="casa__lead" data-rise="0.1">
            Quando a Valência abriu as portas na Vila Cachoeirinha, a cidade ganhou um lugar onde barba se faz na navalha e cabelo se
            corta com calma. De lá pra cá mudou a cidade, mudou a moda, o ritual continua o mesmo.
          </p>
        </div>

        <div className="casa__side">
          <div className="casa__count" data-rise="0.15">
            <span className="casa__num" ref={count}>
              0
            </span>
            <span className="casa__unit">
              anos
              <br />
              de cadeira
            </span>
          </div>

          <ul className="facts">
            <li data-rise="0.05">
              <span>Endereço</span>
              {INFO.street}
            </li>
            <li data-rise="0.1">
              <span>Horário</span>
              Seg a Sex 10h às 20h · Sáb 10h às 18h
            </li>
            <li data-rise="0.15">
              <span>Meio-dia</span>
              Aberto, sem intervalo
            </li>
            <li data-rise="0.2">
              <span>Também</span>
              Escola de barbeiros
            </li>
          </ul>
        </div>
      </div>

      {/* o salão de verdade, em largura total */}
      <div className="wrap">
        <figure className="casa__photo" data-wipe>
          <img src={SPACE_IMG} alt="O salão da Barbearia Valência" loading="lazy" />
          <figcaption>
            <span>O salão</span>
            {INFO.street} · {INFO.district}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
