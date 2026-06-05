import Image from 'next/image';
import { Locale } from '@/data/translations';

interface AnavaMembershipProps {
  locale: Locale;
  variant?: 'banner' | 'compact';
}

const copy = {
  es: {
    label: 'Reconocimiento profesional',
    title: 'Miembro de ANAVA-RC',
    subtitle:
      'Asociación Nacional de Abogados de Víctimas de Accidentes y Responsabilidad Civil',
    description:
      'García-Valcárcel & Cáceres forma parte de ANAVA-RC, la asociación que reúne a los abogados especialistas en la defensa de víctimas de accidentes y responsabilidad civil en toda España. Una garantía más de especialización y compromiso con cada cliente.',
    link: 'Conocer ANAVA-RC',
    compactTitle: 'Miembro de ANAVA-RC',
    compactSubtitle: 'Abogados especialistas en Responsabilidad Civil',
  },
  en: {
    label: 'Professional recognition',
    title: 'Member of ANAVA-RC',
    subtitle:
      'Spanish National Association of Lawyers for Victims of Accidents and Civil Liability',
    description:
      'García-Valcárcel & Cáceres is a member of ANAVA-RC, the association that brings together lawyers specialized in defending victims of accidents and civil liability throughout Spain. Another guarantee of expertise and commitment to every client.',
    link: 'Discover ANAVA-RC',
    compactTitle: 'Member of ANAVA-RC',
    compactSubtitle: 'Specialist lawyers in Civil Liability',
  },
};

const SEAL_SRC = '/images/logo/anava-rc-sello.png';
const SEAL_ALT =
  'Sello ANAVA-RC — Abogado especialista en Responsabilidad Civil';
const ANAVA_URL = 'https://anavarc.org/';

export default function AnavaMembership({ locale, variant = 'banner' }: AnavaMembershipProps) {
  const t = copy[locale];

  if (variant === 'compact') {
    return (
      <a
        href={ANAVA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 max-w-[280px]"
        aria-label={`${t.compactTitle} — ${t.compactSubtitle}`}
      >
        <div className="w-16 h-16 relative shrink-0">
          <Image src={SEAL_SRC} alt={SEAL_ALT} fill className="object-contain" sizes="64px" />
        </div>
        <div className="leading-tight">
          <span className="block text-[0.78rem] font-semibold text-brand-dark group-hover:text-brand-dark/70 transition-colors">
            {t.compactTitle}
          </span>
          <span className="block text-[0.68rem] text-brand-dark/70">{t.compactSubtitle}</span>
        </div>
      </a>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-neutral-50 border-y border-neutral-200">
      <div className="container-custom">
        <div className="reveal grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
          {/* Sello */}
          <div className="flex justify-center md:justify-start">
            <div className="w-40 h-40 md:w-48 md:h-48 relative">
              <Image
                src={SEAL_SRC}
                alt={SEAL_ALT}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 160px, 192px"
              />
            </div>
          </div>

          {/* Texto */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <span className="w-8 h-0.5 bg-brand-brown" />
              <span className="text-[0.7rem] font-semibold text-brand-brown tracking-[0.18em] uppercase">
                {t.label}
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark mb-2">
              {t.title}
            </h2>
            <p className="text-sm font-medium text-brand-brown mb-4">{t.subtitle}</p>
            <p className="text-sm text-brand-dark/70 leading-relaxed max-w-[620px] mx-auto md:mx-0">
              {t.description}
            </p>
            <a
              href={ANAVA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-brand-brown mt-5 hover:gap-2.5 transition-all"
            >
              {t.link} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
