import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { FOUNDED, INFO, LINKS } from '../lib/data';
import { scrollToId } from '../lib/scroller';
import Seal from './Seal';

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.from(q('.ft__char'), {
        yPercent: 100,
        ease: 'expo.out',
        duration: 1.4,
        stagger: 0.04,
        scrollTrigger: { trigger: q('.ft__word')[0], start: 'top 95%', once: true },
      });
      gsap.to(q('.seal__ring'), {
        rotation: -240,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <footer className="ft" ref={root}>
      <div className="wrap ft__top">
        <Seal className="ft__seal" />
        <div className="ft__cols">
          <div>
            <span className="label">Barbearia Valência</span>
            <p>
              {INFO.street}
              <br />
              {INFO.district} · {INFO.city}
            </p>
          </div>
          <div>
            <span className="label">Siga</span>
            <p>
              <a href={LINKS.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <br />
              <a href={LINKS.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </p>
          </div>
          <div>
            <span className="label">Agende</span>
            <p>
              <a href={LINKS.agenda} target="_blank" rel="noreferrer">
                Agenda online
              </a>
              <br />
              <a href={LINKS.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="ft__word" aria-hidden="true">
        {'Valência'.split('').map((c, i) => (
          <span className="ft__char" key={i}>
            {c}
          </span>
        ))}
      </div>

      <div className="wrap ft__bottom">
        <span>
          © {FOUNDED} a {new Date().getFullYear()} Barbearia Valência
        </span>
        <span>Barbearia tradicional · Cachoeirinha, RS</span>
        <button onClick={() => scrollToId('topo')}>Voltar ao topo ↑</button>
      </div>
    </footer>
  );
}
