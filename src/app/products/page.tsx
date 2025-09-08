'use client';

import { useState, useEffect } from 'react';
import { apiService, ProductServicePage } from '@/lib/api';
import DynamicMetadata from '@/components/DynamicMetadata';
import ContentCard from '@/components/ContentCard';
import Pagination from '@/components/Pagination';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductServicePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getProductPages();
        setProducts(response.results);
        setTotalCount(response.count);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <DynamicMetadata
        title="Products"
        description="Our products and services"
        ogType="website"
        canonicalUrl={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products`}
        schemaOrg={JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Products',
              item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products`,
            },
          ],
        })}
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product & Service Pages</h1>
          <p className="text-gray-600">Explore our collection of product and service content</p>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">No product pages available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {currentProducts.map((product) => (
                <ContentCard
                  key={product.id}
                  id={product.id}
                  title={product.title || ''}
                  excerpt={product.excerpt}
                  intro={product.intro}
                  categories={product.categories}
                  author="AI Generated"
                  created_at={product.created_at}
                  slug_path={product.slug_path || ''}
                  type="product"
                />
              ))}
            </div>
            
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalCount}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
