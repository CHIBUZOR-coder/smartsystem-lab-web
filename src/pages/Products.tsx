import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../lib/api'
import Badge from '../components/ui/Badge'
import { SkeletonCard } from '../components/ui/SkeletonBox'
import { PRODUCT_VISUALS, FALLBACK_VISUAL } from '../lib/productVisuals'
import SeoHead from '../components/ui/SeoHead'

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductStatus = 'AVAILABLE' | 'PILOT' | 'COMING_SOON'
type Filter        = 'ALL' | ProductStatus

interface Product {
  id:       string
  slug:     string
  name:     string
  tagline:  string
  category: string
  status:   ProductStatus
  imageUrl: string | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All',         value: 'ALL' },
  { label: 'Available',   value: 'AVAILABLE' },
  { label: 'Pilot',       value: 'PILOT' },
  { label: 'Coming Soon', value: 'COMING_SOON' },
]

function toStatusBadge(s: ProductStatus): 'available' | 'pilot' | 'coming-soon' {
  if (s === 'AVAILABLE') return 'available'
  if (s === 'PILOT')     return 'pilot'
  return 'coming-soon'
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ─── Product card ─────────────────────────────────────────────────────────────

const ProductCard = ({ product }: { product: Product }) => {
  const visual = PRODUCT_VISUALS[product.slug] ?? FALLBACK_VISUAL

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
      className="h-full"
    >
      <Link
        to={`/products/${product.slug}`}
        className="group relative flex flex-col h-full rounded-2xl border border-[#1A3D3D] bg-[#0D2424] overflow-hidden transition-all duration-300
          hover:border-[#00C896]/50
          hover:shadow-[0_0_0_1px_rgba(0,200,150,0.18),0_8px_32px_rgba(0,200,150,0.10),0_24px_56px_rgba(0,0,0,0.30)]"
      >
        {/* Top spotlight glow */}
        <div
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 90% 45% at 50% 0%, rgba(0,200,150,0.25) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* Visual header */}
        <div className="relative z-10 h-48 overflow-hidden" style={{ background: visual.bg }}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 p-6 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500">
              {visual.illustration}
            </div>
          )}
          {/* Green wash on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(180deg, rgba(0,200,150,0.20) 0%, transparent 60%)' }}
            aria-hidden="true"
          />
          <div className="absolute top-3 left-3">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-black/40 text-[#00C896] backdrop-blur-sm border border-[#00C896]/20 group-hover:border-[#00C896]/50 group-hover:bg-[#00C896]/10 transition-all duration-300">
              {product.category}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="relative z-10 flex flex-col flex-1 p-5 gap-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-[#E6F5F0] leading-snug group-hover:text-[#00C896] transition-colors duration-300">
              {product.name}
            </h3>
            <Badge status={toStatusBadge(product.status)} />
          </div>
          <p className="text-sm text-[#8AADA8] leading-relaxed">{product.tagline}</p>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00C896] pt-1">
            See full details
            <span className="translate-x-0 group-hover:translate-x-1.5 transition-transform duration-200">
              <ArrowRightIcon />
            </span>
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Products = () => {
  const [filter, setFilter] = useState<Filter>('ALL')

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get<Product[]>('/api/products')
      return data
    },
  })

  const filtered = filter === 'ALL' ? products : products?.filter(p => p.status === filter)

  return (
    <div className="min-h-screen bg-[#061414]">
      <SeoHead
        title="Products"
        description="Explore the AZ SmartSystem Lab product range — AI Room Manager, AZ Energy Monitor, and AZ Asset Tracker. Smart building intelligence for African property operators."
      />

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2828] to-[#061414]" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold tracking-widest uppercase text-[#00C896] mb-3"
          >
            Our Products
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-[#E6F5F0] mb-4"
          >
            IoT + AI, built for Africa
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#8AADA8] max-w-2xl mx-auto"
          >
            From smart room management to real-time asset tracking, every product is
            field-tested in African environments before it reaches your hands.
          </motion.p>
        </div>
      </section>

      {/* ── Filter tabs ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => {
            const count = f.value !== 'ALL' && products
              ? products.filter(p => p.status === f.value).length
              : null
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
                className={[
                  'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C896] focus-visible:ring-offset-2',
                  filter === f.value
                    ? 'bg-[#00C896] text-[#061414] border-[#00C896]'
                    : 'bg-transparent text-[#638A85] border-[#1A3D3D] hover:border-[#00C896]/40 hover:text-[#00C896]',
                ].join(' ')}
              >
                {f.label}
                {count !== null && (
                  <span className="ml-1.5 opacity-60">({count})</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && (
          <p className="text-center text-red-400 py-16">
            Failed to load products. Please try again.
          </p>
        )}

        {!isLoading && filtered?.length === 0 && (
          <p className="text-center text-[#638A85] py-16">
            No products in this category yet.
          </p>
        )}

        {filtered && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Products
