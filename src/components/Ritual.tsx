import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { RITUAL, LINKS } from '../lib/data';
import { useReveal } from '../lib/reveal';

/** Navalha aberta, em traço, corre pela régua de progresso. */
function Razor() {
  return (
    <svg className="razor" viewBox="0 0 120 28" aria-hidden="true">
      <path d="M2 14c0-5 4-8 9-8h56l10 4v8l-10 4H11c-5 0-9-3-9-8Z" fill="currentColor" opacity=".18" />
      <path d="M2 14c0-5 4-8 9-8h56l10 4v8l-10 4H11c-5 0-9-3-9-8Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M11 18h55" stroke="currentColor" strokeWidth=".8" opacity=".6" />
      <path d="M77 12l40-6c2 0 2.5 1 1.5 2.4L80 17" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="80" cy="14" r="2.2" fill="currentColor" />
    </svg>
  );
}

export default function Ritual() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const track = q('.ritual__track')[0] as HTMLElement;
        const dist = () => track.scrollWidth - window.innerWidth;

        const move = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: q('.ritual__pin')[0],
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${dist()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // régua: a navalha corre e cada numeral acende quando sua etapa passa pelo centro
        gsap.to(q('.ritual__razor'), {
          left: '100%',
          ease: 'none',
          scrollTrigger: { trigger: q('.ritual__pin')[0], start: 'top top', end: () => `+=${dist()}`, scrub: 1 },
        });
        gsap.to(q('.ritual__fill'), {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: q('.ritual__pin')[0], start: 'top top', end: () => `+=${dist()}`, scrub: 1 },
        });

        q('.step').forEach((step: HTMLElement, i: number) => {
          const img = step.querySelector('img');
          gsap.fromTo(img, { xPercent: -9 }, {
            xPercent: 9,
            ease: 'none',
            scrollTrigger: { trigger: step, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
          });
          gsap.fromTo(
            step.querySelector('.step__img'),
            { clipPath: 'inset(5% 4% 5% 4%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none',
              scrollTrigger: { trigger: step, containerAnimation: move, start: 'left 95%', end: 'left 35%', scrub: true },
            },
          );
          gsap.to(q('.ritual__tick')[i], {
            scrollTrigger: {
              trigger: step,
              containerAnimation: move,
              start: 'left 55%',
              end: 'right 55%',
              toggleClass: { targets: q('.ritual__tick')[i], className: 'is-on' },
            },
          });
        });
      });

      mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => {
        q('.step__img').forEach((el: HTMLElement) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="ritual" id="ritual" ref={root}>
      <div className="ritual__pin">
        <div className="ritual__track">
          <header className="ritual__intro">
            <p className="kicker">
              <span className="kicker__n">§</span> O ritual
            </p>
            <h2 className="h2" data-split>
              Seis tempos.
              <br />
              <em>Uma cadeira.</em>
            </h2>
            <p className="ritual__lead" data-rise>
              Do primeiro olhar no espelho ao último toque de pomada, é assim que um corte acontece na Valência. Sem atalho.
            </p>
            <p className="ritual__hint" aria-hidden="true">
              Role <span>→</span>
            </p>
          </header>

          {RITUAL.map((s) => (
            <article className="step" key={s.n}>
              <figure className="step__img">
                <img src={s.img} alt={s.title} loading="lazy" />
                <span className="step__num" aria-hidden="true">
                  {s.n}
                </span>
              </figure>
              <div className="step__body">
                <span className="step__time">
                  Tempo {s.n} · {s.time}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </article>
          ))}

          <div className="ritual__end">
            <p className="ritual__endtxt">
              E pronto.
              <br />
              <em>Agora é só marcar o próximo.</em>
            </p>
            <a className="btn btn--gold" href={LINKS.agenda} target="_blank" rel="noreferrer" data-cursor="Agendar">
              Reservar minha cadeira
            </a>
          </div>
        </div>

        <div className="ritual__rule" aria-hidden="true">
          <div className="ritual__bar">
            <span className="ritual__fill" />
            <span className="ritual__razor">
              <Razor />
            </span>
          </div>
          <div className="ritual__ticks">
            {RITUAL.map((s) => (
              <span className="ritual__tick" key={s.n}>
                {s.n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
