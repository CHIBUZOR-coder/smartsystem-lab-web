import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../../lib/api'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import SkeletonBox from '../../components/ui/SkeletonBox'

interface Insight {
  id: string; slug: string; title: string; excerpt: string; content: string
  category: string; tags: string[]; publishedAt: string | null
}
type FormData = Omit<Insight, 'id' | 'tags'> & { tagsRaw: string }

// Title/excerpt | Category | Published | Actions
const InsightsTableSkeleton = () => (
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
              <SkeletonBox className="h-4 w-4/5" />
              <SkeletonBox className="h-3 w-full" />
            </div>
            <SkeletonBox className="h-3 w-2/3" />
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

const AdminInsights = () => {
  const qc = useQueryClient()
  const [editing, setEditing]   = useState<Insight | null>(null)
  const [modalOpen, setModal]   = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<{ data: Insight[] }>({
    queryKey: ['admin-insights'],
    queryFn:  () => api.get('/api/admin/insights').then(r => r.data),
  })

  const { register, handleSubmit, reset } = useForm<FormData>()

  const openAdd  = () => { setEditing(null); reset({}); setModal(true) }
  const openEdit = (i: Insight) => { setEditing(i); reset({ ...i, tagsRaw: i.tags.join(', ') }); setModal(true) }

  const save = useMutation({
    mutationFn: (d: FormData) => {
      const payload = { ...d, tags: d.tagsRaw.split(',').map(t => t.trim()).filter(Boolean) }
      return editing
        ? api.put(`/api/admin/insights/${editing.id}`, payload)
        : api.post('/api/admin/insights', payload)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-insights'] }); setModal(false) },
  })

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/insights/${id}`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin-insights'] }); setDeleteId(null) },
  })

  const insights = data?.data ?? []

  if (isLoading) return <InsightsTableSkeleton />

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-teal">Insights</h1>
        <Button onClick={openAdd} size="sm">+ Add Article</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        {insights.length === 0 ? <p className="p-5 text-gray-400 text-sm">No articles yet.</p>
          : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Title', 'Category', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {insights.map(ins => (
                  <tr key={ins.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-brand-teal">{ins.title}</p>
                      <p className="text-gray-400 text-xs truncate max-w-xs">{ins.excerpt}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{ins.category}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ins.publishedAt ? 'bg-brand-green-subtle text-brand-green' : 'bg-amber-50 text-amber-600'}`}>
                        {ins.publishedAt ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(ins)} className="text-xs text-brand-green hover:underline">Edit</button>
                        <button onClick={() => setDeleteId(ins.id)} className="text-xs text-brand-danger hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      <Modal open={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Article' : 'Add Article'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit(d => save.mutate(d))} className="p-6 space-y-4">
          {[
            { name: 'title' as const,    label: 'Title' },
            { name: 'slug' as const,     label: 'Slug' },
            { name: 'category' as const, label: 'Category' },
            { name: 'tagsRaw' as const,  label: 'Tags (comma-separated)' },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-brand-text-h mb-1">{f.label}</label>
              <input className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                {...register(f.name)} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-brand-text-h mb-1">Excerpt</label>
            <textarea rows={2} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
              {...register('excerpt')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-h mb-1">Content</label>
            <textarea rows={8} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none font-mono"
              {...register('content')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-h mb-1">Publish Date <span className="text-gray-400 font-normal">(leave empty to save as draft)</span></label>
            <input type="datetime-local" className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              {...register('publishedAt')} />
          </div>
          {save.isError && <p className="text-brand-danger text-sm">Save failed.</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={save.isPending}>{editing ? 'Save changes' : 'Add article'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Article" maxWidth="max-w-sm">
        <div className="p-6 space-y-4">
          <p className="text-brand-text-body text-sm">Permanently delete this article?</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" loading={del.isPending} onClick={() => deleteId && del.mutate(deleteId)}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminInsights
