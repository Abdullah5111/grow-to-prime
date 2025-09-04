'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiService, Blog } from '@/lib/api';

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const slug = params.slug as string;
        const blogData = await apiService.getBlog(slug);
        setBlog(blogData);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
        setError('Blog not found');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Blog not found'}</div>
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
                <time dateTime={blog.created_at} className="text-gray-500">
                  {new Date(blog.created_at).toLocaleDateString()}
                </time>
                {blog.categories && (
                  <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                    {blog.categories}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {blog.title}
              </h1>
              {blog.excerpt && (
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  {blog.excerpt}
                </p>
              )}
              <div className="mt-6 flex items-center gap-x-4">
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900">
                    {typeof blog.author === 'string' ? blog.author : blog.author?.username || 'AI Generated'}
                  </p>
                </div>
              </div>
            </header>

            {/* Intro */}
            {blog.intro && (
              <div className="prose prose-lg prose-gray mx-auto mb-12">
                <div dangerouslySetInnerHTML={{ __html: blog.intro }} />
              </div>
            )}

            {/* Sections */}
            {blog.sections && blog.sections.length > 0 && (
              <div className="prose prose-lg prose-gray mx-auto">
                {blog.sections.map((section) => (
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
                  <p><strong>Keywords:</strong> {blog.keywords}</p>
                  <p><strong>Style:</strong> {blog.style}</p>
                  <p><strong>Tone:</strong> {blog.tone}</p>
                </div>
                <div>
                  <p><strong>Technique:</strong> {blog.technique_to_use}</p>
                  <p><strong>Scope:</strong> {blog.scope}</p>
                  <p><strong>Created:</strong> {new Date(blog.created_at).toLocaleString()}</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
}
