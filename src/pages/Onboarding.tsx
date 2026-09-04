import { useState, useRef, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/api'
import SeoHead from '../components/ui/SeoHead'
import Button from '../components/ui/Button'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValidateResponse {
  valid:    boolean
  isEdit:   boolean
  existing: {
    name:     string
    email:    string
    title:    string
    bio:      string
    photoUrl: string
    linkedIn: string
  } | null
}

interface FormValues {
  name:     string
  email:    string
  position: string
  title:    string
  bio:      string
  photoUrl: string
  linkedIn: string
}

type TokenStatus = 'loading' | 'valid' | 'invalid'

// ─── Positions ────────────────────────────────────────────────────────────────
// `rank` determines display order on the About page (lower = higher up). Grouped
// in tiers with gaps so new positions can be inserted without renumbering.

const POSITIONS = [
  { label: 'Founder & CEO',                    rank: 10 },
  { label: 'Co-Founder',                       rank: 15 },
  { label: 'Chief Technology Officer',         rank: 20 },
  { label: 'Chief Operating Officer',          rank: 20 },
  { label: 'Chief Product Officer',            rank: 20 },
  { label: 'Head of Engineering',              rank: 30 },
  { label: 'Head of Product',                  rank: 30 },
  { label: 'Head of Design',                   rank: 30 },
  { label: 'Head of Operations',               rank: 30 },
  { label: 'Head of Marketing & Sales',        rank: 30 },
  { label: 'Senior Software Engineer',         rank: 40 },
  { label: 'Senior IoT Engineer',              rank: 40 },
  { label: 'Senior Hardware Engineer',         rank: 40 },
  { label: 'Senior Product Designer',          rank: 40 },
  { label: 'Software Engineer',                rank: 50 },
  { label: 'IoT Engineer',                     rank: 50 },
  { label: 'Hardware Engineer',                rank: 50 },
  { label: 'UI/UX Designer',                   rank: 50 },
  { label: 'Product Designer',                 rank: 50 },
  { label: 'QA Engineer',                      rank: 50 },
  { label: 'Data Analyst',                     rank: 50 },
  { label: 'Marketing Associate',              rank: 60 },
  { label: 'Sales Associate',                  rank: 60 },
  { label: 'Business Development Associate',   rank: 60 },
  { label: 'Operations Associate',             rank: 60 },
  { label: 'Customer Success Associate',       rank: 60 },
] as const

// ─── Field component ──────────────────────────────────────────────────────────

const Field = ({
  label, id, error, required = false, children,
}: {
  label: string; id: string; error?: string; required?: boolean; children: React.ReactNode
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-brand-text-h mb-1.5">
      {label}{required && <span className="text-brand-green ml-0.5">*</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-400"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
)

const inputClass = (hasError: boolean) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm bg-brand-surface text-brand-text-h placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors ${
    hasError ? 'border-red-400' : 'border-brand-border focus:border-brand-green'
  }`

// ─── Photo uploader ───────────────────────────────────────────────────────────

const PhotoUploader = ({
  token, value, onChange,
}: {
  token: string; value: string; onChange: (url: string) => void
}) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState(value)
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setPreview(value) }, [value])

  const handleFile = async (file: File) => {
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
    setUploading(true)
    setUploadError('')
    try {
      const form = new FormData()
      form.append('image', file)
      const res = await api.post<{ url: string }>(`/api/onboarding/photo?token=${token}`, form, {
        headers: { 'Content-Type': undefined },
      })
      onChange(res.data.url)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      setUploadError(e.response?.data?.error ?? 'Photo upload failed. Please try again.')
      setPreview(value)
    } finally {
      setUploading(false)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  return (
    <div className="flex items-center gap-5">
      <div
        className="relative flex-shrink-0 h-20 w-20 rounded-2xl overflow-hidden bg-brand-surface border-2 border-dashed border-brand-border cursor-pointer hover:border-brand-green transition-colors"
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Photo preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-text-muted">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm text-brand-text-h font-medium mb-1">Profile photo</p>
        <p className="text-xs text-brand-text-muted mb-2">Drag & drop or click to upload. JPG, PNG, WebP · max 5 MB</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-brand-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded"
        >
          {preview ? 'Change photo' : 'Upload photo'}
        </button>
        {uploadError && (
          <p role="alert" className="mt-1.5 text-xs text-red-400">{uploadError}</p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────

const SuccessScreen = ({ isEdit }: { isEdit: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12"
  >
    <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center">
      <svg className="w-8 h-8 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-brand-text-h mb-3">
      {isEdit ? 'Details updated!' : 'Welcome to the team!'}
    </h2>
    <p className="text-brand-text-muted text-sm leading-relaxed max-w-sm mx-auto">
      {isEdit
        ? 'Your profile has been updated successfully. Changes will appear on the website shortly.'
        : 'Your profile has been submitted. You\'ll appear on the team section once an admin sets your visibility.'}
    </p>
  </motion.div>
)

// ─── Onboarding page ──────────────────────────────────────────────────────────

const Onboarding = () => {
  const [searchParams]   = useSearchParams()
  const token            = searchParams.get('token') ?? ''
  const [status, setStatus]     = useState<TokenStatus>('loading')
  const [tokenError, setTokenError] = useState('')
  const [isEdit, setIsEdit]     = useState(false)
  const [done, setDone]         = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: '', email: '', position: '', title: '', bio: '', photoUrl: '', linkedIn: '' },
  })

  const photoUrl = watch('photoUrl')
  const position = watch('position')

  // Keep `title` (the value actually stored/displayed) in sync with the
  // dropdown selection — only the "Other" text input sets it directly.
  useEffect(() => {
    if (position && position !== 'other') setValue('title', position)
  }, [position, setValue])

  useEffect(() => {
    if (!token) { setStatus('invalid'); setTokenError('No invitation token found. Please use the link you were sent.'); return }

    api.get<ValidateResponse>(`/api/onboarding/validate?token=${token}`)
      .then(res => {
        setIsEdit(res.data.isEdit)
        if (res.data.existing) {
          const e = res.data.existing
          const matched = POSITIONS.find(p => p.label === e.title)
          setValue('name',     e.name)
          setValue('email',    e.email)
          setValue('position', matched ? matched.label : 'other')
          setValue('title',    e.title)
          setValue('bio',      e.bio)
          setValue('photoUrl', e.photoUrl)
          setValue('linkedIn', e.linkedIn)
        }
        setStatus('valid')
      })
      .catch(err => {
        const msg = err.response?.data?.error ?? 'This invitation link is invalid or has expired.'
        setTokenError(msg)
        setStatus('invalid')
      })
  }, [token, setValue])

  const onSubmit = async (data: FormValues) => {
    setSubmitError('')
    try {
      const { position: _position, ...rest } = data
      const positionRank = POSITIONS.find(p => p.label === data.position)?.rank
      await api.post('/api/onboarding/submit', { ...rest, token, positionRank })
      setDone(true)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      setSubmitError(e.response?.data?.error ?? 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <SeoHead title="Staff Onboarding" noIndex />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-brand-border bg-brand-bg/90 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-brand-green flex items-center justify-center shrink-0">
            <span className="text-[#061414] font-black text-xs leading-none">AZ</span>
          </div>
          <span className="font-bold text-sm tracking-tight text-brand-text-h">
            AZ SMARTSYSTEM <span className="text-brand-green">LAB</span>
          </span>
          <span className="ml-auto text-xs text-brand-text-muted">Staff Onboarding</span>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-xl">

          {/* Loading */}
          {status === 'loading' && (
            <div className="flex flex-col items-center py-20 gap-4">
              <svg className="w-8 h-8 animate-spin text-brand-green" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-brand-text-muted">Validating your invitation…</p>
            </div>
          )}

          {/* Invalid token */}
          {status === 'invalid' && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center"
            >
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-brand-text-h mb-2">Link not valid</h2>
              <p className="text-sm text-brand-text-muted leading-relaxed">{tokenError}</p>
            </motion.div>
          )}

          {/* Form */}
          {status === 'valid' && !done && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-brand-green mb-3">
                  {isEdit ? 'Edit your profile' : 'Join the team'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-h">
                  {isEdit ? 'Update your details' : 'Set up your profile'}
                </h1>
                <p className="mt-2 text-sm text-brand-text-muted leading-relaxed">
                  {isEdit
                    ? 'Update the information that appears on the AZ SmartSystem Lab website.'
                    : 'Fill in your details below. This information will appear on the team section of the AZ SmartSystem Lab website.'}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* Photo */}
                <div className="rounded-2xl border border-brand-border bg-brand-surface p-5">
                  <PhotoUploader
                    token={token}
                    value={photoUrl}
                    onChange={url => setValue('photoUrl', url)}
                  />
                </div>

                {/* Personal info */}
                <div className="rounded-2xl border border-brand-border bg-brand-surface p-5 space-y-4">
                  <Field label="Full name" id="name" error={errors.name?.message} required>
                    <input
                      id="name"
                      type="text"
                      placeholder="Amaka Okafor"
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className={inputClass(!!errors.name)}
                      {...register('name', { required: 'Name is required' })}
                    />
                  </Field>

                  <Field label="Work email" id="email" error={errors.email?.message} required>
                    <input
                      id="email"
                      type="email"
                      placeholder="amaka@az-smart-system.com"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={inputClass(!!errors.email)}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                      })}
                    />
                  </Field>

                  <Field label="Position" id="position" error={errors.position?.message} required>
                    <select
                      id="position"
                      aria-required="true"
                      aria-invalid={!!errors.position}
                      aria-describedby={errors.position ? 'position-error' : undefined}
                      className={inputClass(!!errors.position)}
                      defaultValue=""
                      {...register('position', { required: 'Please select your position' })}
                    >
                      <option value="" disabled>Select your position…</option>
                      {POSITIONS.map(p => (
                        <option key={p.label} value={p.label}>{p.label}</option>
                      ))}
                      <option value="other">Other (not listed)</option>
                    </select>
                  </Field>

                  {position === 'other' && (
                    <Field label="Your position" id="title" error={errors.title?.message} required>
                      <input
                        id="title"
                        type="text"
                        placeholder="e.g. Field Technician"
                        aria-required="true"
                        aria-invalid={!!errors.title}
                        aria-describedby={errors.title ? 'title-error' : undefined}
                        className={inputClass(!!errors.title)}
                        {...register('title', {
                          validate: v => position !== 'other' || (!!v && v.trim().length > 0) || 'Please describe your position',
                        })}
                      />
                    </Field>
                  )}
                </div>

                {/* Bio */}
                <div className="rounded-2xl border border-brand-border bg-brand-surface p-5">
                  <Field label="Short bio" id="bio" error={errors.bio?.message}>
                    <textarea
                      id="bio"
                      rows={4}
                      placeholder="A couple of sentences about your background, what you do at AZ SmartSystem Lab, and what you're passionate about…"
                      aria-invalid={!!errors.bio}
                      aria-describedby={errors.bio ? 'bio-error' : undefined}
                      className={`${inputClass(!!errors.bio)} resize-none`}
                      {...register('bio', {
                        validate: v => !v || v.length >= 10 || 'Bio must be at least 10 characters',
                      })}
                    />
                  </Field>
                  <p className="mt-1.5 text-xs text-brand-text-muted">This appears on the About page.</p>
                </div>

                {/* LinkedIn */}
                <div className="rounded-2xl border border-brand-border bg-brand-surface p-5">
                  <Field label="LinkedIn URL" id="linkedIn" error={errors.linkedIn?.message}>
                    <input
                      id="linkedIn"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      aria-invalid={!!errors.linkedIn}
                      aria-describedby={errors.linkedIn ? 'linkedIn-error' : undefined}
                      className={inputClass(!!errors.linkedIn)}
                      {...register('linkedIn', {
                        pattern: {
                          value: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/,
                          message: 'Enter a valid LinkedIn URL',
                        },
                      })}
                    />
                  </Field>
                  <p className="mt-1.5 text-xs text-brand-text-muted">Optional — shown as a link on your card.</p>
                </div>

                {submitError && (
                  <p role="alert" className="text-sm text-red-400 text-center">{submitError}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  className="w-full"
                >
                  {isEdit ? 'Save changes' : 'Submit profile'}
                </Button>
              </form>
            </motion.div>
          )}

          {/* Success */}
          {done && <SuccessScreen isEdit={isEdit} />}
        </div>
      </main>

      <footer className="py-6 text-center border-t border-brand-border">
        <p className="text-xs text-brand-text-muted">
          © {new Date().getFullYear()} AZ SmartSystem Lab ·{' '}
          <Link to="/" className="text-brand-green hover:underline">Visit website</Link>
        </p>
      </footer>
    </div>
  )
}

export default Onboarding
