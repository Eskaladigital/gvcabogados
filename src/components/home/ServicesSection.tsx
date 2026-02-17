import Link from 'next/link';
import { getTranslations, Locale } from '@/data/translations';
import { getServicesByLocale } from '@/data/services';

interface ServicesSectionProps {
  locale: Locale;
}

export default function ServicesSection({ locale }: ServicesSectionProps) {
  const t = getTranslations(locale);
  const services = getServicesByLocale(locale);
  const prefix = `/${locale}`;
  const servicesPath = locale === 'es' ? 'servicios' : 'services';

  return (
    <section className="py-12 md:py-20 bg-brand-brown text-brand-dark">
      <div className="container-custom">
        <div className="reveal mb-10 md:mb-12">
          <div className="section-tag">{t.services.tag}</div>
          <h2 className="section-title">
            {locale === 'es'
              ? 'Áreas de práctica: abogados especializados en Murcia'
              : 'Practice areas: specialist lawyers in Murcia'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`${prefix}/${servicesPath}/${service.slug}`}
              className="reveal border-t border-brand-dark/10 py-5 md:py-6 flex items-center justify-between pr-8 group hover:pl-4 hover:bg-brand-dark/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <span className="text-[0.6rem] font-semibold text-brand-dark/80 w-5">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-sm font-medium text-brand-dark group-hover:text-brand-brown-hover transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-[0.72rem] text-brand-dark/80 mt-0.5">{service.description}</p>
                </div>
              </div>
              <span className="text-sm text-brand-dark/60 group-hover:text-brand-brown-hover group-hover:translate-x-1 transition-all">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
