import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Shield } from 'lucide-react';
import CityServicePage from '@/components/content/CityServicePage';
import { getServiceContentByServiceAndCity } from '@/lib/service-content';
import { supabaseAdmin } from '@/lib/supabase';

const SERVICE_KEY = 'responsabilidad-civil';
const SERVICE_NAME_EN = 'Civil Liability & Insurance';
const FOLDER_SLUG_EN = 'civil-liability';
const FOLDER_SLUG_ES = 'responsabilidad-civil';

interface Props {
  params: { city: string };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const { data } = await supabaseAdmin
    .from('service_content')
    .select('localities!inner(slug), services!inner(service_key)')
    .eq('services.service_key', SERVICE_KEY);

  if (!data || data.length === 0) return [{ city: 'murcia' }];
  return data.map((row: any) => ({ city: row.localities.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getServiceContentByServiceAndCity(SERVICE_KEY, params.city);
  if (!content) return {};

  const title = content.titleEn || `${SERVICE_NAME_EN} in ${content.localityName} — GVC Lawyers`;
  const description = content.metaDescriptionEn || content.shortDescriptionEn || '';

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.gvcabogados.com/en/services/${FOLDER_SLUG_EN}/${params.city}`,
      languages: { es: `/es/servicios/${FOLDER_SLUG_ES}/${params.city}` },
    },
    openGraph: { title, description, locale: 'en_GB', type: 'website' },
  };
}

export default async function Page({ params }: Props) {
  const content = await getServiceContentByServiceAndCity(SERVICE_KEY, params.city);
  if (!content) notFound();

  return (
    <CityServicePage
      content={content}
      serviceNameEs="Responsabilidad Civil y Seguros"
      serviceNameEn={SERVICE_NAME_EN}
      folderSlug={FOLDER_SLUG_ES}
      folderSlugEn={FOLDER_SLUG_EN}
      icon={<Shield size={32} className="text-white flex-shrink-0" />}
      locale="en"
    />
  );
}
