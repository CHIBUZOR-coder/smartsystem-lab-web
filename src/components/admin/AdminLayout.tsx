import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import api from '../../lib/api'
import { ADMIN_BASE } from '../../lib/adminPath'
import ThemeToggle from '../ui/ThemeToggle'

const navItems = [
  { label: 'Dashboard',  to: ADMIN_BASE,                  icon: '▦' },
  { label: 'Products',   to: `${ADMIN_BASE}/products`,    icon: '◈' },
  { label: 'Team',       to: `${ADMIN_BASE}/team`,        icon: '◉' },
  { label: 'Insights',   to: `${ADMIN_BASE}/insights`,    icon: '◎' },
  { label: 'FAQ',        to: `${ADMIN_BASE}/faq`,         icon: '◌' },
  { label: 'Leads',      to: `${ADMIN_BASE}/leads`,       icon: '◍' },
]

// ─── Sidebar content (shared between desktop and mobile drawer) ───────────────

const SidebarContent = ({ onNav, onLogout, admin, isDark }: {
  onNav?: () => void
  onLogout: () => void
  admin: { name?: string; email?: string } | null
  isDark: boolean
}) => (
  <>
    {/* Logo */}
    <div className="px-5 py-5 border-b border-white/10 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded bg-brand-green flex items-center justify-center shrink-0">
          <span className="text-brand-text-h font-black text-xs">AZ</span>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">AZ SMARTSYSTEM</p>
          <p className="text-brand-green text-xs font-semibold">ADMIN</p>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === ADMIN_BASE}
          onClick={onNav}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-brand-green text-brand-text-h'
                : 'text-white/70 hover:bg-brand-surface/10 hover:text-white'
            }`
          }
        >
          <span className="text-base leading-none" aria-hidden="true">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>

    {/* User */}
    <div className="px-4 py-4 border-t border-white/10 shrink-0 space-y-3">
      <div>
        <p className="text-white text-sm font-medium truncate">{admin?.name ?? 'Admin'}</p>
        <p className="text-white/40 text-xs truncate">{admin?.email}</p>
      </div>
      <ThemeToggle
        isDark={isDark}
        showLabel
        className="w-full justify-center bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
      />
      <div className="flex items-center justify-between">
        <Link
          to="/"
          onClick={onNav}
          title="Open the public website in this tab"
          className="text-xs text-white/50 hover:text-brand-green transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          View site
        </Link>
        <button
          onClick={onLogout}
          title="Sign out of the admin panel"
          className="text-xs text-white/50 hover:text-brand-green transition-colors"
        >
          Sign out →
        </button>
      </div>
    </div>
  </>
)

// ─── AdminLayout ──────────────────────────────────────────────────────────────

const AdminLayout = () => {
  const { admin, clearAuth } = useAuthStore()
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme() === 'dark'
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleLogout = async () => {
    try { await api.post('/api/auth/logout') } catch { /* ignore */ }
    clearAuth()
    navigate(`${ADMIN_BASE}/login`)
  }

  return (
    <div className="flex h-screen bg-brand-bg-alt overflow-hidden">

      {/* ── Desktop sidebar (lg+) ─────────────────────────────────────── */}
      <aside className="hidden lg:flex w-60 bg-[#062020] flex-col shrink-0">
        <SidebarContent admin={admin} onLogout={handleLogout} isDark={isDark} />
      </aside>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 z-50 h-full w-64 bg-[#062020] flex flex-col lg:hidden"
            >
              {/* Close button */}
              <button
                onClick={() => setDrawerOpen(false)}
                title="Close menu"
                aria-label="Close menu"
                className="absolute top-4 right-4 text-white/50 hover:text-white p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <SidebarContent
                admin={admin}
                onNav={() => setDrawerOpen(false)}
                onLogout={handleLogout}
                isDark={isDark}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main area ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-brand-surface border-b border-brand-border shrink-0">
          <button
            onClick={() => setDrawerOpen(true)}
            title="Open menu"
            aria-label="Open menu"
            className="p-2 rounded-lg text-brand-text-muted hover:text-brand-text-h hover:bg-brand-bg-alt transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-brand-green flex items-center justify-center shrink-0">
              <span className="text-brand-text-h font-black text-[10px]">AZ</span>
            </div>
            <span className="font-bold text-sm text-brand-text-h">
              AZ SMARTSYSTEM <span className="text-brand-green">ADMIN</span>
            </span>
          </div>
          <ThemeToggle isDark={isDark} className="ml-auto text-brand-text-muted hover:text-brand-text-h hover:bg-brand-bg-alt" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
