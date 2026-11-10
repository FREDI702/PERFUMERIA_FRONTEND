import { useState } from 'react'
import Card from '../../components/Card.jsx'
import Table from '../../components/Table.jsx'

const TABS = [
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'disponibilidad', label: 'Disponibilidad' },
  { id: 'compatibilidad', label: 'Compatibilidad' },
  { id: 'rendimiento', label: 'Rendimiento' },
]

function Security() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-warn bg-warn-bg px-4 py-3 text-sm font-semibold text-warn">
        La autenticación de esta versión es simulada en el frontend. Para proteger datos reales se requiere validar cada permiso en un backend.
      </div>
      <Table head={['Módulo', 'Cliente', 'Administrador', 'Estado']}>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Catálogo</td>
          <td className="px-4 py-3">Permitido</td>
          <td className="px-4 py-3">Permitido</td>
          <td className="px-4 py-3">Ruta disponible</td>
        </tr>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Carrito y pedidos</td>
          <td className="px-4 py-3">Permitido</td>
          <td className="px-4 py-3">Denegado</td>
          <td className="px-4 py-3">Restricción de interfaz</td>
        </tr>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Perfumes, ventas y envíos</td>
          <td className="px-4 py-3">Denegado</td>
          <td className="px-4 py-3">Permitido</td>
          <td className="px-4 py-3">Restricción de interfaz</td>
        </tr>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Sesión inactiva</td>
          <td className="px-4 py-3">30 min</td>
          <td className="px-4 py-3">30 min</td>
          <td className="px-4 py-3">Control en el navegador</td>
        </tr>
      </Table>
    </div>
  )
}

function Availability() {
  return (
    <div className="rounded-2xl border border-warn bg-warn-bg px-4 py-4 text-sm text-warn">
      <h2 className="font-semibold">Infraestructura no conectada</h2>
      <p className="mt-2">
        Esta versión usa datos simulados en el navegador. El estado del servidor,
        el tiempo activo, los usuarios concurrentes y los respaldos no están
        disponibles para medir desde el frontend.
      </p>
    </div>
  )
}

function Compatibility() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-warn bg-warn-bg px-4 py-3 text-sm font-semibold text-warn">
        Estos son objetivos de compatibilidad; no se han ejecutado pruebas manuales en todos los navegadores y dispositivos.
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Table head={['Navegador', 'Versión', 'Estado']}>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Chrome</td>
            <td className="px-4 py-3">Actual</td>
            <td className="px-4 py-3">Pendiente de prueba manual</td>
          </tr>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Edge</td>
            <td className="px-4 py-3">Actual</td>
            <td className="px-4 py-3">Pendiente de prueba manual</td>
          </tr>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Firefox</td>
            <td className="px-4 py-3">Actual</td>
            <td className="px-4 py-3">Pendiente de prueba manual</td>
          </tr>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Safari</td>
            <td className="px-4 py-3">Actual</td>
            <td className="px-4 py-3">Pendiente de prueba manual</td>
          </tr>
        </Table>

        <Table head={['Dispositivo', 'Resolución', 'Estado']}>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Celular</td>
            <td className="px-4 py-3">375 px</td>
            <td className="px-4 py-3">Pendiente de prueba manual</td>
          </tr>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Tablet</td>
            <td className="px-4 py-3">768 px</td>
            <td className="px-4 py-3">Pendiente de prueba manual</td>
          </tr>
          <tr className="text-ink">
            <td className="px-4 py-3 font-semibold">Laptop</td>
            <td className="px-4 py-3">1100 px</td>
            <td className="px-4 py-3">Pendiente de prueba manual</td>
          </tr>
        </Table>
      </div>
    </div>
  )
}

function Performance() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-warn bg-warn-bg px-4 py-4 text-sm text-warn">
        <h2 className="font-semibold">Rendimiento aún no medido</h2>
        <p className="mt-2">
          Los tiempos requieren una prueba de carga con infraestructura y datos
          representativos. No se muestran mediciones simuladas como resultados.
        </p>
      </div>
      <Table head={['Acción', 'Objetivo de la historia', 'Estado']}>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Abrir catálogo</td>
          <td className="px-4 py-3">≤ 3 s</td>
          <td className="px-4 py-3">Pendiente de medición</td>
        </tr>
        <tr className="text-ink">
          <td className="px-4 py-3 font-semibold">Catálogo con 50 usuarios</td>
          <td className="px-4 py-3">≤ 3 s</td>
          <td className="px-4 py-3">Pendiente de prueba de carga</td>
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
