import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ContactSection from '@/components/home/ContactSection';
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from '@/components/seo/SchemaOrg';
import { services, getServiceBySlug } from '@/data/services';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slugEn }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};

  const title = `${service.nameEn} in Murcia — Specialist Lawyers | GVC Lawyers`;
  const description = `Specialist ${service.nameEn.toLowerCase()} lawyers in Murcia, Spain. ${service.descriptionEn}. Free initial consultation. Specialists in civil liability with over 75 years of experience. ☎ +34 968 241 025.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.gvcabogados.com/en/services/${service.slugEn}`,
      languages: { es: `/es/servicios/${service.slugEs}` },
    },
    openGraph: {
      title,
      description,
      url: `https://www.gvcabogados.com/en/services/${service.slugEn}`,
      siteName: 'García-Valcárcel & Cáceres Lawyers',
      locale: 'en_GB',
      type: 'website',
    },
  };
}

export default function ServiceDetailPageEn({ params }: Props) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const locale = 'en';

  const breadcrumbs = [
    { name: 'Home', href: '/en' },
    { name: 'Practice Areas', href: '/en/services' },
    { name: service.nameEn, href: `/en/services/${service.slugEn}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ServiceSchema
        name={`${service.nameEn} Lawyers in Murcia`}
        description={service.longDescriptionEn}
        slug={service.slugEn}
        locale={locale}
      />
      {service.faqsEn.length > 0 && <FAQSchema faqs={service.faqsEn} />}

      <Navbar locale={locale} />
      <main>
        <section className="bg-brand-dark py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
          <div className="container-custom relative z-10">
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mt-4 max-w-[700px]">
              {service.nameEn} Lawyers{' '}
              <em className="italic text-brand-gold font-normal">in Murcia</em>
            </h1>
            <p className="text-neutral-300 text-base mt-4 max-w-[560px]">{service.descriptionEn}</p>
            <div className="flex gap-3 mt-8 flex-wrap">
              <Link href="/en/contact" className="btn-primary">Free consultation →</Link>
              <a href="tel:+34968241025" className="btn-outline">☎ +34 968 241 025</a>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container-custom max-w-[800px]">
            <div className="reveal">
              <p className="text-base text-neutral-600 leading-relaxed mb-10">{service.longDescriptionEn}</p>
            </div>

            {service.sectionsEn.length > 0 && (
              <div className="reveal space-y-10 mb-12">
                {service.sectionsEn.map((section, i) => (
                  <div key={i}>
                    <h2 className="font-serif text-xl md:text-2xl font-semibold text-brand-dark mb-4">{section.title}</h2>
                    <p className="text-sm text-neutral-500 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
            )}

            {service.processEn.length > 0 && (
              <div className="reveal bg-neutral-50 border border-neutral-200 p-8 mb-12">
                <h2 className="font-serif text-xl font-semibold text-brand-dark mb-6">How we work: our process</h2>
                <div className="space-y-4">
                  {service.processEn.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-brand-brown text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                      <p className="text-sm text-neutral-500 leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="reveal border-t border-neutral-200 pt-10 mb-12">
              <h2 className="font-serif text-xl font-semibold text-brand-dark mb-6">Why choose García-Valcárcel & Cáceres?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Over 75 years of legal experience',
                  'Specialized multidisciplinary team',
                  'Free initial consultation with no obligation',
                  'Personalized attention and constant communication',
                  'High success rate in resolutions',
                  'Office at Gran Vía 15, central Murcia',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-neutral-500">
                    <span className="text-brand-brown mt-0.5 shrink-0">✓</span> {item}
                  </div>
                ))}
              </div>
            </div>

            {service.faqsEn.length > 0 && (
              <div className="reveal mb-12">
                <h2 className="font-serif text-xl font-semibold text-brand-dark mb-6">Frequently asked questions about {service.nameEn.toLowerCase()}</h2>
                <div className="space-y-0 border border-neutral-200 divide-y divide-neutral-200">
                  {service.faqsEn.map((faq, i) => (
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

            <div className="reveal bg-brand-dark text-white p-8 md:p-10">
              <h2 className="font-serif text-xl font-semibold mb-3">Need a {service.nameEn.toLowerCase()} lawyer in Murcia?</h2>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">At García-Valcárcel & Cáceres we offer a free initial consultation to evaluate your case. With over 75 years of experience, our team will provide you with the legal advice you need.</p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/en/contact" className="btn-primary">Request free consultation →</Link>
                <a href="tel:+34968241025" className="btn-outline">☎ Call now</a>
              </div>
            </div>

            {service.id === 'negligencias-medicas' && (
              <div className="reveal bg-neutral-50 border border-neutral-200 p-8 mt-8">
                <h3 className="font-serif text-lg font-semibold text-brand-dark mb-3">Specialized Medical Malpractice Website</h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">We have a dedicated website for medical malpractice with all the specialized content and resources you need.</p>
                <a href="https://www.gvcabogados.com/es/derecho-privado/abogados-negligencias-medicas-murcia" target="_blank" rel="noopener noreferrer" className="btn-primary">Visit Medical Malpractice Website →</a>
              </div>
            )}
          </div>
        </section>

        <ContactSection locale={locale} />
      </main>
      <Footer locale={locale} />
      <ScrollReveal />
    </>
  );
}
