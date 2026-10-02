import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '../../lib/api'
import SeoHead from '../../components/ui/SeoHead'

interface Car {
  id:             string
  title:          string
  description:    string
  price:          number
  whatsappNumber: string
  images:         string[]
  features:       string[]
  dealer:         { id: string; name: string } | null
  addedByAdmin:   { id: string; name: string } | null
}

function toWhatsAppLink(number: string) {
  const digits = number.replace(/[^\d]/g, '')
  return `https://wa.me/${digits}`
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5 8.5L7 10.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M13 8H3M6.5 4.5L3 8L6.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.72.45 3.39 1.3 4.87L2 22l5.35-1.4a9.9 9.9 0 004.69 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.03a8.1 8.1 0 01-4.14-1.14l-.3-.18-3.07.81.82-3.01-.19-.3a8.1 8.1 0 01-1.25-4.3c0-4.48 3.65-8.13 8.14-8.13 2.17 0 4.21.85 5.75 2.39a8.07 8.07 0 012.38 5.75c0 4.48-3.65 8.11-8.14 8.11zm4.46-6.08c-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.97-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42-.14-.01-.3-.01-.46-.01s-.42.06-.64.3c-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
  </svg>
)

const CarDetailSkeleton = () => (
  <div className="min-h-screen bg-[#061414]" aria-hidden="true">
    <section className="relative pt-24 pb-20 bg-[#0A2020]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A2828] to-[#061414]" />
      <div className="relative max-w-5xl mx-auto px-6 space-y-4">
        <div className="h-4 w-28 rounded bg-[#132F2F] animate-pulse mb-10" />
        <div className="h-11 w-80 rounded-lg bg-[#132F2F] animate-pulse max-w-full" />
        <div className="h-7 w-40 rounded bg-[#132F2F] animate-pulse" />
      </div>
    </section>
  </div>
)

const CarDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [heroIdx, setHeroIdx] = useState(0)

  const { data: car, isLoading, isError } = useQuery({
    queryKey: ['car', id],
    queryFn: async () => {
      const { data } = await api.get<Car>(`/api/cars/${id}`)
      return data
    },
    retry: (count, err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404) return false
      return count < 2
    },
  })

  if (isLoading) return <CarDetailSkeleton />

  if (isError || !car) {
    return (
      <div className="min-h-screen bg-[#061414] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-5xl font-bold text-[#1A4040]">404</p>
        <h1 className="text-2xl font-bold text-[#E6F5F0]">Car not found</h1>
        <p className="text-[#8AADA8] max-w-xs">It may have been sold, removed, or the link is incorrect.</p>
        <button onClick={() => navigate('/garage')} className="mt-2 px-6 py-2.5 rounded-xl bg-[#00C896] text-[#061414] font-semibold hover:bg-[#00E5AD] transition-colors">
          Browse the Garage
        </button>
      </div>
    )
  }

  const listerName = car.dealer?.name ?? car.addedByAdmin?.name ?? 'AZ SmartSystem Lab'
  const listerHref  = car.dealer ? `/garage/dealer/${car.dealer.id}` : null
  const heroSrc = car.images[heroIdx] ?? car.images[0] ?? null

  return (
    <div className="min-h-screen bg-[#061414]">
      <SeoHead title={car.title} description={car.description} />

      <section className="relative pt-24 pb-16 overflow-hidden bg-[#0A2020]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2828] to-[#061414]" />
        <div className="relative max-w-5xl mx-auto px-6">
          <Link to="/garage" className="inline-flex items-center gap-2 text-sm text-[#638A85] hover:text-[#00C896] transition-colors mb-10">
            <ArrowLeftIcon /> All cars
          </Link>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-[#E6F5F0] mb-3 max-w-2xl">
            {car.title}
          </motion.h1>
          <p className="text-2xl font-bold text-[#00C896] mb-6">{car.price.toLocaleString()}</p>

          <a
            href={toWhatsAppLink(car.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-[#061414] font-semibold hover:bg-[#2EE576] transition-colors shadow-lg"
          >
            <WhatsAppIcon /> Chat on WhatsApp
          </a>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        {car.images.length > 0 && (
          <section>
            <div className="rounded-2xl overflow-hidden border border-[#1A3D3D] bg-black aspect-video">
              {heroSrc && <img src={heroSrc} alt={car.title} className="w-full h-full object-cover" />}
            </div>
            {car.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {car.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setHeroIdx(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${i === heroIdx ? 'border-[#00C896]' : 'border-transparent'}`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-[#E6F5F0] mb-4">Description</h2>
          <p className="text-[#8AADA8] leading-relaxed max-w-3xl whitespace-pre-line">{car.description}</p>
        </section>

        {car.features.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#E6F5F0] mb-6">Features</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {car.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-[#1A3D3D] bg-[#0A2020]">
                  <span className="mt-0.5 flex-shrink-0 text-[#00C896]"><CheckIcon /></span>
                  <span className="text-sm text-[#C8E8E0] leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-[#00C896]/20 bg-[#0A2828] p-8 text-center">
          <p className="text-[#8AADA8] mb-1">Listed by</p>
          {listerHref ? (
            <Link to={listerHref} className="text-lg font-semibold text-[#00C896] hover:underline">{listerName}</Link>
          ) : (
            <p className="text-lg font-semibold text-[#E6F5F0]">{listerName}</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default CarDetail
