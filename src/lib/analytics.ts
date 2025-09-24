// Analytics utility functions
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

export function trackPageView(pageTitle?: string, pageLocation?: string) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageTitle || document.title,
        page_location: pageLocation || window.location.href,
        page_path: window.location.pathname,
        content_group1: 'main_site',
        content_group2: getPageGroup(window.location.pathname)
      })
    }
  } catch {}
}

export function trackFunnelStep(funnelName: string, stepNumber: number, stepName: string, conversionValue: number = 0) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'funnel_step', {
        funnel_name: funnelName,
        step_number: stepNumber,
        step_name: stepName,
        conversion_value: conversionValue
      })
    }
  } catch {}
}

function getPageGroup(pathname: string): string {
  if (pathname.includes('/ebook')) return 'form_pages'
  if (pathname.includes('/consultation')) return 'form_pages'
  if (pathname.includes('/blogs')) return 'content_pages'
  if (pathname.includes('/products')) return 'content_pages'
  if (pathname.includes('/usecases')) return 'content_pages'
  if (pathname === '/') return 'homepage'
  return 'other_pages'
}
