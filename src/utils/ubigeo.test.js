import { describe, expect, it } from 'vitest'
import { getDepartments, getDistricts, getProvinces, matchUbigeoName } from './ubigeo.js'

describe('ubigeos del INEI', () => {
  it('incluye departamentos y los distritos de sus provincias', () => {
    expect(getDepartments()).toHaveLength(25)
    expect(getProvinces('UCAYALI')).toContain('CORONEL PORTILLO')
    expect(getDistricts('UCAYALI', 'CORONEL PORTILLO')).toEqual(expect.arrayContaining([
      'CALLERIA', 'MANANTAY', 'YARINACOCHA',
    ]))
    expect(getDistricts('LIMA', 'LIMA')).toContain('MIRAFLORES')
    expect(getDistricts('HUANUCO', 'HUANUCO')).toContain('HUANUCO')
    expect(getDistricts('UCAYALI', 'LIMA')).toEqual([])
  })

  it('asocia nombres de ubicación sin acentos y sin prefijos administrativos', () => {
    expect(matchUbigeoName('Provincia de Coronel Portillo', getProvinces('UCAYALI'))).toBe('CORONEL PORTILLO')
    expect(matchUbigeoName('Callería', getDistricts('UCAYALI', 'CORONEL PORTILLO'))).toBe('CALLERIA')
    expect(matchUbigeoName('Pucallpa', getProvinces('UCAYALI'))).toBe('')
  })
})
