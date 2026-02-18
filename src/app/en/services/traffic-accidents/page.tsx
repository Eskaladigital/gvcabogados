import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Car, Scale, ShieldCheck, FileSearch, Gavel, Clock,
  Phone, AlertTriangle, HeartPulse, BadgeEuro, ArrowRight,
  CheckCircle2, ChevronRight, MapPin
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from '@/components/seo/SchemaOrg';
import { services } from '@/data/services';
import { supabaseAdmin } from '@/lib/supabase';

const SERVICE_KEY = 'accidentes-trafico';
const FOLDER_SLUG_EN = 'traffic-accidents';
const FOLDER_SLUG_ES = 'accidentes-trafico';

export const metadata: Metadata = {
  title: 'Traffic Accident Lawyers — Compensation Specialists | GVC Lawyers',
  description:
    'Specialist traffic accident lawyers. Experts in the damage assessment scale (Law 35/2015), maximum compensation and victim defence. Over 55 years of experience. No-obligation initial consultation. ☎ 968 241 025.',
  alternates: {
    canonical: `https://www.gvcabogados.com/en/services/${FOLDER_SLUG_EN}`,
    languages: { es: `/es/servicios/${FOLDER_SLUG_ES}` },
  },
  openGraph: {
    title: 'Traffic Accident Lawyers — GVC Lawyers',
    description:
      'Specialists in traffic accident claims, compensation and victim defence. Over 55 years of experience.',
    url: `https://www.gvcabogados.com/en/services/${FOLDER_SLUG_EN}`,
    siteName: 'García-Valcárcel & Cáceres Lawyers',
    locale: 'en_GB',
    type: 'website',
  },
};

async function getCitiesForService(): Promise<{ name: string; slug: string }[]> {
  const { data } = await supabaseAdmin
    .from('service_content')
    .select('slug_es, localities!inner(name, slug), services!inner(service_key)')
    .eq('services.service_key', SERVICE_KEY)
    .order('localities.name');

  if (!data || data.length === 0) return [];
  return data.map((row: any) => ({ name: row.localities.name, slug: row.localities.slug }));
}

const ACCIDENT_TYPES = [
  { icon: Car, title: 'Vehicle collisions', desc: 'Rear-end, head-on, side-impact and multi-vehicle crashes. We claim the maximum compensation from the at-fault driver\'s insurer.' },
  { icon: AlertTriangle, title: 'Pedestrian accidents', desc: 'Comprehensive defence of the injured pedestrian: compensation for injuries, moral damages and loss of earnings.' },
  { icon: HeartPulse, title: 'Serious injuries and permanent effects', desc: 'Whiplash, fractures, spinal cord injuries, traumatic brain injury. We assess every lasting effect to maximise compensation.' },
  { icon: ShieldCheck, title: 'Hit-and-run or uninsured drivers', desc: 'We claim from the Insurance Compensation Consortium when the at-fault driver flees or has no policy.' },
  { icon: Gavel, title: 'Commuting accidents (in itinere)', desc: 'Traffic accidents that occur on the way to or from work. Dual claim route: employment and civil liability.' },
  { icon: FileSearch, title: 'Road defects', desc: 'Accidents caused by poor road conditions: potholes, inadequate signage, unprotected roadworks. Government liability claims.' },
];

const DAMAGE_SCALE_ITEMS = [
  { label: 'Temporary injuries', desc: 'Basic personal damage + particular damage during recovery', value: '€30–100/day' },
  { label: 'Permanent effects', desc: 'Rated from 1 to 100 points depending on severity', value: '€800–250,000' },
  { label: 'Aesthetic damage', desc: 'From "slight" (1–6) to "very severe" (50)', value: '€1,000–150,000' },
  { label: 'Loss of earnings', desc: 'Income lost during sick leave and on a permanent basis', value: 'Variable' },
  { label: 'Future medical expenses', desc: 'Rehabilitation, prosthetics, home adaptations', value: 'Variable' },
  { label: 'Major disability', desc: 'Permanent need for third-party care', value: '€300,000+' },
];

const PROCESS = [
  { step: 1, title: 'Initial consultation and assessment', desc: 'We analyse the viability of your case at no obligation. We review accident reports, police statements and medical records.' },
  { step: 2, title: 'Evidence gathering', desc: 'We compile all documentation: insurer\'s report, medical history, expert reports and witness statements.' },
  { step: 3, title: 'Out-of-court claim', desc: 'We negotiate directly with the insurance company. 80 % of cases are resolved at this stage.' },
  { step: 4, title: 'Court proceedings', desc: 'If the offer is insufficient, we file a civil or criminal claim before the competent courts.' },
  { step: 5, title: 'Compensation payment', desc: 'We manage the full collection and verify that every item on the damage scale is included.' },
];

