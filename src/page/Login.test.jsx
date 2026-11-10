import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Login from './Login.jsx'

function renderLogin() {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  )
}

function fillCredentials(email, password) {
  fireEvent.change(screen.getByLabelText(/Correo electrónico/), {
    target: { value: email },
  })
  fireEvent.change(screen.getByLabelText(/Contraseña/), {
    target: { value: password },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
}

describe('Login', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('muestra los errores al enviar el formulario vacío', () => {
    renderLogin()

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByText(/El correo electrónico es obligatorio/)).toBeTruthy()
    expect(screen.getByText(/La contraseña es obligatoria/)).toBeTruthy()
  })

  it('permite mostrar y ocultar la contraseña', () => {
    renderLogin()

    const passwordInput = screen.getByLabelText(/Contraseña/)
    expect(passwordInput.type).toBe('password')

    fireEvent.click(screen.getByRole('button', { name: 'Mostrar' }))
    expect(passwordInput.type).toBe('text')

    fireEvent.click(screen.getByRole('button', { name: 'Ocultar' }))
    expect(passwordInput.type).toBe('password')
  })

  it('muestra un mensaje de error con credenciales incorrectas', async () => {
    vi.useFakeTimers()
    renderLogin()

    fillCredentials('cliente.perfumeria@gmail.com', 'ClaveIncorrecta1')

    const submitButton = screen.getByRole('button', {
      name: 'Validando credenciales…',
    })
    expect(submitButton.disabled).toBe(true)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(screen.getByText(/Correo o contraseña incorrectos/)).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Iniciar sesión' }).disabled,
    ).toBe(false)
  })

  it('muestra la bienvenida con credenciales válidas', async () => {
    vi.useFakeTimers()
    renderLogin()

    fillCredentials('cliente.perfumeria@gmail.com', 'Perfume2026!')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(screen.getByText('¡Bienvenido a Perfumería Néctar!')).toBeTruthy()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500)
    })
  })
})
