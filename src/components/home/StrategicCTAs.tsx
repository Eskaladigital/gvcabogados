import Link from 'next/link';
import { Locale } from '@/data/translations';

interface StrategicCTAsProps {
  locale: Locale;
}

const ctas = {
  es: [
    {
      icon: '🚗',
      title: '¿Ha tenido un accidente?',
      description: 'Gestionamos su reclamación y luchamos por la máxima indemnización. Sin cobrar si no ganamos.',
      cta: 'Llámenos ahora',
      href: '/es/contacto',
      phone: true,
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Divorcios y custodia',
      description: 'Divorcio de mutuo acuerdo desde 4 semanas. Custodia, pensiones y mediación familiar.',
      cta: 'Consulta gratuita',
      href: '/es/servicios/abogados-derecho-familia-murcia',
      phone: false,
    },
    {
      icon: '🌍',
      title: 'Extranjería e inmigración',
      description: 'Arraigo, residencia, nacionalidad y recursos. Trámites llave en mano con atención personalizada.',
      cta: 'Solicitar cita',
      href: '/es/servicios/abogados-extranjeria-murcia',
      phone: false,
    },
  ],
  en: [
    {
      icon: '🚗',
      title: 'Had an accident?',
      description: 'We handle your claim and fight for maximum compensation. No win, no fee.',
      cta: 'Call us now',
      href: '/en/contact',
      phone: true,
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Divorce & custody',
      description: 'Amicable divorce from 4 weeks. Custody, support and family mediation.',
      cta: 'Free consultation',
      href: '/en/services/family-law-lawyers-murcia',
      phone: false,
    },
    {
      icon: '🌍',
      title: 'Immigration law',
      description: 'Residence permits, nationality, visas and appeals. Turnkey process with personalized support.',
      cta: 'Book appointment',
      href: '/en/services/immigration-lawyers-murcia',
      phone: false,
    },
  ],
};

export default function StrategicCTAs({ locale }: StrategicCTAsProps) {
  const items = ctas[locale];

  return (
    <section className="py-10 md:py-14 bg-brand-dark">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="reveal group bg-brand-dark2 border border-brand-dark3 rounded-2xl p-6 md:p-7 flex flex-col hover:border-brand-brown/40 transition-colors"
            >
              <span className="text-3xl mb-3">{item.icon}</span>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-[0.78rem] text-neutral-400 leading-relaxed mb-5 flex-1">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.phone && (
                  <a
                    href="tel:+34968241025"
                    className="inline-flex items-center gap-1.5 bg-brand-brown text-brand-dark text-[0.75rem] font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-gold transition-colors"
                  >
                    ☎ 968 241 025
                  </a>
                )}
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 text-[0.75rem] font-semibold px-4 py-2.5 rounded-lg transition-colors ${
                    item.phone
                      ? 'border border-white/20 text-white hover:bg-white/10'
                      : 'bg-brand-brown text-brand-dark hover:bg-brand-gold'
                  }`}
                >
                  {item.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
