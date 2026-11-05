function PageLoader() {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <span className="sr-only">Cargando…</span>
      <div className="h-9 w-48 animate-pulse rounded-xl bg-card motion-reduce:animate-none" />
      <div className="h-40 animate-pulse rounded-3xl bg-card motion-reduce:animate-none" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-52 animate-pulse rounded-3xl bg-card motion-reduce:animate-none"
          />
        ))}
      </div>
    </div>
  )
}

export default PageLoader
