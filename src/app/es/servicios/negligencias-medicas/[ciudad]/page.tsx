import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Stethoscope, AlertTriangle, Scale, Phone, MapPin, CheckCircle2,
  ArrowRight, Clock, ShieldCheck, Hospital, FileText
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import RichTextContent from '@/components/content/RichTextContent';
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from '@/components/seo/SchemaOrg';
import { getServiceContentByServiceAndCity } from '@/lib/service-content';
import { supabaseAdmin } from '@/lib/supabase';

const SERVICE_KEY = 'negligencias-medicas';
const SERVICE_NAME = 'Negligencias Médicas';
const FOLDER_SLUG = 'negligencias-medicas';

interface Props {
  params: { ciudad: string };
}

export const dynamicParams = false;
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = new Set<string>();

  const { data: nuevo } = await supabaseAdmin
    .from('svc_negligencias_medicas')
    .select('localities!inner(slug)');
  if (nuevo) nuevo.forEach((r: any) => slugs.add(r.localities.slug));

  const { data: legacy } = await supabaseAdmin
    .from('service_content')
    .select('localities!inner(slug), services!inner(service_key)')
    .eq('services.service_key', SERVICE_KEY);
  if (legacy) legacy.forEach((r: any) => slugs.add(r.localities.slug));

  if (slugs.size === 0) return [{ ciudad: 'murcia' }];
  return [...slugs].map((slug) => ({ ciudad: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getServiceContentByServiceAndCity(SERVICE_KEY, params.ciudad);
  if (!content) return {};

  const cityName = content.localityName;
  const title = content.titleEs || `Abogados de Negligencias Médicas en ${cityName} — GVC Abogados`;
  const description = content.metaDescriptionEs || content.shortDescriptionEs ||
    `Abogados especialistas en negligencias médicas en ${cityName}. Errores de diagnóstico, cirugías, urgencias. Más de 55 años de experiencia. ☎ 968 241 025.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.gvcabogados.com/es/servicios/${FOLDER_SLUG}/${params.ciudad}`,
      languages: { en: `/en/services/medical-malpractice/${params.ciudad}` },
    },
    openGraph: { title, description, locale: 'es_ES', type: 'website', url: `https://www.gvcabogados.com/es/servicios/${FOLDER_SLUG}/${params.ciudad}` },
  };
}

const DEFAULT_STATS = [
  { value: '55+', label: 'Años de experiencia' },
  { value: 'Peritos médicos', label: 'Valoración especializada' },
  { value: 'Sin compromiso', label: 'Primera consulta' },
];

const DEFAULT_TIPOS_NEGLIGENCIA = [
  { titulo: 'Errores de diagnóstico', descripcion: 'Diagnósticos tardíos, incorrectos u omitidos que agravan la patología del paciente.', icon: 'stethoscope' },
  { titulo: 'Negligencias quirúrgicas', descripcion: 'Errores durante intervenciones: material olvidado, cirugía en zona incorrecta, complicaciones evitables.', icon: 'alert' },
  { titulo: 'Urgencias y triaje', descripcion: 'Altas prematuras, tiempos de espera excesivos o falta de atención en urgencias hospitalarias.', icon: 'clock' },
  { titulo: 'Negligencias obstétricas', descripcion: 'Lesiones al neonato o a la madre durante el parto por mala praxis médica.', icon: 'hospital' },
  { titulo: 'Errores de medicación', descripcion: 'Prescripción incorrecta, sobredosis, interacciones no controladas o alergias no verificadas.', icon: 'file' },
  { titulo: 'Infecciones hospitalarias', descripcion: 'Contagios nosocomiales evitables por deficiencias en protocolos de higiene y esterilización.', icon: 'shield' },
];

const DEFAULT_HOSPITALES: Array<{ nombre: string; tipo: string; direccion: string }> = [];

