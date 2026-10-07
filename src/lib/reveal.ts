import type { RefObject } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

/**
 * [data-split] → linhas sobem por trás de uma máscara
 * [data-rise]  → bloco sobe e aparece (valor = atraso)
 * [data-words] → palavras acendem conforme o scroll
 * [data-wipe]  → foto abre de baixo para cima, com leve zoom de saída
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const q = gsap.utils.selector(scope);

      q('[data-split]').forEach((el: HTMLElement) => {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'ln',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.2,
              ease: 'expo.out',
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
        });
      });

      q('[data-rise]').forEach((el: HTMLElement) => {
        gsap.from(el, {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'expo.out',
          delay: Number(el.dataset.rise || 0),
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        });
      });

      q('[data-words]').forEach((el: HTMLElement) => {
        const split = SplitText.create(el, { type: 'words', wordsClass: 'wd' });
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true },
          },
        );
      });

      q('[data-wipe]').forEach((el: HTMLElement) => {
        const img = el.querySelector('img');
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' });
        if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.1);
      });
    },
    { scope },
  );
}
