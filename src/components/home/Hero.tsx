import Link from 'next/link';
import Image from 'next/image';
import { getTranslations, Locale } from '@/data/translations';

interface HeroProps {
  locale: Locale;
}

export default function Hero({ locale }: HeroProps) {
  const t = getTranslations(locale);
  const prefix = `/${locale}`;

  return (
    <section className="bg-[#1a1a1a] relative overflow-hidden min-h-[85vh] flex flex-col">
      {/* Background image */}
      <div className="absolute inset-0 opacity-30 z-0">
        <Image
          src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={60}
        />
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(26,26,26,0.6)] via-[rgba(30,30,30,0.3)] to-[rgba(26,26,26,0.5)] z-[1]" />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] z-[1]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="container-custom relative z-[2] flex-1 flex items-center py-14 md:py-20">
        <div className="max-w-[720px] w-full">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="w-9 h-0.5 bg-brand-brown" />
            <span className="text-[0.7rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
              {t.hero.tag}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[4.2rem] font-bold text-white leading-[1.15] mb-5 md:mb-6">
            {t.hero.title}{' '}
            <em className="italic text-brand-gold font-normal">{t.hero.titleHighlight}</em>
          </h1>

          <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[560px]">
            {t.hero.description}
          </p>

          <div className="flex gap-3 md:gap-4 items-center flex-wrap">
            <Link href={locale === 'es' ? `${prefix}/contacto` : `${prefix}/contact`} className="btn-primary">
              {t.hero.ctaPrimary} →
            </Link>
            <Link href={locale === 'es' ? `${prefix}/servicios` : `${prefix}/services`} className="btn-outline">
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar - siempre al pie */}
      <div className="relative z-[3] bg-brand-brown/90 backdrop-blur-sm border-t border-brand-dark/10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {[
              t.hero.stats.years,
              t.hero.stats.cases,
              t.hero.stats.success,
              t.hero.stats.team,
            ].map((stat, i) => (
              <div
                key={i}
                className="py-5 md:py-6 px-4 md:px-8 text-center border-r border-brand-dark/10 last:border-r-0 border-b md:border-b-0 border-brand-dark/10 hover:bg-brand-dark/5 transition-colors"
              >
                <div className="font-display text-2xl md:text-3xl font-bold text-brand-dark leading-none mb-1.5">
                  {stat.value}
                </div>
                <div className="text-[0.6rem] md:text-[0.65rem] text-brand-dark/70 uppercase tracking-[0.12em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
