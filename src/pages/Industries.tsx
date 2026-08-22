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
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect x="5" y="10" width="30" height="25" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 17H35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M20 10V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="13" y="22" width="5" height="5" rx="0.8" stroke="currentColor" strokeWidth="1.5" />
    <rect x="22" y="22" width="5" height="5" rx="0.8" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const ShortLetIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M7 18L20 6L33 18V35H26V26H14V35H7V18Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const CorporateIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect x="4" y="8" width="32" height="27" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 17H36" stroke="currentColor" strokeWidth="1.8" />
    <rect x="9" y="22" width="5" height="5" rx="0.8" stroke="currentColor" strokeWidth="1.5" />
    <rect x="17.5" y="22" width="5" height="5" rx="0.8" stroke="currentColor" strokeWidth="1.5" />
    <rect x="26" y="22" width="5" height="5" rx="0.8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13 8V4M27 8V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const HospitalIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect x="5" y="8" width="30" height="27" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M16 20H24M20 16V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 35V27H17V35M23 35V27H28V35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const WarehouseIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M3 16L20 5L37 16V37H3V16Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="15" y="27" width="10" height="10" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 16H37" stroke="currentColor" strokeWidth="1.8" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10H16M12 6L16 10L12 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  {
    id: 'hotels',
    icon: <HotelIcon />,
    label: 'Hotels',
    tagline: 'Full-building room intelligence for hotel operators.',
    body: [
      'Running a hotel means managing energy, housekeeping, maintenance, and guest experience simultaneously, across dozens or hundreds of rooms. Manual processes and delayed information make this harder than it needs to be.',
      'AZ SmartSystem Lab gives hotel operators a live dashboard showing the status of every room: occupied or vacant, energy usage, cleaning readiness, and any active maintenance alerts. The result is a hotel that runs more efficiently, costs less to operate, and delivers a more consistent guest experience.',
    ],
    stats: [
      { value: '12+', label: 'Modules in AI Room Manager' },
      { value: '24/7', label: 'Live room monitoring' },
      { value: '0', label: 'Cameras required' },
    ],
    useCases: [
      'Automated energy cutoff in unoccupied rooms',
      'Real-time housekeeping alerts on guest checkout',
      'Predictive maintenance before equipment fails',
      'Occupancy limit monitoring per floor',
      'Emergency alert system for critical situations',
    ],
    product: 'AI Room Manager',
    productSlug: 'ai-room-manager',
    accent: '#00C896',
    bg: 'rgba(0, 200, 150, 0.05)',
  },
  {
    id: 'short-let',
    icon: <ShortLetIcon />,
    label: 'Short-Let Properties',
    tagline: 'Remote visibility across your entire short-let portfolio.',
    body: [
      'Short-let and serviced apartment operators face a unique challenge: managing multiple units, often across different locations, with a small team and no front desk. Guest turnover is fast, energy is expensive, and you rarely have eyes on the property between stays.',
      'AZ SmartSystem Lab gives short-let operators remote, real-time visibility into every unit. Energy usage, occupancy state, and cleaning readiness are all visible from a single dashboard, no matter where you are.',
    ],
    stats: [
      { value: 'Real-time', label: 'Energy monitoring per unit' },
      { value: 'Instant', label: 'Checkout cleaning alerts' },
      { value: '100%', label: 'Remote visibility' },
    ],
    useCases: [
      'Per-unit energy usage tracking and reporting',
      'Automated cleaning alerts on guest departure',
      'Appliance state monitoring between stays',
      'Anomaly alerts for energy spikes or unusual activity',
      'Portfolio-level consumption analytics',
    ],
    product: 'AZ Energy Monitor',
    productSlug: 'az-energy-monitor',
    accent: '#4FC3F7',
    bg: 'rgba(79, 195, 247, 0.05)',
  },
  {
    id: 'corporate',
    icon: <CorporateIcon />,
    label: 'Corporate Facilities',
    tagline: 'Workspace intelligence for modern office management.',
    body: [
      'Corporate facilities teams are under pressure to reduce operating costs and demonstrate space efficiency. But without real-time data on how spaces are being used, decisions about heating, cooling, lighting, and capacity planning are made on assumptions, not evidence.',
      'AZ SmartSystem Lab delivers zone-level occupancy data, energy visibility, and asset tracking across your office footprint, giving facilities teams the data they need to optimise space, reduce costs, and plan confidently.',
    ],
    stats: [
      { value: 'Zone', label: 'Level occupancy sensing' },
      { value: 'Automated', label: 'Energy zone control' },
      { value: 'Live', label: 'Asset location tracking' },
    ],
    useCases: [
      'Zone occupancy data for space utilisation reporting',
      'Automated climate control based on actual usage',
      'Asset tracking across floors and meeting rooms',
      'Energy reporting for sustainability and ESG targets',
      'Desk and space utilisation analytics',
    ],
    product: 'AI Room Manager',
    productSlug: 'ai-room-manager',
    accent: '#A78BFA',
    bg: 'rgba(167, 139, 250, 0.05)',
  },
  {
    id: 'healthcare',
    icon: <HospitalIcon />,
    label: 'Healthcare Facilities',
    tagline: 'Operational intelligence for patient-safe environments.',
    body: [
      'Hospitals and clinics need to track room turnover for infection control, locate medical equipment quickly, and maintain safe environmental conditions around the clock. These are precision requirements that manual processes cannot meet reliably.',
      'AZ SmartSystem Lab delivers privacy-safe sensor intelligence designed for healthcare environments: room status tracking for discharge readiness, equipment location, and environmental monitoring, all without cameras or audio capture.',
    ],
    stats: [
      { value: 'Privacy', label: 'Safe architecture' },
      { value: 'Real-time', label: 'Room status tracking' },
      { value: 'Asset', label: 'Location visibility' },
    ],
    useCases: [
      'Room discharge and admission readiness tracking',
      'Medical equipment location and availability',
      'Environmental condition monitoring',
      'Energy management in non-clinical areas',
      'Emergency alert integration',
    ],
    product: 'AZ Asset Tracker',
    productSlug: 'az-asset-tracker',
    accent: '#F87171',
    bg: 'rgba(248, 113, 113, 0.05)',
  },
  {
    id: 'warehouses',
    icon: <WarehouseIcon />,
    label: 'Warehouses',
    tagline: 'Asset tracking and energy control at warehouse scale.',
    body: [
      'Warehouse operations depend on knowing exactly where every asset and piece of equipment is, and keeping energy costs under control across large, always-on spaces. Manual audits are slow and unreliable. Energy bills are large and opaque.',
      'AZ SmartSystem Lab provides real-time asset tracking and energy monitoring designed for warehouse-scale deployments. Know where everything is, control what is consuming energy, and automate alerts when something is out of place.',
    ],
    stats: [
      { value: 'Real-time', label: 'Asset location' },
      { value: 'Automated', label: 'Anomaly alerts' },
      { value: 'Audit', label: 'Ready reporting' },
    ],
    useCases: [
      'Real-time asset and equipment location tracking',
      'Loss prevention and movement alerts',
      'Zone energy monitoring and optimisation',
      'Maintenance schedule automation',
      'Inventory audit reporting',
    ],
    product: 'AZ Asset Tracker',
    productSlug: 'az-asset-tracker',
    accent: '#FBBF24',
    bg: 'rgba(251, 191, 36, 0.05)',
  },
]

