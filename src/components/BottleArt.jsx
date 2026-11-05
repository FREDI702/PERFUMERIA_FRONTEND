import { useId } from 'react'

const TONES = {
  gold: [
    'var(--color-gold-light)',
    'var(--color-gold)',
    'var(--color-gold-dark)',
  ],
  rose: [
    'var(--color-bottle-rose-light)',
    'var(--color-bottle-rose)',
    'var(--color-bottle-rose-dark)',
  ],
  amber: [
    'var(--color-bottle-amber-light)',
    'var(--color-bottle-amber)',
    'var(--color-bottle-amber-dark)',
  ],
  forest: [
    'var(--color-bottle-forest-light)',
    'var(--color-bottle-forest)',
    'var(--color-bottle-forest-dark)',
  ],
  sky: [
    'var(--color-bottle-sky-light)',
    'var(--color-bottle-sky)',
    'var(--color-bottle-sky-dark)',
  ],
}

function BottleArt({ tone = 'gold', label = 'Frasco de perfume', className = '' }) {
  const gradientId = `bottle-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const [light, main, dark] = TONES[tone] ?? TONES.gold

  return (
    <svg
      viewBox="0 0 200 260"
      role="img"
      aria-label={label}
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="45%" stopColor={main} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="238" rx="58" ry="8" fill="var(--color-bg-1)" opacity="0.16" />
      <rect x="80" y="16" width="40" height="16" rx="4" fill={dark} />
      <rect x="86" y="32" width="28" height="20" rx="3" fill={dark} opacity="0.85" />
      <rect x="52" y="52" width="96" height="178" rx="22" fill={`url(#${gradientId})`} />
      <rect
        x="52"
        y="52"
        width="96"
        height="178"
        rx="22"
        fill="none"
        stroke={dark}
        strokeOpacity="0.35"
      />
      <rect x="64" y="66" width="10" height="118" rx="5" fill="var(--color-card)" opacity="0.42" />
      <circle cx="100" cy="138" r="30" fill="var(--color-bg-1)" />
      <circle
        cx="100"
        cy="138"
        r="30"
        fill="none"
        stroke={light}
        strokeWidth="1.5"
        opacity="0.8"
      />
      <path
        d="M100 116l4.5 14.5 14.5 4.5-14.5 4.5-4.5 14.5-4.5-14.5-14.5-4.5 14.5-4.5z"
        fill={light}
      />
      <text
        x="100"
        y="184"
        textAnchor="middle"
        fill="var(--color-lavender)"
        fontSize="7"
        letterSpacing="2.6"
      >
        NÉCTAR
      </text>
      <text
        x="100"
        y="196"
        textAnchor="middle"
        fill={light}
        fontSize="5"
        letterSpacing="2"
        opacity="0.85"
      >
        SUPREMO
      </text>
    </svg>
  )
}

export default BottleArt
