import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { saveSession } from '../auth/session.js'

const DEMO_CREDENTIALS = {
  email: 'cliente.perfumeria@gmail.com',
  password: 'Perfume2026!',
}

const TRUSTED_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'yahoo.com',
  'yahoo.es',
  'icloud.com',
  'me.com',
  'proton.me',
  'protonmail.com',
  'aol.com',
]

const SUSPICIOUS_DOMAINS = [
  '10minutemail.com',
  'dispostable.com',
  'example.com',
  'fake.com',
  'guerrillamail.com',
  'maildrop.cc',
  'mailinator.com',
  'sharklasers.com',
  'tempmail.com',
  'test.com',
  'throwaway.email',
  'trashmail.com',
  'yopmail.com',
]

const SUSPICIOUS_TLDS = ['.cf', '.ga', '.gq', '.ml', '.tk', '.top', '.xyz', '.zip']

const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

function validateEmail(value) {
  const email = value.trim().toLowerCase()

  if (!email) {
    return 'El correo electrónico es obligatorio.'
  }

  if (!EMAIL_PATTERN.test(email)) {
    return 'Ingresa un correo válido, por ejemplo nombre@dominio.com.'
  }

  const [localPart, domain] = email.split('@')

  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return 'El correo electrónico no es válido.'
  }

  if (SUSPICIOUS_DOMAINS.some((blocked) => domain === blocked || domain.endsWith(`.${blocked}`))) {
    return 'No se permiten correos temporales, falsos o desechables.'
  }

  if (SUSPICIOUS_TLDS.some((tld) => domain.endsWith(tld))) {
    return 'El dominio del correo no es confiable. Usa un proveedor conocido.'
  }

  if (!TRUSTED_DOMAINS.includes(domain)) {
    return 'Usa un correo de un proveedor confiable como Gmail, Outlook o iCloud.'
  }

  return ''
}

function validatePassword(value) {
  if (!value) {
    return 'La contraseña es obligatoria.'
  }

  if (value.length !== 12) {
    return 'La contraseña debe tener exactamente 12 caracteres.'
  }

  return ''
}

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    const normalizedEmail = email.trim().toLowerCase()
    const credentialsMatch =
      normalizedEmail === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password

    if (!credentialsMatch) {
      setError('Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.')
      return
    }

    setError('')
    saveSession(normalizedEmail)
    navigate('/cuenta', { replace: true })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 shadow-xl shadow-rose-100/60">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-700">
            Perfumería
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-stone-900">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Accede a tu cuenta para gestionar tus compras de forma segura.
          </p>
        </header>

        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
              }}
              aria-invalid={Boolean(error)}
              aria-describedby="email-hint"
              placeholder="nombre@dominio.com"
              className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
            />
            <p id="email-hint" className="mt-1.5 text-xs text-stone-500">
              Solo aceptamos correos de proveedores confiables.
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">
              Contraseña
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError('')
                }}
                aria-invalid={Boolean(error)}
                aria-describedby="password-hint"
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 pr-24 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-2 my-auto h-8 rounded-lg px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <p id="password-hint" className="mt-1.5 text-xs text-stone-500">
              Debe tener exactamente 12 caracteres.
            </p>
          </div>

          {error ? (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="mt-0.5 h-4 w-4 shrink-0"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span>{error}</span>
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-rose-700 px-4 py-3 font-semibold text-white transition hover:bg-rose-800 focus:outline-none focus:ring-4 focus:ring-rose-200"
          >
            Ingresar
          </button>
        </form>

        <aside className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <p className="font-semibold">Credenciales de prueba</p>
          <p className="mt-1">
            Correo: <code className="font-mono">{DEMO_CREDENTIALS.email}</code>
          </p>
          <p>
            Contraseña: <code className="font-mono">{DEMO_CREDENTIALS.password}</code>
          </p>
        </aside>
      </section>
    </main>
  )
}

export default Login
