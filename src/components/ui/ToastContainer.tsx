import { AnimatePresence, motion } from 'framer-motion'
import { useToastStore } from '../../store/toastStore'

const ToastContainer = () => {
  const toasts  = useToastStore(s => s.toasts)
  const dismiss = useToastStore(s => s.dismiss)

  return (
    <div
      className="fixed bottom-4 right-4 z-[10000] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            role="status"
            className={[
              'flex items-start gap-2.5 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm bg-brand-surface',
              t.type === 'success' ? 'border-brand-success/40' : 'border-brand-danger/40',
            ].join(' ')}
          >
            {t.type === 'success' ? (
              <svg className="w-5 h-5 shrink-0 text-brand-success mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 shrink-0 text-brand-danger mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1.5 1.5 0 003.4 20.5h17.2a1.5 1.5 0 001.29-2.46L13.71 3.86a1.5 1.5 0 00-2.42 0z" />
              </svg>
            )}
            <p className="flex-1 text-sm text-brand-text-h leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="text-brand-text-muted hover:text-brand-text-h shrink-0 -m-1 p-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ToastContainer
