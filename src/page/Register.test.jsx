import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Register from './Register.jsx'

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  )
}

describe('Register', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('muestra el error cuando las contraseñas no coinciden', async () => {
    vi.useFakeTimers()
    const { container } = renderRegister()

    fireEvent.change(screen.getByLabelText(/Nombre/), {
      target: { value: 'Ana García' },
    })
    fireEvent.change(screen.getByLabelText(/Correo electrónico/), {
      target: { value: 'ana@gmail.com' },
    })
    const passwordInputs = container.querySelectorAll('input[type="password"]')
    fireEvent.change(passwordInputs[0], {
      target: { value: 'Password1234' },
    })
    fireEvent.change(passwordInputs[1], {
      target: { value: 'Password4567' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(screen.getByText(/Las contraseñas no coinciden/)).toBeTruthy()
  })

  it('rechaza un correo ya registrado', async () => {
    vi.useFakeTimers()
    const { container } = renderRegister()

    const duplicateEmail = 'cliente.perfumeria@gmail.com'

    fireEvent.change(screen.getByLabelText(/Nombre/), {
      target: { value: 'Nuevo Cliente' },
    })
    fireEvent.change(screen.getByLabelText(/Correo electrónico/), {
      target: { value: duplicateEmail },
    })
    const passwordInputs = container.querySelectorAll('input[type="password"]')
    fireEvent.change(passwordInputs[0], {
      target: { value: 'Password1234' },
    })
    fireEvent.change(passwordInputs[1], {
      target: { value: 'Password1234' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(600)
    })

    expect(
      screen.getByText('Ya existe una cuenta con este correo electrónico.'),
    ).toBeTruthy()
  })

  it('crea la cuenta correctamente con los datos válidos', async () => {
    vi.useFakeTimers()
    const { container } = renderRegister()

    const uniqueEmail = `cliente${Date.now()}@gmail.com`

    fireEvent.change(screen.getByLabelText(/Nombre/), {
      target: { value: 'Carla López' },
    })
    fireEvent.change(screen.getByLabelText(/Correo electrónico/), {
      target: { value: uniqueEmail },
    })
    const passwordInputs = container.querySelectorAll('input[type="password"]')
    fireEvent.change(passwordInputs[0], {
      target: { value: 'Password1234' },
    })
    fireEvent.change(passwordInputs[1], {
      target: { value: 'Password1234' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(600)
    })

    expect(screen.getByText(/¡Cuenta creada con éxito!/)).toBeTruthy()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600)
    })
  })
})
