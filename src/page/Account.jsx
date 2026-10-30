import { useNavigate } from 'react-router-dom'
import { clearSession, getSession } from '../auth/session.js'

function Account() {
  const navigate = useNavigate()
  const session = getSession()

  const handleLogout = () => {
    clearSession()
    navigate('/', { replace: true })
  }

  return (
    <main className="min-h-screen bg-surface px-4 py-10">
      <section className="mx-auto w-full max-w-[605px] rounded-[28px] bg-card p-6 shadow-xl sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-eyebrow">
          Mi cuenta
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-ink">
          ¡Bienvenido a Perfumería Néctar!
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sesión iniciada como <span className="font-semibold text-ink">{session?.email}</span>
        </p>
        <p className="mt-3 inline-block rounded-full bg-ok-bg px-3 py-1 text-sm font-semibold text-ok">
          Rol: {session?.role ?? 'Cliente'}
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 min-h-11 w-full rounded-[14px] bg-primary px-4 py-3 font-bold text-card transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-line"
        >
          Cerrar sesión
        </button>
      </section>
    </main>
  )
}

export default Account
