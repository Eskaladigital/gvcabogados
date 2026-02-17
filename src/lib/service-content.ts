import { supabase } from './supabase';
import { services as staticServices } from '@/data/services';

export interface ServiceContent {
  id: string;
  serviceId: string;
  serviceKey: string;
  serviceNameEs: string;
  serviceNameEn: string;
  localityId: string;
  localityName: string;
  localitySlug: string;
  slugEs: string;
  slugEn: string;
  titleEs: string;
  metaDescriptionEs: string | null;
  shortDescriptionEs: string | null;
  longDescriptionEs: string | null;
  sectionsEs: Array<{ title: string; content: string }>;
  processEs: string[];
  faqsEs: Array<{ question: string; answer: string }>;
  titleEn: string | null;
  metaDescriptionEn: string | null;
  shortDescriptionEn: string | null;
  longDescriptionEn: string | null;
  sectionsEn: Array<{ title: string; content: string }> | null;
  processEn: string[] | null;
  faqsEn: Array<{ question: string; answer: string }> | null;
}

/** Convierte slug de ciudad a nombre (malaga -> Málaga) */
function slugToCityName(slug: string): string {
  const map: Record<string, string> = {
    murcia: 'Murcia', alicante: 'Alicante', malaga: 'Málaga', madrid: 'Madrid',
    barcelona: 'Barcelona', valencia: 'Valencia', sevilla: 'Sevilla', bilbao: 'Bilbao',
    cartagena: 'Cartagena', albacete: 'Albacete', almeria: 'Almería', toledo: 'Toledo',
    zaragoza: 'Zaragoza', granada: 'Granada', cordoba: 'Córdoba', santander: 'Santander',
  };
  return map[slug.toLowerCase()] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

/**
 * Fallback: contenido desde datos estáticos cuando Supabase falla.
 * Soporta slugs tipo "abogados-{service}-{city}" para cualquier ciudad.
 */
function getServiceContentFromStatic(slug: string): ServiceContent | null {
  // 1. Match exacto (Murcia)
  let svc = staticServices.find((s) => s.slugEs === slug || s.slugEn === slug);
  let cityName = 'Murcia';
  let citySlug = 'murcia';

  // 2. Parsear "abogados-{serviceKey}-{citySlug}" para otras ciudades
  if (!svc && slug.startsWith('abogados-')) {
    const rest = slug.slice(9); // quitar "abogados-"
    const parts = rest.split('-');
    if (parts.length >= 2) {
      citySlug = parts[parts.length - 1];
      cityName = slugToCityName(citySlug);
      const possibleServiceKey = parts.slice(0, -1).join('-');
      svc = staticServices.find((s) => s.id === possibleServiceKey);
    }
  }

  if (!svc) return null;

  const enPrefixMap: Record<string, string> = {
    'accidentes-trafico': 'traffic-accident-lawyers',
    'derecho-familia': 'family-law-lawyers',
    'derecho-bancario': 'banking-law-lawyers',
    'derecho-penal': 'criminal-law-lawyers',
    'derecho-inmobiliario': 'real-estate-lawyers',
    'derecho-sucesorio': 'inheritance-lawyers',
    'negligencias-medicas': 'medical-malpractice-lawyers',
    'derecho-mercantil': 'commercial-law-lawyers',
    'responsabilidad-civil': 'civil-liability-lawyers',
    'obligaciones-contratos': 'contract-law-lawyers',
    'mediacion': 'mediation-lawyers',
    'extranjeria': 'immigration-lawyers',
    'derecho-administrativo': 'administrative-law-lawyers',
    'defensa-fondos-buitre': 'vulture-fund-defense-lawyers',
  };
  const enPrefix = enPrefixMap[svc.id] || svc.id + '-lawyers';
  const slugEn = `${enPrefix}-${citySlug}`;

  return {
    id: svc.id,
    serviceId: svc.id,
    serviceKey: svc.id,
    serviceNameEs: svc.nameEs,
    serviceNameEn: svc.nameEn,
    localityId: '',
    localityName: cityName,
    localitySlug: citySlug,
    slugEs: slug,
    slugEn,
    titleEs: `Abogados de ${svc.nameEs} en ${cityName} | GVC Abogados`,
    metaDescriptionEs: `${svc.descriptionEs} Especialistas en ${cityName}. ☎ 968 241 025.`,
    shortDescriptionEs: svc.descriptionEs,
    longDescriptionEs: svc.longDescriptionEs.replace(/Murcia/g, cityName),
    sectionsEs: svc.sectionsEs,
    processEs: svc.processEs,
    faqsEs: svc.faqsEs,
    titleEn: `${svc.nameEn} Lawyers in ${cityName} | GVC Lawyers`,
    metaDescriptionEn: svc.descriptionEn,
    shortDescriptionEn: svc.descriptionEn,
    longDescriptionEn: svc.longDescriptionEn?.replace(/Murcia/g, cityName) ?? null,
    sectionsEn: svc.sectionsEn,
    processEn: svc.processEn,
    faqsEn: svc.faqsEn,
  };
}

/**
 * Busca contenido de servicio por slug_es en Supabase.
 * Si falla, usa datos estáticos como fallback.
 */
export async function getServiceContentBySlug(slug: string): Promise<ServiceContent | null> {
  const { data, error } = await supabase
    .from('service_content')
    .select(`
      id,
      service_id,
      locality_id,
      slug_es,
      slug_en,
      title_es,
      meta_description_es,
      short_description_es,
      long_description_es,
      sections_es,
      process_es,
      faqs_es,
      title_en,
      meta_description_en,
      short_description_en,
      long_description_en,
      sections_en,
      process_en,
      faqs_en,
      services!inner (
        service_key,
        name_es,
        name_en
      ),
      localities!inner (
        name,
        slug
      )
    `)
    .eq('slug_es', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching service content:', error);
    return getServiceContentFromStatic(slug);
  }

  if (!data) return getServiceContentFromStatic(slug);

  return {
    id: data.id,
    serviceId: data.service_id,
    serviceKey: (data.services as any).service_key,
    serviceNameEs: (data.services as any).name_es,
    serviceNameEn: (data.services as any).name_en,
    localityId: data.locality_id,
    localityName: (data.localities as any).name,
    localitySlug: (data.localities as any).slug,
    slugEs: data.slug_es,
    slugEn: data.slug_en,
    titleEs: data.title_es,
    metaDescriptionEs: data.meta_description_es,
    shortDescriptionEs: data.short_description_es,
    longDescriptionEs: data.long_description_es,
    sectionsEs: (data.sections_es as any) || [],
    processEs: (data.process_es as any) || [],
    faqsEs: (data.faqs_es as any) || [],
    titleEn: data.title_en,
    metaDescriptionEn: data.meta_description_en,
    shortDescriptionEn: data.short_description_en,
    longDescriptionEn: data.long_description_en,
    sectionsEn: (data.sections_en as any) || null,
    processEn: (data.process_en as any) || null,
    faqsEn: (data.faqs_en as any) || null,
  };
}

/**
 * Obtiene todos los slugs_es activos desde Supabase para generateStaticParams.
 * Si Supabase falla, usa slugs de datos estáticos como fallback.
 */
export async function getAllServiceContentSlugs(): Promise<{ slug: string }[]> {
  const { data, error } = await supabase
    .from('service_content')
    .select('slug_es')
    .order('slug_es');

  if (error) {
    console.error('Error fetching service content slugs:', error);
    return staticServices.map((s) => ({ slug: s.slugEs }));
  }

  const slugs = (data || []).map((row) => ({ slug: row.slug_es }));
  if (slugs.length === 0) {
    return staticServices.map((s) => ({ slug: s.slugEs }));
  }
  return slugs;
}
