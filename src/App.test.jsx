import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App.jsx'
import { saveSession } from './auth/session.js'
import { addToCart, clearCart, getCartSnapshot } from './cart/cartStore.js'

function renderApp(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('rutas protegidas por sesión y rol', () => {
  afterEach(() => {
    sessionStorage.clear()
    clearCart()
  })

  it('redirige al inicio de sesión e informa si no hay sesión', async () => {
    renderApp('/carrito')

    expect(
      await screen.findByText('Inicia sesión para continuar.'),
    ).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Hola de nuevo' })).toBeTruthy()
  })

  it('deniega las rutas administrativas a un cliente', async () => {
    saveSession({
      email: 'cliente@gmail.com',
      name: 'Cliente',
      role: 'Cliente',
      token: 'token-simulado',
    })

    renderApp('/admin/perfumes')

    expect(
      await screen.findByRole('heading', { name: 'Acceso denegado' }),
    ).toBeTruthy()
  })

  it('vuelve a la bienvenida al confirmar el cierre de sesión', async () => {
    saveSession({
      email: 'cliente@gmail.com',
      name: 'Cliente',
      role: 'Cliente',
      token: 'token-simulado',
    })
    addToCart({
      id: 1,
      name: 'Perfume de prueba',
      brand: 'Néctar',
      presentation: '100 ml',
      price: 189.9,
      stock: 5,
    })

    renderApp('/cuenta')

    fireEvent.click(await screen.findByRole('button', { name: 'Cerrar sesión' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Sí, cerrar sesión' }),
    )

    expect(
      await screen.findByRole('link', { name: 'Iniciar sesión' }),
    ).toBeTruthy()
    expect(getCartSnapshot()).toHaveLength(0)
  })
})
