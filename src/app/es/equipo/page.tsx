import { Metadata } from 'next';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/SchemaOrg';
import { getTeamByLocale } from '@/data/team';
import { getTranslations } from '@/data/translations';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Equipo — Abogados Profesionales en Murcia | García-Valcárcel & Cáceres',
  description:
    'Conozca a los abogados de García-Valcárcel & Cáceres en Murcia. 5 profesionales especializados con décadas de experiencia en derecho privado y público.',
  alternates: {
    canonical: 'https://www.gvcabogados.com/es/equipo',
    languages: { en: '/en/team' },
  },
  openGraph: {
    title: 'Nuestro Equipo de Abogados en Murcia',
    description: '5 profesionales especializados en García-Valcárcel & Cáceres.',
    locale: 'es_ES',
  },
};

export default function EquipoPage() {
  const locale = 'es';
  const t = getTranslations(locale);
  const members = getTeamByLocale(locale);

  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: 'Equipo', href: '/es/equipo' },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar locale={locale} />
      <main>
        <section className="bg-brand-dark py-20 md:py-28 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
          <div className="container-custom relative z-10">
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-[700px] mt-4">
              Nuestro equipo de{' '}
              <em className="italic text-brand-gold font-normal">abogados en Murcia</em>
            </h1>
            <p className="text-neutral-300 text-base mt-4 max-w-[560px]">
              {t.team.description} Cada miembro aporta su especialización para cubrir todas las áreas
              del derecho que nuestros clientes necesitan.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member) => (
                <article
                  key={member.id}
                  className="reveal group bg-white border border-neutral-200 overflow-hidden rounded-2xl hover:-translate-y-1 hover:shadow-lg hover:border-brand-brown transition-all duration-500"
                >
                  <div className="aspect-[3/4] relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-brand-dark2 to-brand-dark3">
                    {/* Placeholder de fondo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl text-white/10 font-serif font-bold">
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
                    <div className="absolute top-4 right-4 w-11 h-11 bg-brand-brown-hover rounded-full flex items-center justify-center z-[3] border-2 border-white/20 shadow-lg">
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
                  <div className="p-6">
                    <h2 className="font-serif text-lg font-semibold text-brand-dark mb-1">
                      {member.name}
                    </h2>
                    <div className="text-[0.65rem] font-semibold text-brand-brown uppercase tracking-[0.08em] mb-3">
                      {member.role}
                    </div>
                    <p className="text-[0.8rem] text-brand-dark/70 leading-relaxed">{member.bio}</p>
                  </div>
                  <div className="h-[3px] bg-gradient-to-r from-brand-brown to-brand-gold w-0 group-hover:w-full transition-all duration-500" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 bg-brand-brown-hover text-white">
          <div className="container-custom text-center max-w-[600px]">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
              ¿Quiere conocernos personalmente?
            </h2>
            <p className="text-sm text-white/90 leading-relaxed mb-8">
              Solicite una consulta y nuestro equipo evaluará su caso sin compromiso.
            </p>
            <Link href="/es/contacto" className="inline-flex items-center gap-2 bg-brand-brown text-white text-xs font-semibold px-6 py-3 tracking-wide transition-all duration-300 border-none cursor-pointer hover:bg-brand-brown/90 hover:-translate-y-0.5 hover:shadow-lg">
              Contactar →
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <ScrollReveal />
    </>
  );
}
