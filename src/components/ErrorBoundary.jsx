import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-surface px-4">
          <div className="w-full max-w-md rounded-[28px] bg-card p-8 text-center shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-eyebrow">
              Perfumería Néctar
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold text-ink">
              Algo salió mal
            </h1>
            <p className="mt-3 text-sm text-muted">
              Ocurrió un error inesperado. Inténtalo de nuevo más tarde.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 min-h-11 w-full rounded-[14px] bg-primary px-4 py-3 font-bold text-card transition hover:bg-ink focus:outline-none focus:ring-4 focus:ring-line"
            >
              Recargar página
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
