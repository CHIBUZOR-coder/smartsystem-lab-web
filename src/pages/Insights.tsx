import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '../lib/api'
import SkeletonBox from '../components/ui/SkeletonBox'
import SeoHead from '../components/ui/SeoHead'
import { getInsightImageSources } from '../lib/insightVisuals'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Insight {
  id:             string
  slug:           string
  title:          string
  excerpt:        string
  category:       string
  tags:           string[]
  publishedAt:    string | null
  coverImageUrl:  string | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

const CATEGORY_COLORS: Record<string, string> = {
  'Technology':    '#4FC3F7',
  'Operations':    '#00C896',
  'Sustainability': '#A78BFA',
  'Industry News': '#FBBF24',
  'Case Study':    '#F87171',
}

function categoryColor(cat: string): string {
  return CATEGORY_COLORS[cat] ?? '#00C896'
}

// ─── Gradient fallback header (shown when all image sources fail) ─────────────

function GradientHeader({ insight }: { insight: Insight }) {
  const color = categoryColor(insight.category)
  return (
    <div
      className="h-44 w-full flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, #061818 0%, #091F1F 60%, ${color}22 100%)`,
        borderBottom: `1px solid ${color}22`,
      }}
    >
      <div className="h-full flex items-center justify-center">
        <span className="text-4xl opacity-20 font-black uppercase tracking-widest" style={{ color }}>
          {insight.category.slice(0, 2).toUpperCase()}
        </span>
      </div>
    </div>
  )
}

// ─── Insight card ─────────────────────────────────────────────────────────────

