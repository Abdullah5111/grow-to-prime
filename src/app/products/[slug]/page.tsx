'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiService, ProductServicePage } from '@/lib/api';
import FAQ from '@/components/FAQ';
import DynamicMetadata from '@/components/DynamicMetadata';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<ProductServicePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const slug = params.slug as string;
        const productData = await apiService.getProductPage(slug);
        setProduct(productData);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Product not found'}</div>
      </div>
    );
  }

  return (
    <>
      <DynamicMetadata
        title={product?.meta_title || product?.title}
        description={product?.meta_description || product?.excerpt}
        keywords={product?.keywords}
        ogTitle={product?.og_title || product?.title}
        ogDescription={product?.og_description || product?.meta_description}
        ogImage={product?.og_image}
        ogUrl={product?.og_url}
        ogType="article"
        twitterCard={product?.twitter_card}
        twitterTitle={product?.twitter_title || product?.title}
        twitterDescription={product?.twitter_description || product?.meta_description}
        twitterImage={product?.twitter_image}
        canonicalUrl={product?.canonical_url}
      />
      <div className="bg-white">
        <article className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-x-4 text-xs mb-4">
                <time dateTime={product.created_at} className="text-gray-500">
                  {new Date(product.created_at).toLocaleDateString()}
                </time>
                {product.categories && (
                  <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                    {product.categories}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.title}
              </h1>
              {product.excerpt && (
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  {product.excerpt}
                </p>
              )}
              <div className="mt-6 flex items-center gap-x-4">
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900">
                    {typeof product.author === 'string' ? product.author : product.author?.username || 'AI Generated'}
                  </p>
                </div>
              </div>
            </header>

            {/* Intro */}
            {product.intro && (
              <div className="prose prose-lg prose-gray mx-auto mb-12">
                <div dangerouslySetInnerHTML={{ __html: product.intro }} />
              </div>
            )}

            {/* Sections */}
            {product.sections && product.sections.length > 0 && (
              <div className="prose prose-lg prose-gray mx-auto">
                {product.sections.map((section) => (
                  <section key={section.id} className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    {section.content && (
                      <div 
                        className="mb-6"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    )}
                    
                    {/* Subsections */}
                    {section.subsections && section.subsections.length > 0 && (
                      <div className="space-y-6">
                        {section.subsections.map((subsection) => (
                          <div key={subsection.id}>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                              {subsection.title}
                            </h3>
                            {subsection.content && (
                              <div 
                                dangerouslySetInnerHTML={{ __html: subsection.content }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}

            {/* FAQs */}
            {product.faqs && product.faqs.length > 0 && (
              <div className="mt-16">
                <FAQ 
                  faqs={product.faqs}
                  title="Frequently Asked Questions"
                  subtitle="Find answers to common questions about this product or service"
                />
              </div>
            )}

            {/* Meta Information */}
            <footer className="mt-16 border-t border-gray-200 pt-8">
              <div className="grid grid-cols-1 gap-4 text-sm text-gray-500 sm:grid-cols-2">
                <div>
                  <p><strong>Keywords:</strong> {product.keywords}</p>
                  <p><strong>Style:</strong> {product.style}</p>
                  <p><strong>Tone:</strong> {product.tone}</p>
                </div>
                <div>
                  <p><strong>Technique:</strong> {product.technique_to_use}</p>
                  <p><strong>Scope:</strong> {product.scope}</p>
                  <p><strong>Created:</strong> {new Date(product.created_at).toLocaleString()}</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </article>
      </div>
    </>
  );
}
