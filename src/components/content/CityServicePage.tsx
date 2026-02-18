import Link from 'next/link';
import Image from 'next/image';
import { Scale } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import RichTextContent from '@/components/content/RichTextContent';
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from '@/components/seo/SchemaOrg';
import type { ServiceContent } from '@/lib/service-content';

interface CityServicePageProps {
  content: ServiceContent;
  serviceNameEs: string;
  serviceNameEn?: string;
  folderSlug: string;
  folderSlugEn?: string;
  icon: React.ReactNode;
  locale?: 'es' | 'en';
}

export default function CityServicePage({ content, serviceNameEs, serviceNameEn, folderSlug, folderSlugEn, icon, locale = 'es' }: CityServicePageProps) {
  const isEn = locale === 'en';
  const serviceName = isEn ? (serviceNameEn || serviceNameEs) : serviceNameEs;
  const slug = isEn ? (folderSlugEn || folderSlug) : folderSlug;
  const prefix = isEn ? '/en' : '/es';
  const servicesPath = isEn ? 'services' : 'servicios';
  const contactPath = isEn ? 'contact' : 'contacto';

  const faqs = isEn ? (content.faqsEn || []) : (content.faqsEs || []);
  const sections = isEn ? (content.sectionsEn || []) : content.sectionsEs;
  const process = isEn ? (content.processEn || []) : content.processEs;
  const title = isEn ? (content.titleEn || `${serviceName} Lawyers in ${content.localityName}`) : (content.titleEs || `Abogados de ${serviceName} en ${content.localityName}`);
  const longDesc = isEn ? (content.longDescriptionEn || '') : (content.longDescriptionEs || '');
  const shortDesc = isEn ? (content.shortDescriptionEn || '') : (content.shortDescriptionEs || '');

  const t = isEn ? {
    home: 'Home', practiceAreas: 'Practice Areas', in: 'in',
    specialists: 'Specialists in', expertLawyers: `Specialist ${serviceName.toLowerCase()} lawyers`,
    whatToKnow: `What you should know about ${serviceName.toLowerCase()} in`,
    needAdvice: 'Need advice on your case? Contact our specialists',
    requestInfo: 'Request information →', call: 'Call',
    ourProcess: 'Our process', howWeWork: 'How we handle your case',
    whyTrust: 'Why choose García-Valcárcel & Cáceres?',
    faq: 'Frequently asked questions',
    needAdviceIn: `Need legal advice in ${content.localityName}?`,
    officeText: 'Our head office is at',
    officeAddress: 'Gran Vía, 15 — 3rd Floor, 30008 Murcia',
    weServe: `We serve ${content.localityName} clients in person and by video conference.`,
    contactNow: 'Contact now →', contact: 'Contact →',
    yearsExp: 'years of experience', founded: 'year founded',
    professionals: 'specialized', personalized: 'personalized',
    andAllSpain: 'and all Spain', hqMurcia: 'Murcia centre',
  } : {
    home: 'Inicio', practiceAreas: 'Áreas de Práctica', in: 'en',
    specialists: 'Especialistas en', expertLawyers: `Abogados especialistas en ${serviceName.toLowerCase()}`,
    whatToKnow: `Lo que debe saber sobre ${serviceName.toLowerCase()} en`,
    needAdvice: '¿Necesita asesoramiento sobre su caso? Contacte con nuestros especialistas',
    requestInfo: 'Solicitar información →', call: 'Llamar',
    ourProcess: 'Nuestro proceso', howWeWork: 'Cómo trabajamos su caso',
    whyTrust: '¿Por qué confiar en García-Valcárcel & Cáceres?',
    faq: 'Preguntas frecuentes',
    needAdviceIn: `¿Necesita asesoramiento en ${content.localityName}?`,
    officeText: 'Nuestra sede central está en',
    officeAddress: 'Gran Vía, 15 — 3ª Planta, 30008 Murcia',
    weServe: `Atendemos clientes de ${content.localityName} de forma presencial y por videoconferencia.`,
    contactNow: 'Contactar ahora →', contact: 'Contactar →',
    yearsExp: 'de experiencia', founded: 'año de fundación',
    professionals: 'especializados', personalized: 'personalizado',
    andAllSpain: 'y toda España', hqMurcia: 'Murcia centro',
  };

  const breadcrumbs = [
    { name: t.home, href: prefix },
    { name: t.practiceAreas, href: `${prefix}/${servicesPath}` },
    { name: serviceName, href: `${prefix}/${servicesPath}/${slug}` },
    { name: `${serviceName} ${t.in} ${content.localityName}`, href: `${prefix}/${servicesPath}/${slug}/${content.localitySlug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ServiceSchema
        name={title}
        description={longDesc}
        slug={`${slug}/${content.localitySlug}`}
        locale={locale}
      />
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}

      <Navbar locale={locale} />
      <main>
        {/* Hero */}
        <section className="relative min-h-[500px] md:min-h-[550px] flex items-center py-16">
          <div className="absolute inset-0 bg-brand-dark/90 z-10" />
          <Image
            src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
            alt={`${serviceName} ${t.in} ${content.localityName}`}
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
                  {icon}
                </div>
                <div className="w-16 h-0.5 bg-brand-gold/40" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.2] mb-5 md:mb-6 max-w-[95%]">
                {title}
              </h1>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[600px]">
                {shortDesc}
              </p>
              <div className="flex gap-3 items-center flex-wrap max-w-[600px]">
                <Link href={`${prefix}/${contactPath}`} className="btn-primary">{t.contact}</Link>
                <a href="tel:+34968241025" className="btn-outline">☎ 968 241 025</a>
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
                  {t.specialists} {content.localityName}
                </span>
              </div>
              <h2 className="section-title mb-8">
                {title}
              </h2>
              <div className="relative">
                <div className="float-left mr-6 mb-6 w-full sm:w-[380px] md:w-[420px]">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-brown/20 to-brand-brown-hover/20 z-10" />
                    <Image src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp" alt={serviceName} fill className="object-cover" sizes="(max-width: 640px) 100vw, 420px" quality={60} />
                    <div className="absolute bottom-4 left-4 bg-brand-brown rounded-xl p-3 shadow-lg z-20">
                      <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
                    </div>
                  </div>
                </div>
                <div className="text-content">
                  <RichTextContent content={longDesc} className="mb-6" />
                  <div className="clear-both pt-4">
                    <div className="flex gap-3 flex-wrap">
                      <Link href={`${prefix}/${contactPath}`} className="btn-primary">{t.contact}</Link>
                      <a href="tel:+34968241025" className="btn-outline-dark">☎ {isEn ? 'Call' : 'Llamar'}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Secciones */}
        {sections.length > 0 && (
          <section className="py-16 md:py-20 bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-12">
                <h2 className="section-title mb-4">{t.whatToKnow} {content.localityName}</h2>
                <div className="w-20 h-1 bg-brand-brown mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {sections.map((section, i) => (
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
                  <p className="text-base text-brand-dark mb-6">{t.needAdvice}</p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Link href={`${prefix}/${contactPath}`} className="btn-primary">{t.requestInfo}</Link>
                    <a href="tel:+34968241025" className="btn-outline-dark">☎ 968 241 025</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Proceso */}
        {process.length > 0 && (
          <section className="py-16 md:py-20 bg-white pb-8 md:pb-10">
            <div className="container-custom max-w-6xl">
              <div className="reveal mb-16">
                <div className="text-center mb-10">
                  <div className="flex items-center gap-3 justify-center mb-4">
                    <span className="w-9 h-0.5 bg-brand-brown" /><span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">{t.ourProcess}</span><span className="w-9 h-0.5 bg-brand-brown" />
                  </div>
                  <h2 className="section-title">{t.howWeWork}</h2>
                </div>
                <div className="relative">
                  <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-brand-brown/20 -translate-y-1/2" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {process.map((step, i) => (
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
              <div className="reveal">
                <div className="bg-gradient-to-br from-brand-brown to-brand-brown/95 p-10 md:p-12 rounded-2xl text-center">
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark mb-8">{t.whyTrust}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                      { title: isEn ? '55+ years' : '55+ años', desc: t.yearsExp },
                      { title: '1970', desc: t.founded },
                      { title: isEn ? '5 professionals' : '5 profesionales', desc: t.professionals },
                      { title: isEn ? 'Personal' : 'Trato', desc: t.personalized },
                      { title: content.localityName, desc: t.andAllSpain },
                      { title: isEn ? 'HQ' : 'Sede', desc: t.hqMurcia },
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

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="pt-8 md:pt-10 pb-16 md:pb-20 bg-white">
            <div className="container-custom max-w-4xl">
              <div className="reveal text-center mb-12">
                <h2 className="section-title mb-4">{t.faq}</h2>
                <div className="w-20 h-1 bg-brand-brown mx-auto" />
              </div>
              <div className="reveal space-y-4">
                {faqs.map((faq, i) => (
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

        {/* CTA final */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brand-brown-hover to-brand-brown-hover/90 text-white relative overflow-hidden">
          <div className="container-custom max-w-4xl relative z-10">
            <div className="reveal text-center">
              <div className="w-20 h-20 bg-brand-brown rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                <Image src="/images/logo/gvcabogados_murcia_logo_leon_blanco.webp" alt="León GVC" fill className="object-contain p-4" sizes="80px" />
              </div>
              <h2 className="section-title-white mb-6">{t.needAdviceIn}</h2>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-4 max-w-2xl mx-auto">
                {t.officeText} <strong className="text-white">{t.officeAddress}</strong>.
              </p>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                {t.weServe}
              </p>
              <div className="flex gap-3 md:gap-4 items-center flex-wrap justify-center">
                <Link href={`${prefix}/${contactPath}`} className="inline-flex items-center gap-2 bg-brand-brown text-white text-xs font-semibold px-6 py-3 tracking-wide transition-all duration-300 hover:bg-brand-brown/90 hover:-translate-y-0.5 hover:shadow-xl">{t.contactNow}</Link>
                <a href="tel:+34968241025" className="btn-outline">☎ 968 241 025</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <ScrollReveal />
    </>
  );
}
