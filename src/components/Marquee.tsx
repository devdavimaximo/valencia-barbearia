const WORDS = ['Corte', 'Barba', 'Navalha', 'Toalha quente', 'Degradê', 'Sobrancelha', 'Desde 2018', 'Cachoeirinha'];

export default function Marquee() {
  const row = (hidden: boolean) => (
    <div className="marquee__row" aria-hidden={hidden}>
      {WORDS.map((w) => (
        <span key={w}>
          {w}
          <i>✦</i>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" role="presentation">
      <div className="marquee__inner">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
