'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script'

// readGaClientId function removed as it's not used in the Zoho form implementation

// trackEvent function removed as it's not used in the Zoho form implementation
// no imports needed

function EbookContent() {
  const searchParams = useSearchParams()

  // UTM parameters are handled by JavaScript in the form submission

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

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
          Download {ebookDisplayName}
        </h1>
        <p className="text-gray-600 mb-8">
          Fill out the form below to receive your free eBook. All required fields are marked with an asterisk (*).
        </p>
{/* Zoho WebToLead Form */}
<div id="crmWebToEntityForm" className="zcwf_lblLeft crmWebToEntityForm" style={{ backgroundColor: 'white', color: 'black', maxWidth: '600px' }}>
        <form
    id="webform886339000000817757" 
    action="https://crm.zoho.eu/crm/WebToLeadForm" 
    name="WebToLeads886339000000817757" 
    method="POST" 
    onSubmit={() => {
      return (window as { checkMandatory886339000000817757?: () => boolean }).checkMandatory886339000000817757?.() ?? true;
    }}
    acceptCharset="UTF-8"
  >
    {/* Hidden fields required by Zoho */}
    <input type="text" style={{ display: 'none' }} name="xnQsjsdp" value="aff032ea392f9d32ea3429774425c9b50b79b3c7d8a18f2625e6a7a20ecae6a1" />
    <input type="hidden" name="zc_gad" id="zc_gad" value="" />
    <input type="text" style={{ display: 'none' }} name="xmIwtLD" value="381b878b5ea1f6a1ece3aa9488fb1f97d8f4e37038d4049edf5b85849c23ca28ff8cd03030fee032ee0bb2373de53db2" />
    <input type="text" style={{ display: 'none' }} name="actionType" value="TGVhZHM=" />
    <input type="text" style={{ display: 'none' }} name="returnURL" value="null" />
    
    {/* Company Field - Required */}
    <div className="zcwf_row">
      <div className="zcwf_col_lab" style={{ fontSize: '12px', fontFamily: 'Arial' }}>
        <label htmlFor="Company">Società <span style={{ color: 'red' }}>*</span></label>
      </div>
      <div className="zcwf_col_fld">
        <input 
          type="text" 
          id="Company" 
          aria-required="true" 
          aria-label="Company" 
          name="Company" 
          maxLength={200}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Nome della società"
        />
      </div>
    </div>

    {/* First Name Field */}
    <div className="zcwf_row">
      <div className="zcwf_col_lab" style={{ fontSize: '12px', fontFamily: 'Arial' }}>
        <label htmlFor="First_Name">Nome</label>
      </div>
      <div className="zcwf_col_fld">
        <input 
          type="text" 
          id="First_Name" 
          aria-required="false" 
          aria-label="First Name" 
          name="First Name" 
          maxLength={40}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Nome"
        />
      </div>
    </div>

    {/* Last Name Field - Required */}
    <div className="zcwf_row">
      <div className="zcwf_col_lab" style={{ fontSize: '12px', fontFamily: 'Arial' }}>
        <label htmlFor="Last_Name">Cognome <span style={{ color: 'red' }}>*</span></label>
      </div>
      <div className="zcwf_col_fld">
        <input 
          type="text" 
          id="Last_Name" 
          aria-required="true" 
          aria-label="Last Name" 
          name="Last Name" 
          maxLength={80}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Cognome"
        />
      </div>
    </div>

    {/* Email Field */}
    <div className="zcwf_row">
      <div className="zcwf_col_lab" style={{ fontSize: '12px', fontFamily: 'Arial' }}>
        <label htmlFor="Email">E-mail</label>
      </div>
      <div className="zcwf_col_fld">
        <input 
          type="email" 
          {...({ ftype: "email" } as Record<string, string>)}
          autoComplete="off"
          id="Email" 
          aria-required="false" 
          aria-label="Email" 
          name="Email" 
          maxLength={100}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="email@esempio.com"
        />
      </div>
    </div>

    {/* Mobile Field */}
    <div className="zcwf_row">
      <div className="zcwf_col_lab" style={{ fontSize: '12px', fontFamily: 'Arial' }}>
        <label htmlFor="Mobile">Cellulare</label>
      </div>
      <div className="zcwf_col_fld">
        <input 
          type="text" 
          id="Mobile" 
          aria-required="false" 
          aria-label="Mobile" 
          name="Mobile" 
          maxLength={30}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="+39 123 456 7890"
        />
      </div>
    </div>

    {/* Ebook Name Field - Dynamic from URL */}
    <div className="zcwf_row">
      <div className="zcwf_col_lab" style={{ fontSize: '12px', fontFamily: 'Arial' }}>
        <label htmlFor="LEADCF24">Ebook_Name__c</label>
      </div>
      <div className="zcwf_col_fld">
        <input 
          type="text" 
          id="LEADCF24" 
          aria-required="false" 
          aria-label="LEADCF24" 
          name="LEADCF24" 
          maxLength={255}
          value={ebookDisplayName}
          readOnly
          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
        />
      </div>
    </div>

    {/* Content Type - Hidden, set to E-book */}
    <div className="zcwf_row wfrm_fld_dpNn" style={{ display: 'none' }}>
      <div className="zcwf_col_lab" style={{ fontSize: '12px', fontFamily: 'Arial' }}>
        <label htmlFor="LEADCF25">Content_Type__c</label>
      </div>
      <div className="zcwf_col_fld">
        <select 
          className="zcwf_col_fld_slt" 
          role="combobox" 
          aria-expanded="false" 
          aria-haspopup="listbox" 
          id="LEADCF25" 
          onChange={() => {
            if (typeof window !== 'undefined') {
              (window as { addAriaSelected886339000000817757?: () => void }).addAriaSelected886339000000817757?.();
            }
          }} 
          aria-required="false" 
          aria-label="LEADCF25" 
          name="LEADCF25"
        >
          <option value="-None-">-None-</option>
          <option selected value="E-book">E-book</option>
        </select>
      </div>
          </div>

    {/* Privacy Consent - Required */}
    <div className="zcwf_row">
      <div className="zcwf_privacy">
        <div className="dIB vaT" style={{ textAlign: 'left' }}>
          <div className="displayPurpose crm-small-font-size">
            <label className="newCustomchkbox-md dIB w100_per">
              <input 
                autoComplete="off" 
                id="privacyTool886339000000817757" 
                type="checkbox" 
                aria-checked="false" 
                name="" 
                aria-errormessage="privacyErr886339000000817757" 
                aria-label="privacyTool" 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    (window as { disableErr886339000000817757?: () => void }).disableErr886339000000817757?.();
                  }
                }}
                className="mr-2"
              />
            </label>
          </div>
        </div>
        <div className="dIB zcwf_privacy_txt" style={{ fontSize: '12px', fontFamily: 'Arial', color: 'black' }}>
          <div style={{ fontFamily: 'Verdana, arial, Helvetica, sans-serif' }}>
            Ho letto e accetto l&apos;informativa sulla privacy.
          </div>
        </div>
        <div 
          id="privacyErr886339000000817757" 
          aria-live="polite" 
          style={{ fontSize: '12px', color: 'red', paddingLeft: '5px', visibility: 'hidden' }}
        >
          Ti chiediamo di accettare
        </div>
      </div>
    </div>

    {/* Hidden field for UTM tracking */}
    <input type="hidden" name="aG9uZXlwb3Q" value="" />

    {/* Submit and Reset Buttons */}
    <div className="zcwf_row">
      <div className="zcwf_col_lab"></div>
      <div className="zcwf_col_fld">
        <input 
          type="submit" 
          id="formsubmit" 
          role="button" 
          className="formsubmit zcwf_button bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-2" 
          value="Conferma" 
          aria-label="Conferma" 
          title="Conferma"
        />
        <input 
          type="reset" 
          className="zcwf_button bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500" 
          role="button" 
          name="reset" 
          value="Ripristina" 
          aria-label="Ripristina" 
          title="Ripristina"
        />
      </div>
    </div>
        </form>
