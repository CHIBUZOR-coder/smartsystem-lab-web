import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../../lib/api'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import ImageUpload from '../../components/admin/ImageUpload'
import VideoUpload from '../../components/admin/VideoUpload'
import SkeletonBox from '../../components/ui/SkeletonBox'

interface Product {
  id: string; slug: string; name: string; tagline: string; description: string
  category: string; status: 'AVAILABLE' | 'PILOT' | 'COMING_SOON'
  features: string[]; targetUsers: string[]; imageUrl?: string; videoUrl?: string
}

type FormData = Omit<Product, 'id'> & { featuresRaw: string; targetUsersRaw: string }

const statusMap: Record<Product['status'], 'available' | 'pilot' | 'coming-soon'> = {
  AVAILABLE: 'available', PILOT: 'pilot', COMING_SOON: 'coming-soon',
}

// Name/tagline | Category | Status | Actions
const ProductsTableSkeleton = () => (
  <div aria-hidden="true">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <SkeletonBox className="h-7 w-24" />
      <SkeletonBox className="h-8 w-28 rounded-lg" />
    </div>
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-5 py-3 grid grid-cols-4 gap-4 border-b border-gray-100">
        {['w-2/5', 'w-1/4', 'w-1/5', 'w-1/5'].map((w, i) => (
          <SkeletonBox key={i} className={`h-3 ${w}`} />
        ))}
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 7 }, (_, r) => (
          <div key={r} className="px-5 py-4 grid grid-cols-4 gap-4 items-center">
            <div className="space-y-1.5">
              <SkeletonBox className="h-4 w-3/4" />
              <SkeletonBox className="h-3 w-full" />
            </div>
            <SkeletonBox className="h-3 w-3/4" />
            <SkeletonBox className="h-5 w-20 rounded-full" />
            <div className="flex gap-3">
              <SkeletonBox className="h-3 w-8" />
              <SkeletonBox className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const AdminProducts = () => {
  const qc = useQueryClient()
  const [editing, setEditing]   = useState<Product | null>(null)
  const [modalOpen, setModal]   = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<{ data: Product[] }>({
    queryKey: ['admin-products'],
    queryFn:  () => api.get('/api/admin/products').then(r => r.data),
  })

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>()

  const openAdd = () => { setEditing(null); reset({}); setModal(true) }
  const openEdit = (p: Product) => {
    setEditing(p)
    reset({ ...p, featuresRaw: p.features.join('\n'), targetUsersRaw: p.targetUsers.join('\n'), imageUrl: p.imageUrl ?? '', videoUrl: p.videoUrl ?? '' })
    setModal(true)
  }

  const save = useMutation({
    mutationFn: (d: FormData) => {
      const payload = { ...d, features: d.featuresRaw.split('\n').filter(Boolean), targetUsers: d.targetUsersRaw.split('\n').filter(Boolean) }
      return editing
        ? api.put(`/api/admin/products/${editing.id}`, payload)
        : api.post('/api/admin/products', payload)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); setModal(false) },
  })

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/products/${id}`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); setDeleteId(null) },
  })

  const products = data?.data ?? []

  if (isLoading) return <ProductsTableSkeleton />

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-teal">Products</h1>
        <Button onClick={openAdd} size="sm">+ Add Product</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        {products.length === 0 ? (
          <p className="p-5 text-gray-400 text-sm">No products yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Category', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-brand-teal">{p.name}</p>
                    <p className="text-gray-400 text-xs truncate max-w-xs">{p.tagline}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{p.category}</td>
                  <td className="px-5 py-3"><Badge status={statusMap[p.status]} /></td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-xs text-brand-green hover:underline">Edit</button>
                      <button onClick={() => setDeleteId(p.id)} className="text-xs text-brand-danger hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit modal */}
      <Modal open={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Product' : 'Add Product'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit(d => save.mutate(d))} className="p-6 space-y-4">
          {[
            { name: 'name' as const,     label: 'Name',     req: true },
            { name: 'slug' as const,     label: 'Slug',     req: true },
            { name: 'tagline' as const,  label: 'Tagline',  req: true },
            { name: 'category' as const, label: 'Category', req: true },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-brand-text-h mb-1">{f.label}</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                {...register(f.name, f.req ? { required: `${f.label} is required` } : {})}
              />
              {errors[f.name] && <p className="text-brand-danger text-xs mt-1">{errors[f.name]?.message}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-brand-text-h mb-1">Description</label>
            <textarea rows={3} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
              {...register('description', { required: 'Description is required' })} />
          </div>

          <ImageUpload
            folder="products"
            value={watch('imageUrl') ?? ''}
            onChange={url => setValue('imageUrl', url)}
            label="Product Image"
          />

          <VideoUpload
            value={watch('videoUrl') ?? ''}
            onChange={url => setValue('videoUrl', url)}
          />

          <div>
            <label className="block text-sm font-medium text-brand-text-h mb-1">Status</label>
            <select className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              {...register('status', { required: true })}>
              <option value="AVAILABLE">Available</option>
              <option value="PILOT">Pilot</option>
              <option value="COMING_SOON">Coming Soon</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-h mb-1">Features <span className="text-gray-400 font-normal">(one per line)</span></label>
            <textarea rows={4} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
              {...register('featuresRaw')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-h mb-1">Target Users <span className="text-gray-400 font-normal">(one per line)</span></label>
            <textarea rows={3} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
              {...register('targetUsersRaw')} />
          </div>

          {save.isError && <p className="text-brand-danger text-sm">Save failed. Please try again.</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={save.isPending}>{editing ? 'Save changes' : 'Add product'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product" maxWidth="max-w-sm">
        <div className="p-6 space-y-4">
          <p className="text-brand-text-body text-sm">This will permanently delete the product. This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" loading={del.isPending} onClick={() => deleteId && del.mutate(deleteId)}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminProducts
