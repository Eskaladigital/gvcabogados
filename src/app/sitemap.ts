import { MetadataRoute } from 'next';
import { services } from '@/data/services';
import { landingPages } from '@/data/landings';
import { supabaseAdmin } from '@/lib/supabase';
import { SITE_URL } from '@/lib/site-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPagesEs = [
    '', '/sobre-nosotros', '/servicios', '/equipo', '/blog', '/contacto',
    '/politica-cookies', '/politica-privacidad', '/aviso-legal', '/sitemap',
  ].map((path) => ({
    url: `${SITE_URL}/es${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  const staticPagesEn = [
    '', '/about', '/services', '/team', '/blog', '/contact', '/sitemap',
  ].map((path) => ({
    url: `${SITE_URL}/en${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 0.9 : 0.7,
  }));

  const servicesPagesEs = services.map((s) => ({
    url: `${SITE_URL}/es/servicios/${s.slugEs}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: s.priority <= 2 ? 0.9 : 0.7,
  }));

  const servicesPagesEn = services.map((s) => ({
    url: `${SITE_URL}/en/services/${s.slugEn}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: s.priority <= 2 ? 0.8 : 0.6,
  }));

  const landingsEs = landingPages.map((lp) => ({
    url: `${SITE_URL}/es/abogados/${lp.slugEs}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const landingsEn = landingPages.map((lp) => ({
    url: `${SITE_URL}/en/lawyers/${lp.slugEn}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Blog posts from Supabase
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
    .filter(post => post.slug_en)
    .map((post) => ({
      url: `${SITE_URL}/en/blog/${post.slug_en}`,
      lastModified: new Date(post.updated_at || post.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

  return [
    ...staticPagesEs,
    ...staticPagesEn,
    ...servicesPagesEs,
    ...servicesPagesEn,
    ...landingsEs,
    ...landingsEn,
    ...blogPagesEs,
    ...blogPagesEn,
  ];
}
