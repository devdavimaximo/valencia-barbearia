import { useRef } from 'react';
import { useReveal } from '../lib/reveal';
import { YEARS } from '../lib/data';

const PILLARS = [
  { n: '01', t: 'Ofício', d: 'Navalha, pincel, tesoura e pente, nas mãos de quem estudou pra isso.' },
  { n: '02', t: 'Hora marcada', d: 'Sem fila e sem pressa. E sem fechar ao meio-dia.' },
  { n: '03', t: 'A conversa', d: 'Café passado, futebol e o papo em dia.' },
];

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section className="manifesto" id="manifesto" ref={root}>
      <div className="wrap">
        <p className="kicker" data-rise>
          <span className="kicker__n">§</span> A casa
        </p>
        <p className="manifesto__text" data-words>
          Corte bem feito, barba na navalha e café passado na hora. <em>Há {YEARS} anos, do mesmo jeito.</em>
        </p>

        <div className="pillars">
          {PILLARS.map((p, i) => (
            <article className="pillar" key={p.n} data-rise={i * 0.1}>
              <span className="pillar__n">{p.n}</span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
