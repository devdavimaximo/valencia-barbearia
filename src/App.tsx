import { useCallback, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

import { pointer, REDUCED, TOUCH } from './lib/pointer';
import { scroller } from './lib/scroller';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Header from './components/Header';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Ritual from './components/Ritual';
import Tabela from './components/Tabela';
import Cortes from './components/Cortes';
import Casa from './components/Casa';
import Escola from './components/Escola';
import Visite from './components/Visite';
import Footer from './components/Footer';
import BookBar from './components/BookBar';
import Barbeiros from './components/Barbeiros';
import Marquee from './components/Marquee';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;

    if (!REDUCED && !TOUCH) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
      scroller.lenis = lenis;
      lenis.stop();
      lenis.on('scroll', (l: Lenis) => {
        scroller.velocity = l.velocity;
        ScrollTrigger.update();
      });
      tick = (t: number) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ny = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.active = true;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      scroller.lenis = null;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-locked', !ready);
    if (!ready) return;
    scroller.lenis?.start();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, [ready]);

  const onLoaded = useCallback(() => setLoaded(true), []);
  const onDone = useCallback(() => setReady(true), []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Preloader loaded={loaded} onDone={onDone} />
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header ready={ready} />
      <main id="conteudo">
        <Hero ready={ready} onLoaded={onLoaded} />
        <Manifesto />
        <Ritual />
        <Barbeiros />
        <Tabela />
        <Marquee />
        <Cortes />
        <Casa />
        <Escola />
        <Visite />
      </main>
      <Footer />
      <BookBar />
    </>
  );
}
