const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/

const SUSPICIOUS_KEYWORDS = [
  'mailinator',
  'yopmail',
  'tempmail',
  '10minutemail',
  'guerrillamail',
  'fake',
  'test',
  'example',
]

const SUSPICIOUS_TLDS = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.top']

export function validateEmail(value) {
  const email = value.trim().toLowerCase()

  if (!email) {
    return 'El correo electrónico es obligatorio.'
  }

  if (!EMAIL_PATTERN.test(email)) {
    return 'Ingresa un correo válido, por ejemplo nombre@dominio.com.'
  }

  const domain = email.split('@')[1]

  if (SUSPICIOUS_KEYWORDS.some((keyword) => domain.includes(keyword))) {
    return 'No se permiten correos temporales, falsos o desechables.'
  }

  if (SUSPICIOUS_TLDS.some((tld) => domain.endsWith(tld))) {
    return 'El dominio del correo no es confiable.'
  }

  return ''
}

export function validatePassword(value) {
  if (!value) {
    return 'La contraseña es obligatoria.'
  }

  if (value.length < 12) {
    return 'La contraseña debe tener 12 caracteres como mínimo.'
  }

  return ''
}
