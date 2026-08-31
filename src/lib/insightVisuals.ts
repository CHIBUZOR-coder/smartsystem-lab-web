// Image fallbacks for insight cards.
// Priority: admin coverImageUrl → slug-specific image → category image → gradient header
// Picsum excluded — 503 responses are browser-cached, breaking reloads.

// Per-slug curated images so each article shows a contextually matching photo.
// Uses the same proven Unsplash IDs as the matching product cards.
const SLUG_IMAGES: Record<string, string> = {
  'introducing-ai-room-manager':       'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&h=500&fit=crop&q=80',
  'iot-transforming-hotel-operations': 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&h=500&fit=crop&q=80',
  'smart-energy-monitoring-short-let': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=900&h=500&fit=crop&q=80',
}

// Category-level fallback (used for any slug not in SLUG_IMAGES above).
const CATEGORY_IMAGES: Record<string, string> = {
  'Product':        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&h=500&fit=crop&q=80',
  'Technology':     'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=900&h=500&fit=crop&q=80',
  'Industry':       'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&h=500&fit=crop&q=80',
  'Operations':     'https://images.unsplash.com/photo-1553413077-190dd305871c?w=900&h=500&fit=crop&q=80',
  'Sustainability':  'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&h=500&fit=crop&q=80',
  'Case Study':     'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=500&fit=crop&q=80',
  'Industry News':  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&h=500&fit=crop&q=80',
}
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&h=500&fit=crop&q=80'

export function getInsightImageSources(
  coverImageUrl: string | null | undefined,
  category: string,
  slug: string,
): string[] {
  const sources: string[] = []
  // 1. Admin-uploaded cover image
  if (coverImageUrl && !coverImageUrl.includes('picsum.photos')) sources.push(coverImageUrl)
  // 2. Slug-specific curated image (matching the article topic)
  if (SLUG_IMAGES[slug]) sources.push(SLUG_IMAGES[slug])
  // 3. Category-level fallback
  sources.push(CATEGORY_IMAGES[category] ?? DEFAULT_IMAGE)
  return sources
}
