import { describe, expect, it } from 'vitest'
import { validateEmail, validatePassword } from './validaciones.js'

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
