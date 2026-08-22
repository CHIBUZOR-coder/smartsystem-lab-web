import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import { SkeletonCard } from '../../components/ui/SkeletonBox'

interface Stats { products: number; team: number; insights: number; faq: number; leads: number }

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
    <p className="text-xs sm:text-sm text-gray-500 mb-1">{label}</p>
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-teal mb-6">Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          <StatCard label="Products"  value={stats?.products ?? 0}  color="text-brand-teal" />
          <StatCard label="Team"      value={stats?.team ?? 0}      color="text-brand-teal" />
          <StatCard label="Articles"  value={stats?.insights ?? 0}  color="text-brand-teal" />
          <StatCard label="FAQ items" value={stats?.faq ?? 0}       color="text-brand-teal" />
          <StatCard label="Leads"     value={stats?.leads ?? 0}     color="text-brand-green" />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-brand-teal">Recent Leads</h2>
        </div>
        {leadsLoading ? (
          <div className="p-5 space-y-3">{Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)}</div>
        ) : recentLeads.length === 0 ? (
          <p className="text-gray-400 text-sm p-5">No leads yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Email', 'Company', 'Reason', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-brand-teal">{lead.name}</td>
                  <td className="px-5 py-3 text-gray-600">{lead.email}</td>
                  <td className="px-5 py-3 text-gray-500">{lead.company ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span className="capitalize text-xs bg-brand-green-subtle text-brand-green px-2 py-0.5 rounded-full font-medium">{lead.reason}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
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
