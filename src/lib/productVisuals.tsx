import type { ReactNode } from 'react'

// ─── SVG illustrations ────────────────────────────────────────────────────────

export const IllustrationRoom = () => (
  <svg viewBox="0 0 140 90" fill="none" className="w-full h-full" aria-hidden="true">
    <rect x="40" y="12" width="60" height="66" rx="2" stroke="rgba(0,200,150,0.55)" strokeWidth="1.5" />
    <rect x="47" y="20" width="11" height="9" rx="1" fill="rgba(0,200,150,0.25)" stroke="rgba(0,200,150,0.45)" strokeWidth="1" />
    <rect x="64" y="20" width="11" height="9" rx="1" fill="rgba(0,200,150,0.12)" stroke="rgba(0,200,150,0.3)" strokeWidth="1" />
    <rect x="81" y="20" width="11" height="9" rx="1" fill="rgba(0,200,150,0.45)" stroke="rgba(0,200,150,0.65)" strokeWidth="1" />
    <rect x="47" y="34" width="11" height="9" rx="1" fill="rgba(0,200,150,0.4)" stroke="rgba(0,200,150,0.6)" strokeWidth="1" />
    <rect x="64" y="34" width="11" height="9" rx="1" fill="rgba(0,200,150,0.2)" stroke="rgba(0,200,150,0.4)" strokeWidth="1" />
    <rect x="81" y="34" width="11" height="9" rx="1" fill="rgba(0,200,150,0.15)" stroke="rgba(0,200,150,0.35)" strokeWidth="1" />
    <rect x="47" y="48" width="11" height="9" rx="1" fill="rgba(0,200,150,0.1)" stroke="rgba(0,200,150,0.3)" strokeWidth="1" />
    <rect x="64" y="48" width="11" height="9" rx="1" fill="rgba(0,200,150,0.35)" stroke="rgba(0,200,150,0.55)" strokeWidth="1" />
    <rect x="81" y="48" width="11" height="9" rx="1" fill="rgba(0,200,150,0.25)" stroke="rgba(0,200,150,0.45)" strokeWidth="1" />
    <rect x="60" y="62" width="20" height="16" rx="1" stroke="rgba(0,200,150,0.45)" strokeWidth="1.5" />
    <path d="M108 30 A18 18 0 0 1 108 54" stroke="rgba(0,200,150,0.35)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M114 24 A26 26 0 0 1 114 60" stroke="rgba(0,200,150,0.2)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M120 18 A34 34 0 0 1 120 66" stroke="rgba(0,200,150,0.1)" strokeWidth="1" strokeLinecap="round" />
    <circle cx="108" cy="42" r="3.5" fill="rgba(0,200,150,0.9)" />
    <circle cx="22" cy="38" r="2.5" fill="rgba(0,200,150,0.35)" />
    <circle cx="28" cy="26" r="1.8" fill="rgba(0,200,150,0.25)" />
    <circle cx="20" cy="52" r="1.8" fill="rgba(0,200,150,0.2)" />
    <line x1="25" y1="38" x2="40" y2="38" stroke="rgba(0,200,150,0.15)" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
)

export const IllustrationEnergy = () => (
  <svg viewBox="0 0 140 90" fill="none" className="w-full h-full" aria-hidden="true">
    <circle cx="70" cy="50" r="36" stroke="rgba(0,200,150,0.12)" strokeWidth="1.5" />
    <circle cx="70" cy="50" r="28" stroke="rgba(0,200,150,0.18)" strokeWidth="1" />
    <path d="M34 50 A36 36 0 0 1 106 50" stroke="rgba(0,200,150,0.25)" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 36 A32 32 0 0 1 100 36" stroke="rgba(0,200,150,0.4)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M74 20 L62 48 H71 L66 70 L82 42 H73 Z" fill="rgba(0,200,150,0.85)" />
    <path d="M8 80 L20 73 L30 76 L42 65 L52 70 L62 58 L72 62 L82 50 L92 54 L102 43 L112 47 L122 36 L132 40"
      stroke="rgba(0,200,150,0.45)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 80 L20 73 L30 76 L42 65 L52 70 L62 58 L72 62 L82 50 L92 54 L102 43 L112 47 L122 36 L132 40 L132 90 L8 90 Z"
      fill="rgba(0,200,150,0.06)" />
    <line x1="34" y1="50" x2="30" y2="50" stroke="rgba(0,200,150,0.3)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="106" y1="50" x2="110" y2="50" stroke="rgba(0,200,150,0.3)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="70" y1="14" x2="70" y2="10" stroke="rgba(0,200,150,0.3)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="14" cy="18" r="2" fill="rgba(0,200,150,0.3)" />
    <circle cx="126" cy="22" r="2" fill="rgba(0,200,150,0.3)" />
  </svg>
)

