/** Ponteiro global normalizado (-1..1), lido pela cena 3D sem re-render do React. */
export const pointer = { x: 0, y: 0, nx: 0, ny: 0, active: false };

export const TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
export const REDUCED =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
