import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDealerAuthStore } from '../../store/dealerAuthStore'
import api from '../../lib/api'

interface LoginForm { email: string; password: string }

const DealerLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth }           = useDealerAuthStore()
  const navigate               = useNavigate()
  const location                = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/garage/dashboard'

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/api/dealer-auth/login', data)
      setAuth(res.data.dealer)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#062020] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-[#00C896] mb-4">
            <span className="text-[#061414] font-black text-xl">AZ</span>
          </div>
          <h1 className="text-white font-bold text-xl">GARAGE <span className="text-[#00C896]">SECTION</span></h1>
          <p className="text-white/50 text-sm mt-1">Dealer Sign In</p>
        </div>

        <div className="bg-[#0D2424] rounded-2xl p-6 shadow-xl border border-[#1A3D3D]">
          <h2 className="text-[#E6F5F0] font-bold text-lg mb-5">Sign in</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8AADA8] mb-1.5">Email</label>
              <input
                type="email"
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg border border-[#1A3D3D] bg-[#0A2020] text-[#E6F5F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#00C896] transition"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8AADA8] mb-1.5">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                className="w-full px-3 py-2.5 rounded-lg border border-[#1A3D3D] bg-[#0A2020] text-[#E6F5F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#00C896] transition"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-2.5 rounded-lg bg-[#00C896] text-[#061414] font-semibold text-sm hover:bg-[#00E5AD] transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <p className="text-center text-sm text-[#638A85] pt-1">
              New dealer?{' '}
              <Link to="/garage/signup" className="text-[#00C896] hover:underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DealerLogin
