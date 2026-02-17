import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  Car, Users, Building2, Scale, Home, FileText, 
  Briefcase, Shield, Clipboard, Handshake, Globe, 
  Landmark, Stethoscope, CheckCircle2, ArrowRight
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import RichTextContent from '@/components/content/RichTextContent';
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from '@/components/seo/SchemaOrg';
import { getServiceContentBySlug, getAllServiceContentSlugs, type ServiceContent } from '@/lib/service-content';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllServiceContentSlugs();
  return slugs;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getServiceContentBySlug(params.slug);
  if (!content) return {};

  const title = content.titleEs || `${content.serviceNameEs} en ${content.localityName} — Abogados Especialistas | GVC Abogados`;
  const description = content.metaDescriptionEs || content.shortDescriptionEs || `Abogados especializados en ${content.serviceNameEs.toLowerCase()} en ${content.localityName}. Más de 75 años de experiencia. ☎ 968 241 025.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.gvcabogados.com/es/servicios/${content.slugEs}`,
      languages: { en: `/en/services/${content.slugEn}` },
    },
    openGraph: {
      title,
      description,
      url: `https://www.gvcabogados.com/es/servicios/${content.slugEs}`,
      siteName: 'García-Valcárcel & Cáceres Abogados',
      locale: 'es_ES',
      type: 'website',
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const content = await getServiceContentBySlug(params.slug);
  if (!content) notFound();

  // Usar content como service para compatibilidad con el resto del código
  const service = {
    id: content.serviceKey,
    nameEs: content.serviceNameEs,
    descriptionEs: content.shortDescriptionEs || '',
    longDescriptionEs: content.longDescriptionEs || '',
    slugEs: content.slugEs,
    slugEn: content.slugEn,
    sectionsEs: content.sectionsEs,
    processEs: content.processEs,
    faqsEs: content.faqsEs,
  };

  const locale = 'es';

  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: 'Áreas de Práctica', href: '/es/servicios' },
    { name: `${service.nameEs} en ${content.localityName}`, href: `/es/servicios/${content.slugEs}` },
  ];

  // Función para obtener el icono según el servicio (blanco para el hero)
  const getServiceIcon = (serviceId: string, color: 'brown' | 'white' = 'brown') => {
    const iconProps = { 
      size: 32, 
      className: color === 'white' ? 'text-white flex-shrink-0' : 'text-brand-brown flex-shrink-0' 
    };
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
      <ServiceSchema
        name={content.titleEs || `Abogados de ${service.nameEs} en ${content.localityName}`}
        description={content.longDescriptionEs || service.longDescriptionEs}
        slug={content.slugEs}
        locale={locale}
      />
      {service.faqsEs.length > 0 && <FAQSchema faqs={service.faqsEs} />}

      <Navbar locale={locale} alternateUrl={`/en/services/${content.slugEn}`} />
      <main>
        {/* Hero con imagen de fondo */}
        <section className="relative min-h-[500px] md:min-h-[550px] flex items-center py-16">
          <div className="absolute inset-0 bg-brand-dark/90 z-10" />
          <Image
            src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.png"
            alt={service.nameEs}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="container-custom relative z-20 w-full">
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-8 max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-brand-brown rounded-2xl flex items-center justify-center shrink-0">
                  {getServiceIcon(service.id, 'white')}
                </div>
                <div className="w-16 h-0.5 bg-brand-gold/40" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.2] mb-5 md:mb-6 max-w-[95%]">
                {content.titleEs || `Abogados ${service.nameEs} en ${content.localityName}`}
              </h1>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[600px]">
                {content.shortDescriptionEs || service.descriptionEs}
              </p>
              <div className="flex gap-3 items-center flex-wrap max-w-[600px]">
                <Link href="/es/contacto" className="btn-primary">
                  Contactar →
                </Link>
                <a href="tel:+34968241025" className="btn-outline">
                  ☎ 968 241 025
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Intro destacado con imagen flotante */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container-custom max-w-5xl">
            <div className="reveal">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-0.5 bg-brand-brown" />
                <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                  Especialistas en {content.localityName}
                </span>
              </div>
              <h2 className="section-title mb-8">
                {content.titleEs || `Abogados especialistas en ${service.nameEs.toLowerCase()}`}
              </h2>
              
              {/* Contenedor con imagen flotante */}
              <div className="relative">
                {/* Imagen flotante a la izquierda */}
                <div className="float-left mr-6 mb-6 w-full sm:w-[380px] md:w-[420px]">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-brown/20 to-brand-brown-hover/20 z-10" />
                    <Image
                      src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.png"
                      alt={service.nameEs}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {/* Badge con icono del servicio */}
                    <div className="absolute bottom-4 left-4 bg-brand-brown rounded-xl p-3 shadow-lg z-20">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {getServiceIcon(service.id, 'white')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Texto que rodea la imagen */}
                <div className="text-content">
                  <RichTextContent 
                    content={content.longDescriptionEs || service.longDescriptionEs} 
                    className="mb-6"
                  />
                  
                  {/* Clear float para asegurar que los botones estén debajo */}
                  <div className="clear-both pt-4">
                    <div className="flex gap-3 flex-wrap">
                      <Link href="/es/contacto" className="btn-primary">
                        Contactar →
                      </Link>
                      <a href="tel:+34968241025" className="btn-outline-dark">
                        ☎ Llamar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Secciones de contenido - Rediseño con grid 2x2 */}
        {service.sectionsEs.length > 0 && (
          <section className="py-16 md:py-20 bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-12">
                <h2 className="section-title mb-4">
                  Lo que debe saber sobre {service.nameEs.toLowerCase()}
                </h2>
                <div className="w-20 h-1 bg-brand-brown mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {service.sectionsEs.map((section, i) => (
                  <div key={i} className="reveal bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-neutral-100">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-brand-brown rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-white">{i + 1}</span>
                      </div>
                      <h3 className="font-serif text-lg md:text-xl font-semibold text-brand-dark pt-2">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-500 leading-relaxed pl-16">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* CTA después de las secciones principales */}
              <div className="reveal mt-12 text-center">
                <div className="bg-white border-2 border-brand-brown/20 p-8 rounded-2xl max-w-3xl mx-auto">
                  <p className="text-base text-brand-dark mb-6">
                    ¿Necesita asesoramiento sobre su caso? Contacte con nuestros especialistas
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Link href="/es/contacto" className="btn-primary">
                      Solicitar información →
                    </Link>
                    <a href="tel:+34968241025" className="btn-outline-dark">
                      ☎ 968 241 025
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Proceso de trabajo + Por qué elegirnos - Sección unificada */}
        {service.processEs.length > 0 && (
          <section className="py-16 md:py-20 bg-white pb-8 md:pb-10">
            <div className="container-custom max-w-6xl">
              {/* Cómo trabajamos */}
              <div className="reveal mb-16">
                <div className="text-center mb-10">
                  <div className="flex items-center gap-3 justify-center mb-4">
                    <span className="w-9 h-0.5 bg-brand-brown" />
                    <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                      Nuestro proceso
                    </span>
                    <span className="w-9 h-0.5 bg-brand-brown" />
                  </div>
                  <h2 className="section-title">
                    Cómo trabajamos su caso
                  </h2>
                </div>
                <div className="relative">
                  {/* Línea conectora decorativa */}
                  <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-brand-brown/20 -translate-y-1/2" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {service.processEs.map((step, i) => (
                      <div key={i} className="bg-neutral-50 p-6 rounded-xl hover:bg-brand-brown/5 hover:shadow-md transition-all group border border-transparent hover:border-brand-brown/20">
                        <div className="w-12 h-12 bg-brand-brown rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                          <span className="text-lg font-bold text-white">{i + 1}</span>
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Por qué elegirnos */}
              <div className="reveal">
                <div className="bg-gradient-to-br from-brand-brown to-brand-brown/95 p-10 md:p-12 rounded-2xl text-center">
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark mb-8">
                    ¿Por qué confiar en García-Valcárcel & Cáceres?
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                      { title: '75+ años', desc: 'de experiencia' },
                      { title: '3.000+', desc: 'casos resueltos' },
                      { title: '97%', desc: 'éxito judicial' },
                      { title: '5 profesionales', desc: 'especializados' },
                      { title: 'Trato', desc: 'personalizado' },
                      { title: 'Centro', desc: 'de Murcia' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/90 p-5 rounded-xl hover:bg-white hover:scale-105 transition-all">
                        <div className="font-display text-2xl md:text-3xl font-bold text-brand-brown-hover mb-1">
                          {item.title}
                        </div>
                        <div className="text-[0.7rem] text-neutral-500 uppercase tracking-wider">
                          {item.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQs */}
        {service.faqsEs.length > 0 && (
          <section className="pt-8 md:pt-10 pb-16 md:pb-20 bg-white">
            <div className="container-custom max-w-4xl">
              <div className="reveal text-center mb-12">
                <h2 className="section-title mb-4">
                  Preguntas frecuentes
                </h2>
                <div className="w-20 h-1 bg-brand-brown mx-auto" />
              </div>
              <div className="reveal space-y-4">
                {service.faqsEs.map((faq, i) => (
                  <details 
                    key={i} 
                    className="group bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden hover:border-brand-brown transition-all"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-brand-brown/5 transition-colors">
                      <h3 className="font-semibold text-sm text-brand-dark pr-4">{faq.question}</h3>
                      <div className="w-8 h-8 rounded-full bg-brand-brown/10 flex items-center justify-center shrink-0 group-open:bg-brand-brown transition-all">
                        <span className="text-brand-brown text-xl font-bold group-open:text-white group-open:rotate-45 transition-transform">+</span>
                      </div>
                    </summary>
                    <div className="px-6 pb-6 border-t border-neutral-200">
                      <p className="text-sm text-neutral-500 leading-relaxed pt-4">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA final */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brand-brown-hover to-brand-brown-hover/90 text-white relative overflow-hidden">
          <div className="container-custom max-w-4xl relative z-10">
            <div className="reveal text-center">
              <div className="w-20 h-20 bg-brand-brown rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                <Image
                  src="/images/logo/gvcabogados_murcia_logo_leon_blanco.png"
                  alt="León GVC"
                  fill
                  className="object-contain p-4"
                  unoptimized
                />
              </div>
              <h2 className="section-title-white mb-6">
                ¿Necesita asesoramiento especializado?
              </h2>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                En García-Valcárcel & Cáceres contamos con más de 75 años de experiencia. Nuestro equipo 
                le proporcionará el asesoramiento jurídico que necesita con la máxima profesionalidad.
              </p>
              <div className="flex gap-3 md:gap-4 items-center flex-wrap justify-center">
                <Link href="/es/contacto" className="inline-flex items-center gap-2 bg-brand-brown text-white text-xs font-semibold px-6 py-3 tracking-wide transition-all duration-300 hover:bg-brand-brown/90 hover:-translate-y-0.5 hover:shadow-xl">
                  Contactar ahora →
                </Link>
                <a href="tel:+34968241025" className="btn-outline">
                  ☎ 968 241 025
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Negligencias médicas special CTA */}
        {service.id === 'negligencias-medicas' && (
          <section className="py-12 bg-brand-brown">
            <div className="container-custom max-w-4xl">
              <div className="reveal bg-white p-8 rounded-2xl text-center">
                <h3 className="font-serif text-xl font-semibold text-brand-dark mb-4">
                  Web especializada en Negligencias Médicas
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-2xl mx-auto">
                  Contamos con una web específica dedicada a negligencias médicas con todo el contenido
                  especializado y los recursos que necesita.
                </p>
                <a
                  href="https://www.gvcabogados.com/es/derecho-privado/abogados-negligencias-medicas-murcia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Visitar web de Negligencias Médicas →
                </a>
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer locale={locale} />
      <ScrollReveal />
    </>
  );
}
