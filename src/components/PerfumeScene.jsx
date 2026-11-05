function Bottle() {
  return (
    <svg
      viewBox="0 0 280 320"
      role="img"
      aria-label="Frasco de perfume Néctar Supremo"
      className="h-[185px] w-auto drop-shadow-2xl min-[900px]:h-[340px]"
    >
      <defs>
        <linearGradient id="gold-bottle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--color-gold-light)' }} />
          <stop offset="45%" style={{ stopColor: 'var(--color-gold)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-gold-dark)' }} />
        </linearGradient>
        <linearGradient id="gold-cap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--color-gold-light)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-gold-dark)' }} />
        </linearGradient>
      </defs>

      <circle cx="140" cy="160" r="118" fill="none" stroke="var(--color-lavender)" strokeOpacity="0.22" />
      <circle cx="140" cy="160" r="88" fill="none" stroke="var(--color-lavender)" strokeOpacity="0.18" />
      <circle cx="140" cy="160" r="58" fill="none" stroke="var(--color-lavender)" strokeOpacity="0.14" />
      <circle cx="140" cy="160" r="120" fill="var(--color-gold)" opacity="0.08" />

      <ellipse cx="140" cy="290" rx="96" ry="11" fill="var(--color-bg-1)" opacity="0.55" />

      <rect x="110" y="10" width="60" height="18" rx="4" fill="url(#gold-cap)" />
      <rect x="116" y="14" width="48" height="7" rx="3" fill="var(--color-gold-light)" opacity="0.55" />
      <rect x="122" y="28" width="36" height="24" rx="2" fill="var(--color-gold-dark)" />
      <rect x="128" y="30" width="8" height="20" rx="4" fill="var(--color-gold-light)" opacity="0.35" />

      <rect x="112" y="252" width="56" height="10" rx="3" fill="var(--color-gold-dark)" opacity="0.85" />
      <rect x="66" y="46" width="148" height="212" rx="24" fill="url(#gold-bottle)" />
      <rect x="66" y="46" width="148" height="212" rx="24" fill="none" stroke="var(--color-gold-dark)" strokeOpacity="0.45" />
      <rect x="80" y="60" width="14" height="170" rx="7" fill="var(--color-card)" opacity="0.38" />
      <rect x="190" y="70" width="10" height="150" rx="5" fill="var(--color-gold-dark)" opacity="0.28" />

      <circle cx="140" cy="142" r="45" fill="var(--color-bg-1)" />
      <circle cx="140" cy="142" r="45" fill="none" stroke="var(--color-gold-light)" strokeWidth="1.5" opacity="0.8" />
      <path d="M140 116l6 20 20 6-20 6-6 20-6-20-20-6 20-6z" fill="var(--color-gold-light)" />
      <text
        x="140"
        y="184"
        textAnchor="middle"
        fill="var(--color-lavender)"
        fontSize="6"
        letterSpacing="2.5"
      >
        NÉCTAR
      </text>
      <text
        x="140"
        y="194"
        textAnchor="middle"
        fill="var(--color-gold-light)"
        fontSize="5"
        letterSpacing="2"
        opacity="0.85"
      >
        SUPREMO
      </text>

      <ellipse cx="140" cy="258" rx="82" ry="9" fill="var(--color-gold-dark)" opacity="0.55" />
    </svg>
  )
}

function PerfumeScene() {
  return (
    <section
      aria-label="Escena de perfume Néctar Supremo"
      className="relative flex h-[330px] shrink-0 flex-col overflow-hidden bg-gradient-to-br from-bg-1 via-bg-2 to-bg-3 min-[900px]:h-auto min-[900px]:w-1/2"
    >
      <div className="flex flex-1 items-center justify-center px-8 pt-6 min-[900px]:px-12">
        <Bottle />
      </div>
      <div className="px-6 pb-6 min-[900px]:px-14 min-[900px]:pb-12">
        <p className="font-serif text-3xl font-bold text-card min-[900px]:text-4xl">Néctar Supremo</p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-lavender min-[900px]:tracking-[0.32em]">
          Esencia · Elegancia · Estilo
        </p>
      </div>
    </section>
  )
}

export default PerfumeScene