// ─── Industries page ──────────────────────────────────────────────────────────

const Industries = () => (
  <div className="overflow-x-hidden">
    <SeoHead
      title="Industries We Serve"
      description="AZ SmartSystem Lab products are purpose-built for hotels, short-let properties, corporate offices, healthcare facilities, and warehouses across Africa."
    />

    {/* ── Hero ──────────────────────────────────────────────────────────────── */}
    <section
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A2828 0%, #071A1A 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 30% 50%, rgba(0,200,150,0.07) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-5"
        >
          Industries
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-white leading-tight"
        >
          Smart operations for every{' '}
          <span className="text-brand-green">property type.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-6 text-lg text-[#A8D5C8] leading-relaxed max-w-2xl"
        >
          AZ SmartSystem Lab products are designed to fit the specific operational challenges of each
          industry we serve. The same platform, adapted to your environment.
        </motion.p>

        {/* Industry quick-jump pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          {INDUSTRIES.map(({ id, label, accent }) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-xs font-semibold px-4 py-2 rounded-full border transition-colors"
              style={{
                color: accent,
                borderColor: `${accent}40`,
                backgroundColor: `${accent}10`,
              }}
            >
              {label}
            </a>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── Industry sections ─────────────────────────────────────────────────── */}
    <div className="py-20 bg-brand-bg">
      <div className="max-w-6xl mx-auto px-6 space-y-20">
        {INDUSTRIES.map(({ id, icon, label, tagline, body, stats, useCases, product, productSlug, accent, bg }, i) => (
          <FadeUp key={id} delay={0.05}>
            <div id={id} className="scroll-mt-20">

              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ color: accent, background: bg }}
                >
                  {icon}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                    {label}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-brand-text-h leading-tight">
                    {tagline}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Body text */}
                <div className="lg:col-span-2 space-y-4">
                  {body.map((para, pi) => (
                    <p key={pi} className="text-sm text-brand-text-muted leading-relaxed">{para}</p>
                  ))}

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {stats.map(({ value, label: statLabel }) => (
                      <div
                        key={statLabel}
                        className="text-center p-4 rounded-xl border border-brand-border bg-brand-bg-alt"
                      >
                        <div className="text-lg font-bold" style={{ color: accent }}>{value}</div>
                        <div className="text-xs text-brand-text-muted mt-0.5">{statLabel}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use cases + CTA */}
                <div
                  className="rounded-2xl p-6 border"
                  style={{ background: bg, borderColor: `${accent}30` }}
                >
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>
                    Key Use Cases
                  </h3>
                  <ul className="space-y-2.5 mb-6">
                    {useCases.map(u => (
                      <li key={u} className="flex items-start gap-2.5 text-sm text-brand-text-muted">
                        <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                        {u}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/products/${productSlug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{ color: accent }}
                  >
                    Explore {product}
                    <ArrowIcon />
                  </Link>
                </div>

              </div>

              {/* Divider */}
              {i < INDUSTRIES.length - 1 && (
                <div className="mt-16 border-t border-brand-border" />
              )}
            </div>
          </FadeUp>
        ))}
      </div>
    </div>

    {/* ── CTA ───────────────────────────────────────────────────────────────── */}
    <section
      className="py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A2828 0%, #071A1A 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 70% 50%, rgba(0,200,150,0.07) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <FadeUp className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <span className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-4">
          Your Industry
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          See how AZ SmartSystem Lab fits your property.
        </h2>
        <p className="mt-5 text-[#A8D5C8] leading-relaxed">
          Every deployment is configured to the property layout, operational workflows, and specific
          challenges of your team. Request a free consultation and we will map the right solution
          to your environment.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <Button size="lg" variant="primary">Request a Consultation</Button>
          </Link>
          <Link to="/solutions">
            <Button size="lg" variant="secondary">View Solutions</Button>
          </Link>
        </div>
      </FadeUp>
    </section>
  </div>
)

export default Industries
