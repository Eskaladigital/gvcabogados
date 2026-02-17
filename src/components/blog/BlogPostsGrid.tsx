'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SITE_URL } from '@/lib/site-config';

interface CategoryData {
  name_es: string;
  color: string;
}

interface BlogPostRaw {
  id: string;
  slug_es: string;
  title_es: string;
  excerpt_es: string;
  published_at: string;
  reading_time_minutes: number;
  blog_categories: CategoryData | CategoryData[] | null;
}

interface BlogPost {
  id: string;
  slug_es: string;
  title_es: string;
  excerpt_es: string;
  published_at: string;
  reading_time_minutes: number;
  blog_categories: CategoryData | null;
}

interface Category {
  id: string;
  name_es: string;
  slug_es: string;
  color: string;
}

interface Props {
  posts: BlogPostRaw[];
  categories: Category[];
}

function normalizePost(post: BlogPostRaw): BlogPost {
  const cat = post.blog_categories;
  return {
    ...post,
    blog_categories: Array.isArray(cat) ? cat[0] || null : cat,
  };
}

const POSTS_PER_PAGE = 12;

export default function BlogPostsGrid({ posts: rawPosts, categories }: Props) {
  const posts = rawPosts.map(normalizePost);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Aplicar filtros
  const getFilteredPosts = () => {
    let filtered = [...posts];

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        post => post.blog_categories?.name_es === selectedCategory
      );
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => {
        const titleMatch = post.title_es?.toLowerCase().includes(query);
        const excerptMatch = post.excerpt_es?.toLowerCase().includes(query);
        return titleMatch || excerptMatch;
      });
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();

  // Calcular paginación
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (validPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Actualizar página cuando cambian filtros
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Contar posts por categoría
  const getCategoryCount = (categoryName: string) => {
    if (categoryName === 'all') return posts.length;
    return posts.filter(p => p.blog_categories?.name_es === categoryName).length;
  };

  return (
    <>
      {/* Filtros */}
      <div className="mb-12 space-y-6">
        {/* Buscador */}
        <div className="max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar artículos por título o tema..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-5 py-3.5 pl-12 border border-neutral-200 rounded-sm focus:outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown transition-colors text-sm"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Categorías */}
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-semibold text-brand-dark">Filtrar por:</span>
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 text-sm font-medium rounded-sm transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-dark text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Todos ({getCategoryCount('all')})
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.name_es)}
              className={`px-4 py-2 text-sm font-medium rounded-sm transition-all ${
                selectedCategory === category.name_es
                  ? 'text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
              style={{
                backgroundColor:
                  selectedCategory === category.name_es
                    ? category.color
                    : undefined,
              }}
            >
              {category.name_es} ({getCategoryCount(category.name_es)})
            </button>
          ))}
        </div>

        {/* Contador y limpiar filtros */}
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-sm text-neutral-500">
            {filteredPosts.length === posts.length ? (
              <>
                Mostrando <span className="font-semibold text-brand-dark">{posts.length}</span> artículos
              </>
            ) : (
              <>
                Mostrando <span className="font-semibold text-brand-dark">{filteredPosts.length}</span> de{' '}
                <span className="font-semibold">{posts.length}</span> artículos
              </>
            )}
          </p>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={clearFilters}
              className="text-sm text-brand-brown hover:text-brand-brown-hover font-medium flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Grid de artículos */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-sm">
          <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-neutral-500 text-base mb-2">No se encontraron artículos</p>
          <p className="text-neutral-400 text-sm">
            Intenta con otros términos de búsqueda o selecciona otra categoría
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/es/blog/${post.slug_es}`}
                className="group border border-neutral-200 bg-white hover:shadow-xl hover:border-brand-brown transition-all duration-300 flex flex-col"
              >
                <div className="p-6 flex flex-col flex-1">
                  {/* Categoría y tiempo de lectura */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    {post.blog_categories && (
                      <span
                        className="text-[0.65rem] font-bold text-white px-3 py-1.5 uppercase tracking-wider rounded-sm"
                        style={{ backgroundColor: post.blog_categories.color || '#714c20' }}
                      >
                        {post.blog_categories.name_es}
                      </span>
                    )}
                    {post.reading_time_minutes && (
                      <span className="text-[0.7rem] text-neutral-400 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {post.reading_time_minutes} min
                      </span>
                    )}
                  </div>

                  {/* Título */}
                  <h2 className="font-display text-xl font-bold text-brand-dark leading-tight mb-3 group-hover:text-brand-brown transition-colors line-clamp-2">
                    {post.title_es}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt_es && (
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3 mb-4 flex-1">
                      {post.excerpt_es}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-3">
                      {/* Fecha */}
                      <div className="text-[0.7rem] text-neutral-400 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(post.published_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>

                      {/* Botones de compartir */}
                      <div className="flex items-center gap-1">
                        {/* Facebook */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const url = encodeURIComponent(`${SITE_URL}/es/blog/${post.slug_es}`);
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
                          }}
                          className="p-1.5 rounded-sm hover:bg-brand-dark text-brand-dark hover:text-white transition-colors"
                          title="Compartir en Facebook"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </button>

                        {/* Twitter/X */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const url = encodeURIComponent(`${SITE_URL}/es/blog/${post.slug_es}`);
                            const text = encodeURIComponent(post.title_es);
                            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
                          }}
                          className="p-1.5 rounded-sm hover:bg-brand-dark text-brand-dark hover:text-white transition-colors"
                          title="Compartir en X"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </button>

                        {/* LinkedIn */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const url = encodeURIComponent(`${SITE_URL}/es/blog/${post.slug_es}`);
                            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
                          }}
                          className="p-1.5 rounded-sm hover:bg-brand-dark text-brand-dark hover:text-white transition-colors"
                          title="Compartir en LinkedIn"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* CTA */}
                    <span className="text-[0.75rem] font-semibold text-brand-brown flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Leer más
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              {/* Botón anterior */}
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={validPage === 1}
                className={`p-2 rounded-sm transition-colors ${
                  validPage === 1
                    ? 'text-neutral-300 cursor-not-allowed'
                    : 'text-brand-dark hover:bg-neutral-100'
                }`}
                aria-label="Página anterior"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Números de página */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= validPage - 1 && page <= validPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-sm font-medium text-sm transition-colors ${
                        validPage === page
                          ? 'bg-brand-dark text-white'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === validPage - 2 || page === validPage + 2) {
                  return (
                    <span key={page} className="text-neutral-400 px-2">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              {/* Botón siguiente */}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={validPage === totalPages}
                className={`p-2 rounded-sm transition-colors ${
                  validPage === totalPages
                    ? 'text-neutral-300 cursor-not-allowed'
                    : 'text-brand-dark hover:bg-neutral-100'
                }`}
                aria-label="Página siguiente"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
