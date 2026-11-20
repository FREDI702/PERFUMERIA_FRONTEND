import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveCurrentLocation } from './location.js'

describe('ubicación aproximada', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('consulta solo al solicitar ubicación y obtiene los datos disponibles de Perú', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        address: { country_code: 'pe', state: 'Ucayali', county: 'Provincia de Coronel Portillo', city_district: 'Callería', road: 'Jirón Lima', house_number: '123' },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('navigator', {
      geolocation: { getCurrentPosition: (resolve) => resolve({ coords: { latitude: -8.38, longitude: -74.55 } }) },
    })
    const result = await resolveCurrentLocation(new AbortController().signal)
    expect(result).toEqual({ department: 'Ucayali', province: 'Provincia de Coronel Portillo', district: 'Callería', address: 'Jirón Lima 123' })
    expect(fetchMock).toHaveBeenCalledOnce()
    const url = new URL(fetchMock.mock.calls[0][0])
    expect(url.origin).toBe('https://nominatim.openstreetmap.org')
    expect(url.searchParams.get('lat')).toBe('-8.38')
  })

  it('no envía coordenadas si se deniega el permiso', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('navigator', {
      geolocation: { getCurrentPosition: (_resolve, reject) => reject({ code: 1 }) },
    })
    await expect(resolveCurrentLocation(new AbortController().signal)).rejects.toMatchObject({ code: 1 })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rechaza resultados fuera de Perú y errores del servicio', async () => {
    vi.stubGlobal('navigator', {
      geolocation: { getCurrentPosition: (resolve) => resolve({ coords: { latitude: 0, longitude: 0 } }) },
    })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ address: { country_code: 'ec' } }),
    }))
    await expect(resolveCurrentLocation(new AbortController().signal)).rejects.toThrow('No se encontró una dirección en Perú')
    fetch.mockResolvedValue({ ok: false })
    await expect(resolveCurrentLocation(new AbortController().signal)).rejects.toThrow('No se pudo consultar la dirección')
  })
})
