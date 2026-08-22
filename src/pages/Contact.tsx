import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import api from '../lib/api'
import Button from '../components/ui/Button'
import SeoHead from '../components/ui/SeoHead'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeadForm {
  name:        string
  email:       string
  phone:       string
  company:     string
  companySize: string
  reason:      'demo' | 'partnership' | 'general'
  message:     string
}

// ─── Field primitives ─────────────────────────────────────────────────────────

const labelCls = 'block text-xs font-semibold uppercase tracking-widest text-brand-text-muted mb-2'
const inputCls = [
  'w-full rounded-lg border px-4 py-3 text-sm text-brand-text-h bg-brand-bg',
  'placeholder:text-brand-text-muted/50',
  'border-brand-border',
  'focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/30',
  'transition-colors duration-200',
].join(' ')
const errorCls = 'mt-1.5 text-xs text-brand-danger'

// ─── Success state ────────────────────────────────────────────────────────────

const SuccessState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center text-center py-16 gap-6"
  >
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center"
      style={{ background: 'rgba(0,200,150,0.12)', border: '1.5px solid rgba(0,200,150,0.35)' }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M5 14L11 20L23 8" stroke="#00C896" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div>
      <h2 className="text-2xl font-bold text-brand-text-h">Message received.</h2>
      <p className="mt-3 text-brand-text-muted text-sm leading-relaxed max-w-sm">
        Thank you for reaching out. Our team will review your request and get back to you
        within one business day.
      </p>
    </div>
    <Link to="/products">
      <Button variant="secondary" size="md">Browse our products</Button>
    </Link>
  </motion.div>
)

// ─── Contact info sidebar ─────────────────────────────────────────────────────

const ContactSidebar = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-brand-green mb-4">
        What happens next
      </h3>
      <ol className="space-y-4">
        {[
          { step: '01', text: 'Our team reviews your request, usually within one business day.' },
          { step: '02', text: 'We schedule a call to understand your property and use case.' },
          { step: '03', text: 'We propose the right product combination and deployment plan.' },
        ].map(({ step, text }) => (
          <li key={step} className="flex gap-4">
            <span className="text-xs font-bold text-brand-green mt-0.5 flex-shrink-0 w-6">{step}</span>
            <p className="text-sm text-brand-text-muted leading-relaxed">{text}</p>
          </li>
        ))}
      </ol>
    </div>

    <div className="h-px bg-brand-border" />

    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-brand-green mb-4">
        Get in touch
      </h3>
      <div className="space-y-3">
        <div className="flex items-start gap-3 text-sm text-brand-text-muted">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0 text-brand-green" aria-hidden="true">
            <path d="M2 4l6 4 6-4M2 4h12v9H2V4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>hello@azsmartsystem.com</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-brand-text-muted">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0 text-brand-green" aria-hidden="true">
            <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <span>Lagos, Nigeria</span>
        </div>
      </div>
    </div>

    <div className="h-px bg-brand-border" />

    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3">
        Have general questions?
      </h3>
      <p className="text-sm text-brand-text-muted leading-relaxed mb-4">
        Check our FAQ for quick answers to common questions about products, deployment, and pricing.
      </p>
      <Link
        to="/faq"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:underline underline-offset-4"
      >
        View FAQ
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <path d="M2 6.5h9M7.5 3L11 6.5 7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  </div>
)

// ─── Contact page ─────────────────────────────────────────────────────────────

const Contact = () => {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadForm>({ defaultValues: { reason: 'demo' } })

  const onSubmit = async (data: LeadForm) => {
    setServerError(null)
    try {
      const payload = {
        ...data,
        phone:       data.phone || undefined,
        company:     data.company || undefined,
        companySize: data.companySize || undefined,
      }
      await api.post('/api/leads', payload)
      setSubmitted(true)
    } catch {
      setServerError('Something went wrong. Please try again or email us directly.')
    }
  }

  return (
    <div className="overflow-x-hidden">
      <SeoHead
        title="Contact Us"
        description="Request a product demo, ask a deployment question, or explore a partnership with AZ SmartSystem Lab. Our team responds within one business day."
      />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        className="relative py-24 sm:py-32 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A2828 0%, #071A1A 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 70% 50%, rgba(0,200,150,0.07) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="block text-xs font-semibold uppercase tracking-widest text-brand-green mb-5"
          >
            Contact
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-white leading-tight"
          >
            Let's talk about your{' '}
            <span className="text-brand-green">property.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-6 text-lg text-[#A8D5C8] leading-relaxed max-w-2xl"
          >
            Whether you want a product demo, have a deployment question, or want to explore a
            partnership — fill in the form and our team will respond within one business day.
          </motion.p>
        </div>
      </section>

      {/* ── Form + Sidebar ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">

            {/* Form panel */}
            <div className="rounded-2xl border border-brand-border bg-brand-surface p-8">
              {submitted ? (
                <SuccessState />
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className={labelCls}>Full name *</label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Jane Okonkwo"
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={[inputCls, errors.name ? 'border-brand-danger' : ''].join(' ')}
                        {...register('name', { required: 'Name is required' })}
                      />
                      {errors.name && <p id="name-error" role="alert" className={errorCls}>{errors.name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className={labelCls}>Email address *</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="jane@company.com"
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={[inputCls, errors.email ? 'border-brand-danger' : ''].join(' ')}
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                        })}
                      />
                      {errors.email && <p id="email-error" role="alert" className={errorCls}>{errors.email.message}</p>}
                    </div>
                  </div>

                  {/* Phone + Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className={labelCls}>Phone number</label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+234 800 000 0000"
                        className={inputCls}
                        {...register('phone')}
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className={labelCls}>Company / Property name</label>
                      <input
                        id="company"
                        type="text"
                        placeholder="Grand Palace Hotel"
                        className={inputCls}
                        {...register('company')}
                      />
                    </div>
                  </div>

                  {/* Company size + Reason */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="companySize" className={labelCls}>Organisation size</label>
                      <select
                        id="companySize"
                        className={inputCls}
                        {...register('companySize')}
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1–10 employees</option>
                        <option value="11-50">11–50 employees</option>
                        <option value="51-200">51–200 employees</option>
                        <option value="200+">200+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="reason" className={labelCls}>Enquiry type *</label>
                      <select
                        id="reason"
                        aria-required="true"
                        className={[inputCls, errors.reason ? 'border-brand-danger' : ''].join(' ')}
                        {...register('reason', { required: true })}
                      >
                        <option value="demo">Request a demo</option>
                        <option value="partnership">Partnership / integration</option>
                        <option value="general">General enquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className={labelCls}>Message *</label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us about your property, what you're trying to solve, and anything else that would help us respond usefully."
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'msg-error' : undefined}
                      className={[inputCls, 'resize-none', errors.message ? 'border-brand-danger' : ''].join(' ')}
                      {...register('message', { required: 'Please include a message', minLength: { value: 10, message: 'Message is too short' } })}
                    />
                    {errors.message && <p id="msg-error" role="alert" className={errorCls}>{errors.message.message}</p>}
                  </div>

                  {serverError && (
                    <div className="rounded-lg border border-brand-danger/30 bg-brand-danger/5 px-4 py-3 text-sm text-brand-danger">
                      {serverError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    variant="primary"
                    loading={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    Send message
                  </Button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:pt-2">
              <ContactSidebar />
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
