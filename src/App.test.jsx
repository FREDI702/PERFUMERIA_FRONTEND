import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App.jsx'
import { saveSession } from './auth/session.js'

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
})
