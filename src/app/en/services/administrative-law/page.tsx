import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Landmark } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import RichTextContent from '@/components/content/RichTextContent';
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from '@/components/seo/SchemaOrg';
import { services } from '@/data/services';
import { supabaseAdmin } from '@/lib/supabase';

const SERVICE_KEY = 'derecho-administrativo';
const SERVICE_NAME = 'Government Liability';
const FOLDER_SLUG_EN = 'administrative-law';
const FOLDER_SLUG_ES = 'responsabilidad-administracion';

export const revalidate = 60;

export const metadata: Metadata = {
  title: `${SERVICE_NAME} — Specialist Lawyers | GVC Lawyers`,
  description: `Specialist ${SERVICE_NAME.toLowerCase()} lawyers. Over 55 years of experience. Based in Murcia, operating across Spain.`,
  alternates: {
    canonical: `https://www.gvcabogados.com/en/services/${FOLDER_SLUG_EN}`,
    languages: { es: `/es/servicios/${FOLDER_SLUG_ES}` },
  },
  openGraph: {
    title: `${SERVICE_NAME} — Specialist Lawyers | GVC Lawyers`,
    description: `Specialist ${SERVICE_NAME.toLowerCase()} lawyers. Over 55 years of experience. Based in Murcia, operating across Spain.`,
    url: `https://www.gvcabogados.com/en/services/${FOLDER_SLUG_EN}`,
    siteName: 'García-Valcárcel & Cáceres Lawyers',
    locale: 'en_GB',
    type: 'website',
  },
};

