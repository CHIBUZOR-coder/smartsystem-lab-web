import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import Modal from '../../components/ui/Modal'
import SkeletonBox from '../../components/ui/SkeletonBox'

interface Lead {
  id: string; name: string; email: string; phone?: string
  company?: string; companySize?: string; reason: string; message: string; createdAt: string
}

const reasonLabel: Record<string, string> = {
  demo: 'Request Demo', partnership: 'Partnership', general: 'General Enquiry',
}

// Name | Email | Company | Type | Date | View (6 cols)
const LeadsTableSkeleton = () => (
  <div aria-hidden="true">
    <SkeletonBox className="h-7 w-44 mb-6" />
    <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden">
      <div className="bg-brand-bg-alt px-5 py-3 grid grid-cols-6 gap-3 border-b border-brand-border">
        {['w-1/4', 'w-1/4', 'w-1/5', 'w-1/5', 'w-16', 'w-8'].map((w, i) => (
          <SkeletonBox key={i} className={`h-3 ${w}`} />
        ))}
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 8 }, (_, r) => (
          <div key={r} className="px-5 py-3 grid grid-cols-6 gap-3 items-center">
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-3 w-full" />
            <SkeletonBox className="h-3 w-2/3" />
            <SkeletonBox className="h-5 w-24 rounded-full" />
            <SkeletonBox className="h-3 w-16" />
            <SkeletonBox className="h-3 w-10" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

const AdminLeads = () => {
  const [selected, setSelected] = useState<Lead | null>(null)

  const { data, isLoading } = useQuery<{ data: Lead[] }>({
    queryKey: ['admin-leads'],
    queryFn:  () => api.get('/api/admin/leads').then(r => r.data),
  })

  const leads = data?.data ?? []

  if (isLoading) return <LeadsTableSkeleton />

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-brand-teal mb-6">Leads & Enquiries</h1>

      <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden overflow-x-auto">
        {leads.length === 0 ? <p className="p-5 text-brand-text-muted text-sm">No leads yet.</p>
          : (
            <table className="w-full text-sm">
              <thead className="bg-brand-bg-alt">
                <tr>
                  {['Name', 'Email', 'Company', 'Type', 'Date', ''].map((h, i) => (
                    <th key={i} className="text-left px-5 py-3 text-xs font-semibold text-brand-text-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-brand-bg-alt cursor-pointer" onClick={() => setSelected(lead)}>
                    <td className="px-5 py-3 font-medium text-brand-teal">{lead.name}</td>
                    <td className="px-5 py-3 text-brand-text-body">{lead.email}</td>
                    <td className="px-5 py-3 text-brand-text-muted">{lead.company ?? '—'}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-green-subtle text-brand-green">
                        {reasonLabel[lead.reason] ?? lead.reason}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-brand-text-muted text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-brand-green hover:underline">View →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Enquiry Detail" maxWidth="max-w-lg">
        {selected && (
          <div className="p-6 space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Name',         value: selected.name },
                { label: 'Email',        value: selected.email },
                { label: 'Phone',        value: selected.phone ?? '—' },
                { label: 'Company',      value: selected.company ?? '—' },
                { label: 'Company Size', value: selected.companySize ?? '—' },
                { label: 'Type',         value: reasonLabel[selected.reason] ?? selected.reason },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-brand-text-muted text-xs mb-0.5">{f.label}</p>
                  <p className="font-medium text-brand-text-h">{f.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-brand-text-muted text-xs mb-1">Message</p>
              <p className="text-brand-text-body leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <p className="text-brand-text-muted text-xs pt-2 border-t border-brand-border">
              Received: {new Date(selected.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AdminLeads
