import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../auth/mockApi.js'
import { saveSession } from '../auth/session.js'
import { validateEmail, validatePassword } from '../utils/validaciones.js'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
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
      setSuccess('¡Bienvenido a Perfumería Néctar!')
      window.setTimeout(() => {
        navigate('/cuenta', { replace: true })
      }, 900)
    } catch {
      setError('Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-surface min-[900px]:flex-row">
      <section
        aria-hidden="true"
        className="relative flex h-[330px] shrink-0 flex-col justify-center overflow-hidden bg-gradient-to-br from-bg-1 via-bg-2 to-bg-3 px-8 text-center min-[900px]:h-auto min-[900px]:w-1/2 min-[900px]:px-16"
      >
        <span className="mx-auto mb-6 h-2 w-2 rounded-full bg-lavender" />
        <p className="font-serif text-4xl font-bold text-card min-[900px]:text-5xl">
          Néctar Supremo
        </p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.4em] text-lavender">
          Esencia · Elegancia · Estilo
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center px-4 py-8 min-[900px]:w-1/2 min-[900px]:px-8 min-[900px]:py-16">
        <div className="w-full max-w-[605px] rounded-[28px] bg-card px-6 py-8 shadow-2xl min-[900px]:px-12 min-[900px]:py-12">
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-eyebrow">
              Perfumería Néctar
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">
              Iniciar sesión
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
        </div>
      </section>
    </main>
  )
}

export default Login
