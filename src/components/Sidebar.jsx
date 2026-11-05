import { useState, useSyncExternalStore } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { clearSession, getSession } from '../auth/session.js'
import { getCartSnapshot, subscribe } from '../cart/cartStore.js'
import ConfirmDialog from './ConfirmDialog.jsx'

const CLIENT_LINKS = [
  { to: '/tienda', label: 'Tienda' },
  { to: '/carrito', label: 'Carrito' },
  { to: '/pedidos', label: 'Mis pedidos' },
  { to: '/cuenta', label: 'Mi cuenta' },
]

const ADMIN_LINKS = [
  { to: '/tienda', label: 'Tienda' },
  { to: '/admin/perfumes', label: 'Perfumes' },
  { to: '/admin/ventas', label: 'Ventas' },
  { to: '/admin/envios', label: 'Envíos' },
  { to: '/admin/recepcion', label: 'Recepción' },
  { to: '/admin/reportes', label: 'Reportes' },
  { to: '/cuenta', label: 'Mi cuenta' },
]

function Sidebar() {
  const session = getSession()
  const navigate = useNavigate()
  const cart = useSyncExternalStore(subscribe, getCartSnapshot, getCartSnapshot)
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const links = session?.role === 'Administrador' ? ADMIN_LINKS : CLIENT_LINKS
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    clearSession()
    setConfirming(false)
    navigate('/', { replace: true })
  }

  return (
    <>
      <header className="flex items-center justify-between bg-bg-1 px-4 py-3 text-card min-[900px]:hidden">
        <p className="font-serif text-lg font-bold">Perfumería Néctar</p>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="sidebar-menu"
          className="min-h-11 rounded-xl border border-card/20 px-4 text-sm font-semibold transition hover:bg-bg-2 focus:outline-none focus:ring-2 focus:ring-lavender"
        >
          {open ? 'Cerrar' : 'Menú'}
        </button>
      </header>

      <aside
        id="sidebar-menu"
        className={`${open ? 'block' : 'hidden'} bg-bg-1 px-4 py-6 text-card min-[900px]:block min-[900px]:min-h-screen min-[900px]:w-[250px] min-[900px]:shrink-0`}
      >
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Perfumería
          </p>
          <p className="font-serif text-2xl font-bold">Néctar</p>
        </div>

        <div className="rounded-2xl border border-card/10 bg-bg-2/60 p-4">
          <p className="text-sm font-semibold">{session?.name ?? 'Invitado'}</p>
          <p className="mt-1 inline-block rounded-full bg-card/10 px-2 py-0.5 text-xs text-lavender">
            Rol: {session?.role ?? 'Cliente'}
          </p>
        </div>

        <nav aria-label="Menú principal" className="mt-6 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex min-h-11 items-center justify-between rounded-xl px-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-card/15 text-card'
                    : 'text-card/80 hover:bg-bg-2 hover:text-card'
                }`
              }
            >
              <span>{link.label}</span>
              {link.to === '/carrito' && cartCount > 0 ? (
                <span className="rounded-full bg-gold px-2 py-0.5 text-xs text-bg-1">
                  {cartCount}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-8 min-h-11 w-full rounded-xl border border-card/20 px-4 py-3 font-bold text-card transition hover:bg-bg-2 focus:outline-none focus:ring-4 focus:ring-lavender"
        >
          Cerrar sesión
        </button>
      </aside>

      <ConfirmDialog
        open={confirming}
        title="Cerrar sesión"
        message="¿Seguro que deseas cerrar sesión? Tendrás que volver a ingresar tus datos."
        confirmText="Sí, cerrar sesión"
        onConfirm={handleLogout}
        onCancel={() => setConfirming(false)}
      />
    </>
  )
}

export default Sidebar
