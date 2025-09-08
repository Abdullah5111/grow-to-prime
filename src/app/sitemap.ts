import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  type SitemapItem = { slug_path: string; updated_at?: string | null }
  type WithResults<T> = { results: T[] }

  const isRecord = (value: unknown): value is Record<string, unknown> => (
    typeof value === 'object' && value !== null
  )

  const isSitemapItem = (value: unknown): value is SitemapItem => (
    isRecord(value) && typeof (value as { slug_path?: unknown }).slug_path === 'string' && (
      !('updated_at' in value) || (value as { updated_at?: unknown }).updated_at === null || typeof (value as { updated_at?: unknown }).updated_at === 'string'
    )
  )

  const extractItems = <T,>(data: unknown, isItem: (v: unknown) => v is T): T[] => {
    if (Array.isArray(data)) return data.filter(isItem)
    if (isRecord(data) && Array.isArray((data as WithResults<unknown>).results)) {
      return (data as WithResults<unknown>).results.filter(isItem)
    }
    return []
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

    const [blogsRes, productsRes, usecasesRes] = await Promise.all([
      fetch(`${apiBase}/api/blogs/`, { next: { revalidate: 3600 } }),
      fetch(`${apiBase}/api/product-pages/`, { next: { revalidate: 3600 } }),
      fetch(`${apiBase}/api/usecases/`, { next: { revalidate: 3600 } }),
    ])

    const blogsJson: unknown = await blogsRes.json().catch(() => ({}))
    const productsJson: unknown = await productsRes.json().catch(() => ({}))
    const usecasesJson: unknown = await usecasesRes.json().catch(() => ({}))

    const blogs = extractItems<SitemapItem>(blogsJson, isSitemapItem)
    const products = extractItems<SitemapItem>(productsJson, isSitemapItem)
    const usecases = extractItems<SitemapItem>(usecasesJson, isSitemapItem)

    const blogUrls: MetadataRoute.Sitemap = blogs.map((b) => ({
      url: `${baseUrl}/blogs/${b.slug_path}`,
      changeFrequency: 'weekly',
      priority: 0.7,
      lastModified: b.updated_at ? new Date(b.updated_at) : undefined,
    }))
    const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug_path}`,
      changeFrequency: 'weekly',
      priority: 0.7,
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
    }))
    const usecaseUrls: MetadataRoute.Sitemap = usecases.map((u) => ({
      url: `${baseUrl}/usecases/${u.slug_path}`,
      changeFrequency: 'weekly',
      priority: 0.6,
      lastModified: u.updated_at ? new Date(u.updated_at) : undefined,
    }))

    return [...staticPages, ...blogUrls, ...productUrls, ...usecaseUrls]
  } catch {
    return staticPages
  }
}


