import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'AZ SmartSystem Lab'
const DEFAULT_DESC =
  'AZ SmartSystem Lab builds AI-powered smart building products for hotels, short-let properties, healthcare facilities, and corporate offices across Africa.'

interface SeoHeadProps {
  title:       string
  description?: string
  noIndex?:    boolean
}

const SeoHead = ({ title, description = DEFAULT_DESC, noIndex = false }: SeoHeadProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`

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
    </Helmet>
  )
}

export default SeoHead
