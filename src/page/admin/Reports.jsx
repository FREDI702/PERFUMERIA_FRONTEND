import { useState } from 'react'
import Card from '../../components/Card.jsx'
import Table from '../../components/Table.jsx'

const TABS = [
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'disponibilidad', label: 'Disponibilidad' },
  { id: 'compatibilidad', label: 'Compatibilidad' },
  { id: 'rendimiento', label: 'Rendimiento' },
]

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl font-bold text-ink">{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted">{detail}</p> : null}
    </div>
  )
}

function Security() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-ok bg-ok-bg px-4 py-3 text-sm font-semibold text-ok">
        La información de la tienda está protegida y cada rol accede solo a lo que le corresponde.
      </div>
      <Table head={['Módulo', 'Cliente', 'Administrador', 'Estado']}>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Catálogo</td>
          <td className="px-4 py-3">Permitido</td>
          <td className="px-4 py-3">Permitido</td>
          <td className="px-4 py-3 text-ok">Protegido</td>
        </tr>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Carrito y pedidos</td>
          <td className="px-4 py-3">Permitido</td>
          <td className="px-4 py-3">Denegado</td>
          <td className="px-4 py-3 text-ok">Protegido</td>
        </tr>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Perfumes, ventas y envíos</td>
          <td className="px-4 py-3">Denegado</td>
          <td className="px-4 py-3">Permitido</td>
          <td className="px-4 py-3 text-ok">Protegido</td>
        </tr>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Sesión inactiva</td>
          <td className="px-4 py-3">30 min</td>
          <td className="px-4 py-3">30 min</td>
          <td className="px-4 py-3 text-ok">Activo</td>
        </tr>
      </Table>
    </div>
  )
}

function Availability() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Estado" value="En línea" detail="Servicio disponible" />
        <Metric label="Tiempo activo" value="03:00" detail="Últimas 3 horas" />
        <Metric label="Último respaldo" value="03:00" detail="Respaldo automático" />
        <Metric label="Usuarios activos" value="25" detail="En este momento" />
      </div>
      <Table head={['Respaldo', 'Fecha', 'Estado', 'Tamaño']}>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Respaldo diario</td>
          <td className="px-4 py-3">05/11/2026 · 03:00</td>
          <td className="px-4 py-3 text-ok">Completado</td>
          <td className="px-4 py-3">120 MB</td>
        </tr>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Respaldo semanal</td>
          <td className="px-4 py-3">03/11/2026 · 03:00</td>
          <td className="px-4 py-3 text-ok">Completado</td>
          <td className="px-4 py-3">480 MB</td>
        </tr>
      </Table>
    </div>
  )
}

function Compatibility() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-warn bg-warn-bg px-4 py-3 text-sm font-semibold text-warn">
        Si tu navegador es demasiado antiguo, actualízalo a la última versión de Chrome, Edge, Firefox o Safari.
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Table head={['Navegador', 'Versión', 'Estado']}>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Chrome</td>
            <td className="px-4 py-3">Última</td>
            <td className="px-4 py-3 text-ok">Compatible</td>
          </tr>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Edge</td>
            <td className="px-4 py-3">Última</td>
            <td className="px-4 py-3 text-ok">Compatible</td>
          </tr>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Firefox</td>
            <td className="px-4 py-3">Última</td>
            <td className="px-4 py-3 text-ok">Compatible</td>
          </tr>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Safari</td>
            <td className="px-4 py-3">Última</td>
            <td className="px-4 py-3 text-ok">Compatible</td>
          </tr>
        </Table>

        <Table head={['Dispositivo', 'Resolución', 'Estado']}>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Celular</td>
            <td className="px-4 py-3">375 px</td>
            <td className="px-4 py-3 text-ok">Sin scroll horizontal</td>
          </tr>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Tablet</td>
            <td className="px-4 py-3">768 px</td>
            <td className="px-4 py-3 text-ok">Sin scroll horizontal</td>
          </tr>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Laptop</td>
            <td className="px-4 py-3">1100 px</td>
            <td className="px-4 py-3 text-ok">Sin scroll horizontal</td>
          </tr>
        </Table>
      </div>
    </div>
  )
}

function Performance() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Catálogo" value="1.8 s" detail="Carga con 50 usuarios" />
        <Metric label="Búsqueda" value="2.6 s" detail="Respuesta del filtro" />
        <Metric label="Carrito" value="2.5 s" detail="Confirmación de compra" />
        <Metric label="Disponibilidad" value="200 OK" detail="Última verificación" />
      </div>
      <Table head={['Acción', 'Tiempo', 'Objetivo']}>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Abrir catálogo</td>
          <td className="px-4 py-3">1.8 s</td>
          <td className="px-4 py-3 text-ok">≤ 3 s</td>
        </tr>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Filtrar perfumes</td>
          <td className="px-4 py-3">2.6 s</td>
          <td className="px-4 py-3 text-ok">≤ 3 s</td>
        </tr>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Registrar venta</td>
          <td className="px-4 py-3">2.5 s</td>
          <td className="px-4 py-3 text-ok">≤ 3 s</td>
        </tr>
      </Table>
    </div>
  )
}

function Reports() {
  const [active, setActive] = useState('seguridad')

  return (
    <div className="mx-auto w-full max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-eyebrow">
        Administrador
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
        Reportes de la tienda
      </h1>
      <p className="mt-2 text-sm text-muted">
        Revisa el estado de seguridad, disponibilidad, compatibilidad y rendimiento.
      </p>

      <div
        role="tablist"
        aria-label="Reportes"
        className="mt-6 flex flex-wrap gap-2"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition focus:outline-none focus:ring-4 ${
              active === tab.id
                ? 'border-primary bg-primary text-card focus:ring-line'
                : 'border-line bg-card text-ink hover:bg-surface focus:ring-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="mt-5 p-5 sm:p-6">
        {active === 'seguridad' ? <Security /> : null}
        {active === 'disponibilidad' ? <Availability /> : null}
        {active === 'compatibilidad' ? <Compatibility /> : null}
        {active === 'rendimiento' ? <Performance /> : null}
      </Card>
    </div>
  )
}

export default Reports
