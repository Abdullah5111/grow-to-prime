import { NextResponse } from 'next/server'

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

  try {
    const res = await fetch(`${apiBase}/api/product-pages/`, { next: { revalidate: 3600 } })
    const data = await res.json().catch(() => ([]))
    const items = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : [])

    const urls = (items as Array<{ slug_path: string; updated_at?: string }>).map((p) => `
  <url>
    <loc>${site}/products/${p.slug_path}</loc>
    ${p.updated_at ? `<lastmod>${new Date(p.updated_at).toISOString()}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`

    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
  } catch {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`
    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
  }
}


