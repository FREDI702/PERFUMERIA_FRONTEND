import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Cart from './Cart.jsx'
import { addToCart, clearCart } from '../cart/cartStore.js'
import { saveSession } from '../auth/session.js'
import { createSale } from '../auth/mockApi.js'
import { resolveCurrentLocation } from '../utils/location.js'

vi.mock('../auth/mockApi.js', () => ({ createSale: vi.fn() }))
vi.mock('../utils/location.js', () => ({ resolveCurrentLocation: vi.fn() }))

function choose(label, value) {
  fireEvent.change(screen.getByLabelText(new RegExp(label)), { target: { value } })
}

describe('datos y métodos de pago del carrito', () => {
  beforeEach(() => {
    saveSession({ email: 'cliente.perfumeria@gmail.com', name: 'Cliente', role: 'Cliente', token: 'mock' })
    addToCart({ id: 1, name: 'Perfume', brand: 'Néctar', price: 100, stock: 5 })
    render(<MemoryRouter><Cart /></MemoryRouter>)
  })

  afterEach(() => {
    clearCart()
    sessionStorage.clear()
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('muestra errores y alterna datos de entrega y comprobante', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Registrar pedido simulado' }))
    expect(screen.getByText('✕ Ingresa los nombres.')).toBeTruthy()
    expect(createSale).not.toHaveBeenCalled()
    choose('Modalidad de entrega', 'delivery')
    expect(screen.getByLabelText(/Dirección/)).toBeTruthy()
    expect(screen.getByLabelText(/Departamento/)).toBeTruthy()
    expect(screen.getByLabelText(/Provincia/).disabled).toBe(true)
    expect(screen.getByLabelText(/Distrito/).disabled).toBe(true)
    choose('Departamento', 'UCAYALI')
    choose('Provincia', 'CORONEL PORTILLO')
    choose('Distrito', 'CALLERIA')
    expect(screen.getByLabelText(/Distrito/).value).toBe('CALLERIA')
    choose('Departamento', 'LIMA')
    expect(screen.getByLabelText(/Provincia/).value).toBe('')
    expect(screen.getByLabelText(/Distrito/).disabled).toBe(true)
    choose('Comprobante', 'factura')
    expect(screen.getByLabelText(/RUC/)).toBeTruthy()
    expect(screen.getByLabelText(/Razón social/)).toBeTruthy()
    expect(screen.queryByLabelText(/DNI/)).toBeNull()
    choose('Modalidad de entrega', 'recojo')
    expect(screen.queryByLabelText(/Dirección/)).toBeNull()
    choose('Comprobante', 'boleta')
    expect(screen.getByLabelText(/DNI/)).toBeTruthy()
    expect(screen.queryByLabelText(/RUC/)).toBeNull()
  })

  it('advierte que Yape es simulado y no pide datos de tarjeta', () => {
    choose('Método de pago', 'yape')
    expect(screen.getByText('Yape simulado')).toBeTruthy()
    expect(screen.queryByRole('img', { name: 'Código QR de Yape' })).toBeNull()
    expect(screen.getByText(/no realices transferencias/)).toBeTruthy()
    choose('Método de pago', 'tarjeta')
    expect(screen.getByText(/no se solicitan datos de tarjeta/)).toBeTruthy()
    expect(screen.queryByLabelText(/CVV|número de tarjeta/i)).toBeNull()
  })

  it('sugiere ubicación sin sobrescribir los datos ingresados', async () => {
    resolveCurrentLocation.mockResolvedValue({
      department: 'Ucayali', province: 'Provincia de Coronel Portillo', district: 'Callería', address: 'Jirón Lima 123',
    })

    choose('Modalidad de entrega', 'delivery')
    choose('Dirección', 'Mi dirección')
    fireEvent.click(screen.getByRole('button', { name: 'Usar mi ubicación actual' }))
    expect(await screen.findByText(/Ubicación aproximada obtenida/)).toBeTruthy()
    expect(screen.getByLabelText(/Departamento/).value).toBe('UCAYALI')
    expect(screen.getByLabelText(/Provincia/).value).toBe('CORONEL PORTILLO')
    expect(screen.getByLabelText(/Distrito/).value).toBe('CALLERIA')
    expect(screen.getByLabelText(/Dirección/).value).toBe('Mi dirección')
  })

  it('no mezcla la ubicación detectada con otro departamento seleccionado', async () => {
    resolveCurrentLocation.mockResolvedValue({
      department: 'Ucayali', province: 'Coronel Portillo', district: 'Callería', address: 'Jirón Lima 123',
    })
    choose('Modalidad de entrega', 'delivery')
    choose('Departamento', 'LIMA')
    fireEvent.click(screen.getByRole('button', { name: 'Usar mi ubicación actual' }))
    await screen.findByText(/Ubicación aproximada obtenida/)
    expect(screen.getByLabelText(/Departamento/).value).toBe('LIMA')
    expect(screen.getByLabelText(/Provincia/).value).toBe('')
    expect(screen.getByLabelText(/Distrito/).value).toBe('')
    expect(screen.getByLabelText(/Dirección/).value).toBe('')
  })

  it('informa si se deniega la ubicación y permite escribir los datos', async () => {
    resolveCurrentLocation.mockRejectedValue({ code: 1 })
    choose('Modalidad de entrega', 'delivery')
    fireEvent.click(screen.getByRole('button', { name: 'Usar mi ubicación actual' }))
    expect(await screen.findByText(/No se concedió acceso/)).toBeTruthy()
    choose('Departamento', 'UCAYALI')
    expect(screen.getByLabelText(/Departamento/).value).toBe('UCAYALI')
  })

  it('registra el pedido completo como pago pendiente', async () => {
    createSale.mockResolvedValue({ id: 99 })
    choose('Nombres', 'Ana')
    choose('Apellidos', 'García')
    choose('Teléfono', '987654321')
    choose('Modalidad de entrega', 'recojo')
    choose('Método de pago', 'efectivo')
    expect(screen.getByText(/Pago en efectivo simulado/)).toBeTruthy()
    choose('Comprobante', 'boleta')
    choose('DNI', '12345678')
    fireEvent.click(screen.getByRole('button', { name: 'Registrar pedido simulado' }))
    await waitFor(() => expect(createSale).toHaveBeenCalledOnce())
    expect(createSale.mock.calls[0][0].checkout).toMatchObject({
      firstName: 'Ana', lastName: 'García', delivery: 'recojo', payment: 'efectivo', dni: '12345678',
    })
    expect(await screen.findByText(/Pago pendiente de confirmación/)).toBeTruthy()
  })

  it('envía la ciudad y el distrito de entrega', async () => {
    createSale.mockResolvedValue({ id: 100 })
    choose('Nombres', 'Ana')
    choose('Apellidos', 'García')
    choose('Teléfono', '987654321')
    choose('Modalidad de entrega', 'delivery')
    choose('Departamento', 'LA LIBERTAD')
    choose('Provincia', 'TRUJILLO')
    choose('Distrito', 'VICTOR LARCO HERRERA')
    choose('Dirección', 'Av. Central')
    choose('Referencia', 'Casa azul')
    choose('Método de pago', 'efectivo')
    choose('Comprobante', 'boleta')
    choose('DNI', '12345678')
    fireEvent.click(screen.getByRole('button', { name: 'Registrar pedido simulado' }))
    await waitFor(() => expect(createSale).toHaveBeenCalledOnce())
    expect(createSale.mock.calls[0][0].checkout).toMatchObject({
      department: 'LA LIBERTAD', province: 'TRUJILLO', district: 'VICTOR LARCO HERRERA',
    })
  })
})
