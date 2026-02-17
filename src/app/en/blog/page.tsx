import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import BlogPostsGridEn from '@/components/blog/BlogPostsGridEn';

export const metadata: Metadata = {
  title: 'Legal Blog - News & Articles | GVC Lawyers Murcia',
  description: 'Legal news, expert analysis and practical articles from García-Valcárcel & Cáceres Lawyers in Murcia, Spain.',
};

async function getPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      id,
      slug_en,
      title_en,
      excerpt_en,
      published_at,
      reading_time_minutes,
      blog_categories (
        name_en,
        color
      )
    `)
    .eq('status', 'published')
    .not('slug_en', 'is', null)
    .not('title_en', 'is', null)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data || [];
}

async function getCategories() {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('id, name_en, slug_en, color')
    .order('name_en');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export default async function BlogPageEn() {
  const [posts, categories] = await Promise.all([
    getPosts(),
    getCategories()
  ]);

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
            src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.png"
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
      <WhatsAppButton />
    </>
  );
}
