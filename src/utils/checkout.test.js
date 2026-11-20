import { describe, expect, it } from 'vitest'
import { normalizeCheckout, validateCheckout } from './checkout.js'

describe('datos del pedido', () => {
  const delivery = {
    firstName: 'Ana', lastName: 'Pérez', phone: '987654321', delivery: 'delivery',
    address: 'Av. Central', department: 'UCAYALI', province: 'CORONEL PORTILLO', district: 'CALLERIA', reference: 'Casa azul',
    payment: 'efectivo', receipt: 'factura', ruc: '12345678901', businessName: 'Perfumería',
  }

  it('valida entrega, factura y rechaza datos inválidos', () => {
    expect(validateCheckout(delivery)).toEqual({})
    expect(validateCheckout({ ...delivery, reference: '', ruc: '123', phone: '1' })).toMatchObject({
      reference: 'Ingresa una referencia.',
      ruc: 'El RUC debe tener 11 dígitos.',
      phone: 'El teléfono debe tener 9 dígitos.',
    })
    expect(validateCheckout({ ...delivery, province: 'LIMA' }).province).toBe('Selecciona la provincia.')
    expect(validateCheckout({ ...delivery, district: 'MIRAFLORES' }).district).toBe('Selecciona el distrito.')
    expect(validateCheckout({ ...delivery, department: ' ' }).department).toBe('Selecciona el departamento.')
    expect(normalizeCheckout(delivery).province).toBe('CORONEL PORTILLO')
  })

  it('conserva únicamente los datos aplicables a la selección', () => {
    const data = normalizeCheckout({ ...delivery, delivery: 'recojo', receipt: 'boleta', dni: '12345678' })
    expect(data).not.toHaveProperty('address')
    expect(data).not.toHaveProperty('city')
    expect(data).not.toHaveProperty('department')
    expect(data).not.toHaveProperty('ruc')
    expect(data).not.toHaveProperty('businessName')
    expect(data.dni).toBe('12345678')
  })
})
