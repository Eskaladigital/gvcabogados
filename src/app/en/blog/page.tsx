import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = { title: 'Legal Blog — News & Articles | GVC Lawyers Murcia', description: 'Legal news and articles by García-Valcárcel & Cáceres in Murcia, Spain.', alternates: { canonical: 'https://www.gvcabogados.com/en/blog' } };
export const revalidate = 60;

async function getPosts() {
  const { data } = await supabase.from('blog_posts').select('id, slug, title_en, excerpt_en, category, published_at, cover_image').eq('published', true).order('published_at', { ascending: false });
  return data || [];
}

export default async function BlogPageEn() {
  const locale = 'en';
  const posts = await getPosts();
  return (
    <>
      <Navbar locale={locale} />
      <main>
        <section className="bg-brand-dark py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
          <div className="container-custom relative z-10">
            <div className="section-tag">Legal Blog</div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-[700px]">News and <em className="italic text-brand-gold font-normal">articles</em> on legal matters</h1>
          </div>
        </section>
        <section className="py-12 md:py-20">
          <div className="container-custom">
            {posts.length === 0 ? (
              <div className="text-center py-20"><p className="text-neutral-400 text-sm">No articles published yet.</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: any) => (
                  <Link key={post.id} href={`/en/blog/${post.slug}`} className="reveal group border border-neutral-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="h-[200px] bg-neutral-100 relative overflow-hidden">
                      {post.cover_image ? <img src={post.cover_image} alt={post.title_en} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center"><span className="text-4xl opacity-10">⚖</span></div>}
                      {post.category && <span className="absolute bottom-3 left-3 text-[0.55rem] font-bold text-white bg-brand-brown px-2.5 py-1 uppercase tracking-wider">{post.category}</span>}
                    </div>
                    <div className="p-5">
                      <h2 className="font-serif text-base font-semibold text-brand-dark leading-snug mb-2 line-clamp-2 group-hover:text-brand-brown transition-colors">{post.title_en || post.title_es}</h2>
                      {post.excerpt_en && <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 mb-3">{post.excerpt_en}</p>}
                      <div className="text-[0.65rem] text-neutral-300">{new Date(post.published_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <ScrollReveal />
    </>
  );
}
