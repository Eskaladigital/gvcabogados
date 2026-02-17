import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

interface Props { params: { slug: string } }

async function getPost(slug: string) {
  const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('published', true).single();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return { title: `${post.title_en || post.title_es} | Blog GVC Lawyers Murcia`, description: post.excerpt_en || post.title_en, alternates: { canonical: `https://www.gvcabogados.com/en/blog/${post.slug}` } };
}

export default async function BlogPostPageEn({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  const locale = 'en';
  return (
    <>
      <Navbar locale={locale} />
      <main>
        <section className="bg-brand-dark py-16 md:py-24 relative overflow-hidden">
          <div className="container-custom relative z-10 max-w-[800px]">
            <Link href="/en/blog" className="text-brand-brown text-xs font-semibold uppercase tracking-wider hover:text-brand-brown-hover transition-colors">← Back to blog</Link>
            {post.category && <div className="mt-4 mb-3"><span className="text-[0.55rem] font-bold text-white bg-brand-brown px-2.5 py-1 uppercase tracking-wider">{post.category}</span></div>}
            <h1 className="font-display text-2xl md:text-4xl font-bold text-white leading-tight mt-3">{post.title_en || post.title_es}</h1>
            <div className="text-neutral-400 text-xs mt-4">{new Date(post.published_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}{post.author && ` · by ${post.author}`}</div>
          </div>
        </section>
        <section className="py-12 md:py-20">
          <div className="container-custom max-w-[800px]">
            {post.cover_image && <img src={post.cover_image} alt={post.title_en} className="w-full mb-8" />}
            <div className="prose-blog" dangerouslySetInnerHTML={{ __html: post.content_en || post.content_es || '' }} />
            <div className="border-t border-neutral-200 mt-12 pt-8"><Link href="/en/blog" className="btn-outline-dark">← Back to blog</Link></div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
    </>
  );
}
