import { Outlet } from 'react-router-dom'
import { useIdleLogout } from '../auth/useIdleLogout.js'
import Sidebar from './Sidebar.jsx'

function AppLayout() {
  useIdleLogout()

  return (
    <div className="min-h-screen bg-surface min-[900px]:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
