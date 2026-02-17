import { supabaseAdmin } from '@/lib/supabase';
import { SITE_URL } from '@/lib/site-config';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import BlogPostsGridEn from '@/components/blog/BlogPostsGridEn';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Legal Blog - News & Articles | GVC Lawyers Murcia',
  description: 'Legal news, expert analysis and practical articles from García-Valcárcel & Cáceres Lawyers in Murcia, Spain.',
  alternates: {
    canonical: `${SITE_URL}/en/blog`,
  },
  openGraph: {
    title: 'Legal Blog - News & Articles | GVC Lawyers Murcia',
    description: 'Legal news, expert analysis and practical articles from our law firm in Murcia, Spain.',
    url: `${SITE_URL}/en/blog`,
    siteName: 'García-Valcárcel & Cáceres Abogados',
    locale: 'en_GB',
    type: 'website',
  },
};

async function getPosts() {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('id, slug_en, title_en, excerpt_en, published_at, reading_time_minutes, category_id')
      .eq('status', 'published')
      .not('slug_en', 'is', null)
      .not('title_en', 'is', null)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[Blog EN] Error fetching posts:', error.message, error.details, error.hint);
      return [];
    }

    console.log(`[Blog EN] Posts cargados: ${data?.length ?? 0}`);
    return data || [];
  } catch (e) {
    console.error('[Blog EN] Excepción al cargar posts:', e);
    return [];
  }
}

async function getCategories() {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_categories')
      .select('id, name_en, slug_en, color')
      .order('name_en');

    if (error) {
      console.error('[Blog EN] Error fetching categories:', error.message, error.details);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error('[Blog EN] Excepción al cargar categorías:', e);
    return [];
  }
}

export default async function BlogPageEn() {
  const [postsRaw, categories] = await Promise.all([
    getPosts(),
    getCategories()
  ]);

  const categoryMap = new Map(categories.map((c) => [c.id, { name_en: c.name_en, color: c.color }]));
  const posts = postsRaw.map((p) => ({
    ...p,
    blog_categories: p.category_id ? categoryMap.get(p.category_id) ?? null : null,
  }));

  const breadcrumbs = [
    { name: 'Home', href: '/en' },
    { name: 'Blog', href: '/en/blog' },
  ];

  return (
    <>
      <Navbar locale="en" />
      <main>
        {/* Hero */}
        <section className="relative min-h-[400px] md:min-h-[450px] flex items-center py-16">
          <div className="absolute inset-0 bg-brand-dark/90 z-10" />
          <Image
            src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
            alt="Legal Blog GVC Lawyers"
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
                Legal news and expert articles
              </h1>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[600px]">
                Stay informed with analysis, practical cases and the latest legal developments from our team of experts.
              </p>
              <div className="flex gap-3 items-center flex-wrap max-w-[600px]">
                <Link href="/en/contact" className="btn-primary">
                  Contact Us →
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
            <BlogPostsGridEn posts={posts} categories={categories} />
          </div>
        </section>
      </main>
      <Footer locale="en" />
    </>
  );
}
