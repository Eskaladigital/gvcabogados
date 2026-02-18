import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users, Heart, ShieldCheck, Scale, FileText, Home,
  Phone, ChevronRight, MapPin, ArrowRight, CheckCircle2, Clock,
  Handshake, Baby, BadgeEuro, BookOpen,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from '@/components/seo/SchemaOrg';
import { supabaseAdmin } from '@/lib/supabase';

const SERVICE_KEY = 'derecho-familia';
const FOLDER_SLUG_EN = 'family-law';
const FOLDER_SLUG_ES = 'derecho-familia';

export const metadata: Metadata = {
  title: 'Family Law Lawyers — Divorce, Custody, Child Support | GVC Lawyers',
  description:
    'Specialist family law lawyers: divorce, child custody, child support, visitation rights, division of assets. Over 55 years of experience. ☎ 968 241 025.',
  alternates: {
    canonical: `https://www.gvcabogados.com/en/services/${FOLDER_SLUG_EN}`,
    languages: { es: `/es/servicios/${FOLDER_SLUG_ES}` },
  },
  openGraph: {
    title: 'Family Law Lawyers — GVC Lawyers',
    description:
      'Specialists in family law: divorce, custody, child support, visitation rights and property division. Over 55 years of experience.',
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

const FAMILY_AREAS = [
  {
    icon: Heart,
    title: 'Divorce and separation',
    desc: 'We handle uncontested and contested divorces with the utmost discretion. We protect your interests and those of your children at every stage of the process.',
  },
  {
    icon: Baby,
    title: 'Child custody',
    desc: 'Sole custody, joint custody or modification of the current arrangement. We uphold the best interests of the child as the guiding principle.',
  },
  {
    icon: BadgeEuro,
    title: 'Child support',
    desc: 'Setting, modifying or claiming unpaid support. We act to ensure maintenance payments are fair and effectively enforced.',
  },
  {
    icon: Clock,
    title: 'Visitation rights',
    desc: 'Establishing, extending or restricting visitation arrangements. We safeguard the emotional stability of the children.',
  },
  {
    icon: Home,
    title: 'Division of assets',
    desc: 'Division of joint property after divorce: family home, bank accounts, investments and shared debts.',
  },
  {
    icon: Handshake,
    title: 'Family mediation',
    desc: 'We encourage agreement between the parties to reduce the emotional and financial cost. Dialogue as the preferred path.',
  },
  {
    icon: BookOpen,
    title: 'Domestic partnerships',
    desc: 'Advice on establishing, financial arrangements and dissolution of domestic partnerships. Legal rights and obligations.',
  },
  {
    icon: Scale,
    title: 'Domestic violence',
    desc: 'Comprehensive legal assistance for victims: protection orders, interim measures and support throughout the entire process.',
  },
];

const CONCERNS = [
  { question: 'What will happen to my children?', answer: 'The best interests of the child always prevail. We work to achieve the custody and visitation arrangement most beneficial for them, preserving the relationship with both parents.' },
  { question: 'Will I lose my home?', answer: 'Use of the family home is assigned based on several factors (child custody, ownership, financial situation). We advise you to protect your rights over the property.' },
  { question: 'How long will the process take?', answer: 'An uncontested divorce can be resolved in 2–3 months. A contested one may take 8–14 months depending on complexity. We give you realistic estimates from day one.' },
  { question: 'Can I modify the support later?', answer: 'Yes. When economic or personal circumstances change (job loss, remarriage, change of residence), you can apply to the court for a modification of the existing measures.' },
];

const PROCESS = [
  { step: 1, title: 'No-obligation initial consultation', desc: 'We listen to your situation in complete confidentiality. We evaluate the legal options and clearly explain what to expect in each scenario.' },
  { step: 2, title: 'Personalized strategy', desc: 'We design an action plan tailored to your circumstances: amicable resolution, mediation or litigation. You decide with all the information at hand.' },
  { step: 3, title: 'Negotiation or mediation', desc: 'We always try to reach a reasonable agreement. 70% of our family cases are resolved without the need for a trial.' },
  { step: 4, title: 'Court proceedings', desc: 'If an agreement is not possible, we defend your position before the court with determination and rigour. We prepare every detail of the case.' },
  { step: 5, title: 'Enforcement and follow-up', desc: 'We ensure the judgment is enforced: maintenance, visitation, division of assets. We stand by you until the end.' },
];

const FAQS = [
  { question: 'How much does a divorce cost?', answer: 'It depends on the type of divorce. An <strong>uncontested divorce</strong> is significantly more affordable than a contested one. At the initial consultation, after learning about your case, we provide a detailed and transparent quote with no surprises.' },
  { question: 'Can I get divorced without my spouse\'s agreement?', answer: 'Yes. In Spain, the other spouse\'s consent is not required to get divorced. It is sufficient that <strong>3 months have passed since the marriage</strong>. The divorce will proceed as contested if there is no agreement.' },
  { question: 'What is joint custody and when is it granted?', answer: 'Joint custody means both parents live with the children in alternating periods (weeks, fortnights or months). Courts grant it when it is shown to be <strong>in the best interests of the child</strong>, considering proximity of homes, work schedules and the prior relationship with both parents.' },
  { question: 'How much is child support?', answer: 'There is no fixed amount. It is calculated based on the <strong>income of the person obliged to pay</strong>, the children\'s needs (education, healthcare, leisure) and the family\'s previous standard of living. Courts apply indicative tables, but each case is unique.' },
  { question: 'Can a regulatory agreement already signed be modified?', answer: 'Yes, through a <strong>modification of measures</strong> procedure. It is necessary to demonstrate a substantial change in circumstances (job loss, relocation, illness, new needs of the children). We can process it by mutual agreement or through contested proceedings.' },
  { question: 'What rights do I have as a non-custodial parent?', answer: 'You have the right to a <strong>visitation and communication arrangement</strong> with your children, to be informed about their education, health and wellbeing, and to participate in the important decisions of their lives. If you are being prevented from having contact, we can apply for enforcement measures through the court.' },
];

export default async function FamilyLawPage() {
  const cities = await getCitiesForService();

  const breadcrumbs = [
    { name: 'Home', href: '/en' },
    { name: 'Practice Areas', href: '/en/services' },
    { name: 'Family Law', href: `/en/services/${FOLDER_SLUG_EN}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ServiceSchema
        name="Family Law Lawyers — García-Valcárcel & Cáceres"
        description="Specialist family law lawyers: divorce, child custody, child support, visitation rights and division of assets."
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
          <div className="absolute inset-0 opacity-20 z-0">
            <Image
              src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
              alt="Family law lawyers"
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={60}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(26,26,26,0.75)] via-[rgba(30,30,30,0.45)] to-[rgba(26,26,26,0.65)] z-[1]" />
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
                  Family Law
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.8rem] font-bold text-white leading-[1.15] mb-5 md:mb-6">
                <em className="italic text-brand-gold font-normal">Family law</em>{' '}
                lawyers
              </h1>

              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[560px]">
                We stand by you during the most difficult times with <strong className="text-white">empathy, discretion and legal rigour</strong>.
                Divorce, custody, child support and everything that affects your family.
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
                  { value: '70%', label: 'Resolved by agreement' },
                  { value: 'Since 1970', label: 'Family firm' },
                  { value: 'No obligation', label: 'Initial consultation' },
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
            INTRO — Human approach
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom max-w-6xl">
            <div className="reveal grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-3">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                    We understand your situation
                  </span>
                </div>
                <h2 className="section-title mb-6">
                  A firm that understands there is a family behind every case file
                </h2>
                <div className="space-y-4 text-sm text-neutral-500 leading-relaxed">
                  <p>
                    Family matters are not just another procedure. They affect the most important things in your life:
                    your children, your home, your emotional and financial stability. We know this, and that is why we work
                    with an approach that combines <strong className="text-brand-dark">legal firmness</strong> and <strong className="text-brand-dark">personal sensitivity</strong>.
                  </p>
                  <p>
                    Since 1970, García-Valcárcel & Cáceres has supported hundreds of families through divorce,
                    custody and support proceedings. Our experience allows us to anticipate scenarios,
                    propose realistic solutions and, above all, protect what matters most to you.
                  </p>
                  <p>
                    We always prioritise agreement and mediation, because a negotiated divorce is better for everyone
                    — especially for the children. But when agreement is not possible, we defend your position
                    before the courts with all the strength the case demands.
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap mt-8">
                  <Link href="/en/contact" className="btn-primary">Discuss my case →</Link>
                  <a href="tel:+34968241025" className="btn-outline-dark">☎ Call now</a>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
                      alt="Specialist family law lawyers"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 400px"
                      quality={60}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-brand-brown-hover text-white p-6 rounded-2xl shadow-xl max-w-[220px]">
                    <Heart size={20} className="text-brand-brown mb-2" />
                    <div className="font-display text-3xl font-bold mb-1">Since 1970</div>
                    <div className="text-[0.65rem] text-white/80 uppercase tracking-wider">Protecting families</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            FAMILY LAW AREAS
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="container-custom max-w-6xl">
            <div className="reveal text-center mb-14">
              <div className="flex items-center gap-3 justify-center mb-4">
                <span className="w-9 h-0.5 bg-brand-brown" />
                <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Areas of practice</span>
                <span className="w-9 h-0.5 bg-brand-brown" />
              </div>
              <h2 className="section-title mb-4">How we can help you</h2>
              <p className="text-sm text-neutral-400 max-w-xl mx-auto">
                Family law encompasses very different situations. Our team has specific experience in each of them.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {FAMILY_AREAS.map((area, i) => {
                const Icon = area.icon;
                return (
                  <div
                    key={i}
                    className="reveal group bg-white p-7 rounded-2xl border border-neutral-100 hover:border-brand-brown/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-brand-brown/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-brown group-hover:scale-110 transition-all">
                      <Icon size={22} className="text-brand-brown group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-brand-dark mb-2">{area.title}</h3>
                    <p className="text-[0.8rem] text-neutral-400 leading-relaxed">{area.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            COMMON CONCERNS
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
                    We know what worries you
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-6">
                  The questions you ask yourself before taking the step
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                  Before starting a family law process, it is normal to have doubts and fears.
                  We answer them transparently so you can make informed decisions.
                </p>
                <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-xl">
                  <ShieldCheck size={28} className="text-brand-brown shrink-0" />
                  <p className="text-[0.8rem] text-neutral-300">
                    Everything you tell us is protected by <strong className="text-white">professional privilege</strong>.
                    Maximum confidentiality guaranteed.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="space-y-4">
                  {CONCERNS.map((item, i) => (
                    <div key={i} className="reveal bg-white/[0.06] backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:bg-white/[0.1] transition-all">
                      <h4 className="font-serif text-base font-semibold text-white mb-2">{item.question}</h4>
                      <p className="text-[0.8rem] text-neutral-400 leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            WORKING PROCESS
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
              <h2 className="section-title mb-4">How we handle your family case</h2>
              <p className="text-sm text-neutral-400 max-w-xl mx-auto">
                A clear, human process designed to protect what matters most: your family.
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
            BANNER — Uncontested vs. Contested
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-neutral-50">
          <div className="container-custom max-w-6xl">
            <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-8 md:p-10 rounded-2xl border border-neutral-100 hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-brand-brown/10 rounded-xl flex items-center justify-center mb-6">
                  <Handshake size={28} className="text-brand-brown" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-brand-dark mb-3">Uncontested divorce</h3>
                <ul className="space-y-3 text-sm text-neutral-500">
                  {[
                    'Estimated duration: 2–3 months',
                    'Lower financial and emotional cost',
                    'Regulatory agreement negotiated by both parties',
                    'A single lawyer can represent both spouses',
                    'Ideal when there is willingness to agree',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-brand-brown shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-brand-brown-hover text-white p-8 md:p-10 rounded-2xl">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                  <Scale size={28} className="text-brand-brown" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">Contested divorce</h3>
                <ul className="space-y-3 text-sm text-white/80">
                  {[
                    'When agreement is not possible',
                    'Estimated duration: 8–14 months',
                    'Each party with their own lawyer',
                    'The judge decides on custody, support and assets',
                    'We defend your position with determination',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight size={14} className="text-brand-brown shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-white/15">
                  <p className="text-[0.8rem] text-white/70">
                    Our goal is always to explore the amicable route first. If that is not possible,
                    you will have an experienced team by your side.
                  </p>
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
                    Why trust García-Valcárcel & Cáceres?
                  </h2>
                  <p className="text-sm text-brand-dark/70 max-w-xl mx-auto">
                    Over seven decades supporting families through the most sensitive moments.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                  {[
                    { title: '55+', desc: 'Years of experience' },
                    { title: '1970', desc: 'Year the firm was founded' },
                    { title: '5', desc: 'Specialist professionals' },
                    { title: 'All of Spain', desc: 'Based in Murcia, nationwide service' },
                    { title: 'Direct contact', desc: 'With the lead lawyer' },
                    { title: 'Discretion', desc: 'Maximum confidentiality' },
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
                <h2 className="section-title mb-4">Family lawyers in your city</h2>
                <p className="text-sm text-neutral-400 max-w-xl mx-auto">
                  Based in Murcia, we offer in-person and video conference consultations in the main cities across Spain.
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
              <h2 className="section-title mb-4">Frequently asked questions about family law</h2>
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
                Let us protect what matters most to you
              </h2>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                No-obligation initial consultation. We listen to you, analyse your situation and clearly explain
                your options and what you can expect.
              </p>
              <div className="flex gap-3 md:gap-4 items-center flex-wrap justify-center">
                <Link href="/en/contact" className="inline-flex items-center gap-2 bg-brand-brown text-white text-xs font-semibold px-8 py-4 tracking-wide transition-all duration-300 hover:bg-brand-brown/80 hover:-translate-y-0.5 hover:shadow-xl">
                  Get in touch — no obligation →
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
