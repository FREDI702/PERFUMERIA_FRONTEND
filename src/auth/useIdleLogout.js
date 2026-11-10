import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSession, getSession, touchSession } from './session.js'

const INACTIVITY_MS = 30 * 60 * 1000
const TOUCH_INTERVAL_MS = 30 * 1000
const ACTIVITY_EVENTS = ['click', 'keydown', 'mousemove', 'touchstart', 'scroll']

export function useIdleLogout() {
  const navigate = useNavigate()

  useEffect(() => {
    let lastTouch = 0

    const expire = () => {
      const session = getSession()

      if (!session) {
        navigate('/login', {
          replace: true,
          state: { message: 'Inicia sesión para continuar.' },
        })
        return true
      }

      const lastActivity = session.lastActivity ?? Date.now()

      if (Date.now() - lastActivity >= INACTIVITY_MS) {
        clearSession()
        navigate('/sesion-expirada', { replace: true })
        return true
      }

      return false
    }

    const handleActivity = () => {
      if (expire()) {
        return
      }

      const now = Date.now()

      if (now - lastTouch >= TOUCH_INTERVAL_MS) {
        lastTouch = now
        touchSession()
      }
    }

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    window.addEventListener('pageshow', expire)
    const interval = window.setInterval(expire, 30000)

    expire()

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })

      window.removeEventListener('pageshow', expire)
      window.clearInterval(interval)
    }
  }, [navigate])
}
