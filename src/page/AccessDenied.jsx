import { Link } from 'react-router-dom'
import Card from '../components/Card.jsx'
import { buttonClasses } from '../utils/ui.js'

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function AccessDenied() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-eyebrow">
        Panel de administración
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
        Acceso denegado
      </h1>

      <Card className="mt-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-err-bg text-err">
          <LockIcon />
        </div>
        <h2 className="mt-5 font-serif text-2xl font-bold text-ink">
          No tienes permisos para entrar aquí
        </h2>
        <p className="mt-2 text-sm text-muted">
          Esta sección está reservada para administradores de la tienda.
        </p>
        <Link
          to="/tienda"
          className={buttonClasses({ className: 'mt-6 w-full max-w-xs' })}
        >
          Volver a la tienda
        </Link>
      </Card>
    </div>
  )
}

export default AccessDenied
