import { MetadataRoute } from 'next';
import { services } from '@/data/services';
import { landingPages } from '@/data/landings';

const BASE_URL = 'https://www.gvcabogados.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPagesEs = [
    '', '/sobre-nosotros', '/servicios', '/equipo', '/blog', '/contacto',
  ].map((path) => ({
    url: `${BASE_URL}/es${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  const staticPagesEn = [
    '', '/about', '/services', '/team', '/blog', '/contact',
  ].map((path) => ({
    url: `${BASE_URL}/en${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 0.9 : 0.7,
  }));

  const servicesPagesEs = services.map((s) => ({
    url: `${BASE_URL}/es/servicios/${s.slugEs}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: s.priority <= 2 ? 0.9 : 0.7,
  }));

  const servicesPagesEn = services.map((s) => ({
    url: `${BASE_URL}/en/services/${s.slugEn}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: s.priority <= 2 ? 0.8 : 0.6,
  }));

  const landingsEs = landingPages.map((lp) => ({
    url: `${BASE_URL}/es/abogados/${lp.slugEs}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const landingsEn = landingPages.map((lp) => ({
    url: `${BASE_URL}/en/lawyers/${lp.slugEn}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPagesEs,
    ...staticPagesEn,
    ...servicesPagesEs,
    ...servicesPagesEn,
    ...landingsEs,
    ...landingsEn,
  ];
}
