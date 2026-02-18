import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Car, Users, Building2, Scale, Home, FileText, 
  Briefcase, Shield, Clipboard, Handshake, 
  Landmark, Stethoscope 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/SchemaOrg';
import { getTranslations } from '@/data/translations';
import { getServicesByLocale } from '@/data/services';

export const metadata: Metadata = {
  title: 'Áreas de Práctica — Abogados Especializados en Murcia | GVC Abogados',
  description:
    'Servicios jurídicos especializados en Murcia. Especialistas en responsabilidad civil: accidentes de tráfico, negligencias médicas, accidentes laborales y responsabilidad frente a la Administración. Más de 75 años de experiencia.',
  alternates: {
    canonical: 'https://www.gvcabogados.com/es/servicios',
    languages: { en: '/en/services' },
  },
  openGraph: {
    title: 'Áreas de Práctica — Abogados Especializados en Murcia',
    description: 'Servicios jurídicos especializados en Murcia. Especialistas en responsabilidad civil. Más de 75 años de experiencia.',
    locale: 'es_ES',
  },
};

export default function ServiciosPage() {
  const locale = 'es';
  const t = getTranslations(locale);
  const services = getServicesByLocale(locale);

  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: 'Áreas de Práctica', href: '/es/servicios' },
  ];

  const getServiceIcon = (serviceId: string) => {
    const iconProps = { size: 28, className: 'text-brand-dark flex-shrink-0' };
    switch (serviceId) {
      case 'accidentes-trafico':
        return <Car {...iconProps} />;
      case 'derecho-familia':
        return <Users {...iconProps} />;
      case 'derecho-bancario':
        return <Building2 {...iconProps} />;
      case 'derecho-penal':
        return <Scale {...iconProps} />;
      case 'derecho-inmobiliario':
        return <Home {...iconProps} />;
      case 'derecho-sucesorio':
        return <FileText {...iconProps} />;
      case 'derecho-mercantil':
        return <Briefcase {...iconProps} />;
      case 'responsabilidad-civil':
        return <Shield {...iconProps} />;
      case 'extranjeria':
        return <Clipboard {...iconProps} />;
      case 'mediacion':
        return <Handshake {...iconProps} />;
      case 'obligaciones-contratos':
        return <FileText {...iconProps} />;
      case 'derecho-administrativo':
        return <Landmark {...iconProps} />;
      case 'defensa-fondos-buitre':
        return <Shield {...iconProps} />;
      case 'negligencias-medicas':
        return <Stethoscope {...iconProps} />;
      default:
        return null;
    }
  };

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
              Abogados especializados{' '}
              <em className="italic text-brand-gold font-normal">en Murcia</em>: áreas de práctica
            </h1>
            <p className="text-neutral-300 text-base mt-4 max-w-[560px]">
              Nuestro equipo multidisciplinar cubre todas las áreas del derecho privado y público,
              ofreciendo soluciones integrales con más de 75 años de experiencia.
            </p>
          </div>
        </section>

        {/* Servicios destacados */}
        <section className="py-12 md:py-20">
          <div className="container-custom">
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-brand-dark mb-2">
              Áreas <span className="text-brand-brown">destacadas</span>
            </h2>
            <p className="text-sm text-neutral-500 mb-8">Los servicios más demandados por nuestros clientes</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
              {services.filter((s) => s.priority === 1).map((service) => (
                <Link
                  key={service.id}
                  href={`/es/servicios/${service.slug}`}
                  className="reveal group relative bg-white border border-neutral-200 p-6 hover:border-brand-brown hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute top-3 right-3">
                    <span className="inline-block bg-brand-brown/10 text-brand-brown text-[0.55rem] font-bold uppercase tracking-wider px-2 py-0.5">
                      Más solicitado
                    </span>
                  </div>
                  <div className="mb-3">{getServiceIcon(service.id)}</div>
                  <h3 className="font-serif text-base font-semibold text-brand-dark mb-2 group-hover:text-brand-brown transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-[0.72rem] text-neutral-400 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <span className="text-[0.7rem] font-semibold text-brand-brown opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver más →
                  </span>
                </Link>
              ))}
            </div>

            <h2 className="font-serif text-xl md:text-2xl font-semibold text-brand-dark mb-2">
              Otras <span className="text-brand-brown">áreas de práctica</span>
            </h2>
            <p className="text-sm text-neutral-500 mb-8">Cobertura legal integral en todas las ramas del derecho</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.filter((s) => s.priority > 1).map((service) => (
                <Link
                  key={service.id}
                  href={`/es/servicios/${service.slug}`}
                  className="reveal group bg-white border border-neutral-200 p-6 hover:border-brand-brown hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="mb-3">{getServiceIcon(service.id)}</div>
                  <h3 className="font-serif text-lg font-semibold text-brand-dark mb-2 group-hover:text-brand-brown transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <span className="text-[0.7rem] font-semibold text-brand-brown opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver más →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 bg-brand-brown-hover text-white">
          <div className="container-custom text-center max-w-[600px]">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
              ¿No sabe qué área legal necesita?
            </h2>
            <p className="text-sm text-white/90 leading-relaxed mb-8">
              Cuéntenos su caso y nuestro equipo le orientará sin compromiso.
            </p>
            <Link href="/es/contacto" className="inline-flex items-center gap-2 bg-brand-brown text-white text-xs font-semibold px-6 py-3 tracking-wide transition-all duration-300 border-none cursor-pointer hover:bg-brand-brown/90 hover:-translate-y-0.5 hover:shadow-lg">
              Consultar sin compromiso →
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <ScrollReveal />
    </>
  );
}
