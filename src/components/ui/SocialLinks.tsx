import { SOCIAL_LINKS } from '../../lib/socialLinks'

interface SocialLinksProps {
  className?: string
  iconClassName?: string
}

// Reused in the footer, About page, and Contact page — the industry-standard
// spots for a company's social links to appear.
const SocialLinks = ({ className = '', iconClassName = '' }: SocialLinksProps) => (
  <div className={`flex gap-3 ${className}`} aria-label="Social media links">
    {SOCIAL_LINKS.map(s => (
      <a
        key={s.label}
        href={s.href}
        target={s.placeholder ? undefined : '_blank'}
        rel={s.placeholder ? undefined : 'noopener noreferrer'}
        aria-label={s.placeholder ? `${s.label} — coming soon` : s.label}
        title={s.placeholder ? `${s.label} — coming soon` : s.label}
        className={iconClassName}
      >
        <s.icon />
      </a>
    ))}
  </div>
)

export default SocialLinks
