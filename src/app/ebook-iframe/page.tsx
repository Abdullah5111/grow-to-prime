'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
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
    // Send to GA4
    if (typeof window !== 'undefined' && window.gtag) window.gtag('event', name, params)
    
    // Send to database
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
    fetch(`${apiBase}/api/analytics/events/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: name,
        form_type: params.form_type || 'ebook',
        error_message: params.error_message || '',
        user_data: params,
        ga_client_id: readGaClientId(),
        page_url: typeof window !== 'undefined' ? window.location.href : '',
      })
    }).catch(() => {}) // Silent fail
  } catch {}
}

function EbookIframeContent() {
  const searchParams = useSearchParams()
  const [iframeUrl, setIframeUrl] = useState('')

  const utmParams = useMemo(() => {
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    const entries: [string, string][] = []
    keys.forEach((k) => {
      const v = searchParams.get(k)
      if (v) entries.push([k, v])
    })
    const ref = (typeof document !== 'undefined' && document.referrer) ? document.referrer : ''
    if (ref) entries.push(['referrer', ref])
    return Object.fromEntries(entries)
  }, [searchParams])

  const ebookName = searchParams.get('ebook') || 'ai-content-guide'
  const ebookDisplayName = ebookName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  // Build Zoho WebToLead iframe URL
  const buildZohoIframeUrl = () => {
    const baseUrl = 'https://crm.zoho.eu/crm/WebToLeadForm'
    const params = new URLSearchParams()
    
    // Add ebook name
    params.append('Ebook_Name__c', ebookDisplayName)
    params.append('Content_Type__c', 'eBook')
    
    // Add UTM parameters
    Object.entries(utmParams).forEach(([key, value]) => {
      if (key.startsWith('utm_')) {
        params.append(key, value)
      }
    })
    
    return `${baseUrl}?${params.toString()}`
  }

  useEffect(() => {
    // Track page view
    trackEvent('page_view', {
      page_title: `eBook Download - ${ebookDisplayName}`,
      page_location: window.location.href,
      content_group1: 'form_pages',
      content_group2: 'ebook_iframe'
    })

    // Track iframe load
    trackEvent('ebook_iframe_load', { 
      form_type: 'ebook',
      ebook_name: ebookDisplayName,
      utm_source: utmParams.utm_source || '',
      utm_campaign: utmParams.utm_campaign || ''
    })

    // Set iframe URL
    setIframeUrl(buildZohoIframeUrl())
  }, [ebookDisplayName, utmParams, buildZohoIframeUrl])

  const handleIframeLoad = () => {
    trackEvent('ebook_iframe_loaded', { 
      form_type: 'ebook',
      ebook_name: ebookDisplayName
    })
  }

  const handleIframeError = () => {
    trackEvent('ebook_iframe_error', { 
      form_type: 'ebook',
      error_message: 'Iframe failed to load',
      ebook_name: ebookDisplayName
    })
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
          Download {ebookDisplayName}
        </h1>
        <p className="text-gray-600 mb-8">
          Fill out the form below to receive your free eBook. All fields are required.
        </p>
        
        {/* Zoho WebToLead Form iframe */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <iframe
            src={iframeUrl}
            width="100%"
            height="600"
            frameBorder="0"
            title={`Download ${ebookDisplayName}`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="rounded"
          />
        </div>
        
        {/* Fallback message */}
        <div className="mt-4 text-sm text-gray-500">
          <p>
            If the form doesn&apos;t load, please try refreshing the page or contact us directly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function EbookIframePage() {
  return (
    <Suspense fallback={
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="text-center">
            <div className="text-gray-500">Loading eBook form...</div>
          </div>
        </div>
      </div>
    }>
      <EbookIframeContent />
    </Suspense>
  )
}
