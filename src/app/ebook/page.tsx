'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

function EbookContent() {
  const searchParams = useSearchParams()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const ebookName = searchParams.get('ebook') || 'AI Content Generation Guide'
  const ebookDisplayName = ebookName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  useEffect(() => {
    // Send ebook name to iframe when it loads
    const iframe = iframeRef.current
    if (iframe) {
      const handleLoad = () => {
        iframe.contentWindow?.postMessage({
          type: 'setEbookName',
          value: ebookDisplayName
        }, '*')
      }

      iframe.addEventListener('load', handleLoad)
      return () => iframe.removeEventListener('load', handleLoad)
    }
  }, [ebookDisplayName])

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
          Download {ebookDisplayName}
        </h1>
        <p className="text-gray-600 mb-8">
          Fill out the form below to receive your free eBook.
        </p>

        {/* Load the standalone HTML form in an iframe */}
        <div className="max-w-md mx-auto">
          <iframe
            ref={iframeRef}
            src={`data:text/html;charset=utf-8,${encodeURIComponent(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download Ebook</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white">
    <div class="mx-auto max-w-md px-6 py-8">
        <form
            id="webform886339000000817757"
            action="https://crm.zoho.eu/crm/WebToLeadForm"
            name="WebToLeads886339000000817757"
            method="POST"
            accept-charset="UTF-8"
        >
            <input type="hidden" name="xnQsjsdp" value="aff032ea392f9d32ea3429774425c9b50b79b3c7d8a18f2625e6a7a20ecae6a1">
            <input type="hidden" name="zc_gad" value="">
            <input type="hidden" name="xmIwtLD" value="381b878b5ea1f6a1ece3aa9488fb1f97d8f4e37038d4049edf5b85849c23ca28ff8cd03030fee032ee0bb2373de53db2">
            <input type="hidden" name="actionType" value="TGVhZHM=">
            <input type="hidden" name="returnURL" value="https://www.growtoprime.com/thanks">
            
            <div class="mb-4">
                <label for="Company" class="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <input type="text" id="Company" name="Company" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>

            <div class="mb-4">
                <label for="First_Name" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" id="First_Name" name="First Name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>

            <div class="mb-4">
                <label for="Last_Name" class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input type="text" id="Last_Name" name="Last Name" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>

            <div class="mb-4">
                <label for="Email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="Email" name="Email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>

            <div class="mb-4">
                <label for="Mobile" class="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input type="text" id="Mobile" name="Mobile" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>

            <div class="mb-4">
                <label for="LEADCF24" class="block text-sm font-medium text-gray-700 mb-1">Ebook Name</label>
                <input type="text" id="LEADCF24" name="LEADCF24" value="${ebookDisplayName}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>

            <div class="mb-4">
                <label for="LEADCF25" class="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                <select id="LEADCF25" name="LEADCF25" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="E-book">E-book</option>
        </select>
          </div>
            
            <div class="mb-6">
                <label class="flex items-center">
                    <input type="checkbox" name="privacyConsent" required class="mr-2">
                    <span class="text-sm text-gray-700">I accept the privacy policy</span>
            </label>
            </div>
            
            <input type="text" name="aG9uZXlwb3Q" style="display:none;" value="">
            
            <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Submit
                </button>
        </form>
    </div>
</body>
</html>`)}`}
            width="100%"
            height="600"
            frameBorder="0"
            style={{ border: 'none' }}
            title="Ebook Download Form"
          />
        </div>
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
