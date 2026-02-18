import { supabaseAdmin } from './supabase';
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
  customSectionsEs: Record<string, any> | null;
  titleEn: string | null;
  metaDescriptionEn: string | null;
  shortDescriptionEn: string | null;
  longDescriptionEn: string | null;
  sectionsEn: Array<{ title: string; content: string }> | null;
  processEn: string[] | null;
  faqsEn: Array<{ question: string; answer: string }> | null;
  customSectionsEn: Record<string, any> | null;
}

/** Convierte slug de ciudad a nombre legible con tildes y mayúsculas correctas. */
function slugToCityName(slug: string): string {
  const map: Record<string, string> = {
    'a-coruna': 'A Coruña', 'aguilas': 'Águilas', 'albacete': 'Albacete',
    'alcala-de-guadaira': 'Alcalá de Guadaíra', 'alcala-de-henares': 'Alcalá de Henares',
    'alcantarilla': 'Alcantarilla', 'alcobendas': 'Alcobendas', 'alcorcon': 'Alcorcón',
    'alcoy': 'Alcoy', 'algeciras': 'Algeciras', 'alicante': 'Alicante', 'alzira': 'Alzira',
    'aranjuez': 'Aranjuez', 'arganda-del-rey': 'Arganda del Rey', 'badajoz': 'Badajoz',
    'badalona': 'Badalona', 'barakaldo': 'Barakaldo', 'barcelona': 'Barcelona',
    'benalmadena': 'Benalmádena', 'benidorm': 'Benidorm', 'bilbao': 'Bilbao',
    'boadilla-del-monte': 'Boadilla del Monte', 'burgos': 'Burgos', 'caceres': 'Cáceres',
    'cadiz': 'Cádiz', 'caravaca-de-la-cruz': 'Caravaca de la Cruz', 'cartagena': 'Cartagena',
    'castelldefels': 'Castelldefels', 'castellon-de-la-plana': 'Castellón de la Plana',
    'cerdanyola-del-valles': 'Cerdanyola del Vallès', 'cieza': 'Cieza',
    'collado-villalba': 'Collado Villalba', 'cordoba': 'Córdoba',
    'cornella-de-llobregat': 'Cornellà de Llobregat', 'coslada': 'Coslada',
    'donostia-san-sebastian': 'Donostia-San Sebastián', 'dos-hermanas': 'Dos Hermanas',
    'el-prat-de-llobregat': 'El Prat de Llobregat', 'elche': 'Elche',
    'estepona': 'Estepona', 'fuengirola': 'Fuengirola', 'fuenlabrada': 'Fuenlabrada',
    'gandia': 'Gandia', 'getafe': 'Getafe', 'getxo': 'Getxo', 'gijon': 'Gijón',
    'girona': 'Girona', 'granada': 'Granada', 'granollers': 'Granollers', 'huelva': 'Huelva',
    'jaen': 'Jaén', 'jerez-de-la-frontera': 'Jerez de la Frontera', 'jumilla': 'Jumilla',
    'hospitalet-de-llobregat': "L'Hospitalet de Llobregat",
    'las-palmas-de-gran-canaria': 'Las Palmas de Gran Canaria',
    'las-rozas-de-madrid': 'Las Rozas de Madrid', 'leganes': 'Leganés', 'leon': 'León',
    'linares': 'Linares', 'lleida': 'Lleida', 'logrono': 'Logroño', 'lorca': 'Lorca',
    'madrid': 'Madrid', 'majadahonda': 'Majadahonda', 'malaga': 'Málaga',
    'manresa': 'Manresa', 'marbella': 'Marbella', 'mataro': 'Mataró',
    'mazarron': 'Mazarrón', 'mijas': 'Mijas', 'molina-de-segura': 'Molina de Segura',
    'mollet-del-valles': 'Mollet del Vallès', 'mostoles': 'Móstoles', 'murcia': 'Murcia',
    'orihuela': 'Orihuela', 'ourense': 'Ourense', 'oviedo': 'Oviedo', 'palma': 'Palma',
    'pamplona': 'Pamplona', 'parla': 'Parla', 'paterna': 'Paterna',
    'portugalete': 'Portugalete', 'pozuelo-de-alarcon': 'Pozuelo de Alarcón', 'reus': 'Reus',
    'rivas-vaciamadrid': 'Rivas-Vaciamadrid', 'rubi': 'Rubí', 'sabadell': 'Sabadell',
    'sagunto': 'Sagunto', 'salamanca': 'Salamanca',
    'san-cristobal-de-la-laguna': 'San Cristóbal de La Laguna',
    'san-javier': 'San Javier',
    'san-sebastian-de-los-reyes': 'San Sebastián de los Reyes',
    'san-vicente-del-raspeig': 'San Vicente del Raspeig',
    'sant-boi-de-llobregat': 'Sant Boi de Llobregat',
    'sant-cugat-del-valles': 'Sant Cugat del Vallès',
    'santa-coloma-de-gramenet': 'Santa Coloma de Gramenet',
    'santa-cruz-de-tenerife': 'Santa Cruz de Tenerife', 'santander': 'Santander',
    'santiago-de-compostela': 'Santiago de Compostela', 'sevilla': 'Sevilla',
    'talavera-de-la-reina': 'Talavera de la Reina', 'tarragona': 'Tarragona',
    'telde': 'Telde', 'terrassa': 'Terrassa', 'toledo': 'Toledo',
    'torrejon-de-ardoz': 'Torrejón de Ardoz', 'torremolinos': 'Torremolinos',
    'torrent': 'Torrent', 'torrevieja': 'Torrevieja', 'totana': 'Totana',
    'tres-cantos': 'Tres Cantos', 'valdemoro': 'Valdemoro', 'valencia': 'Valencia',
    'valladolid': 'Valladolid', 'velez-malaga': 'Vélez-Málaga', 'vigo': 'Vigo',
    'viladecans': 'Viladecans', 'vilanova-i-la-geltru': 'Vilanova i la Geltrú',
    'vitoria-gasteiz': 'Vitoria-Gasteiz', 'yecla': 'Yecla', 'zaragoza': 'Zaragoza',
  };
  if (map[slug.toLowerCase()]) return map[slug.toLowerCase()];
  // Genérico: capitalizar cada palabra separada por guiones
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Fallback: contenido desde datos estáticos cuando Supabase falla.
 * Soporta slugs tipo "abogados-{service}-{city}" para cualquier ciudad,
 * incluyendo ciudades multi-palabra como "alcala-de-henares".
 */
function getServiceContentFromStatic(slug: string): ServiceContent | null {
  // 1. Match exacto (Murcia)
  let svc = staticServices.find((s) => s.slugEs === slug || s.slugEn === slug);
  let cityName = 'Murcia';
  let citySlug = 'murcia';

  // 2. Parsear "abogados-{serviceKey}-{citySlug}" para otras ciudades.
  //    Recorremos los IDs de servicios estáticos y comprobamos si el slug
  //    empieza por "abogados-{id}-", de modo que el resto sea la ciudad
  //    (funciona con ciudades multi-palabra como "alcala-de-henares").
  if (!svc && slug.startsWith('abogados-')) {
    const rest = slug.slice(9); // quitar "abogados-"
    for (const s of staticServices) {
      const prefix = s.id + '-';
      if (rest.startsWith(prefix) && rest.length > prefix.length) {
        svc = s;
        citySlug = rest.slice(prefix.length);
        cityName = slugToCityName(citySlug);
        break;
      }
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
    customSectionsEs: null,
    titleEn: `${svc.nameEn} Lawyers in ${cityName} | GVC Lawyers`,
    metaDescriptionEn: svc.descriptionEn,
    shortDescriptionEn: svc.descriptionEn,
    longDescriptionEn: svc.longDescriptionEn?.replace(/Murcia/g, cityName) ?? null,
    sectionsEn: svc.sectionsEn,
    processEn: svc.processEn,
    faqsEn: svc.faqsEn,
    customSectionsEn: null,
  };
}

/**
 * Busca contenido de servicio por slug_es en Supabase.
 * Si falla, usa datos estáticos como fallback.
 */
export async function getServiceContentBySlug(slug: string): Promise<ServiceContent | null> {
  const { data, error } = await supabaseAdmin
    .from('service_content')
    .select(`
      id, service_id, locality_id, slug_es, slug_en,
      title_es, meta_description_es, short_description_es, long_description_es,
      sections_es, process_es, faqs_es, custom_sections_es,
      title_en, meta_description_en, short_description_en, long_description_en,
      sections_en, process_en, faqs_en, custom_sections_en,
      services!inner ( service_key, name_es, name_en ),
      localities!inner ( name, slug )
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
    customSectionsEs: (data.custom_sections_es as any) || null,
    titleEn: data.title_en,
    metaDescriptionEn: data.meta_description_en,
    shortDescriptionEn: data.short_description_en,
    longDescriptionEn: data.long_description_en,
    sectionsEn: (data.sections_en as any) || null,
    processEn: (data.process_en as any) || null,
    faqsEn: (data.faqs_en as any) || null,
    customSectionsEn: (data.custom_sections_en as any) || null,
  };
}

/**
 * Busca contenido por service_key + locality_slug (para la nueva ruta /servicios/[slug]/[ciudad]).
 */
export async function getServiceContentByServiceAndCity(
  serviceKey: string,
  citySlug: string
): Promise<ServiceContent | null> {
  const { data, error } = await supabaseAdmin
    .from('service_content')
    .select(`
      id, service_id, locality_id, slug_es, slug_en,
      title_es, meta_description_es, short_description_es, long_description_es,
      sections_es, process_es, faqs_es, custom_sections_es,
      title_en, meta_description_en, short_description_en, long_description_en,
      sections_en, process_en, faqs_en, custom_sections_en,
      services!inner ( service_key, name_es, name_en ),
      localities!inner ( name, slug )
    `)
    .eq('services.service_key', serviceKey)
    .eq('localities.slug', citySlug)
    .maybeSingle();

  if (error || !data) {
    const legacySlug = `abogados-${serviceKey}-${citySlug}`;
    return getServiceContentFromStatic(legacySlug);
  }

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
    customSectionsEs: (data.custom_sections_es as any) || null,
    titleEn: data.title_en,
    metaDescriptionEn: data.meta_description_en,
    shortDescriptionEn: data.short_description_en,
    longDescriptionEn: data.long_description_en,
    sectionsEn: (data.sections_en as any) || null,
    processEn: (data.process_en as any) || null,
    faqsEn: (data.faqs_en as any) || null,
    customSectionsEn: (data.custom_sections_en as any) || null,
  };
}

/**
 * Obtiene todas las combinaciones servicio+ciudad para generateStaticParams de [slug]/[ciudad].
 */
export async function getAllServiceCityParams(): Promise<{ slug: string; ciudad: string }[]> {
  const { data, error } = await supabaseAdmin
    .from('service_content')
    .select('services!inner(service_key), localities!inner(slug)')
    .order('slug_es');

  if (error || !data || data.length === 0) {
    return staticServices.map((s) => ({ slug: s.genericSlugEs, ciudad: 'murcia' }));
  }

  return data.map((row: any) => ({
    slug: staticServices.find(s => s.id === row.services.service_key)?.genericSlugEs || row.services.service_key,
    ciudad: row.localities.slug,
  }));
}

/**
 * Obtiene todos los slugs_es activos desde Supabase para generateStaticParams.
 * Si Supabase falla, usa slugs de datos estáticos como fallback.
 */
export async function getAllServiceContentSlugs(): Promise<{ slug: string }[]> {
  const { data, error } = await supabaseAdmin
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
