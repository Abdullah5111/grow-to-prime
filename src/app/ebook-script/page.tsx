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

function EbookScriptContent() {
  const searchParams = useSearchParams()
  const [formUrl, setFormUrl] = useState('')
  // isFormLoaded state removed as it's not used

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

  // Build Zoho WebToLead form URL with parameters
  const buildZohoFormUrl = () => {
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
      content_group2: 'ebook_script'
    })

    // Track form load
    trackEvent('ebook_form_load', { 
      form_type: 'ebook',
      ebook_name: ebookDisplayName,
      utm_source: utmParams.utm_source || '',
      utm_campaign: utmParams.utm_campaign || ''
    })

    // Set form URL
    setFormUrl(buildZohoFormUrl())
  }, [ebookDisplayName, utmParams, buildZohoFormUrl])

  const handleFormSubmit = () => {
    trackEvent('ebook_form_submit', { 
      form_type: 'ebook',
      ebook_name: ebookDisplayName,
      utm_source: utmParams.utm_source || '',
      utm_campaign: utmParams.utm_campaign || ''
    })
  }

  const handleFormError = () => {
    trackEvent('ebook_form_error', { 
      form_type: 'ebook',
      error_message: 'Form submission failed',
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
        
        {/* Zoho WebToLead Form */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <form
            action={formUrl}
            method="POST"
            onSubmit={handleFormSubmit}
            onError={handleFormError}
            className="space-y-4"
          >
            {/* Hidden fields for ebook information */}
            <input type="hidden" name="Ebook_Name__c" value={ebookDisplayName} />
            <input type="hidden" name="Content_Type__c" value="eBook" />
            
            {/* Hidden UTM fields */}
            {Object.entries(utmParams).map(([key, value]) => (
              key.startsWith('utm_') && (
                <input key={key} type="hidden" name={key} value={value} />
              )
            ))}
            
            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  id="industry"
                  name="industry"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Tell us about your business needs..."
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="privacy_consent"
                  required
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  I agree to the <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a> *
                </span>
              </label>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="marketing_consent"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  I agree to receive marketing communications
                </span>
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium"
            >
              Download {ebookDisplayName}
            </button>
          </form>
        </div>
        
        {/* Debug information (remove in production) */}
        <div className="mt-4 text-xs text-gray-400">
          <p>Form URL: {formUrl}</p>
          <p>UTM Parameters: {JSON.stringify(utmParams)}</p>
        </div>
      </div>
    </div>
  )
}

export default function EbookScriptPage() {
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
      <EbookScriptContent />
    </Suspense>
  )
}
