import { useQuery } from '@tanstack/react-query'
import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import Button from '../components/ui/Button'
import SeoHead from '../components/ui/SeoHead'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamMember {
  id:       string
  name:     string
  title:    string
  bio:      string
  photoUrl: string | null
  linkedIn: string | null
  order:    number
}

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

const MissionIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M14 3V6M14 22V25M3 14H6M22 14H25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const VisionIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M2 14C2 14 7 5 14 5C21 5 26 14 26 14C26 14 21 23 14 23C7 23 2 14 2 14Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="14" cy="14" r="1.5" fill="currentColor" />
  </svg>
)

const ImpactIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M4 22L10 14L15 18L20 10L24 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
)

const InnovationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 18H15M10 21H14M12 3C8.13 3 5 6.13 5 10C5 12.76 6.48 15.17 8.69 16.49C9.47 16.96 10 17.82 10 18.75V19H14V18.75C14 17.82 14.53 16.96 15.31 16.49C17.52 15.17 19 12.76 19 10C19 6.13 15.87 3 12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IntegrityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L3 7V12C3 16.97 6.96 21.61 12 23C17.04 21.61 21 16.97 21 12V7L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CollaborationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="15" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 21C3 17.69 5.69 15 9 15H15C18.31 15 21 17.69 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const ExcellenceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────

const VALUES = [
  { icon: <InnovationIcon />, title: 'Innovation First',       desc: 'We push the boundaries of what IoT and AI can do for real-world property management.' },
  { icon: <IntegrityIcon />,  title: 'Integrity',              desc: 'We build with honesty — in our products, our data practices, and our client relationships.' },
  { icon: <CollaborationIcon />, title: 'Customer Partnership', desc: 'Your operators are our partners. We listen, iterate, and grow alongside the properties we serve.' },
  { icon: <ExcellenceIcon />, title: 'Engineering Excellence', desc: 'Every sensor, every API call, every dashboard interaction is built to the highest standard.' },
]

const MILESTONES = [
  { year: '2022', label: 'Founded',          desc: 'AZ SmartSystem Lab was established with a clear mission: make smart property management accessible across Africa.' },
  { year: '2023', label: 'First Pilot',       desc: 'AI Room Manager enters pilot deployment in partner hotels across Lagos, generating real energy and operational savings.' },
  { year: '2024', label: 'Product Expansion', desc: 'AZ Energy Monitor and AZ Asset Tracker enter development, extending the platform beyond room intelligence.' },
  { year: '2025', label: 'Scale',             desc: 'Platform expanded to serve hotels, short-let operators, and corporate facilities across multiple cities.' },
]

