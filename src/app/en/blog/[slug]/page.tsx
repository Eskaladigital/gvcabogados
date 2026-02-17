import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import SocialShare from '@/components/blog/SocialShare';
import RelatedPostsEn from '@/components/blog/RelatedPostsEn';
import { supabase } from '@/lib/supabase';
import { SITE_URL } from '@/lib/site-config';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

async function getPost(slug: string) {
  const { data } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_categories(name_en, slug_en, color),
      blog_authors(name, bio_en, avatar_url)
    `)
    .eq('slug_en', slug)
    .eq('status', 'published')
    .single();

  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};

  return {
    title: `${post.title_en} | Blog GVC Lawyers Murcia`,
    description: post.excerpt_en || post.title_en,
    alternates: { canonical: `${SITE_URL}/en/blog/${post.slug_en}` },
  };
}

function cleanHtmlContent(html: string): string {
  if (!html) return '';
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();
  return html.trim();
}

export default async function BlogPostPageEn({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const locale = 'en';
  const cleanContent = cleanHtmlContent(post.content_en || post.content_es || '');

  return (
    <>
      <Navbar locale={locale} />
      <main>
        <section className="bg-brand-dark py-16 md:py-24 relative overflow-hidden">
          <div className="container-custom relative z-10 max-w-[800px]">
            <Link href="/en/blog" className="text-brand-brown text-xs font-semibold uppercase tracking-wider hover:text-brand-brown-hover transition-colors">
              ← Back to blog
            </Link>
            {post.blog_categories && (
              <div className="mt-4 mb-3">
                <span className="text-[0.55rem] font-bold text-white bg-brand-brown px-2.5 py-1 uppercase tracking-wider">
                  {post.blog_categories.name_en}
                </span>
              </div>
            )}
            <h1 className="font-display text-2xl md:text-4xl font-bold text-white leading-tight mt-3">
              {post.title_en}
            </h1>
            <div className="flex items-center gap-2 text-neutral-400 text-xs mt-4">
              <span>
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              {post.blog_authors && (
                <>
                  <span>·</span>
                  <span>by {post.blog_authors.name}</span>
                </>
              )}
              {post.reading_time_minutes && (
                <>
                  <span>·</span>
                  <span>{post.reading_time_minutes} min read</span>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container-custom max-w-[800px]">
            {post.featured_image_url && (
              <img src={post.featured_image_url} alt={post.title_en} className="w-full mb-8 rounded-sm" />
            )}

            <SocialShare url={`/en/blog/${post.slug_en}`} title={post.title_en} />

            <div
              className="prose prose-neutral max-w-none
                prose-headings:font-display prose-headings:text-brand-dark
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-neutral-600 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-brand-brown prose-a:no-underline hover:prose-a:underline
                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-neutral-600 prose-li:mb-2
                prose-strong:text-brand-dark prose-strong:font-semibold"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />

            <SocialShare url={`/en/blog/${post.slug_en}`} title={post.title_en} />

            <RelatedPostsEn 
              currentPostId={post.id} 
              categoryId={post.category_id}
              categoryName={post.blog_categories?.name_en || ''}
            />

            <div className="border-t border-neutral-200 mt-12 pt-8">
              <Link href="/en/blog" className="btn-outline-dark">
                ← Back to blog
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
    </>
  );
}
