import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import SeoHead from '../components/ui/SeoHead'

// ─── Animation helper ─────────────────────────────────────────────────────────

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
  const inView = useInView(ref, { once: true, margin: '-70px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const HotelIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="4" y="8" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 14H28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 8V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="10" y="18" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="18" y="18" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const ShortLetIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M6 14L16 4L26 14V28H20V20H12V28H6V14Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="16" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const CorporateIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="3" y="6" width="26" height="22" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 13H29" stroke="currentColor" strokeWidth="1.8" />
    <rect x="8" y="17" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14" y="17" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="20" y="17" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 6V3M22 6V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const HospitalIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="4" y="6" width="24" height="22" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M13 14H19M16 11V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 28V22H14V28M18 28V22H22V28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const WarehouseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M2 12L16 4L30 12V28H2V12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="12" y="20" width="8" height="8" stroke="currentColor" strokeWidth="1.8" />
    <path d="M2 12H30" stroke="currentColor" strokeWidth="1.8" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────

const SOLUTIONS = [
  {
    id: 'hotels',
    icon: <HotelIcon />,
    label: 'Hotels',
    headline: 'Complete hotel room intelligence, without cameras.',
    description:
      'Hotel operations involve dozens of moving parts across every shift. AI Room Manager gives hotel management teams a live, unified view of every room, floor by floor, so nothing is missed and no energy is wasted.',
    challenges: [
      'Energy waste in unoccupied rooms',
      'Delayed housekeeping response',
      'Manual occupancy tracking',
      'Equipment failures going undetected',
    ],
    howWeHelp: [
      'Automated energy control based on real occupancy state',
      'Sensor-triggered cleaning alerts the moment a guest checks out',
      'Live occupancy dashboard across all rooms and floors',
      'Predictive maintenance alerts before equipment fails',
    ],
    product: 'AI Room Manager',
    productSlug: 'ai-room-manager',
    accent: '#00C896',
  },
  {
    id: 'short-let',
    icon: <ShortLetIcon />,
    label: 'Short-Let Properties',
    headline: 'Smart oversight across your entire short-let portfolio.',
    description:
      'Managing multiple short-let units means staying on top of turnover, energy, and maintenance across properties you cannot physically be in at all times. Our platform gives you remote, real-time visibility into every unit.',
    challenges: [
      'No real-time visibility into energy use',
      'Manual cleaning coordination',
      'Unknown appliance state between guest stays',
      'Utility bills with no actionable breakdown',
    ],
    howWeHelp: [
      'Real-time energy monitoring per unit',
      'Automated cleaning alerts on guest departure',
      'Appliance-level usage tracking',
      'Consumption reports for smarter utility management',
    ],
    product: 'AZ Energy Monitor',
    productSlug: 'az-energy-monitor',
    accent: '#4FC3F7',
  },
  {
    id: 'corporate',
    icon: <CorporateIcon />,
    label: 'Corporate Facilities',
    headline: 'Intelligent workspace management for modern offices.',
    description:
      'Corporate facilities teams need to balance occupancy efficiency, energy usage, and asset accountability across large floor plates. Our platform delivers all three from a single operations dashboard.',
    challenges: [
      'Meeting rooms booked but never used',
      'Energy running in empty zones',
      'Asset tracking done manually at audit time',
      'No real-time floor occupancy data',
    ],
    howWeHelp: [
      'Zone-level occupancy sensing with live dashboard',
      'Automated climate control based on real occupancy',
      'Asset presence tracking across floors',
      'Space utilisation analytics for lease optimisation',
    ],
    product: 'AI Room Manager',
    productSlug: 'ai-room-manager',
    accent: '#A78BFA',
  },
  {
    id: 'hospitals',
    icon: <HospitalIcon />,
    label: 'Healthcare Facilities',
    headline: 'Operational intelligence for patient-safe environments.',
    description:
      'Hospitals and clinics require precision in room management, infection control scheduling, and critical equipment tracking. Our privacy-safe sensor architecture delivers this intelligence without compromising patient dignity.',
    challenges: [
      'Room turnover and cleaning compliance tracking',
      'Equipment location and availability',
      'Energy efficiency across always-on environments',
      'Emergency response coordination',
    ],
    howWeHelp: [
      'Room status tracking for discharge and admission readiness',
      'Asset tracking for critical medical equipment',
      'Energy monitoring in non-patient areas',
      'Emergency alert integration',
    ],
    product: 'AZ Asset Tracker',
    productSlug: 'az-asset-tracker',
    accent: '#F87171',
  },
  {
    id: 'warehouses',
    icon: <WarehouseIcon />,
    label: 'Warehouses',
    headline: 'Asset visibility and energy control at scale.',
    description:
      'Warehouse operations depend on knowing where every item is and keeping energy and operational costs in check. AZ Asset Tracker and AZ Energy Monitor work together to give facilities managers full control.',
    challenges: [
      'Manual stock and asset audits',
      'Energy waste from lighting and climate systems',
      'Equipment downtime from deferred maintenance',
      'No automated anomaly detection',
    ],
    howWeHelp: [
      'Real-time asset location and movement tracking',
      'Zone-level energy monitoring',
      'Maintenance schedule automation',
      'Anomaly and loss prevention alerts',
    ],
    product: 'AZ Asset Tracker',
    productSlug: 'az-asset-tracker',
    accent: '#FBBF24',
  },
]

// ─── Solutions page ───────────────────────────────────────────────────────────

const Solutions = () => (
  <div className="overflow-x-hidden">
    <SeoHead
      title="Solutions"
      description="Industry-specific smart building solutions for hotels, short-let properties, corporate facilities, healthcare, and warehouses — powered by AZ SmartSystem Lab."
    />

    {/* ── Hero ──────────────────────────────────────────────────────────────── */}
    <section
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A2828 0%, #071A1A 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 70% 50%, rgba(0,200,150,0.07) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-5"
        >
          Solutions
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-white leading-tight"
        >
          Built for the industries{' '}
          <span className="text-brand-green">that power Africa's growth.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-6 text-lg text-[#A8D5C8] leading-relaxed max-w-2xl"
        >
          AZ SmartSystem Lab products are purpose-built for property operators across hospitality,
          healthcare, corporate, and logistics. Real challenges. Real solutions. No configuration required.
        </motion.p>
      </div>
    </section>

    {/* ── Industry cards ────────────────────────────────────────────────────── */}
    <section className="py-20 bg-brand-bg">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {SOLUTIONS.map(
          ({ id, icon, label, headline, description, challenges, howWeHelp, product, productSlug, accent }, i) => (
            <FadeUp key={id} delay={0.05}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start p-8 rounded-2xl border border-brand-border bg-brand-bg-alt">

                {/* Left: info */}
                <div>
                  <span className="inline-flex items-center gap-3 mb-5" style={{ color: accent }}>
                    {icon}
                    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-brand-text-h leading-tight mb-4">
                    {headline}
                  </h2>
                  <p className="text-brand-text-muted text-sm leading-relaxed">{description}</p>

                  <div className="mt-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text-muted mb-3">
                      Common Challenges
                    </h3>
                    <ul className="space-y-2">
                      {challenges.map(c => (
                        <li key={c} className="flex items-start gap-2 text-sm text-brand-text-muted">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-text-muted/40 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: how we help */}
                <div className="rounded-xl border border-brand-border bg-brand-bg p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>
                    How We Help
                  </h3>
                  <ul className="space-y-3 mb-8">
                    {howWeHelp.map(h => (
                      <li key={h} className="flex items-start gap-3 text-sm text-brand-text-muted">
                        <span className="mt-0.5 flex-shrink-0" style={{ color: accent }}>
                          <CheckIcon />
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to={`/products/${productSlug}`}>
                      <Button size="sm" variant="primary">
                        Explore {product}
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button size="sm" variant="secondary">
                        Request Demo
                      </Button>
                    </Link>
                  </div>
                </div>

              </div>
            </FadeUp>
          )
        )}
      </div>
    </section>

    {/* ── CTA ───────────────────────────────────────────────────────────────── */}
    <section
      className="py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A2828 0%, #071A1A 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 30% 50%, rgba(0,200,150,0.07) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <FadeUp className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <span className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-4">
          Get Started
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Not sure which solution fits your property?
        </h2>
        <p className="mt-5 text-[#A8D5C8] leading-relaxed">
          Talk to our team. We will assess your property type, operational challenges, and deployment
          requirements, and recommend the right combination of AZ SmartSystem Lab products for your needs.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <Button size="lg" variant="primary">Request a Consultation</Button>
          </Link>
          <Link to="/products">
            <Button size="lg" variant="secondary">Browse All Products</Button>
          </Link>
        </div>
      </FadeUp>
    </section>
  </div>
)

export default Solutions
