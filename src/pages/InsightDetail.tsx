import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '../lib/api'
import SkeletonBox from '../components/ui/SkeletonBox'
import SeoHead from '../components/ui/SeoHead'
import { getInsightImageSources } from '../lib/insightVisuals'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Insight {
  id:            string
  slug:          string
  title:         string
  excerpt:       string
  content:       string
  category:      string
  tags:          string[]
  coverImageUrl: string | null
  publishedAt:   string | null
}

interface InsightSummary {
  id:          string
  slug:        string
  title:       string
  excerpt:     string
  category:    string
  tags:        string[]
  publishedAt: string | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

const CATEGORY_COLORS: Record<string, string> = {
  'Technology':     '#4FC3F7',
  'Operations':     '#00C896',
  'Sustainability': '#A78BFA',
  'Industry News':  '#FBBF24',
  'Case Study':     '#F87171',
}

function categoryColor(cat: string): string {
  return CATEGORY_COLORS[cat] ?? '#00C896'
}

function renderContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean)
    .map((block, i) => {
      if (block.startsWith('# ')) {
        return <h2 key={i} className="text-2xl font-bold text-brand-text-h mt-10 mb-4">{block.slice(2)}</h2>
      }
      if (block.startsWith('## ')) {
        return <h3 key={i} className="text-xl font-bold text-brand-text-h mt-8 mb-3">{block.slice(3)}</h3>
      }
      if (block.startsWith('### ')) {
        return <h4 key={i} className="text-lg font-semibold text-brand-text-h mt-6 mb-2">{block.slice(4)}</h4>
      }
      if (block.startsWith('- ') || block.startsWith('* ')) {
        const items = block.split('\n').filter(l => l.startsWith('- ') || l.startsWith('* '))
        return (
          <ul key={i} className="list-none space-y-2 my-4">
            {items.map((item, j) => (
              <li key={j} className="flex items-start gap-3 text-brand-text-body leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                {item.slice(2)}
              </li>
            ))}
          </ul>
        )
      }
      return (
        <p key={i} className="text-brand-text-body leading-relaxed my-4">
          {block}
        </p>
      )
    })
}

// ─── Related card ─────────────────────────────────────────────────────────────

