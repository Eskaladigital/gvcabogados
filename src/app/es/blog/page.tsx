import { supabaseAdmin } from '@/lib/supabase';
import { SITE_URL } from '@/lib/site-config';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTopButton from '@/components/layout/WhatsAppButton';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import BlogPostsGrid from '@/components/blog/BlogPostsGrid';

export const revalidate = 60; // Revalidar cada 60s para datos frescos de Supabase

export const metadata: Metadata = {
  title: 'Blog Jurídico - Noticias y Artículos | GVC Abogados',
  description: 'Actualidad jurídica, noticias y artículos especializados en derecho civil, penal, laboral y más. Mantente informado con nuestro blog legal.',
  alternates: {
    canonical: `${SITE_URL}/es/blog`,
  },
  openGraph: {
    title: 'Blog Jurídico - Noticias y Artículos | GVC Abogados',
    description: 'Actualidad jurídica, noticias y artículos especializados. Mantente informado con nuestro blog legal.',
    url: `${SITE_URL}/es/blog`,
    siteName: 'García-Valcárcel & Cáceres Abogados',
    locale: 'es_ES',
    type: 'website',
  },
};

async function getPosts() {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('id, slug_es, title_es, excerpt_es, published_at, reading_time_minutes, category_id')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[Blog ES] Error fetching posts:', error.message, error.details, error.hint);
      return [];
    }

    console.log(`[Blog ES] Posts cargados: ${data?.length ?? 0}`);
    return data || [];
  } catch (e) {
    console.error('[Blog ES] Excepción al cargar posts:', e);
    return [];
  }
}

async function getCategories() {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_categories')
      .select('id, name_es, slug_es, color')
      .order('name_es');

    if (error) {
      console.error('[Blog ES] Error fetching categories:', error.message, error.details);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error('[Blog ES] Excepción al cargar categorías:', e);
    return [];
  }
}

export default async function BlogPage() {
  const [postsRaw, categories] = await Promise.all([
    getPosts(),
    getCategories()
  ]);

  // Enriquecer posts con categoría (evita join que puede fallar por RLS)
  const categoryMap = new Map(categories.map((c) => [c.id, { name_es: c.name_es, color: c.color }]));
  const posts = postsRaw.map((p) => ({
    ...p,
    blog_categories: p.category_id ? categoryMap.get(p.category_id) ?? null : null,
  }));

  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: 'Blog', href: '/es/blog' },
  ];

  return (
    <>
      <Navbar locale="es" />
      <main>
        {/* Hero con imagen de fondo */}
        <section className="relative min-h-[400px] md:min-h-[450px] flex items-center py-16">
          <div className="absolute inset-0 bg-brand-dark/90 z-10" />
          <Image
            src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.png"
            alt="Blog Jurídico GVC Abogados"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="container-custom relative z-20 w-full">
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-8 max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-brand-brown rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="w-16 h-0.5 bg-brand-gold/40" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.2] mb-5 md:mb-6 max-w-[95%]">
                Noticias y artículos de actualidad jurídica
              </h1>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[600px]">
                Mantente informado con análisis, casos prácticos y las últimas novedades del mundo legal de la mano de nuestros expertos.
              </p>
              <div className="flex gap-3 items-center flex-wrap max-w-[600px]">
                <Link href="/es/contacto" className="btn-primary">
                  Contactar →
                </Link>
                <a href="tel:+34968241025" className="btn-outline">
                  ☎ 968 241 025
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container-custom">
            <BlogPostsGrid posts={posts} categories={categories} />
          </div>
        </section>
      </main>
      <Footer locale="es" />
      <BackToTopButton />
    </>
  );
}
