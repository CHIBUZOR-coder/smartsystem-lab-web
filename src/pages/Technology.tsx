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

const SensorIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <circle cx="18" cy="18" r="5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 9C6.24 11.76 5 14.76 5 18C5 21.24 6.24 24.24 9 27" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M27 9C29.76 11.76 31 14.76 31 18C31 21.24 29.76 24.24 27 27" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M13 13C11.34 14.66 10.5 16.3 10.5 18C10.5 19.7 11.34 21.34 13 23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M23 13C24.66 14.66 25.5 16.3 25.5 18C25.5 19.7 24.66 21.34 23 23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="18" cy="18" r="2" fill="currentColor" />
  </svg>
)

const EdgeIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect x="6" y="10" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M10 18H26M14 14V22M22 14V22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M13 30H23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 26V30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const CloudIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path d="M10 26C7.24 26 5 23.76 5 21C5 18.58 6.74 16.56 9.06 16.1C9.02 15.74 9 15.38 9 15C9 10.58 12.58 7 17 7C20.84 7 24.06 9.56 25.14 13.06C25.42 13.02 25.7 13 26 13C28.76 13 31 15.24 31 18C31 20.76 28.76 23 26 23H25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 22V31M15 28L18 31L21 28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const AIIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <circle cx="18" cy="18" r="10" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 18C12 14.69 14.69 12 18 12C21.31 12 24 14.69 24 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14 22C14.91 23.21 16.37 24 18 24C19.63 24 21.09 23.21 22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="15" cy="18" r="1.5" fill="currentColor" />
    <circle cx="21" cy="18" r="1.5" fill="currentColor" />
    <path d="M7 18H4M32 18H29M18 7V4M18 32V29" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const DashboardIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect x="4" y="6" width="28" height="24" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 12H32" stroke="currentColor" strokeWidth="1.8" />
    <rect x="8" y="16" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M20 21H28M20 25H25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="9" r="1" fill="currentColor" />
    <circle cx="12.5" cy="9" r="1" fill="currentColor" />
    <circle cx="16" cy="9" r="1" fill="currentColor" />
  </svg>
)

const PrivacyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 3L4 7.5V14C4 19.25 8.4 24.17 14 25.5C19.6 24.17 24 19.25 24 14V7.5L14 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 14L13 17L18 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const WirelessIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M3 10C6.31 6.69 10.93 5 14 5C17.07 5 21.69 6.69 25 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M6.5 13.5C8.86 11.14 11.36 10 14 10C16.64 10 19.14 11.14 21.5 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 17C11.38 15.62 12.65 15 14 15C15.35 15 16.62 15.62 18 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="14" cy="21" r="2" fill="currentColor" />
  </svg>
)

const ScaleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M4 20L10 12L16 16L22 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="22" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 24H24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const OpenIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="16" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="4" y="16" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M20 16V20M20 20V24M20 20H16M20 20H24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────

const LAYERS = [
  {
    step: '01',
    icon: <SensorIcon />,
    title: 'Smart Sensors',
    subtitle: 'Physical layer',
    body: 'IoT sensors installed in each room or zone collect data across multiple dimensions: occupancy presence, motion, temperature, energy consumption, air quality, and asset proximity. All without cameras. Data collection is continuous, low-power, and non-intrusive.',
    specs: ['Occupancy detection', 'Temperature and humidity sensing', 'Energy metering', 'Motion and activity tracking', 'Asset proximity beacons'],
  },
  {
    step: '02',
    icon: <EdgeIcon />,
    title: 'Edge Processing',
    subtitle: 'Local compute layer',
    body: 'Raw sensor data is processed at the edge before transmission. This reduces latency, filters noise, and ensures the system continues operating even when connectivity is intermittent. Edge nodes aggregate readings and apply local logic before sending structured events to the cloud.',
    specs: ['Local data aggregation', 'Noise filtering and smoothing', 'Offline resilience', 'Low-latency local alerts', 'Compressed event transmission'],
  },
  {
    step: '03',
    icon: <CloudIcon />,
    title: 'Cloud Backend',
    subtitle: 'Data and API layer',
    body: 'Processed events flow into our secure cloud backend where they are stored, indexed, and made available through a structured API. The backend handles authentication, multi-property data isolation, time-series storage, and real-time event streaming to the dashboard.',
    specs: ['Multi-tenant data isolation', 'Time-series storage', 'Real-time event streaming', 'REST API for integrations', 'Automatic data retention'],
  },
  {
    step: '04',
    icon: <AIIcon />,
    title: 'AI Analytics Engine',
    subtitle: 'Intelligence layer',
    body: 'The AI layer processes historical and live sensor data to identify patterns, predict maintenance needs, detect anomalies, and generate actionable recommendations. Models are trained on property-specific usage patterns, improving accuracy over time for each deployment.',
    specs: ['Occupancy pattern learning', 'Predictive maintenance alerts', 'Energy anomaly detection', 'Automated scheduling optimisation', 'Per-property model tuning'],
  },
  {
    step: '05',
    icon: <DashboardIcon />,
    title: 'Administration Dashboard',
    subtitle: 'User interface layer',
    body: 'Property operators access all insights, alerts, and controls through a unified web dashboard. The interface presents room-by-room status, portfolio-level analytics, alert management, and historical reporting. Mobile-responsive and accessible from any device.',
    specs: ['Live room status grid', 'Alert inbox and action log', 'Energy and occupancy reports', 'Multi-property switching', 'Role-based access control'],
  },
]

