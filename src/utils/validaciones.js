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

export function validatePasswordStrength(value) {
  if (!value) {
    return 'La contraseña es obligatoria.'
  }

  if (value.length < 12) {
    return 'La contraseña debe tener 12 caracteres como mínimo.'
  }

  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return 'La contraseña debe incluir letras y números.'
  }

  return ''
}

export function validatePasswordConfirmation(password, confirmation) {
  if (!confirmation) {
    return 'Confirma tu contraseña.'
  }

  if (password !== confirmation) {
    return 'Las contraseñas no coinciden.'
  }

  return ''
}

export function validateName(value) {
  if (!value.trim()) {
    return 'El nombre es obligatorio.'
  }

  if (value.trim().length < 3) {
    return 'El nombre debe tener al menos 3 caracteres.'
  }

  return ''
}

export function validatePrice(value) {
  const price = Number(value)

  if (value === '' || Number.isNaN(price)) {
    return 'Ingresa un precio válido.'
  }

  if (price <= 0) {
    return 'El precio debe ser mayor que 0.'
  }

  return ''
}

export function validateStock(value) {
  const stock = Number(value)

  if (value === '' || Number.isNaN(stock)) {
    return 'Ingresa un stock válido.'
  }

  if (stock < 0) {
    return 'El stock no puede ser negativo.'
  }

  return ''
}

export function validatePhone(value) {
  if (!value.trim()) {
    return 'El teléfono es obligatorio.'
  }

  if (!/^\d{9}$/.test(value.trim())) {
    return 'El teléfono debe tener 9 dígitos.'
  }

  return ''
}

export function validateQuantity(value, max) {
  const quantity = Number(value)

  if (value === '' || Number.isNaN(quantity) || quantity <= 0) {
    return 'La cantidad debe ser mayor que 0.'
  }

  if (max !== undefined && quantity > max) {
    return `Solo hay ${max} unidad(es) disponibles.`
  }

  return ''
}

export function validateProvider(value) {
  if (!value.trim()) {
    return 'El proveedor es obligatorio.'
  }

  return ''
}
