import { useRef } from 'react';
import { LINKS } from '../lib/data';
import { useReveal } from '../lib/reveal';
import Mark from './Mark';

export default function Escola() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section className="escola" id="escola" ref={root}>
      <div className="wrap">
        <div className="escola__card" data-rise>
          <Mark className="escola__mark" />
          <div className="escola__body">
            <p className="kicker">
              <span className="kicker__n">§</span> Escola Valência
            </p>
            <h2 className="h2 h2--sm" data-split>
              O ofício também <em>se ensina.</em>
            </h2>
            <p>
              Além das cadeiras, a Valência forma barbeiros. Curso para quem quer aprender a profissão do jeito tradicional: tesoura,
              máquina, navalha e o trato com o cliente, na prática, dentro de uma barbearia de verdade.
            </p>
          </div>
          <a className="btn btn--gold" href={LINKS.escola} target="_blank" rel="noreferrer" data-cursor="Turmas">
            Saber da próxima turma
          </a>
        </div>
      </div>
    </section>
  );
}
