import { AnimatePresence, motion } from 'framer-motion'
import { useToastStore, TOAST_DURATION_MS } from '../../store/toastStore'

const ToastContainer = () => {
  const toasts  = useToastStore(s => s.toasts)
  const dismiss = useToastStore(s => s.dismiss)

  return (
    <div
      className="fixed top-4 inset-x-0 z-[10000] flex flex-col items-center gap-2 px-4 pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map(t => {
          const isSuccess = t.type === 'success'
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              role="status"
              className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border bg-brand-surface shadow-2xl"
              style={{
                borderColor: isSuccess ? 'var(--color-success)' : 'var(--color-danger)',
              }}
            >
              <div className="flex items-start gap-3 px-4 py-3.5">
                {/* Icon badge */}
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: isSuccess ? 'var(--color-success)' : 'var(--color-danger)',
                  }}
                >
                  {isSuccess ? (
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.35, delay: 0.1 }}
                      className="w-[18px] h-[18px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}
                    >
                      <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  ) : (
                    <svg className="w-[18px] h-[18px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1.5 1.5 0 003.4 20.5h17.2a1.5 1.5 0 001.29-2.46L13.71 3.86a1.5 1.5 0 00-2.42 0z" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 pt-0.5 min-w-0">
                  <p className="text-sm font-semibold text-brand-text-h leading-tight">
                    {isSuccess ? 'Saved' : 'Something went wrong'}
                  </p>
                  <p className="text-sm text-brand-text-muted leading-snug mt-0.5">{t.message}</p>
                </div>

                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss"
                  className="text-brand-text-muted hover:text-brand-text-h shrink-0 -m-1 p-1 rounded-md hover:bg-brand-bg-alt transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Auto-dismiss progress bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: TOAST_DURATION_MS / 1000, ease: 'linear' }}
                className="h-0.5 origin-left"
                style={{ background: isSuccess ? 'var(--color-success)' : 'var(--color-danger)' }}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default ToastContainer
