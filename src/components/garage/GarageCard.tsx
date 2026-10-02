import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CarIllustration = () => (
  <svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden="true">
    <path d="M18 52l6-20a8 8 0 017.6-6h57a8 8 0 017.6 6l6 20" stroke="#00C896" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="10" y="52" width="100" height="16" rx="6" stroke="#00C896" strokeWidth="3" />
    <circle cx="30" cy="68" r="6" fill="#00C896" />
    <circle cx="90" cy="68" r="6" fill="#00C896" />
  </svg>
)

const GarageCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.4 }}
    whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
    className="h-full"
  >
    <Link
      to="/garage"
      className="group relative flex flex-col h-full rounded-2xl border border-[#1A3D3D] bg-[#0D2424] overflow-hidden transition-all duration-300
        hover:border-[#00C896]/50
        hover:shadow-[0_0_0_1px_rgba(0,200,150,0.18),0_8px_32px_rgba(0,200,150,0.10),0_24px_56px_rgba(0,0,0,0.30)]"
    >
      <div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 45% at 50% 0%, rgba(0,200,150,0.25) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 h-48 overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A2828 0%, #061414 100%)' }}>
        <div className="opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500">
          <CarIllustration />
        </div>
        <div className="absolute top-3 left-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-black/40 text-[#00C896] backdrop-blur-sm border border-[#00C896]/20 group-hover:border-[#00C896]/50 group-hover:bg-[#00C896]/10 transition-all duration-300">
            Marketplace
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-[#E6F5F0] leading-snug group-hover:text-[#00C896] transition-colors duration-300">
            Garage Section
          </h3>
        </div>
        <p className="text-sm text-[#8AADA8] leading-relaxed">
          Browse cars listed by our dealers — features, pricing, and a direct WhatsApp line to the seller.
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00C896] pt-1">
          Browse the Garage
          <span className="translate-x-0 group-hover:translate-x-1.5 transition-transform duration-200">
            <ArrowRightIcon />
          </span>
        </span>
      </div>
    </Link>
  </motion.div>
)

export default GarageCard
