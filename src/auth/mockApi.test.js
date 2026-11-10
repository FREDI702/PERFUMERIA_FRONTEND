import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { saveSession } from './session.js'
import {
  createPerfume,
  createReception,
  createSale,
  createShipment,
  deletePerfume,
  getProducts,
  getReceptions,
  getSales,
  getSalesByClient,
  getShipments,
  register,
  updatePerfume,
  updateShipmentStatus,
} from './mockApi.js'

async function resolveWithTimers(promise) {
  await vi.runAllTimersAsync()
  return promise
}

async function rejectWithTimers(promise, message) {
  const assertion = expect(promise).rejects.toThrow(message)
  await vi.runAllTimersAsync()
  await assertion
}

describe('reglas de negocio del mock API', () => {
  beforeEach(() => {
    sessionStorage.clear()
    saveSession({
      email: 'admin@perfumerianectar.com',
      name: 'Administrador Néctar',
      role: 'Administrador',
      token: 'token-simulado',
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('valida operaciones y mantiene el inventario consistente', async () => {
    vi.useFakeTimers()

    const stockBefore = (await resolveWithTimers(getProducts())).find(
      (product) => product.id === 1,
    ).stock

    await rejectWithTimers(
      createSale({
        clientEmail: 'cliente.perfumeria@gmail.com',
        items: [
          { productId: 1, quantity: stockBefore },
          { productId: 1, quantity: 1 },
        ],
      }),
      'Stock insuficiente',
    )

    await rejectWithTimers(
      createSale({
        clientEmail: 'cliente.perfumeria@gmail.com',
        items: [{ productId: 1, quantity: 1.5 }],
      }),
      'cantidad',
    )

    expect(
      (await resolveWithTimers(getProducts())).find(
        (product) => product.id === 1,
      ).stock,
    ).toBe(stockBefore)

    await rejectWithTimers(
      createPerfume({
        name: 'Perfume inválido',
        brand: 'Néctar',
        category: 'Unisex',
        price: 99,
        stock: 1.5,
      }),
      'datos',
    )

    const newPerfume = await resolveWithTimers(
      createPerfume({
        id: 100,
        sold: 100,
        name: '  Esencia Nueva  ',
        brand: '  Néctar  ',
        category: 'Unisex',
        price: 99.9,
        stock: 0,
      }),
    )

    expect(newPerfume.id).not.toBe(100)
    expect(newPerfume.sold).toBe(0)
    expect(newPerfume.name).toBe('Esencia Nueva')

    const updatedPerfume = await resolveWithTimers(
      updatePerfume(newPerfume.id, {
        name: 'Esencia Actualizada',
        brand: 'Néctar',
        category: 'Mujer',
        price: 110,
        stock: 2,
      }),
    )

    expect(updatedPerfume.name).toBe('Esencia Actualizada')

    await rejectWithTimers(
      register({
        name: 'Cuenta inválida',
        email: 'usuario@mailinator.com',
        password: 'Password1234',
      }),
      'datos',
    )

    await rejectWithTimers(
      createShipment({
        saleId: 3,
        address: 'Dirección',
        city: 'Lima',
        phone: '123',
        status: 'Pendiente',
      }),
      'datos',
    )

    await rejectWithTimers(
      createReception({
        date: '2026-02-30',
        provider: 'Proveedor válido',
        items: [{ productId: 1, quantity: 1, condition: 'Bueno' }],
      }),
      'datos',
    )

    const sale = await resolveWithTimers(
      createSale({
        clientEmail: 'cliente.perfumeria@gmail.com',
        items: [
          { productId: 1, quantity: 1 },
          { productId: 1, quantity: 2 },
        ],
      }),
    )

    expect(sale.items).toHaveLength(1)
    expect(sale.items[0].quantity).toBe(3)

    const shipment = await resolveWithTimers(
      createShipment({
        saleId: sale.id,
        address: 'Av. Central 123',
        city: 'Lima',
        phone: '987654321',
        status: 'Pendiente',
      }),
    )

    await rejectWithTimers(updateShipmentStatus(shipment.id, 'Enviado'), 'estado')
    await resolveWithTimers(updateShipmentStatus(shipment.id, 'En camino'))

    expect(
      (await resolveWithTimers(getShipments())).find(
        (entry) => entry.id === shipment.id,
      ).status,
    ).toBe('En camino')

    const stockBeforeReception = (await resolveWithTimers(getProducts())).find(
      (product) => product.id === 1,
    ).stock
    const reception = await resolveWithTimers(
      createReception({
        date: new Date().toISOString().slice(0, 10),
        provider: 'Proveedor de prueba',
        items: [
          { productId: 1, quantity: 1, condition: 'Bueno' },
          { productId: 1, quantity: 2, condition: 'Bueno' },
        ],
      }),
    )
    const stockAfterReception = (await resolveWithTimers(getProducts())).find(
      (product) => product.id === 1,
    ).stock

    expect(reception.items).toHaveLength(1)
    expect(reception.items[0].quantity).toBe(3)
    expect(stockAfterReception).toBe(stockBeforeReception + 3)
    expect(
      (await resolveWithTimers(getReceptions())).some(
        (entry) => entry.id === reception.id,
      ),
    ).toBe(true)

    await rejectWithTimers(deletePerfume(1), 'ventas')

    saveSession({
      email: 'maria.torres@gmail.com',
      name: 'María Torres',
      role: 'Cliente',
      token: 'token-simulado',
    })

    await rejectWithTimers(
      createPerfume({
        name: 'Acceso no autorizado',
        brand: 'Néctar',
        category: 'Unisex',
        price: 99,
        stock: 1,
      }),
      'acceso',
    )
    await rejectWithTimers(getSales(), 'acceso')
    await rejectWithTimers(
      getSalesByClient('cliente.perfumeria@gmail.com'),
      'acceso',
    )
    expect(await resolveWithTimers(getSalesByClient('maria.torres@gmail.com'))).toHaveLength(1)
    expect(await resolveWithTimers(getShipments())).toHaveLength(0)
  })
})
