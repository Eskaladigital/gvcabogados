import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Stethoscope } from 'lucide-react';
import CityServicePage from '@/components/content/CityServicePage';
import { getServiceContentByServiceAndCity } from '@/lib/service-content';
import { supabaseAdmin } from '@/lib/supabase';

const SERVICE_KEY = 'negligencias-medicas';
const SERVICE_NAME_EN = 'Medical Malpractice';
const FOLDER_SLUG_EN = 'medical-malpractice';
const FOLDER_SLUG_ES = 'negligencias-medicas';

interface Props {
  params: { city: string };
}

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
      serviceNameEs="Negligencias Médicas"
      serviceNameEn={SERVICE_NAME_EN}
      folderSlug={FOLDER_SLUG_ES}
      folderSlugEn={FOLDER_SLUG_EN}
      icon={<Stethoscope size={32} className="text-white flex-shrink-0" />}
      locale="en"
    />
  );
}
