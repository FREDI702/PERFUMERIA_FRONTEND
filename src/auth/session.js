const AUTH_STORAGE_KEY = 'perfumeria.session.email'

export function saveSession(email) {
  sessionStorage.setItem(AUTH_STORAGE_KEY, email)
}

export function clearSession() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getSessionEmail() {
  return sessionStorage.getItem(AUTH_STORAGE_KEY)
}

export function isAuthenticated() {
  return Boolean(getSessionEmail())
}
