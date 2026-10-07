import { LOGO, LOGO_H, LOGO_W } from '../lib/logo';

type Props = { className?: string; title?: string; gradient?: boolean };

let uid = 0;

/** A logo da Valência em vetor: cabelo, mecha e barba como peças separadas (animáveis). */
export default function Mark({ className, title, gradient = true }: Props) {
  const id = `vg${++uid}`;
  const fill = gradient ? `url(#${id})` : 'currentColor';
  return (
    <svg
      className={className}
      viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {gradient && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F2D891" />
            <stop offset="0.45" stopColor="#D4AC55" />
            <stop offset="1" stopColor="#9F772B" />
          </linearGradient>
        </defs>
      )}
      <g fill={fill} fillRule="evenodd">
        <path data-part="hair" d={LOGO.hair} />
        <path data-part="lock" d={LOGO.lock} />
        <path data-part="beard" d={LOGO.beard} />
      </g>
    </svg>
  );
}
