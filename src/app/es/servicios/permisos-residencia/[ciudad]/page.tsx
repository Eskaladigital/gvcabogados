import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Clipboard, Globe, Phone, MapPin, CheckCircle2,
  ArrowRight, Building2, FileText, ShieldCheck
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import RichTextContent from '@/components/content/RichTextContent';
import { BreadcrumbSchema, ServiceSchema, FAQSchema } from '@/components/seo/SchemaOrg';
import { getServiceContentByServiceAndCity } from '@/lib/service-content';
import { supabaseAdmin } from '@/lib/supabase';

const SERVICE_KEY = 'extranjeria';
const SERVICE_NAME = 'Permisos de Residencia e Inmigración';
const FOLDER_SLUG = 'permisos-residencia';

interface Props {
  params: { ciudad: string };
}

export const dynamicParams = false;
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = new Set<string>();

  const { data: nuevo } = await supabaseAdmin
    .from('svc_permisos_residencia')
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
  const title = content.titleEs || `Abogados de Extranjería en ${cityName} — GVC Abogados`;
  const description = content.metaDescriptionEs || content.shortDescriptionEs ||
    `Abogados especialistas en permisos de residencia e inmigración en ${cityName}. Arraigo, reagrupación familiar, renovaciones. Más de 55 años de experiencia. ☎ 968 241 025.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.gvcabogados.com/es/servicios/${FOLDER_SLUG}/${params.ciudad}`,
      languages: { en: `/en/services/immigration/${params.ciudad}` },
    },
    openGraph: { title, description, locale: 'es_ES', type: 'website', url: `https://www.gvcabogados.com/es/servicios/${FOLDER_SLUG}/${params.ciudad}` },
  };
}

const DEFAULT_STATS = [
  { value: '55+', label: 'Años de experiencia' },
  { value: 'Multilingüe', label: 'Atención en varios idiomas' },
  { value: 'Sin compromiso', label: 'Primera consulta' },
];

const DEFAULT_TIPOS_PERMISO = [
  { titulo: 'Arraigo social', descripcion: 'Autorización de residencia por arraigo social tras 3 años de permanencia continuada en España con integración acreditada.' },
  { titulo: 'Arraigo familiar', descripcion: 'Permiso de residencia para padres de menores de nacionalidad española o hijos de españoles de origen.' },
  { titulo: 'Arraigo laboral', descripcion: 'Autorización para extranjeros que acrediten relaciones laborales con un mínimo de 6 meses de antigüedad.' },
  { titulo: 'Residencia comunitaria', descripcion: 'Tarjeta de residencia para familiares de ciudadanos de la UE: cónyuges, descendientes y ascendientes.' },
  { titulo: 'Reagrupación familiar', descripcion: 'Derecho del residente legal a reunir a sus familiares directos: cónyuge, hijos menores y ascendientes.' },
  { titulo: 'Renovaciones y prórrogas', descripcion: 'Gestión integral de renovaciones de permisos de residencia y trabajo, evitando pérdida de estatus legal.' },
];

const DEFAULT_DOCUMENTACION = [
  { paso: 1, titulo: 'Pasaporte en vigor', descripcion: 'Original y copia completa del pasaporte vigente de todos los solicitantes.' },
  { paso: 2, titulo: 'Empadronamiento', descripcion: 'Certificado de empadronamiento que acredite el domicilio del solicitante en el municipio.' },
  { paso: 3, titulo: 'Antecedentes penales', descripcion: 'Certificado de antecedentes penales del país de origen, apostillado o legalizado y traducido.' },
  { paso: 4, titulo: 'Medios económicos', descripcion: 'Documentación acreditativa de medios económicos suficientes: nóminas, contrato de trabajo o declaración de la renta.' },
  { paso: 5, titulo: 'Seguro médico o tarjeta sanitaria', descripcion: 'Seguro de salud público o privado que cubra al solicitante durante su estancia en España.' },
];

