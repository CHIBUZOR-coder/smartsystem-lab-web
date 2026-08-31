import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/api'
import SkeletonBox from '../components/ui/SkeletonBox'
import Button from '../components/ui/Button'
import SeoHead from '../components/ui/SeoHead'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FaqItem {
  id:       string
  question: string
  answer:   string
  order:    number
}

// ─── Accordion item ───────────────────────────────────────────────────────────

const AccordionItem = ({ item, isOpen, onToggle }: {
  item:     FaqItem
  isOpen:   boolean
  onToggle: () => void
}) => (
  <div
    className={[
      'rounded-xl border transition-colors duration-300',
      isOpen
        ? 'border-brand-green/40 bg-brand-surface'
        : 'border-brand-border bg-brand-surface hover:border-brand-green/20',
    ].join(' ')}
  >
    <button
      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-inset rounded-xl"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={`faq-answer-${item.id}`}
    >
      <span className={[
        'text-sm sm:text-base font-semibold leading-snug transition-colors duration-200',
        isOpen ? 'text-brand-green' : 'text-brand-text-h',
      ].join(' ')}>
        {item.question}
      </span>
      <span
        className={[
          'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300',
          isOpen
            ? 'border-brand-green bg-brand-green/10 text-brand-green rotate-45'
            : 'border-brand-border text-brand-text-muted rotate-0',
        ].join(' ')}
        aria-hidden="true"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={`faq-answer-${item.id}`}
          key="answer"
          role="region"
          aria-label={item.question}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <p className="px-6 pb-6 text-sm text-brand-text-muted leading-relaxed">
            {item.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

// ─── Accordion skeleton ───────────────────────────────────────────────────────

const FAQ_WIDTHS = ['w-3/4', 'w-2/3', 'w-4/5', 'w-3/5', 'w-4/5', 'w-2/3', 'w-3/4', 'w-1/2'] as const

const FaqAccordionSkeleton = () => (
  <div className="space-y-3" aria-hidden="true">
    {FAQ_WIDTHS.map((w, i) => (
      <div key={i} className="rounded-xl border border-brand-border bg-brand-surface px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <SkeletonBox className={`h-4 ${w}`} />
          <div className="w-7 h-7 rounded-full skeleton flex-shrink-0" />
        </div>
      </div>
    ))}
  </div>
)

// ─── FAQ page ─────────────────────────────────────────────────────────────────

const FAQ = () => {
  const [openId, setOpenId] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery<FaqItem[]>({
    queryKey: ['faq'],
    queryFn: () => api.get('/api/faq').then(r => r.data),
    staleTime: 5 * 60_000,
  })

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id))

  return (
    <div className="overflow-x-hidden">
      <SeoHead
        title="FAQ"
        description="Answers to common questions about AZ SmartSystem Lab products, deployment, data privacy, and pricing."
      />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
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
            FAQ
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white leading-tight"
          >
            Frequently asked{' '}
            <span className="text-brand-green">questions.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-6 text-lg text-[#A8D5C8] leading-relaxed max-w-2xl"
          >
            Everything you need to know about AZ SmartSystem Lab products, deployment, pricing,
            and data privacy. Can't find what you're looking for?{' '}
            <Link to="/contact" className="text-brand-green underline underline-offset-4 hover:no-underline">
              Talk to us directly.
            </Link>
          </motion.p>
        </div>
      </section>

      {/* ── Accordion ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-3xl mx-auto px-6">
          {isLoading && <FaqAccordionSkeleton />}

          {!isLoading && isError && (
            <div className="text-center py-16">
              <p className="text-brand-text-muted">Unable to load FAQ. Please try again later.</p>
            </div>
          )}

          {!isLoading && !isError && !data?.length && (
            <div className="text-center py-16">
              <p className="text-brand-text-muted">No questions yet. Check back soon.</p>
            </div>
          )}

          {!isLoading && !isError && data && data.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              {data.map(item => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => toggle(item.id)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A2828 0%, #071A1A 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 70% 50%, rgba(0,200,150,0.07) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <span className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-4">
            Still have questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Talk to our team directly.
          </h2>
          <p className="mt-5 text-[#A8D5C8] leading-relaxed">
            Our team can walk you through how AZ SmartSystem Lab products work for your specific
            property type, answer technical questions, and arrange a live demo.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="primary">Request a Demo</Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="secondary">Browse Products</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FAQ
