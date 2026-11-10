import { Link } from 'react-router-dom'
import PerfumeScene from '../components/PerfumeScene.jsx'
import Card from '../components/Card.jsx'
import Banner from '../components/Banner.jsx'
import { buttonClasses } from '../utils/ui.js'

function SessionExpired() {
  return (
    <main className="flex min-h-screen flex-col bg-cream min-[900px]:flex-row">
      <PerfumeScene />

      <section className="flex flex-1 items-center justify-center bg-cream px-4 py-8 min-[900px]:w-1/2 min-[900px]:px-8 min-[900px]:py-16">
        <Card className="w-full max-w-[605px]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
            Acceso seguro
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">
            Tu sesión terminó
          </h1>
          <p className="mt-2 text-sm text-muted">
            Por tu seguridad cerramos la sesión. Puedes volver a ingresar cuando quieras.
          </p>

          <div className="mt-6">
            <Banner type="error">
              Tu sesión expiró por inactividad (30 min) y por seguridad cerramos tu cuenta.
            </Banner>
          </div>

          <Link
            to="/login"
            className={buttonClasses({ className: 'mt-6 w-full' })}
          >
            Volver a iniciar sesión
          </Link>

          <p className="mt-5 text-center text-sm text-muted">
            <Link
              to="/"
              className="rounded font-semibold text-eyebrow underline-offset-4 transition hover:text-ink hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender"
            >
              ← Volver a inicio
            </Link>
          </p>
        </Card>
      </section>
    </main>
  )
}

export default SessionExpired