export default async function NegligenciasMedicasLocalPage({ params }: Props) {
  const content = await getServiceContentByServiceAndCity(SERVICE_KEY, params.ciudad);
  if (!content) notFound();

  const cityName = content.localityName;
  const faqs = content.faqsEs || [];
  const sections = content.sectionsEs || [];
  const process = content.processEs || [];
  const custom = content.customSectionsEs || {};

  const stats = (custom.stats as typeof DEFAULT_STATS) || [
    ...DEFAULT_STATS.slice(0, 1),
    { value: cityName, label: 'Atención presencial y online' },
    ...DEFAULT_STATS.slice(1),
  ];
  const tiposNegligencia = (custom.tipos_negligencia as typeof DEFAULT_TIPOS_NEGLIGENCIA) || DEFAULT_TIPOS_NEGLIGENCIA;
  const hospitales = (custom.hospitales as typeof DEFAULT_HOSPITALES) || DEFAULT_HOSPITALES;
  const customIntro = custom.intro as string | undefined;

  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: 'Áreas de Práctica', href: '/es/servicios' },
    { name: 'Negligencias Médicas', href: `/es/servicios/${FOLDER_SLUG}` },
    { name: `${SERVICE_NAME} en ${cityName}`, href: `/es/servicios/${FOLDER_SLUG}/${params.ciudad}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ServiceSchema
        name={content.titleEs || `Abogados de Negligencias Médicas en ${cityName}`}
        description={content.longDescriptionEs || ''}
        slug={`${FOLDER_SLUG}/${content.localitySlug}`}
        locale="es"
      />
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}

      <Navbar locale="es" />

      <main>
        {/* HERO */}
        <section className="bg-[#1a1a1a] relative overflow-hidden min-h-[75vh] md:min-h-[80vh] flex flex-col">
          <div className="absolute inset-0 opacity-25 z-0">
            <Image
              src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
              alt={`Abogados de negligencias médicas en ${cityName}`}
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
                Abogados de{' '}
                <em className="italic text-brand-gold font-normal">negligencias médicas</em>{' '}
                en {cityName}
              </h1>

              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[580px]">
                {content.shortDescriptionEs || `Especialistas en reclamaciones por negligencias médicas en ${cityName}. Errores de diagnóstico, cirugías, urgencias y mala praxis hospitalaria.`}
              </p>

              <div className="flex gap-3 md:gap-4 items-center flex-wrap">
                <Link href="/es/contacto" className="btn-primary">
                  Primera consulta sin compromiso →
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

        {/* INTRO */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom max-w-6xl">
            <div className="reveal">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-0.5 bg-brand-brown" />
                <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                  Especialistas en {cityName}
                </span>
              </div>
              <h2 className="section-title mb-6">
                {content.titleEs || `Abogados de negligencias médicas en ${cityName}`}
              </h2>

              <div className="relative float-right ml-8 mb-6 w-full sm:w-[320px] lg:w-[380px]">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
                    alt={`Abogados negligencias médicas ${cityName}`}
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
                  <div className="text-[0.65rem] text-white/80 uppercase tracking-wider">Atención presencial y online</div>
                </div>
              </div>

              <div className="text-sm text-neutral-500 leading-relaxed space-y-4">
                <RichTextContent content={customIntro || content.longDescriptionEs || ''} />
              </div>

              <div className="clear-both" />

              <div className="flex gap-3 flex-wrap mt-8">
                <Link href="/es/contacto" className="btn-primary">Valorar mi caso →</Link>
                <a href="tel:+34968241025" className="btn-outline-dark">☎ Llamar ahora</a>
              </div>
            </div>
          </div>
        </section>

        {/* TIPOS DE NEGLIGENCIA */}
        {tiposNegligencia.length > 0 && (
          <section className="py-16 md:py-24 bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-14">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Especialidades</span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">Tipos de negligencia médica en {cityName}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {tiposNegligencia.map((tipo, i) => (
                  <div key={i} className="reveal group bg-white p-7 rounded-2xl border border-neutral-100 hover:border-brand-brown/30 hover:shadow-lg transition-all text-center">
                    <div className="w-14 h-14 mx-auto mb-5 bg-brand-brown/10 rounded-xl flex items-center justify-center group-hover:bg-brand-brown transition-all">
                      <Stethoscope size={24} className="text-brand-brown group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-brand-dark mb-2">{tipo.titulo}</h3>
                    <p className="text-[0.8rem] text-neutral-400 leading-relaxed">{tipo.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECCIONES DE CONTENIDO LOCAL */}
        {sections.length > 0 && (
          <section className="py-16 md:py-24 bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-14">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Información relevante</span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">Negligencias médicas en {cityName}: lo que debe saber</h2>
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

        {/* BANNER: PLAZOS DE RECLAMACIÓN */}
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
                <Clock size={40} className="text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-white mb-3">
                  Plazos de reclamación por negligencia médica
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl">
                  La acción de responsabilidad civil médica prescribe en <strong className="text-white">1 año</strong> desde que el paciente conoce el daño.
                  Si la negligencia ocurrió en la sanidad pública, el plazo de responsabilidad patrimonial es de <strong className="text-white">1 año</strong> (vía administrativa).
                  No deje pasar estos plazos: actuar a tiempo es fundamental para su reclamación.
                </p>
              </div>
              <div className="shrink-0">
                <Link href="/es/contacto" className="btn-primary whitespace-nowrap">
                  Consultar plazos →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* HOSPITALES Y CENTROS DE REFERENCIA */}
        {hospitales.length > 0 && (
          <section className="py-16 md:py-24 bg-neutral-50">
            <div className="container-custom max-w-5xl">
              <div className="reveal text-center mb-14">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Centros sanitarios</span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">Hospitales y centros de referencia en {cityName}</h2>
                <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
                  Si ha sufrido una negligencia en alguno de estos centros, podemos ayudarle con su reclamación.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {hospitales.map((hosp, i) => (
                  <div key={i} className="reveal group bg-white p-7 rounded-2xl border border-neutral-100 hover:border-brand-brown/30 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-11 h-11 bg-brand-brown/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-brown transition-all">
                        <Hospital size={20} className="text-brand-brown group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-semibold text-brand-dark">{hosp.nombre}</h3>
                        <span className="text-[0.65rem] text-brand-brown uppercase tracking-wider">{hosp.tipo}</span>
                      </div>
                    </div>
                    <p className="text-[0.8rem] text-neutral-400 leading-relaxed pl-[60px]">{hosp.direccion}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PROCESO + CTA */}
        {process.length > 0 && (
          <section className="py-16 md:py-24 bg-white">
            <div className="container-custom max-w-6xl">
              <div className="reveal grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-9 h-0.5 bg-brand-brown" />
                    <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Nuestro proceso</span>
                  </div>
                  <h2 className="section-title mb-8">Cómo gestionamos su reclamación en {cityName}</h2>

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
                      ¿Ha sufrido una negligencia médica en {cityName}?
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed mb-6">
                      Le asesoramos desde el primer momento. Primera consulta sin compromiso.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        'Evaluación inmediata de su caso',
                        `Atención presencial y online en ${cityName}`,
                        'Peritos médicos colaboradores',
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
                      <Link href="/es/contacto" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white text-sm font-medium px-6 py-3 rounded-xl border border-white/20 transition-all hover:bg-white/20">
                        Escribir por formulario →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* POR QUÉ ELEGIRNOS */}
        <section className="py-16 md:py-20 bg-neutral-50">
          <div className="container-custom max-w-6xl">
            <div className="reveal">
              <div className="bg-gradient-to-br from-brand-brown to-brand-brown/95 p-10 md:p-14 rounded-2xl">
                <div className="text-center mb-10">
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark mb-3">
                    ¿Por qué elegir García-Valcárcel & Cáceres en {cityName}?
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                  {[
                    { title: '55+', desc: 'Años de experiencia' },
                    { title: '1970', desc: 'Fundación del bufete' },
                    { title: '5', desc: 'Profesionales especializados' },
                    { title: cityName, desc: 'Presencial y videoconferencia' },
                    { title: 'Trato directo', desc: 'Con el abogado titular' },
                    { title: 'Sede Murcia', desc: 'Actuación en toda España' },
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

        {/* FAQs */}
        {faqs.length > 0 && (
          <section className="py-16 md:py-24 bg-white">
            <div className="container-custom max-w-4xl">
              <div className="reveal text-center mb-12">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Resolvemos sus dudas</span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">Preguntas frecuentes sobre negligencias médicas en {cityName}</h2>
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

        {/* ENLACE A GENÉRICA */}
        <section className="py-12 md:py-16 bg-neutral-50 border-t border-neutral-200">
          <div className="container-custom max-w-4xl">
            <div className="reveal text-center">
              <p className="text-sm text-neutral-400 mb-4">
                Consulte también nuestra página general sobre negligencias médicas con información
                sobre tipos de reclamación, plazos y el proceso legal completo.
              </p>
              <Link
                href={`/es/servicios/${FOLDER_SLUG}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-brown hover:text-brand-brown-hover transition-colors"
              >
                Ver página general de Negligencias Médicas <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
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
                  alt="GVC Abogados"
                  fill
                  className="object-contain p-4"
                  sizes="80px"
                />
              </div>
              <h2 className="section-title-white mb-6">
                Abogados de negligencias médicas en {cityName}
              </h2>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-4 max-w-2xl mx-auto">
                Nuestra sede central está en <strong className="text-white">Gran Vía, 15 — 3ª Planta, 30008 Murcia</strong>.
              </p>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                Atendemos clientes de {cityName} de forma presencial y por videoconferencia.
                Primera consulta sin compromiso.
              </p>
              <div className="flex gap-3 md:gap-4 items-center flex-wrap justify-center">
                <Link href="/es/contacto" className="inline-flex items-center gap-2 bg-brand-brown text-white text-xs font-semibold px-8 py-4 tracking-wide transition-all duration-300 hover:bg-brand-brown/80 hover:-translate-y-0.5 hover:shadow-xl">
                  Consultar sin compromiso →
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
