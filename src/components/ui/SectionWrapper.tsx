import { type ReactNode } from 'react'

interface SectionWrapperProps {
  children:   ReactNode
  className?: string
  dark?:      boolean   // true = dark teal background section
  id?:        string
}

const SectionWrapper = ({ children, className = '', dark = false, id }: SectionWrapperProps) => (
  <section
    id={id}
    className={[
      'w-full py-16 sm:py-20 lg:py-24',
      dark ? 'bg-brand-teal text-white' : 'bg-brand-bg',
      className,
    ].join(' ')}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
)

export const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  centered = true,
}: {
  eyebrow?:  string
  title:     string
  subtitle?: string
  centered?: boolean
}) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    {eyebrow && (
      <span className="inline-block text-brand-green text-sm font-semibold uppercase tracking-widest mb-3">
        {eyebrow}
      </span>
    )}
    <h2 className="text-3xl sm:text-4xl font-bold text-brand-text-h leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 text-brand-text-muted text-lg max-w-2xl mx-auto">
        {subtitle}
      </p>
    )}
  </div>
)

export default SectionWrapper
