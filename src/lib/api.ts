import axios from 'axios';

const getDefaultBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  const host = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8000';
  return host;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  || (typeof window !== 'undefined' ? 'http://127.0.0.1:8000' : getDefaultBaseUrl());

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});



// Types
export interface Blog {
  id: number;
  title: string;
  keywords: string;
  intro: string;
  meta_description: string;
  style: string;
  tone: string;
  excerpt: string;
  categories: string;
  sub_categories: string;
  meta_title: string;
  page_published_time: string;
  technique_to_use: string;
  number_of_sections: number;
  number_of_subsections_per_section: number;
  og_title: string;
  og_description: string;
  og_image: string;
  og_url: string;
  og_type: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  canonical_url: string;
  slug_path: string;
  scope: string;
  keyword: string;
  created_at: string;
  updated_at: string;
  author?: string | { username?: string };
  sections: BlogSection[];
}

export interface BlogSection {
  id: number;
  title: string;
  content: string;
  order: number;
  subsections: BlogSubSection[];
}

export interface BlogSubSection {
  id: number;
  title: string;
  content: string;
  order: number;
}

export interface ProductServicePage {
  id: number;
  title: string;
  keywords: string;
  intro: string;
  meta_description: string;
  style: string;
  tone: string;
  excerpt: string;
  categories: string;
  sub_categories: string;
  meta_title: string;
  page_published_time: string;
  technique_to_use: string;
  number_of_sections: number;
  number_of_subsections_per_section: number;
  og_title: string;
  og_description: string;
  og_image: string;
  og_url: string;
  og_type: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  canonical_url: string;
  slug_path: string;
  scope: string;
  keyword: string;
  created_at: string;
  updated_at: string;
  author?: string | { username?: string };
  sections: ProductServiceSection[];
  faqs: ProductServiceFAQ[];
}

export interface ProductServiceSection {
  id: number;
  title: string;
  content: string;
  order: number;
  subsections: ProductServiceSubSection[];
}

export interface ProductServiceSubSection {
  id: number;
  title: string;
  content: string;
  order: number;
}

export interface ProductServiceFAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface Usecase {
  id: number;
  title: string;
  keywords: string;
  intro: string;
  meta_description: string;
  style: string;
  tone: string;
  excerpt: string;
  categories: string;
  sub_categories: string;
  meta_title: string;
  page_published_time: string;
  technique_to_use: string;
  number_of_sections: number;
  number_of_subsections_per_section: number;
  og_title: string;
  og_description: string;
  og_image: string;
  og_url: string;
  og_type: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  canonical_url: string;
  slug_path: string;
  scope: string;
  keyword: string;
  created_at: string;
  updated_at: string;
  author?: string | { username?: string };
  sections: UsecaseSection[];
}

export interface UsecaseSection {
  id: number;
  title: string;
  content: string;
  order: number;
  subsections: UsecaseSubSection[];
}

export interface UsecaseSubSection {
  id: number;
  title: string;
  content: string;
  order: number;
}

export interface Homepage {
  id: number;
  status: string;
  visible: string;
  locations: string;
  schema_org: string;
  meta_charset: string;
  meta_viewport: string;
  robots_directives: string;
  og_title: string;
  og_description: string;
  og_image: string;
  og_url: string;
  og_type: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  page_published_time: string;
  page_modified_time: string;
  canonical_url: string;
  slug_path: string;
  scope: string;
  keyword: string;
  keyword_correlated: string;
  style: string;
  tone: string;
  technique_to_use: string;
  meta_title: string;
  meta_description: string;
  hero_image_alt: string;
  hero_image_1: string;
  title_h1: string;
  subtitle: string;
  cta: string;
  problem_image_alt: string;
  problem_image: string;
  title_h2_problem: string;
  h3_bullet_1_title: string;
  h3_bullet_1_paragraph: string;
  h3_bullet_2_title: string;
  h3_bullet_2_paragraph: string;
  h3_bullet_3_title: string;
  h3_bullet_3_paragraph: string;
  h3_bullet_4_title: string;
  h3_bullet_4_paragraph: string;
  h3_bullet_5_title: string;
  h3_bullet_5_paragraph: string;
  solution_image_alt: string;
  solution_image: string;
  title_h2_service: string;
  solution_subtitle: string;
  h3_our_best_1: string;
  h3_our_best_2: string;
  h3_our_best_3: string;
  h3_our_best_4: string;
  h3_our_best_5: string;
  h3_our_best_6: string;
  cta_consulenza: string;
  h2_title_use_cases: string;
  preview_portfolio_use_cases: string;
  use_cases_image_alt: string;
  use_cases_image: string;
  mission_title_h2: string;
  mission_paragraph: string;
  goals_in_number: string;
  reviews: string;
  blog_preview_portfolio: string;
  faq: string;
  created_at: string;
  updated_at: string;
}

