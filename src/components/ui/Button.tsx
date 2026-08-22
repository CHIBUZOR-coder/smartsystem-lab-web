import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  size?:     Size
  loading?:  boolean
  children:  ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg ' +
  'transition-[background-color,color,border-color] duration-500 ease-in-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-60 min-w-[120px]'

const variants: Record<Variant, string> = {
  // Green bg + dark text  →  dark bg + white text
  primary:
    'bg-[#00C896] text-[#061414] hover:bg-[#061414] hover:text-white focus-visible:ring-[#00C896]',

  // Dark bg + white text  →  green bg + dark text
  secondary:
    'bg-[#061414] text-white hover:bg-[#00C896] hover:text-[#061414] focus-visible:ring-[#00C896]',

  // Transparent + green text  →  dark bg + white text
  ghost:
    'bg-transparent text-[#00C896] border border-[#00C896]/50 hover:bg-[#061414] hover:text-white hover:border-[#061414] focus-visible:ring-[#00C896]',

  // Dark red + white text  →  light coral + dark text (keeps danger meaning)
  danger:
    'bg-[#DC2626] text-white hover:bg-[#FCA5A5] hover:text-[#7F1D1D] focus-visible:ring-red-500',
}

const sizes: Record<Size, string> = {
  sm: 'text-sm px-4 py-2 h-9',
  md: 'text-sm px-5 py-2.5 h-11',
  lg: 'text-base px-7 py-3 h-12',
}

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
)

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => (
  <button
    className={[base, variants[variant], sizes[size], className].join(' ')}
    disabled={disabled || loading}
    aria-busy={loading}
    {...props}
  >
    {loading && <Spinner />}
    {children}
  </button>
)

export default Button
