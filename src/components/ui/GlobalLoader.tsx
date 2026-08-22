import { AnimatePresence, motion } from 'framer-motion'
import { useLoaderStore } from '../../store/loaderStore'

const GlobalLoader = () => {
  const active = useLoaderStore(s => s.active)

  return (
    <AnimatePresence>
      {active > 0 && (
        <motion.div
          key="global-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
          aria-live="assertive"
          aria-label="Loading"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1,    opacity: 1 }}
            exit={{ scale: 0.85,    opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Spinner ring */}
            <div className="relative h-14 w-14">
              <svg
                className="h-14 w-14 animate-spin"
                viewBox="0 0 56 56"
                fill="none"
              >
                {/* Track */}
                <circle cx="28" cy="28" r="23" stroke="rgba(0,200,150,0.15)" strokeWidth="4" />
                {/* Arc */}
                <circle
                  cx="28" cy="28" r="23"
                  stroke="#00C896"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="80 65"
                  strokeDashoffset="0"
                />
              </svg>
              {/* AZ badge in centre */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-7 w-7 rounded bg-[#00C896] flex items-center justify-center">
                  <span className="text-[#061414] font-black text-xs leading-none">AZ</span>
                </div>
              </div>
            </div>

            <p className="text-sm font-medium text-white tracking-wide">Please wait…</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GlobalLoader