// ─── Team sub-components ──────────────────────────────────────────────────────

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A2828] to-[#0D3535]">
      <span className="text-3xl font-bold text-brand-green">{initials}</span>
    </div>
  )
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <FadeUp delay={index * 0.08} className="h-full">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="h-full flex flex-col bg-brand-surface rounded-2xl border border-brand-border overflow-hidden
          shadow-sm hover:shadow-md hover:border-brand-green/30 transition-all duration-300"
      >
        {/* Photo */}
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-bg-alt flex-shrink-0">
          {member.photoUrl ? (
            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <AvatarPlaceholder name={member.name} />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <div>
            <h3 className="font-bold text-brand-text-h text-base leading-tight">{member.name}</h3>
            <p className="text-sm font-medium text-brand-green mt-0.5">{member.title}</p>
          </div>
          <p className="text-sm text-brand-text-muted leading-relaxed flex-1">{member.bio}</p>
          {member.linkedIn && (
            <a
              href={member.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="inline-flex items-center gap-2 text-xs font-medium text-brand-text-muted hover:text-brand-green transition-colors mt-auto pt-1"
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
            </a>
          )}
        </div>
      </motion.div>
    </FadeUp>
  )
}

function MemberSkeleton() {
  return (
    <div className="h-full flex flex-col bg-brand-surface rounded-2xl border border-brand-border overflow-hidden">
      <div className="skeleton aspect-[4/3] flex-shrink-0" />
      <div className="p-5 space-y-3 flex-1">
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton h-4 w-1/2" />
        <div className="space-y-2 pt-1">
          <div className="skeleton h-3.5 w-full" />
          <div className="skeleton h-3.5 w-5/6" />
          <div className="skeleton h-3.5 w-4/6" />
        </div>
      </div>
    </div>
  )
}

// ─── About page ───────────────────────────────────────────────────────────────

const About = () => {
  const { data: members, isLoading, isError } = useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: () => api.get<TeamMember[]>('/api/team').then(r => r.data),
    staleTime: 5 * 60_000,
  })

  return (
    <div className="overflow-x-hidden">
      <SeoHead
        title="About Us"
        description="Learn about AZ SmartSystem Lab — our mission to bring AI-powered smart building intelligence to property operators across Africa."
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
            About Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white leading-tight"
          >
            We build the intelligence layer{' '}
            <span className="text-brand-green">behind every great property.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-6 text-lg text-[#A8D5C8] leading-relaxed max-w-2xl"
          >
            AZ SmartSystem Lab is an IoT and AI company building intelligent property management
            solutions for hotels, short-let apartments, and commercial facilities across Africa and beyond.
          </motion.p>
        </div>
      </section>

      {/* ── Mission / Vision / Impact ─────────────────────────────────────────── */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <MissionIcon />, title: 'Our Mission', body: 'To make intelligent property management accessible to every operator — from boutique hotels in Lagos to hospital networks across the continent.' },
              { icon: <VisionIcon />,  title: 'Our Vision',  body: 'A future where every building in Africa operates at peak efficiency, with zero waste, complete visibility, and fully automated operations.' },
              { icon: <ImpactIcon />,  title: 'Our Impact',  body: 'Real energy savings, fewer manual processes, and measurable cost reductions — delivered from day one, not after months of configuration.' },
            ].map(({ icon, title, body }, i) => (
              <FadeUp key={title} delay={i * 0.1} className="h-full">
                <div className="flex flex-col h-full p-8 rounded-2xl border border-brand-border bg-brand-bg-alt">
                  <span className="text-brand-green mb-4">{icon}</span>
                  <h2 className="text-xl font-bold text-brand-text-h mb-3">{title}</h2>
                  <p className="text-brand-text-muted leading-relaxed text-sm">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-bg-alt">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <FadeUp>
              <div>
                <span className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-4">
                  Our Story
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-brand-text-h leading-tight">
                  Built from a real problem in the industry.
                </h2>
                <div className="mt-6 space-y-4 text-brand-text-muted leading-relaxed text-sm">
                  <p>
                    We started AZ SmartSystem Lab after seeing, first-hand, how hotel operators in Nigeria
                    were managing their properties — spreadsheets, phone calls, and manual inspections.
                    Room energy was wasted. Cleaning delays went unnoticed. Asset losses were written off.
                  </p>
                  <p>
                    We believed technology could change this. Not expensive, imported enterprise software —
                    but practical, affordable IoT built specifically for the African hospitality market and
                    the realities of operating in it.
                  </p>
                  <p>
                    Today, AI Room Manager gives property operators complete, real-time visibility into every
                    room — without cameras, without complexity, and without months of setup. Just results
                    from day one.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Timeline */}
            <FadeUp delay={0.15}>
              <div className="relative pl-6 border-l-2 border-brand-border space-y-8">
                {MILESTONES.map(({ year, label, desc }, i) => (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.45 }}
                    className="relative"
                  >
                    <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-brand-green border-2 border-brand-bg-alt" />
                    <span className="text-xs font-bold text-brand-green uppercase tracking-wider">{year}</span>
                    <h3 className="mt-0.5 font-bold text-brand-text-h">{label}</h3>
                    <p className="mt-1 text-sm text-brand-text-muted leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-12">
            <span className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-3">
              What We Stand For
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-text-h">Our Values</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {VALUES.map(({ icon, title, desc }, i) => (
              <FadeUp key={title} delay={i * 0.1} className="h-full">
                <div className="flex flex-col h-full p-6 rounded-2xl border border-brand-border bg-brand-bg-alt hover:border-brand-green/40 transition-colors">
                  <span className="text-brand-green mb-3">{icon}</span>
                  <h3 className="font-bold text-brand-text-h mb-2">{title}</h3>
                  <p className="text-sm text-brand-text-muted leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-bg-alt" aria-label="Team members">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="mb-12">
            <span className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-3">
              The Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-text-h">
              The people building{' '}
              <span className="text-brand-green">smarter properties.</span>
            </h2>
            <p className="mt-4 text-brand-text-muted leading-relaxed max-w-2xl">
              A multidisciplinary team of engineers, product designers, and property-tech specialists
              united by one goal — making intelligent operations the standard for every property.
            </p>
          </FadeUp>

          {isError ? (
            <div className="text-center py-12">
              <p className="text-brand-text-muted">Unable to load team members. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {isLoading
                ? [0, 1, 2, 3].map(i => <MemberSkeleton key={i} />)
                : (members ?? []).map((m, i) => <MemberCard key={m.id} member={m} index={i} />)
              }
            </div>
          )}

          {!isLoading && !isError && (members ?? []).length === 0 && (
            <div className="text-center py-12">
              <p className="text-brand-text-muted">Team profiles coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Join Us ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <FadeUp>
              <div>
                <span className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-4">
                  Join Us
                </span>
                <h2 className="text-3xl font-bold text-brand-text-h">
                  We're building something big.
                  <br />
                  <span className="text-brand-green">Come build it with us.</span>
                </h2>
                <p className="mt-5 text-brand-text-muted leading-relaxed">
                  We're always looking for exceptional engineers, designers, and business minds who
                  want to work on hard problems with real-world impact. If that's you, let's talk.
                </p>
                <div className="mt-8">
                  <Link to="/contact">
                    <Button size="md" variant="primary">Get in Touch</Button>
                  </Link>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Hybrid / Remote',  desc: 'Work from Lagos HQ or remotely — we focus on results, not location.' },
                  { label: 'Real Impact',       desc: 'Your work deploys to real properties and changes how they operate daily.' },
                  { label: 'Ownership Culture', desc: 'We give engineers and designers real ownership over what they build.' },
                  { label: 'Growing Fast',      desc: 'Early-stage with traction — the right time to join and shape what we become.' },
                ].map(({ label, desc }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    className="p-5 rounded-xl border border-brand-border bg-brand-surface"
                  >
                    <p className="font-semibold text-brand-text-h text-sm">{label}</p>
                    <p className="mt-1 text-xs text-brand-text-muted leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
