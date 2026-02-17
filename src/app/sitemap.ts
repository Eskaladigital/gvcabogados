import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { SITE_URL } from '@/lib/site-config';

// Regenerar el sitemap cada hora para incluir nuevos contenidos
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // --- Páginas estáticas ---
  const staticPagesEs = [
    '', '/sobre-nosotros', '/servicios', '/equipo', '/blog', '/contacto',
    '/politica-cookies', '/politica-privacidad', '/aviso-legal', '/sitemap',
  ].map((path) => ({
    url: `${SITE_URL}/es${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  const staticPagesEn = [
    '', '/about', '/services', '/team', '/blog', '/contact', '/sitemap',
  ].map((path) => ({
    url: `${SITE_URL}/en${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 0.9 : 0.7,
  }));

  // --- Todas las páginas de servicio+localidad desde Supabase (194 registros) ---
  const { data: servicePages } = await supabaseAdmin
    .from('service_content')
    .select('slug_es, slug_en, updated_at')
    .order('slug_es');

  const serviceContentEs = (servicePages || []).map((sc) => ({
    url: `${SITE_URL}/es/servicios/${sc.slug_es}`,
    lastModified: new Date(sc.updated_at || now),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const serviceContentEn = (servicePages || [])
    .filter((sc) => sc.slug_en)
    .map((sc) => ({
      url: `${SITE_URL}/en/services/${sc.slug_en}`,
      lastModified: new Date(sc.updated_at || now),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  // --- Landings /es/abogados/ (mismos datos, ruta distinta) ---
  const landingsEs = (servicePages || []).map((sc) => ({
    url: `${SITE_URL}/es/abogados/${sc.slug_es}`,
    lastModified: new Date(sc.updated_at || now),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const landingsEn = (servicePages || [])
    .filter((sc) => sc.slug_en)
    .map((sc) => ({
      url: `${SITE_URL}/en/lawyers/${sc.slug_en}`,
      lastModified: new Date(sc.updated_at || now),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  // --- Blog posts ---
  const { data: blogPosts } = await supabaseAdmin
    .from('blog_posts')
    .select('slug_es, slug_en, published_at, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const blogPagesEs = (blogPosts || []).map((post) => ({
    url: `${SITE_URL}/es/blog/${post.slug_es}`,
    lastModified: new Date(post.updated_at || post.published_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const blogPagesEn = (blogPosts || [])
    .filter((post) => post.slug_en)
    .map((post) => ({
      url: `${SITE_URL}/en/blog/${post.slug_en}`,
      lastModified: new Date(post.updated_at || post.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

  const allUrls = [
    ...staticPagesEs,
    ...staticPagesEn,
    ...serviceContentEs,
    ...serviceContentEn,
    ...landingsEs,
    ...landingsEn,
    ...blogPagesEs,
    ...blogPagesEn,
  ];

  console.log(`[Sitemap] Generado con ${allUrls.length} URLs (${servicePages?.length ?? 0} servicios, ${blogPosts?.length ?? 0} posts)`);

  return allUrls;
}