const PRINCIPLES = [
  {
    icon: <PrivacyIcon />,
    title: 'Privacy-Safe by Design',
    body: 'No cameras. No biometric data. No audio capture. All intelligence is derived from environmental sensors that detect presence and activity without identifying individuals.',
  },
  {
    icon: <WirelessIcon />,
    title: 'Wireless and Infrastructure-Light',
    body: 'AZ SmartSystem Lab devices connect wirelessly and require minimal installation. No complex cabling, no major retrofitting. Most properties can be deployed within days.',
  },
  {
    icon: <ScaleIcon />,
    title: 'Built to Scale',
    body: 'From a 10-room guesthouse to a 300-room hotel, the platform scales without performance degradation. Add rooms, floors, and properties from the same dashboard.',
  },
  {
    icon: <OpenIcon />,
    title: 'Open to Integrate',
    body: 'REST APIs make it straightforward to connect AZ SmartSystem Lab data to property management systems, accounting tools, or custom operational workflows.',
  },
]

// ─── Technology page ──────────────────────────────────────────────────────────

const Technology = () => (
  <div className="overflow-x-hidden">
    <SeoHead
      title="Our Technology"
      description="A five-layer architecture — sensors, edge processing, cloud AI, machine learning, and a unified dashboard — powers every AZ SmartSystem Lab product."
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
          Technology
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-white leading-tight"
        >
          Five layers. One intelligent{' '}
          <span className="text-brand-green">property platform.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-6 text-lg text-[#A8D5C8] leading-relaxed max-w-2xl"
        >
          AZ SmartSystem Lab combines IoT sensors, edge computing, cloud infrastructure, and AI analytics
          into a single platform designed from the ground up for property operations.
        </motion.p>
      </div>
    </section>

    {/* ── Architecture layers ───────────────────────────────────────────────── */}
    <section className="py-20 bg-brand-bg">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="mb-14 text-center">
          <span className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-3">
            Platform Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-text-h">How the system is built</h2>
          <p className="mt-4 text-brand-text-muted max-w-xl mx-auto text-sm leading-relaxed">
            Each layer of the AZ SmartSystem Lab platform has a specific role. Together, they move raw
            sensor data into actionable property intelligence in seconds.
          </p>
        </FadeUp>

        {/* Vertical stack of layers */}
        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute left-7 top-10 bottom-10 w-px hidden lg:block"
            style={{ background: 'linear-gradient(180deg, #00C896 0%, rgba(0,200,150,0.1) 100%)' }}
            aria-hidden="true"
          />

          <div className="space-y-6">
            {LAYERS.map(({ step, icon, title, subtitle, body, specs }, i) => (
              <FadeUp key={step} delay={i * 0.08}>
                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 items-start p-6 rounded-2xl border border-brand-border bg-brand-bg-alt hover:border-brand-green/30 transition-colors">

                  {/* Step badge */}
                  <div className="flex flex-row lg:flex-col items-center gap-4 lg:gap-2">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-brand-green bg-brand-green/10 flex-shrink-0">
                      {icon}
                    </div>
                    <span className="text-xs font-bold text-brand-green/50 tracking-widest lg:text-center">{step}</span>
                  </div>

                  {/* Content */}
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-brand-text-muted">{subtitle}</span>
                    <h3 className="mt-1 text-xl font-bold text-brand-text-h">{title}</h3>
                    <p className="mt-3 text-sm text-brand-text-muted leading-relaxed max-w-2xl">{body}</p>
                  </div>

                  {/* Spec list */}
                  <div className="min-w-[180px]">
                    <span className="block text-xs font-bold uppercase tracking-widest text-brand-green/60 mb-3">
                      Capabilities
                    </span>
                    <ul className="space-y-1.5">
                      {specs.map(s => (
                        <li key={s} className="flex items-start gap-2 text-xs text-brand-text-muted">
                          <span className="mt-1 w-1 h-1 rounded-full bg-brand-green flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── Design principles ─────────────────────────────────────────────────── */}
    <section className="py-20 bg-brand-bg-alt">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-12">
          <span className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-3">
            Design Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-text-h">
            Built for real-world property operations.
          </h2>
          <p className="mt-4 text-brand-text-muted max-w-xl mx-auto text-sm leading-relaxed">
            Every architectural decision in the AZ SmartSystem Lab platform is driven by the operational
            realities of African property management.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PRINCIPLES.map(({ icon, title, body }, i) => (
            <FadeUp key={title} delay={i * 0.1}>
              <div className="flex gap-5 p-6 rounded-2xl border border-brand-border bg-brand-bg h-full">
                <span className="text-brand-green flex-shrink-0 mt-0.5">{icon}</span>
                <div>
                  <h3 className="font-bold text-brand-text-h mb-2">{title}</h3>
                  <p className="text-sm text-brand-text-muted leading-relaxed">{body}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>

    {/* ── Deployment callout ────────────────────────────────────────────────── */}
    <section className="py-20 bg-brand-bg">
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="rounded-2xl p-10 text-center"
          style={{ background: 'linear-gradient(135deg, #0A2828 0%, #071A1A 100%)' }}
        >
          <FadeUp>
            <span className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-4">
              Deployment
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              From installation to live dashboard in days, not months.
            </h2>
            <p className="text-[#A8D5C8] text-sm leading-relaxed max-w-xl mx-auto mb-8">
              Our deployment process is designed to minimise disruption to your operations. Sensors are
              installed wirelessly, the platform is configured to your property layout, and your team is
              trained and live within the first week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="primary">Request a Deployment Assessment</Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="secondary">Explore Products</Button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  </div>
)

export default Technology
