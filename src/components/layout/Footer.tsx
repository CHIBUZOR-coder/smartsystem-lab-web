import { Link } from 'react-router-dom'
import ParticleCanvas from '../ui/ParticleCanvas'

const productLinks = [
  { label: 'AI Room Manager', to: '/products/ai-room-manager' },
  { label: 'All Products',    to: '/products' },
]

const companyLinks = [
  { label: 'About Us',   to: '/about' },
  { label: 'Technology', to: '/technology' },
  { label: 'Industries', to: '/industries' },
]

const resourceLinks = [
  { label: 'Insights',  to: '/insights' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'FAQ',       to: '/faq' },
  { label: 'Contact',   to: '/contact' },
]

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="AZ SmartSystem Lab home">
    <div className="h-8 w-8 rounded bg-[#00C896] flex items-center justify-center shrink-0">
      <span className="text-[#061414] font-black text-sm leading-none">AZ</span>
    </div>
    <span className="font-bold text-base tracking-tight text-white">
      AZ SMARTSYSTEM <span className="text-[#00C896]">LAB</span>
    </span>
  </Link>
)

const Footer = () => (
  <footer className="relative overflow-hidden" style={{ background: '#020D0D' }}>
    <ParticleCanvas />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="space-y-4 lg:col-span-1">
          <Logo />
          <p className="text-sm text-white/60 leading-relaxed">
            IoT-powered intelligence for smarter hotels, properties, and facilities. Built in Lagos.
          </p>
          <div className="flex gap-3 pt-1" aria-label="Social media links (coming soon)">
            {['LinkedIn', 'X', 'Instagram'].map(s => (
              <span
                key={s}
                aria-hidden="true"
                className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50 text-xs select-none"
                title={`${s} — coming soon`}
              >
                {s[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#00C896] mb-4">
            Products
          </h3>
          <ul className="space-y-2.5">
            {productLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-white/60 hover:text-[#00C896] transition-colors duration-150">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#00C896] mb-4">
            Company
          </h3>
          <ul className="space-y-2.5">
            {companyLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-white/60 hover:text-[#00C896] transition-colors duration-150">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#00C896] mb-4">
            Resources
          </h3>
          <ul className="space-y-2.5">
            {resourceLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-white/60 hover:text-[#00C896] transition-colors duration-150">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} AZ SmartSystem Lab. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            10 Baale Ikota Street, Off Alabede Street, Bogije, Lekki-Epe Expressway, Lagos
          </p>
        </div>
        <a
          href="mailto:azsmartsystem@az-smart-system.com"
          className="text-xs text-[#00C896] hover:text-white transition-colors duration-150"
        >
          azsmartsystem@az-smart-system.com
        </a>
      </div>
    </div>
  </footer>
)

export default Footer
