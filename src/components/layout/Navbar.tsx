import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '../../store/themeStore'
import Button from '../ui/Button'

const navLinks = [
  { label: 'About',      to: '/about' },
  { label: 'Products',   to: '/products' },
  { label: 'Solutions',  to: '/solutions' },
  { label: 'Technology', to: '/technology' },
  { label: 'Insights',   to: '/insights' },
]

const moreLinks = [
  { label: 'Industries', to: '/industries' },
  { label: 'FAQ',        to: '/faq' },
]

const baseLinkClass =
  'relative px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150'

/* ── Logo mark — green background always, AZ mark flips with theme ─────── */
const Logo = ({ isDark }: { isDark: boolean }) => (
  <Link to="/" aria-label="AZ SmartSystem Lab home" className="shrink-0 block">
    <svg
      viewBox="0 0 100 100"
      width="40"
      height="40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background: always brand green */}
      <rect width="100" height="100" rx="12" fill="#00C896" />
      {/* AZ mark: dark teal in light mode, white in dark mode */}
      <path
        fill={isDark ? '#FFFFFF' : '#061F1F'}
        d="M 12,82 L 40,18 L 49,18 L 64,55 L 74,55 L 74,18 L 88,18 L 88,65 C 88,80 77,82 74,75 L 74,65 L 64,65 L 20,82 Z"
      />
    </svg>
  </Link>
)

/* ── Theme Toggle ──────────────────────────────────────────────────────── */
const ThemeToggle = ({ isDark }: { isDark: boolean }) => {
  const { toggle } = useThemeStore()

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 ${
        isDark
          ? 'text-[#A8D5C8] hover:text-white hover:bg-white/10'
          : 'text-[#4E7272] hover:text-[#062020] hover:bg-[#F0F0F0]'
      }`}
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.36-.71.71M6.34 17.66l-.71.71m12.02 0-.71-.71M6.34 6.34l-.71-.71M12 5a7 7 0 100 14A7 7 0 0012 5z"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          />
        </svg>
      )}
    </button>
  )
}

/* ── Navbar ────────────────────────────────────────────────────────────── */
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme() === 'dark'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [])

  return (
    <>
      <header
        className={[
          'sticky top-0 z-40 w-full overflow-hidden transition-all duration-300',
          scrolled
            ? isDark
              ? 'shadow-[0_4px_32px_rgba(0,0,0,0.50)]'
              : 'shadow-[0_2px_20px_rgba(0,0,0,0.10)]'
            : isDark
              ? 'shadow-[0_1px_16px_rgba(0,0,0,0.30)]'
              : 'shadow-[0_1px_6px_rgba(0,0,0,0.06)]',
        ].join(' ')}
        style={isDark
          ? { background: 'linear-gradient(135deg, #061414 0%, #0A2828 50%, #061414 100%)' }
          : { background: '#FFFFFF', borderBottom: '1px solid #EBEBEB' }
        }
      >
        {/* Dark mode: green radial shimmer */}
        {isDark && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 120% at 50% -20%, rgba(0,200,150,0.18) 0%, transparent 70%)' }}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

          <Logo isDark={isDark} />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {[...navLinks, ...moreLinks].map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${baseLinkClass} ${isActive
                    ? 'text-brand-green'
                    : isDark
                      ? 'text-[#A8D5C8] hover:text-white'
                      : 'text-[#214040] hover:text-[#00C896]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          key="pill"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="absolute inset-0 rounded-full"
                          style={isDark
                            ? {
                                background: 'rgba(0,200,150,0.12)',
                                boxShadow: '0 0 0 1px rgba(0,200,150,0.25), 0 0 12px rgba(0,200,150,0.10)',
                              }
                            : {
                                background: 'rgba(0,200,150,0.10)',
                                boxShadow: '0 0 0 1.5px rgba(0,200,150,0.35)',
                              }
                          }
                        />
                      )}
                    </AnimatePresence>
                    <span className="relative z-10">{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle isDark={isDark} />
            <Link to="/contact" className="hidden sm:block">
              <Button size="sm" variant="primary">Request Demo</Button>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className={`lg:hidden p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 ${
                isDark
                  ? 'text-[#A8D5C8] hover:text-white hover:bg-white/10'
                  : 'text-[#4E7272] hover:text-[#062020] hover:bg-[#F0F0F0]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mob-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <motion.nav
              id="mobile-nav"
              key="mob-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed top-0 right-0 z-40 h-full w-72 shadow-2xl flex flex-col lg:hidden border-l ${
                isDark
                  ? 'bg-[#091F1F] border-[#142E2E]'
                  : 'bg-white border-[#EBEBEB]'
              }`}
              aria-label="Mobile navigation"
            >
              {/* Drawer header */}
              <div className={`flex items-center justify-between px-5 h-16 border-b ${
                isDark ? 'border-[#142E2E]' : 'border-[#EBEBEB]'
              }`}>
                <Logo isDark={isDark} />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? 'text-[#A8D5C8] hover:text-white hover:bg-white/10'
                      : 'text-[#4E7272] hover:text-[#062020] hover:bg-[#F0F0F0]'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto py-6 px-5 space-y-1">
                {[...navLinks, ...moreLinks].map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-[#00C896]/10 text-[#00C896]'
                            : isDark
                              ? 'text-[#A8D5C8] hover:bg-white/5 hover:text-white'
                              : 'text-[#214040] hover:bg-[#F5F5F5] hover:text-[#062020]'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className={`p-5 border-t ${isDark ? 'border-[#142E2E]' : 'border-[#EBEBEB]'}`}>
                <Link to="/contact" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full">Request Demo</Button>
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
