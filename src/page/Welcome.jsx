import { Link } from 'react-router-dom'
import PerfumeScene from '../components/PerfumeScene.jsx'

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function Welcome() {
  return (
    <main className="flex min-h-screen flex-col bg-cream min-[900px]:flex-row">
      <PerfumeScene />

      <section className="flex flex-1 flex-col justify-center bg-cream px-6 py-10 min-[900px]:w-1/2 min-[900px]:px-16 min-[900px]:py-16">
        <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
            Acceso seguro
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-ink min-[900px]:text-6xl">
            <span className="text-gold-effect block">Bienvenido a</span>
            <span className="text-gold-effect block">Perfumería Néctar</span>
          </h1>
          <p className="mt-5 text-base text-muted">Elige cómo deseas continuar.</p>

          <nav aria-label="Opciones de acceso" className="mt-10 space-y-3">
            <Link
              to="/login"
              className="flex min-h-14 w-full items-center justify-between rounded-xl bg-primary px-5 font-bold text-card transition hover:bg-ink focus:outline-none focus:ring-4 focus:ring-lavender"
            >
              Iniciar sesión
              <Arrow />
            </Link>
            <Link
              to="/registro"
              className="flex min-h-14 w-full items-center justify-between rounded-xl bg-secondary px-5 font-bold text-card transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-line"
            >
              Crear cuenta
              <Arrow />
            </Link>
          </nav>

          <p className="mt-8 border-l-2 border-gold pl-3 text-sm text-muted">
            Clientes: compran y consultan pedidos · Administrador: gestiona la tienda
          </p>

          <footer className="mt-16 flex items-center justify-between text-sm text-muted">
            <span className="uppercase tracking-[0.15em]">Belleza · Elegancia · Estilo</span>
            <span className="font-serif text-lg font-bold text-gold-dark">N.</span>
          </footer>
        </div>
      </section>
    </main>
  )
}

export default Welcome
