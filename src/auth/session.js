const SESSION_KEY = 'perfumeria.session'

export function saveSession(user) {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email: user.email,
      name: user.name,
      role: user.role,
      token: user.token,
      lastActivity: Date.now(),
    }),
  )
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function isAuthenticated() {
  return Boolean(getSession())
}

export function hasRole(role) {
  const session = getSession()
  return session ? session.role === role : false
}
