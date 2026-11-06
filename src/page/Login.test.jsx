import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Login from './Login.jsx'

function renderLogin() {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  )
}

describe('Login', () => {
  it('muestra los errores al enviar el formulario vacío', () => {
    renderLogin()

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByText(/El correo electrónico es obligatorio/)).toBeTruthy()
    expect(screen.getByText(/La contraseña es obligatoria/)).toBeTruthy()
  })

  it('muestra un mensaje de error con credenciales incorrectas', async () => {
    renderLogin()

    fireEvent.change(screen.getByLabelText(/Correo electrónico/), {
      target: { value: 'cliente.perfumeria@gmail.com' },
    })
    fireEvent.change(screen.getByLabelText(/Contraseña/), {
      target: { value: 'ClaveIncorrecta1' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByText(/Correo o contraseña incorrectos/)).toBeTruthy()
  })

  it('muestra la bienvenida con credenciales válidas', async () => {
    renderLogin()

    fireEvent.change(screen.getByLabelText(/Correo electrónico/), {
      target: { value: 'cliente.perfumeria@gmail.com' },
    })
    fireEvent.change(screen.getByLabelText(/Contraseña/), {
      target: { value: 'Perfume2026!' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByText('¡Bienvenido a Perfumería Néctar!')).toBeTruthy()

    await act(async () => {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 900)
      })
    })
  })
})
