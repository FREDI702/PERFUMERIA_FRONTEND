import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { webcrypto } from 'node:crypto'
import { saveSession } from './session.js'
import {
  createPerfume,
  createReception,
  createSale,
  createShipment,
  confirmSalePayment,
  deletePerfume,
  getProducts,
  getReceptions,
  getSales,
  getSalesByClient,
  getShipments,
  login,
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
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('deriva la contraseña de una cuenta de prueba y permite iniciar sesión', async () => {
    vi.stubGlobal('crypto', webcrypto)
    const deriveBits = vi.spyOn(webcrypto.subtle, 'deriveBits')
    const email = 'cuenta-prueba-seguridad@gmail.com'
    const password = 'PruebaSegura123'

    await register({ name: 'Usuario de prueba', email, password })
    expect(deriveBits).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'PBKDF2', hash: 'SHA-256', iterations: 210000 }),
      expect.anything(),
      256,
    )
    expect((await login({ email, password })).email).toBe(email)
    await expect(login({ email, password: 'ContraseñaIncorrecta123' })).rejects.toThrow('credenciales')
  })

  it('registra pedidos pendientes y solo permite al administrador confirmar el pago', async () => {
    vi.useFakeTimers()
    saveSession({ email: 'cliente.perfumeria@gmail.com', name: 'Cliente', role: 'Cliente', token: 'mock' })
    const checkout = {
      firstName: 'Ana', lastName: 'Pérez', phone: '987654321', delivery: 'recojo',
      payment: 'yape', receipt: 'boleta', dni: '12345678',
      address: 'no guardar', ruc: '12345678901',
    }
    await rejectWithTimers(createSale({ clientEmail: 'cliente.perfumeria@gmail.com', items: [{ productId: 1, quantity: 1 }] }), 'datos')
    const sale = await resolveWithTimers(createSale({
      clientEmail: 'cliente.perfumeria@gmail.com', items: [{ productId: 1, quantity: 1 }], checkout,
    }))
    expect(sale.paymentStatus).toBe('Pendiente de pago')
    expect(sale.checkout.address).toBeUndefined()
    expect(sale.checkout.ruc).toBeUndefined()
    await rejectWithTimers(confirmSalePayment(sale.id), 'acceso')
    saveSession({ email: 'admin@perfumerianectar.com', name: 'Administrador', role: 'Administrador', token: 'mock' })
    await rejectWithTimers(createShipment({
      saleId: sale.id, address: 'Dirección', city: 'Lima', phone: '987654321', status: 'Pendiente',
    }), 'recojo')
    expect((await resolveWithTimers(confirmSalePayment(sale.id))).paymentStatus).toBe('Pago confirmado')
    await rejectWithTimers(confirmSalePayment(sale.id), 'pago')
  })

  it('guarda la ciudad elegida para entregas a domicilio', async () => {
    vi.useFakeTimers()
    saveSession({ email: 'cliente.perfumeria@gmail.com', name: 'Cliente', role: 'Cliente', token: 'mock' })
    const checkout = {
      firstName: 'Ana', lastName: 'Pérez', phone: '987654321', delivery: 'delivery',
      province: 'TRUJILLO', district: 'VICTOR LARCO HERRERA', department: 'LA LIBERTAD',
      address: 'Av. Central', reference: 'Casa azul',
      payment: 'efectivo', receipt: 'boleta', dni: '12345678',
    }
    await rejectWithTimers(createSale({
      clientEmail: 'cliente.perfumeria@gmail.com', items: [{ productId: 1, quantity: 1 }],
      checkout: { ...checkout, province: 'LIMA' },
    }), 'datos')
    const sale = await resolveWithTimers(createSale({
      clientEmail: 'cliente.perfumeria@gmail.com', items: [{ productId: 1, quantity: 1 }], checkout,
    }))
    expect(sale.checkout.province).toBe('TRUJILLO')
    expect(sale.checkout.district).toBe('VICTOR LARCO HERRERA')
    expect(sale.checkout.department).toBe('LA LIBERTAD')
    expect((await resolveWithTimers(getSalesByClient('cliente.perfumeria@gmail.com')))
      .find((entry) => entry.id === sale.id).checkout.province).toBe('TRUJILLO')
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
        presentation: ' 100 ml ',
        price: 99.9,
        stock: 0,
      }),
    )

    expect(newPerfume.id).not.toBe(100)
    expect(newPerfume.sold).toBe(0)
    expect(newPerfume.name).toBe('Esencia Nueva')
    expect(newPerfume.presentation).toBe('100 ml')

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
    expect(updatedPerfume.presentation).toBe('100 ml')

    const updatedPresentation = await resolveWithTimers(
      updatePerfume(newPerfume.id, {
        name: 'Esencia Actualizada',
        brand: 'Néctar',
        category: 'Mujer',
        presentation: '75 ml',
        price: 110,
        stock: 2,
      }),
    )

    expect(updatedPresentation.presentation).toBe('75 ml')

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
