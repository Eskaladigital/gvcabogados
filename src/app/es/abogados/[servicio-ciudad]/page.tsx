import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ContactSection from '@/components/home/ContactSection';
import RichTextContent from '@/components/content/RichTextContent';
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from '@/components/seo/SchemaOrg';
import { getServiceContentBySlug, getAllServiceContentSlugs, type ServiceContent } from '@/lib/service-content';

interface Props {
  params: { 'servicio-ciudad': string };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllServiceContentSlugs();
  return slugs.map((s) => ({ 'servicio-ciudad': s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getServiceContentBySlug(params['servicio-ciudad']);
  if (!content) return {};
  
  const title = content.titleEs || `${content.serviceNameEs} en ${content.localityName} — Abogados Especialistas | GVC Abogados`;
  const description = content.metaDescriptionEs || content.shortDescriptionEs || `Abogados especializados en ${content.serviceNameEs.toLowerCase()} en ${content.localityName}. Especialistas en responsabilidad civil con más de 55 años de experiencia. ☎ 968 241 025.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.gvcabogados.com/es/abogados/${content.slugEs}`,
      languages: { en: `/en/lawyers/${content.slugEn}` },
    },
    openGraph: {
      title,
      description,
      locale: 'es_ES',
    },
  };
}

export default async function LandingPageEs({ params }: Props) {
  const content = await getServiceContentBySlug(params['servicio-ciudad']);
  if (!content) notFound();
  
  const locale = 'es';
  
  // Crear objeto service compatible con el código existente
  const service = {
    id: content.serviceKey,
    nameEs: content.serviceNameEs,
    descriptionEs: content.shortDescriptionEs || '',
    longDescriptionEs: content.longDescriptionEs || '',
    slugEs: content.slugEs,
    sectionsEs: content.sectionsEs,
    processEs: content.processEs,
    faqsEs: content.faqsEs,
  };

  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: service.nameEs || 'Servicios', href: `/es/servicios/${service.slugEs}` },
    { name: `${service.nameEs} en ${content.localityName}`, href: `/es/abogados/${content.slugEs}` },
  ];

  // Use service FAQs if available
  const faqs = service.faqsEs || [];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ServiceSchema
        name={content.titleEs || `Abogados de ${service.nameEs} en ${content.localityName}`}
        description={content.longDescriptionEs || service.longDescriptionEs}
        slug={content.slugEs}
        locale={locale}
      />
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}

      <Navbar locale={locale} alternateUrl={`/es/servicios/${content.slugEs}`} />
      <main>
        {/* Hero */}
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
              {content.titleEs || `Abogados ${service.nameEs} en ${content.localityName}`}
            </h1>
            <p className="text-neutral-300 text-base mt-4 max-w-[560px]">
              {content.shortDescriptionEs || service.descriptionEs}
            </p>
            <div className="flex gap-3 mt-8 flex-wrap">
              <Link href="/es/contacto" className="btn-primary">
                Contactar →
              </Link>
              <a href="tel:+34968241025" className="btn-outline">
                ☎ 968 241 025
              </a>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12 md:py-20">
          <div className="container-custom max-w-[800px]">
            {/* Intro - unique city content */}
            <div className="reveal">
              <h2 className="font-serif text-xl md:text-2xl font-semibold text-brand-dark mb-5">
                ¿Necesita un abogado de {service.nameEs.toLowerCase()} en {content.localityName}?
              </h2>
              <RichTextContent 
                content={content.longDescriptionEs || service.longDescriptionEs} 
                className="mb-8"
              />
            </div>

            {/* Service-specific content sections */}
            {service.sectionsEs.length > 0 && (
              <div className="reveal mb-10">
                <h2 className="font-serif text-xl font-semibold text-brand-dark mb-5">
                  Nuestros servicios de {service.nameEs.toLowerCase()} para clientes de {content.localityName}
                </h2>
                <div className="space-y-6">
                  {service.sectionsEs.map((section, i) => (
                    <div key={i}>
                      <h3 className="font-serif text-lg font-semibold text-brand-dark mb-2">
                        {section.title}
                      </h3>
                      <RichTextContent content={section.content} className="text-sm [&_p]:text-sm [&_p]:text-neutral-500 [&_li]:text-sm [&_li]:text-neutral-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Banner Baremo — solo accidentes de tráfico */}
            {service.id === 'accidentes-trafico' && (
              <div className="reveal mb-10 relative bg-brand-dark rounded-lg overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 20% 50%, rgba(204,178,127,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(204,178,127,0.3) 0%, transparent 50%)',
                  }}
                />
                <div className="relative z-10 p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 bg-brand-brown rounded-xl flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-white mb-2">
                        Expertos en el Baremo de Tráfico
                      </h3>
                      <p className="text-sm text-neutral-300 leading-relaxed">
                        Dominamos el <strong className="text-white">Sistema de Valoración de Daños en Accidentes de Circulación</strong> (Ley 35/2015). 
                        Calculamos con precisión las indemnizaciones por lesiones temporales, secuelas permanentes, perjuicio patrimonial y lucro cesante 
                        para que reciba la máxima compensación posible.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Link href="/es/contacto" className="btn-primary text-xs">
                      Valorar mi caso →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Process */}
            {service.processEs.length > 0 && (
              <div className="reveal mb-10">
                <h2 className="font-serif text-xl font-semibold text-brand-dark mb-5">
                  Cómo trabajamos su caso desde {content.localityName}
                </h2>
                <div className="space-y-3">
                  {service.processEs.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full bg-brand-brown text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-neutral-500 leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <div className="reveal mb-10">
                <h2 className="font-serif text-xl font-semibold text-brand-dark mb-5">
                  Preguntas frecuentes sobre {service.nameEs.toLowerCase()} en {content.localityName}
                </h2>
                <div className="border border-neutral-200 divide-y divide-neutral-200">
                  {faqs.map((faq, i) => (
                    <details key={i} className="group">
                      <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-neutral-50 transition-colors">
                        <h3 className="font-medium text-sm text-brand-dark pr-4">{faq.question}</h3>
                        <span className="text-brand-brown text-lg shrink-0 group-open:rotate-45 transition-transform">
                          +
                        </span>
                      </summary>
                      <div className="px-5 pb-5">
                        <RichTextContent content={faq.answer} className="text-sm [&_p]:text-sm [&_p]:text-neutral-500 [&_li]:text-sm [&_li]:text-neutral-500" />
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Location CTA */}
            <div className="reveal bg-brand-dark text-white p-8">
              <h2 className="font-serif text-lg font-semibold mb-3">¿Dónde estamos?</h2>
              <p className="text-sm text-neutral-300 leading-relaxed mb-2">
                Nuestra sede:{' '}
                <strong className="text-white">Gran Vía, 15 — 3ª Planta, 30008 Murcia</strong>.
              </p>
              <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                Atendemos clientes de {content.localityName} de forma presencial y por videoconferencia. No
                necesita desplazarse para iniciar su caso.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/es/contacto" className="btn-primary">
                  Contactar ahora →
                </Link>
                <a href="tel:+34968241025" className="btn-outline">
                  ☎ Llamar
                </a>
              </div>
            </div>
          </div>
        </section>

        <ContactSection locale={locale} />
      </main>
      <Footer locale={locale} />
      <ScrollReveal />
    </>
  );
}
