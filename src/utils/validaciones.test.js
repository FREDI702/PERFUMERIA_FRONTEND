import { describe, expect, it } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validatePrice,
  validateQuantity,
  validateStock,
} from './validaciones.js'

describe('validateEmail', () => {
  it('rechaza correo sin dominio', () => {
    expect(validateEmail('ana@correo')).toBe(
      'Ingresa un correo válido, por ejemplo nombre@dominio.com.',
    )
  })

  it('rechaza un dominio temporal', () => {
    expect(validateEmail('ana@mailinator.com')).toBe(
      'No se permiten correos temporales, falsos o desechables.',
    )
  })

  it('rechaza un TLD no confiable', () => {
    expect(validateEmail('ana@correo.xyz')).toBe(
      'El dominio del correo no es confiable.',
    )
  })

  it('acepta correo válido con espacios y mayúsculas', () => {
    expect(validateEmail(' Ana@Correo.COM ')).toBe('')
  })
})

describe('validatePassword', () => {
  it('rechaza una contraseña vacía', () => {
    expect(validatePassword('')).toBe('La contraseña es obligatoria.')
  })

  it('rechaza clave de 11 caracteres', () => {
    expect(validatePassword('a'.repeat(11))).toBe(
      'La contraseña debe tener 12 caracteres como mínimo.',
    )
  })

  it('acepta clave de 12 caracteres', () => {
    expect(validatePassword('a'.repeat(12))).toBe('')
  })
})

describe('validaciones de inventario y cantidades', () => {
  it('rechaza valores no finitos y existencias fraccionarias', () => {
    expect(validatePrice('Infinity')).toBe('Ingresa un precio válido.')
    expect(validateStock('1.5')).toBe('Ingresa un stock válido.')
    expect(validateStock('Infinity')).toBe('Ingresa un stock válido.')
  })

  it('exige cantidades enteras positivas dentro del stock', () => {
    expect(validateQuantity('1.5')).toBe(
      'La cantidad debe ser un número entero mayor que 0.',
    )
    expect(validateQuantity('3', 2)).toBe('Solo hay 2 unidad(es) disponibles.')
    expect(validateQuantity('2', 2)).toBe('')
  })
})
