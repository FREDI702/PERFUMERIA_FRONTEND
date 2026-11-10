import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { clearSession, getSession } from '../auth/session.js'

const CLIENT_LINKS = [
  { to: '/tienda', label: 'Ir a la tienda' },
  { to: '/carrito', label: 'Ver mi carrito' },
  { to: '/pedidos', label: 'Mis pedidos' },
]

const ADMIN_LINKS = [
  { to: '/admin/perfumes', label: 'Registrar perfumes' },
  { to: '/admin/ventas', label: 'Registrar ventas' },
  { to: '/admin/envios', label: 'Gestionar envíos' },
  { to: '/admin/recepcion', label: 'Recepción de carga' },
]

function Account() {
  const navigate = useNavigate()
  const session = getSession()
  const [confirming, setConfirming] = useState(false)
  const links = session?.role === 'Administrador' ? ADMIN_LINKS : CLIENT_LINKS

  const handleLogout = () => {
    clearSession()
    setConfirming(false)
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-eyebrow">
        Mi cuenta
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
        Hola, {session?.name ?? 'Cliente'}
      </h1>
      <p className="mt-2 text-sm text-muted">
        Administra tu sesión y accede rápido a las secciones de la tienda.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Card className="p-6 sm:p-6">
          <p className="text-sm font-semibold text-ink">Datos de la cuenta</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Nombre</dt>
              <dd className="font-semibold text-ink">{session?.name}</dd>
            </div>
            <div>
              <dt className="text-muted">Correo</dt>
              <dd className="font-semibold text-ink">{session?.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Rol</dt>
              <dd className="mt-1 inline-block rounded-full bg-ok-bg px-3 py-1 font-semibold text-ok">
                {session?.role ?? 'Cliente'}
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6 sm:p-6">
          <p className="text-sm font-semibold text-ink">Accesos rápidos</p>
          <div className="mt-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex min-h-11 items-center justify-between rounded-xl border border-line px-4 text-sm font-semibold text-ink transition hover:bg-surface focus:outline-none focus:ring-4 focus:ring-surface"
              >
                {link.label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 rounded-3xl border border-line bg-card p-6 shadow-sm">
        <p className="font-semibold text-ink">Cierre de sesión</p>
        <p className="mt-1 text-sm text-muted">
          Al cerrar sesión se borrarán tus datos de esta sesión. El botón Atrás no
          volverá a mostrar tu cuenta.
        </p>
        <Button
          variant="primary"
          onClick={() => setConfirming(true)}
          className="mt-4 w-full sm:w-auto"
        >
          Cerrar sesión
        </Button>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Cerrar sesión"
        message="¿Seguro que deseas cerrar sesión? Tendrás que volver a ingresar tus datos."
        confirmText="Sí, cerrar sesión"
        onConfirm={handleLogout}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}

export default Account
