import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { SITE_URL } from '@/lib/site-config';
import { services } from '@/data/services';

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

  // --- Páginas genéricas de servicio (14 servicios, sin ciudad) ---
  const genericServicesEs = services.map((s) => ({
    url: `${SITE_URL}/es/servicios/${s.genericSlugEs}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const genericServicesEn = services.map((s) => ({
    url: `${SITE_URL}/en/services/${s.genericSlugEn}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // --- Landings locales servicio+ciudad (nueva estructura /servicios/{servicio}/{ciudad}) ---
  const { data: servicePages } = await supabaseAdmin
    .from('service_content')
    .select('slug_es, slug_en, updated_at, services!inner(service_key), localities!inner(slug)')
    .order('slug_es');

  const localPagesEs = (servicePages || []).map((sc: any) => {
    const svc = services.find(s => s.id === sc.services.service_key);
    const genericSlug = svc?.genericSlugEs || sc.services.service_key;
    return {
      url: `${SITE_URL}/es/servicios/${genericSlug}/${sc.localities.slug}`,
      lastModified: new Date(sc.updated_at || now),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  const localPagesEn = (servicePages || [])
    .filter((sc: any) => sc.slug_en)
    .map((sc: any) => {
      const svc = services.find(s => s.id === sc.services.service_key);
      const genericSlug = svc?.genericSlugEn || sc.services.service_key;
      return {
        url: `${SITE_URL}/en/services/${genericSlug}/${sc.localities.slug}`,
        lastModified: new Date(sc.updated_at || now),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      };
    });

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
    ...genericServicesEs,
    ...genericServicesEn,
    ...localPagesEs,
    ...localPagesEn,
    ...blogPagesEs,
    ...blogPagesEn,
  ];

  console.log(`[Sitemap] Generado con ${allUrls.length} URLs (${servicePages?.length ?? 0} servicios locales, 14 genéricos, ${blogPosts?.length ?? 0} posts)`);

  return allUrls;
}
