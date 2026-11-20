import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Banner from '../components/Banner.jsx'
import BottleArt from '../components/BottleArt.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Field from '../components/Field.jsx'
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
import { validateCheckout } from '../utils/checkout.js'
import { resolveCurrentLocation } from '../utils/location.js'
import { getDepartments, getDistricts, getProvinces, matchUbigeoName } from '../utils/ubigeo.js'

function Cart() {
  const navigate = useNavigate()
  const session = getSession()
  const items = useSyncExternalStore(subscribe, getCartSnapshot, getCartSnapshot)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [checkout, setCheckout] = useState({
    firstName: '', lastName: '', phone: '', delivery: '', address: '', department: '', province: '', district: '',
    reference: '', payment: '', receipt: '', dni: '', ruc: '', businessName: '',
  })
  const [errors, setErrors] = useState({})
  const [locating, setLocating] = useState(false)
  const [locationMessage, setLocationMessage] = useState('')
  const locationRequest = useRef(null)

  useEffect(() => () => locationRequest.current?.abort(), [])

  const handleLocation = async () => {
    const controller = new AbortController()
    locationRequest.current = controller
    setLocating(true)
    setLocationMessage('')
    try {
      const location = await resolveCurrentLocation(controller.signal)
      if (controller.signal.aborted) return
      setCheckout((current) => {
        if (current.delivery !== 'delivery') return current
        const foundDepartment = matchUbigeoName(location.department, getDepartments())
        const department = current.department || foundDepartment
        const foundProvince = department === foundDepartment
          ? matchUbigeoName(location.province, getProvinces(department))
          : ''
        const province = current.province || foundProvince
        const district = department === foundDepartment && province === foundProvince
          ? matchUbigeoName(location.district, getDistricts(department, province))
          : ''
        const conflictingDepartment = current.department && current.department !== foundDepartment
        const conflictingProvince = current.province && current.province !== foundProvince
        const conflictingDistrict = current.district && current.district !== district
        return {
          ...current,
          department,
          province,
          district: current.district || district,
          address: current.address || (
            conflictingDepartment || conflictingProvince || conflictingDistrict ? '' : location.address
          ),
        }
      })
      setLocationMessage('Ubicación aproximada obtenida. Revisa y completa los campos antes de continuar.')
    } catch (err) {
      if (controller.signal.aborted) return
      if (err.code === 1) {
        setLocationMessage('No se concedió acceso a la ubicación. Ingresa los datos manualmente.')
      } else if (err.code === 2 || err.code === 3 || err instanceof TypeError || err instanceof SyntaxError) {
        setLocationMessage('No se pudo obtener la ubicación. Ingresa los datos manualmente.')
      } else {
        setLocationMessage(err.message || 'No se pudo obtener la ubicación. Ingresa los datos manualmente.')
      }
    } finally {
      if (!controller.signal.aborted) {
        locationRequest.current = null
        setLocating(false)
      }
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleConfirm = async (event) => {
    event.preventDefault()
    if (!items.length || !session) {
      return
    }

    const validationErrors = validateCheckout(checkout)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length) {
      setError('Revisa los datos del pedido antes de continuar.')
      return
    }

    if (locationRequest.current) {
      locationRequest.current.abort()
      locationRequest.current = null
      setLocating(false)
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
        checkout,
      })

      clearCart()
      setSuccess(`¡Pedido simulado #${sale.id} registrado! Pago pendiente de confirmación.`)
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
            <form noValidate onSubmit={handleConfirm} className="mt-6 space-y-3">
              <h3 className="font-serif text-xl font-bold text-ink">Datos del pedido</h3>
              <p className="text-sm text-muted">
                Proceso simulado: no se realizan cobros y los datos se borran al recargar.
              </p>
              {[
                ['firstName', 'Nombres'],
                ['lastName', 'Apellidos'],
                ['phone', 'Teléfono'],
              ].map(([key, label]) => (
                <Field key={key} id={`checkout-${key}`} label={label} required
                  type={key === 'phone' ? 'tel' : 'text'} value={checkout[key]}
                  error={errors[key]} onChange={(event) => setCheckout({ ...checkout, [key]: event.target.value })} />
              ))}
              <Field id="checkout-delivery" label="Modalidad de entrega" as="select" required
                value={checkout.delivery} error={errors.delivery}
                onChange={(event) => {
                  if (event.target.value !== 'delivery' && locationRequest.current) {
                    locationRequest.current.abort()
                    locationRequest.current = null
                    setLocating(false)
                    setLocationMessage('')
                  }
                  setCheckout({ ...checkout, delivery: event.target.value })
                }}
                options={[{ value: '', label: 'Selecciona una modalidad' }, { value: 'delivery', label: 'Entrega a domicilio' }, { value: 'recojo', label: 'Recojo en tienda' }]} />
              {checkout.delivery === 'delivery' ? (
                <>
                  <p className="text-sm text-muted">
                    Opcional: al usar tu ubicación, tus coordenadas se enviarán a Nominatim de OpenStreetMap para obtener una dirección aproximada.
                  </p>
                  <Button variant="secondary" onClick={handleLocation} disabled={locating}
                    loading={locating} loadingText="Buscando ubicación…" className="w-full">
                    Usar mi ubicación actual
                  </Button>
                  {locationMessage ? <p role="status" className="text-sm text-ink">{locationMessage}</p> : null}
                  <Field id="checkout-department" label="Departamento" as="select" required
                    value={checkout.department} error={errors.department}
                    onChange={(event) => setCheckout({ ...checkout, department: event.target.value, province: '', district: '' })}
                    options={[
                      { value: '', label: 'Selecciona un departamento' },
                      ...getDepartments(),
                    ]} />
                  <Field id="checkout-province" label="Provincia" as="select" required
                    disabled={!checkout.department} value={checkout.province} error={errors.province}
                    onChange={(event) => setCheckout({ ...checkout, province: event.target.value, district: '' })}
                    options={[{ value: '', label: 'Selecciona una provincia' }, ...getProvinces(checkout.department)]} />
                  <Field id="checkout-district" label="Distrito" as="select" required
                    disabled={!checkout.province} value={checkout.district} error={errors.district}
                    onChange={(event) => setCheckout({ ...checkout, district: event.target.value })}
                    options={[{ value: '', label: 'Selecciona un distrito' }, ...getDistricts(checkout.department, checkout.province)]} />
                  {['address', 'reference'].map((key) => (
                    <Field key={key} id={`checkout-${key}`}
                      label={{ address: 'Dirección', reference: 'Referencia' }[key]}
                      required value={checkout[key]}
                      error={errors[key]} onChange={(event) => setCheckout({ ...checkout, [key]: event.target.value })} />
                  ))}
                </>
              ) : null}
              <Field id="checkout-payment" label="Método de pago" as="select" required
                value={checkout.payment} error={errors.payment}
                onChange={(event) => setCheckout({ ...checkout, payment: event.target.value })}
                options={[{ value: '', label: 'Selecciona un método' }, { value: 'tarjeta', label: 'Tarjeta' }, { value: 'yape', label: 'Yape' }, { value: 'efectivo', label: 'Efectivo' }]} />
              {checkout.payment === 'yape' ? (
                <div className="rounded-2xl border border-line bg-surface p-4 text-center">
                  <p className="font-semibold text-ink">QR de Yape</p>
                  <img src="/pagos/yape-qr.png" alt="Código QR de Yape" className="mx-auto mt-3 max-h-60 max-w-full object-contain" />
                  <p className="mt-3 text-sm text-muted">Demostración: no realices transferencias. Este sistema no valida pagos.</p>
                </div>
              ) : null}
              {checkout.payment === 'tarjeta' ? (
                <p className="text-sm text-muted">Tarjeta simulada: no se solicitan datos de tarjeta ni se realiza ningún cargo.</p>
              ) : null}
              {checkout.payment === 'efectivo' && checkout.delivery ? (
                <p className="text-sm text-muted">
                  {checkout.delivery === 'delivery' ? 'Pago contra entrega.' : 'Pago al recoger en tienda.'} El pago quedará pendiente de confirmación.
                </p>
              ) : null}
              <Field id="checkout-receipt" label="Comprobante" as="select" required
                value={checkout.receipt} error={errors.receipt}
                onChange={(event) => setCheckout({ ...checkout, receipt: event.target.value })}
                options={[{ value: '', label: 'Selecciona un comprobante' }, { value: 'boleta', label: 'Boleta' }, { value: 'factura', label: 'Factura' }]} />
              {checkout.receipt === 'boleta' ? (
                <Field id="checkout-dni" label="DNI" required value={checkout.dni} error={errors.dni}
                  onChange={(event) => setCheckout({ ...checkout, dni: event.target.value })} />
              ) : null}
              {checkout.receipt === 'factura' ? (
                [['ruc', 'RUC'], ['businessName', 'Razón social']].map(([key, label]) => (
                  <Field key={key} id={`checkout-${key}`} label={label} required value={checkout[key]}
                    error={errors[key]} onChange={(event) => setCheckout({ ...checkout, [key]: event.target.value })} />
                ))
              ) : null}
              <Button type="submit" variant="primary" loading={loading}
                loadingText="Registrando pedido…" className="w-full">
                Registrar pedido simulado
              </Button>
              <p className="text-center text-sm text-muted">El pago queda pendiente hasta que el administrador lo confirme.</p>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Cart
