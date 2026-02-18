import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Car, Scale, Phone, MapPin, CheckCircle2, ChevronRight,
  ArrowRight, Clock, ShieldCheck
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import RichTextContent from '@/components/content/RichTextContent';
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from '@/components/seo/SchemaOrg';
import { getServiceContentByServiceAndCity } from '@/lib/service-content';
import { supabaseAdmin } from '@/lib/supabase';

const SERVICE_KEY = 'accidentes-trafico';
const SERVICE_NAME_EN = 'Traffic Accidents';
const FOLDER_SLUG_EN = 'traffic-accidents';
const FOLDER_SLUG_ES = 'accidentes-trafico';

interface Props {
  params: { city: string };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const { data } = await supabaseAdmin
    .from('service_content')
    .select('localities!inner(slug), services!inner(service_key)')
    .eq('services.service_key', SERVICE_KEY);

  if (!data || data.length === 0) return [{ city: 'murcia' }];
  return data.map((row: any) => ({ city: row.localities.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getServiceContentByServiceAndCity(SERVICE_KEY, params.city);
  if (!content) return {};

  const cityName = content.localityName;
  const title = content.titleEn || `Traffic Accident Lawyers in ${cityName} — GVC Lawyers`;
  const description = content.metaDescriptionEn || content.shortDescriptionEn ||
    `Specialist traffic accident lawyers in ${cityName}. Maximum compensation, traffic damage scale, victim defence. Over 55 years of experience. ☎ 968 241 025.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.gvcabogados.com/en/services/${FOLDER_SLUG_EN}/${params.city}`,
      languages: { es: `/es/servicios/${FOLDER_SLUG_ES}/${params.city}` },
    },
    openGraph: { title, description, locale: 'en_GB', type: 'website', url: `https://www.gvcabogados.com/en/services/${FOLDER_SLUG_EN}/${params.city}` },
  };
}

const DEFAULT_STATS = [
  { value: '55+', label: 'Years of experience' },
  { value: 'Law 35/2015', label: 'Updated damage scale' },
  { value: 'No obligation', label: 'Initial consultation' },
];

const DEFAULT_TIPOS_ACCIDENTE = [
  { titulo: 'Collisions', descripcion: 'Head-on, side-impact, rear-end and multi-vehicle crashes.', icon: 'car' },
  { titulo: 'Pedestrian accidents', descripcion: 'Pedestrians and cyclists struck by vehicles.', icon: 'shield' },
  { titulo: 'Road departures', descripcion: 'Rollovers, embankment falls and accidents caused by road conditions.', icon: 'clock' },
  { titulo: 'Motorcycle accidents', descripcion: 'Motorbike crashes involving serious injuries and permanent effects.', icon: 'car' },
];

const DEFAULT_QUE_HACER = [
  { paso: '1', titulo: 'Secure the scene', descripcion: 'Set up warning signs and turn on your hazard lights.' },
  { paso: '2', titulo: 'Attend to the injured', descripcion: 'Call 112 if anyone is hurt. Do not move victims unless there is danger.' },
  { paso: '3', titulo: 'Document the accident', descripcion: 'Take photos, collect the other driver\'s details and any witness information.' },
  { paso: '4', titulo: 'Accident statement', descripcion: 'Complete the European Accident Statement if possible.' },
  { paso: '5', titulo: 'Medical attention', descripcion: 'Go to A&E even if you have no apparent injuries.' },
  { paso: '6', titulo: 'Contact your lawyer', descripcion: 'Do not sign anything from the insurer without legal advice.' },
];

export default async function TrafficAccidentsLocalPage({ params }: Props) {
  const content = await getServiceContentByServiceAndCity(SERVICE_KEY, params.city);
  if (!content) notFound();

  const cityName = content.localityName;
  const faqs = content.faqsEn || [];
  const sections = content.sectionsEn || [];
  const process = content.processEn || [];
  const custom = content.customSectionsEn || {};

  const stats = (custom.stats as typeof DEFAULT_STATS) || [
    ...DEFAULT_STATS.slice(0, 1),
    { value: cityName, label: 'In-person and online service' },
    ...DEFAULT_STATS.slice(1),
  ];
  const tiposAccidente = (custom.tipos_accidente as typeof DEFAULT_TIPOS_ACCIDENTE) || DEFAULT_TIPOS_ACCIDENTE;
  const queHacer = (custom.que_hacer as typeof DEFAULT_QUE_HACER) || DEFAULT_QUE_HACER;
  const customIntro = custom.intro as string | undefined;

  const breadcrumbs = [
    { name: 'Home', href: '/en' },
    { name: 'Practice Areas', href: '/en/services' },
    { name: 'Traffic Accidents', href: `/en/services/${FOLDER_SLUG_EN}` },
    { name: `${SERVICE_NAME_EN} in ${cityName}`, href: `/en/services/${FOLDER_SLUG_EN}/${params.city}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ServiceSchema
        name={content.titleEn || `Traffic Accident Lawyers in ${cityName}`}
        description={content.longDescriptionEn || ''}
        slug={`${FOLDER_SLUG_EN}/${content.localitySlug}`}
        locale="en"
      />
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}

      <Navbar locale="en" />

      <main>
        {/* ═══════════════════════════════════════
            HERO — local, with prominent city name
        ═══════════════════════════════════════ */}
        <section className="bg-[#1a1a1a] relative overflow-hidden min-h-[75vh] md:min-h-[80vh] flex flex-col">
          <div className="absolute inset-0 opacity-25 z-0">
            <Image
              src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
              alt={`Traffic accident lawyers in ${cityName}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={60}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(26,26,26,0.7)] via-[rgba(30,30,30,0.4)] to-[rgba(26,26,26,0.6)] z-[1]" />
          <div
            className="absolute inset-0 opacity-[0.03] z-[1]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />

          <div className="container-custom relative z-[2] flex-1 flex items-center py-14 md:py-20">
            <div className="max-w-[720px] w-full">
              <Breadcrumbs items={breadcrumbs} />

              <div className="flex items-center gap-3 mb-6 md:mb-8 mt-6">
                <span className="w-9 h-0.5 bg-brand-brown" />
                <span className="text-[0.7rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                  <MapPin size={12} className="inline mr-1 -mt-0.5" />
                  {cityName}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.15] mb-5 md:mb-6">
                Traffic{' '}
                <em className="italic text-brand-gold font-normal">accident lawyers</em>{' '}
                in {cityName}
              </h1>

              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[580px]">
                {content.shortDescriptionEn || `Specialists in traffic accident claims in ${cityName}. Maximum compensation, insurer negotiations and court defence.`}
              </p>

              <div className="flex gap-3 md:gap-4 items-center flex-wrap">
                <Link href="/en/contact" className="btn-primary">
                  No-obligation initial consultation →
                </Link>
                <a href="tel:+34968241025" className="btn-outline">
                  ☎ 968 241 025
                </a>
              </div>
            </div>
          </div>

          {/* Stats bar — dynamic from custom_sections_en.stats */}
          <div className="relative z-[3] bg-brand-brown/90 backdrop-blur-sm border-t border-brand-dark/10">
            <div className="container-custom">
              <div className={`grid grid-cols-2 md:grid-cols-${stats.length} gap-0`}>
                {stats.map((stat, i) => (
                  <div key={i} className="py-5 md:py-6 px-4 md:px-8 text-center border-r border-brand-dark/10 last:border-r-0 border-b md:border-b-0 border-brand-dark/10">
                    <div className="font-display text-xl md:text-2xl font-bold text-brand-dark leading-none mb-1.5">{stat.value}</div>
                    <div className="text-[0.6rem] md:text-[0.65rem] text-brand-dark/70 uppercase tracking-[0.12em]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            INTRO — Local content
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom max-w-6xl">
            <div className="reveal">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-0.5 bg-brand-brown" />
                <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                  Specialists in {cityName}
                </span>
              </div>
              <h2 className="section-title mb-6">
                {content.titleEn || `Traffic accident lawyers in ${cityName}`}
              </h2>

              <div className="relative float-right ml-8 mb-6 w-full sm:w-[320px] lg:w-[380px]">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
                    alt={`Traffic accident lawyers ${cityName}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 380px"
                    quality={60}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-brand-brown-hover text-white p-6 rounded-2xl shadow-xl max-w-[220px]">
                  <MapPin size={20} className="text-brand-brown mb-2" />
                  <div className="font-display text-xl font-bold mb-1">{cityName}</div>
                  <div className="text-[0.65rem] text-white/80 uppercase tracking-wider">In-person and online service</div>
                </div>
              </div>

              <div className="text-sm text-neutral-500 leading-relaxed space-y-4">
                <RichTextContent content={customIntro || content.longDescriptionEn || ''} />
              </div>

              <div className="clear-both" />

              <div className="flex gap-3 flex-wrap mt-8">
                <Link href="/en/contact" className="btn-primary">Assess my case →</Link>
                <a href="tel:+34968241025" className="btn-outline-dark">☎ Call now</a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            ACCIDENT TYPES — dynamic from custom_sections_en
        ═══════════════════════════════════════ */}
        {tiposAccidente.length > 0 && (
          <section className="py-16 md:py-24 bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-14">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Specialities</span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">Types of traffic accidents in {cityName}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {tiposAccidente.map((tipo, i) => (
                  <div key={i} className="reveal group bg-white p-7 rounded-2xl border border-neutral-100 hover:border-brand-brown/30 hover:shadow-lg transition-all text-center">
                    <div className="w-14 h-14 mx-auto mb-5 bg-brand-brown/10 rounded-xl flex items-center justify-center group-hover:bg-brand-brown transition-all">
                      <Car size={24} className="text-brand-brown group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-brand-dark mb-2">{tipo.titulo}</h3>
                    <p className="text-[0.8rem] text-neutral-400 leading-relaxed">{tipo.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            LOCAL CONTENT SECTIONS
        ═══════════════════════════════════════ */}
        {sections.length > 0 && (
          <section className="py-16 md:py-24 bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-14">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Relevant information</span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">Traffic accidents in {cityName}: what you need to know</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section, i) => (
                  <div
                    key={i}
                    className="reveal group bg-white p-7 md:p-8 rounded-2xl border border-neutral-100 hover:border-brand-brown/30 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-11 h-11 bg-brand-brown rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-base font-bold text-white">{i + 1}</span>
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-brand-dark pt-1.5">{section.title}</h3>
                    </div>
                    <div className="pl-[60px]">
                      <RichTextContent content={section.content} className="text-[0.8rem] [&_p]:text-[0.8rem] [&_p]:text-neutral-400 [&_li]:text-[0.8rem] [&_li]:text-neutral-400 leading-relaxed" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            DAMAGE SCALE BANNER
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-brand-dark relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(204,178,127,0.5) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(204,178,127,0.3) 0%, transparent 50%)',
            }}
          />
          <div className="container-custom max-w-5xl relative z-10">
            <div className="reveal flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-brand-brown rounded-2xl flex items-center justify-center shrink-0">
                <Scale size={40} className="text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-white mb-3">
                  Traffic Damage Scale experts in {cityName}
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl">
                  We apply the <strong className="text-white">Damage Assessment System (Law 35/2015)</strong> to calculate
                  the maximum compensation in every case: temporary injuries, permanent effects, financial loss and loss of earnings.
                </p>
              </div>
              <div className="shrink-0">
                <Link href="/en/contact" className="btn-primary whitespace-nowrap">
                  Assess my case →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            WHAT TO DO AFTER AN ACCIDENT — dynamic
        ═══════════════════════════════════════ */}
        {queHacer.length > 0 && (
          <section className="py-16 md:py-24 bg-neutral-50">
            <div className="container-custom max-w-5xl">
              <div className="reveal text-center mb-14">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Practical guide</span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">What to do after a traffic accident in {cityName}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {queHacer.map((item, i) => (
                  <div key={i} className="reveal group bg-white p-7 rounded-2xl border border-neutral-100 hover:border-brand-brown/30 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-11 h-11 bg-brand-brown rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-base font-bold text-white">{item.paso}</span>
                      </div>
                      <h3 className="font-serif text-base font-semibold text-brand-dark pt-2">{item.titulo}</h3>
                    </div>
                    <p className="text-[0.8rem] text-neutral-400 leading-relaxed pl-[60px]">{item.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            PROCESS + EMERGENCY CTA
        ═══════════════════════════════════════ */}
        {process.length > 0 && (
          <section className="py-16 md:py-24 bg-white">
            <div className="container-custom max-w-6xl">
              <div className="reveal grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-9 h-0.5 bg-brand-brown" />
                    <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Our process</span>
                  </div>
                  <h2 className="section-title mb-8">How we handle your case in {cityName}</h2>

                  <div className="space-y-0">
                    {process.map((step, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-neutral-100 border-2 border-brand-brown/20 rounded-xl flex items-center justify-center group-hover:bg-brand-brown group-hover:border-brand-brown transition-all shrink-0">
                            <span className="font-display text-base font-bold text-brand-brown group-hover:text-white transition-colors">{i + 1}</span>
                          </div>
                          {i < process.length - 1 && <div className="w-px flex-1 bg-brand-brown/15 my-1" />}
                        </div>
                        <div className="pb-8">
                          <p className="text-sm text-neutral-500 leading-relaxed pt-2">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-brand-brown-hover text-white p-8 md:p-10 rounded-2xl sticky top-24">
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                      <Phone size={24} className="text-brand-brown" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-4">
                      Had an accident in {cityName}?
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed mb-6">
                      We advise you from the very first moment. No-obligation initial consultation.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        'Immediate assessment of your case',
                        `In-person and online service in ${cityName}`,
                        'No upfront fees',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                          <CheckCircle2 size={14} className="text-brand-brown shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col gap-3">
                      <a href="tel:+34968241025" className="inline-flex items-center justify-center gap-2 bg-brand-brown text-white text-sm font-semibold px-6 py-4 rounded-xl transition-all hover:bg-brand-brown/80 hover:shadow-xl">
                        <Phone size={18} /> 968 241 025
                      </a>
                      <Link href="/en/contact" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white text-sm font-medium px-6 py-3 rounded-xl border border-white/20 transition-all hover:bg-white/20">
                        Send us a message →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            WHY CHOOSE US — localised
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-neutral-50">
          <div className="container-custom max-w-6xl">
            <div className="reveal">
              <div className="bg-gradient-to-br from-brand-brown to-brand-brown/95 p-10 md:p-14 rounded-2xl">
                <div className="text-center mb-10">
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark mb-3">
                    Why choose García-Valcárcel & Cáceres in {cityName}?
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                  {[
                    { title: '55+', desc: 'Years of experience' },
                    { title: '1970', desc: 'Firm founded' },
                    { title: '5', desc: 'Specialist professionals' },
                    { title: cityName, desc: 'In-person and video conference' },
                    { title: 'Direct contact', desc: 'With the lead lawyer' },
                    { title: 'Murcia HQ', desc: 'Practising across Spain' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/90 p-5 md:p-6 rounded-xl hover:bg-white hover:scale-[1.03] transition-all text-center">
                      <div className="font-display text-xl md:text-2xl font-bold text-brand-brown-hover mb-1">{item.title}</div>
                      <div className="text-[0.65rem] text-neutral-500 uppercase tracking-wider">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            FAQs
        ═══════════════════════════════════════ */}
        {faqs.length > 0 && (
          <section className="py-16 md:py-24 bg-white">
            <div className="container-custom max-w-4xl">
              <div className="reveal text-center mb-12">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">We answer your questions</span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">Frequently asked questions about traffic accidents in {cityName}</h2>
              </div>
              <div className="reveal space-y-4">
                {faqs.map((faq, i) => (
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

        {/* ═══════════════════════════════════════
            LINK TO GENERIC + OTHER CITIES
        ═══════════════════════════════════════ */}
        <section className="py-12 md:py-16 bg-neutral-50 border-t border-neutral-200">
          <div className="container-custom max-w-4xl">
            <div className="reveal text-center">
              <p className="text-sm text-neutral-400 mb-4">
                Also visit our general traffic accidents page for information
                on the damage scale, types of accidents and the full claims process.
              </p>
              <Link
                href={`/en/services/${FOLDER_SLUG_EN}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-brown hover:text-brand-brown-hover transition-colors"
              >
                View the general Traffic Accidents page <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            FINAL CTA
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-brand-dark relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(204,178,127,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(204,178,127,0.3) 0%, transparent 50%)',
            }}
          />
          <div className="container-custom max-w-4xl relative z-10">
            <div className="reveal text-center">
              <div className="w-20 h-20 bg-brand-brown rounded-2xl flex items-center justify-center mx-auto mb-8 relative">
                <Image
                  src="/images/logo/gvcabogados_murcia_logo_leon_blanco.webp"
                  alt="GVC Lawyers"
                  fill
                  className="object-contain p-4"
                  sizes="80px"
                />
              </div>
              <h2 className="section-title-white mb-6">
                Traffic accident lawyers in {cityName}
              </h2>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-4 max-w-2xl mx-auto">
                Our head office is at <strong className="text-white">Gran Vía, 15 — 3rd Floor, 30008 Murcia</strong>.
              </p>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                We serve clients in {cityName} in person and by video conference.
                No-obligation initial consultation.
              </p>
              <div className="flex gap-3 md:gap-4 items-center flex-wrap justify-center">
                <Link href="/en/contact" className="inline-flex items-center gap-2 bg-brand-brown text-white text-xs font-semibold px-8 py-4 tracking-wide transition-all duration-300 hover:bg-brand-brown/80 hover:-translate-y-0.5 hover:shadow-xl">
                  No-obligation consultation →
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