</div>

{/* Zoho Form JavaScript Functions */}
<Script id="zoho-form-functions" strategy="afterInteractive" dangerouslySetInnerHTML={{
  __html: `
    function addAriaSelected886339000000817757() {
      var optionElem = event.target;
      var previousSelectedOption = optionElem.querySelector('[aria-selected=true]');
      if (previousSelectedOption) {
        previousSelectedOption.removeAttribute('aria-selected');
      }
      optionElem.querySelectorAll('option')[optionElem.selectedIndex].ariaSelected = 'true';
    }

    function privacyAlert886339000000817757() {
      var privacyTool = document.getElementById('privacyTool886339000000817757');
      var privacyErr = document.getElementById('privacyErr886339000000817757');
      if (privacyTool != undefined && !privacyTool.checked) {
        privacyErr.style.visibility = 'visible';
        privacyTool.ariaInvalid = 'true';
        privacyTool.focus();
        return false;
      }
      return true;
    }

    function disableErr886339000000817757() {
      var privacyTool = document.getElementById('privacyTool886339000000817757');
      var privacyErr = document.getElementById('privacyErr886339000000817757');
      if (privacyTool != undefined && privacyTool.checked && privacyErr != undefined) {
        privacyErr.style.visibility = 'hidden';
        privacyTool.ariaInvalid = 'false';
      }
    }

    function validateEmail886339000000817757() {
      var form = document.forms['WebToLeads886339000000817757'];
      var emailFld = form.querySelectorAll('[ftype=email]');
      var i;
      for (i = 0; i < emailFld.length; i++) {
        var emailVal = emailFld[i].value;
        if ((emailVal.replace(/^\\s+|\\s+$/g, '')).length != 0) {
          var atpos = emailVal.indexOf('@');
          var dotpos = emailVal.lastIndexOf('.');
          if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= emailVal.length) {
            alert('Inserire un indirizzo e-mail valido.');
            emailFld[i].focus();
            return false;
          }
        }
      }
      return true;
    }

    function checkMandatory886339000000817757() {
      // Anti-bot: honeypot deve restare vuoto
      var hp = document.querySelector('input[name="aG9uZXlwb3Q"]');
      if (hp && hp.value) { return false; }

      var mndFileds = new Array('Company', 'Last Name');
      var fldLangVal = new Array('Società', 'Cognome');
      for (i = 0; i < mndFileds.length; i++) {
        var fieldObj = document.forms['WebToLeads886339000000817757'][mndFileds[i]];
        if (fieldObj) {
          if (((fieldObj.value).replace(/^\\s+|\\s+$/g, '')).length == 0) {
            if (fieldObj.type == 'file') {
              alert('Selezionare un file da caricare.');
              fieldObj.focus();
              return false;
            }
            alert(fldLangVal[i] + ' non può essere vuoto.');
            fieldObj.focus();
            return false;
          } else if (fieldObj.nodeName == 'SELECT') {
            if (fieldObj.options[fieldObj.selectedIndex].value == '-None-') {
              alert(fldLangVal[i] + ' non può essere nessuno.');
              fieldObj.focus();
              return false;
            }
          } else if (fieldObj.type == 'checkbox') {
            if (fieldObj.checked == false) {
              alert('Please accept ' + fldLangVal[i]);
              fieldObj.focus();
              return false;
            }
          }
          try {
            if (fieldObj.name == 'Last Name') {
              name = fieldObj.value;
            }
          } catch (e) {}
        }
      }
      if (!validateEmail886339000000817757()) {
        return false;
      }
      if (!privacyAlert886339000000817757()) {
        return false;
      }
      
      // Add UTM parameters to form
      var urlparams = new URLSearchParams(window.location.search);
      var webform = document.getElementById('webform886339000000817757');
      
      // Add UTM parameters as hidden fields
      var utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      utmParams.forEach(function(param) {
        if (urlparams.has(param)) {
          var hiddenField = document.createElement('input');
          hiddenField.setAttribute('type', 'hidden');
          hiddenField.setAttribute('name', param);
          hiddenField.setAttribute('value', urlparams.get(param));
          webform.appendChild(hiddenField);
        }
      });
      
      // Add referrer if available
      if (document.referrer) {
        var referrerField = document.createElement('input');
        referrerField.setAttribute('type', 'hidden');
        referrerField.setAttribute('name', 'referrer');
        referrerField.setAttribute('value', document.referrer);
        webform.appendChild(referrerField);
      }
      
      // Add service parameter if present
      if (urlparams.has('service') && (urlparams.get('service') === 'smarturl')) {
        var service = urlparams.get('service');
        var smarturlfield = document.createElement('input');
        smarturlfield.setAttribute('type', 'hidden');
        smarturlfield.setAttribute('value', service);
        smarturlfield.setAttribute('name', 'service');
        webform.appendChild(smarturlfield);
      }
      
      // Disabilita bottone per evitare doppie submit e CONSENTI l'invio
      document.querySelector('.crmWebToEntityForm .formsubmit').setAttribute('disabled', true);
      return true; /* FIX fondamentale: permette la submit */
    }

    function tooltipShow886339000000817757(el) {
      var tooltip = el.nextElementSibling;
      var tooltipDisplay = tooltip.style.display;
      if (tooltipDisplay == 'none') {
        var allTooltip = document.getElementsByClassName('zcwf_tooltip_over');
        for (i = 0; i < allTooltip.length; i++) {
          allTooltip[i].style.display = 'none';
        }
        tooltip.style.display = 'block';
      } else {
        tooltip.style.display = 'none';
      }
    }
  `
}} />

