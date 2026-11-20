import PerfumeBottle3D from './PerfumeBottle3D.jsx'

function PerfumeScene() {
  return (
    <section
      aria-label="Escena de perfume de lujo"
      className="perfume-scene-bg relative flex h-[330px] shrink-0 flex-col overflow-hidden min-[900px]:h-auto min-[900px]:w-1/2"
    >
      <div className="perfume-scene-glow pointer-events-none absolute inset-0 opacity-90" />
      <div className="scene-stars pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="scene-stars-alt pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative flex flex-1 items-center justify-center px-8 pt-6 min-[900px]:px-12">
        <div className="relative flex h-[240px] w-[240px] items-center justify-center min-[900px]:h-[480px] min-[900px]:w-[480px]">
          <div className="halo-spin pointer-events-none absolute inset-0" aria-hidden="true">
            <svg className="h-full w-full" viewBox="0 0 480 480" fill="none">
              <defs>
                <linearGradient
                  id="scene-ring-gradient"
                  x1="0"
                  y1="0"
                  x2="480"
                  y2="480"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: 'var(--color-gold-light)', stopOpacity: 0 }}
                  />
                  <stop
                    offset="18%"
                    style={{ stopColor: 'var(--color-gold-light)', stopOpacity: 0.85 }}
                  />
                  <stop
                    offset="45%"
                    style={{ stopColor: 'var(--color-gold-light)', stopOpacity: 1 }}
                  />
                  <stop
                    offset="70%"
                    style={{ stopColor: 'var(--color-gold)', stopOpacity: 1 }}
                  />
                  <stop
                    offset="88%"
                    style={{ stopColor: 'var(--color-gold-dark)', stopOpacity: 0.5 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: 'var(--color-gold-dark)', stopOpacity: 0 }}
                  />
                </linearGradient>
                <filter id="scene-ring-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <ellipse
                cx="240"
                cy="240"
                rx="205"
                ry="145"
                transform="rotate(-18 240 240)"
                stroke="url(#scene-ring-gradient)"
                strokeWidth="2.5"
                filter="url(#scene-ring-glow)"
              />
              <ellipse
                cx="240"
                cy="240"
                rx="225"
                ry="165"
                transform="rotate(22 240 240)"
                stroke="url(#scene-ring-gradient)"
                strokeWidth="2"
                filter="url(#scene-ring-glow)"
              />
              <ellipse
                cx="240"
                cy="240"
                rx="235"
                ry="178"
                transform="rotate(-42 240 240)"
                stroke="url(#scene-ring-gradient)"
                strokeWidth="1.5"
                filter="url(#scene-ring-glow)"
              />
            </svg>
          </div>

          <span
            className="pointer-events-none absolute inset-0 rounded-full bg-secondary/10 blur-3xl"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute inset-[6%] rounded-full bg-secondary/30 blur-3xl"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute inset-[18%] rounded-full bg-gold/20 blur-3xl"
            aria-hidden="true"
          />
          <span
            className="perfume-shadow absolute bottom-[4%] h-4 w-[64%] rounded-full bg-primary/60 blur-md"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute bottom-[6%] h-px w-[64%] rounded-full bg-gradient-to-r from-transparent via-gold-light to-transparent blur-[1px]"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute bottom-[1%] h-12 w-[78%] rounded-[50%] bg-secondary/20 blur-2xl"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute bottom-[3%] h-10 w-[64%] rounded-[50%] bg-gold/15 blur-2xl"
            aria-hidden="true"
          />

          <PerfumeBottle3D />

          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <span className="sparkle absolute left-[10%] top-[18%] h-2 w-2 bg-gold-light" />
            <span className="sparkle sparkle-delay absolute right-[12%] top-[14%] h-1.5 w-1.5 bg-card" />
            <span className="sparkle absolute left-[20%] top-[48%] h-1.5 w-1.5 bg-gold" />
            <span className="sparkle sparkle-delay absolute right-[18%] top-[52%] h-2 w-2 bg-gold-light" />
            <span className="sparkle absolute bottom-[18%] left-[30%] h-1 w-1 bg-card" />
            <span className="sparkle sparkle-delay absolute bottom-[22%] right-[28%] h-1.5 w-1.5 bg-gold" />
            <span className="sparkle absolute left-[6%] top-[62%] h-1 w-1 bg-gold-light" />
            <span className="sparkle sparkle-delay absolute right-[8%] top-[38%] h-1 w-1 bg-card" />
            <span className="sparkle sparkle-delay absolute left-[32%] top-[10%] h-2.5 w-2.5 bg-gold-light" />
            <span className="sparkle absolute right-[30%] bottom-[12%] h-2 w-2 bg-gold-light" />
            <span className="sparkle sparkle-delay absolute left-[8%] bottom-[8%] h-1.5 w-1.5 bg-card" />
            <span className="sparkle absolute right-[6%] top-[24%] h-2 w-2 bg-gold" />
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-space-deep/90 via-space-deep/40 to-transparent"
        aria-hidden="true"
      />

      <div className="relative px-6 pb-6 min-[900px]:px-14 min-[900px]:pb-12">
        <p className="font-serif text-3xl font-bold text-card min-[900px]:text-4xl">
          Néctar Supremo
        </p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-gold-light min-[900px]:tracking-[0.32em]">
          Esencia · Elegancia · Estilo
        </p>
      </div>
    </section>
  )
}

export default PerfumeScene
