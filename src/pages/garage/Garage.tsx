import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '../../lib/api'
import SeoHead from '../../components/ui/SeoHead'
import CarCard, { type PublicCar } from '../../components/garage/CarCard'

const GaragePageSkeleton = () => (
  <div className="min-h-screen bg-[#061414]" aria-hidden="true">
    <section className="relative pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A2828] to-[#061414]" />
      <div className="relative max-w-6xl mx-auto px-6 text-center space-y-4">
        <div className="h-3.5 w-24 rounded-full bg-[#00C896]/20 animate-pulse mx-auto" />
        <div className="h-10 w-72 rounded-lg bg-[#0D2424] animate-pulse mx-auto" />
      </div>
    </section>
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="rounded-2xl border border-[#1A3D3D] bg-[#0D2424] overflow-hidden h-72 animate-pulse" />
        ))}
      </div>
    </section>
  </div>
)

const Garage = () => {
  const { data: cars, isLoading, isError } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const { data } = await api.get<PublicCar[]>('/api/cars')
      return data
    },
  })

  if (isLoading) return <GaragePageSkeleton />

  return (
    <div className="min-h-screen bg-[#061414]">
      <SeoHead
        title="Garage Section"
        description="Browse cars listed by our dealers — features, pricing, and a direct WhatsApp line to the seller."
      />

      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2828] to-[#061414]" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-semibold tracking-widest uppercase text-[#00C896] mb-3">
            Garage Section
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-[#E6F5F0] mb-4">
            Cars, from our dealers to you
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-[#8AADA8] max-w-2xl mx-auto mb-6">
            Browse listings from verified dealers. Chat directly on WhatsApp for more info.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-center gap-3">
            <Link to="/garage/signup" className="px-5 py-2.5 rounded-xl bg-[#00C896] text-[#061414] font-semibold text-sm hover:bg-[#00E5AD] transition-colors">
              List your car
            </Link>
            <Link to="/garage/login" className="px-5 py-2.5 rounded-xl border border-[#1A3D3D] text-[#E6F5F0] font-semibold text-sm hover:border-[#00C896]/50 transition-colors">
              Dealer sign in
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        {isError && <p className="text-center text-red-400 py-16">Failed to load cars. Please try again.</p>}

        {!isLoading && cars?.length === 0 && (
          <p className="text-center text-[#638A85] py-16">No cars listed yet — check back soon.</p>
        )}

        {cars && cars.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        )}
      </section>
    </div>
  )
}

export default Garage