const FAQS = [
  { question: 'How long do I have to make a claim after a traffic accident?', answer: 'The general time limit is <strong>1 year</strong> from the date of the accident or from the date of final medical discharge (stabilisation of permanent effects). If criminal proceedings are opened, the deadline is suspended until the judgment or dismissal becomes final. It is essential to act as soon as possible to preserve evidence.' },
  { question: 'How much compensation am I entitled to after a traffic accident?', answer: 'It depends on the severity of the injuries, permanent effects, your age, employment situation and family circumstances. The <strong>traffic damage scale (Law 35/2015)</strong> sets out tables with valuation ranges. A minor whiplash injury may be worth between €2,000 and €6,000, while serious injuries with permanent effects can exceed €200,000. Our lawyers prepare a personalised calculation for every case.' },
  { question: 'Do I have to pay upfront to make a claim?', answer: 'At García-Valcárcel & Cáceres, the <strong>initial consultation is at no obligation</strong>. We also offer the possibility of working with a very small initial provision of funds, with the bulk of our fees payable upon receipt of compensation. This minimises the financial risk for the client.' },
  { question: 'What happens if the at-fault driver flees or has no insurance?', answer: 'You can claim from the <strong>Insurance Compensation Consortium</strong>, a public body that covers these situations. We handle the entire process so that you receive your compensation regardless.' },
  { question: 'Can I claim if the accident was partly my fault?', answer: 'Yes. In Spain, the principle of <strong>contributory negligence</strong> applies: if the other party was also at fault, you are entitled to compensation proportional to their share of liability. Our lawyers will argue that your share of responsibility is as low as possible.' },
  { question: 'How long does a traffic accident claim take to resolve?', answer: 'The out-of-court route is usually resolved in <strong>3 to 8 months</strong>. If the case goes to trial, the timeframe extends to <strong>12–18 months</strong> depending on the court. We work to resolve your case as quickly as possible without giving up the compensation you deserve.' },
];

