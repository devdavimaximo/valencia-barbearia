import { useEffect, useRef } from 'react';
import { LINKS } from '../lib/data';

/** No celular: agendar e WhatsApp sempre a um toque, depois que o hero sai da tela. */
export default function BookBar() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // some quando a seção de contato (que já tem os mesmos botões) entra na tela
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.9;
      const visite = document.getElementById('visite');
      const atEnd = !!visite && visite.getBoundingClientRect().top < window.innerHeight;
      root.current?.classList.toggle('is-on', past && !atEnd);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bookbar" ref={root}>
      <a className="btn btn--gold" href={LINKS.agenda} target="_blank" rel="noreferrer">
        Agendar horário
      </a>
      <a className="bookbar__wa" href={LINKS.whatsapp} target="_blank" rel="noreferrer" aria-label="Chamar no WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3Z"
          />
        </svg>
      </a>
    </div>
  );
}
