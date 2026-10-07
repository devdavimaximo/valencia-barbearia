import { useRef } from 'react';
import { HOURS, INFO, LINKS, openStatus } from '../lib/data';
import { useReveal } from '../lib/reveal';

export default function Visite() {
  const root = useRef<HTMLElement>(null);
  const status = openStatus();
  useReveal(root);

  // semana começando na segunda
  const week = [1, 2, 3, 4, 5, 6, 0];

  return (
    <section className="visite" id="visite" ref={root}>
      <div className="wrap">
        <header className="visite__head">
          <p className="kicker" data-rise>
            <span className="kicker__n">§</span> Visite
          </p>
          <h2 className="h2 h2--xl" data-split>
            Sua cadeira
            <br />
            <em>está esperando.</em>
          </h2>
        </header>

        <div className="visite__grid">
          <div className="visite__info">
            <div className="visite__block" data-rise>
              <span className="label">Endereço</span>
              <p className="visite__addr">
                {INFO.street}
                <br />
                {INFO.district} · {INFO.city}
                <br />
                <small>CEP {INFO.cep}</small>
              </p>
              <a className="link" href={LINKS.maps} target="_blank" rel="noreferrer">
                Como chegar <span>↗</span>
              </a>
            </div>

            <div className="visite__block" data-rise="0.08">
              <span className="label">
                Horário <b className={`status status--inline ${status.open ? 'is-open' : ''}`}><i />{status.label}</b>
              </span>
              <ul className="hours">
                {week.map((d) => {
                  const h = HOURS[d];
                  return (
                    <li key={d} className={d === status.day ? 'is-today' : ''}>
                      <span>{h.day}</span>
                      <span className="hours__dots" />
                      <span>{h.open ? `${h.open[0]}h às ${h.open[1]}h` : 'Fechado'}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="visite__block" data-rise="0.16">
              <span className="label">Contato</span>
              <p className="visite__contact">
                <a href={LINKS.whatsapp} target="_blank" rel="noreferrer">
                  {INFO.phone}
                </a>
                <a href={`mailto:${INFO.email}`}>{INFO.email}</a>
                <a href={LINKS.instagram} target="_blank" rel="noreferrer">
                  {INFO.instagram}
                </a>
              </p>
            </div>

            <div className="visite__ctas" data-rise="0.2">
              <a className="btn btn--gold btn--lg" href={LINKS.agenda} target="_blank" rel="noreferrer" data-cursor="Agendar">
                Agendar online
              </a>
              <a className="btn btn--line btn--lg" href={LINKS.whatsapp} target="_blank" rel="noreferrer" data-cursor="WhatsApp">
                Chamar no WhatsApp
              </a>
            </div>
          </div>

          <figure className="visite__map" data-wipe>
            <iframe
              title="Mapa: Barbearia Valência, Rua Papa João XXIII, 81, Cachoeirinha"
              src={LINKS.embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a className="visite__pin" href={LINKS.maps} target="_blank" rel="noreferrer" data-cursor="Abrir mapa">
              Nº 81 · Abrir no Maps ↗
            </a>
          </figure>
        </div>
      </div>
    </section>
  );
}
