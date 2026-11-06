import { describe, expect, it } from 'vitest'
import { esClaveValida, esCorreoValido } from './validacionesHU5'

describe('esCorreoValido', () => {
  it('rechaza correo sin dominio', () => {
    expect(esCorreoValido('ana@correo')).toBe(false)
  })

  it('rechaza correo sin arroba', () => {
    expect(esCorreoValido('ana.correo.com')).toBe(false)
  })

  it('acepta un correo con formato válido', () => {
    expect(esCorreoValido('ana@correo.com')).toBe(true)
  })

  it('acepta un correo válido con espacios alrededor', () => {
    expect(esCorreoValido(' ana@correo.com ')).toBe(true)
  })
})

describe('esClaveValida', () => {
  it('rechaza clave de 11 caracteres', () => {
    expect(esClaveValida('a'.repeat(11))).toBe(false)
  })

  it('acepta clave de 12 caracteres', () => {
    expect(esClaveValida('a'.repeat(12))).toBe(true)
  })

  it('rechaza una clave vacía', () => {
    expect(esClaveValida('')).toBe(false)
  })
})
