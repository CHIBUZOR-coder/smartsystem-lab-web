import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/api'
import { useDealerAuthStore } from '../../store/dealerAuthStore'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import CarForm, { type CarFormValues } from '../../components/garage/CarForm'

type CarStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface Car {
  id: string; title: string; description: string; price: number
  whatsappNumber: string; images: string[]; features: string[]; status: CarStatus
}

const statusStyles: Record<CarStatus, string> = {
  PENDING:  'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  APPROVED: 'bg-brand-green-subtle text-brand-green border border-brand-green/30',
  REJECTED: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
}

const StatusBadge = ({ status }: { status: CarStatus }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
    {status[0] + status.slice(1).toLowerCase()}
  </span>
)

const DealerDashboard = () => {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { dealer, clearAuth } = useDealerAuthStore()
  const [editing, setEditing]   = useState<Car | null>(null)
  const [modalOpen, setModal]   = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<{ data: Car[] }>({
    queryKey: ['dealer-cars'],
    queryFn:  () => api.get('/api/dealer/cars').then(r => r.data),
  })

  const openAdd  = () => { setEditing(null); setModal(true) }
  const openEdit = (c: Car) => { setEditing(c); setModal(true) }

  const save = useMutation({
    mutationFn: (d: CarFormValues) =>
      editing
        ? api.put(`/api/dealer/cars/${editing.id}`, d)
        : api.post('/api/dealer/cars', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['dealer-cars'] }); setModal(false) },
  })

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/api/dealer/cars/${id}`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['dealer-cars'] }); setDeleteId(null) },
  })

  const handleLogout = async () => {
    try { await api.post('/api/dealer-auth/logout') } catch { /* ignore */ }
    clearAuth()
    navigate('/garage/login')
  }

  const cars = data?.data ?? []

  return (
    <div className="min-h-screen bg-brand-bg-alt">
      <header className="bg-brand-surface border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-bold text-brand-teal">Dealer Dashboard</p>
            <p className="text-xs text-brand-text-muted">{dealer?.name} · {dealer?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/garage" className="text-xs text-brand-text-muted hover:text-brand-green">View Garage</Link>
            <button onClick={handleLogout} className="text-xs text-brand-text-muted hover:text-brand-green">Sign out →</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-brand-teal">My Cars</h1>
          <Button onClick={openAdd} size="sm" title="List a new car">+ Add Car</Button>
        </div>

        {isLoading ? (
          <p className="text-brand-text-muted text-sm">Loading…</p>
        ) : cars.length === 0 ? (
          <p className="text-brand-text-muted text-sm">You haven't listed any cars yet.</p>
        ) : (
          <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-bg-alt">
                <tr>
                  {['Title', 'Price', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-brand-text-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {cars.map(c => (
                  <tr key={c.id} className="hover:bg-brand-bg-alt">
                    <td className="px-5 py-3 font-medium text-brand-teal">{c.title}</td>
                    <td className="px-5 py-3 text-brand-text-body">{c.price.toLocaleString()}</td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="text-xs text-brand-green hover:underline">Edit</button>
                        <button onClick={() => setDeleteId(c.id)} className="text-xs text-brand-danger hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Modal open={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Car' : 'Add Car'} maxWidth="max-w-xl">
        <CarForm
          defaultValues={editing ?? undefined}
          onSubmit={d => save.mutate(d)}
          submitting={save.isPending}
          submitLabel={editing ? 'Save changes' : 'Submit for approval'}
          onCancel={() => setModal(false)}
          error={save.isError}
        />
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Car" maxWidth="max-w-sm">
        <div className="p-6 space-y-4">
          <p className="text-brand-text-body text-sm">This will permanently delete the car listing. This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" loading={del.isPending} onClick={() => deleteId && del.mutate(deleteId)}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DealerDashboard
