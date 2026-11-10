import { useState, useSyncExternalStore } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Banner from '../components/Banner.jsx'
import BottleArt from '../components/BottleArt.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import {
  clearCart,
  getCartSnapshot,
  removeFromCart,
  subscribe,
  updateQuantity,
} from '../cart/cartStore.js'
import { getSession } from '../auth/session.js'
import { createSale } from '../auth/mockApi.js'
import { formatCurrency } from '../utils/format.js'
import { buttonClasses } from '../utils/ui.js'

function Cart() {
  const navigate = useNavigate()
  const session = getSession()
  const items = useSyncExternalStore(subscribe, getCartSnapshot, getCartSnapshot)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleConfirm = async () => {
    if (!items.length || !session) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const sale = await createSale({
        clientEmail: session.email,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })

      clearCart()
      setSuccess(`¡Compra registrada! Tu pedido es el #${sale.id}.`)
      window.setTimeout(() => {
        navigate('/pedidos', { replace: true })
      }, 1500)
    } catch (err) {
      setError(
        err.message.startsWith('Stock insuficiente')
          ? err.message
          : 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-eyebrow">
        Carrito
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
        Tu carrito
      </h1>
      <p className="mt-2 text-sm text-muted">
        Revisa tus productos antes de confirmar la compra.
      </p>

      {error ? (
        <div className="mt-4">
          <Banner type="error">{error}</Banner>
        </div>
      ) : null}
      {success ? (
        <div className="mt-4">
          <Banner type="success">{success}</Banner>
        </div>
      ) : null}

      {items.length === 0 ? (
        <Card className="mt-6 text-center">
          <p className="font-serif text-2xl font-bold text-ink">
            Tu carrito está vacío
          </p>
          <p className="mt-2 text-sm text-muted">
            Agrega perfumes desde el catálogo para continuar.
          </p>
          <Link
            to="/tienda"
            className={buttonClasses({ className: 'mt-6 w-full max-w-xs' })}
          >
            Ir al catálogo
          </Link>
        </Card>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.productId}
                className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-surface">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-auto object-contain"
                    />
                  ) : (
                    <BottleArt
                      tone={item.tone}
                      label={item.name}
                      className="h-20 w-auto"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-eyebrow">
                    {item.brand}
                  </p>
                  <h2 className="font-serif text-lg font-bold text-ink">
                    {item.name}
                  </h2>
                  <p className="text-sm text-muted">{item.presentation}</p>
                  <p className="mt-1 font-semibold text-ink">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    aria-label={`Quitar una unidad de ${item.name}`}
                    className="min-h-11 min-w-11 rounded-xl border border-line font-bold text-ink transition hover:bg-surface disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center font-semibold text-ink">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.stock}
                    aria-label={`Agregar una unidad de ${item.name}`}
                    className="min-h-11 min-w-11 rounded-xl border border-line font-bold text-ink transition hover:bg-surface disabled:opacity-40"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="min-h-11 rounded-xl px-3 text-sm font-semibold text-err transition hover:bg-err-bg focus:outline-none focus:ring-4 focus:ring-err-bg"
                  >
                    Quitar
                  </button>
                </div>
              </article>
            ))}
          </div>

          <Card className="h-fit p-6 sm:p-6">
            <h2 className="font-serif text-xl font-bold text-ink">Resumen</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-semibold text-ink">{formatCurrency(total)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Envío</dt>
                <dd className="font-semibold text-ok">Gratis</dd>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-3 text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-bold text-ink">{formatCurrency(total)}</dd>
              </div>
            </dl>
            <Button
              variant="primary"
              onClick={handleConfirm}
              loading={loading}
              loadingText="Registrando compra…"
              className="mt-6 w-full"
            >
              Confirmar compra
            </Button>
            <p className="mt-3 text-center text-xs text-muted">
              Se registrará un pedido a nombre de {session?.name}.
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Cart
