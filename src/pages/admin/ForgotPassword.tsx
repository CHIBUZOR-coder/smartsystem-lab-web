import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../../lib/api'
import { ADMIN_BASE } from '../../lib/adminPath'
import Button from '../../components/ui/Button'
import { useThemeStore } from '../../store/themeStore'
import ThemeToggle from '../../components/ui/ThemeToggle'

interface ForgotForm { email: string }

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>()
  const [loading, setLoading]   = useState(false)
  const [resetUrl, setResetUrl] = useState('')
  const [error, setError]       = useState('')
  const { resolvedTheme }       = useThemeStore()
  const isDark                  = resolvedTheme() === 'dark'

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true)
    setError('')
    setResetUrl('')
    try {
      const res = await api.post('/api/auth/forgot-password', data)
      if (res.data.resetUrl) setResetUrl(res.data.resetUrl)
      else setResetUrl('sent')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#062020] flex items-center justify-center p-4">
      <ThemeToggle isDark={isDark} className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10" />
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-brand-green mb-4">
            <span className="text-brand-teal font-black text-xl">AZ</span>
          </div>
          <h1 className="text-white font-bold text-xl">AZ SMARTSYSTEM <span className="text-brand-green">LAB</span></h1>
          <p className="text-white/50 text-sm mt-1">Admin Portal</p>
        </div>

        <div className="bg-brand-surface rounded-2xl p-6 shadow-xl">
          {resetUrl ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-brand-text-h font-semibold text-sm">Reset link generated</p>
              </div>

              {resetUrl !== 'sent' && (
                <div>
                  <p className="text-brand-text-muted text-xs mb-2">Copy and share this link with the account holder:</p>
                  <div className="bg-brand-bg-alt rounded-lg p-3 text-xs text-brand-text-h break-all border border-brand-border font-mono">
                    {resetUrl}
                  </div>
                  <p className="text-brand-text-muted text-xs mt-2">Expires in 1 hour. Single use only.</p>
                </div>
              )}

              <Link to={`${ADMIN_BASE}/login`} className="block text-center text-xs text-brand-green hover:underline pt-1">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-brand-text-h font-bold text-lg mb-1">Reset password</h2>
              <p className="text-brand-text-muted text-xs mb-5">Enter the admin email to generate a reset link.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text-body mb-1.5">Email</label>
                  <input
                    type="email"
                    autoComplete="email"
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-border bg-brand-bg-alt text-brand-text-h text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition"
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <p className="text-brand-danger text-xs mt-1">{errors.email.message}</p>}
                </div>

                {error && (
                  <div className="bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-sm rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <Button type="submit" variant="primary" loading={loading} className="w-full">
                  Generate reset link
                </Button>

                <div className="text-center pt-1">
                  <Link to={`${ADMIN_BASE}/login`} className="text-xs text-brand-text-muted hover:text-brand-teal transition-colors">
                    Back to sign in
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
