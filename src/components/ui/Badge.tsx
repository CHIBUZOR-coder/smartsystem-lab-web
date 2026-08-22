type StatusBadge = 'available' | 'pilot' | 'coming-soon'

interface BadgeProps {
  status?: StatusBadge
  label?:  string
  variant?: 'status' | 'category'
}

const statusConfig: Record<StatusBadge, { label: string; className: string }> = {
  'available':    { label: 'Available',    className: 'bg-brand-green-subtle text-brand-green border border-brand-green/30' },
  'pilot':        { label: 'Pilot',        className: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' },
  'coming-soon':  { label: 'Coming Soon',  className: 'bg-brand-bg-alt text-brand-text-muted border border-brand-border' },
}

const Badge = ({ status, label, variant = 'status' }: BadgeProps) => {
  if (variant === 'category' && label) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-teal/10 text-brand-teal dark:bg-brand-teal-light/10 dark:text-brand-teal-mid">
        {label}
      </span>
    )
  }

  if (!status) return null
  const cfg = statusConfig[status]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {cfg.label}
    </span>
  )
}

export default Badge
