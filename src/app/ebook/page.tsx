'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

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
// no imports needed

const BASE_IFRAME_SRC = 'https://forms.zohopublic.eu/growtoprime1/form/LeadIntakeQuestionnaire/formperma/euqcqAMxa5PxiVWyqITbTGT9yVYnL-pIamMUZDDhGrk'

function EbookContent() {
  const searchParams = useSearchParams()
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [mounted, setMounted] = useState(false)

  const utmParams = useMemo(() => {
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    const entries: [string, string][] = []
    keys.forEach((k) => {
      const v = searchParams.get(k)
      if (v) entries.push([k, v])
    })
    const ref = (typeof document !== 'undefined' && document.referrer) ? document.referrer : ''
    if (ref) entries.push(['referrer', ref])
    return new URLSearchParams(entries)
  }, [searchParams])

  const iframeSrc = useMemo(() => {
    const qs = utmParams.toString()
    return qs ? `${BASE_IFRAME_SRC}?${qs}` : BASE_IFRAME_SRC
  }, [utmParams])

  useEffect(() => {
    setMounted(true)
    const key = 'ebookLeadFallbackQueue'
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return
      const items: Record<string, unknown>[] = JSON.parse(raw)
      if (!Array.isArray(items) || items.length === 0) return
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const resend = async () => {
        const remaining: Record<string, unknown>[] = []
        for (const item of items) {
          try {
            const res = await fetch(`${apiBase}/api/ebook-leads/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            })
            if (!res.ok) remaining.push(item)
          } catch {
            remaining.push(item)
          }
        }
        if (remaining.length > 0) {
          localStorage.setItem(key, JSON.stringify(remaining))
        } else {
          localStorage.removeItem(key)
        }
      }
      resend()
    } catch {}
  }, [])

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Download the eBook</h1>
        <p className="text-gray-600 mb-8">Fill out the form to receive your eBook. Required fields are marked and privacy consent is mandatory.</p>
        <form
          className="mb-10 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget as HTMLFormElement
            const fd = new FormData(form)
            const payload = {
              first_name: String(fd.get('first_name') || ''),
              last_name: String(fd.get('last_name') || ''),
              email: String(fd.get('email') || ''),
              company: String(fd.get('company') || ''),
              sector_size: String(fd.get('sector_size') || ''),
              interests: String(fd.get('interests') || ''),
              privacy_consent: fd.get('privacy_consent') === 'on',
              marketing_consent: fd.get('marketing_consent') === 'on',
              utm_source: utmParams.get('utm_source') || '',
              utm_medium: utmParams.get('utm_medium') || '',
              utm_campaign: utmParams.get('utm_campaign') || '',
              utm_term: utmParams.get('utm_term') || '',
              utm_content: utmParams.get('utm_content') || '',
              referrer: utmParams.get('referrer') || (typeof document !== 'undefined' ? document.referrer : ''),
              client_id: typeof document !== 'undefined' ? readGaClientId() : '',
            }
            if (!payload.first_name || !payload.last_name || !payload.email || !payload.company || !payload.sector_size || !payload.interests) {
              alert('Please fill all required fields.')
              return
            }
            if (!payload.privacy_consent) {
              alert('Privacy consent is required.')
              return
            }
            
            // Track form submission attempt
            trackEvent('ebook_submit_attempt', { 
              utm_source: payload.utm_source,
              utm_campaign: payload.utm_campaign 
            })
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
            let retryCount = 0
            let ok = false
            let responseData: { bookingUrl?: string; zohoLeadId?: string } | null = null
            
            for (let attempt = 0; attempt < 3; attempt++) {
              try {
                const res = await fetch(`${apiBase}/api/ebook-leads/`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                })
                if (res.ok) {
                  ok = true
                  retryCount = attempt
                  responseData = await res.json()
                  break
                }
              } catch {}
              if (attempt < 2) await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
            }
            
            if (!ok) {
              try {
                const key = 'ebookLeadFallbackQueue'
                const raw = localStorage.getItem(key)
                const arr = raw ? JSON.parse(raw) : []
                arr.push(payload)
                localStorage.setItem(key, JSON.stringify(arr))
                alert('Saved offline (fallbackUsed=true). We will retry automatically. retryCount=2')
              } catch {
                alert('Submission failed and fallback storage unavailable. Please try again later.')
              }
            } else {
              alert(`Submitted successfully. retryCount=${retryCount}, fallbackUsed=false`)
              form.reset()
              
              // Track successful submission
              trackEvent('ebook_submit_success', { 
                has_booking_url: Boolean(responseData?.bookingUrl),
                zoho_lead_id: responseData?.zohoLeadId 
              })
              
              // Show booking link if available
              if (responseData?.bookingUrl) {
                if (confirm('Would you like to schedule a consultation?')) {
                  window.open(responseData.bookingUrl, '_blank')
                }
              }
            }
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="first_name" placeholder="First Name" required className="border p-2 rounded" />
            <input name="last_name" placeholder="Last Name" required className="border p-2 rounded" />
            <input name="email" type="email" placeholder="Email" required className="border p-2 rounded" />
            <input name="company" placeholder="Company" required className="border p-2 rounded" />
            <input name="sector_size" placeholder="Sector/Size" required className="border p-2 rounded" />
            <input name="interests" placeholder="Interests" required className="border p-2 rounded" />
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <label className="flex items-center space-x-2">
              <input name="privacy_consent" type="checkbox" required />
              <span className="text-sm text-gray-700">I agree to the Privacy Policy</span>
            </label>
            <label className="flex items-center space-x-2">
              <input name="marketing_consent" type="checkbox" />
              <span className="text-sm text-gray-700">I agree to receive marketing communications</span>
            </label>
          </div>
          <button type="submit" className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white">Download eBook</button>
        </form>
        {mounted && (
          <iframe
            ref={iframeRef}
            aria-label="Lead Intake Questionnaire"
            style={{ height: 500, width: '100%', border: 'none' }}
            src={iframeSrc}
          />
        )}
      </div>
    </div>
  )
}


export default function EbookPage() {
  return (
    <Suspense fallback={null}>
      <EbookContent />
    </Suspense>
  )
}


