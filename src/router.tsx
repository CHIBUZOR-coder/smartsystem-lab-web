import { createBrowserRouter } from 'react-router-dom'

// Public layout + pages
import App           from './App'
import Home          from './pages/Home'
import About         from './pages/About'
import Team          from './pages/Team'
import Solutions     from './pages/Solutions'
import Products      from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Technology    from './pages/Technology'
import Industries    from './pages/Industries'
import Insights      from './pages/Insights'
import InsightDetail from './pages/InsightDetail'
import FAQ           from './pages/FAQ'
import Contact       from './pages/Contact'
import NotFound      from './pages/NotFound'
import Onboarding   from './pages/Onboarding'

// Admin layout + pages
import AdminLayout    from './components/admin/AdminLayout'
import PrivateRoute   from './components/admin/PrivateRoute'
import AdminLogin     from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts  from './pages/admin/AdminProducts'
import AdminTeam      from './pages/admin/AdminTeam'
import AdminInsights  from './pages/admin/AdminInsights'
import AdminFaq       from './pages/admin/AdminFaq'
import AdminLeads     from './pages/admin/AdminLeads'

const router = createBrowserRouter([
  // ── Public site ────────────────────────────────────────────────────────────
  {
    element: <App />,
    path: '/',
    children: [
      { element: <Home />,          index: true },
      { element: <About />,         path: 'about' },
      { element: <Team />,          path: 'team' },
      { element: <Solutions />,     path: 'solutions' },
      { element: <Products />,      path: 'products' },
      { element: <ProductDetail />, path: 'products/:slug' },
      { element: <Technology />,    path: 'technology' },
      { element: <Industries />,    path: 'industries' },
      { element: <Insights />,      path: 'insights' },
      { element: <InsightDetail />, path: 'insights/:id' },
      { element: <FAQ />,           path: 'faq' },
      { element: <Contact />,       path: 'contact' },
      { element: <NotFound />,      path: '*' },
    ],
  },

  // ── Onboarding — standalone (no Navbar/Footer) ───────────────────────────
  {
    path: '/onboarding',
    element: <Onboarding />,
  },

  // ── Admin — login (no layout wrapper) ─────────────────────────────────────
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },

  // ── Admin — protected routes inside AdminLayout ────────────────────────────
  {
    path: '/admin',
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true,            element: <AdminDashboard /> },
      { path: 'products',       element: <AdminProducts /> },
      { path: 'team',           element: <AdminTeam /> },
      { path: 'insights',       element: <AdminInsights /> },
      { path: 'faq',            element: <AdminFaq /> },
      { path: 'leads',          element: <AdminLeads /> },
    ],
  },
])

export default router
