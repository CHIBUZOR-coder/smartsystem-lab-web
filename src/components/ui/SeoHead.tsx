import { Helmet } from 'react-helmet-async'
import { SOCIAL_LINKS } from '../../lib/socialLinks'

const SITE_NAME = 'AZ SmartSystem Lab'
const DEFAULT_DESC =
  'AZ SmartSystem Lab builds AI-powered smart building products for hotels, short-let properties, healthcare facilities, and corporate offices across Africa.'

interface SeoHeadProps {
  title:       string
  description?: string
  noIndex?:    boolean
  // Emits Organization JSON-LD with a `sameAs` list of social profiles —
  // standard practice for search engines to associate them with the company.
  // Only needs to appear once per site; set on the homepage.
  includeOrganizationSchema?: boolean
}

const SeoHead = ({ title, description = DEFAULT_DESC, noIndex = false, includeOrganizationSchema = false }: SeoHeadProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`

  const organizationSchema = includeOrganizationSchema ? {
    '@context': 'https://schema.org',
    '@type':    'Organization',
    name:       SITE_NAME,
    url:        'https://www.azsmartsystem.tech',
    sameAs:     SOCIAL_LINKS.filter(s => !s.placeholder).map(s => s.href),
  } : null

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />

      {/* Twitter */}
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {organizationSchema && (
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      )}
    </Helmet>
  )
}

export default SeoHead
