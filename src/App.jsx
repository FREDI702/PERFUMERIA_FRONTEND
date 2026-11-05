import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import Account from './page/Account.jsx'
import AccessDenied from './page/AccessDenied.jsx'
import Cart from './page/Cart.jsx'
import Catalog from './page/Catalog.jsx'
import Login from './page/Login.jsx'
import Orders from './page/Orders.jsx'
import Register from './page/Register.jsx'
import SessionExpired from './page/SessionExpired.jsx'
import Welcome from './page/Welcome.jsx'
import Perfumes from './page/admin/Perfumes.jsx'
import Receptions from './page/admin/Receptions.jsx'
import Reports from './page/admin/Reports.jsx'
import Sales from './page/admin/Sales.jsx'
import Shipments from './page/admin/Shipments.jsx'
import { getSession, isAuthenticated } from './auth/session.js'

function roleHome(session) {
  return session?.role === 'Administrador' ? '/admin/perfumes' : '/tienda'
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
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
