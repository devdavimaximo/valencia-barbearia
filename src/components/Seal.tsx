import Mark from './Mark';

let uid = 0;

/** Selo redondo: texto em círculo em volta da logo, como o carimbo de uma barbearia antiga. */
export default function Seal({ className = '', text = 'Barbearia Valência · Cachoeirinha · Desde 2018 · ' }: { className?: string; text?: string }) {
  const id = `seal${++uid}`;
  return (
    <div className={`seal ${className}`} aria-hidden="true">
      <svg className="seal__ring" viewBox="0 0 200 200">
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <text>
          <textPath href={`#${id}`} startOffset="0" textLength={2 * Math.PI * 78 - 4}>
            {text.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <Mark className="seal__mark" />
    </div>
  );
}
