import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SocialShare from '@/components/blog/SocialShare';
import RelatedPosts from '@/components/blog/RelatedPosts';
import { supabaseAdmin } from '@/lib/supabase';
import { SITE_URL } from '@/lib/site-config';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const { data } = await supabaseAdmin
    .from('blog_posts')
    .select(`
      *,
      blog_categories(name_es, slug_es, color),
      blog_authors(name, bio_es, avatar_url)
    `)
    .eq('slug_es', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .single();

  return data;
}

const BLOG_SEO_OVERRIDES: Record<string, { title: string; description: string }> = {
  'cuanto-tiempo-tarda-un-juicio-en-espana': {
    title: '¿Cuánto tarda un juicio en España? Plazos por vía (2026) | GVC',
    description:
      'Plazos reales de un juicio civil, penal, laboral o contencioso en España en 2026: de 3 meses a 2 años según juzgado y recursos. Guía de abogados expertos.',
  },
  'cuanto-tarda-en-cobrarse-una-indemnizacion-por-accidente-de-trafico': {
    title: '¿Cuánto tarda una indemnización por accidente de tráfico? (2026)',
    description:
      'Plazo legal para cobrar una indemnización por accidente de tráfico: 3 meses tras la oferta motivada (o 6–12 meses en juicio). Cómo reclamar sin retrasos.',
  },
  'inhabilitacion-profesional-en-que-casos-se-aplica': {
    title: 'Inhabilitación profesional: qué es, casos y duración | GVC Abogados',
    description:
      'Cuándo se aplica la inhabilitación especial o absoluta en España, a qué profesiones afecta, duración y cómo recurrirla. Explicado por abogados especialistas.',
  },
};

function getContextualServiceCta(slug: string, categorySlug?: string): {
  title: string;
  text: string;
  href: string;
  label: string;
} {
  const s = `${slug} ${categorySlug || ''}`.toLowerCase();
  if (s.includes('accidente') || s.includes('trafico') || s.includes('indemnizacion')) {
    return {
      title: '¿Necesita reclamar una indemnización por accidente de tráfico?',
      text: 'Nuestro equipo de abogados en Murcia valora su caso con el baremo vigente y negocia directamente con la aseguradora.',
      href: '/es/servicios/accidentes-trafico/murcia',
      label: 'Abogados de accidentes de tráfico en Murcia →',
    };
  }
  if (s.includes('familia') || s.includes('divorcio') || s.includes('custodia') || s.includes('pension')) {
    return {
      title: '¿Necesita asesoramiento en Derecho de Familia o divorcio?',
      text: 'Más de 55 años defendiendo acuerdos y procedimientos de familia ante los juzgados de Murcia.',
      href: '/es/servicios/derecho-familia/murcia',
      label: 'Abogados de derecho de familia en Murcia →',
    };
  }
  if (s.includes('administracion') || s.includes('administrativo') || s.includes('inhabilitacion') || s.includes('sancion')) {
    return {
      title: '¿Afronta un procedimiento o reclamación ante la Administración?',
      text: 'Analizamos plazos, recursos administrativos y defensa contenciosa desde nuestro despacho en Gran Vía 15, Murcia.',
      href: '/es/servicios/responsabilidad-administracion/murcia',
      label: 'Abogados de derecho administrativo en Murcia →',
    };
  }
  return {
    title: '¿Necesita un abogado especialista en Murcia?',
    text: 'En García-Valcárcel & Cáceres llevamos más de 55 años defendiendo procedimientos civiles, responsabilidad civil, familia y administrativo.',
    href: '/es/servicios/responsabilidad-civil/murcia',
    label: 'Ver áreas de práctica en Murcia →',
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const override = BLOG_SEO_OVERRIDES[post.slug_es];
  return {
    title: override?.title || `${post.title_es} | Blog GVC Abogados Murcia`,
    description: override?.description || post.excerpt_es || post.title_es,
    alternates: { canonical: `${SITE_URL}/es/blog/${post.slug_es}` },
  };
}

function cleanHtmlContent(html: string): string {
  if (!html) return '';
  
  // Si el HTML tiene tags html/body, extraer solo el contenido del body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    return bodyMatch[1].trim();
  }
  
  return html.trim();
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const locale = 'es';
  const cleanContent = cleanHtmlContent(post.content_es || '');
  const serviceCta = getContextualServiceCta(post.slug_es, post.blog_categories?.slug_es);

  return (
    <>
      <Navbar locale={locale} />
      <main>
        <section className="bg-brand-dark py-16 md:py-24 relative overflow-hidden">
          <div className="container-custom relative z-10 max-w-[800px]">
            <Link href="/es/blog" className="text-brand-brown text-xs font-semibold uppercase tracking-wider hover:text-brand-brown-hover transition-colors">
              ← Volver al blog
            </Link>
            {post.blog_categories && (
              <div className="mt-4 mb-3">
                <span className="text-[0.55rem] font-bold text-white bg-brand-brown px-2.5 py-1 uppercase tracking-wider">
                  {post.blog_categories.name_es}
                </span>
              </div>
            )}
            <h1 className="font-display text-2xl md:text-4xl font-bold text-white leading-tight mt-3">
              {post.title_es}
            </h1>
            <div className="flex items-center gap-2 text-neutral-400 text-xs mt-4">
              <span>
                {new Date(post.published_at).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              {post.blog_authors && (
                <>
                  <span>·</span>
                  <span>por {post.blog_authors.name}</span>
                </>
              )}
              {post.reading_time_minutes && (
                <>
                  <span>·</span>
                  <span>{post.reading_time_minutes} min lectura</span>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container-custom max-w-[800px]">
            {post.featured_image_url && (
              <img src={post.featured_image_url} alt={post.title_es} className="w-full mb-8 rounded-sm" />
            )}

            {/* Compartir en redes sociales */}
            <SocialShare url={`/es/blog/${post.slug_es}`} title={post.title_es} />

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

            {/* Puente comercial contextual a servicios Murcia */}
            <aside className="my-10 border border-brand-brown/30 bg-brand-dark text-white p-6 md:p-8 rounded-sm">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-brand-brown mb-2">
                García-Valcárcel &amp; Cáceres · Despacho en Murcia desde 1970
              </p>
              <h2 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
                {serviceCta.title}
              </h2>
              <p className="text-neutral-300 text-sm leading-relaxed mb-5">
                {serviceCta.text}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href={serviceCta.href} className="btn-primary text-xs">
                  {serviceCta.label}
                </Link>
                <Link href="/es/contacto" className="btn-outline text-xs">
                  Solicitar consulta
                </Link>
                <a href="tel:+34968241025" className="text-xs text-neutral-300 hover:text-white underline underline-offset-4 ml-1">
                  ☎ 968 241 025
                </a>
              </div>
            </aside>

            {/* Compartir al final también */}
            <SocialShare url={`/es/blog/${post.slug_es}`} title={post.title_es} />

            {/* Artículos relacionados */}
            <RelatedPosts 
              currentPostId={post.id} 
              categoryId={post.category_id}
              categoryName={post.blog_categories?.name_es || ''}
            />

            <div className="border-t border-neutral-200 mt-12 pt-8">
              <Link href="/es/blog" className="btn-outline-dark">
                ← Volver al blog
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