function InsightCard({ insight, index }: { insight: Insight; index: number }) {
  const sources = getInsightImageSources(insight.coverImageUrl, insight.category, insight.slug)
  const [srcIdx, setSrcIdx] = useState(0)
  const imgSrc = sources[srcIdx] ?? null

  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
    className="h-full"
  >
    <Link
      to={`/insights/${insight.slug}`}
      aria-label={`Read article: ${insight.title}`}
      className="group relative flex flex-col h-full rounded-2xl border border-brand-border bg-brand-surface overflow-hidden
        transition-all duration-300
        hover:border-brand-green/40
        hover:shadow-[0_0_0_1px_rgba(0,200,150,0.15),0_8px_32px_rgba(0,200,150,0.08),0_20px_48px_rgba(0,0,0,0.18)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
    >
      {/* Top spotlight glow */}
      <div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 40% at 50% 0%, rgba(0,200,150,0.12) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Header image with fallback chain */}
      <div className="relative z-10 h-44 overflow-hidden flex-shrink-0">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={insight.title}
            onError={() => setSrcIdx(i => i + 1)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <GradientHeader insight={insight} />
        )}
        {/* Dark overlay so text on top remains readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Body */}
      <div className="relative z-10 flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
            style={{
              color: categoryColor(insight.category),
              background: `${categoryColor(insight.category)}18`,
              border: `1px solid ${categoryColor(insight.category)}30`,
            }}
          >
            {insight.category}
          </span>
          {insight.publishedAt && (
            <span className="text-xs text-brand-text-muted">{formatDate(insight.publishedAt)}</span>
          )}
        </div>

        <h2 className="text-base font-bold text-brand-text-h leading-snug mb-2 group-hover:text-brand-green transition-colors duration-300 line-clamp-2">
          {insight.title}
        </h2>
        <p className="text-sm text-brand-text-muted leading-relaxed flex-1 line-clamp-3">
          {insight.excerpt}
        </p>

        {insight.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {insight.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded bg-brand-bg border border-brand-border text-brand-text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-1.5 text-brand-green text-sm font-semibold">
          Read article
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  </motion.div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const InsightsPageSkeleton = () => (
  <div className="overflow-x-hidden" aria-hidden="true">
    {/* Hero */}
    <section
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A2828 0%, #071A1A 100%)' }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-4">
        <div className="h-3 w-16 rounded-full bg-[#00C896]/20 animate-pulse" />
        <div className="h-12 w-[440px] max-w-full rounded-lg bg-[#0D2424] animate-pulse" />
        <div className="h-4 w-full max-w-lg rounded bg-[#0D2424] animate-pulse" />
        <div className="h-4 w-96 max-w-full rounded bg-[#0D2424] animate-pulse" />
      </div>
    </section>

    {/* Filter bar */}
    <section className="sticky top-[64px] z-30 bg-brand-bg border-b border-brand-border">
      <div className="max-w-6xl mx-auto px-6 py-3 flex gap-2 overflow-x-hidden">
        {[48, 36, 80, 96, 72, 112, 88].map((w, i) => (
          <div key={i} className="h-8 rounded-full skeleton flex-shrink-0" style={{ width: w }} />
        ))}
      </div>
    </section>

    {/* Article grid */}
    <section className="py-16 bg-brand-bg">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="rounded-2xl border border-brand-border bg-brand-surface overflow-hidden flex flex-col">
              {/* Colored header strip */}
              <div className="h-44 bg-[#0A2020] animate-pulse flex-shrink-0" />
              {/* Body */}
              <div className="p-6 space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <SkeletonBox className="h-5 w-24" rounded="full" />
                  <SkeletonBox className="h-3 w-20" />
                </div>
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-4/5" />
                <SkeletonBox className="h-3 w-full" />
                <SkeletonBox className="h-3 w-5/6" />
                <SkeletonBox className="h-3 w-4/5" />
                <div className="flex gap-1.5 pt-1">
                  <SkeletonBox className="h-5 w-12" rounded="sm" />
                  <SkeletonBox className="h-5 w-14" rounded="sm" />
                  <SkeletonBox className="h-5 w-10" rounded="sm" />
                </div>
                <SkeletonBox className="h-3 w-24 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
)

// ─── Insights page ────────────────────────────────────────────────────────────

const Insights = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const { data, isLoading, isError } = useQuery<Insight[]>({
    queryKey: ['insights'],
    queryFn: () => api.get('/api/insights').then(r => r.data),
    staleTime: 60_000,
  })

  const categories = useMemo(() => {
    if (!data) return ['All']
    const cats = [...new Set(data.map(i => i.category))].sort()
    return ['All', ...cats]
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    return activeCategory === 'All' ? data : data.filter(i => i.category === activeCategory)
  }, [data, activeCategory])

  if (isLoading) return <InsightsPageSkeleton />

  return (
    <div className="overflow-x-hidden">
      <SeoHead
        title="Insights"
        description="Thinking and perspective from AZ SmartSystem Lab — deep dives into smart building technology, energy intelligence, and the future of property operations across Africa."
      />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
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
            Insights
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white leading-tight"
          >
            Thinking and perspective from{' '}
            <span className="text-brand-green">AZ SmartSystem Lab.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-6 text-lg text-[#A8D5C8] leading-relaxed max-w-2xl"
          >
            Deep dives into smart building technology, energy intelligence, and the future of
            property operations across Africa.
          </motion.p>
        </div>
      </section>

      {/* ── Category filters ─────────────────────────────────────────────────── */}
      <section className="sticky top-[64px] z-30 bg-brand-bg border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={[
                'flex-shrink-0 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border',
                'transition-[background-color,color,border-color] duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2',
                activeCategory === cat
                  ? 'bg-brand-green text-[#061414] border-brand-green'
                  : 'bg-transparent text-brand-text-muted border-brand-border hover:border-brand-green/40 hover:text-brand-green',
              ].join(' ')}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Article grid ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-brand-bg">
        <div className="max-w-6xl mx-auto px-6">
          {isError && (
            <div className="text-center py-20">
              <p className="text-brand-text-muted">Unable to load articles. Please try again later.</p>
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-brand-text-muted text-sm">No articles found in this category.</p>
            </div>
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((insight, i) => (
                <InsightCard key={insight.id} insight={insight} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Insights
