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
import { services, getServiceByGenericSlug } from '@/data/services';
import { getServiceContentBySlug, getAllServiceContentSlugs, type ServiceContent } from '@/lib/service-content';
import { supabaseAdmin } from '@/lib/supabase';

interface Props {
  params: { slug: string };
}

/**
 * Genera las rutas estáticas: slugs genéricos (14) + slugs locales de Supabase.
 * Los genéricos permiten /es/servicios/accidentes-trafico
 * Los locales mantienen retrocompatibilidad con /es/servicios/abogados-accidentes-trafico-murcia
 */
export async function generateStaticParams() {
  const genericSlugs = services.map((s) => ({ slug: s.genericSlugEs }));
  const localSlugs = await getAllServiceContentSlugs();
  return [...genericSlugs, ...localSlugs];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Comprobar si es un slug genérico
  const genericService = getServiceByGenericSlug(params.slug);
  if (genericService) {
    const title = `${genericService.nameEs} — Abogados Especialistas | GVC Abogados`;
    const description = `${genericService.descriptionEs}. Más de 75 años de experiencia. Despacho multidisciplinar con sede en Murcia y actuación en toda España. ☎ 968 241 025.`;
    return {
      title,
      description,
      alternates: {
        canonical: `https://www.gvcabogados.com/es/servicios/${genericService.genericSlugEs}`,
        languages: { en: `/en/services/${genericService.genericSlugEn}` },
      },
      openGraph: {
        title,
        description,
        url: `https://www.gvcabogados.com/es/servicios/${genericService.genericSlugEs}`,
        siteName: 'García-Valcárcel & Cáceres Abogados',
        locale: 'es_ES',
        type: 'website',
      },
    };
  }

  // Slug local (retrocompatibilidad)
  const content = await getServiceContentBySlug(params.slug);
  if (!content) return {};

  const title = content.titleEs || `${content.serviceNameEs} en ${content.localityName} — Abogados Especialistas | GVC Abogados`;
  const description = content.metaDescriptionEs || content.shortDescriptionEs || `Abogados especializados en ${content.serviceNameEs.toLowerCase()} en ${content.localityName}. Especialistas en responsabilidad civil con más de 75 años de experiencia. ☎ 968 241 025.`;

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

function getServiceIcon(serviceId: string, color: 'brown' | 'white' = 'brown') {
  const iconProps = { 
    size: 32, 
    className: color === 'white' ? 'text-white flex-shrink-0' : 'text-brand-brown flex-shrink-0' 
  };
  switch (serviceId) {
    case 'accidentes-trafico': return <Car {...iconProps} />;
    case 'derecho-familia': return <Users {...iconProps} />;
    case 'derecho-bancario': return <Building2 {...iconProps} />;
    case 'derecho-penal': return <Scale {...iconProps} />;
    case 'derecho-inmobiliario': return <Home {...iconProps} />;
    case 'derecho-sucesorio': return <FileText {...iconProps} />;
    case 'derecho-mercantil': return <Briefcase {...iconProps} />;
    case 'responsabilidad-civil': return <Shield {...iconProps} />;
    case 'extranjeria': return <Clipboard {...iconProps} />;
    case 'mediacion': return <Handshake {...iconProps} />;
    case 'obligaciones-contratos': return <FileText {...iconProps} />;
    case 'derecho-administrativo': return <Landmark {...iconProps} />;
    case 'defensa-fondos-buitre': return <Shield {...iconProps} />;
    case 'negligencias-medicas': return <Stethoscope {...iconProps} />;
    default: return null;
  }
}

/**
 * Obtiene las ciudades disponibles para un servicio desde Supabase.
 */
async function getCitiesForService(serviceKey: string): Promise<{ name: string; slug: string; slugEs: string }[]> {
  const { data } = await supabaseAdmin
    .from('service_content')
    .select('slug_es, localities!inner(name, slug)')
    .eq('services.service_key', serviceKey)
    .order('localities.name');

  if (!data || data.length === 0) {
    const staticService = services.find(s => s.id === serviceKey);
    if (staticService) {
      return [{ name: 'Murcia', slug: 'murcia', slugEs: staticService.slugEs }];
    }
    return [];
  }
  
  return data.map((row: any) => ({
    name: row.localities.name,
    slug: row.localities.slug,
    slugEs: row.slug_es,
  }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const genericService = getServiceByGenericSlug(params.slug);
  
  if (genericService) {
    return <GenericServicePage service={genericService} />;
  }

  // Retrocompatibilidad: slug local antiguo
  const content = await getServiceContentBySlug(params.slug);
  if (!content) notFound();
  return <LocalServicePage content={content} />;
}

/* ═══════════════════════════════════════════════════════════════
   PÁGINA GENÉRICA (sin ciudad) — La que aparece en el menú
   ═══════════════════════════════════════════════════════════════ */

async function GenericServicePage({ service }: { service: (typeof services)[number] }) {
  const locale = 'es';
  const cities = await getCitiesForService(service.id);
  
  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: 'Áreas de Práctica', href: '/es/servicios' },
    { name: service.nameEs, href: `/es/servicios/${service.genericSlugEs}` },
  ];

  const genericDescription = service.descriptionEs;
  const genericLongDescription = service.longDescriptionEs
    .replace(/\ben Murcia\b/gi, 'en toda España')
    .replace(/\bde Murcia\b/gi, '')
    .replace(/\bmurcianos?\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const genericSections = service.sectionsEs.map(s => ({
    title: s.title.replace(/\ben Murcia\b/gi, '').replace(/\bde Murcia\b/gi, '').trim(),
    content: s.content
      .replace(/\ben Murcia\b/gi, '')
      .replace(/\bde Murcia\b/gi, '')
      .replace(/\bmurcianos?\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim(),
  }));

  const genericFaqs = service.faqsEs.map(f => ({
    question: f.question.replace(/\ben Murcia\b/gi, '').replace(/\bde Murcia\b/gi, '').trim(),
    answer: f.answer
      .replace(/\ben Murcia\b/gi, '')
      .replace(/\bde Murcia\b/gi, '')
      .replace(/\bmurcianos?\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim(),
  }));

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ServiceSchema
        name={`Abogados de ${service.nameEs} — García-Valcárcel & Cáceres`}
        description={genericDescription}
        slug={service.genericSlugEs}
        locale={locale}
      />
      {genericFaqs.length > 0 && <FAQSchema faqs={genericFaqs} />}

      <Navbar locale={locale} alternateUrl={`/en/services/${service.genericSlugEn}`} />
      <main>
        {/* Hero */}
        <section className="relative min-h-[500px] md:min-h-[550px] flex items-center py-16">
          <div className="absolute inset-0 bg-brand-dark/90 z-10" />
          <Image
            src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
            alt={service.nameEs}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={60}
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
                Abogados especialistas en {service.nameEs.toLowerCase()}
              </h1>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[600px]">
                {genericDescription}. Despacho multidisciplinar con sede central en Murcia y actuación en toda España. Más de 75 años de experiencia.
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

        {/* Intro */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container-custom max-w-5xl">
            <div className="reveal">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-0.5 bg-brand-brown" />
                <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                  Especialistas en {service.nameEs.toLowerCase()}
                </span>
              </div>
              <h2 className="section-title mb-8">
                Abogados expertos en {service.nameEs.toLowerCase()}
              </h2>
              
              <div className="relative">
                <div className="float-left mr-6 mb-6 w-full sm:w-[380px] md:w-[420px]">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-brown/20 to-brand-brown-hover/20 z-10" />
                    <Image
                      src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
                      alt={service.nameEs}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 420px"
                      quality={60}
                    />
                    <div className="absolute bottom-4 left-4 bg-brand-brown rounded-xl p-3 shadow-lg z-20">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {getServiceIcon(service.id, 'white')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-content">
                  <RichTextContent content={genericLongDescription} className="mb-6" />
                  
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

        {/* Secciones de contenido */}
        {genericSections.length > 0 && (
          <section className="py-16 md:py-20 bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-12">
                <h2 className="section-title mb-4">
                  Lo que debe saber sobre {service.nameEs.toLowerCase()}
                </h2>
                <div className="w-20 h-1 bg-brand-brown mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {genericSections.map((section, i) => (
                  <div key={i} className="reveal bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-neutral-100">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-brand-brown rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-white">{i + 1}</span>
                      </div>
                      <h3 className="font-serif text-lg md:text-xl font-semibold text-brand-dark pt-2">
                        {section.title}
                      </h3>
                    </div>
                    <div className="pl-16">
                      <RichTextContent content={section.content} className="text-sm [&_p]:text-sm [&_p]:text-neutral-500 [&_li]:text-sm [&_li]:text-neutral-500" />
                    </div>
                  </div>
                ))}
              </div>
              
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

        {/* Banner Baremo — solo accidentes de tráfico */}
        {service.id === 'accidentes-trafico' && (
          <section className="py-0">
            <div className="container-custom max-w-6xl">
              <div className="reveal relative bg-brand-dark rounded-2xl overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 20% 50%, rgba(204,178,127,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(204,178,127,0.3) 0%, transparent 50%)',
                  }}
                />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 p-8 md:p-12">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-brand-brown rounded-2xl flex items-center justify-center shrink-0">
                    <Scale size={40} className="text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-serif text-xl md:text-2xl font-semibold text-white mb-3">
                      Expertos en el Baremo de Tráfico
                    </h3>
                    <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-2xl">
                      Nuestro equipo domina en profundidad el <strong className="text-white">Sistema de Valoración de Daños en Accidentes de Circulación</strong> (Ley 35/2015). 
                      Calculamos con precisión las indemnizaciones que le corresponden —lesiones temporales, secuelas permanentes, perjuicio patrimonial y lucro cesante— 
                      para que reciba la máxima compensación posible.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Link href="/es/contacto" className="btn-primary whitespace-nowrap">
                      Valorar mi caso →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Sedes / Ciudades donde actuamos */}
        {cities.length > 0 && (
          <section className="py-16 md:py-20 bg-white">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-12">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                    Actuamos en toda España
                  </span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">
                  {service.nameEs}: asesoramiento local en su ciudad
                </h2>
                <p className="text-sm text-neutral-500 max-w-2xl mx-auto">
                  Con sede central en Murcia, ofrecemos asesoramiento especializado presencial y por videoconferencia en las principales ciudades de España.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/es/servicios/${service.genericSlugEs}/${city.slug}`}
                    className="reveal group bg-neutral-50 border border-neutral-200 p-4 rounded-xl text-center hover:border-brand-brown hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <span className="text-sm font-medium text-brand-dark group-hover:text-brand-brown transition-colors">
                      {city.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Proceso de trabajo + Por qué elegirnos */}
        {service.processEs.length > 0 && (
          <section className="py-16 md:py-20 bg-neutral-50 pb-8 md:pb-10">
            <div className="container-custom max-w-6xl">
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
                  <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-brand-brown/20 -translate-y-1/2" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {service.processEs.map((step, i) => (
                      <div key={i} className="bg-white p-6 rounded-xl hover:bg-brand-brown/5 hover:shadow-md transition-all group border border-transparent hover:border-brand-brown/20">
                        <div className="w-12 h-12 bg-brand-brown rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                          <span className="text-lg font-bold text-white">{i + 1}</span>
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="reveal">
                <div className="bg-gradient-to-br from-brand-brown to-brand-brown/95 p-10 md:p-12 rounded-2xl text-center">
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark mb-8">
                    ¿Por qué confiar en García-Valcárcel & Cáceres?
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                      { title: '75+ años', desc: 'de experiencia' },
                      { title: '14', desc: 'áreas de práctica' },
                      { title: '1946', desc: 'año de fundación' },
                      { title: '5 profesionales', desc: 'especializados' },
                      { title: 'Trato', desc: 'personalizado' },
                      { title: 'Toda España', desc: 'sede en Murcia' },
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
        {genericFaqs.length > 0 && (
          <section className="pt-8 md:pt-10 pb-16 md:pb-20 bg-white">
            <div className="container-custom max-w-4xl">
              <div className="reveal text-center mb-12">
                <h2 className="section-title mb-4">
                  Preguntas frecuentes
                </h2>
                <div className="w-20 h-1 bg-brand-brown mx-auto" />
              </div>
              <div className="reveal space-y-4">
                {genericFaqs.map((faq, i) => (
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
                      <RichTextContent content={faq.answer} className="pt-4 text-sm [&_p]:text-sm [&_p]:text-neutral-500 [&_li]:text-sm [&_li]:text-neutral-500" />
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
                  src="/images/logo/gvcabogados_murcia_logo_leon_blanco.webp"
                  alt="León GVC"
                  fill
                  className="object-contain p-4"
                  sizes="80px"
                />
              </div>
              <h2 className="section-title-white mb-6">
                ¿Necesita asesoramiento especializado?
              </h2>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                En García-Valcárcel & Cáceres contamos con más de 75 años de experiencia, especializados en responsabilidad civil. Nuestro equipo 
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

/* ═══════════════════════════════════════════════════════════════
   PÁGINA LOCAL (con ciudad) — Retrocompatibilidad con URLs antiguas
   ═══════════════════════════════════════════════════════════════ */

function LocalServicePage({ content }: { content: ServiceContent }) {
  const locale = 'es';
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

  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: 'Áreas de Práctica', href: '/es/servicios' },
    { name: `${service.nameEs} en ${content.localityName}`, href: `/es/servicios/${content.slugEs}` },
  ];

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
        <section className="relative min-h-[500px] md:min-h-[550px] flex items-center py-16">
          <div className="absolute inset-0 bg-brand-dark/90 z-10" />
          <Image
            src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
            alt={service.nameEs}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={60}
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
                <Link href="/es/contacto" className="btn-primary">Contactar →</Link>
                <a href="tel:+34968241025" className="btn-outline">☎ 968 241 025</a>
              </div>
            </div>
          </div>
        </section>

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
              <div className="relative">
                <div className="float-left mr-6 mb-6 w-full sm:w-[380px] md:w-[420px]">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-brown/20 to-brand-brown-hover/20 z-10" />
                    <Image src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp" alt={service.nameEs} fill className="object-cover" sizes="(max-width: 640px) 100vw, 420px" quality={60} />
                    <div className="absolute bottom-4 left-4 bg-brand-brown rounded-xl p-3 shadow-lg z-20">
                      <div className="w-8 h-8 flex items-center justify-center">{getServiceIcon(service.id, 'white')}</div>
                    </div>
                  </div>
                </div>
                <div className="text-content">
                  <RichTextContent content={content.longDescriptionEs || service.longDescriptionEs} className="mb-6" />
                  <div className="clear-both pt-4">
                    <div className="flex gap-3 flex-wrap">
                      <Link href="/es/contacto" className="btn-primary">Contactar →</Link>
                      <a href="tel:+34968241025" className="btn-outline-dark">☎ Llamar</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {service.sectionsEs.length > 0 && (
          <section className="py-16 md:py-20 bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-12">
                <h2 className="section-title mb-4">Lo que debe saber sobre {service.nameEs.toLowerCase()}</h2>
                <div className="w-20 h-1 bg-brand-brown mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {service.sectionsEs.map((section, i) => (
                  <div key={i} className="reveal bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-neutral-100">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-brand-brown rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-white">{i + 1}</span>
                      </div>
                      <h3 className="font-serif text-lg md:text-xl font-semibold text-brand-dark pt-2">{section.title}</h3>
                    </div>
                    <div className="pl-16">
                      <RichTextContent content={section.content} className="text-sm [&_p]:text-sm [&_p]:text-neutral-500 [&_li]:text-sm [&_li]:text-neutral-500" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="reveal mt-12 text-center">
                <div className="bg-white border-2 border-brand-brown/20 p-8 rounded-2xl max-w-3xl mx-auto">
                  <p className="text-base text-brand-dark mb-6">¿Necesita asesoramiento sobre su caso? Contacte con nuestros especialistas</p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Link href="/es/contacto" className="btn-primary">Solicitar información →</Link>
                    <a href="tel:+34968241025" className="btn-outline-dark">☎ 968 241 025</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {service.id === 'accidentes-trafico' && (
          <section className="py-0">
            <div className="container-custom max-w-6xl">
              <div className="reveal relative bg-brand-dark rounded-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(204,178,127,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(204,178,127,0.3) 0%, transparent 50%)' }} />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 p-8 md:p-12">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-brand-brown rounded-2xl flex items-center justify-center shrink-0"><Scale size={40} className="text-white" /></div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-serif text-xl md:text-2xl font-semibold text-white mb-3">Expertos en el Baremo de Tráfico</h3>
                    <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-2xl">Nuestro equipo domina en profundidad el <strong className="text-white">Sistema de Valoración de Daños en Accidentes de Circulación</strong> (Ley 35/2015). Calculamos con precisión las indemnizaciones que le corresponden —lesiones temporales, secuelas permanentes, perjuicio patrimonial y lucro cesante— para que reciba la máxima compensación posible.</p>
                  </div>
                  <div className="shrink-0"><Link href="/es/contacto" className="btn-primary whitespace-nowrap">Valorar mi caso →</Link></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {service.processEs.length > 0 && (
          <section className="py-16 md:py-20 bg-white pb-8 md:pb-10">
            <div className="container-custom max-w-6xl">
              <div className="reveal mb-16">
                <div className="text-center mb-10">
                  <div className="flex items-center gap-3 justify-center mb-4">
                    <span className="w-9 h-0.5 bg-brand-brown" /><span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Nuestro proceso</span><span className="w-9 h-0.5 bg-brand-brown" />
                  </div>
                  <h2 className="section-title">Cómo trabajamos su caso</h2>
                </div>
                <div className="relative">
                  <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-brand-brown/20 -translate-y-1/2" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {service.processEs.map((step, i) => (
                      <div key={i} className="bg-neutral-50 p-6 rounded-xl hover:bg-brand-brown/5 hover:shadow-md transition-all group border border-transparent hover:border-brand-brown/20">
                        <div className="w-12 h-12 bg-brand-brown rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm"><span className="text-lg font-bold text-white">{i + 1}</span></div>
                        <p className="text-sm text-neutral-500 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="reveal">
                <div className="bg-gradient-to-br from-brand-brown to-brand-brown/95 p-10 md:p-12 rounded-2xl text-center">
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark mb-8">¿Por qué confiar en García-Valcárcel & Cáceres?</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                      { title: '75+ años', desc: 'de experiencia' },
                      { title: '14', desc: 'áreas de práctica' },
                      { title: '1946', desc: 'año de fundación' },
                      { title: '5 profesionales', desc: 'especializados' },
                      { title: 'Trato', desc: 'personalizado' },
                      { title: 'Centro', desc: 'de Murcia' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/90 p-5 rounded-xl hover:bg-white hover:scale-105 transition-all">
                        <div className="font-display text-2xl md:text-3xl font-bold text-brand-brown-hover mb-1">{item.title}</div>
                        <div className="text-[0.7rem] text-neutral-500 uppercase tracking-wider">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {service.faqsEs.length > 0 && (
          <section className="pt-8 md:pt-10 pb-16 md:pb-20 bg-white">
            <div className="container-custom max-w-4xl">
              <div className="reveal text-center mb-12">
                <h2 className="section-title mb-4">Preguntas frecuentes</h2>
                <div className="w-20 h-1 bg-brand-brown mx-auto" />
              </div>
              <div className="reveal space-y-4">
                {service.faqsEs.map((faq, i) => (
                  <details key={i} className="group bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden hover:border-brand-brown transition-all">
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-brand-brown/5 transition-colors">
                      <h3 className="font-semibold text-sm text-brand-dark pr-4">{faq.question}</h3>
                      <div className="w-8 h-8 rounded-full bg-brand-brown/10 flex items-center justify-center shrink-0 group-open:bg-brand-brown transition-all">
                        <span className="text-brand-brown text-xl font-bold group-open:text-white group-open:rotate-45 transition-transform">+</span>
                      </div>
                    </summary>
                    <div className="px-6 pb-6 border-t border-neutral-200">
                      <RichTextContent content={faq.answer} className="pt-4 text-sm [&_p]:text-sm [&_p]:text-neutral-500 [&_li]:text-sm [&_li]:text-neutral-500" />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-16 md:py-24 bg-gradient-to-br from-brand-brown-hover to-brand-brown-hover/90 text-white relative overflow-hidden">
          <div className="container-custom max-w-4xl relative z-10">
            <div className="reveal text-center">
              <div className="w-20 h-20 bg-brand-brown rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                <Image src="/images/logo/gvcabogados_murcia_logo_leon_blanco.webp" alt="León GVC" fill className="object-contain p-4" sizes="80px" />
              </div>
              <h2 className="section-title-white mb-6">¿Necesita asesoramiento especializado?</h2>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-10 max-w-2xl mx-auto">En García-Valcárcel & Cáceres contamos con más de 75 años de experiencia, especializados en responsabilidad civil. Nuestro equipo le proporcionará el asesoramiento jurídico que necesita con la máxima profesionalidad.</p>
              <div className="flex gap-3 md:gap-4 items-center flex-wrap justify-center">
                <Link href="/es/contacto" className="inline-flex items-center gap-2 bg-brand-brown text-white text-xs font-semibold px-6 py-3 tracking-wide transition-all duration-300 hover:bg-brand-brown/90 hover:-translate-y-0.5 hover:shadow-xl">Contactar ahora →</Link>
                <a href="tel:+34968241025" className="btn-outline">☎ 968 241 025</a>
              </div>
            </div>
          </div>
        </section>

        {service.id === 'negligencias-medicas' && (
          <section className="py-12 bg-brand-brown">
            <div className="container-custom max-w-4xl">
              <div className="reveal bg-white p-8 rounded-2xl text-center">
                <h3 className="font-serif text-xl font-semibold text-brand-dark mb-4">Web especializada en Negligencias Médicas</h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-2xl mx-auto">Contamos con una web específica dedicada a negligencias médicas con todo el contenido especializado y los recursos que necesita.</p>
                <a href="https://www.gvcabogados.com/es/derecho-privado/abogados-negligencias-medicas-murcia" target="_blank" rel="noopener noreferrer" className="btn-primary">Visitar web de Negligencias Médicas →</a>
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
