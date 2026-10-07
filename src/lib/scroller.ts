import type Lenis from 'lenis';

export const scroller: { lenis: Lenis | null; velocity: number } = { lenis: null, velocity: 0 };

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (scroller.lenis) scroller.lenis.scrollTo(el, { duration: 1.8 });
  else el.scrollIntoView({ behavior: 'smooth' });
}
