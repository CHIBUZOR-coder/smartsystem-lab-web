import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export interface PublicCar {
  id:          string
  title:       string
  price:       number
  images:      string[]
  dealer:      { id: string; name: string } | null
  addedByAdmin: { id: string; name: string } | null
}

const CarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-[#00C896]/40" aria-hidden="true">
    <path d="M5 16l1.5-5A2 2 0 018.4 9.5h7.2a2 2 0 011.9 1.5L19 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="3" y="16" width="18" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="7.5" cy="20" r="1.3" fill="currentColor" />
    <circle cx="16.5" cy="20" r="1.3" fill="currentColor" />
  </svg>
)

const CarCard = ({ car }: { car: PublicCar }) => {
  const listerName = car.dealer?.name ?? car.addedByAdmin?.name ?? 'AZ SmartSystem Lab'
  const listerHref  = car.dealer ? `/garage/dealer/${car.dealer.id}` : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col h-full rounded-2xl border border-[#1A3D3D] bg-[#0D2424] overflow-hidden transition-all duration-300 hover:border-[#00C896]/50"
    >
      <Link to={`/garage/${car.id}`} className="flex flex-col flex-1">
        <div className="relative h-44 overflow-hidden bg-[#0A2020] flex items-center justify-center">
          {car.images[0] ? (
            <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <CarIcon />
          )}
        </div>
        <div className="flex flex-col flex-1 p-5 pb-2 gap-2">
          <h3 className="text-base font-semibold text-[#E6F5F0] leading-snug group-hover:text-[#00C896] transition-colors">{car.title}</h3>
          <p className="text-lg font-bold text-[#00C896]">{car.price.toLocaleString()}</p>
        </div>
      </Link>
      <p className="text-xs text-[#638A85] px-5 pb-5">
        Listed by{' '}
        {listerHref ? (
          <Link to={listerHref} className="text-[#00C896] hover:underline">{listerName}</Link>
        ) : (
          <span className="text-[#8AADA8]">{listerName}</span>
        )}
      </p>
    </motion.div>
  )
}

export default CarCard
