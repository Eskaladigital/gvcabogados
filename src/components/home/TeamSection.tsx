import Image from 'next/image';
import { getTranslations, Locale } from '@/data/translations';
import { getTeamByLocale } from '@/data/team';
import Link from 'next/link';

interface TeamSectionProps {
  locale: Locale;
}

export default function TeamSection({ locale }: TeamSectionProps) {
  const t = getTranslations(locale);
  const members = getTeamByLocale(locale).filter((m) => m.isLawyer && (m.isFounder || m.roleEs === 'Socio' || m.roleEs === 'Socia'));
  const prefix = `/${locale}`;

  return (
    <section className="py-14 md:py-20 bg-white border-b border-neutral-200">
      <div className="container-custom">
        <div className="flex justify-between items-baseline mb-10 md:mb-12">
          <h2 className="section-title">{t.team.title}</h2>
          <Link
            href={`${prefix}/equipo`}
            className="hidden md:flex items-center gap-1.5 text-[0.72rem] font-semibold text-brand-brown hover:gap-2.5 transition-all"
          >
            {t.team.viewAll} →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="reveal group bg-white border border-neutral-200 overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-brand-brown"
            >
              {/* Photo */}
              <div className="aspect-[3/4] relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-brand-dark2 to-brand-dark3">
                {/* Placeholder de fondo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl text-white/10 font-serif font-bold">
                    {member.name.split(' ')[0][0]}
                  </span>
                </div>
                {/* Imagen real */}
                <div className="absolute inset-0">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-brand-dark/70 to-transparent z-[2]" />
                {/* Badge con León */}
                <div className="absolute top-4 right-4 w-11 h-11 bg-brand-brown-hover rounded-full flex items-center justify-center z-[3] border-2 border-white/20 group-hover:scale-110 transition-transform shadow-lg">
                  <div className="w-6 h-6 relative">
                    <Image
                      src="/images/logo/gvcabogados_murcia_logo_leon_blanco.webp"
                      alt="León"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="font-serif text-base font-semibold text-brand-dark mb-1">{member.name}</div>
                <div className="text-[0.65rem] font-semibold text-brand-brown uppercase tracking-[0.08em] mb-2">
                  {member.role}
                </div>
                <p className="text-[0.75rem] text-neutral-400 leading-relaxed">{member.bio}</p>
              </div>

              {/* Hover bar */}
              <div className="h-[3px] bg-gradient-to-r from-brand-brown to-brand-gold w-0 group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>

        <Link
          href={`${prefix}/equipo`}
          className="md:hidden inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-brand-brown mt-6 hover:gap-2.5 transition-all"
        >
          {t.team.viewAll} →
        </Link>
      </div>
    </section>
  );
}
