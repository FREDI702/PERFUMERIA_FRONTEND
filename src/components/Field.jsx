import { fieldBorderClasses, fieldMessageClasses } from '../utils/ui.js'

function Field({
  id,
  label,
  type = 'text',
  as = 'input',
  value,
  onChange,
  onBlur,
  error = '',
  hint = '',
  valid = false,
  validMessage = 'Listo',
  required = false,
  options = [],
  placeholder = '',
  autoComplete = 'off',
  min,
  step,
  rows = 3,
  className = '',
  disabled = false,
}) {
  const describedBy = `${id}-hint`
  const message = error ? `✕ ${error}` : valid ? `✓ ${validMessage}` : hint
  const controlClass = `mt-1.5 min-h-11 w-full rounded-xl border-[1.5px] bg-card px-4 py-3 text-ink outline-none transition placeholder:text-muted focus:ring-4 disabled:cursor-not-allowed disabled:bg-surface ${fieldBorderClasses(error, valid)} ${className}`

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-err"> *</span> : null}
      </label>

      {as === 'select' ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={controlClass}
        >
          {options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.value
            const optionLabel = typeof option === 'string' ? option : option.label

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            )
          })}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          rows={rows}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={controlClass}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          min={min}
          step={step}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={controlClass}
        />
      )}

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

export default Field