const RelatedCard = ({ insight }: { insight: InsightSummary }) => {
  const color = categoryColor(insight.category)
  return (
    <Link
      to={`/insights/${insight.slug}`}
      aria-label={`Read related article: ${insight.title}`}
      className="group flex flex-col rounded-xl border border-brand-border bg-brand-surface p-5 gap-3
        transition-all duration-300
        hover:border-brand-green/40
        hover:shadow-[0_0_0_1px_rgba(0,200,150,0.12),0_8px_24px_rgba(0,200,150,0.06)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
    >
      <span
        className="text-xs font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full self-start"
        style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
      >
        {insight.category}
      </span>
      <h3 className="text-sm font-bold text-brand-text-h leading-snug group-hover:text-brand-green transition-colors duration-300 line-clamp-2">
        {insight.title}
      </h3>
      <p className="text-xs text-brand-text-muted leading-relaxed line-clamp-2">{insight.excerpt}</p>
      <span className="text-brand-green text-xs font-semibold flex items-center gap-1 mt-auto">
        Read
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1">
          <path d="M2 6h8M6 2.5L9.5 6 6 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const InsightDetailPageSkeleton = () => (
  <div className="overflow-x-hidden" aria-hidden="true">
    {/* Hero (h-72 / h-96 dark cover) */}
    <div className="relative h-72 sm:h-96 w-full bg-[#091F1F] animate-pulse flex items-end">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(2,13,13,0.85) 100%)' }} />
      <div className="relative z-10 max-w-3xl mx-auto w-full px-6 pb-8 space-y-3">
        <div className="h-3 w-20 rounded bg-[#132F2F] animate-pulse" />
        <div className="h-8 w-3/4 rounded-lg bg-[#132F2F] animate-pulse" />
        <div className="h-8 w-1/2 rounded-lg bg-[#132F2F] animate-pulse" />
      </div>
    </div>

    {/* Article body */}
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
      {/* Meta row: category chip + date + tags */}
      <div className="flex flex-wrap items-center gap-3">
        <SkeletonBox className="h-6 w-24" rounded="full" />
        <SkeletonBox className="h-4 w-28" />
        <div className="flex gap-1.5">
          <SkeletonBox className="h-5 w-12" rounded="sm" />
          <SkeletonBox className="h-5 w-14" rounded="sm" />
          <SkeletonBox className="h-5 w-10" rounded="sm" />
        </div>
      </div>
      <div className="h-px bg-brand-border" />

      {/* Article paragraphs */}
      <div className="space-y-2">
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-5/6" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-4/5" />
      </div>
      <div className="space-y-2 pt-2">
        <SkeletonBox className="h-7 w-48" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-3/4" />
      </div>
      <div className="space-y-2">
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-5/6" />
      </div>
      <div className="space-y-2 pt-2">
        <SkeletonBox className="h-7 w-56" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-4/5" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-3/5" />
      </div>
    </div>
  </div>
)

// ─── InsightDetail page ───────────────────────────────────────────────────────

const InsightDetail = () => {
  const { id: slug } = useParams<{ id: string }>()
  const navigate = useNavigate()
  // must be before any early returns
  const [heroIdx, setHeroIdx] = useState(0)

  const { data: insight, isLoading, isError } = useQuery<Insight>({
    queryKey: ['insight', slug],
    queryFn: () => api.get(`/api/insights/${slug}`).then(r => r.data),
    enabled: !!slug,
    staleTime: 60_000,
    retry: false,
  })

  const { data: allInsights } = useQuery<InsightSummary[]>({
    queryKey: ['insights'],
    queryFn: () => api.get('/api/insights').then(r => r.data),
    staleTime: 60_000,
  })

  const related = allInsights
    ?.filter(i => i.slug !== slug && i.category === insight?.category)
    .slice(0, 3) ?? []

  if (isLoading) return <InsightDetailPageSkeleton />

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-brand-text-muted">This article could not be found or is not yet published.</p>
        <button
          onClick={() => navigate('/insights')}
          className="text-sm font-semibold text-brand-green underline underline-offset-4"
        >
          Back to Insights
        </button>
      </div>
    )
  }

  const color = insight ? categoryColor(insight.category) : '#00C896'
  const heroSources = insight
    ? getInsightImageSources(insight.coverImageUrl, insight.category, insight.slug)
    : []
  const heroSrc = heroSources[heroIdx] ?? null

  return (
    <div className="overflow-x-hidden">
      {insight && (
        <SeoHead
          title={insight.title}
          description={insight.excerpt}
        />
      )}

      {/* ── Hero / cover ─────────────────────────────────────────────────────── */}
      <div
        className="relative h-72 sm:h-96 w-full flex items-end overflow-hidden"
        style={{ background: `linear-gradient(135deg, #061818 0%, #091F1F 60%, ${color}22 100%)` }}
      >
        {/* Cover image with fallback chain (admin → Unsplash → gradient) */}
        {heroSrc && (
          <img
            src={heroSrc}
            alt=""
            aria-hidden="true"
            onError={() => setHeroIdx(i => i + 1)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Dark gradient overlay for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(6,20,20,0.25) 0%, rgba(2,13,13,0.90) 100%)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto w-full px-6 pb-8">
          <Link
            to="/insights"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A8D5C8] hover:text-white transition-colors duration-200 mb-4"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M11.5 7H2.5M6 3.5L2.5 7 6 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All Insights
          </Link>
          {insight && (
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{insight.title}</h1>
          )}
        </div>
      </div>

      {/* ── Article body ─────────────────────────────────────────────────────── */}
      {insight && (
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto px-6 py-12"
        >
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span
              className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
            >
              {insight.category}
            </span>
            {insight.publishedAt && (
              <span className="text-sm text-brand-text-muted">{formatDate(insight.publishedAt)}</span>
            )}
            {insight.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {insight.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded bg-brand-bg-alt border border-brand-border text-brand-text-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Excerpt */}
          <p className="text-lg text-brand-text-body leading-relaxed font-medium mb-8 pb-8 border-b border-brand-border">
            {insight.excerpt}
          </p>

          {/* Body content */}
          <div className="prose-custom">
            {renderContent(insight.content)}
          </div>

          {/* Bottom divider */}
          <div className="mt-16 pt-8 border-t border-brand-border flex justify-between items-center">
            <Link
              to="/insights"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:underline underline-offset-4"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M11.5 7H2.5M6 3.5L2.5 7 6 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Insights
            </Link>
          </div>
        </motion.article>
      )}

      {/* ── Related articles ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-brand-bg-alt border-t border-brand-border py-16">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text-muted mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map(ins => (
                <RelatedCard key={ins.id} insight={ins} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default InsightDetail