export default async function PermisosResidenciaLocalPage({ params }: Props) {
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
  const tiposPermiso = (custom.tipos_permiso as typeof DEFAULT_TIPOS_PERMISO) || DEFAULT_TIPOS_PERMISO;
  const documentacion = (custom.documentacion as typeof DEFAULT_DOCUMENTACION) || DEFAULT_DOCUMENTACION;
  const customIntro = custom.intro as string | undefined;

  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: 'Áreas de Práctica', href: '/es/servicios' },
    { name: 'Permisos de Residencia', href: `/es/servicios/${FOLDER_SLUG}` },
    { name: `${SERVICE_NAME} en ${cityName}`, href: `/es/servicios/${FOLDER_SLUG}/${params.ciudad}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ServiceSchema
        name={content.titleEs || `Abogados de Extranjería en ${cityName}`}
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
              alt={`Abogados de extranjería en ${cityName}`}
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
                <em className="italic text-brand-gold font-normal">extranjería e inmigración</em>{' '}
                en {cityName}
              </h1>

              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[580px]">
                {content.shortDescriptionEs || `Especialistas en permisos de residencia, arraigo, reagrupación familiar y trámites de extranjería en ${cityName}.`}
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
                {content.titleEs || `Abogados de extranjería en ${cityName}`}
              </h2>

              <div className="relative float-right ml-8 mb-6 w-full sm:w-[320px] lg:w-[380px]">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
                    alt={`Abogados extranjería ${cityName}`}
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

        {/* TIPOS DE PERMISO */}
        {tiposPermiso.length > 0 && (
          <section className="py-16 md:py-24 bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-14">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Especialidades</span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">Tipos de permiso de residencia en {cityName}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {tiposPermiso.map((tipo, i) => (
                  <div key={i} className="reveal group bg-white p-7 rounded-2xl border border-neutral-100 hover:border-brand-brown/30 hover:shadow-lg transition-all text-center">
                    <div className="w-14 h-14 mx-auto mb-5 bg-brand-brown/10 rounded-xl flex items-center justify-center group-hover:bg-brand-brown transition-all">
                      <Clipboard size={24} className="text-brand-brown group-hover:text-white transition-colors" />
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
                <h2 className="section-title mb-4">Extranjería en {cityName}: lo que debe saber</h2>
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

        {/* BANNER: OFICINA DE EXTRANJERÍA */}
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
                <Building2 size={40} className="text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-white mb-3">
                  Oficina de Extranjería y Delegación del Gobierno en {cityName}
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl">
                  Los trámites de permisos de residencia se gestionan ante la <strong className="text-white">Oficina de Extranjería</strong> o la
                  Delegación/Subdelegación del Gobierno correspondiente. Nuestros abogados conocen los procedimientos específicos
                  de {cityName} y le acompañan en la presentación de solicitudes, subsanaciones y recursos.
                </p>
              </div>
              <div className="shrink-0">
                <Link href="/es/contacto" className="btn-primary whitespace-nowrap">
                  Consultar trámites →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* DOCUMENTACIÓN NECESARIA */}
        {documentacion.length > 0 && (
          <section className="py-16 md:py-24 bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-14">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Requisitos</span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">Documentación necesaria para su trámite en {cityName}</h2>
                <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
                  Estos son los documentos más habituales. Según el tipo de permiso, pueden variar. Le asesoramos sobre su caso concreto.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {documentacion.map((doc, i) => (
                  <div key={i} className="reveal group bg-white p-7 md:p-8 rounded-2xl border border-neutral-100 hover:border-brand-brown/30 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-11 h-11 bg-brand-brown/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-brown transition-all">
                        <FileText size={20} className="text-brand-brown group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <div className="text-[0.6rem] text-brand-brown font-semibold uppercase tracking-wider mb-1">Paso {doc.paso}</div>
                        <h3 className="font-serif text-base font-semibold text-brand-dark">{doc.titulo}</h3>
                      </div>
                    </div>
                    <p className="text-[0.8rem] text-neutral-400 leading-relaxed pl-[60px]">{doc.descripcion}</p>
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
                  <h2 className="section-title mb-8">Cómo gestionamos su trámite en {cityName}</h2>

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
                      ¿Necesita un permiso de residencia en {cityName}?
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed mb-6">
                      Le asesoramos desde el primer momento. Primera consulta sin compromiso.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        'Estudio personalizado de su expediente',
                        `Atención presencial y online en ${cityName}`,
                        'Seguimiento completo del trámite',
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
                    ¿Por qué elegir García-Valcárcel &amp; Cáceres en {cityName}?
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
                <h2 className="section-title mb-4">Preguntas frecuentes sobre extranjería en {cityName}</h2>
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
                Consulte también nuestra página general sobre permisos de residencia con información
                sobre tipos de autorización, documentación y el proceso legal completo.
              </p>
              <Link
                href={`/es/servicios/${FOLDER_SLUG}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-brown hover:text-brand-brown-hover transition-colors"
              >
                Ver página general de Permisos de Residencia <ArrowRight size={16} />
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
                Abogados de extranjería en {cityName}
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
