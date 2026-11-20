export async function resolveCurrentLocation(signal) {
  if (!navigator.geolocation) {
    throw new Error('Tu navegador no admite ubicación. Ingresa los datos manualmente.')
  }

  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0,
    })
  })

  if (signal.aborted) throw new DOMException('Cancelado', 'AbortError')

  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.search = new URLSearchParams({
    format: 'jsonv2',
    lat: String(position.coords.latitude),
    lon: String(position.coords.longitude),
    addressdetails: '1',
    'accept-language': 'es',
  }).toString()
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('No se pudo consultar la dirección. Ingresa los datos manualmente.')
  const result = await response.json()
  const address = result.address
  if (!address || address.country_code?.toLowerCase() !== 'pe') {
    throw new Error('No se encontró una dirección en Perú. Ingresa los datos manualmente.')
  }

  const street = [address.road, address.house_number].filter(Boolean).join(' ')
  return {
    department: address.state || '',
    province: address.province || address.county || '',
    district: address.city_district || address.district || '',
    address: street,
  }
}
