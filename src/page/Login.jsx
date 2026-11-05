import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PerfumeScene from '../components/PerfumeScene.jsx'
import { login } from '../auth/mockApi.js'
import { saveSession } from '../auth/session.js'
import { validateEmail, validatePassword } from '../utils/validaciones.js'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email ?? '')
  const [password, setPassword] = useState('')
  const [touchedEmail, setTouchedEmail] = useState(false)
  const [touchedPassword, setTouchedPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const emailError = touchedEmail ? validateEmail(email) : ''
  const passwordError = touchedPassword ? validatePassword(password) : ''
  const emailValid = touchedEmail && email.length > 0 && !emailError
  const passwordValid = touchedPassword && password.length > 0 && !passwordError

  const handleSubmit = async (event) => {
    event.preventDefault()

    setTouchedEmail(true)
    setTouchedPassword(true)
    setError('')
    setSuccess('')

    if (validateEmail(email) || validatePassword(password)) {
      return
    }

    setLoading(true)

    try {
      const user = await login({ email, password })
      saveSession(user)
      setLoading(false)
      setSuccess('¡Bienvenido a Perfumería Néctar!')
      window.setTimeout(() => {
        navigate(user.role === 'Administrador' ? '/admin/perfumes' : '/tienda', {
          replace: true,
        })
      }, 1500)
    } catch {
      setError('Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-cream min-[900px]:flex-row">
      <PerfumeScene />

      <section className="flex flex-1 items-center justify-center bg-cream px-4 py-8 min-[900px]:w-1/2 min-[900px]:px-8 min-[900px]:py-16">
        <div className="w-full max-w-[605px] rounded-[28px] bg-card px-6 py-8 shadow-2xl min-[900px]:px-12 min-[900px]:py-12">
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-eyebrow">
              Perfumería Néctar
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">
              Hola de nuevo
            </h1>
            <p className="mt-2 text-sm text-muted">
              Accede a tu cuenta para gestionar tus compras de forma segura.
            </p>
          </header>

          <form noValidate onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink">
                Correo electrónico <span className="text-err">*</span>
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
                  setSuccess('')
                }}
                onBlur={() => setTouchedEmail(true)}
                aria-invalid={Boolean(emailError)}
                aria-describedby="email-hint"
                placeholder="nombre@dominio.com"
                className={`mt-1.5 min-h-11 w-full rounded-xl border-[1.5px] bg-card px-4 py-3 text-ink outline-none transition placeholder:text-muted focus:ring-4 ${
                  emailError
                    ? 'border-err focus:ring-err-bg'
                    : emailValid
                      ? 'border-ok focus:ring-ok-bg'
                      : 'border-line focus:border-eyebrow focus:ring-surface'
                }`}
              />
              <p
                id="email-hint"
                aria-live="polite"
                className={`mt-1.5 text-sm ${
                  emailError ? 'text-err' : emailValid ? 'text-ok' : 'text-muted'
                }`}
              >
                {emailError
                  ? `✕ ${emailError}`
                  : emailValid
                    ? '✓ Correo válido'
                    : 'Usa un correo real, sin dominios temporales.'}
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                Contraseña <span className="text-err">*</span>
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
                    setSuccess('')
                  }}
                  onBlur={() => setTouchedPassword(true)}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby="password-hint"
                  placeholder="Mínimo 12 caracteres"
                  className={`min-h-11 w-full rounded-xl border-[1.5px] bg-card py-3 pl-4 pr-24 text-ink outline-none transition placeholder:text-muted focus:ring-4 ${
                    passwordError
                      ? 'border-err focus:ring-err-bg'
                      : passwordValid
                        ? 'border-ok focus:ring-ok-bg'
                        : 'border-line focus:border-eyebrow focus:ring-surface'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-2 my-auto min-h-11 rounded-lg px-3 text-sm font-semibold text-eyebrow transition hover:bg-surface focus:outline-none focus:ring-2 focus:ring-lavender"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <p
                id="password-hint"
                aria-live="polite"
                className={`mt-1.5 text-sm ${
                  passwordError ? 'text-err' : passwordValid ? 'text-ok' : 'text-muted'
                }`}
              >
                {passwordError
                  ? `✕ ${passwordError}`
                  : passwordValid
                    ? '✓ Contraseña válida'
                    : 'Debe tener 12 caracteres como mínimo.'}
              </p>
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-xl border border-err bg-err-bg px-4 py-3 text-sm text-err"
              >
                {error}
              </div>
            ) : null}

            {success ? (
              <div
                role="alert"
                className="rounded-xl border border-ok bg-ok-bg px-4 py-3 text-sm text-ok"
              >
                {success}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="min-h-11 w-full rounded-[14px] bg-primary px-4 py-3 font-bold text-card transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-line disabled:opacity-60"
            >
              {loading ? 'Validando credenciales…' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-muted">
            <p>
              ¿No tienes cuenta?{' '}
              <Link
                to="/registro"
                className="rounded font-semibold text-eyebrow underline-offset-4 transition hover:text-ink hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender"
              >
                Crear cuenta
              </Link>
            </p>
            <p>
              <Link
                to="/"
                className="rounded font-semibold text-eyebrow underline-offset-4 transition hover:text-ink hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender"
              >
                ← Volver a inicio
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login