{/* Zoho Analytics Tracking */}
<Script 
  id="wf_anal" 
  strategy="afterInteractive"
  src="https://crm.zohopublic.eu/crm/WebFormAnalyticsServeServlet?rid=4d13fc9cf0a04df84ff82bc0ea5482cf4d595ee27071a5fa1703c68be293a8964bcc040dbfa77c8882fe9b2da999d04bgidcca40f4bad720229c92d514af7617ac12d8fa922561a4ddfc5165649226d1a5egid1123c5d9635a576be119a31c6aa2d0985f20d95a55cb6ea459ac1e283027b559gid3655c2d397db678e7a08436c3bfb170084692e412661fb765ed73897a0ca4803&tw=e302951527ec4ce98e78cdad714b0e0fea62c0df735dcf0c74bf6550cde58244"
/>

      </div>
    </div>
  )
}

export default function EbookPage() {
  return (
    <>
      {/* Zoho Form CSS Styles */}
      <style jsx global>{`
        html, body { margin: 0px; }
        .formsubmit.zcwf_button { 
          color: white !important; 
          background: transparent linear-gradient(0deg, #0279FF 0%, #00A3F3 100%); 
        }
        #crmWebToEntityForm.zcwf_lblLeft { 
          width: 100%; 
          padding: 25px; 
          margin: 0 auto; 
          box-sizing: border-box; 
        }
        #crmWebToEntityForm.zcwf_lblLeft * { box-sizing: border-box; }
        #crmWebToEntityForm { text-align: left; }
        #crmWebToEntityForm * { direction: ltr; }
        .zcwf_lblLeft .zcwf_title { 
          word-wrap: break-word; 
          padding: 0px 6px 10px; 
          font-weight: bold 
        }
        .zcwf_lblLeft.cpT_primaryBtn:hover { 
          background: linear-gradient(#02acff 0,#006be4 100%)no-repeat padding-box !important; 
          box-shadow: 0 -2px 0 0 #0159b9 inset !important; 
          border: 0 !important; 
          color: #fff !important; 
          outline: 0 !important; 
        }
        .zcwf_lblLeft .zcwf_col_fld input[type=text], 
        input[type=password], 
        .zcwf_lblLeft .zcwf_col_fld textarea { 
          width: 100%; 
          border: 1px solid #c0c6cc !important; 
          resize: vertical; 
          border-radius: 2px; 
          float: left; 
        }
        .zcwf_lblLeft .zcwf_col_lab { 
          width: 30%; 
          word-break: break-word; 
          padding: 0px 6px 0px; 
          margin-right: 10px; 
          margin-top: 5px; 
          float: left; 
          min-height: 1px; 
        }
        .zcwf_lblLeft .zcwf_col_fld { 
          float: left; 
          width: 68%; 
          padding: 0px 6px 0px; 
          position: relative; 
          margin-top: 5px; 
        }
        .zcwf_lblLeft .zcwf_privacy { padding: 6px; }
        .zcwf_lblLeft .wfrm_fld_dpNn { display: none; }
        .dIB { display: inline-block; }
        .zcwf_lblLeft .zcwf_col_fld_slt { 
          width: 100%; 
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
        .zcwf_lblLeft .zcwf_help_icon { 
          cursor: pointer; 
          width: 16px; 
          height: 16px; 
          display: inline-block; 
          background: #fff; 
          border: 1px solid #c0c6cc; 
          color: #c1c1c1; 
          text-align: center; 
          font-size: 11px; 
          line-height: 16px; 
          font-weight: bold; 
          border-radius: 50%; 
        }
        .zcwf_lblLeft .zcwf_row { margin: 15px 0px; }
        .zcwf_lblLeft .formsubmit { 
          margin-right: 5px; 
          cursor: pointer; 
          color: #313949; 
          font-size: 12px; 
        }
        .zcwf_lblLeft .zcwf_privacy_txt { 
          width: 90%; 
          color: rgb(0, 0, 0); 
          font-size: 12px; 
          font-family: Arial; 
          display: inline-block; 
          vertical-align: top; 
          color: #313949; 
          padding-top: 2px; 
          margin-left: 6px; 
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
        .zcwf_lblLeft .zcwf_tooltip_over { position: relative; }
        .zcwf_lblLeft .zcwf_tooltip_ctn { 
          position: absolute; 
          background: #dedede; 
          padding: 3px 6px; 
          top: 3px; 
          border-radius: 4px; 
          word-break: break-word; 
          min-width: 100px; 
          max-width: 150px; 
          color: #313949; 
          z-index: 100; 
        }
        .zcwf_lblLeft .zcwf_ckbox { float: left; }
        .zcwf_lblLeft .zcwf_file { 
          width: 55%; 
          box-sizing: border-box; 
          float: left; 
        }
        .cBoth:after { 
          content: ''; 
          display: block; 
          clear: both; 
        }
        @media all and (max-width: 600px) { 
          .zcwf_lblLeft .zcwf_col_lab, 
          .zcwf_lblLeft .zcwf_col_fld { 
            width: auto; 
            float: none !important; 
          } 
          .zcwf_lblLeft .zcwf_col_help { width: 40%; } 
        }
      `}</style>
    <Suspense fallback={null}>
      <EbookContent />
    </Suspense>
    </>
  )
}


