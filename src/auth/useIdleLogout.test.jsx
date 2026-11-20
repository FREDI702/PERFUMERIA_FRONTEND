import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { addToCart, clearCart, getCartSnapshot } from '../cart/cartStore.js'
import { clearSession, getSession, saveSession } from './session.js'
import { useIdleLogout } from './useIdleLogout.js'

function Location() {
  const location = useLocation()
  return <p>{location.pathname}</p>
}

function ProtectedPage() {
  useIdleLogout()

  return (
    <>
      <Location />
      <button type="button">Contenido privado</button>
    </>
  )
}

function renderProtectedPage() {
  return render(
    <MemoryRouter initialEntries={['/cuenta']}>
      <Routes>
        <Route path="/cuenta" element={<ProtectedPage />} />
        <Route
          path="/sesion-expirada"
          element={
            <>
              <Location />
              <p>Tu sesión expiró</p>
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Location />
              <p>Inicia sesión para continuar.</p>
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('cierre por inactividad', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-10T12:00:00.000Z'))
    sessionStorage.clear()
    clearCart()
    saveSession({
      email: 'cliente@gmail.com',
      name: 'Cliente',
      role: 'Cliente',
      token: 'token-simulado',
    })
  })

  afterEach(() => {
    clearCart()
    vi.useRealTimers()
  })

  it('cierra la sesión al superar 30 minutos sin actividad', async () => {
    addToCart({
      id: 1,
      name: 'Perfume de prueba',
      brand: 'Néctar',
      presentation: '100 ml',
      price: 189.9,
      stock: 5,
    })
    renderProtectedPage()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30 * 60 * 1000)
    })

    expect(screen.getByText('/sesion-expirada')).toBeTruthy()
    expect(screen.getByText('Tu sesión expiró')).toBeTruthy()
    expect(getSession()).toBeNull()
    expect(getCartSnapshot()).toHaveLength(0)
  })

  it('no renueva una sesión vencida al recibir una interacción tardía', () => {
    renderProtectedPage()
    vi.setSystemTime(new Date('2026-11-10T12:31:00.000Z'))

    fireEvent.click(window)

    expect(screen.getByText('/sesion-expirada')).toBeTruthy()
    expect(getSession()).toBeNull()
  })

  it('envía al inicio de sesión si se vuelve atrás tras cerrar sesión', () => {
    renderProtectedPage()
    clearSession()

    fireEvent(window, new Event('pageshow'))

    expect(screen.getByText('/login')).toBeTruthy()
    expect(screen.getByText('Inicia sesión para continuar.')).toBeTruthy()
  })
})