export const IllustrationTracker = () => (
  <svg viewBox="0 0 140 90" fill="none" className="w-full h-full" aria-hidden="true">
    <line x1="0" y1="30" x2="140" y2="30" stroke="rgba(0,200,150,0.1)" strokeWidth="1" />
    <line x1="0" y1="60" x2="140" y2="60" stroke="rgba(0,200,150,0.1)" strokeWidth="1" />
    <line x1="35" y1="0" x2="35" y2="90" stroke="rgba(0,200,150,0.1)" strokeWidth="1" />
    <line x1="70" y1="0" x2="70" y2="90" stroke="rgba(0,200,150,0.1)" strokeWidth="1" />
    <line x1="105" y1="0" x2="105" y2="90" stroke="rgba(0,200,150,0.1)" strokeWidth="1" />
    <circle cx="70" cy="35" r="22" stroke="rgba(0,200,150,0.15)" strokeWidth="1" strokeDasharray="3 3" />
    <circle cx="70" cy="35" r="14" stroke="rgba(0,200,150,0.25)" strokeWidth="1" strokeDasharray="3 3" />
    <path d="M70 10 C62 10 56 16 56 24 C56 35 70 50 70 50 C70 50 84 35 84 24 C84 16 78 10 70 10 Z"
      fill="rgba(0,200,150,0.85)" />
    <circle cx="70" cy="24" r="5" fill="white" opacity="0.95" />
    <path d="M28 60 C24.5 60 22 63 22 66.5 C22 71.5 28 79 28 79 C28 79 34 71.5 34 66.5 C34 63 31.5 60 28 60 Z"
      fill="rgba(0,200,150,0.45)" />
    <circle cx="28" cy="66.5" r="3" fill="white" opacity="0.7" />
    <path d="M112 55 C108.5 55 106 58 106 61.5 C106 66.5 112 74 112 74 C112 74 118 66.5 118 61.5 C118 58 115.5 55 112 55 Z"
      fill="rgba(0,200,150,0.45)" />
    <circle cx="112" cy="61.5" r="3" fill="white" opacity="0.7" />
    <line x1="28" y1="66" x2="60" y2="32" stroke="rgba(0,200,150,0.22)" strokeWidth="1.2" strokeDasharray="3 3" />
    <line x1="112" y1="61" x2="80" y2="32" stroke="rgba(0,200,150,0.22)" strokeWidth="1.2" strokeDasharray="3 3" />
  </svg>
)

// ─── Visuals map (keyed by product slug) ──────────────────────────────────────

export interface ProductVisual {
  bg: string
  illustration: ReactNode
  fallbackImageUrl: string // Unsplash — shown until admin uploads a real image
  fallbackVideoUrl: string // Sample video — shown until admin adds a real video
}

export const PRODUCT_VISUALS: Record<string, ProductVisual> = {
  'ai-room-manager': {
    bg: 'linear-gradient(135deg, #0A2828 0%, #0D3D3D 60%, #082020 100%)',
    illustration: <IllustrationRoom />,
    fallbackImageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=700&fit=crop&q=80',
    fallbackVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  'az-energy-monitor': {
    bg: 'linear-gradient(135deg, #071C28 0%, #0D2E42 60%, #071820 100%)',
    illustration: <IllustrationEnergy />,
    fallbackImageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=700&fit=crop&q=80',
    fallbackVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  'az-asset-tracker': {
    bg: 'linear-gradient(135deg, #140A28 0%, #1C1240 60%, #0E0818 100%)',
    illustration: <IllustrationTracker />,
    fallbackImageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&h=700&fit=crop&q=80',
    fallbackVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  },
}

export const FALLBACK_VISUAL: ProductVisual = {
  bg: 'linear-gradient(135deg, #0A2828 0%, #0D3535 100%)',
  illustration: null,
  fallbackImageUrl: '',
  fallbackVideoUrl: '',
}

// Priority: admin DB image → Unsplash fallback → illustration (when imgSrc is null)
// Picsum is excluded — it returns 503 which browsers cache, breaking reloads.
export function getProductImageSources(
  imageUrl: string | null,
  visual: ProductVisual,
): string[] {
  const sources: string[] = []
  // 1. Real admin-uploaded image (Cloudinary or any non-picsum URL)
  if (imageUrl && !imageUrl.includes('picsum.photos')) sources.push(imageUrl)
  // 2. Unsplash — always reliable, survives page reloads
  if (visual.fallbackImageUrl) sources.push(visual.fallbackImageUrl)
  return sources
}

// Returns the admin video if set, otherwise the per-product sample video.
export function getProductVideoUrl(
  videoUrl: string | null,
  visual: ProductVisual,
): string {
  return videoUrl || visual.fallbackVideoUrl
}
