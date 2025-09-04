'use client';

import { useState, useEffect } from 'react';
import { apiService, About } from '@/lib/api';

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const aboutData = await apiService.getAbout();
        setAbout(aboutData);
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show empty state if no about data
  if (!about) {
    return (
      <div className="bg-white">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                No Content Available
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                About page content has not been configured yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {about?.title || 'About'}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {about?.subtitle || 'Learn more about our platform'}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="prose prose-lg prose-gray mx-auto mt-6 text-gray-500">
            <p className="text-lg leading-8 text-gray-600 mb-8">
              {about?.description || ''}
            </p>
            <div 
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: about?.content || '' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
