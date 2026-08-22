import { useQuery } from '@tanstack/react-query'
import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import ParticleCanvas from '../components/ui/ParticleCanvas'
import Button from '../components/ui/Button'
import { PRODUCT_VISUALS, FALLBACK_VISUAL } from '../lib/productVisuals'
import SeoHead from '../components/ui/SeoHead'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  category: string
  status: 'AVAILABLE' | 'PILOT' | 'COMING_SOON'
  features: string[]
  imageUrl: string | null
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const HotelIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="3" y="10" width="22" height="16" rx="1" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 26V20H13V26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="16" y="19" width="5" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 10L14 3L25 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="11" y="14" width="6" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const ApartmentIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="5" y="3" width="18" height="24" rx="1" stroke="currentColor" strokeWidth="1.8" />
    <rect x="8" y="7" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="16" y="7" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="8" y="14" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="16" y="14" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 27V21H17V27" stroke="currentColor" strokeWidth="1.8" />
  </svg>
)

const HealthIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 24C14 24 4 18 4 10C4 6.69 6.69 4 10 4C11.89 4 13.58 4.88 14.71 6.24C15.84 4.88 17.53 4 19.42 4C22.73 4 25.42 6.69 25.42 10C25.42 18 14 24 14 24Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 9V15M11 12H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const WarehouseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M3 14L14 5L25 14V26H3V14Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <rect x="10" y="18" width="8" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M7 17V14M14 17V14M21 17V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const CorporateIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="9" y="2" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3" y="11" width="22" height="15" rx="1" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 26V20H12V26M16 26V20H19V26" stroke="currentColor" strokeWidth="1.6" />
    <rect x="6" y="14" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
    <rect x="18" y="14" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

const SensorIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M8 8C4.69 11.31 4.69 20.69 8 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 8C27.31 11.31 27.31 20.69 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M11 11C8.97 13.03 8.97 18.97 11 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M21 11C23.03 13.03 23.03 18.97 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const ChipIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="9" y="9" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
    <rect x="13" y="13" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13 9V5M19 9V5M13 27V23M19 27V23M9 13H5M9 19H5M23 13H27M23 19H27" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const BrainIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M12 26C12 26 6 24 6 16C6 10 10 6 16 6C22 6 26 10 26 16C26 24 20 26 20 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 6V26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 14C8 14 6 15.5 6 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M22 14C24 14 26 15.5 26 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="16" r="2" fill="currentColor" />
  </svg>
)

const DashboardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="4" y="5" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M4 10H28" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 23V27M12 27H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 15L12 13L15 16L19 12L23 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ─── Static data ──────────────────────────────────────────────────────────────

const INDUSTRIES: { name: string; desc: string; icon: ReactNode }[] = [
  {
    name: 'Hotels & Hospitality',
    icon: <HotelIcon />,
    desc: 'Automate housekeeping, slash energy bills, and deliver a seamless guest experience.',
  },
  {
    name: 'Short-Let Apartments',
    icon: <ApartmentIcon />,
    desc: 'Manage multiple units remotely with real-time occupancy and automated cleaning alerts.',
  },
  {
    name: 'Hospitals & Healthcare',
    icon: <HealthIcon />,
    desc: 'Track assets, monitor environments, and ensure compliance automatically.',
  },
  {
    name: 'Warehouses & Logistics',
    icon: <WarehouseIcon />,
    desc: 'Never lose an asset again — full real-time inventory and movement tracking.',
  },
  {
    name: 'Corporate Facilities',
    icon: <CorporateIcon />,
    desc: 'Optimise space utilisation and cut building running costs across your portfolio.',
  },
]

