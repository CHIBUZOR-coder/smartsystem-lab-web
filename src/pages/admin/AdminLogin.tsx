import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import api from '../../lib/api'
import Button from '../../components/ui/Button'

interface LoginForm { email: string; password: string }

const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
)

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { setAuth }             = useAuthStore()
  const navigate                = useNavigate()
  const location                = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin'

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/api/auth/login', data)
      setAuth(res.data.admin)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="force-light min-h-screen bg-brand-teal flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-brand-green mb-4">
            <span className="text-brand-teal font-black text-xl">AZ</span>
          </div>
          <h1 className="text-white font-bold text-xl">AZ SMARTSYSTEM <span className="text-brand-green">LAB</span></h1>
          <p className="text-white/50 text-sm mt-1">Admin Portal</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-[#062020] font-bold text-lg mb-5">Sign in</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#214040] mb-1.5">Email</label>
              <input
                type="email"
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[#062020] text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#214040] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 text-[#062020] text-sm focus:outline-none focus:ring-2 focus:ring-brand-green transition"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#062020] transition-colors focus-visible:outline-none"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" loading={loading} className="w-full">
              Sign in
            </Button>

            <div className="text-center pt-1">
              <Link
                to="/admin/forgot-password"
                className="text-xs text-gray-400 hover:text-brand-teal transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