function cleanMurciaRefs(text: string): string {
  return text
    .replace(/\bin Murcia\b/gi, 'across Spain')
    .replace(/\bof Murcia\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function cleanMurciaRefsNeutral(text: string): string {
  return text
    .replace(/\bin Murcia\b/gi, '')
    .replace(/\bof Murcia\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function getCitiesForService(): Promise<{ name: string; slug: string }[]> {
  const { data } = await supabaseAdmin
    .from('service_content')
    .select('slug_es, localities!inner(name, slug), services!inner(service_key)')
    .eq('services.service_key', SERVICE_KEY)
    .order('localities.name');

  if (!data || data.length === 0) return [];

  return data.map((row: any) => ({
    name: row.localities.name,
    slug: row.localities.slug,
  }));
}

export default async function AdministrativeLawPage() {
  const svc = services.find(s => s.id === SERVICE_KEY)!;
  const cities = await getCitiesForService();
  const locale = 'en';

  const breadcrumbs = [
    { name: 'Home', href: '/en' },
    { name: 'Practice Areas', href: '/en/services' },
    { name: svc.nameEn, href: `/en/services/${FOLDER_SLUG_EN}` },
  ];

  const genericDescription = svc.descriptionEn;
  const genericLongDescription = cleanMurciaRefs(svc.longDescriptionEn);

  const genericSections = svc.sectionsEn.map(s => ({
    title: cleanMurciaRefsNeutral(s.title),
    content: cleanMurciaRefsNeutral(s.content),
  }));

  const genericFaqs = svc.faqsEn.map(f => ({
    question: cleanMurciaRefsNeutral(f.question),
    answer: cleanMurciaRefsNeutral(f.answer),
  }));

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ServiceSchema
        name={`${svc.nameEn} Lawyers — García-Valcárcel & Cáceres`}
        description={genericDescription}
        slug={FOLDER_SLUG_EN}
        locale="en"
      />
      {genericFaqs.length > 0 && <FAQSchema faqs={genericFaqs} />}

      <Navbar locale="en" alternateUrl={`/es/servicios/${FOLDER_SLUG_ES}`} />
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
                  <Landmark size={32} className="text-white" />
                </div>
                <div className="w-16 h-0.5 bg-brand-gold/40" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.2] mb-5 md:mb-6 max-w-[95%]">
                Expert {SERVICE_NAME.toLowerCase()} lawyers
              </h1>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[600px]">
                {genericDescription}. Multidisciplinary firm based in Murcia operating across Spain. Over 55 years of experience.
              </p>
              <div className="flex gap-3 items-center flex-wrap max-w-[600px]">
                <Link href="/en/contact" className="btn-primary">
                  Contact us →
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
                  Specialists in {SERVICE_NAME.toLowerCase()}
                </span>
              </div>
              <h2 className="section-title mb-8">
                Expert {SERVICE_NAME.toLowerCase()} lawyers
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
                        <Landmark size={32} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-content">
                  <RichTextContent content={genericLongDescription} className="mb-6" />

                  <div className="clear-both pt-4">
                    <div className="flex gap-3 flex-wrap">
                      <Link href="/en/contact" className="btn-primary">
                        Contact us →
                      </Link>
                      <a href="tel:+34968241025" className="btn-outline-dark">
                        ☎ Call
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content sections */}
        {genericSections.length > 0 && (
          <section className="py-16 md:py-20 bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-12">
                <h2 className="section-title mb-4">
                  What you should know about {SERVICE_NAME.toLowerCase()}
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
                    Need advice on your case? Contact our specialists
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Link href="/en/contact" className="btn-primary">
                      Request information →
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

        {/* Cities */}
        {cities.length > 0 && (
          <section className="py-16 md:py-20 bg-white">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-12">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                    We operate across Spain
                  </span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">
                  {SERVICE_NAME}: local advice in your city
                </h2>
                <p className="text-sm text-neutral-500 max-w-2xl mx-auto">
                  Based in Murcia, we offer specialist advice in person and by video conference across Spain&apos;s main cities.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/en/services/${FOLDER_SLUG_EN}/${city.slug}`}
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

        {/* Work process */}
        {svc.processEn.length > 0 && (
          <section className="py-16 md:py-20 bg-neutral-50 pb-8 md:pb-10">
            <div className="container-custom max-w-6xl">
              <div className="reveal mb-16">
                <div className="text-center mb-10">
                  <div className="flex items-center gap-3 justify-center mb-4">
                    <span className="w-9 h-0.5 bg-brand-brown" />
                    <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                      Our process
                    </span>
                    <span className="w-9 h-0.5 bg-brand-brown" />
                  </div>
                  <h2 className="section-title">
                    How we handle your case
                  </h2>
                </div>
                <div className="relative">
                  <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-brand-brown/20 -translate-y-1/2" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {svc.processEn.map((step, i) => (
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

              {/* Why choose us */}
              <div className="reveal">
                <div className="bg-gradient-to-br from-brand-brown to-brand-brown/95 p-10 md:p-12 rounded-2xl text-center">
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark mb-8">
                    Why choose García-Valcárcel &amp; Cáceres?
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                      { title: '55+ years', desc: 'of experience' },
                      { title: '6', desc: 'practice areas' },
                      { title: '1970', desc: 'year founded' },
                      { title: '5 professionals', desc: 'specialized' },
                      { title: 'Personal', desc: 'personalized' },
                      { title: 'All Spain', desc: 'based in Murcia' },
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
                  Frequently asked questions
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

        {/* Final CTA */}
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
                Need specialist advice?
              </h2>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                At García-Valcárcel &amp; Cáceres we have over 55 years of experience, specializing in {SERVICE_NAME.toLowerCase()}. Our team
                will provide you with the legal advice you need with the highest professionalism.
              </p>
              <div className="flex gap-3 md:gap-4 items-center flex-wrap justify-center">
                <Link href="/en/contact" className="inline-flex items-center gap-2 bg-brand-brown text-white text-xs font-semibold px-6 py-3 tracking-wide transition-all duration-300 hover:bg-brand-brown/90 hover:-translate-y-0.5 hover:shadow-xl">
                  Contact now →
                </Link>
                <a href="tel:+34968241025" className="btn-outline">
                  ☎ 968 241 025
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale="en" />
      <ScrollReveal />
    </>
  );
}
