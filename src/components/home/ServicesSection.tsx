'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getTranslations, Locale } from '@/data/translations';
import { getServicesByLocale } from '@/data/services';
import {
  Car, Users, Building2, Scale, Home, FileText, Briefcase,
  Shield, Clipboard, Handshake, Landmark, Stethoscope,
} from 'lucide-react';

const getServiceIcon = (serviceId: string) => {
  const iconProps = { size: 28, className: 'text-brand-dark flex-shrink-0' };
  switch (serviceId) {
    case 'accidentes-trafico': return <Car {...iconProps} />;
    case 'derecho-familia': return <Users {...iconProps} />;
    case 'derecho-bancario': return <Building2 {...iconProps} />;
    case 'derecho-penal': return <Scale {...iconProps} />;
    case 'derecho-inmobiliario': return <Home {...iconProps} />;
    case 'derecho-sucesorio': return <FileText {...iconProps} />;
    case 'derecho-mercantil': return <Briefcase {...iconProps} />;
    case 'responsabilidad-civil': return <Shield {...iconProps} />;
    case 'extranjeria': return <Clipboard {...iconProps} />;
    case 'mediacion': return <Handshake {...iconProps} />;
    case 'obligaciones-contratos': return <FileText {...iconProps} />;
    case 'derecho-administrativo': return <Landmark {...iconProps} />;
    case 'defensa-fondos-buitre': return <Shield {...iconProps} />;
    case 'negligencias-medicas': return <Stethoscope {...iconProps} />;
    default: return null;
  }
};

interface ServicesSectionProps {
  locale: Locale;
}

export default function ServicesSection({ locale }: ServicesSectionProps) {
  const t = getTranslations(locale);
  const services = getServicesByLocale(locale);
  const prefix = `/${locale}`;
  const servicesPath = locale === 'es' ? 'servicios' : 'services';

  const topServices = services.filter((s) => s.priority === 1);
  const otherServices = services.filter((s) => s.priority > 1);
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="py-12 md:py-20 bg-neutral-50">
      <div className="container-custom">
        <div className="reveal mb-10 md:mb-12">
          <div className="section-tag">{t.services.tag}</div>
          <h2 className="section-title">
            {locale === 'es'
              ? 'Áreas de práctica: abogados especializados en Murcia'
              : 'Practice areas: specialist lawyers in Murcia'}
          </h2>
        </div>

        {/* Servicios destacados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {topServices.map((service) => (
            <Link
              key={service.id}
              href={`${prefix}/${servicesPath}/${service.slug}`}
              className="reveal group relative bg-white border border-neutral-200 p-6 hover:border-brand-brown hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-3 right-3">
                <span className="inline-block bg-brand-brown/10 text-brand-brown text-[0.55rem] font-bold uppercase tracking-wider px-2 py-0.5">
                  {locale === 'es' ? 'Más solicitado' : 'Most requested'}
                </span>
              </div>
              <div className="mb-3">{getServiceIcon(service.id)}</div>
              <h3 className="font-serif text-base font-semibold text-brand-dark mb-2 group-hover:text-brand-brown transition-colors">
                {service.name}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                {service.description}
              </p>
              <span className="text-[0.7rem] font-semibold text-brand-brown opacity-0 group-hover:opacity-100 transition-opacity">
                {locale === 'es' ? 'Ver más' : 'Learn more'} →
              </span>
            </Link>
          ))}
        </div>

        {/* Resto de servicios (colapsable) */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            showAll ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherServices.map((service) => (
              <Link
                key={service.id}
                href={`${prefix}/${servicesPath}/${service.slug}`}
                className="reveal group bg-white border border-neutral-200 p-6 hover:border-brand-brown hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-3">{getServiceIcon(service.id)}</div>
                <h3 className="font-serif text-sm font-semibold text-brand-dark mb-1 group-hover:text-brand-brown transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                  {service.description}
                </p>
                <span className="text-[0.7rem] font-semibold text-brand-brown opacity-0 group-hover:opacity-100 transition-opacity">
                  {locale === 'es' ? 'Ver más' : 'Learn more'} →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Botón ver más / ver menos */}
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 text-[0.75rem] font-semibold text-brand-dark/70 hover:text-brand-dark transition-colors py-2 px-4 border border-neutral-300 hover:border-brand-brown"
          >
            {showAll
              ? (locale === 'es' ? 'Ver menos' : 'Show less')
              : (locale === 'es' ? `Ver las ${otherServices.length} áreas restantes` : `View all ${otherServices.length} remaining areas`)}
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
