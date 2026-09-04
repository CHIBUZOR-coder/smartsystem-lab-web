import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import SkeletonBox from '../../components/ui/SkeletonBox'

interface Stats { products: number; team: number; insights: number; faq: number; leads: number }

// Stat cards + leads table shaped exactly like AdminDashboard
const DashboardPageSkeleton = () => (
  <div aria-hidden="true">
    <SkeletonBox className="h-8 w-40 mb-6" />
    {/* 5 stat cards */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-5 space-y-2">
          <SkeletonBox className="h-3 w-20" />
          <SkeletonBox className="h-8 w-10" />
        </div>
      ))}
    </div>
    {/* Recent leads table: Name, Email, Company, Reason, Date */}
    <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden">
      <div className="px-5 py-4 border-b border-brand-border">
        <SkeletonBox className="h-5 w-32" />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 5 }, (_, r) => (
          <div key={r} className="px-5 py-3 grid grid-cols-5 gap-3 items-center">
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-3 w-full" />
            <SkeletonBox className="h-3 w-3/4" />
            <SkeletonBox className="h-5 w-20 rounded-full" />
            <SkeletonBox className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-5">
    <p className="text-xs sm:text-sm text-brand-text-muted mb-1">{label}</p>
    <p className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</p>
  </div>
)

const AdminDashboard = () => {
  const { data, isLoading } = useQuery<{ data: Stats }>({
    queryKey: ['admin-stats'],
    queryFn:  () => api.get('/api/admin/stats').then(r => r.data),
  })

  const { data: leadsData, isLoading: leadsLoading } = useQuery<{ data: unknown[] }>({
    queryKey: ['admin-leads-recent'],
    queryFn:  () => api.get('/api/admin/leads').then(r => r.data),
  })

  const stats = data?.data
  const recentLeads = (leadsData?.data ?? []).slice(0, 5) as Array<{
    id: string; name: string; email: string; reason: string; company?: string; createdAt: string
  }>

  if (isLoading || leadsLoading) return <DashboardPageSkeleton />

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-teal mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        <StatCard label="Products"  value={stats?.products ?? 0}  color="text-brand-teal" />
        <StatCard label="Team"      value={stats?.team ?? 0}      color="text-brand-teal" />
        <StatCard label="Articles"  value={stats?.insights ?? 0}  color="text-brand-teal" />
        <StatCard label="FAQ items" value={stats?.faq ?? 0}       color="text-brand-teal" />
        <StatCard label="Leads"     value={stats?.leads ?? 0}     color="text-brand-green" />
      </div>

      <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-brand-border">
          <h2 className="font-semibold text-brand-teal">Recent Leads</h2>
        </div>
        {recentLeads.length === 0 ? (
          <p className="text-brand-text-muted text-sm p-5">No leads yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-brand-bg-alt">
              <tr>
                {['Name', 'Email', 'Company', 'Reason', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-brand-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-brand-bg-alt">
                  <td className="px-5 py-3 font-medium text-brand-teal">{lead.name}</td>
                  <td className="px-5 py-3 text-brand-text-body">{lead.email}</td>
                  <td className="px-5 py-3 text-brand-text-muted">{lead.company ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span className="capitalize text-xs bg-brand-green-subtle text-brand-green px-2 py-0.5 rounded-full font-medium">{lead.reason}</span>
                  </td>
                  <td className="px-5 py-3 text-brand-text-muted text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
