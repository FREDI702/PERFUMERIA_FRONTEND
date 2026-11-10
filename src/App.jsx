import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import AccessDenied from './page/AccessDenied.jsx'
import Login from './page/Login.jsx'
import Register from './page/Register.jsx'
import SessionExpired from './page/SessionExpired.jsx'
import Welcome from './page/Welcome.jsx'
import { getSession, isAuthenticated } from './auth/session.js'

const Account = lazy(() => import('./page/Account.jsx'))
const Cart = lazy(() => import('./page/Cart.jsx'))
const Catalog = lazy(() => import('./page/Catalog.jsx'))
const Orders = lazy(() => import('./page/Orders.jsx'))
const Perfumes = lazy(() => import('./page/admin/Perfumes.jsx'))
const Receptions = lazy(() => import('./page/admin/Receptions.jsx'))
const Reports = lazy(() => import('./page/admin/Reports.jsx'))
const Sales = lazy(() => import('./page/admin/Sales.jsx'))
const Shipments = lazy(() => import('./page/admin/Shipments.jsx'))

function roleHome(session) {
  return session?.role === 'Administrador' ? '/admin/perfumes' : '/tienda'
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: 'Inicia sesión para continuar.' }}
      />
    )
  }

  return children
}

function PublicOnlyRoute({ children }) {
  const session = getSession()

  if (session) {
    return <Navigate to={roleHome(session)} replace />
  }

  return children
}

function RoleRoute({ role, children }) {
  const session = getSession()

  if (!session || session.role !== role) {
    return <AccessDenied />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <Welcome />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/registro"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/sesion-expirada"
        element={
          <PublicOnlyRoute>
            <SessionExpired />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/tienda" element={<Catalog />} />
        <Route path="/cuenta" element={<Account />} />
        <Route
          path="/carrito"
          element={
            <RoleRoute role="Cliente">
              <Cart />
            </RoleRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <RoleRoute role="Cliente">
              <Orders />
            </RoleRoute>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/perfumes" replace />} />
        <Route
          path="/admin/perfumes"
          element={
            <RoleRoute role="Administrador">
              <Perfumes />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/ventas"
          element={
            <RoleRoute role="Administrador">
              <Sales />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/envios"
          element={
            <RoleRoute role="Administrador">
              <Shipments />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/recepcion"
          element={
            <RoleRoute role="Administrador">
              <Receptions />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/reportes"
          element={
            <RoleRoute role="Administrador">
              <Reports />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
