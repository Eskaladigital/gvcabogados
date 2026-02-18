import Link from 'next/link';
import { Locale } from '@/data/translations';
import { Car, Users, Clipboard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CTAItem {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  href: string;
  phone: boolean;
}

const ctas: Record<string, CTAItem[]> = {
  es: [
    {
      icon: Car,
      title: '¿Ha tenido un accidente?',
      description: 'Gestionamos su reclamación y luchamos por la máxima indemnización. Sin cobrar si no ganamos.',
      cta: 'Llámenos ahora',
      href: '/es/contacto',
      phone: true,
    },
    {
      icon: Users,
      title: 'Divorcios y custodia',
      description: 'Divorcio de mutuo acuerdo desde 4 semanas. Custodia, pensiones y mediación familiar.',
      cta: 'Consulta gratuita',
      href: '/es/servicios/abogados-derecho-familia-murcia',
      phone: false,
    },
    {
      icon: Clipboard,
      title: 'Extranjería e inmigración',
      description: 'Arraigo, residencia, nacionalidad y recursos. Trámites llave en mano con atención personalizada.',
      cta: 'Solicitar cita',
      href: '/es/servicios/abogados-extranjeria-murcia',
      phone: false,
    },
  ],
  en: [
    {
      icon: Car,
      title: 'Had an accident?',
      description: 'We handle your claim and fight for maximum compensation. No win, no fee.',
      cta: 'Call us now',
      href: '/en/contact',
      phone: true,
    },
    {
      icon: Users,
      title: 'Divorce & custody',
      description: 'Amicable divorce from 4 weeks. Custody, support and family mediation.',
      cta: 'Free consultation',
      href: '/en/services/family-law-lawyers-murcia',
      phone: false,
    },
    {
      icon: Clipboard,
      title: 'Immigration law',
      description: 'Residence permits, nationality, visas and appeals. Turnkey process with personalized support.',
      cta: 'Book appointment',
      href: '/en/services/immigration-lawyers-murcia',
      phone: false,
    },
  ],
};

export default function StrategicCTAs({ locale }: { locale: Locale }) {
  const items = ctas[locale];

  return (
    <section className="py-10 md:py-14 bg-white border-y border-neutral-200">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="reveal group bg-neutral-50 border border-neutral-200 p-6 md:p-7 flex flex-col hover:border-brand-brown transition-colors"
              >
                <div className="mb-3">
                  <Icon size={28} className="text-brand-dark" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-brand-dark mb-2">{item.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-5 flex-1">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.phone && (
                    <a
                      href="tel:+34968241025"
                      className="inline-flex items-center gap-1.5 bg-brand-brown-hover text-white text-[0.75rem] font-semibold px-4 py-2.5 hover:bg-brand-dark transition-colors"
                    >
                      ☎ 968 241 025
                    </a>
                  )}
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 text-[0.75rem] font-semibold px-4 py-2.5 transition-colors ${
                      item.phone
                        ? 'border border-neutral-300 text-brand-dark hover:border-brand-brown hover:text-brand-brown'
                        : 'bg-brand-brown-hover text-white hover:bg-brand-dark'
                    }`}
                  >
                    {item.cta} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