export interface About {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
  business_hours: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface ContentStats {
  blogs_count: number;
  product_pages_count: number;
  usecases_count: number;
  total_count: number;
}

export interface Navigation {
  blogs: Array<{ id: number; title: string; slug_path: string }>;
  product_pages: Array<{ id: number; title: string; slug_path: string }>;
  usecases: Array<{ id: number; title: string; slug_path: string }>;
}

// API functions with proper error handling
export const apiService = {
  // Blogs
  getBlogs: async (): Promise<{ results: Blog[]; count: number }> => {
    try {
      const response = await api.get('/api/blogs/');
      const data = response.data;
      const results: Blog[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];
      const count: number = typeof data?.count === 'number' ? data.count : results.length;
      return { results, count };
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return { results: [], count: 0 };
    }
  },

  getBlog: async (slug: string): Promise<Blog | null> => {
    try {
      const response = await api.get(`/api/blogs/${slug}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  },

  getRecentBlogs: async (): Promise<Blog[]> => {
    try {
      const response = await api.get('/api/blogs/recent/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching recent blogs:', error);
      return [];
    }
  },

  getBlogCategories: async (): Promise<string[]> => {
    try {
      const response = await api.get('/api/blogs/categories/');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }
  },

  // Product Service Pages
  getProductPages: async (): Promise<{ results: ProductServicePage[]; count: number }> => {
    try {
      const response = await api.get('/api/product-pages/');
      const data = response.data;
      const results: ProductServicePage[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];
      const count: number = typeof data?.count === 'number' ? data.count : results.length;
      return { results, count };
    } catch (error) {
      console.error('Error fetching product pages:', error);
      return { results: [], count: 0 };
    }
  },

  getProductPage: async (slug: string): Promise<ProductServicePage | null> => {
    try {
      const response = await api.get(`/api/product-pages/${slug}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product page:', error);
      return null;
    }
  },

  getRecentProductPages: async (): Promise<ProductServicePage[]> => {
    try {
      const response = await api.get('/api/product-pages/recent/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching recent product pages:', error);
      return [];
    }
  },

  getProductPageCategories: async (): Promise<string[]> => {
    try {
      const response = await api.get('/api/product-pages/categories/');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching product page categories:', error);
      return [];
    }
  },

  // Usecases
  getUsecases: async (): Promise<{ results: Usecase[]; count: number }> => {
    try {
      const response = await api.get('/api/usecases/');
      const data = response.data;
      const results: Usecase[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];
      const count: number = typeof data?.count === 'number' ? data.count : results.length;
      return { results, count };
    } catch (error) {
      console.error('Error fetching usecases:', error);
      return { results: [], count: 0 };
    }
  },

  getUsecase: async (slug: string): Promise<Usecase | null> => {
    try {
      const response = await api.get(`/api/usecases/${slug}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching usecase:', error);
      return null;
    }
  },

  getRecentUsecases: async (): Promise<Usecase[]> => {
    try {
      const response = await api.get('/api/usecases/recent/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching recent usecases:', error);
      return [];
    }
  },

  getUsecaseCategories: async (): Promise<string[]> => {
    try {
      const response = await api.get('/api/usecases/categories/');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching usecase categories:', error);
      return [];
    }
  },

  // Static Pages
  getHomepage: async (): Promise<Homepage | null> => {
    try {
      const response = await api.get('/api/homepage/');
      const data = response.data;
      if (Array.isArray(data)) return data[0] || null;
      if (Array.isArray(data?.results)) return data.results[0] || null;
      return data || null;
    } catch (error) {
      console.error('Error fetching homepage:', error);
      return null;
    }
  },

  getAbout: async (): Promise<About | null> => {
    try {
      const response = await api.get('/api/about/');
      const data = response.data;
      if (Array.isArray(data)) return data[0] || null;
      if (Array.isArray(data?.results)) return data.results[0] || null;
      return data || null;
    } catch (error) {
      console.error('Error fetching about:', error);
      return null;
    }
  },

  getContact: async (): Promise<Contact | null> => {
    try {
      const response = await api.get('/api/contact/');
      const data = response.data;
      if (Array.isArray(data)) return data[0] || null;
      if (Array.isArray(data?.results)) return data.results[0] || null;
      return data || null;
    } catch (error) {
      console.error('Error fetching contact:', error);
      return null;
    }
  },

  // Stats and Navigation
  getStats: async (): Promise<ContentStats> => {
    try {
      const response = await api.get('/api/stats/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        blogs_count: 0,
        product_pages_count: 0,
        usecases_count: 0,
        total_count: 0
      };
    }
  },

  getNavigation: async (): Promise<Navigation> => {
    try {
      const response = await api.get('/api/stats/navigation/');
      return {
        blogs: response.data?.blogs || [],
        product_pages: response.data?.product_pages || [],
        usecases: response.data?.usecases || []
      };
    } catch (error) {
      console.error('Error fetching navigation:', error);
      return {
        blogs: [],
        product_pages: [],
        usecases: []
      };
    }
  },
};
