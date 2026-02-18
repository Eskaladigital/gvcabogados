'use client';

import { useState } from 'react';
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

  const topServices = services.filter((s) => s.priority === 1);
  const otherServices = services.filter((s) => s.priority > 1);
  const [showAll, setShowAll] = useState(false);

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

        {/* Top 5 servicios destacados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {topServices.map((service) => (
            <Link
              key={service.id}
              href={`${prefix}/${servicesPath}/${service.slug}`}
              className="reveal group relative bg-brand-dark rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute top-3 right-3">
                <span className="inline-block bg-brand-gold/20 text-brand-gold text-[0.55rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {locale === 'es' ? 'Más solicitado' : 'Most requested'}
                </span>
              </div>
              <div className="text-3xl mb-4">{service.icon}</div>
              <h3 className="text-base font-semibold text-white mb-2 group-hover:text-brand-gold transition-colors">
                {service.name}
              </h3>
              <p className="text-[0.72rem] text-neutral-400 leading-relaxed mb-4">
                {service.description}
              </p>
              <span className="text-[0.7rem] font-semibold text-brand-gold group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                {locale === 'es' ? 'Consultar' : 'Learn more'} →
              </span>
            </Link>
          ))}
        </div>

        {/* Resto de servicios */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            showAll ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-brand-dark/10">
            {otherServices.map((service, index) => (
              <Link
                key={service.id}
                href={`${prefix}/${servicesPath}/${service.slug}`}
                className="reveal border-b border-brand-dark/10 py-5 md:py-6 flex items-center justify-between pr-8 group hover:pl-4 hover:bg-brand-dark/5 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl">{service.icon}</span>
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

        {/* Botón ver más / ver menos */}
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 text-[0.75rem] font-semibold text-brand-dark/80 hover:text-brand-dark transition-colors py-2 px-4 border border-brand-dark/20 rounded-full hover:border-brand-dark/40"
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
