import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../../lib/api'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import SkeletonBox from '../../components/ui/SkeletonBox'

interface FaqItem { id: string; question: string; answer: string; order: number }

const AdminFaq = () => {
  const qc = useQueryClient()
  const [editing, setEditing]   = useState<FaqItem | null>(null)
  const [modalOpen, setModal]   = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<{ data: FaqItem[] }>({
    queryKey: ['admin-faq'],
    queryFn:  () => api.get('/api/admin/faq').then(r => r.data),
  })

  const { register, handleSubmit, reset } = useForm<FaqItem>()
  const items = data?.data ?? []

  const openAdd  = () => { setEditing(null); reset({ order: items.length + 1 }); setModal(true) }
  const openEdit = (f: FaqItem) => { setEditing(f); reset(f); setModal(true) }

  const save = useMutation({
    mutationFn: (d: FaqItem) => editing
      ? api.put(`/api/admin/faq/${editing.id}`, d)
      : api.post('/api/admin/faq', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-faq'] }); setModal(false) },
  })

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/faq/${id}`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin-faq'] }); setDeleteId(null) },
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-teal">FAQ</h1>
        <Button onClick={openAdd} size="sm">+ Add Question</Button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5" aria-hidden="true">
              <SkeletonBox className={`h-4 mb-2 ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'}`} />
              <SkeletonBox className="h-3 w-full mt-2 opacity-60" />
              <SkeletonBox className="h-3 w-4/5 mt-1 opacity-40" />
            </div>
          ))
        ) : items.length === 0 ? <p className="text-gray-400 text-sm">No FAQ items yet.</p>
          : items.map((item, i) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">#{i + 1}</p>
                  <p className="font-semibold text-brand-teal text-sm">{item.question}</p>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.answer}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="text-xs text-brand-green hover:underline">Edit</button>
                  <button onClick={() => setDeleteId(item.id)} className="text-xs text-brand-danger hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Question' : 'Add Question'} maxWidth="max-w-lg">
        <form onSubmit={handleSubmit(d => save.mutate(d))} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-h mb-1">Question</label>
            <input className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              {...register('question', { required: true })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-h mb-1">Answer</label>
            <textarea rows={5} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
              {...register('answer', { required: true })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-h mb-1">Order</label>
            <input type="number" className="w-24 px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              {...register('order', { valueAsNumber: true })} />
          </div>
          {save.isError && <p className="text-brand-danger text-sm">Save failed.</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={save.isPending}>{editing ? 'Save changes' : 'Add question'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete FAQ Item" maxWidth="max-w-sm">
        <div className="p-6 space-y-4">
          <p className="text-brand-text-body text-sm">Permanently delete this FAQ item?</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" loading={del.isPending} onClick={() => deleteId && del.mutate(deleteId)}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminFaq
