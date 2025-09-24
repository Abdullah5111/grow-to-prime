// Zoho WebToLead Form Utilities

export interface ZohoFormConfig {
  baseUrl?: string;
  ebookName: string;
  contentType?: string;
  utmParams?: Record<string, string>;
  additionalParams?: Record<string, string>;
}

export function buildZohoFormUrl(config: ZohoFormConfig): string {
  const {
    baseUrl = 'https://crm.zoho.eu/crm/WebToLeadForm',
    ebookName,
    contentType = 'eBook',
    utmParams = {},
    additionalParams = {}
  } = config;

  const params = new URLSearchParams();
  
  // Add ebook information
  params.append('Ebook_Name__c', ebookName);
  params.append('Content_Type__c', contentType);
  
  // Add UTM parameters
  Object.entries(utmParams).forEach(([key, value]) => {
    if (key.startsWith('utm_') && value) {
      params.append(key, value);
    }
  });
  
  // Add additional parameters
  Object.entries(additionalParams).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });
  
  return `${baseUrl}?${params.toString()}`;
}

export function extractUrlParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  
  // Extract UTM parameters
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) params[key] = value;
  });
  
  // Extract ebook parameter
  const ebook = urlParams.get('ebook');
  if (ebook) params.ebook = ebook;
  
  // Extract referrer
  if (document.referrer) {
    params.referrer = document.referrer;
  }
  
  return params;
}

export function formatEbookName(ebookSlug: string): string {
  return ebookSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

export function updateIframeSrc(iframeId: string, newSrc: string): void {
  const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
  if (iframe) {
    iframe.src = newSrc;
  }
}

// Script to dynamically update iframe based on URL parameters
export function initializeZohoFormIframe(iframeId: string, defaultEbook: string = 'ai-content-guide'): void {
  if (typeof window === 'undefined') return;
  
  const params = extractUrlParams();
  const ebookName = params.ebook || defaultEbook;
  const ebookDisplayName = formatEbookName(ebookName);
  
  const formUrl = buildZohoFormUrl({
    ebookName: ebookDisplayName,
    utmParams: params
  });
  
  updateIframeSrc(iframeId, formUrl);
}

// Example usage in HTML:
/*
<script>
  // Initialize the iframe when page loads
  document.addEventListener('DOMContentLoaded', function() {
    initializeZohoFormIframe('zoho-form-iframe', 'crm-playbook');
  });
  
  // Update iframe when URL parameters change
  window.addEventListener('popstate', function() {
    initializeZohoFormIframe('zoho-form-iframe', 'crm-playbook');
  });
</script>

<iframe 
  id="zoho-form-iframe"
  src=""
  width="100%" 
  height="600" 
  frameborder="0"
  title="Download eBook">
</iframe>
*/
