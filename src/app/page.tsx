'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService, Homepage } from '@/lib/api';
import FAQ from '@/components/FAQ';
import DynamicMetadata from '@/components/DynamicMetadata';

export default function HomePage() {
  const [homepage, setHomepage] = useState<Homepage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homepageData = await apiService.getHomepage();
        setHomepage(homepageData);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
        setHomepage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const parseHomepageFAQ = (faqText: string) => {
    const lines = faqText.split('\n').filter(line => line.trim());
    const faqs = [];
    
    for (let i = 0; i < lines.length; i += 2) {
      if (i + 1 < lines.length) {
        faqs.push({
          id: i / 2 + 1,
          question: lines[i].trim(),
          answer: lines[i + 1].trim(),
          order: i / 2 + 1
        });
      }
    }
    
    return faqs;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show empty state if no homepage data
  if (!homepage) {
    return (
      <div className="bg-white">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                No Content Available
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Homepage content has not been configured yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DynamicMetadata
        title={homepage?.meta_title || homepage?.title_h1}
        description={homepage?.meta_description || homepage?.subtitle}
        keywords={homepage?.keyword}
        ogTitle={homepage?.og_title || homepage?.title_h1}
        ogDescription={homepage?.og_description || homepage?.meta_description}
        ogImage={homepage?.og_image}
        ogUrl={homepage?.og_url}
        ogType={homepage?.og_type}
        twitterCard={homepage?.twitter_card}
        twitterTitle={homepage?.twitter_title || homepage?.title_h1}
        twitterDescription={homepage?.twitter_description || homepage?.meta_description}
        twitterImage={homepage?.twitter_image}
        canonicalUrl={homepage?.canonical_url}
        robotsDirectives={homepage?.robots_directives}
        schemaOrg={homepage?.schema_org || JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: homepage?.title_h1 || 'Home',
          description: homepage?.meta_description || homepage?.subtitle,
        })}
      />
      <div className="bg-white">
        <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {homepage?.title_h1 || 'Grow to Prime'}
            </h1>
            <p className="mt-6 text-lg leading-8 text-black">
              {homepage?.subtitle || 'AI-powered content generation platform'}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/contact"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {homepage?.cta || 'Get Started'}
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                {homepage?.cta_consulenza || 'Learn more'} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {homepage?.title_h2_problem && (
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {homepage.title_h2_problem}
                </h2>
              </div>
              <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {homepage.h3_bullet_1_title && (
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{homepage.h3_bullet_1_title}</h3>
                    <p className="text-black">{homepage.h3_bullet_1_paragraph}</p>
                  </div>
                )}
                {homepage.h3_bullet_2_title && (
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{homepage.h3_bullet_2_title}</h3>
                    <p className="text-black">{homepage.h3_bullet_2_paragraph}</p>
                  </div>
                )}
                {homepage.h3_bullet_3_title && (
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{homepage.h3_bullet_3_title}</h3>
                    <p className="text-black">{homepage.h3_bullet_3_paragraph}</p>
                  </div>
                )}
                {homepage.h3_bullet_4_title && (
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{homepage.h3_bullet_4_title}</h3>
                    <p className="text-black">{homepage.h3_bullet_4_paragraph}</p>
                  </div>
                )}
                {homepage.h3_bullet_5_title && (
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{homepage.h3_bullet_5_title}</h3>
                    <p className="text-black">{homepage.h3_bullet_5_paragraph}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {homepage?.title_h2_service && (
        <div className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {homepage.title_h2_service}
                </h2>
                {homepage.solution_subtitle && (
                  <p className="mt-4 text-lg leading-8 text-black">
                    {homepage.solution_subtitle}
                  </p>
                )}
              </div>
              <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {homepage.h3_our_best_1 && (
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{homepage.h3_our_best_1}</h3>
                  </div>
                )}
                {homepage.h3_our_best_2 && (
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{homepage.h3_our_best_2}</h3>
                  </div>
                )}
                {homepage.h3_our_best_3 && (
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{homepage.h3_our_best_3}</h3>
                  </div>
                )}
                {homepage.h3_our_best_4 && (
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{homepage.h3_our_best_4}</h3>
                  </div>
                )}
                {homepage.h3_our_best_5 && (
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{homepage.h3_our_best_5}</h3>
                  </div>
                )}
                {homepage.h3_our_best_6 && (
                  <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{homepage.h3_our_best_6}</h3>
                  </div>
                )}
              </div>
              {homepage.cta_consulenza && (
                <div className="mt-12 text-center">
                  <Link
                    href="/contact"
                    className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {homepage.cta_consulenza}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {homepage?.h2_title_use_cases && (
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {homepage.h2_title_use_cases}
                </h2>
                {homepage.preview_portfolio_use_cases && (
                  <p className="mt-4 text-lg leading-8 text-black">
                    {homepage.preview_portfolio_use_cases}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {homepage?.mission_title_h2 && (
        <div className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {homepage.mission_title_h2}
                </h2>
                {homepage.mission_paragraph && (
                  <p className="mt-6 text-lg leading-8 text-black">
                    {homepage.mission_paragraph}
                  </p>
                )}
                {homepage.goals_in_number && (
                  <div className="mt-8 text-2xl font-bold text-indigo-600">
                    {homepage.goals_in_number}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {homepage?.reviews && (
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
                  {homepage?.reviews ? 'What Our Clients Say' : 'Client Reviews'}
                </h2>
                <div className="bg-gray-50 p-8 rounded-lg">
                  <p className="text-lg leading-8 text-black italic">
                    {homepage.reviews}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {homepage?.blog_preview_portfolio && (
        <div className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
                  {homepage?.blog_preview_portfolio ? 'Latest Insights' : 'Blog Insights'}
                </h2>
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <p className="text-lg leading-8 text-black">
                    {homepage.blog_preview_portfolio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {homepage?.faq && (
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <FAQ 
                  faqs={parseHomepageFAQ(homepage.faq)}
                  title="Frequently Asked Questions"
                  subtitle="Find answers to common questions about our services"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
