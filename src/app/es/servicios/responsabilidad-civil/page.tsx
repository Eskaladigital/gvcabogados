import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import RichTextContent from '@/components/content/RichTextContent';
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from '@/components/seo/SchemaOrg';
import { services } from '@/data/services';
import { supabaseAdmin } from '@/lib/supabase';

const SERVICE_KEY = 'responsabilidad-civil';
const SERVICE_NAME = 'Responsabilidad Civil y Seguros';
const FOLDER_SLUG = 'responsabilidad-civil';
const GENERIC_SLUG_EN = 'civil-liability';

export const revalidate = 60;

export const metadata: Metadata = {
  title: `${SERVICE_NAME} — Abogados Especialistas | GVC Abogados`,
  description: `Abogados especialistas en ${SERVICE_NAME.toLowerCase()}. Más de 55 años de experiencia. Sede en Murcia, actuación en toda España.`,
  alternates: {
    canonical: `https://www.gvcabogados.com/es/servicios/${FOLDER_SLUG}`,
    languages: { en: `/en/services/${GENERIC_SLUG_EN}` },
  },
  openGraph: {
    title: `${SERVICE_NAME} — Abogados Especialistas | GVC Abogados`,
    description: `Abogados especialistas en ${SERVICE_NAME.toLowerCase()}. Más de 55 años de experiencia. Sede en Murcia, actuación en toda España.`,
    url: `https://www.gvcabogados.com/es/servicios/${FOLDER_SLUG}`,
    siteName: 'García-Valcárcel & Cáceres Abogados',
    locale: 'es_ES',
    type: 'website',
  },
};

export default async function ResponsabilidadCivilPage() {
  const svc = services.find(s => s.id === SERVICE_KEY)!;

  const { data } = await supabaseAdmin
    .from('service_content')
    .select('slug_es, localities!inner(name, slug), services!inner(service_key)')
    .eq('services.service_key', SERVICE_KEY)
    .order('localities.name');

  const cities: { name: string; slug: string }[] = (data || []).map((row: any) => ({
    name: row.localities.name,
    slug: row.localities.slug,
  }));

  const cleanMurciaRefs = (text: string) =>
    text
      .replace(/\ben Murcia\b/gi, '')
      .replace(/\bde Murcia\b/gi, '')
      .replace(/\bmurcianos?\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

  const genericLongDescription = cleanMurciaRefs(svc.longDescriptionEs);

  const genericSections = svc.sectionsEs.map(s => ({
    title: cleanMurciaRefs(s.title),
    content: cleanMurciaRefs(s.content),
  }));

  const genericFaqs = svc.faqsEs.map(f => ({
    question: cleanMurciaRefs(f.question),
    answer: cleanMurciaRefs(f.answer),
  }));

  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: 'Áreas de Práctica', href: '/es/servicios' },
    { name: SERVICE_NAME, href: `/es/servicios/${FOLDER_SLUG}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ServiceSchema
        name={`Abogados de ${SERVICE_NAME} — García-Valcárcel & Cáceres`}
        description={svc.descriptionEs}
        slug={FOLDER_SLUG}
        locale="es"
      />
      {genericFaqs.length > 0 && <FAQSchema faqs={genericFaqs} />}

      <Navbar locale="es" alternateUrl={`/en/services/${GENERIC_SLUG_EN}`} />
      <main>
        {/* Hero */}
        <section className="relative min-h-[500px] md:min-h-[550px] flex items-center py-16">
          <div className="absolute inset-0 bg-brand-dark/90 z-10" />
          <Image
            src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
            alt={SERVICE_NAME}
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
                  <Shield size={32} className="text-white" />
                </div>
                <div className="w-16 h-0.5 bg-brand-gold/40" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.2] mb-5 md:mb-6 max-w-[95%]">
                Abogados especialistas en {SERVICE_NAME.toLowerCase()}
              </h1>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[600px]">
                {svc.descriptionEs}. Despacho multidisciplinar con sede central en Murcia y actuación en toda España. Más de 55 años de experiencia.
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
                  Especialistas en {SERVICE_NAME.toLowerCase()}
                </span>
              </div>
              <h2 className="section-title mb-8">
                Abogados expertos en {SERVICE_NAME.toLowerCase()}
              </h2>

              <div className="relative">
                <div className="float-left mr-6 mb-6 w-full sm:w-[380px] md:w-[420px]">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-brown/20 to-brand-brown-hover/20 z-10" />
                    <Image
                      src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
                      alt={SERVICE_NAME}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 420px"
                      quality={60}
                    />
                    <div className="absolute bottom-4 left-4 bg-brand-brown rounded-xl p-3 shadow-lg z-20">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Shield size={32} className="text-white" />
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
                  Lo que debe saber sobre {SERVICE_NAME.toLowerCase()}
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

        {/* Ciudades */}
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
                  {SERVICE_NAME}: asesoramiento local en su ciudad
                </h2>
                <p className="text-sm text-neutral-500 max-w-2xl mx-auto">
                  Con sede central en Murcia, ofrecemos asesoramiento especializado presencial y por videoconferencia en las principales ciudades de España.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/es/servicios/${FOLDER_SLUG}/${city.slug}`}
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

        {/* Proceso */}
        {svc.processEs.length > 0 && (
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
                    {svc.processEs.map((step, i) => (
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
                      { title: '55+ años', desc: 'de experiencia' },
                      { title: '14', desc: 'áreas de práctica' },
                      { title: '1970', desc: 'año de fundación' },
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
                En García-Valcárcel & Cáceres contamos con más de 55 años de experiencia, especializados en responsabilidad civil. Nuestro equipo
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
      </main>
      <Footer locale="es" />
      <ScrollReveal />
    </>
  );
}
