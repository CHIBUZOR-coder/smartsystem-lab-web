import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/api'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import SkeletonBox from '../../components/ui/SkeletonBox'
import CarForm, { type CarFormValues } from '../../components/garage/CarForm'
import MultiImageUpload from '../../components/garage/MultiImageUpload'

type CarStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface Car {
  id: string; title: string; description: string; price: number
  whatsappNumber: string; images: string[]; features: string[]; status: CarStatus
  dealer: { id: string; name: string } | null
  addedByAdmin: { id: string; name: string } | null
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

const FILTERS: { label: string; value: CarStatus | 'ALL' }[] = [
  { label: 'Pending',  value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'All',      value: 'ALL' },
]

const CarsTableSkeleton = () => (
  <div aria-hidden="true">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <SkeletonBox className="h-7 w-24" />
      <SkeletonBox className="h-8 w-28 rounded-lg" />
    </div>
    <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden">
      <div className="divide-y divide-brand-border">
        {Array.from({ length: 5 }, (_, r) => (
          <div key={r} className="px-5 py-4 grid grid-cols-4 gap-4 items-center">
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-3 w-1/2" />
            <SkeletonBox className="h-5 w-20 rounded-full" />
            <SkeletonBox className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

const GarageCardPanel = () => {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-garage-card'],
    queryFn:  () => api.get('/api/admin/garage-card').then(r => r.data.data as { images: string[] }),
  })
  const [images, setImages] = useState<string[]>([])
  const [dirty, setDirty]   = useState(false)

  useEffect(() => { if (data) setImages(data.images) }, [data])

  const save = useMutation({
    mutationFn: (imgs: string[]) => api.put('/api/admin/garage-card', { images: imgs }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-garage-card'] })
      qc.invalidateQueries({ queryKey: ['garage-card'] })
      setDirty(false)
    },
  })

  if (isLoading) return null

  return (
    <div className="bg-brand-surface rounded-xl border border-brand-border p-5 mb-6">
      <h2 className="text-sm font-semibold text-brand-text-h mb-1">Garage Card Images</h2>
      <p className="text-xs text-brand-text-muted mb-3">Shown on the "Garage Section" card on the public /products page.</p>
      <MultiImageUpload
        folder="garage"
        value={images}
        onChange={urls => { setImages(urls); setDirty(true) }}
        label="Images"
      />
      {dirty && (
        <div className="flex justify-end mt-3">
          <Button size="sm" loading={save.isPending} onClick={() => save.mutate(images)}>Save</Button>
        </div>
      )}
    </div>
  )
}

const AdminCars = () => {
  const qc = useQueryClient()
  const [filter, setFilter]     = useState<CarStatus | 'ALL'>('PENDING')
  const [editing, setEditing]   = useState<Car | null>(null)
  const [modalOpen, setModal]   = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<{ data: Car[] }>({
    queryKey: ['admin-cars', filter],
    queryFn:  () => api.get('/api/admin/cars', { params: filter === 'ALL' ? {} : { status: filter } }).then(r => r.data),
  })

  const openAdd  = () => { setEditing(null); setModal(true) }
  const openEdit = (c: Car) => { setEditing(c); setModal(true) }

  const save = useMutation({
    mutationFn: (d: CarFormValues) =>
      editing
        ? api.put(`/api/admin/cars/${editing.id}`, d)
        : api.post('/api/admin/cars', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-cars'] }); setModal(false) },
  })

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CarStatus }) =>
      api.put(`/api/admin/cars/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-cars'] }),
  })

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/cars/${id}`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin-cars'] }); setDeleteId(null) },
  })

  const cars = data?.data ?? []

  if (isLoading) return <CarsTableSkeleton />

  return (
    <div>
      <GarageCardPanel />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-teal">Car Approvals</h1>
        <Button onClick={openAdd} size="sm" title="Add a new car listing">+ Add Car</Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={[
              'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors',
              filter === f.value
                ? 'bg-brand-green text-brand-text-h border-brand-green'
                : 'bg-transparent text-brand-text-muted border-brand-border hover:border-brand-green/40',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden overflow-x-auto">
        {cars.length === 0 ? (
          <p className="p-5 text-brand-text-muted text-sm">No cars in this view.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-brand-bg-alt">
              <tr>
                {['Title', 'Listed by', 'Price', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-brand-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {cars.map(c => (
                <tr key={c.id} className="hover:bg-brand-bg-alt">
                  <td className="px-5 py-3">
                    <p className="font-medium text-brand-teal">{c.title}</p>
                  </td>
                  <td className="px-5 py-3 text-brand-text-body">
                    {c.dealer?.name ?? c.addedByAdmin?.name ?? 'AZ SmartSystem Lab'}
                  </td>
                  <td className="px-5 py-3 text-brand-text-body">{c.price.toLocaleString()}</td>
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      {c.status === 'PENDING' && (
                        <>
                          <button onClick={() => setStatus.mutate({ id: c.id, status: 'APPROVED' })} className="text-xs text-brand-green hover:underline">Approve</button>
                          <button onClick={() => setStatus.mutate({ id: c.id, status: 'REJECTED' })} className="text-xs text-brand-danger hover:underline">Reject</button>
                        </>
                      )}
                      <button onClick={() => openEdit(c)} className="text-xs text-brand-green hover:underline">Edit</button>
                      <button onClick={() => setDeleteId(c.id)} className="text-xs text-brand-danger hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Car' : 'Add Car'} maxWidth="max-w-xl">
        <CarForm
          defaultValues={editing ?? undefined}
          onSubmit={d => save.mutate(d)}
          submitting={save.isPending}
          submitLabel={editing ? 'Save changes' : 'Add car'}
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

export default AdminCars
