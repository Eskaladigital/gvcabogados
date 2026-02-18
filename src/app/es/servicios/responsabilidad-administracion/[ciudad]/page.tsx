import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Landmark } from 'lucide-react';
import CityServicePage from '@/components/content/CityServicePage';
import { getServiceContentByServiceAndCity } from '@/lib/service-content';
import { supabaseAdmin } from '@/lib/supabase';

const SERVICE_KEY = 'derecho-administrativo';
const SERVICE_NAME = 'Responsabilidad de la Administración';
const FOLDER_SLUG = 'responsabilidad-administracion';

interface Props {
  params: { ciudad: string };
}

export async function generateStaticParams() {
  const { data } = await supabaseAdmin
    .from('service_content')
    .select('localities!inner(slug), services!inner(service_key)')
    .eq('services.service_key', SERVICE_KEY);

  if (!data || data.length === 0) return [{ ciudad: 'murcia' }];
  return data.map((row: any) => ({ ciudad: row.localities.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getServiceContentByServiceAndCity(SERVICE_KEY, params.ciudad);
  if (!content) return {};

  const title = content.titleEs || `${SERVICE_NAME} en ${content.localityName} — GVC Abogados`;
  const description = content.metaDescriptionEs || content.shortDescriptionEs || '';

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.gvcabogados.com/es/servicios/${FOLDER_SLUG}/${params.ciudad}`,
      languages: { en: `/en/services/administrative-law/${params.ciudad}` },
    },
    openGraph: { title, description, locale: 'es_ES', type: 'website' },
  };
}

export default async function Page({ params }: Props) {
  const content = await getServiceContentByServiceAndCity(SERVICE_KEY, params.ciudad);
  if (!content) notFound();

  return (
    <CityServicePage
      content={content}
      serviceNameEs={SERVICE_NAME}
      folderSlug={FOLDER_SLUG}
      icon={<Landmark size={32} className="text-white flex-shrink-0" />}
    />
  );
}
