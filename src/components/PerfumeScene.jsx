function PerfumeScene() {
  return (
    <section
      aria-label="Escena de perfume de lujo"
      className="relative flex h-[330px] shrink-0 flex-col overflow-hidden bg-gradient-to-br from-bg-1 via-bg-2 to-bg-3 min-[900px]:h-auto min-[900px]:w-1/2"
    >
      <div className="perfume-scene-glow pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative flex flex-1 items-center justify-center px-8 pt-6 min-[900px]:px-12">
        <div className="relative flex h-[240px] w-[240px] items-center justify-center min-[900px]:h-[480px] min-[900px]:w-[480px]">
          <div className="halo-spin absolute inset-0 rounded-full border border-dashed border-lavender/10" />
          <span className="absolute inset-0 rounded-full border border-lavender/20" />
          <span className="absolute inset-[13%] rounded-full border border-lavender/15" />
          <span className="absolute inset-[26%] rounded-full border border-lavender/10" />
          <span className="absolute inset-[18%] rounded-full bg-gold/15 blur-3xl" />
          <span className="perfume-shadow absolute bottom-[4%] h-4 w-[64%] rounded-full bg-bg-1/60 blur-md" />

          <div className="perfume-float relative z-10">
            <div className="perfume-turn">
              <div className="overflow-hidden rounded-[32px] border border-gold/30 bg-card shadow-2xl">
                <img
                  src="/images/dior-homme-intense.png"
                  alt="Frasco de perfume Dior Homme Intense"
                  width="488"
                  height="488"
                  className="h-[200px] w-[200px] object-cover min-[900px]:h-[380px] min-[900px]:w-[380px]"
                />
              </div>
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
