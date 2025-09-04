'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiService, Usecase } from '@/lib/api';

export default function UsecaseDetailPage() {
  const params = useParams();
  const [usecase, setUsecase] = useState<Usecase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsecase = async () => {
      try {
        const slug = params.slug as string;
        const usecaseData = await apiService.getUsecase(slug);
        setUsecase(usecaseData);
      } catch (error) {
        console.error('Failed to fetch usecase:', error);
        setError('Usecase not found');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchUsecase();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !usecase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Usecase not found'}</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <article className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-x-4 text-xs mb-4">
                <time dateTime={usecase.created_at} className="text-gray-500">
                  {new Date(usecase.created_at).toLocaleDateString()}
                </time>
                {usecase.categories && (
                  <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                    {usecase.categories}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {usecase.title}
              </h1>
              {usecase.excerpt && (
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  {usecase.excerpt}
                </p>
              )}
              <div className="mt-6 flex items-center gap-x-4">
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900">
                    {typeof usecase.author === 'string' ? usecase.author : usecase.author?.username || 'AI Generated'}
                  </p>
                </div>
              </div>
            </header>

            {/* Intro */}
            {usecase.intro && (
              <div className="prose prose-lg prose-gray mx-auto mb-12">
                <div dangerouslySetInnerHTML={{ __html: usecase.intro }} />
              </div>
            )}

            {/* Sections */}
            {usecase.sections && usecase.sections.length > 0 && (
              <div className="prose prose-lg prose-gray mx-auto">
                {usecase.sections.map((section) => (
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

            {/* Meta Information */}
            <footer className="mt-16 border-t border-gray-200 pt-8">
              <div className="grid grid-cols-1 gap-4 text-sm text-gray-500 sm:grid-cols-2">
                <div>
                  <p><strong>Keywords:</strong> {usecase.keywords}</p>
                  <p><strong>Style:</strong> {usecase.style}</p>
                  <p><strong>Tone:</strong> {usecase.tone}</p>
                </div>
                <div>
                  <p><strong>Technique:</strong> {usecase.technique_to_use}</p>
                  <p><strong>Scope:</strong> {usecase.scope}</p>
                  <p><strong>Created:</strong> {new Date(usecase.created_at).toLocaleString()}</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
}
