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
        <div className="mx-auto max-w-3xl px-6 py-16">
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
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Consultation</h1>
        <p className="text-gray-600 mb-6">Answer a few questions to help us prepare. All steps are required.</p>
        <div className="mb-4 text-sm text-gray-700">Step {step} of 4</div>
        {error && <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>}
        <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <input className="w-full border p-2 rounded" placeholder="Company name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
              <input className="w-full border p-2 rounded" placeholder="Sector" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} />
              <input className="w-full border p-2 rounded" placeholder="Team size" value={form.team_size} onChange={(e) => setForm({ ...form, team_size: e.target.value })} />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <textarea className="w-full border p-2 rounded" placeholder="Primary pain point" rows={4} value={form.pain_point} onChange={(e) => setForm({ ...form, pain_point: e.target.value })} />
              <textarea className="w-full border p-2 rounded" placeholder="Previous solutions (if any)" rows={3} value={form.previous_solutions} onChange={(e) => setForm({ ...form, previous_solutions: e.target.value })} />
              <textarea className="w-full border p-2 rounded" placeholder="Objectives" rows={3} value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <input className="w-full border p-2 rounded" placeholder="Timing (e.g., now, 1-3 months)" value={form.timing} onChange={(e) => setForm({ ...form, timing: e.target.value })} />
              <input className="w-full border p-2 rounded" placeholder="Budget (range/currency)" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={form.privacy_consent} onChange={(e) => setForm({ ...form, privacy_consent: e.target.checked })} />
                <span className="text-sm text-gray-700">I agree to the Privacy Policy</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={form.marketing_consent} onChange={(e) => setForm({ ...form, marketing_consent: e.target.checked })} />
                <span className="text-sm text-gray-700">I agree to receive marketing communications</span>
              </label>
            </div>
          )}
        </form>
        <div className="mt-6 flex items-center justify-between">
          <button className="rounded px-4 py-2 border" onClick={prev} disabled={step === 1 || submitting}>Back</button>
          {step < 4 ? (
            <button className="rounded bg-indigo-600 px-4 py-2 text-white" onClick={next} disabled={submitting}>Next</button>
          ) : (
            <button className="rounded bg-indigo-600 px-4 py-2 text-white" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit'}
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


