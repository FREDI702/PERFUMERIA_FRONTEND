import { Fragment, useEffect, useState } from 'react'
import Banner from '../../components/Banner.jsx'
import Button from '../../components/Button.jsx'
import Card from '../../components/Card.jsx'
import Field from '../../components/Field.jsx'
import Table from '../../components/Table.jsx'
import {
  createSale,
  getClients,
  getProducts,
  getSales,
} from '../../auth/mockApi.js'
import { formatCurrency, formatDateTime } from '../../utils/format.js'
import { validateQuantity } from '../../utils/validaciones.js'

function Sales() {
  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [clientEmail, setClientEmail] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [lines, setLines] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const loadData = async () => {
    const [clientsData, productsData, salesData] = await Promise.all([
      getClients(),
      getProducts(),
      getSales(),
    ])

    setClients(clientsData)
    setProducts(productsData)
    setSales(salesData)
    setProductId(String(productsData[0]?.id ?? ''))
  }

  useEffect(() => {
    let active = true

    Promise.all([getClients(), getProducts(), getSales()]).then(
      ([clientsData, productsData, salesData]) => {
        if (!active) {
          return
        }

        setClients(clientsData)
        setProducts(productsData)
        setSales(salesData)
        setProductId(String(productsData[0]?.id ?? ''))
      },
    )

    return () => {
      active = false
    }
  }, [])

  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)

  const handleAddLine = () => {
    setError('')
    setSuccess('')

    const product = products.find((item) => item.id === Number(productId))

    if (!product) {
      setError('Selecciona un perfume para agregar a la venta.')
      return
    }

    const existing = lines.find((line) => line.productId === product.id)
    const available = product.stock - (existing?.quantity ?? 0)
    const quantityError = validateQuantity(quantity, available)

    if (quantityError) {
      setError(quantityError)
      return
    }

    const amount = Number(quantity)

    if (existing) {
      setLines((current) =>
        current.map((line) =>
          line.productId === product.id
            ? { ...line, quantity: line.quantity + amount }
            : line,
        ),
      )
    } else {
      setLines((current) => [
        ...current,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: amount,
        },
      ])
    }

    setQuantity('1')
  }

  const removeLine = (productIdToRemove) => {
    setLines((current) =>
      current.filter((line) => line.productId !== productIdToRemove),
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!clientEmail) {
      setError('Selecciona un cliente registrado.')
      return
    }

    if (lines.length === 0) {
      setError('Agrega al menos un producto a la venta.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const sale = await createSale({
        clientEmail,
        items: lines.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
        })),
      })

      setSuccess(`¡Venta #${sale.id} registrada con éxito!`)
      setLines([])
      setClientEmail('')
      await loadData()
    } catch (err) {
      setError(
        err.message.startsWith('Stock insuficiente')
          ? err.message
          : 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-eyebrow">
        Administrador
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
        Registro de ventas
      </h1>
      <p className="mt-2 text-sm text-muted">
        Registra una venta para un cliente y controla el stock automáticamente.
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

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <Card className="h-fit p-6 sm:p-6">
          <h2 className="font-serif text-xl font-bold text-ink">Nueva venta</h2>

          <form noValidate onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Field
              id="sale-client"
              label="Cliente registrado"
              as="select"
              value={clientEmail}
              onChange={(event) => setClientEmail(event.target.value)}
              options={[
                { value: '', label: 'Selecciona un cliente' },
                ...clients.map((client) => ({
                  value: client.email,
                  label: `${client.name} · ${client.email}`,
                })),
              ]}
              required
            />

            <div className="grid gap-4 sm:grid-cols-[1.4fr_0.6fr]">
              <Field
                id="sale-product"
                label="Perfume"
                as="select"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                options={products.map((product) => ({
                  value: product.id,
                  label: `${product.name} · ${product.stock} disp.`,
                }))}
              />

              <Field
                id="sale-quantity"
                label="Cantidad"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                hint="Mayor que 0."
              />
            </div>

            <Button
              variant="secondary"
              onClick={handleAddLine}
              className="w-full"
            >
              Agregar producto
            </Button>

            {lines.length > 0 ? (
              <div>
                <p className="text-sm font-semibold text-ink">
                  Detalle de la venta
                </p>
                <div className="mt-2 overflow-x-auto rounded-2xl border border-line">
                  <table className="w-full min-w-[420px] text-left text-sm">
                    <thead className="bg-surface text-xs uppercase tracking-[0.12em] text-muted">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Perfume</th>
                        <th className="px-3 py-2 font-semibold">Cant.</th>
                        <th className="px-3 py-2 font-semibold">Subtotal</th>
                        <th className="px-3 py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {lines.map((line) => (
                        <tr key={line.productId} className="text-ink">
                          <td className="px-3 py-2">
                            {line.name}
                            <span className="block text-xs text-muted">
                              {formatCurrency(line.price)} c/u
                            </span>
                          </td>
                          <td className="px-3 py-2">{line.quantity}</td>
                          <td className="px-3 py-2 font-semibold">
                            {formatCurrency(line.price * line.quantity)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => removeLine(line.productId)}
                              className="min-h-11 rounded-lg px-2 text-xs font-semibold text-err transition hover:bg-err-bg"
                            >
                              Quitar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between border-t border-line pt-4">
              <span className="text-sm text-muted">Total</span>
              <span className="font-serif text-2xl font-bold text-ink">
                {formatCurrency(total)}
              </span>
            </div>

            <Button
              type="submit"
              loading={saving}
              loadingText="Registrando venta…"
              className="w-full"
            >
              Registrar venta
            </Button>
          </form>
        </Card>

        <div>
          <h2 className="font-serif text-xl font-bold text-ink">
            Ventas registradas
          </h2>
          <div className="mt-3">
            <Table head={['Venta', 'Cliente', 'Fecha', 'Total', 'Acciones']}>
              {sales.map((sale) => (
                <Fragment key={sale.id}>
                  <tr className="text-ink">
                    <td className="px-4 py-3 font-semibold">#{sale.id}</td>
                    <td className="px-4 py-3">{sale.clientName}</td>
                    <td className="px-4 py-3">{formatDateTime(sale.date)}</td>
                    <td className="px-4 py-3 font-semibold">
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId((current) =>
                            current === sale.id ? null : sale.id,
                          )
                        }
                        className="min-h-11 rounded-xl px-3 text-sm font-semibold text-eyebrow transition hover:bg-surface focus:outline-none focus:ring-4 focus:ring-surface"
                      >
                        {expandedId === sale.id ? 'Ocultar' : 'Ver detalle'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === sale.id ? (
                    <tr className="bg-surface">
                      <td colSpan={5} className="px-4 py-4">
                        <ul className="space-y-2 text-sm text-ink">
                          {sale.items.map((item) => (
                            <li
                              key={`${sale.id}-${item.productId}`}
                              className="flex flex-wrap items-center justify-between gap-2"
                            >
                              <span>
                                {item.name} × {item.quantity}
                              </span>
                              <span className="font-semibold">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sales