export default async function TrafficAccidentsPage() {
  const svc = services.find(s => s.id === SERVICE_KEY)!;
  const cities = await getCitiesForService();

  const breadcrumbs = [
    { name: 'Home', href: '/en' },
    { name: 'Practice Areas', href: '/en/services' },
    { name: 'Traffic Accidents', href: `/en/services/${FOLDER_SLUG_EN}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ServiceSchema
        name="Traffic Accident Lawyers — García-Valcárcel & Cáceres"
        description={svc.descriptionEn}
        slug={FOLDER_SLUG_EN}
        locale="en"
      />
      <FAQSchema faqs={FAQS} />

      <Navbar locale="en" alternateUrl={`/es/servicios/${FOLDER_SLUG_ES}`} />

      <main>
        {/* ═══════════════════════════════════════
            HERO
        ═══════════════════════════════════════ */}
        <section className="bg-[#1a1a1a] relative overflow-hidden min-h-[85vh] flex flex-col">
          <div className="absolute inset-0 opacity-25 z-0">
            <Image
              src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
              alt="Traffic accident lawyers"
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
                  Civil liability specialists
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.8rem] font-bold text-white leading-[1.15] mb-5 md:mb-6">
                Traffic{' '}
                <em className="italic text-brand-gold font-normal">accident lawyers</em>
              </h1>

              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[560px]">
                We fight so you receive the <strong className="text-white">maximum compensation</strong> possible.
                Experts in the traffic damage scale, insurer negotiations and courtroom defence.
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

          {/* Stats bar */}
          <div className="relative z-[3] bg-brand-brown/90 backdrop-blur-sm border-t border-brand-dark/10">
            <div className="container-custom">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                {[
                  { value: '55+', label: 'Years of experience' },
                  { value: '80%', label: 'Resolved without trial' },
                  { value: 'Law 35/2015', label: 'Updated damage scale' },
                  { value: '100%', label: 'Client commitment' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="py-5 md:py-6 px-4 md:px-8 text-center border-r border-brand-dark/10 last:border-r-0 border-b md:border-b-0 border-brand-dark/10"
                  >
                    <div className="font-display text-2xl md:text-3xl font-bold text-brand-dark leading-none mb-1.5">
                      {stat.value}
                    </div>
                    <div className="text-[0.6rem] md:text-[0.65rem] text-brand-dark/70 uppercase tracking-[0.12em]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            INTRO — What we do
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom max-w-6xl">
            <div className="reveal grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-3">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                    Had an accident?
                  </span>
                </div>
                <h2 className="section-title mb-6">
                  We defend your rights as a traffic accident victim
                </h2>
                <div className="space-y-4 text-sm text-neutral-500 leading-relaxed">
                  <p>
                    After a traffic accident, insurance companies seek to minimise the compensation they pay out.
                    Our team knows their tactics and works to ensure you receive the <strong className="text-brand-dark">full compensation</strong> you are entitled to
                    under the personal injury damage assessment scale.
                  </p>
                  <p>
                    We handle <strong className="text-brand-dark">the entire process</strong>: from gathering evidence and obtaining the police report,
                    to negotiating directly with the insurer or, if necessary, defending your case in court.
                  </p>
                  <p>
                    We have a network of medical experts, accident reconstruction specialists and forensic professionals
                    who support our claims with rigorous technical reports.
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap mt-8">
                  <Link href="/en/contact" className="btn-primary">Assess my case →</Link>
                  <a href="tel:+34968241025" className="btn-outline-dark">☎ Call now</a>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
                      alt="Specialist traffic accident lawyers"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 400px"
                      quality={60}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-brand-brown-hover text-white p-6 rounded-2xl shadow-xl max-w-[220px]">
                    <div className="font-display text-3xl font-bold mb-1">Since 1970</div>
                    <div className="text-[0.65rem] text-white/80 uppercase tracking-wider">Defending accident victims</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            ACCIDENT TYPES
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="container-custom max-w-6xl">
            <div className="reveal text-center mb-14">
              <div className="flex items-center gap-3 justify-center mb-4">
                <span className="w-9 h-0.5 bg-brand-brown" />
                <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Areas of practice</span>
                <span className="w-9 h-0.5 bg-brand-brown" />
              </div>
              <h2 className="section-title mb-4">Types of accidents we handle</h2>
              <p className="text-sm text-neutral-400 max-w-xl mx-auto">
                Each type of accident has its own legal particularities. Our team has specific experience in all of them.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ACCIDENT_TYPES.map((tipo, i) => {
                const Icon = tipo.icon;
                return (
                  <div
                    key={i}
                    className="reveal group bg-white p-7 rounded-2xl border border-neutral-100 hover:border-brand-brown/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-brand-brown/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-brown group-hover:scale-110 transition-all">
                      <Icon size={22} className="text-brand-brown group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-brand-dark mb-2">{tipo.title}</h3>
                    <p className="text-[0.8rem] text-neutral-400 leading-relaxed">{tipo.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            DAMAGE SCALE — Law 35/2015
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-brand-dark relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(204,178,127,0.5) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(204,178,127,0.3) 0%, transparent 50%)',
            }}
          />
          <div className="container-custom max-w-6xl relative z-10">
            <div className="reveal grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                    Law 35/2015
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-6">
                  Personal injury damage assessment scale
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                  The traffic damage scale is the legal system that determines how compensation is calculated.
                  Thorough knowledge of it is the difference between an insufficient offer from the insurer and the <strong className="text-white">maximum compensation</strong> you are entitled to.
                </p>
                <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-xl">
                  <Scale size={28} className="text-brand-brown shrink-0" />
                  <p className="text-[0.8rem] text-neutral-300">
                    Our lawyers precisely calculate every compensable item so that <strong className="text-white">no damage goes unclaimed</strong>.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DAMAGE_SCALE_ITEMS.map((concepto, i) => (
                    <div key={i} className="reveal bg-white/[0.06] backdrop-blur-sm border border-white/10 p-5 rounded-xl hover:bg-white/[0.1] transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-serif text-base font-semibold text-white">{concepto.label}</h4>
                        <span className="text-[0.65rem] font-semibold text-brand-brown bg-brand-brown/15 px-2 py-0.5 rounded whitespace-nowrap ml-2">{concepto.value}</span>
                      </div>
                      <p className="text-[0.75rem] text-neutral-400 leading-relaxed">{concepto.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[0.65rem] text-neutral-500 mt-4 italic">
                  * Indicative ranges. The actual compensation depends on the circumstances of each case.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            PROCESS
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom max-w-6xl">
            <div className="reveal text-center mb-14">
              <div className="flex items-center gap-3 justify-center mb-4">
                <span className="w-9 h-0.5 bg-brand-brown" />
                <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                  Step by step
                </span>
                <span className="w-9 h-0.5 bg-brand-brown" />
              </div>
              <h2 className="section-title mb-4">How we handle your case</h2>
              <p className="text-sm text-neutral-400 max-w-xl mx-auto">
                A clear, transparent process focused on achieving the best possible outcome.
              </p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute top-0 bottom-0 left-[42px] w-px bg-brand-brown/20" />
              <div className="space-y-0">
                {PROCESS.map((item, i) => (
                  <div key={i} className="reveal relative flex gap-6 lg:gap-10 group">
                    <div className="hidden lg:flex flex-col items-center shrink-0">
                      <div className="w-[85px] h-[85px] bg-neutral-50 border-2 border-brand-brown/20 rounded-2xl flex items-center justify-center group-hover:bg-brand-brown group-hover:border-brand-brown transition-all z-10">
                        <span className="font-display text-2xl font-bold text-brand-brown group-hover:text-white transition-colors">{item.step}</span>
                      </div>
                    </div>
                    <div className="flex-1 pb-10 lg:pb-12">
                      <div className="bg-neutral-50 p-6 md:p-8 rounded-2xl border border-neutral-100 group-hover:border-brand-brown/20 group-hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-2 lg:hidden">
                          <span className="w-8 h-8 bg-brand-brown rounded-lg flex items-center justify-center text-sm font-bold text-white">{item.step}</span>
                        </div>
                        <h3 className="font-serif text-lg md:text-xl font-semibold text-brand-dark mb-2">{item.title}</h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            WHAT TO DO AFTER AN ACCIDENT
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="container-custom max-w-6xl">
            <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                    Practical guide
                  </span>
                </div>
                <h2 className="section-title mb-6">What to do immediately after an accident</h2>
                <p className="text-sm text-neutral-400 leading-relaxed mb-8">
                  The first steps after an accident are decisive for your subsequent claim. Follow these guidelines to protect your rights:
                </p>
                <div className="space-y-4">
                  {[
                    'Call 112 if anyone is injured. Medical assistance is the priority.',
                    'Do not move the vehicles until the police arrive (unless there is danger).',
                    'Fill in the European Accident Statement or request a police report.',
                    'Photograph the scene: vehicle positions, damage, road signs.',
                    'Go to A&E even if you think you have no serious injuries.',
                    'Do not sign any document from the other party\'s insurer without legal advice.',
                    'Contact a specialist lawyer before accepting any offer.',
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-7 h-7 bg-brand-brown rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={14} className="text-white" />
                      </div>
                      <p className="text-sm text-neutral-500 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-brand-brown-hover text-white p-8 md:p-10 rounded-2xl h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                      <Phone size={24} className="text-brand-brown" />
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl font-semibold mb-4">
                      Just had an accident?
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed mb-6">
                      Call us now. We will tell you exactly what steps to take to protect your right to fair compensation.
                      The initial consultation is at no obligation.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        'Immediate assessment of your case',
                        'Guidance on the first steps to take',
                        'No cost, no obligation',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                          <ChevronRight size={14} className="text-brand-brown shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
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

        {/* ═══════════════════════════════════════
            WHY CHOOSE US
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom max-w-6xl">
            <div className="reveal">
              <div className="bg-gradient-to-br from-brand-brown to-brand-brown/95 p-10 md:p-14 rounded-2xl">
                <div className="text-center mb-10">
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark mb-3">
                    Why choose García-Valcárcel & Cáceres?
                  </h2>
                  <p className="text-sm text-brand-dark/70 max-w-xl mx-auto">
                    Over seven decades resolving the most complex civil liability cases in Spain.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                  {[
                    { title: '55+', desc: 'Years of experience' },
                    { title: '1970', desc: 'Firm founded' },
                    { title: '5', desc: 'Specialist professionals' },
                    { title: 'All of Spain', desc: 'Based in Murcia, nationwide practice' },
                    { title: 'Direct contact', desc: 'With the lead lawyer' },
                    { title: 'No obligation', desc: 'Initial consultation' },
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
            CITIES
        ═══════════════════════════════════════ */}
        {cities.length > 0 && (
          <section className="py-16 md:py-20 bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-12">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                    Nationwide coverage
                  </span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">Traffic accident lawyers in your city</h2>
                <p className="text-sm text-neutral-400 max-w-xl mx-auto">
                  Based in Murcia, we offer in-person and video-conference consultations across Spain's main cities.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/en/services/${FOLDER_SLUG_EN}/${city.slug}`}
                    className="reveal group flex items-center gap-2 bg-white border border-neutral-200 px-4 py-3.5 rounded-xl hover:border-brand-brown hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <MapPin size={14} className="text-brand-brown/50 group-hover:text-brand-brown transition-colors shrink-0" />
                    <span className="text-sm font-medium text-brand-dark group-hover:text-brand-brown transition-colors">
                      {city.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            FAQs
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom max-w-4xl">
            <div className="reveal text-center mb-12">
              <div className="flex items-center gap-3 justify-center mb-4">
                <span className="w-9 h-0.5 bg-brand-brown" />
                <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">We answer your questions</span>
                <span className="w-9 h-0.5 bg-brand-brown" />
              </div>
              <h2 className="section-title mb-4">Frequently asked questions about traffic accidents</h2>
            </div>
            <div className="reveal space-y-4">
              {FAQS.map((faq, i) => (
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
                    <p className="pt-4 text-sm text-neutral-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </div>
                </details>
              ))}
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
                Don't let the insurer decide what your case is worth
              </h2>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                No-obligation initial consultation. We will honestly tell you what compensation you can expect
                and how we will fight to obtain it.
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
