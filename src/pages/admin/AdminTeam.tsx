import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../../lib/api'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import SkeletonBox from '../../components/ui/SkeletonBox'
import { AdminTableSkeleton } from '../../components/ui/SkeletonBox'
import { POSITIONS } from '../../lib/positions'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamMember {
  id: string; name: string; title: string; bio: string
  photoUrl?: string; linkedIn?: string; order: number; isVisible: boolean
}

// `position` drives the Title field's dropdown but isn't sent to the API —
// only the resolved `title` string is.
type TeamMemberForm = TeamMember & { position: string }

interface StaffInvite {
  id:        string
  token:     string
  link:      string
  note?:     string
  status:    'active' | 'used' | 'expired'
  expiresAt: string
  createdAt: string
  member?:   { name: string } | null
}

// ─── Invite row ───────────────────────────────────────────────────────────────

const statusBadge = (status: StaffInvite['status']) => {
  const map = {
    active:  'bg-brand-green-subtle text-brand-green',
    used:    'bg-brand-bg-alt text-brand-text-muted',
    expired: 'bg-red-50 text-red-400',
  }
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status]}`}>{status}</span>
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="text-xs text-brand-green hover:underline focus-visible:outline-none"
      title="Copy link"
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  )
}

// ─── Loading skeleton: Order | Name | Title | Visible | Actions ───────────────

const TeamTableSkeleton = () => (
  <div className="space-y-8" aria-hidden="true">
    {/* Members table */}
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <SkeletonBox className="h-7 w-32" />
        <div className="flex gap-2">
          <SkeletonBox className="h-8 w-36 rounded-lg" />
          <SkeletonBox className="h-8 w-28 rounded-lg" />
        </div>
      </div>
      <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden">
        <div className="bg-brand-bg-alt px-5 py-3 grid grid-cols-6 gap-4 border-b border-brand-border">
          {['w-10', 'w-9', 'w-1/3', 'w-1/4', 'w-16', 'w-1/4'].map((w, i) => (
            <SkeletonBox key={i} className={`h-3 ${w}`} />
          ))}
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 5 }, (_, r) => (
            <div key={r} className="px-5 py-4 grid grid-cols-6 gap-4 items-center">
              <SkeletonBox className="h-3 w-6 mx-auto" />
              <SkeletonBox className="h-9 w-9 rounded-full" />
              <SkeletonBox className="h-4 w-3/4" />
              <SkeletonBox className="h-3 w-2/3" />
              <SkeletonBox className="h-5 w-16 rounded-full" />
              <div className="flex gap-2">
                <SkeletonBox className="h-3 w-8" />
                <SkeletonBox className="h-3 w-20" />
                <SkeletonBox className="h-3 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    {/* Active invites section */}
    <div>
      <SkeletonBox className="h-6 w-48 mb-4" />
      <div className="bg-brand-surface rounded-xl border border-brand-border p-5">
        <SkeletonBox className="h-4 w-80" />
      </div>
    </div>
  </div>
)

// ─── AdminTeam ────────────────────────────────────────────────────────────────

const AdminTeam = () => {
  const qc = useQueryClient()

  // Team members state
  const [editing, setEditing]   = useState<TeamMember | null>(null)
  const [modalOpen, setModal]   = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Invite state
  const [inviteModal, setInviteModal] = useState(false)
  const [newLink, setNewLink]         = useState('')
  const [inviteFor, setInviteFor]     = useState<string>('new') // 'new' or memberId
  const [expiresIn, setExpiresIn]     = useState(24) // hours

  const { data, isLoading } = useQuery<{ data: TeamMember[] }>({
    queryKey: ['admin-team'],
    queryFn:  () => api.get('/api/admin/team').then(r => r.data),
  })

  const { data: inviteData, isLoading: invitesLoading } = useQuery<{ data: StaffInvite[] }>({
    queryKey: ['admin-invites'],
    queryFn:  () => api.get('/api/admin/invites').then(r => r.data),
  })

  const { register, handleSubmit, reset, watch, setValue } = useForm<TeamMemberForm>()
  const position = watch('position')

  // Keep `title` (the value actually sent to the API) in sync with the
  // dropdown selection — only the "Other" text input sets it directly.
  useEffect(() => {
    if (position && position !== 'other') setValue('title', position)
  }, [position, setValue])

  const openAdd  = () => { setEditing(null); reset({ order: 0, isVisible: true, position: '' }); setModal(true) }
  const openEdit = (m: TeamMember) => {
    setEditing(m)
    const matched = POSITIONS.find(p => p.label === m.title)
    reset({ ...m, position: matched ? matched.label : 'other' })
    setModal(true)
  }

  const save = useMutation({
    mutationFn: (d: TeamMemberForm) => {
      const { position: _position, ...rest } = d
      return editing ? api.put(`/api/admin/team/${editing.id}`, rest) : api.post('/api/admin/team', rest)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-team'] }); setModal(false) },
  })

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/team/${id}`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin-team'] }); setDeleteId(null) },
  })

  const createInvite = useMutation({
    mutationFn: () => api.post<{ data: StaffInvite; link: string }>('/api/admin/invites', {
      memberId:  inviteFor === 'new' ? undefined : inviteFor,
      expiresIn,
    }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['admin-invites'] })
      setNewLink(res.data.link)
    },
  })

  const revokeInvite = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/invites/${id}`),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['admin-invites'] }),
  })

  const members = data?.data ?? []
  const invites = inviteData?.data ?? []
  const activeInvites = invites.filter(i => i.status === 'active')

  if (isLoading) return <TeamTableSkeleton />

  const openInviteModal = (memberId = 'new') => {
    setInviteFor(memberId)
    setNewLink('')
    setExpiresIn(24)
    setInviteModal(true)
  }

  return (
    <div className="space-y-8">
      {/* ── Team Members ──────────────────────────────────────────────── */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-brand-teal">Team Members</h1>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => openInviteModal('new')} size="sm" variant="secondary">
              Send Onboarding Link
            </Button>
            <Button onClick={openAdd} size="sm">+ Add Member</Button>
          </div>
        </div>

        <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden overflow-x-auto">
          {members.length === 0 ? <p className="p-5 text-brand-text-muted text-sm">No team members yet.</p>
            : (
              <table className="w-full text-sm">
                <thead className="bg-brand-bg-alt">
                  <tr>
                    {['Order', 'Photo', 'Name', 'Title', 'Visible', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-brand-text-muted uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map((m, i) => (
                    <tr key={m.id} className="hover:bg-brand-bg-alt">
                      <td className="px-5 py-3 text-brand-text-muted text-center w-16">{i + 1}</td>
                      <td className="px-5 py-3">
                        {m.photoUrl ? (
                          <img src={m.photoUrl} alt={m.name} className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-brand-bg-alt flex items-center justify-center text-xs font-medium text-brand-text-muted">
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 font-medium text-brand-teal">{m.name}</td>
                      <td className="px-5 py-3 text-brand-text-body">{m.title}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.isVisible ? 'bg-brand-green-subtle text-brand-green' : 'bg-brand-bg-alt text-brand-text-muted'}`}>
                          {m.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-3">
                          <button onClick={() => openEdit(m)} className="text-xs text-brand-green hover:underline">Edit</button>
                          <button onClick={() => openInviteModal(m.id)} className="text-xs text-blue-500 hover:underline">Send edit link</button>
                          <button onClick={() => setDeleteId(m.id)} className="text-xs text-brand-danger hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>

      {/* ── Active Onboarding Invites ──────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold text-brand-teal mb-4">Active Onboarding Invites</h2>

        {invitesLoading ? (
          <AdminTableSkeleton cols={['w-1/5', 'w-1/5', 'w-24', 'w-16', 'w-20', 'w-14']} rows={3} />
        ) : (
        <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden overflow-x-auto">
          {activeInvites.length === 0
            ? <p className="p-5 text-brand-text-muted text-sm">No active invites. Use "Send Onboarding Link" to generate one.</p>
            : (
              <table className="w-full text-sm">
                <thead className="bg-brand-bg-alt">
                  <tr>
                    {['For', 'Note', 'Expires', 'Status', 'Link', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-brand-text-muted uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeInvites.map(inv => (
                    <tr key={inv.id} className="hover:bg-brand-bg-alt">
                      <td className="px-5 py-3 text-brand-text-body font-medium">
                        {inv.member?.name ?? <span className="text-brand-text-muted italic">New member</span>}
                      </td>
                      <td className="px-5 py-3 text-brand-text-muted max-w-[140px] truncate">{inv.note ?? '—'}</td>
                      <td className="px-5 py-3 text-brand-text-muted text-xs whitespace-nowrap">
                        {new Date(inv.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3">{statusBadge(inv.status)}</td>
                      <td className="px-5 py-3"><CopyButton text={inv.link} /></td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => revokeInvite.mutate(inv.id)}
                          className="text-xs text-brand-danger hover:underline"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
        )}
      </div>

      {/* ── Member form modal ─────────────────────────────────────────── */}
      <Modal open={modalOpen} onClose={() => setModal(false)} title={editing ? 'Edit Member' : 'Add Member'} maxWidth="max-w-lg">
        <form onSubmit={handleSubmit(d => save.mutate(d))} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-h mb-1">Full Name</label>
            <input className="w-full px-3 py-2 rounded-lg border border-brand-border bg-brand-bg-alt text-brand-text-h text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              {...register('name')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-h mb-1">Position</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-brand-border bg-brand-bg-alt text-brand-text-h text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              defaultValue=""
              {...register('position')}
            >
              <option value="" disabled>Select a position…</option>
              {POSITIONS.map(p => (
                <option key={p.label} value={p.label}>{p.label}</option>
              ))}
              <option value="other">Other (not listed)</option>
            </select>
          </div>
          {position === 'other' && (
            <div>
              <label className="block text-sm font-medium text-brand-text-h mb-1">Job Title</label>
              <input className="w-full px-3 py-2 rounded-lg border border-brand-border bg-brand-bg-alt text-brand-text-h text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                {...register('title')} />
            </div>
          )}
          {[
            { name: 'photoUrl' as const, label: 'Photo URL' },
            { name: 'linkedIn' as const, label: 'LinkedIn URL' },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-brand-text-h mb-1">{f.label}</label>
              <input className="w-full px-3 py-2 rounded-lg border border-brand-border bg-brand-bg-alt text-brand-text-h text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                {...register(f.name)} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-brand-text-h mb-1">Bio</label>
            <textarea rows={4} className="w-full px-3 py-2 rounded-lg border border-brand-border bg-brand-bg-alt text-brand-text-h text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
              {...register('bio')} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-brand-text-h mb-1">Order</label>
              <input type="number" className="w-full px-3 py-2 rounded-lg border border-brand-border bg-brand-bg-alt text-brand-text-h text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                {...register('order', { valueAsNumber: true })} />
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 text-sm font-medium text-brand-text-h cursor-pointer">
                <input type="checkbox" className="accent-brand-green h-4 w-4" {...register('isVisible')} />
                Visible on site
              </label>
            </div>
          </div>
          {save.isError && <p className="text-brand-danger text-sm">Save failed.</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={save.isPending}>{editing ? 'Save changes' : 'Add member'}</Button>
          </div>
        </form>
      </Modal>

      {/* ── Delete confirm modal ──────────────────────────────────────── */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Member" maxWidth="max-w-sm">
        <div className="p-6 space-y-4">
          <p className="text-brand-text-body text-sm">Permanently delete this team member?</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" loading={del.isPending} onClick={() => deleteId && del.mutate(deleteId)}>Delete</Button>
          </div>
        </div>
      </Modal>

      {/* ── Generate invite modal ─────────────────────────────────────── */}
      <Modal open={inviteModal} onClose={() => { setInviteModal(false); setNewLink('') }} title="Send Onboarding Link" maxWidth="max-w-md">
        <div className="p-6 space-y-5">
          {!newLink ? (
            <>
              <p className="text-sm text-brand-text-body leading-relaxed">
                {inviteFor === 'new'
                  ? 'This will generate a one-time link for a new staff member to fill in their profile details.'
                  : `This will generate a one-time link for ${members.find(m => m.id === inviteFor)?.name ?? 'this member'} to update their profile.`}
              </p>
              <div>
                <label className="block text-xs font-semibold text-brand-text-muted uppercase tracking-wide mb-2">
                  Link expires after
                </label>
                <div className="flex gap-2">
                  {[{ label: '24 hours', value: 24 }, { label: '48 hours', value: 48 }, { label: '72 hours', value: 72 }].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setExpiresIn(opt.value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        expiresIn === opt.value
                          ? 'bg-brand-green/10 border-brand-green text-brand-green'
                          : 'border-brand-border text-brand-text-muted hover:border-brand-green/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-brand-text-muted">Single-use — the link is invalidated immediately after the staff member submits.</p>
              </div>
              {createInvite.isError && (
                <p className="text-brand-danger text-sm">Failed to generate link. Try again.</p>
              )}
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setInviteModal(false)}>Cancel</Button>
                <Button
                  loading={createInvite.isPending}
                  onClick={() => createInvite.mutate()}
                >
                  Generate link
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-brand-text-body">Link generated! Copy and send it to the staff member.</p>
              <div className="flex items-center gap-2 rounded-xl border border-brand-border bg-brand-bg px-4 py-3">
                <code className="flex-1 text-xs text-brand-green break-all leading-relaxed">{newLink}</code>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => { navigator.clipboard.writeText(newLink) }}
                >
                  Copy link
                </Button>
                <Button onClick={() => { setInviteModal(false); setNewLink('') }}>Done</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default AdminTeam
