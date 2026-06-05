import { Locale } from '@/data/translations';
import { getOfficeMapEmbedUrl, OFFICE_LOCATION } from '@/lib/site-config';

interface OfficeMapProps {
  locale: Locale;
}

export default function OfficeMap({ locale }: OfficeMapProps) {
  const title =
    locale === 'es'
      ? `${OFFICE_LOCATION.name} — Abogados en Murcia — Gran Vía 15`
      : `${OFFICE_LOCATION.name} — Lawyers in Murcia — Gran Vía 15`;

  return (
    <section className="border-t border-neutral-200" aria-label={title}>
      <iframe
        src={getOfficeMapEmbedUrl(locale)}
        className="w-full h-[400px] md:h-[450px] border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      />
    </section>
  );
}
