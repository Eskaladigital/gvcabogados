import { supabase } from './supabase';

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

/**
 * Busca contenido de servicio por slug_es en Supabase
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
    return null;
  }

  if (!data) return null;

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
 * Obtiene todos los slugs_es activos desde Supabase para generateStaticParams
 */
export async function getAllServiceContentSlugs(): Promise<{ slug: string }[]> {
  const { data, error } = await supabase
    .from('service_content')
    .select('slug_es')
    .order('slug_es');

  if (error) {
    console.error('Error fetching service content slugs:', error);
    return [];
  }

  return (data || []).map((row) => ({ slug: row.slug_es }));
}
