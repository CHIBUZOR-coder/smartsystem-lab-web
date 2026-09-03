import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '../lib/api'
import Badge from '../components/ui/Badge'
import { PRODUCT_VISUALS, FALLBACK_VISUAL, getProductImageSources, getProductVideoUrl } from '../lib/productVisuals'
import SeoHead from '../components/ui/SeoHead'

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductStatus = 'AVAILABLE' | 'PILOT' | 'COMING_SOON'

interface Product {
  id:          string
  slug:        string
  name:        string
  tagline:     string
  description: string
  category:    string
  status:      ProductStatus
  features:    unknown
  targetUsers: unknown
  imageUrl:    string | null
  videoUrl:    string | null
}

function toStatusBadge(s: ProductStatus): 'available' | 'pilot' | 'coming-soon' {
  if (s === 'AVAILABLE') return 'available'
  if (s === 'PILOT')     return 'pilot'
  return 'coming-soon'
}

function toStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
}

// ─── Icons ────────────────────────────────────────────────────────────────────

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

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const ProductDetailPageSkeleton = () => (
  <div className="min-h-screen bg-[#061414]" aria-hidden="true">
    {/* Hero: mimics pt-24 pb-20 with dark gradient */}
    <section className="relative pt-24 pb-20 overflow-hidden bg-[#0A2020]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A2828] to-[#061414]" />
      <div className="relative max-w-5xl mx-auto px-6 space-y-4">
        {/* Back nav */}
        <div className="h-4 w-28 rounded bg-[#132F2F] animate-pulse mb-10" />
        {/* Category + status */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-28 rounded-full bg-[#132F2F] animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-[#132F2F] animate-pulse" />
        </div>
        {/* Product name */}
        <div className="h-11 w-80 rounded-lg bg-[#132F2F] animate-pulse max-w-full" />
        <div className="h-11 w-56 rounded-lg bg-[#132F2F] animate-pulse max-w-full" />
        {/* Tagline */}
        <div className="h-5 w-96 max-w-full rounded bg-[#132F2F] animate-pulse" />
        <div className="h-5 w-72 max-w-full rounded bg-[#132F2F] animate-pulse" />
        {/* CTA button */}
        <div className="h-12 w-40 rounded-xl bg-[#00C896]/20 animate-pulse mt-8" />
      </div>
    </section>

    {/* Main content */}
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
      {/* Description */}
      <div className="space-y-3">
        <div className="h-7 w-44 rounded-lg bg-[#0D2424] animate-pulse" />
        <div className="h-4 w-full rounded bg-[#0D2424] animate-pulse" />
        <div className="h-4 w-full rounded bg-[#0D2424] animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-[#0D2424] animate-pulse" />
      </div>

      {/* Features grid (6 items, 2 cols) */}
      <div className="space-y-4">
        <div className="h-6 w-36 rounded bg-[#0D2424] animate-pulse" />
        <div className="grid sm:grid-cols-2 gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-14 rounded-xl bg-[#0D2424] animate-pulse" />
          ))}
        </div>
      </div>

      {/* Target users */}
      <div className="space-y-3">
        <div className="h-6 w-32 rounded bg-[#0D2424] animate-pulse" />
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00C896]/20 animate-pulse flex-shrink-0" />
            <div className={`h-4 rounded bg-[#0D2424] animate-pulse ${['w-56', 'w-72', 'w-48'][i]}`} />
          </div>
        ))}
      </div>

      {/* Related products row */}
      <div className="space-y-4">
        <div className="h-6 w-44 rounded bg-[#0D2424] animate-pulse" />
        <div className="grid sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-[#1A3D3D] bg-[#0D2424]">
              <div className="w-14 h-14 rounded-lg bg-[#132F2F] animate-pulse flex-shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="h-4 w-3/4 rounded bg-[#132F2F] animate-pulse" />
                <div className="h-3 w-full rounded bg-[#132F2F] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

// ─── Related card (mini) ──────────────────────────────────────────────────────

const RelatedCard = ({ product }: { product: Product }) => {
  const visual   = PRODUCT_VISUALS[product.slug] ?? FALLBACK_VISUAL
  const sources  = getProductImageSources(product.imageUrl, visual)
  const [srcIdx, setSrcIdx] = useState(0)
  const imgSrc   = sources[srcIdx] ?? null
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex items-center gap-4 p-4 rounded-xl border border-[#1A3D3D] bg-[#0D2424] hover:border-[#00C896]/40 transition-colors"
    >
      <div
        className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{ background: visual.bg }}
      >
        {imgSrc ? (
          <img src={imgSrc} alt={product.name} onError={() => setSrcIdx(i => i + 1)} className="w-full h-full object-cover" />
        ) : (
          <div className="w-12 h-12">{visual.illustration}</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#E6F5F0] truncate">{product.name}</p>
        <p className="text-xs text-[#638A85] mt-0.5 line-clamp-1">{product.tagline}</p>
      </div>
      <span className="text-[#00C896] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <ArrowRightIcon />
      </span>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ProductDetail = () => {
  const { slug }   = useParams<{ slug: string }>()
  const navigate   = useNavigate()
  // must be before any early returns
  const [heroIdx, setHeroIdx] = useState(0)

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get<Product>(`/api/products/${slug}`)
      return data
    },
    retry: (count, err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404) return false
      return count < 2
    },
  })

  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get<Product[]>('/api/products')
      return data
    },
  })

  if (isLoading) return <ProductDetailPageSkeleton />

  // 404 state
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-[#061414] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-5xl font-bold text-[#1A4040]">404</p>
        <h1 className="text-2xl font-bold text-[#E6F5F0]">Product not found</h1>
        <p className="text-[#8AADA8] max-w-xs">
          We couldn't find a product with that ID. It may have been moved or renamed.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="mt-2 px-6 py-2.5 rounded-xl bg-[#00C896] text-[#061414] font-semibold hover:bg-[#00E5AD] transition-colors"
        >
          Browse all products
        </button>
      </div>
    )
  }

  const visual      = PRODUCT_VISUALS[product.slug] ?? FALLBACK_VISUAL
  const features    = toStringArray(product.features)
  const targetUsers = toStringArray(product.targetUsers)
  const related     = allProducts?.filter(p => p.slug !== product.slug) ?? []
  const heroSources = getProductImageSources(product.imageUrl, visual)
  const heroSrc     = heroSources[heroIdx] ?? null
  const videoUrl    = getProductVideoUrl(product.videoUrl, visual)

  return (
    <div className="min-h-screen bg-[#061414]">
      <SeoHead
        title={product.name}
        description={product.tagline}
      />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-24 pb-20 overflow-hidden"
        style={{ background: visual.bg }}
      >
        {/* Illustration backdrop */}
        {!product.imageUrl && (
          <div className="absolute inset-0 flex items-end justify-end opacity-20 pointer-events-none">
            <div className="w-96 h-64 mr-8">{visual.illustration}</div>
          </div>
        )}
        {heroSrc && (
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={heroSrc}
              alt=""
              aria-hidden="true"
              onError={() => setHeroIdx(i => i + 1)}
              className="w-full h-full object-cover opacity-20"
            />
          </div>
        )}

        <div className="relative max-w-5xl mx-auto px-6">
          {/* Back nav */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-[#638A85] hover:text-[#00C896] transition-colors mb-10"
          >
            <ArrowLeftIcon /> All products
          </Link>

          {/* Category + status row */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-black/30 text-[#00C896] border border-[#00C896]/20">
              {product.category}
            </span>
            <Badge status={toStatusBadge(product.status)} />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#E6F5F0] mb-4 max-w-2xl"
          >
            {product.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#8AADA8] max-w-xl leading-relaxed"
          >
            {product.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00C896] text-[#061414] font-semibold hover:bg-[#00E5AD] transition-colors shadow-lg"
            >
              Request a demo <ArrowRightIcon />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">

        {/* Description */}
        <section>
          <h2 className="text-xl font-bold text-[#E6F5F0] mb-4">About this product</h2>
          <p className="text-[#8AADA8] leading-relaxed max-w-3xl whitespace-pre-line">
            {product.description}
          </p>
        </section>

        {/* Video — always shown; uses admin video if set, otherwise sample fallback */}
        {videoUrl && (
          <section>
            <h2 className="text-xl font-bold text-[#E6F5F0] mb-4">See it in action</h2>
            <div className="rounded-2xl overflow-hidden border border-[#1A3D3D] bg-black">
              <video
                src={videoUrl}
                controls
                poster={heroSrc || undefined}
                className="w-full aspect-video max-h-[60vh] block object-contain bg-black"
              >
                Your browser does not support the video element.
              </video>
            </div>
          </section>
        )}

        {/* Features */}
        {features.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#E6F5F0] mb-6">Key features</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3 p-4 rounded-xl border border-[#1A3D3D] bg-[#0A2020]"
                >
                  <span className="mt-0.5 flex-shrink-0 text-[#00C896]">
                    <CheckIcon />
                  </span>
                  <span className="text-sm text-[#C8E8E0] leading-snug">{feat}</span>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Target users */}
        {targetUsers.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#E6F5F0] mb-4">Who is it for?</h2>
            <div className="flex flex-wrap gap-2">
              {targetUsers.map((user, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-[#0A2828] text-[#8AADA8] border border-[#1A3D3D]"
                >
                  {user}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* CTA banner */}
        <section className="rounded-2xl border border-[#00C896]/20 bg-[#0A2828] p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-[#E6F5F0] mb-3">Ready to see it in action?</h2>
          <p className="text-[#8AADA8] mb-8 max-w-lg mx-auto">
            Book a live demo with our team. We'll walk you through the product, answer your
            questions, and design a pilot plan tailored to your facility.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#00C896] text-[#061414] font-semibold hover:bg-[#00E5AD] transition-colors"
          >
            Book a demo <ArrowRightIcon />
          </Link>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#E6F5F0] mb-5">Other products</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map(p => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
