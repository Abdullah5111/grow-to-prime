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

  // Ensure form initialization after component mounts
  useEffect(() => {
    const initializeForm = () => {
      const ebookField = document.getElementById('LEADCF24')
      if (ebookField && !ebookField.value) {
        console.log('📚 Setting ebook field from React:', ebookDisplayName)
        ebookField.value = ebookDisplayName
      }
      
      // Re-run the initialization function from the script
      if (typeof (window as any).initializeFormData === 'function') {
        console.log('🔄 Re-running form initialization...')
        ;(window as any).initializeFormData()
      }
    }

    // Run after a short delay to ensure the form HTML is rendered
    const timer = setTimeout(initializeForm, 100)
    return () => clearTimeout(timer)
  }, [ebookDisplayName])

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
          Download {ebookDisplayName}
        </h1>
        <p className="text-gray-600 mb-8">
          Fill out the form below to receive your free eBook. All required fields are marked with an asterisk (*).
        </p>
{/* Zoho WebToLead Form - Working Version */}
<div 
  id="crmWebToEntityForm" 
  className="zcwf_lblLeft crmWebToEntityForm" 
  style={{ backgroundColor: '#fff', color: '#000', maxWidth: '600px' }}
  dangerouslySetInnerHTML={{
    __html: `
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="content-type" content="text/html;charset=UTF-8">
      <form
        id="webform886339000000817757"
        action="https://crm.zoho.eu/crm/WebToLeadForm"
        name="WebToLeads886339000000817757"
        method="POST"
        onSubmit='javascript:document.charset="UTF-8"; return checkMandatory886339000000817757()'
        accept-charset="UTF-8"
      >
        <!-- Hidden obbligatori Zoho (non modificare) -->
        <input type="text" style="display:none;" name="xnQsjsdp" value="aff032ea392f9d32ea3429774425c9b50b79b3c7d8a18f2625e6a7a20ecae6a1">
        <input type="hidden" name="zc_gad" id="zc_gad" value="">
        <input type="text" style="display:none;" name="xmIwtLD" value="381b878b5ea1f6a1ece3aa9488fb1f97d8f4e37038d4049edf5b85849c23ca28ff8cd03030fee032ee0bb2373de53db2">
        <input type="text" style="display:none;" name="actionType" value="TGVhZHM=">
        <!-- Fallback thanks page (verrà sovrascritta in JS se presente Ebook_Name__c) -->
        <input type="text" style="display:none;" name="returnURL" value="https://www.growtoprime.com/thanks">

        <!-- STILI (originali Zoho) -->
        <style>
          html,body{margin:0}
          .formsubmit.zcwf_button{color:#fff!important;background:transparent linear-gradient(0deg,#0279FF 0%,#00A3F3 100%)}
          #crmWebToEntityForm.zcwf_lblLeft{width:100%;padding:25px;margin:0 auto;box-sizing:border-box}
          #crmWebToEntityForm.zcwf_lblLeft *{box-sizing:border-box}
          #crmWebToEntityForm{text-align:left}
          #crmWebToEntityForm *{direction:ltr}
          .zcwf_lblLeft .zcwf_title{word-wrap:break-word;padding:0 6px 10px;font-weight:bold}
          .zcwf_lblLeft.cpT_primaryBtn:hover{background:linear-gradient(#02acff 0,#006be4 100%) no-repeat padding-box!important;box-shadow:0 -2px 0 0 #0159b9 inset!important;border:0!important;color:#fff!important;outline:0!important}
          .zcwf_lblLeft .zcwf_col_fld input[type=text], input[type=password], .zcwf_lblLeft .zcwf_col_fld textarea{width:60%;border:1px solid #c0c6cc!important;resize:vertical;border-radius:2px;float:left}
          .zcwf_lblLeft .zcwf_col_lab{width:30%;word-break:break-word;padding:0 6px 0;margin-right:10px;margin-top:5px;float:left;min-height:1px}
          .zcwf_lblLeft .zcwf_col_fld{float:left;width:68%;padding:0 6px 0;position:relative;margin-top:5px}
          .zcwf_lblLeft .zcwf_privacy{padding:6px}
          .zcwf_lblLeft .wfrm_fld_dpNn{display:none}
          .dIB{display:inline-block}
          .zcwf_lblLeft .zcwf_col_fld_slt{width:60%;border:1px solid #ccc;background:#fff;border-radius:4px;font-size:12px;float:left;resize:vertical;padding:2px 5px}
          .zcwf_lblLeft .zcwf_row:after,.zcwf_lblLeft .zcwf_col_fld:after{content:'';display:table;clear:both}
          .zcwf_lblLeft .zcwf_col_help{float:left;margin-left:7px;font-size:12px;max-width:35%;word-break:break-word}
          .zcwf_lblLeft .zcwf_help_icon{cursor:pointer;width:16px;height:16px;display:inline-block;background:#fff;border:1px solid #c0c6cc;color:#c1c1c1;text-align:center;font-size:11px;line-height:16px;font-weight:bold;border-radius:50%}
          .zcwf_lblLeft .zcwf_row{margin:15px 0}
          .zcwf_lblLeft .formsubmit{margin-right:5px;cursor:pointer;color:#313949;font-size:12px}
          .zcwf_lblLeft .zcwf_privacy_txt{width:90%;font-size:12px;font-family:Arial;display:inline-block;vertical-align:top;color:#313949;padding-top:2px;margin-left:6px}
          .zcwf_lblLeft .zcwf_button{font-size:12px;color:#313949;border:1px solid #c0c6cc;padding:3px 9px;border-radius:4px;cursor:pointer;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          .zcwf_lblLeft .zcwf_tooltip_over{position:relative}
          .zcwf_lblLeft .zcwf_tooltip_ctn{position:absolute;background:#dedede;padding:3px 6px;top:3px;border-radius:4px;word-break:break-word;min-width:100px;max-width:150px;color:#313949;z-index:100}
          .zcwf_lblLeft .zcwf_ckbox{float:left}
          .zcwf_lblLeft .zcwf_file{width:55%;box-sizing:border-box;float:left}
          .cBoth:after{content:'';display:block;clear:both}
          @media all and (max-width:600px){
            .zcwf_lblLeft .zcwf_col_lab,.zcwf_lblLeft .zcwf_col_fld{width:auto;float:none!important}
            .zcwf_lblLeft .zcwf_col_help{width:40%}
          }
        </style>

        <!-- Campi -->
        <div class="zcwf_row">
          <div class="zcwf_col_lab" style="font-size:12px;font-family:Arial;">
            <label for="Company">Società <span style="color:red;">*</span></label>
          </div>
          <div class="zcwf_col_fld">
            <input type="text" id="Company" name="Company" maxlength="200" aria-required="true" aria-label="Company" required>
            <div class="zcwf_col_help"></div>
          </div>
        </div>

        <div class="zcwf_row">
          <div class="zcwf_col_lab" style="font-size:12px;font-family:Arial;">
            <label for="First_Name">Nome</label>
          </div>
          <div class="zcwf_col_fld">
            <input type="text" id="First_Name" name="First Name" maxlength="40" aria-required="false" aria-label="First Name">
            <div class="zcwf_col_help"></div>
          </div>
        </div>

        <div class="zcwf_row">
          <div class="zcwf_col_lab" style="font-size:12px;font-family:Arial;">
            <label for="Last_Name">Cognome <span style="color:red;">*</span></label>
          </div>
          <div class="zcwf_col_fld">
            <input type="text" id="Last_Name" name="Last Name" maxlength="80" aria-required="true" aria-label="Last Name" required>
            <div class="zcwf_col_help"></div>
          </div>
        </div>

        <div class="zcwf_row">
          <div class="zcwf_col_lab" style="font-size:12px;font-family:Arial;">
            <label for="Email">E-mail</label>
          </div>
          <div class="zcwf_col_fld">
            <input type="email" ftype="email" autocomplete="off" id="Email" name="Email" maxlength="100" aria-required="false" aria-label="Email">
            <div class="zcwf_col_help"></div>
          </div>
        </div>

        <div class="zcwf_row">
          <div class="zcwf_col_lab" style="font-size:12px;font-family:Arial;">
            <label for="Mobile">Cellulare</label>
          </div>
          <div class="zcwf_col_fld">
            <input type="text" id="Mobile" name="Mobile" maxlength="30" aria-required="false" aria-label="Mobile">
            <div class="zcwf_col_help"></div>
          </div>
        </div>

        <div class="zcwf_row">
          <div class="zcwf_col_lab" style="font-size:12px;font-family:Arial;">
            <label for="LEADCF24">Ebook_Name__c</label>
          </div>
          <div class="zcwf_col_fld">
            <input type="text" id="LEADCF24" name="LEADCF24" maxlength="255" aria-required="false" aria-label="LEADCF24">
            <div class="zcwf_col_help"></div>
          </div>
        </div>

        <div class="zcwf_row wfrm_fld_dpNn">
          <div class="zcwf_col_lab" style="font-size:12px;font-family:Arial;">
            <label for="LEADCF25">Content_Type__c</label>
          </div>
          <div class="zcwf_col_fld">
            <select class="zcwf_col_fld_slt" id="LEADCF25" name="LEADCF25" aria-label="LEADCF25" aria-required="false" onChange="addAriaSelected886339000000817757()">
              <option value="-None-">-None-</option>
              <option selected value="E-book">E-book</option>
            </select>
            <div class="zcwf_col_help"></div>
          </div>
        </div>

        <div class="zcwf_row">
          <div class="zcwf_privacy">
            <div class="dIB vaT" align="left">
              <div class="displayPurpose crm-small-font-size">
                <label class="newCustomchkbox-md dIB w100_per">
                  <input autocomplete="off" id="privacyTool886339000000817757" type="checkbox" name="" aria-checked="false" aria-errormessage="privacyErr886339000000817757" aria-label="privacyTool" onclick="disableErr886339000000817757()">
                </label>
              </div>
            </div>
            <div class="dIB zcwf_privacy_txt" style="font-size:12px;font-family:Arial;color:#000;">
              <div style="font-family:Verdana,Arial,Helvetica,sans-serif">Ho letto e accetto l'informativa sulla privacy.</div>
            </div>
            <div id="privacyErr886339000000817757" aria-live="polite" style="font-size:12px;color:red;padding-left:5px;visibility:hidden;">Ti chiediamo di accettare</div>
          </div>
        </div>

        <!-- Honeypot (anti-bot) -->
        <input type="text" name="aG9uZXlwb3Q" style="display:none;" value="">

        <div class="zcwf_row">
          <div class="zcwf_col_lab"></div>
          <div class="zcwf_col_fld">
            <input type="submit" id="formsubmit" role="button" class="formsubmit zcwf_button" value="Conferma" aria-label="Conferma" title="Conferma">
            <input type="reset" class="zcwf_button" role="button" name="reset" value="Ripristina" aria-label="Ripristina" title="Ripristina">
          </div>
        </div>

        <script>
          function addAriaSelected886339000000817757(){
            var optionElem = event.target;
            var previousSelectedOption = optionElem.querySelector('[aria-selected=true]');
            if(previousSelectedOption){ previousSelectedOption.removeAttribute('aria-selected'); }
            optionElem.querySelectorAll('option')[optionElem.selectedIndex].ariaSelected = 'true';
          }

          function privacyAlert886339000000817757(){
            var privacyTool = document.getElementById('privacyTool886339000000817757');
            var privacyErr = document.getElementById('privacyErr886339000000817757');
            if(privacyTool != undefined && !privacyTool.checked){
              privacyErr.style.visibility = 'visible';
              privacyTool.ariaInvalid = 'true';
              privacyTool.focus();
              return false;
            }
            return true;
          }

          function disableErr886339000000817757(){
            var privacyTool = document.getElementById('privacyTool886339000000817757');
            var privacyErr = document.getElementById('privacyErr886339000000817757');
            if(privacyTool != undefined && privacyTool.checked && privacyErr != undefined){
              privacyErr.style.visibility = 'hidden';
              privacyTool.ariaInvalid = 'false';
            }
          }

          function validateEmail886339000000817757(){
            var form = document.forms['WebToLeads886339000000817757'];
            var emailFld = form.querySelectorAll('[ftype=email]');
            for(var i=0;i<emailFld.length;i++){
              var emailVal = emailFld[i].value;
              if((emailVal.replace(/^\\s+|\\s+$/g,'' )).length != 0){
                var atpos = emailVal.indexOf('@');
                var dotpos = emailVal.lastIndexOf('.');
                if(atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= emailVal.length){
                  alert('Inserire un indirizzo e-mail valido.');
                  emailFld[i].focus();
                  return false;
                }
              }
            }
            return true;
          }

          // Autopopolazione UTM + referrer + ebook (se passato in URL)
          function initializeFormData() {
            console.log('🔄 Initializing form data...');
            var form = document.getElementById('webform886339000000817757');
            if(!form) {
              console.log('❌ Form not found');
              return;
            }
            
            var params = new URLSearchParams(window.location.search);
            console.log('📋 URL Parameters found:', Object.fromEntries(params.entries()));
            
            // Add UTM parameters
            ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(k){
              var v = params.get(k);
              if(v){
                console.log('➕ Adding UTM parameter:', k, '=', v);
                var input = document.createElement('input');
                input.type = 'hidden';
                input.name = k;
                input.value = v;
                form.appendChild(input);
              }
            });
            
            // Add referrer
            var ref = document.referrer || params.get('ref') || '';
            if(ref){
              console.log('➕ Adding referrer:', ref);
              var r = document.createElement('input');
              r.type = 'hidden';
              r.name = 'referrer';
              r.value = ref;
              form.appendChild(r);
            }
            
            // Set ebook field from URL parameter
            var ebookField = document.getElementById('LEADCF24');
            var ebookParam = params.get('ebook');
            if(ebookParam){
              console.log('📚 Setting ebook field to:', ebookParam);
              ebookField.value = ebookParam;
            } else {
              // Fallback to ebookDisplayName from React
              var ebookDisplayName = '${ebookDisplayName}';
              if(ebookDisplayName && ebookDisplayName !== '${ebookDisplayName}'){
                console.log('📚 Setting ebook field to display name:', ebookDisplayName);
                ebookField.value = ebookDisplayName;
              }
            }
            
            console.log('✅ Form data initialization complete');
          }
          
          // Expose function to window for React to call
          window.initializeFormData = initializeFormData;
          
          // Run immediately and also when DOM is ready
          initializeFormData();
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeFormData);
          }

          function checkMandatory886339000000817757(){
            console.log('🚀 FORM VALIDATION STARTED');
            
            // Anti-bot: honeypot deve restare vuoto
            var hp = document.querySelector('input[name="aG9uZXlwb3Q"]');
            if(hp && hp.value){ 
              console.log('❌ Honeypot filled - bot detected');
              return false; 
            }

            var mndFileds = new Array('Company','Last Name');
            var fldLangVal = new Array('Società','Cognome');
            for(var i=0;i<mndFileds.length;i++){
              var fieldObj = document.forms['WebToLeads886339000000817757'][mndFileds[i]];
              if(fieldObj){
                if(((fieldObj.value).replace(/^\\s+|\\s+$/g,'' )).length == 0){
                  if(fieldObj.type == 'file'){ alert('Selezionare un file da caricare.'); fieldObj.focus(); return false; }
                  console.log('❌ Required field empty:', fldLangVal[i]);
                  alert(fldLangVal[i] + ' non può essere vuoto.');
                  fieldObj.focus(); return false;
                }else if(fieldObj.nodeName == 'SELECT'){
                  if(fieldObj.options[fieldObj.selectedIndex].value == '-None-'){
                    console.log('❌ Required select field empty:', fldLangVal[i]);
                    alert(fldLangVal[i] + ' non può essere nessuno.');
                    fieldObj.focus(); return false;
                  }
                }else if(fieldObj.type == 'checkbox'){
                  if(fieldObj.checked == false){
                    console.log('❌ Required checkbox not checked:', fldLangVal[i]);
                    alert('Please accept ' + fldLangVal[i]);
                    fieldObj.focus(); return false;
                  }
                }
                try{ if(fieldObj.name == 'Last Name'){ name = fieldObj.value; } }catch(e){}
              }
            }
            if(!validateEmail886339000000817757()){ 
              console.log('❌ Email validation failed');
              return false; 
            }
            if(!privacyAlert886339000000817757()){ 
              console.log('❌ Privacy consent not accepted');
              return false; 
            }

            console.log('✅ All validations passed');

            // Collect all form data for logging
            var form = document.getElementById('webform886339000000817757');
            var formData = new FormData(form);
            var formDataObj = {};
            
            console.log('📋 FORM DATA BEING SENT TO ZOHO:');
            for (var pair of formData.entries()) {
              formDataObj[pair[0]] = pair[1];
              console.log('  ' + pair[0] + ': ' + pair[1]);
            }
            
            // Log URL parameters being added
            var urlparams = new URLSearchParams(window.location.search);
            console.log('🔗 URL PARAMETERS:');
            console.log('  utm_source:', urlparams.get('utm_source'));
            console.log('  utm_medium:', urlparams.get('utm_medium'));
            console.log('  utm_campaign:', urlparams.get('utm_campaign'));
            console.log('  utm_term:', urlparams.get('utm_term'));
            console.log('  utm_content:', urlparams.get('utm_content'));
            console.log('  ebook:', urlparams.get('ebook'));
            console.log('  referrer:', document.referrer);

            // Conserva eventuale parametro "service=smarturl" già previsto
            if(urlparams.has('service') && (urlparams.get('service') === 'smarturl')){
              var webform = document.getElementById('webform886339000000817757');
              var service = urlparams.get('service');
              var smarturlfield = document.createElement('input');
              smarturlfield.setAttribute('type','hidden');
              smarturlfield.setAttribute('value',service);
              smarturlfield.setAttribute('name','service');
              webform.appendChild(smarturlfield);
              console.log('➕ Added service parameter:', service);
            }

            // Imposta dinamicamente la thank-you page con parametro ebook (se presente)
            var ebook = document.getElementById('LEADCF24') ? document.getElementById('LEADCF24').value : '';
            var retField = document.querySelector('input[name="returnURL"]');
            if(retField){
              var baseThanks = 'https://www.growtoprime.com/thanks';
              retField.value = ebook ? (baseThanks + '?ebook=' + encodeURIComponent(ebook)) : baseThanks;
              console.log('🎯 Thank you page set to:', retField.value);
            }

            // Log final form action
            console.log('📤 FORM SUBMISSION DETAILS:');
            console.log('  Action URL:', form.action);
            console.log('  Method:', form.method);
            console.log('  Form ID:', form.id);

            // Disabilita bottone per evitare doppie submit e CONSENTI l'invio
            document.querySelector('.crmWebToEntityForm .formsubmit').setAttribute('disabled', true);
            console.log('✅ FORM WILL NOW SUBMIT TO ZOHO CRM');
            return true; /* FIX fondamentale: permette la submit */
          }

          function tooltipShow886339000000817757(el){
            var tooltip = el.nextElementSibling;
            var tooltipDisplay = tooltip.style.display;
            if(tooltipDisplay == 'none'){
              var allTooltip = document.getElementsByClassName('zcwf_tooltip_over');
              for(var i=0;i<allTooltip.length;i++){ allTooltip[i].style.display = 'none'; }
              tooltip.style.display = 'block';
            }else{
              tooltip.style.display = 'none';
            }
          }
        </script>

        <!-- Do not remove this --- Analytics Tracking code starts -->
        <script id="wf_anal" src="https://crm.zohopublic.eu/crm/WebFormAnalyticsServeServlet?rid=4bb804b4686fe3f4915620aedbcfe1990138a7fece5d61c6f371336a212c9584f6987bc83e6907b66cf81a7da3d297fdgidd8225dd3490b789e446497da6cdf20c01d9249846c9cfeac6b82785fe0c7cb7agidc03da8bb6e981da63ef28a1b6cdca7fe47a40d5e1514289afa0bf1d4f5dca130gid20307a43b2aca6339c52ff8f1c1f147f7f146c552a94527fdebafb7c619f923f&tw=a2d97c06c007cdb44290bb3d718c7b4a4e8b403bbd6a649edd462e18e9748817"></script>
        <!-- Do not remove this --- Analytics Tracking code ends. -->
      </form>
    </div>
    `
  }}
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


