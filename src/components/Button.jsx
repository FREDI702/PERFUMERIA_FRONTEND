import { buttonClasses } from '../utils/ui.js'

function Button({
  variant = 'primary',
  loading = false,
  loadingText = 'Procesando…',
  className = '',
  children,
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonClasses({ variant, className })}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  )
}

export default Button
