const BUTTON_VARIANTS = {
  primary: 'bg-primary text-card hover:bg-ink focus:ring-line',
  secondary: 'bg-secondary text-card hover:opacity-90 focus:ring-line',
  ghost: 'border-[1.5px] border-line bg-transparent text-ink hover:bg-surface focus:ring-surface',
  danger: 'bg-err text-card hover:opacity-90 focus:ring-err-bg',
}

export function buttonClasses({ variant = 'primary', className = '' } = {}) {
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] px-4 py-3 font-bold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${BUTTON_VARIANTS[variant]} ${className}`
}

export function fieldBorderClasses(error, valid) {
  if (error) {
    return 'border-err focus:ring-err-bg'
  }

  if (valid) {
    return 'border-ok focus:ring-ok-bg'
  }

  return 'border-line focus:border-eyebrow focus:ring-surface'
}

export function fieldMessageClasses(error, valid) {
  if (error) {
    return 'text-err'
  }

  if (valid) {
    return 'text-ok'
  }

  return 'text-muted'
}
