import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TEAM, LINKS } from '../lib/data';
import { useReveal } from '../lib/reveal';

export default function Barbeiros() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      q('.barber').forEach((el: HTMLElement, i: number) => {
        const img = el.querySelector('img');
        gsap.fromTo(img, { yPercent: -8 }, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.from(el.querySelector('.barber__name'), {
          yPercent: 100,
          duration: 1.4,
          ease: 'expo.out',
          delay: i * 0.12,
          scrollTrigger: { trigger: el, start: 'top 70%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="barbeiros" id="barbeiros" ref={root}>
      <div className="wrap">
        <header className="barbeiros__head">
          <p className="kicker" data-rise>
            <span className="kicker__n">§</span> Quem corta
          </p>
          <h2 className="h2" data-split>
            Duas cadeiras.
            <br />
            <em>Dois barbeiros.</em>
          </h2>
          <p className="barbeiros__lead" data-rise="0.1">
            Na Valência você sabe quem vai cuidar do seu cabelo. Escolha seu barbeiro na agenda e volte sempre pra mesma cadeira.
          </p>
        </header>

        <div className="barbeiros__grid">
          {TEAM.map((b) => (
            <article className="barber" key={b.name}>
              <figure className="barber__photo" data-wipe>
                <span className="barber__chair">Cadeira {b.chair}</span>
                <img
                  src={b.img}
                  alt={`${b.name}, barbeiro da Valência`}
                  loading="lazy"
                  style={{ objectPosition: b.pos }}
                />
              </figure>
              <div className="barber__info">
                <h3 className="barber__mask">
                  <span className="barber__name">{b.name}</span>
                </h3>
                <a className="link" href={LINKS.agenda} target="_blank" rel="noreferrer" data-cursor={`Com ${b.name}`}>
                  Agendar com {b.name} <span>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
