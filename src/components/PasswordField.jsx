import { useState } from 'react'
import { fieldBorderClasses, fieldMessageClasses } from '../utils/ui.js'

function PasswordField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error = '',
  hint = '',
  valid = false,
  required = false,
  autoComplete = 'new-password',
  placeholder = '',
  disabled = false,
}) {
  const [visible, setVisible] = useState(false)
  const describedBy = `${id}-hint`
  const message = error ? `✕ ${error}` : valid ? '✓ Contraseña válida' : hint
  const inputClass = `min-h-11 w-full rounded-xl border-[1.5px] bg-card py-3 pl-4 pr-24 text-ink outline-none transition placeholder:text-muted focus:ring-4 disabled:cursor-not-allowed disabled:bg-surface ${fieldBorderClasses(error, valid)}`

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-err"> *</span> : null}
      </label>

      <div className="relative mt-1.5">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-pressed={visible}
          className="absolute inset-y-0 right-2 my-auto min-h-11 rounded-lg px-3 text-sm font-semibold text-eyebrow transition hover:bg-surface focus:outline-none focus:ring-2 focus:ring-lavender"
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      <p
        id={describedBy}
        aria-live="polite"
        className={`mt-1.5 text-sm ${fieldMessageClasses(error, valid)}`}
      >
        {message || '\u00a0'}
      </p>
    </div>
  )
}

export default PasswordField
