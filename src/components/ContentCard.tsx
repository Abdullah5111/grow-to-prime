import Link from 'next/link';
import { CalendarIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';

interface ContentCardProps {
  id?: number;
  title: string;
  excerpt?: string;
  intro?: string;
  categories?: string;
  author?: string | { username?: string };
  created_at: string;
  slug_path: string;
  type: 'blog' | 'product' | 'usecase';
}

export default function ContentCard({
  title,
  excerpt,
  intro,
  categories,
  author,
  created_at,
  slug_path,
  type
}: ContentCardProps) {
  const getTypeColor = () => {
    switch (type) {
      case 'blog':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'product':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'usecase':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'blog':
        return 'Blog Post';
      case 'product':
        return 'Product Page';
      case 'usecase':
        return 'Use Case';
      default:
        return 'Content';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor()}`}>
            {getTypeLabel()}
          </span>
          <time dateTime={created_at} className="text-sm text-gray-500 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {new Date(created_at).toLocaleDateString()}
          </time>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-gray-700 transition-colors">
            <Link href={`/${type === 'product' ? 'products' : type === 'usecase' ? 'usecases' : 'blogs'}/${slug_path}`}>
              {title}
            </Link>
          </h3>
          <p className="text-gray-600 line-clamp-3 leading-relaxed">
            {excerpt || intro || ''}
          </p>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          {categories && (
            <div className="flex items-center text-sm text-gray-500">
              <TagIcon className="h-4 w-4 mr-1" />
              <span className="truncate max-w-24">{categories}</span>
            </div>
          )}
                      {author && (
              <div className="flex items-center text-sm text-gray-500">
                <UserIcon className="h-4 w-4 mr-1" />
                <span className="truncate max-w-24">
                  {typeof author === 'string' ? author : author.username || 'Author'}
                </span>
              </div>
            )}
        </div>
        
        <div className="mt-auto">
          <Link
            href={`/${type === 'product' ? 'products' : type === 'usecase' ? 'usecases' : 'blogs'}/${slug_path}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Read More
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
