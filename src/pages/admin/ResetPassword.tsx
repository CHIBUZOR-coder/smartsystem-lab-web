import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../../lib/api'
import Button from '../../components/ui/Button'

interface ResetForm { newPassword: string; confirmPassword: string }

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetForm>()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)
  const [showPass, setShowPass] = useState(false)

  const onSubmit = async (data: ResetForm) => {
    setLoading(true)
    setError('')
    try {
      await api.post('/api/auth/reset-password', { token, newPassword: data.newPassword })
      setDone(true)
      setTimeout(() => navigate('/admin/login', { replace: true }), 2500)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Reset failed. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="force-light min-h-screen bg-brand-teal flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 shadow-xl text-center space-y-3 max-w-sm w-full">
          <p className="text-[#062020] font-semibold">Invalid reset link</p>
          <Link to="/admin/forgot-password" className="text-xs text-brand-green hover:underline block">
            Request a new one
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="force-light min-h-screen bg-brand-teal flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-brand-green mb-4">
            <span className="text-brand-teal font-black text-xl">AZ</span>
          </div>
          <h1 className="text-white font-bold text-xl">AZ SMARTSYSTEM <span className="text-brand-green">LAB</span></h1>
          <p className="text-white/50 text-sm mt-1">Admin Portal</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          {done ? (
            <div className="text-center space-y-3 py-2">
              <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[#062020] font-semibold">Password reset!</p>
              <p className="text-gray-400 text-xs">Redirecting to sign in…</p>
            </div>
          ) : (
            <>
              <h2 className="text-[#062020] font-bold text-lg mb-5">Set new password</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#214040] mb-1.5">New password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 text-[#062020] text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition"
                      {...register('newPassword', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'At least 8 characters' },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#062020] transition-colors focus-visible:outline-none"
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {showPass
                          ? <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                          : <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        }
                      </svg>
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#214040] mb-1.5">Confirm password</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[#062020] text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: v => v === watch('newPassword') || 'Passwords do not match',
                    })}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <Button type="submit" variant="primary" loading={loading} className="w-full">
                  Reset password
                </Button>

                <div className="text-center pt-1">
                  <Link to="/admin/login" className="text-xs text-gray-400 hover:text-brand-teal transition-colors">
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

export default ResetPassword
