import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import SeoHead from '../../components/ui/SeoHead'
import CarCard, { type PublicCar } from '../../components/garage/CarCard'

const DealerProfile = () => {
  const { dealerId } = useParams<{ dealerId: string }>()

  const { data: cars, isLoading } = useQuery({
    queryKey: ['cars', 'dealer', dealerId],
    queryFn: async () => {
      const { data } = await api.get<PublicCar[]>('/api/cars', { params: { dealerId } })
      return data
    },
    enabled: !!dealerId,
  })

  const dealerName = cars?.[0]?.dealer?.name ?? 'Dealer'

  return (
    <div className="min-h-screen bg-[#061414]">
      <SeoHead title={dealerName} description={`Cars listed by ${dealerName} on the Garage Section.`} />

      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2828] to-[#061414]" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <Link to="/garage" className="text-sm text-[#638A85] hover:text-[#00C896] transition-colors">← All cars</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-[#E6F5F0] mt-4">{isLoading ? 'Loading…' : dealerName}</h1>
          <p className="text-[#8AADA8] mt-2">Cars listed by this dealer</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        {!isLoading && cars?.length === 0 && (
          <p className="text-center text-[#638A85] py-16">No active listings from this dealer right now.</p>
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

export default DealerProfile
