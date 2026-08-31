import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PageSkeleton from './components/ui/PageSkeleton'
import AdminPageSkeleton from './components/ui/AdminPageSkeleton'

// Public layout + pages (lazy loaded)
import App from './App'
const Home          = lazy(() => import('./pages/Home'))
const About         = lazy(() => import('./pages/About'))
const Team          = lazy(() => import('./pages/Team'))
const Solutions     = lazy(() => import('./pages/Solutions'))
const Products      = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Technology    = lazy(() => import('./pages/Technology'))
const Industries    = lazy(() => import('./pages/Industries'))
const Insights      = lazy(() => import('./pages/Insights'))
const InsightDetail = lazy(() => import('./pages/InsightDetail'))
const FAQ           = lazy(() => import('./pages/FAQ'))
const Contact       = lazy(() => import('./pages/Contact'))
const NotFound      = lazy(() => import('./pages/NotFound'))
const Onboarding    = lazy(() => import('./pages/Onboarding'))

// Admin layout + pages (lazy loaded)
import AdminLayout    from './components/admin/AdminLayout'
import PrivateRoute   from './components/admin/PrivateRoute'
const AdminLogin      = lazy(() => import('./pages/admin/AdminLogin'))
const ForgotPassword  = lazy(() => import('./pages/admin/ForgotPassword'))
const ResetPassword   = lazy(() => import('./pages/admin/ResetPassword'))
const AdminDashboard  = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts   = lazy(() => import('./pages/admin/AdminProducts'))
const AdminTeam       = lazy(() => import('./pages/admin/AdminTeam'))
const AdminInsights   = lazy(() => import('./pages/admin/AdminInsights'))
const AdminFaq        = lazy(() => import('./pages/admin/AdminFaq'))
const AdminLeads      = lazy(() => import('./pages/admin/AdminLeads'))

const wrap      = (el: React.ReactNode) => <Suspense fallback={<PageSkeleton />}>{el}</Suspense>
const wrapAdmin = (el: React.ReactNode) => <Suspense fallback={<AdminPageSkeleton />}>{el}</Suspense>

const router = createBrowserRouter([
  // ── Public site ────────────────────────────────────────────────────────────
  {
    element: <App />,
    path: '/',
    children: [
      { element: wrap(<Home />),          index: true },
      { element: wrap(<About />),         path: 'about' },
      { element: wrap(<Team />),          path: 'team' },
      { element: wrap(<Solutions />),     path: 'solutions' },
      { element: wrap(<Products />),      path: 'products' },
      { element: wrap(<ProductDetail />), path: 'products/:slug' },
      { element: wrap(<Technology />),    path: 'technology' },
      { element: wrap(<Industries />),    path: 'industries' },
      { element: wrap(<Insights />),      path: 'insights' },
      { element: wrap(<InsightDetail />), path: 'insights/:id' },
      { element: wrap(<FAQ />),           path: 'faq' },
      { element: wrap(<Contact />),       path: 'contact' },
      { element: wrap(<NotFound />),      path: '*' },
    ],
  },

  // ── Onboarding — standalone (no Navbar/Footer) ───────────────────────────
  {
    path: '/onboarding',
    element: wrap(<Onboarding />),
  },

  // ── Admin — auth pages (no layout wrapper) ────────────────────────────────
  { path: '/admin/login',           element: wrap(<AdminLogin />) },
  { path: '/admin/forgot-password', element: wrap(<ForgotPassword />) },
  { path: '/admin/reset-password',  element: wrap(<ResetPassword />) },

  // ── Admin — protected routes inside AdminLayout ────────────────────────────
  {
    path: '/admin',
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true,      element: wrapAdmin(<AdminDashboard />) },
      { path: 'products', element: wrapAdmin(<AdminProducts />) },
      { path: 'team',     element: wrapAdmin(<AdminTeam />) },
      { path: 'insights', element: wrapAdmin(<AdminInsights />) },
      { path: 'faq',      element: wrapAdmin(<AdminFaq />) },
      { path: 'leads',    element: wrapAdmin(<AdminLeads />) },
    ],
  },
])

export default router
