import { useEffect, useId } from 'react'
import Button from './Button.jsx'

function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Sí, eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
}) {
  const titleId = useId()

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onCancel])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-[28px] bg-card p-6 shadow-2xl"
      >
        <h2 id={titleId} className="font-serif text-2xl font-bold text-ink">
          {title}
        </h2>
        <p className="mt-3 text-sm text-muted">{message}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={loading}
            loadingText="Procesando…"
            className="w-full"
          >
            {confirmText}
          </Button>
          <Button variant="ghost" onClick={onCancel} className="w-full">
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
