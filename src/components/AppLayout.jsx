import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { useIdleLogout } from '../auth/useIdleLogout.js'
import PageLoader from './PageLoader.jsx'
import Sidebar from './Sidebar.jsx'

function AppLayout() {
  useIdleLogout()

  return (
    <div className="min-h-screen bg-surface min-[900px]:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <p className="mb-4 rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink">
          Demostración: usa solo datos ficticios. El panel de administrador y los pedidos son simulados; no realices pagos.
        </p>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default AppLayout
