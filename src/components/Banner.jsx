const BANNER_STYLES = {
  error: 'border-err bg-err-bg text-err',
  success: 'border-ok bg-ok-bg text-ok',
  warning: 'border-warn bg-warn-bg text-warn',
}

function Banner({ type = 'error', children }) {
  if (!children) {
    return null
  }

  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm ${BANNER_STYLES[type]}`}
    >
      {children}
    </div>
  )
}

export default Banner