const TECH_STEPS: { step: string; title: string; desc: string; icon: ReactNode }[] = [
  {
    step: '01',
    title: 'IoT Sensors',
    desc: 'Wireless sensors detect occupancy, energy draw, motion, temperature, and more — across every room.',
    icon: <SensorIcon />,
  },
  {
    step: '02',
    title: 'Edge Processing',
    desc: 'Data is processed locally for instant response and continues sending to the cloud.',
    icon: <ChipIcon />,
  },
  {
    step: '03',
    title: 'AI Engine',
    desc: 'Patterns are analysed, anomalies flagged, and predictive insights generated continuously.',
    icon: <BrainIcon />,
  },
  {
    step: '04',
    title: 'Your Dashboard',
    desc: 'Actionable insights and automated workflows arrive in a single, real-time operations dashboard.',
    icon: <DashboardIcon />,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  light?: boolean
}) {
  return (
    <div className="text-center space-y-3">
      <span className="block text-xs font-semibold uppercase tracking-widest text-brand-green">
        {eyebrow}
      </span>
      <h2
        className={`text-3xl sm:text-4xl font-bold ${
          light ? 'text-white' : 'text-brand-text-h'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`max-w-2xl mx-auto text-base leading-relaxed ${
            light ? 'text-[#A8D5C8]' : 'text-brand-text-muted'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

const STATUS_LABEL: Record<Product['status'], string> = {
  AVAILABLE: 'Available',
  PILOT: 'Pilot',
  COMING_SOON: 'Coming Soon',
}

const STATUS_CLS: Record<Product['status'], string> = {
  AVAILABLE:
    'bg-brand-green-subtle text-[#00A87E] dark:bg-[#0A3028] dark:text-brand-green',
  PILOT:
    'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  COMING_SOON:
    'bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400',
}

function StatusBadge({ status }: { status: Product['status'] }) {
  return (
    <span
      className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_CLS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const visual = PRODUCT_VISUALS[product.slug] ?? FALLBACK_VISUAL

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
      className="h-full"
    >
      <Link
        to={`/products/${product.slug}`}
        className="group relative flex flex-col h-full bg-brand-surface rounded-2xl border border-brand-border overflow-hidden transition-all duration-300
          shadow-[0_2px_12px_rgba(0,0,0,0.07)]
          hover:border-brand-green/50
          hover:shadow-[0_0_0_1px_rgba(0,200,150,0.18),0_8px_32px_rgba(0,200,150,0.10),0_24px_56px_rgba(0,0,0,0.18)]"
      >
        {/* Top spotlight glow — fades in on hover */}
        <div
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 90% 45% at 50% 0%, rgba(0,200,150,0.22) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* Visual header */}
        <div className="relative z-10 h-44 overflow-hidden" style={{ background: visual.bg }}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 p-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              {visual.illustration}
            </div>
          )}
          {/* Image overlay shimmer on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(180deg, rgba(0,200,150,0.18) 0%, transparent 60%)' }}
            aria-hidden="true"
          />
          <div className="absolute top-3 right-3">
            <StatusBadge status={product.status} />
          </div>
        </div>

        {/* Card body */}
        <div className="relative z-10 flex flex-col flex-1 p-5 gap-4">
          <span className="text-xs font-medium text-brand-text-muted uppercase tracking-wider">
            {product.category}
          </span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-brand-text-h leading-snug group-hover:text-brand-green transition-colors duration-300">
              {product.name}
            </h3>
            <p className="mt-1.5 text-sm text-brand-text-muted leading-relaxed">{product.tagline}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green">
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

function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-brand-surface rounded-2xl border border-brand-border overflow-hidden">
      <div className="skeleton h-44" />
      <div className="p-5 space-y-4">
        <div className="skeleton h-3.5 w-20" />
        <div className="space-y-2">
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
        </div>
        <div className="skeleton h-4 w-24" />
      </div>
    </div>
  )
}

// ─── Home page ────────────────────────────────────────────────────────────────

const Home = () => {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => api.get<Product[]>('/api/products').then((r) => r.data),
  })

  return (
    <div className="overflow-x-hidden">
      <SeoHead
        title="Smart Building Intelligence for Africa"
        description="AZ SmartSystem Lab builds AI-powered occupancy sensing, energy monitoring, and asset tracking products for hotels, short-let properties, and corporate facilities across Africa."
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        aria-label="Hero"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A2828 0%, #071A1A 100%)' }}
      >
        <ParticleCanvas />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-semibold uppercase tracking-widest text-brand-green mb-6"
          >
            AI-Powered IoT Platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
          >
            Intelligent Spaces.{' '}
            <span className="text-brand-green">Smarter Operations.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-[#A8D5C8] max-w-2xl mx-auto leading-relaxed"
          >
            AZ SmartSystem Lab builds IoT + AI products that give African businesses
            real-time visibility, automated operations, and measurable cost savings — from day one.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/contact">
              <Button size="lg" variant="primary">Request a Demo</Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="secondary">Explore Products</Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-widest text-[#638A85]">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="w-0.5 h-6 bg-brand-green/40 rounded-full"
          />
        </motion.div>
      </section>

      {/* ── Products ──────────────────────────────────────────────────────── */}
      <section aria-label="Products" className="py-20 bg-brand-bg-alt">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <SectionHeader
              eyebrow="Our Products"
              title="A growing suite of IoT products."
              subtitle="Each product solves a specific operational challenge — and they work even better together."
            />
          </FadeUp>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {isLoading
              ? [0, 1, 2].map((i) => <ProductSkeleton key={i} />)
              : (products ?? []).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
          </div>

          <FadeUp className="mt-10 text-center" delay={0.3}>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-brand-green font-semibold hover:text-[#00A87E] transition-colors"
            >
              View all products <ArrowRightIcon />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── Industries ────────────────────────────────────────────────────── */}
      <section aria-label="Industries" className="py-20 bg-brand-bg">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <SectionHeader
              eyebrow="Industries"
              title="Built for every property type."
              subtitle="From hospitality to healthcare — our products are designed to fit the operational realities of each industry we serve."
            />
          </FadeUp>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {INDUSTRIES.map(({ name, icon, desc }, i) => (
              <FadeUp key={name} delay={i * 0.08}>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-brand-border bg-brand-bg-alt hover:border-brand-green/40 hover:shadow-sm transition-all h-full gap-4">
                  <span className="text-brand-green">{icon}</span>
                  <span className="font-semibold text-brand-text-h text-sm">{name}</span>
                  <p className="text-xs text-brand-text-muted leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section aria-label="How it works" className="py-20 bg-brand-bg-alt">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <SectionHeader
              eyebrow="Technology"
              title="How our products work."
              subtitle="Every AZ SmartSystem Lab product follows the same architecture — sensors on the ground, AI in the cloud, insights in your hands."
            />
          </FadeUp>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line (desktop only) */}
            <div
              className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-brand-border via-brand-green/30 to-brand-border"
              aria-hidden="true"
            />

            {TECH_STEPS.map(({ step, title, desc, icon }, i) => (
              <FadeUp key={step} delay={i * 0.12}>
                <div className="flex flex-col items-center text-center gap-4 relative">
                  <div className="relative z-10 w-20 h-20 rounded-2xl border border-brand-border bg-brand-surface flex items-center justify-center text-brand-green shadow-sm">
                    {icon}
                  </div>
                  <span className="absolute top-0 right-1/4 text-xs font-bold text-brand-green/40">
                    {step}
                  </span>
                  <div>
                    <h3 className="font-bold text-brand-text-h">{title}</h3>
                    <p className="mt-2 text-sm text-brand-text-muted leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp className="mt-12 text-center" delay={0.4}>
            <Link to="/technology">
              <Button variant="secondary" size="md">Learn about our technology</Button>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section
        aria-label="Call to action"
        className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A2828 0%, #071A1A 100%)' }}
      >
        {/* Decorative glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(0,200,150,0.08) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <FadeUp>
            <span className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-4">
              Get Started
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              See what AZ SmartSystem Lab can do for your property.
            </h2>
            <p className="mt-5 text-[#A8D5C8] text-lg leading-relaxed">
              Talk to our team. We'll show you exactly which of our products fit your
              operation — and what you can expect to save in the first 30 days.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="primary">Request a Demo</Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="secondary">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}

export default Home
