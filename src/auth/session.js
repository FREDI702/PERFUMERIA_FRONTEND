const SESSION_KEY = 'perfumeria.session'

function isValidSession(session) {
  return Boolean(
    session &&
      typeof session.email === 'string' &&
      typeof session.name === 'string' &&
      ['Cliente', 'Administrador'].includes(session.role) &&
      typeof session.token === 'string' &&
      session.token.length > 0 &&
      Number.isFinite(session.lastActivity),
  )
}

export function saveSession(user) {
  if (
    !user ||
    typeof user.email !== 'string' ||
    typeof user.name !== 'string' ||
    !['Cliente', 'Administrador'].includes(user.role) ||
    typeof user.token !== 'string' ||
    user.token.length === 0
  ) {
    throw new Error('No se puede guardar una sesión inválida.')
  }

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

export function touchSession() {
  const session = getSession()

  if (!session) {
    return
  }

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      ...session,
      lastActivity: Date.now(),
    }),
  )
}

export function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY)

  if (!raw) {
    return null
  }

  try {
    const session = JSON.parse(raw)

    if (!isValidSession(session)) {
      sessionStorage.removeItem(SESSION_KEY)
      return null
    }

    return session
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
