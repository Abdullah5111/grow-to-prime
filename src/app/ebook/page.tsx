'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function EbookContent() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    Company: '',
    'First Name': '',
    'Last Name': '',
    Email: '',
    Mobile: '',
    LEADCF24: '',
    LEADCF25: 'E-book',
    privacyConsent: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ebookName = searchParams.get('ebook') || 'AI Content Generation Guide'
  const ebookDisplayName = ebookName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  useEffect(() => {
    const key = 'ebookLeadFallbackQueue'
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return
      const items: Record<string, unknown>[] = JSON.parse(raw)
      if (!Array.isArray(items) || items.length === 0) return
      console.log('Processing fallback queue with', items.length, 'items')
      
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const resend = async () => {
        const remaining: Record<string, unknown>[] = []
        for (const item of items) {
          try {
            console.log('Attempting to resend fallback item:', item)
            const res = await fetch(`${apiBase}/api/ebook-leads/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            })
            console.log('Fallback API response status:', res.status)
            if (!res.ok) {
              console.log('Fallback API failed, keeping item for retry')
              remaining.push(item)
            } else {
              console.log('Fallback API success')
            }
          } catch (error) {
            console.error('Fallback API error:', error)
            remaining.push(item)
          }
        }
        if (remaining.length > 0) {
          console.log('Storing', remaining.length, 'failed items for retry')
          localStorage.setItem(key, JSON.stringify(remaining))
        } else {
          console.log('All fallback items processed successfully')
          localStorage.removeItem(key)
        }
      }
      resend()
    } catch (error) {
      console.error('Error processing fallback queue:', error)
    }
  }, [])

  useEffect(() => {
    setFormData(prev => ({ ...prev, LEADCF24: ebookDisplayName }))
  }, [ebookDisplayName])

  const validateEmail = (email: string) => {
    if (!email) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.Company.trim()) {
      newErrors.Company = 'Società non può essere vuoto.'
    }

    if (!formData['Last Name'].trim()) {
      newErrors['Last Name'] = 'Cognome non può essere vuoto.'
    }

    if (formData.Email && !validateEmail(formData.Email)) {
      newErrors.Email = 'Inserire un indirizzo e-mail valido.'
    }

    if (!formData.privacyConsent) {
      newErrors.privacyConsent = 'Ti chiediamo di accettare'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    console.log('🚀 FORM SUBMISSION STARTED')
    console.log('📋 Form Data:', formData)

    try {
      // Create form data for Zoho submission
      const formDataToSubmit = new FormData()
      
      // Add required Zoho fields
      formDataToSubmit.append('xnQsjsdp', 'aff032ea392f9d32ea3429774425c9b50b79b3c7d8a18f2625e6a7a20ecae6a1')
      formDataToSubmit.append('zc_gad', '')
      formDataToSubmit.append('xmIwtLD', '381b878b5ea1f6a1ece3aa9488fb1f97d8f4e37038d4049edf5b85849c23ca28ff8cd03030fee032ee0bb2373de53db2')
      formDataToSubmit.append('actionType', 'TGVhZHM=')
      formDataToSubmit.append('returnURL', `https://www.growtoprime.com/thanks?ebook=${encodeURIComponent(formData.LEADCF24)}`)
      
      // Add form fields
      if (formData.Company) formDataToSubmit.append('Company', formData.Company)
      if (formData['First Name']) formDataToSubmit.append('First Name', formData['First Name'])
      if (formData['Last Name']) formDataToSubmit.append('Last Name', formData['Last Name'])
      if (formData.Email) formDataToSubmit.append('Email', formData.Email)
      if (formData.Mobile) formDataToSubmit.append('Mobile', formData.Mobile)
      if (formData.LEADCF24) formDataToSubmit.append('LEADCF24', formData.LEADCF24)
      if (formData.LEADCF25) formDataToSubmit.append('LEADCF25', formData.LEADCF25)
      
      // Add UTM parameters
      const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
      utmParams.forEach(param => {
        const value = searchParams.get(param)
        if (value) {
          formDataToSubmit.append(param, value)
        }
      })
      
      // Add referrer
      const referrer = document.referrer || searchParams.get('ref') || ''
      if (referrer) {
        formDataToSubmit.append('referrer', referrer)
      }
      
      // Add honeypot (empty)
      formDataToSubmit.append('aG9uZXlwb3Q', '')

      console.log('🌐 Submitting to Zoho CRM...')
      console.log('📡 Target URL: https://crm.zoho.eu/crm/WebToLeadForm')
      
      // Submit to Zoho using fetch
      const response = await fetch('https://crm.zoho.eu/crm/WebToLeadForm', {
        method: 'POST',
        body: formDataToSubmit,
        mode: 'no-cors' // Important for cross-origin requests
      })
      
      console.log('✅ Form submitted to Zoho CRM')
      console.log('🎯 Lead should be created in Zoho CRM')
      
      // Show success message
      alert('Thank you! Your information has been submitted successfully.')
      
      // Reset form
      setFormData({
        Company: '',
        'First Name': '',
        'Last Name': '',
        Email: '',
        Mobile: '',
        LEADCF24: ebookDisplayName,
        LEADCF25: 'E-book',
        privacyConsent: false
      })
      
    } catch (error) {
      console.error('❌ Error submitting form:', error)
      alert('There was an error submitting the form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
          Download {ebookDisplayName}
        </h1>
        <p className="text-gray-600 mb-8">
          Fill out the form below to receive your free eBook. All required fields are marked with an asterisk (*).
        </p>

<div 
  id="crmWebToEntityForm" 
  className="zcwf_lblLeft crmWebToEntityForm" 
          style={{backgroundColor: '#fff', color: '#000', maxWidth: '600px', width: '100%', padding: '25px', margin: '0 auto', boxSizing: 'border-box'}}
        >
          <style jsx>{`
            .zcwf_lblLeft * { box-sizing: border-box; }
            .zcwf_lblLeft { text-align: left; }
            .zcwf_lblLeft * { direction: ltr; }
            .zcwf_lblLeft .zcwf_title { word-wrap: break-word; padding: 0 6px 10px; font-weight: bold; }
            .zcwf_lblLeft .zcwf_col_fld input[type=text], 
            .zcwf_lblLeft .zcwf_col_fld input[type=email], 
            .zcwf_lblLeft .zcwf_col_fld textarea { 
              width: 60%; 
              border: 1px solid #c0c6cc !important; 
              resize: vertical; 
              border-radius: 2px; 
              float: left; 
              padding: 8px;
            }
            .zcwf_lblLeft .zcwf_col_lab { 
              width: 30%; 
              word-break: break-word; 
              padding: 0 6px 0; 
              margin-right: 10px; 
              margin-top: 5px; 
              float: left; 
              min-height: 1px; 
              font-size: 12px; 
              font-family: Arial;
            }
            .zcwf_lblLeft .zcwf_col_fld { 
              float: left; 
              width: 68%; 
              padding: 0 6px 0; 
              position: relative; 
              margin-top: 5px; 
            }
            .zcwf_lblLeft .zcwf_privacy { padding: 6px; }
            .zcwf_lblLeft .wfrm_fld_dpNn { display: none; }
            .dIB { display: inline-block; }
            .zcwf_lblLeft .zcwf_col_fld_slt { 
              width: 60%; 
              border: 1px solid #ccc; 
              background: #fff; 
              border-radius: 4px; 
              font-size: 12px; 
              float: left; 
              resize: vertical; 
              padding: 2px 5px; 
            }
            .zcwf_lblLeft .zcwf_row:after, 
            .zcwf_lblLeft .zcwf_col_fld:after { 
              content: ''; 
              display: table; 
              clear: both; 
            }
            .zcwf_lblLeft .zcwf_col_help { 
              float: left; 
              margin-left: 7px; 
              font-size: 12px; 
              max-width: 35%; 
              word-break: break-word; 
            }
            .zcwf_lblLeft .zcwf_row { margin: 15px 0; }
            .zcwf_lblLeft .formsubmit { 
              margin-right: 5px; 
              cursor: pointer; 
              color: #313949; 
              font-size: 12px; 
              background: transparent linear-gradient(0deg, #0279FF 0%, #00A3F3 100%);
              color: #fff !important;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
            }
            .zcwf_lblLeft .zcwf_button { 
              font-size: 12px; 
              color: #313949; 
              border: 1px solid #c0c6cc; 
              padding: 3px 9px; 
              border-radius: 4px; 
              cursor: pointer; 
              max-width: 120px; 
              overflow: hidden; 
              text-overflow: ellipsis; 
              white-space: nowrap; 
            }
            .zcwf_lblLeft .zcwf_privacy_txt { 
              width: 90%; 
              font-size: 12px; 
              font-family: Arial; 
              display: inline-block; 
              vertical-align: top; 
              color: #313949; 
              padding-top: 2px; 
              margin-left: 6px; 
            }
            .error { color: red; font-size: 12px; margin-top: 5px; }
            @media all and (max-width: 600px) {
              .zcwf_lblLeft .zcwf_col_lab, 
              .zcwf_lblLeft .zcwf_col_fld { 
                width: auto; 
                float: none !important; 
              }
              .zcwf_lblLeft .zcwf_col_help { width: 40%; }
            }
          `}</style>

          <form onSubmit={handleSubmit}>
            <div className="zcwf_row">
              <div className="zcwf_col_lab">
                <label htmlFor="Company">Società <span style={{color: 'red'}}>*</span></label>
      </div>
              <div className="zcwf_col_fld">
                <input 
                  type="text" 
                  id="Company" 
                  name="Company" 
                  maxLength={200} 
                  value={formData.Company}
                  onChange={(e) => handleInputChange('Company', e.target.value)}
                  required
                />
                {errors.Company && <div className="error">{errors.Company}</div>}
      </div>
    </div>

            <div className="zcwf_row">
              <div className="zcwf_col_lab">
                <label htmlFor="First_Name">Nome</label>
      </div>
              <div className="zcwf_col_fld">
                <input 
                  type="text" 
                  id="First_Name" 
                  name="First Name" 
                  maxLength={40} 
                  value={formData['First Name']}
                  onChange={(e) => handleInputChange('First Name', e.target.value)}
                />
      </div>
    </div>

            <div className="zcwf_row">
              <div className="zcwf_col_lab">
                <label htmlFor="Last_Name">Cognome <span style={{color: 'red'}}>*</span></label>
      </div>
              <div className="zcwf_col_fld">
                <input 
                  type="text" 
                  id="Last_Name" 
                  name="Last Name" 
                  maxLength={80} 
                  value={formData['Last Name']}
                  onChange={(e) => handleInputChange('Last Name', e.target.value)}
                  required
                />
                {errors['Last Name'] && <div className="error">{errors['Last Name']}</div>}
      </div>
    </div>

            <div className="zcwf_row">
              <div className="zcwf_col_lab">
                <label htmlFor="Email">E-mail</label>
      </div>
              <div className="zcwf_col_fld">
                <input 
                  type="email" 
                  id="Email" 
                  name="Email" 
                  maxLength={100} 
                  value={formData.Email}
                  onChange={(e) => handleInputChange('Email', e.target.value)}
                />
                {errors.Email && <div className="error">{errors.Email}</div>}
      </div>
    </div>

            <div className="zcwf_row">
              <div className="zcwf_col_lab">
                <label htmlFor="Mobile">Cellulare</label>
      </div>
              <div className="zcwf_col_fld">
                <input 
                  type="text" 
                  id="Mobile" 
                  name="Mobile" 
                  maxLength={30} 
                  value={formData.Mobile}
                  onChange={(e) => handleInputChange('Mobile', e.target.value)}
                />
      </div>
    </div>

            <div className="zcwf_row">
              <div className="zcwf_col_lab">
                <label htmlFor="LEADCF24">Ebook_Name__c</label>
      </div>
              <div className="zcwf_col_fld">
                <input 
                  type="text" 
                  id="LEADCF24" 
                  name="LEADCF24" 
                  maxLength={255} 
                  value={formData.LEADCF24}
                  onChange={(e) => handleInputChange('LEADCF24', e.target.value)}
                />
      </div>
    </div>

            <div className="zcwf_row wfrm_fld_dpNn">
              <div className="zcwf_col_lab">
                <label htmlFor="LEADCF25">Content_Type__c</label>
      </div>
              <div className="zcwf_col_fld">
                <select 
                  className="zcwf_col_fld_slt" 
                  id="LEADCF25" 
                  name="LEADCF25" 
                  value={formData.LEADCF25}
                  onChange={(e) => handleInputChange('LEADCF25', e.target.value)}
                >
          <option value="-None-">-None-</option>
                  <option value="E-book">E-book</option>
        </select>
          </div>
          </div>

            <div className="zcwf_row">
              <div className="zcwf_privacy">
                <div className="dIB vaT" style={{textAlign: 'left'}}>
                  <div className="displayPurpose crm-small-font-size">
                    <label className="newCustomchkbox-md dIB w100_per">
                      <input 
                        type="checkbox" 
                        id="privacyTool886339000000817757"
                        checked={formData.privacyConsent}
                        onChange={(e) => handleInputChange('privacyConsent', e.target.checked)}
                      />
            </label>
          </div>
        </div>
                <div className="dIB zcwf_privacy_txt">
                  <div style={{fontFamily: 'Verdana,Arial,Helvetica,sans-serif'}}>
                    Ho letto e accetto l'informativa sulla privacy.
                  </div>
                </div>
                {errors.privacyConsent && (
                  <div className="error" style={{paddingLeft: '5px'}}>
                    {errors.privacyConsent}
            </div>
                )}
          </div>
        </div>

            <div className="zcwf_row">
              <div className="zcwf_col_lab"></div>
              <div className="zcwf_col_fld">
                <button 
                  type="submit" 
                  className="formsubmit zcwf_button" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Invio...' : 'Conferma'}
                </button>
                <button 
                  type="button" 
                  className="zcwf_button" 
                  onClick={() => setFormData({
                    Company: '',
                    'First Name': '',
                    'Last Name': '',
                    Email: '',
                    Mobile: '',
                    LEADCF24: ebookDisplayName,
                    LEADCF25: 'E-book',
                    privacyConsent: false
                  })}
                >
                  Ripristina
                </button>
          </div>
    </div>
      </form>
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
