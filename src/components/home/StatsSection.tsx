import { getTranslations, Locale } from '@/data/translations';

interface StatsSectionProps {
  locale: Locale;
}

export default function StatsSection({ locale }: StatsSectionProps) {
  const t = getTranslations(locale);

  const stats = [
    t.hero.stats.years,
    t.hero.stats.cases,
    t.hero.stats.success,
    t.hero.stats.team,
  ];

  return (
    <section className="py-10 md:py-14 bg-brand-brown text-brand-dark">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 text-center">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="reveal px-4 md:px-6 md:border-r md:border-brand-dark/15 md:last:border-r-0"
            >
              <div className="font-display text-3xl md:text-5xl font-bold leading-none">
                {stat.value}
              </div>
              <div className="text-[0.6rem] uppercase tracking-[0.12em] text-brand-dark/70 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
