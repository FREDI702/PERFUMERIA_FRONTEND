import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PerfumeScene from '../components/PerfumeScene.jsx'
import Card from '../components/Card.jsx'
import Field from '../components/Field.jsx'
import PasswordField from '../components/PasswordField.jsx'
import Banner from '../components/Banner.jsx'
import Button from '../components/Button.jsx'
import { register } from '../auth/mockApi.js'
import {
  validateEmail,
  validateName,
  validatePasswordConfirmation,
  validatePasswordStrength,
} from '../utils/validaciones.js'

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmation: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const nameError = touched.name ? validateName(name) : ''
  const emailError = touched.email ? validateEmail(email) : ''
  const passwordError = touched.password ? validatePasswordStrength(password) : ''
  const confirmationError = touched.confirmation
    ? validatePasswordConfirmation(password, confirmation)
    : ''

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextTouched = {
      name: true,
      email: true,
      password: true,
      confirmation: true,
    }

    setTouched(nextTouched)
    setError('')
    setSuccess('')

    const errors = [
      validateName(name),
      validateEmail(email),
      validatePasswordStrength(password),
      validatePasswordConfirmation(password, confirmation),
    ]

    if (errors.some(Boolean)) {
      return
    }

    setLoading(true)

    try {
      await register({ name, email, password })
      setSuccess('¡Cuenta creada con éxito! Te llevamos al inicio de sesión…')
      window.setTimeout(() => {
        navigate('/login', { replace: true, state: { email } })
      }, 1600)
    } catch (err) {
      setError(
        err.message === 'duplicate'
          ? 'Ya existe una cuenta con este correo electrónico.'
          : 'No pudimos crear tu cuenta. Inténtalo de nuevo.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-cream min-[900px]:flex-row">
      <PerfumeScene />

      <section className="flex flex-1 items-center justify-center bg-cream px-4 py-8 min-[900px]:w-1/2 min-[900px]:px-8 min-[900px]:py-16">
        <Card className="w-full max-w-[605px]">
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
              Acceso seguro
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">
              Crear cuenta
            </h1>
            <p className="mt-2 text-sm text-muted">
              Regístrate para comprar tus perfumes favoritos y seguir tus pedidos.
            </p>
          </header>

          <form noValidate onSubmit={handleSubmit} className="space-y-5">
            <Field
              id="name"
              label="Nombre"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
              onBlur={() => setTouched((current) => ({ ...current, name: true }))}
              error={nameError}
              valid={touched.name && name.length > 0 && !nameError}
              validMessage="Nombre válido"
              hint="Escribe tu nombre completo."
              autoComplete="name"
              required
            />

            <Field
              id="email"
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
              }}
              onBlur={() => setTouched((current) => ({ ...current, email: true }))}
              error={emailError}
              valid={touched.email && email.length > 0 && !emailError}
              validMessage="Correo válido"
              hint="Usa un correo real, sin dominios temporales."
              autoComplete="email"
              required
            />

            <PasswordField
              id="password"
              label="Contraseña"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              onBlur={() =>
                setTouched((current) => ({ ...current, password: true }))
              }
              error={passwordError}
              valid={touched.password && password.length > 0 && !passwordError}
              hint="Mínimo 12 caracteres con letras y números."
              autoComplete="new-password"
              required
            />

            <PasswordField
              id="confirmation"
              label="Confirmar contraseña"
              value={confirmation}
              onChange={(event) => {
                setConfirmation(event.target.value)
                setError('')
              }}
              onBlur={() =>
                setTouched((current) => ({ ...current, confirmation: true }))
              }
              error={confirmationError}
              valid={
                touched.confirmation &&
                confirmation.length > 0 &&
                !confirmationError
              }
              hint="Repite tu contraseña."
              autoComplete="new-password"
              required
            />

            <Banner type="error">{error}</Banner>
            <Banner type="success">{success}</Banner>

            <Button
              type="submit"
              loading={loading}
              loadingText="Creando cuenta…"
              className="w-full"
            >
              Crear cuenta
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-muted">
            <p>
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="rounded font-semibold text-eyebrow underline-offset-4 transition hover:text-ink hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender"
              >
                Inicia sesión
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
        </Card>
      </section>
    </main>
  )
}

export default Register
