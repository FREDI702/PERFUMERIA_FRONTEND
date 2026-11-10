import { Fragment, useEffect, useState } from 'react'
import Banner from '../../components/Banner.jsx'
import Button from '../../components/Button.jsx'
import Card from '../../components/Card.jsx'
import Field from '../../components/Field.jsx'
import Table from '../../components/Table.jsx'
import {
  createReception,
  getProducts,
  getReceptions,
} from '../../auth/mockApi.js'
import { formatDate, todayInputValue } from '../../utils/format.js'
import { validateProvider, validateQuantity } from '../../utils/validaciones.js'

const CONDITION_OPTIONS = [
  { value: 'Bueno', label: 'Bueno' },
  { value: 'Con observaciones', label: 'Con observaciones' },
  { value: 'Dañado', label: 'Dañado' },
]

function Receptions() {
  const [receptions, setReceptions] = useState([])
  const [products, setProducts] = useState([])
  const [date, setDate] = useState(todayInputValue())
  const [provider, setProvider] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [condition, setCondition] = useState('Bueno')
  const [lines, setLines] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const loadData = async () => {
    const [receptionsData, productsData] = await Promise.all([
      getReceptions(),
      getProducts(),
    ])
    setReceptions(receptionsData)
    setProducts(productsData)
    setProductId(String(productsData[0]?.id ?? ''))
  }

  useEffect(() => {
    let active = true

    Promise.all([getReceptions(), getProducts()]).then(
      ([receptionsData, productsData]) => {
        if (!active) {
          return
        }

        setReceptions(receptionsData)
        setProducts(productsData)
        setProductId(String(productsData[0]?.id ?? ''))
      },
    )

    return () => {
      active = false
    }
  }, [])

  const handleAddLine = () => {
    setError('')
    setSuccess('')

    const product = products.find((item) => item.id === Number(productId))

    if (!product) {
      setError('Selecciona un perfume para agregar a la recepción.')
      return
    }

    const quantityError = validateQuantity(quantity)

    if (quantityError) {
      setError(quantityError)
      return
    }

    const amount = Number(quantity)
    const existing = lines.find((line) => line.productId === product.id)

    if (existing) {
      setLines((current) =>
        current.map((line) =>
          line.productId === product.id
            ? { ...line, quantity: line.quantity + amount, condition }
            : line,
        ),
      )
    } else {
      setLines((current) => [
        ...current,
        {
          productId: product.id,
          name: product.name,
          quantity: amount,
          condition,
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
    setError('')
    setSuccess('')

    const providerError = validateProvider(provider)

    if (providerError) {
      setError(providerError)
      return
    }

    if (!date) {
      setError('La fecha es obligatoria.')
      return
    }

    if (lines.length === 0) {
      setError('Agrega al menos un perfume a la recepción.')
      return
    }

    setSaving(true)

    try {
      const reception = await createReception({ date, provider, items: lines })
      setSuccess(`Recepción #${reception.id} registrada. El stock se actualizó.`)
      setLines([])
      setProvider('')
      await loadData()
    } catch {
      setError('Ocurrió un error inesperado. Inténtalo de nuevo más tarde.')
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
        Recepción de carga
      </h1>
      <p className="mt-2 text-sm text-muted">
        Registra el ingreso de perfumes y actualiza el stock automáticamente.
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

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <Card className="h-fit min-w-0 p-6 sm:p-6">
          <h2 className="font-serif text-xl font-bold text-ink">
            Nueva recepción
          </h2>

          <form noValidate onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="reception-date"
                label="Fecha"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />

              <Field
                id="reception-provider"
                label="Proveedor"
                value={provider}
                onChange={(event) => setProvider(event.target.value)}
                hint="Nombre del proveedor."
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-[1.4fr_0.6fr]">
              <Field
                id="reception-product"
                label="Perfume"
                as="select"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                options={products.map((product) => ({
                  value: product.id,
                  label: `${product.name} · ${product.stock} en stock`,
                }))}
              />

              <Field
                id="reception-quantity"
                label="Cantidad"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                hint="Mayor que 0."
              />
            </div>

            <Field
              id="reception-condition"
              label="Estado"
              as="select"
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
              options={CONDITION_OPTIONS}
            />

            <Button
              variant="secondary"
              onClick={handleAddLine}
              className="w-full"
            >
              Agregar perfume
            </Button>

            {lines.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-line">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="bg-surface text-xs uppercase tracking-[0.12em] text-muted">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Perfume</th>
                      <th className="px-3 py-2 font-semibold">Cant.</th>
                      <th className="px-3 py-2 font-semibold">Estado</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {lines.map((line) => (
                      <tr key={line.productId} className="text-ink">
                        <td className="px-3 py-2">{line.name}</td>
                        <td className="px-3 py-2">{line.quantity}</td>
                        <td className="px-3 py-2">{line.condition}</td>
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
            ) : null}

            <Button
              type="submit"
              loading={saving}
              loadingText="Registrando recepción…"
              className="w-full"
            >
              Confirmar recepción
            </Button>
          </form>
        </Card>

        <div className="min-w-0">
          <h2 className="font-serif text-xl font-bold text-ink">
            Historial de recepciones
          </h2>
          <div className="mt-3">
            <Table
              head={[
                'Recepción',
                'Fecha',
                'Proveedor',
                'Productos',
                'Unidades',
                'Acciones',
              ]}
            >
              {receptions.map((reception) => {
                const units = reception.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                )

                return (
                  <Fragment key={reception.id}>
                    <tr className="text-ink">
                      <td className="px-4 py-3 font-semibold">
                        #{reception.id}
                      </td>
                      <td className="px-4 py-3">{formatDate(reception.date)}</td>
                      <td className="px-4 py-3">{reception.provider}</td>
                      <td className="px-4 py-3">{reception.items.length}</td>
                      <td className="px-4 py-3">{units}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId((current) =>
                              current === reception.id ? null : reception.id,
                            )
                          }
                          className="min-h-11 rounded-xl px-3 text-sm font-semibold text-eyebrow transition hover:bg-surface focus:outline-none focus:ring-4 focus:ring-surface"
                        >
                          {expandedId === reception.id
                            ? 'Ocultar'
                            : 'Ver detalle'}
                        </button>
                      </td>
                    </tr>
                    {expandedId === reception.id ? (
                      <tr className="bg-surface">
                        <td colSpan={6} className="px-4 py-4">
                          <ul className="space-y-2 text-sm text-ink">
                            {reception.items.map((item) => (
                              <li
                                key={`${reception.id}-${item.productId}`}
                                className="flex flex-wrap items-center justify-between gap-2"
                              >
                                <span>
                                  {item.name} · {item.condition}
                                </span>
                                <span className="font-semibold">
                                  {item.quantity} unidad(es)
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                )
              })}
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Receptions
