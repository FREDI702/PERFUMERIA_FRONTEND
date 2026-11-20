import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearSession,
  getSession,
  hasRole,
  isAuthenticated,
  saveSession,
  touchSession,
} from './session.js'

const SESSION_KEY = 'perfumeria.session'

describe('sesión de usuario', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('guarda y consulta una sesión válida sin persistirla fuera de la pestaña', () => {
    const user = {
      email: 'ana@gmail.com',
      name: 'Ana García',
      role: 'Cliente',
      token: 'token-simulado',
    }

    saveSession(user)

    expect(getSession()).toMatchObject(user)
    expect(isAuthenticated()).toBe(true)
    expect(hasRole('Cliente')).toBe(true)
    expect(hasRole('Administrador')).toBe(false)
    expect(localStorage.length).toBe(0)
  })

  it('elimina sesiones malformadas o con un rol desconocido', () => {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        email: 'ana@gmail.com',
        name: 'Ana García',
        role: 'Superusuario',
        token: 'token-simulado',
        lastActivity: Date.now(),
      }),
    )

    expect(getSession()).toBeNull()
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull()
    expect(isAuthenticated()).toBe(false)
  })

  it('actualiza la actividad y permite cerrar la sesión', () => {
    saveSession({
      email: 'ana@gmail.com',
      name: 'Ana García',
      role: 'Cliente',
      token: 'token-simulado',
    })
    const previousActivity = getSession().lastActivity

    touchSession()

    expect(getSession().lastActivity).toBeGreaterThanOrEqual(previousActivity)
    clearSession()
    expect(getSession()).toBeNull()
  })

  it('rechaza guardar una sesión sin token o con rol inválido', () => {
    expect(() =>
      saveSession({
        email: 'ana@gmail.com',
        name: 'Ana García',
        role: 'Cliente',
      }),
    ).toThrow('No se puede guardar una sesión inválida.')
  })
})
