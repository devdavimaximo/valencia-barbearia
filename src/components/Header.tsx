import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Mark from './Mark';
import { scroller, scrollToId } from '../lib/scroller';
import { INFO, LINKS, openStatus } from '../lib/data';

const NAV = [
  { id: 'ritual', label: 'O ritual' },
  { id: 'barbeiros', label: 'Barbeiros' },
  { id: 'tabela', label: 'Serviços' },
  { id: 'cortes', label: 'Cortes' },
  { id: 'casa', label: 'A casa' },
  { id: 'visite', label: 'Visite' },
];

export default function Header({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const status = openStatus();

  useEffect(() => {
    if (!ready) return;
    gsap.fromTo(root.current, { yPercent: -100 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', delay: 1.2 });
    // some ao descer, volta ao subir; ganha fundo depois do hero
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const el = root.current!;
        el.classList.toggle('is-solid', self.scroll() > window.innerHeight * 0.85);
        el.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > window.innerHeight * 0.6);
      },
    });
    return () => st.kill();
  }, [ready]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (open) scroller.lenis?.stop();
    else scroller.lenis?.start();
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 450 : 0);
  };

  return (
    <>
      <header className="hd" ref={root}>
        <a
          className="hd__brand"
          href="#topo"
          onClick={(e) => {
            e.preventDefault();
            go('topo');
          }}
          aria-label="Barbearia Valência, início"
        >
          <Mark className="hd__mark" />
          <span className="hd__name">
            Valência
            <small>Barbearia · 2018</small>
          </span>
        </a>

        <nav className="hd__nav" aria-label="Principal">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(n.id);
              }}
            >
              <span data-t={n.label}>{n.label}</span>
            </a>
          ))}
        </nav>

        <div className="hd__right">
          <span className={`hd__status ${status.open ? 'is-open' : ''}`}>
            <i />
            {status.label}
          </span>
          <a className="btn btn--gold btn--sm" href={LINKS.agenda} target="_blank" rel="noreferrer" data-cursor="Agendar">
            Agendar
          </a>
          <button
            className={`hd__burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`menu ${open ? 'is-open' : ''}`} id="menu" aria-hidden={!open}>
        <nav aria-label="Menu">
          {NAV.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              style={{ transitionDelay: open ? `${0.12 + i * 0.05}s` : '0s' }}
              onClick={(e) => {
                e.preventDefault();
                go(n.id);
              }}
              tabIndex={open ? 0 : -1}
            >
              <em>0{i + 1}</em>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="menu__foot">
          <p>
            {INFO.street}
            <br />
            {INFO.district} · {INFO.city}
          </p>
          <a href={LINKS.whatsapp} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
            WhatsApp {INFO.phone}
          </a>
        </div>
      </div>
    </>
  );
}
