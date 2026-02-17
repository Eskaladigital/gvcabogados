import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTopButton from '@/components/layout/WhatsAppButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ContactSection from '@/components/home/ContactSection';
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from '@/components/seo/SchemaOrg';
import { landingPages, getLandingPageBySlug } from '@/data/landings';
import { services } from '@/data/services';

interface Props {
  params: { 'service-city': string };
}

export function generateStaticParams() {
  return landingPages.map((lp) => ({ 'service-city': lp.slugEn }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const landing = getLandingPageBySlug(params['service-city'], 'en');
  if (!landing) return {};
  return {
    title: landing.titleEn,
    description: landing.metaDescriptionEn,
    alternates: {
      canonical: `https://www.gvcabogados.com/en/lawyers/${landing.slugEn}`,
      languages: { es: `/es/abogados/${landing.slugEs}` },
    },
    openGraph: { title: landing.titleEn, description: landing.metaDescriptionEn, locale: 'en_GB' },
  };
}

export default function LandingPageEn({ params }: Props) {
  const landing = getLandingPageBySlug(params['service-city'], 'en');
  if (!landing) notFound();
  const service = services.find((s) => s.id === landing.serviceId);
  const locale = 'en';

  const breadcrumbs = [
    { name: 'Home', href: '/en' },
    { name: service?.nameEn || 'Services', href: `/en/services/${service?.slugEn || ''}` },
    { name: `${service?.nameEn || ''} in ${landing.city}`, href: `/en/lawyers/${landing.slugEn}` },
  ];

  const faqs = service?.faqsEn || [];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      {service && (
        <ServiceSchema
          name={`${service.nameEn} Lawyers in ${landing.city}`}
          description={landing.introEn}
          slug={landing.slugEn}
          locale={locale}
        />
      )}
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}

      <Navbar locale={locale} />
      <main>
        <section className="bg-brand-dark py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
          <div className="container-custom relative z-10">
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-[700px] mt-4">{landing.h1En}</h1>
            <p className="text-neutral-300 text-base mt-4 max-w-[560px]">{landing.introEn}</p>
            <div className="flex gap-3 mt-8 flex-wrap">
              <Link href="/en/contact" className="btn-primary">Free consultation →</Link>
              <a href="tel:+34968241025" className="btn-outline">☎ +34 968 241 025</a>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container-custom max-w-[800px]">
            <div className="reveal">
              <h2 className="font-serif text-xl md:text-2xl font-semibold text-brand-dark mb-5">Need a {service?.nameEn.toLowerCase()} lawyer in {landing.city}?</h2>
              <p className="text-sm text-neutral-500 leading-relaxed mb-6">{landing.introEn}</p>
              <p className="text-sm text-neutral-500 leading-relaxed mb-8">{landing.cityContentEn}</p>
            </div>

            {service && service.sectionsEn.length > 0 && (
              <div className="reveal mb-10">
                <h2 className="font-serif text-xl font-semibold text-brand-dark mb-5">Our {service.nameEn.toLowerCase()} services for {landing.city} clients</h2>
                <p className="text-sm text-neutral-500 leading-relaxed">{service.longDescriptionEn}</p>
              </div>
            )}

            <div className="reveal bg-neutral-50 border border-neutral-200 p-8 mb-10">
              <h2 className="font-serif text-lg font-semibold text-brand-dark mb-4">Why choose GVC Lawyers for {landing.city}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {landing.advantagesEn.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-neutral-500">
                    <span className="text-brand-brown mt-0.5 shrink-0">✓</span> {item}
                  </div>
                ))}
              </div>
            </div>

            {service && service.processEn.length > 0 && (
              <div className="reveal mb-10">
                <h2 className="font-serif text-xl font-semibold text-brand-dark mb-5">How we handle your case from {landing.city}</h2>
                <div className="space-y-3">
                  {service.processEn.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full bg-brand-brown text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                      <p className="text-sm text-neutral-500 leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {faqs.length > 0 && (
              <div className="reveal mb-10">
                <h2 className="font-serif text-xl font-semibold text-brand-dark mb-5">FAQ about {service?.nameEn.toLowerCase()} in {landing.city}</h2>
                <div className="border border-neutral-200 divide-y divide-neutral-200">
                  {faqs.map((faq, i) => (
                    <details key={i} className="group">
                      <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-neutral-50 transition-colors">
                        <h3 className="font-medium text-sm text-brand-dark pr-4">{faq.question}</h3>
                        <span className="text-brand-brown text-lg shrink-0 group-open:rotate-45 transition-transform">+</span>
                      </summary>
                      <div className="px-5 pb-5">
                        <p className="text-sm text-neutral-500 leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            <div className="reveal bg-brand-dark text-white p-8">
              <h2 className="font-serif text-lg font-semibold mb-3">Where are we?</h2>
              <p className="text-sm text-neutral-300 leading-relaxed mb-2">Our office: <strong className="text-white">Gran Vía, 15 — 3rd Floor, 30008 Murcia, Spain</strong>.</p>
              <p className="text-sm text-neutral-300 leading-relaxed mb-4">We serve {landing.city} clients in person and by video conference. No need to travel to start your case.</p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/en/contact" className="btn-primary">Contact now →</Link>
                <a href="tel:+34968241025" className="btn-outline">☎ Call</a>
              </div>
            </div>
          </div>
        </section>

        <ContactSection locale={locale} />
      </main>
      <Footer locale={locale} />
      <BackToTopButton />
      <ScrollReveal />
    </>
  );
}
