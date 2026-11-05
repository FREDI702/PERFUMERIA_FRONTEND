import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card.jsx'
import Table from '../components/Table.jsx'
import { getSession } from '../auth/session.js'
import { getSalesByClient, getShipments } from '../auth/mockApi.js'
import { formatCurrency, formatDate } from '../utils/format.js'
import { buttonClasses } from '../utils/ui.js'

const STATUS_STYLES = {
  Pendiente: 'bg-warn-bg text-warn',
  'En camino': 'bg-surface text-ink',
  Entregado: 'bg-ok-bg text-ok',
}

function Orders() {
  const session = getSession()
  const [sales, setSales] = useState([])
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    let active = true

    Promise.all([getSalesByClient(session?.email ?? ''), getShipments()]).then(
      ([salesData, shipmentsData]) => {
        if (active) {
          setSales(salesData)
          setShipments(shipmentsData)
          setLoading(false)
        }
      },
    )

    return () => {
      active = false
    }
  }, [session?.email])

  const getStatus = (saleId) => {
    const shipment = shipments.find((entry) => entry.saleId === saleId)
    return shipment?.status ?? 'Pendiente'
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-eyebrow">
        Cliente
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
        Mis pedidos
      </h1>
      <p className="mt-2 text-sm text-muted">
        Consulta el estado de tus compras y el detalle de cada pedido.
      </p>

      {loading ? (
        <div className="mt-6 h-40 animate-pulse rounded-3xl border border-line bg-card" />
      ) : sales.length === 0 ? (
        <Card className="mt-6 text-center">
          <p className="font-serif text-2xl font-bold text-ink">
            Todavía no tienes pedidos
          </p>
          <p className="mt-2 text-sm text-muted">
            Cuando confirmes una compra aparecerá aquí.
          </p>
          <Link
            to="/tienda"
            className={buttonClasses({ className: 'mt-6 w-full max-w-xs' })}
          >
            Ir al catálogo
          </Link>
        </Card>
      ) : (
        <div className="mt-6">
          <Table
            head={[
              'Pedido',
              'Fecha',
              'Productos',
              'Total',
              'Estado',
              'Acciones',
            ]}
          >
            {sales.map((sale) => {
              const status = getStatus(sale.id)
              const quantity = sale.items.reduce(
                (sum, item) => sum + item.quantity,
                0,
              )

              return (
                <Fragment key={sale.id}>
                  <tr className="text-ink">
                    <td className="px-4 py-3 font-semibold">#{sale.id}</td>
                    <td className="px-4 py-3">{formatDate(sale.date)}</td>
                    <td className="px-4 py-3">{quantity}</td>
                    <td className="px-4 py-3 font-semibold">
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] ?? 'bg-surface text-ink'}`}
                      >
                        {status}
                      </span>
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
                      <td colSpan={6} className="px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                          Detalle del pedido #{sale.id}
                        </p>
                        <ul className="mt-2 space-y-2 text-sm text-ink">
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
              )
            })}
          </Table>
        </div>
      )}
    </div>
  )
}

export default Orders
