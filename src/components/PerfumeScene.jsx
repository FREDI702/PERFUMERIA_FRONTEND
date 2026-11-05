function Bottle() {
  return (
    <svg
      viewBox="0 0 280 340"
      role="img"
      aria-label="Frasco de perfume Néctar Supremo"
      className="h-[180px] w-auto drop-shadow-2xl min-[900px]:h-[360px]"
    >
      <defs>
        <linearGradient id="scene-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--color-gold-light)' }} />
          <stop offset="45%" style={{ stopColor: 'var(--color-gold)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-gold-dark)' }} />
        </linearGradient>
        <linearGradient id="scene-cap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--color-gold-light)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-gold-dark)' }} />
        </linearGradient>
        <linearGradient id="scene-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={{ stopColor: 'var(--color-card)', stopOpacity: '0.55' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-card)', stopOpacity: '0' }} />
        </linearGradient>
      </defs>

      <rect x="96" y="8" width="88" height="24" rx="6" fill="url(#scene-cap)" />
      <rect x="104" y="12" width="72" height="9" rx="4" fill="var(--color-gold-light)" opacity="0.55" />
      <rect x="114" y="32" width="52" height="32" rx="4" fill="var(--color-gold-dark)" />
      <rect x="122" y="36" width="10" height="20" rx="5" fill="var(--color-gold-light)" opacity="0.4" />
      <rect x="102" y="62" width="76" height="12" rx="4" fill="var(--color-gold-dark)" />

      <rect x="44" y="72" width="192" height="224" rx="30" fill="url(#scene-gold)" />
      <rect
        x="44"
        y="72"
        width="192"
        height="224"
        rx="30"
        fill="none"
        stroke="var(--color-gold-dark)"
        strokeOpacity="0.45"
      />
      <rect x="62" y="92" width="18" height="172" rx="9" fill="url(#scene-shine)" />
      <rect x="208" y="104" width="12" height="148" rx="6" fill="var(--color-gold-dark)" opacity="0.22" />

      <circle cx="140" cy="178" r="56" fill="var(--color-bg-1)" />
      <circle
        cx="140"
        cy="178"
        r="56"
        fill="none"
        stroke="var(--color-gold-light)"
        strokeWidth="1.5"
        opacity="0.65"
      />
      <path
        d="M140 136l8.5 28.5L177 173l-28.5 8.5L140 210l-8.5-28.5L103 173l28.5-8.5z"
        fill="var(--color-gold-light)"
      />
      <text
        x="140"
        y="214"
        textAnchor="middle"
        fill="var(--color-lavender)"
        fontSize="7"
        letterSpacing="3"
      >
        NÉCTAR
      </text>
      <text
        x="140"
        y="226"
        textAnchor="middle"
        fill="var(--color-gold-light)"
        fontSize="5.5"
        letterSpacing="2.4"
        opacity="0.9"
      >
        SUPREMO
      </text>

      <rect x="58" y="280" width="164" height="12" rx="6" fill="var(--color-gold-dark)" opacity="0.35" />
      <rect x="72" y="292" width="136" height="6" rx="3" fill="var(--color-gold-dark)" opacity="0.5" />
    </svg>
  )
}

function PerfumeScene() {
  return (
    <section
      aria-label="Escena de perfume Néctar Supremo"
      className="relative flex h-[330px] shrink-0 flex-col overflow-hidden bg-gradient-to-br from-bg-1 via-bg-2 to-bg-3 min-[900px]:h-auto min-[900px]:w-1/2"
    >
      <div className="perfume-scene-glow pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative flex flex-1 items-center justify-center px-8 pt-6 min-[900px]:px-12">
        <div className="relative flex h-[200px] w-[200px] items-center justify-center min-[900px]:h-[440px] min-[900px]:w-[440px]">
          <div className="halo-spin absolute inset-0 rounded-full border border-dashed border-lavender/10" />
          <span className="absolute inset-0 rounded-full border border-lavender/20" />
          <span className="absolute inset-[13%] rounded-full border border-lavender/15" />
          <span className="absolute inset-[26%] rounded-full border border-lavender/10" />
          <span className="absolute inset-[18%] rounded-full bg-gold/15 blur-3xl" />
          <span className="perfume-shadow absolute bottom-[5%] h-4 w-[58%] rounded-full bg-bg-1/60 blur-md" />

          <div className="perfume-float relative z-10">
            <div className="perfume-turn">
              <Bottle />
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-6 pb-6 min-[900px]:px-14 min-[900px]:pb-12">
        <p className="font-serif text-3xl font-bold text-card min-[900px]:text-4xl">Néctar Supremo</p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-lavender min-[900px]:tracking-[0.32em]">
          Esencia · Elegancia · Estilo
        </p>
      </div>
    </section>
  )
}

export default PerfumeScene
