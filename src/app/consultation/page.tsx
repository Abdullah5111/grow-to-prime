'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type FormDataState = {
  company_name: string
  sector: string
  team_size: string
  pain_point: string
  previous_solutions: string
  objectives: string
  timing: string
  budget: string
  privacy_consent: boolean
  marketing_consent: boolean
}

const initialState: FormDataState = {
  company_name: '',
  sector: '',
  team_size: '',
  pain_point: '',
  previous_solutions: '',
  objectives: '',
  timing: '',
  budget: '',
  privacy_consent: false,
  marketing_consent: false,
}

function readGaClientId(): string {
  try {
    const cookie = document.cookie.split('; ').find((c) => c.startsWith('_ga='))
    if (!cookie) return ''
    const value = cookie.split('=')[1]
    const parts = value.split('.')
    if (parts.length >= 4) return `${parts[2]}.${parts[3]}`
    return value
  } catch {
    return ''
  }
}

function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  try {
    // @ts-expect-error optional global
    if (typeof window !== 'undefined' && window.gtag) window.gtag('event', name, params)
  } catch {}
}

function ConsultationContent() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ bookingUrl?: string; leadId?: number } | null>(null)
  const [form, setForm] = useState<FormDataState>(initialState)
  const formRef = useRef<HTMLFormElement | null>(null)

  const utmParams = useMemo(() => {
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    const entries: [string, string][] = []
    keys.forEach((k) => {
      const v = searchParams.get(k)
      if (v) entries.push([k, v])
    })
    const ref = typeof document !== 'undefined' ? document.referrer : ''
    if (ref) entries.push(['referrer', ref])
    return Object.fromEntries(entries)
  }, [searchParams])

  useEffect(() => {
    trackEvent('consultation_step_view', { step })
  }, [step])

  const validateStep = (current: number): string | null => {
    if (current === 1) {
      if (!form.company_name || !form.sector || !form.team_size) return 'Please fill company, sector, and team size.'
    }
    if (current === 2) {
      if (!form.pain_point || !form.objectives) return 'Please provide pain point and objectives.'
    }
    if (current === 3) {
      if (!form.timing || !form.budget) return 'Please specify timing and budget.'
    }
    if (current === 4) {
      if (!form.privacy_consent) return 'Privacy consent is required.'
    }
    return null
  }

  const next = () => {
    const err = validateStep(step)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setStep((s) => Math.min(4, s + 1))
  }

  const prev = () => {
    setError(null)
    setStep((s) => Math.max(1, s - 1))
  }

  const handleSubmit = async () => {
    const err = validateStep(4)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const payload = {
        ...form,
        utm_source: utmParams['utm_source'] || '',
        utm_medium: utmParams['utm_medium'] || '',
        utm_campaign: utmParams['utm_campaign'] || '',
        utm_term: utmParams['utm_term'] || '',
        utm_content: utmParams['utm_content'] || '',
        referrer: utmParams['referrer'] || (typeof document !== 'undefined' ? document.referrer : ''),
        client_id: typeof document !== 'undefined' ? readGaClientId() : '',
      }
      trackEvent('consultation_submit', { lead_quality_preview: 'auto' })
      const res = await fetch(`${apiBase}/api/consultations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || 'Submission failed')
      }
      const data = await res.json()
      setDone({ bookingUrl: data.bookingUrl || '', leadId: data.id })
      trackEvent('consultation_booking_link', { has_booking_url: Boolean(data.bookingUrl) })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="text-3xl font-bold mb-4">Thank you</h1>
          <p className="text-gray-700 mb-6">Your consultation request has been received. Well be in touch shortly.</p>
          {done.bookingUrl ? (
            <a className="inline-block rounded bg-indigo-600 px-4 py-2 text-white" href={done.bookingUrl} target="_blank" rel="noreferrer">Schedule now</a>
          ) : (
            <p className="text-gray-600">You will receive a scheduling link by email.</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Free Consultation</h1>
        <p className="text-gray-600 mb-8">Answer a few questions to help us prepare for your consultation. All steps are required.</p>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
            <span className="text-sm text-gray-500">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {error && <div className="mb-6 rounded border border-red-300 bg-red-50 p-4 text-red-700">{error}</div>}
        
        <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                    placeholder="Enter your company name" 
                    value={form.company_name} 
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector/Industry *</label>
                  <input 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                    placeholder="e.g., Technology, Healthcare, Finance" 
                    value={form.sector} 
                    onChange={(e) => setForm({ ...form, sector: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Size *</label>
                  <input 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                    placeholder="e.g., 10-50 employees" 
                    value={form.team_size} 
                    onChange={(e) => setForm({ ...form, team_size: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Business Challenges</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Pain Point *</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                    placeholder="Describe your main business challenge or pain point" 
                    rows={4} 
                    value={form.pain_point} 
                    onChange={(e) => setForm({ ...form, pain_point: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previous Solutions</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                    placeholder="What solutions have you tried before? (if any)" 
                    rows={3} 
                    value={form.previous_solutions} 
                    onChange={(e) => setForm({ ...form, previous_solutions: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Objectives *</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                    placeholder="What are your main objectives and goals?" 
                    rows={3} 
                    value={form.objectives} 
                    onChange={(e) => setForm({ ...form, objectives: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline *</label>
                  <input 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                    placeholder="e.g., Now, 1-3 months, Q2 2024" 
                    value={form.timing} 
                    onChange={(e) => setForm({ ...form, timing: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range *</label>
                  <input 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                    placeholder="e.g., €10k-50k, $50k+, Not specified" 
                    value={form.budget} 
                    onChange={(e) => setForm({ ...form, budget: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Consent & Privacy</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    id="privacy_consent"
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                    checked={form.privacy_consent} 
                    onChange={(e) => setForm({ ...form, privacy_consent: e.target.checked })} 
                  />
                  <label htmlFor="privacy_consent" className="text-sm text-gray-700">
                    I agree to the <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a> and consent to the processing of my personal data. *
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    id="marketing_consent"
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                    checked={form.marketing_consent} 
                    onChange={(e) => setForm({ ...form, marketing_consent: e.target.checked })} 
                  />
                  <label htmlFor="marketing_consent" className="text-sm text-gray-700">
                    I agree to receive marketing communications and updates about your services.
                  </label>
                </div>
              </div>
            </div>
          )}
        </form>
        
        <div className="mt-8 flex items-center justify-between">
          <button 
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={prev} 
            disabled={step === 1 || submitting}
          >
            Back
          </button>
          {step < 4 ? (
            <button 
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={next} 
              disabled={submitting}
            >
              Next
            </button>
          ) : (
            <button 
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleSubmit} 
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Request Consultation'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ConsultationPage() {
  return (
    <Suspense fallback={null}>
      <ConsultationContent />
    </Suspense>
  )
}


