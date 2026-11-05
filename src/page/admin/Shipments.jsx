import { useEffect, useState } from 'react'
import Banner from '../../components/Banner.jsx'
import Button from '../../components/Button.jsx'
import Card from '../../components/Card.jsx'
import Field from '../../components/Field.jsx'
import Table from '../../components/Table.jsx'
import {
  createShipment,
  getSales,
  getShipments,
  updateShipmentStatus,
} from '../../auth/mockApi.js'
import { formatDate } from '../../utils/format.js'
import { validatePhone } from '../../utils/validaciones.js'

const STATUS_OPTIONS = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'En camino', label: 'En camino' },
  { value: 'Entregado', label: 'Entregado' },
]

function Shipments() {
  const [shipments, setShipments] = useState([])
  const [sales, setSales] = useState([])
  const [saleId, setSaleId] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('Pendiente')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    const [shipmentsData, salesData] = await Promise.all([
      getShipments(),
      getSales(),
    ])
    setShipments(shipmentsData)
    setSales(salesData)
  }

  useEffect(() => {
    let active = true

    Promise.all([getShipments(), getSales()]).then(
      ([shipmentsData, salesData]) => {
        if (!active) {
          return
        }

        setShipments(shipmentsData)
        setSales(salesData)
      },
    )

    return () => {
      active = false
    }
  }, [])

  const availableSales = sales.filter(
    (sale) => !shipments.some((shipment) => shipment.saleId === sale.id),
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!saleId) {
      setError('Selecciona una venta existente.')
      return
    }

    if (!address.trim()) {
      setError('La dirección es obligatoria.')
      return
    }

    if (!city.trim()) {
      setError('La ciudad es obligatoria.')
      return
    }

    const phoneError = validatePhone(phone)

    if (phoneError) {
      setError(phoneError)
      return
    }

    setSaving(true)

    try {
      await createShipment({
        saleId,
        address: address.trim(),
        city: city.trim(),
        phone,
        status,
      })
      setSuccess('Pedido de envío registrado correctamente.')
      setSaleId('')
      setAddress('')
      setCity('')
      setPhone('')
      setStatus('Pendiente')
      await loadData()
    } catch (err) {
      setError(
        err.message === 'envio-existente'
          ? 'Esta venta ya tiene un pedido de envío registrado.'
          : 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
      )
    } finally {
      setSaving(false)
    }
  }

  const handleStatus = async (id, nextStatus) => {
    setError('')

    try {
      await updateShipmentStatus(id, nextStatus)
      setShipments((current) =>
        current.map((shipment) =>
          shipment.id === id ? { ...shipment, status: nextStatus } : shipment,
        ),
      )
    } catch {
      setError('Ocurrió un error inesperado. Inténtalo de nuevo más tarde.')
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-eyebrow">
        Administrador
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
        Pedidos de envío
      </h1>
      <p className="mt-2 text-sm text-muted">
        Asocia un envío a una venta y actualiza su estado de entrega.
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
          <h2 className="font-serif text-xl font-bold text-ink">Nuevo envío</h2>

          <form noValidate onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Field
              id="shipment-sale"
              label="Venta"
              as="select"
              value={saleId}
              onChange={(event) => setSaleId(event.target.value)}
              options={[
                { value: '', label: 'Selecciona una venta' },
                ...availableSales.map((sale) => ({
                  value: sale.id,
                  label: `#${sale.id} · ${sale.clientName}`,
                })),
              ]}
              hint={
                availableSales.length === 0
                  ? 'Todas las ventas ya tienen un envío registrado.'
                  : 'Solo se muestran ventas sin envío.'
              }
              required
            />

            <Field
              id="shipment-address"
              label="Dirección"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              hint="Calle, número y referencia."
              required
            />

            <Field
              id="shipment-city"
              label="Ciudad"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              hint="Ciudad de entrega."
              required
            />

            <Field
              id="shipment-phone"
              label="Teléfono"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              hint="9 dígitos, sin espacios."
              required
            />

            <Field
              id="shipment-status"
              label="Estado"
              as="select"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              options={STATUS_OPTIONS}
            />

            <Button
              type="submit"
              loading={saving}
              loadingText="Registrando envío…"
              className="w-full"
            >
              Registrar envío
            </Button>
          </form>
        </Card>

        <div className="min-w-0">
          <h2 className="font-serif text-xl font-bold text-ink">
            Envíos registrados
          </h2>
          <div className="mt-3">
            <Table
              head={[
                'Envío',
                'Venta',
                'Cliente',
                'Dirección',
                'Ciudad',
                'Teléfono',
                'Estado',
                'Fecha',
              ]}
            >
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="text-ink">
                  <td className="px-4 py-3 font-semibold">#{shipment.id}</td>
                  <td className="px-4 py-3">#{shipment.saleId}</td>
                  <td className="px-4 py-3">{shipment.clientName}</td>
                  <td className="px-4 py-3">{shipment.address}</td>
                  <td className="px-4 py-3">{shipment.city}</td>
                  <td className="px-4 py-3">{shipment.phone}</td>
                  <td className="px-4 py-3">
                    <select
                      value={shipment.status}
                      onChange={(event) =>
                        handleStatus(shipment.id, event.target.value)
                      }
                      aria-label={`Estado del envío ${shipment.id}`}
                      className="min-h-11 rounded-xl border-[1.5px] border-line bg-card px-3 text-sm font-semibold text-ink focus:outline-none focus:ring-4 focus:ring-surface"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">{formatDate(shipment.date)}</td>
                </tr>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shipments
