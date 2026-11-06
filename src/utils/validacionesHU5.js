const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/

export function esCorreoValido(value) {
  return EMAIL_PATTERN.test(value.trim())
}

export function esClaveValida(value) {
  return value.length >= 12
}
