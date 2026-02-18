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
const FOLDER_SLUG = 'accidentes-trafico';
const GENERIC_SLUG_EN = 'traffic-accidents';

export const metadata: Metadata = {
  title: 'Abogados de Accidentes de Tráfico — Especialistas en Indemnizaciones | GVC Abogados',
  description:
    'Abogados especialistas en accidentes de tráfico. Expertos en el baremo de valoración de daños (Ley 35/2015), indemnizaciones máximas y defensa de víctimas. Más de 75 años de experiencia. Primera consulta sin compromiso. ☎ 968 241 025.',
  alternates: {
    canonical: `https://www.gvcabogados.com/es/servicios/${FOLDER_SLUG}`,
    languages: { en: `/en/services/${GENERIC_SLUG_EN}` },
  },
  openGraph: {
    title: 'Abogados de Accidentes de Tráfico — GVC Abogados',
    description:
      'Especialistas en reclamaciones por accidentes de tráfico, indemnizaciones y defensa de víctimas. Más de 75 años de experiencia.',
    url: `https://www.gvcabogados.com/es/servicios/${FOLDER_SLUG}`,
    siteName: 'García-Valcárcel & Cáceres Abogados',
    locale: 'es_ES',
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

const TIPOS_ACCIDENTE = [
  { icon: Car, title: 'Colisiones entre vehículos', desc: 'Alcances, choques frontales, laterales y en cadena. Reclamamos a la aseguradora del responsable la máxima indemnización.' },
  { icon: AlertTriangle, title: 'Atropellos a peatones', desc: 'Defensa integral de la víctima atropellada: indemnización por lesiones, daño moral y lucro cesante.' },
  { icon: HeartPulse, title: 'Lesiones graves y secuelas', desc: 'Latigazo cervical, fracturas, lesiones medulares, TCE. Valoramos cada secuela para maximizar la compensación.' },
  { icon: ShieldCheck, title: 'Accidentes con fuga o sin seguro', desc: 'Reclamamos al Consorcio de Compensación de Seguros cuando el responsable huye o carece de póliza.' },
  { icon: Gavel, title: 'Accidentes laborales in itinere', desc: 'Accidentes de tráfico ocurridos durante el trayecto al trabajo. Doble vía de reclamación: laboral y civil.' },
  { icon: FileSearch, title: 'Defectos de vía pública', desc: 'Siniestros por mal estado de la carretera: baches, señalización deficiente, obras sin proteger. Responsabilidad patrimonial de la Administración.' },
];

const BAREMO_CONCEPTOS = [
  { label: 'Lesiones temporales', desc: 'Perjuicio personal básico + particular durante la curación', value: '30-100 €/día' },
  { label: 'Secuelas permanentes', desc: 'Valoradas de 1 a 100 puntos según gravedad', value: '800-250.000 €' },
  { label: 'Perjuicio estético', desc: 'De "ligero" (1-6) a "importantísimo" (50)', value: '1.000-150.000 €' },
  { label: 'Lucro cesante', desc: 'Ingresos dejados de percibir durante la baja y de forma permanente', value: 'Variable' },
  { label: 'Gastos sanitarios futuros', desc: 'Rehabilitación, prótesis, adaptación del domicilio', value: 'Variable' },
  { label: 'Gran invalidez', desc: 'Necesidad de ayuda de tercera persona permanente', value: '+300.000 €' },
];

const PROCESO = [
  { step: 1, title: 'Consulta y evaluación inicial', desc: 'Analizamos la viabilidad de su caso sin compromiso. Revisamos partes, atestados e informes médicos.' },
  { step: 2, title: 'Recopilación de pruebas', desc: 'Reunimos toda la documentación: informe de la aseguradora, historial clínico, informes periciales y testigos.' },
  { step: 3, title: 'Reclamación extrajudicial', desc: 'Negociamos directamente con la compañía de seguros. El 80 % de los casos se resuelve en esta fase.' },
  { step: 4, title: 'Demanda judicial', desc: 'Si la oferta es insuficiente, interponemos demanda civil o penal ante los tribunales competentes.' },
  { step: 5, title: 'Cobro de indemnización', desc: 'Gestionamos el cobro íntegro y verificamos que incluye todos los conceptos del baremo.' },
];

const FAQS = [
  { question: '¿Cuánto tiempo tengo para reclamar tras un accidente de tráfico?', answer: 'El plazo general es de <strong>1 año</strong> desde la fecha del accidente o desde el alta médica definitiva (estabilización de secuelas). Si hay procedimiento penal, el plazo se interrumpe hasta que la sentencia o el sobreseimiento sean firmes. Es fundamental actuar cuanto antes para preservar las pruebas.' },
  { question: '¿Qué indemnización me corresponde por un accidente de tráfico?', answer: 'Depende de la gravedad de las lesiones, las secuelas permanentes, su edad, situación laboral y familiar. El <strong>baremo de tráfico (Ley 35/2015)</strong> establece tablas con horquillas de valoración. Un latigazo cervical leve puede suponer entre 2.000 y 6.000 €, mientras que lesiones graves con secuelas permanentes pueden superar los 200.000 €. Nuestros abogados realizan un cálculo personalizado para cada caso.' },
  { question: '¿Tengo que adelantar dinero para reclamar?', answer: 'En García-Valcárcel & Cáceres, la <strong>primera consulta es sin compromiso</strong>. Además, ofrecemos la posibilidad de trabajar con una provisión de fondos muy reducida, abonando la mayor parte de nuestros honorarios al cobrar la indemnización. De esta forma, minimizamos el riesgo económico para el cliente.' },
  { question: '¿Qué pasa si el responsable se da a la fuga o no tiene seguro?', answer: 'Puede reclamar al <strong>Consorcio de Compensación de Seguros</strong>, un organismo público que cubre estos supuestos. Nosotros nos encargamos de toda la tramitación para que reciba su indemnización igualmente.' },
  { question: '¿Puedo reclamar si el accidente fue parcialmente culpa mía?', answer: 'Sí. En España se aplica el principio de <strong>concurrencia de culpas</strong>: si la otra parte también fue responsable, tendrá derecho a una indemnización proporcional a su grado de culpa. Nuestros abogados defenderán que su porcentaje de responsabilidad sea el menor posible.' },
  { question: '¿Cuánto tarda en resolverse una reclamación por accidente?', answer: 'La vía extrajudicial suele resolverse en <strong>3 a 8 meses</strong>. Si hay que acudir a juicio, el plazo se extiende a <strong>12-18 meses</strong> dependiendo del juzgado. Trabajamos para que su caso se resuelva lo antes posible sin renunciar a la indemnización que le corresponde.' },
];

export default async function AccidentesTraficoPage() {
  const svc = services.find(s => s.id === SERVICE_KEY)!;
  const cities = await getCitiesForService();

  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: 'Áreas de Práctica', href: '/es/servicios' },
    { name: 'Accidentes de Tráfico', href: `/es/servicios/${FOLDER_SLUG}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ServiceSchema
        name="Abogados de Accidentes de Tráfico — García-Valcárcel & Cáceres"
        description={svc.descriptionEs}
        slug={FOLDER_SLUG}
        locale="es"
      />
      <FAQSchema faqs={FAQS} />

      <Navbar locale="es" alternateUrl={`/en/services/${GENERIC_SLUG_EN}`} />

      <main>
        {/* ═══════════════════════════════════════
            HERO — full-bleed, sobrio, potente
        ═══════════════════════════════════════ */}
        <section className="bg-[#1a1a1a] relative overflow-hidden min-h-[85vh] flex flex-col">
          <div className="absolute inset-0 opacity-25 z-0">
            <Image
              src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
              alt="Abogados de accidentes de tráfico"
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
                  Especialistas en responsabilidad civil
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.8rem] font-bold text-white leading-[1.15] mb-5 md:mb-6">
                Abogados de{' '}
                <em className="italic text-brand-gold font-normal">accidentes de tráfico</em>
              </h1>

              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[560px]">
                Luchamos para que reciba la <strong className="text-white">máxima indemnización</strong> posible.
                Expertos en el baremo de tráfico, negociación con aseguradoras y defensa ante los tribunales.
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                {[
                  { value: '75+', label: 'Años de experiencia' },
                  { value: '80%', label: 'Resueltos sin juicio' },
                  { value: 'Ley 35/2015', label: 'Baremo actualizado' },
                  { value: '100%', label: 'Compromiso con el cliente' },
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
            INTRO — Qué hacemos
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom max-w-6xl">
            <div className="reveal grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-3">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                    ¿Ha sufrido un accidente?
                  </span>
                </div>
                <h2 className="section-title mb-6">
                  Defendemos sus derechos como víctima de un accidente de tráfico
                </h2>
                <div className="space-y-4 text-sm text-neutral-500 leading-relaxed">
                  <p>
                    Tras un accidente de tráfico, las compañías aseguradoras buscan minimizar las indemnizaciones.
                    Nuestro equipo conoce sus estrategias y trabaja para que usted reciba la <strong className="text-brand-dark">compensación íntegra</strong> que le corresponde
                    según el baremo de valoración de daños personales.
                  </p>
                  <p>
                    Nos encargamos de <strong className="text-brand-dark">todo el proceso</strong>: desde la recogida de pruebas y la obtención del atestado policial,
                    hasta la negociación directa con la aseguradora o, si es necesario, la defensa de su caso ante los tribunales.
                  </p>
                  <p>
                    Contamos con una red de peritos médicos, reconstructores de accidentes y forenses que respaldan
                    nuestras reclamaciones con informes técnicos rigurosos.
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap mt-8">
                  <Link href="/es/contacto" className="btn-primary">Valorar mi caso →</Link>
                  <a href="tel:+34968241025" className="btn-outline-dark">☎ Llamar ahora</a>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
                      alt="Abogados especialistas en accidentes de tráfico"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 400px"
                      quality={60}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-brand-brown-hover text-white p-6 rounded-2xl shadow-xl max-w-[220px]">
                    <div className="font-display text-3xl font-bold mb-1">Desde 1946</div>
                    <div className="text-[0.65rem] text-white/80 uppercase tracking-wider">Defendiendo víctimas de accidentes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            TIPOS DE ACCIDENTE
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="container-custom max-w-6xl">
            <div className="reveal text-center mb-14">
              <div className="flex items-center gap-3 justify-center mb-4">
                <span className="w-9 h-0.5 bg-brand-brown" />
                <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Ámbito de actuación</span>
                <span className="w-9 h-0.5 bg-brand-brown" />
              </div>
              <h2 className="section-title mb-4">Tipos de accidentes que gestionamos</h2>
              <p className="text-sm text-neutral-400 max-w-xl mx-auto">
                Cada tipo de siniestro tiene sus particularidades legales. Nuestro equipo cuenta con experiencia específica en todos ellos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TIPOS_ACCIDENTE.map((tipo, i) => {
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
            BAREMO DE TRÁFICO — Ley 35/2015
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
                    Ley 35/2015
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-6">
                  Baremo de valoración de daños personales
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                  El baremo de tráfico es el sistema legal que establece cómo se calculan las indemnizaciones.
                  Conocerlo a fondo es la diferencia entre una oferta insuficiente de la aseguradora y la <strong className="text-white">indemnización máxima</strong> que le corresponde.
                </p>
                <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-xl">
                  <Scale size={28} className="text-brand-brown shrink-0" />
                  <p className="text-[0.8rem] text-neutral-300">
                    Nuestros abogados calculan con precisión cada concepto indemnizatorio para que <strong className="text-white">ningún daño quede sin reclamar</strong>.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BAREMO_CONCEPTOS.map((concepto, i) => (
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
                  * Horquillas orientativas. La indemnización concreta depende de las circunstancias de cada caso.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            PROCESO DE TRABAJO
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom max-w-6xl">
            <div className="reveal text-center mb-14">
              <div className="flex items-center gap-3 justify-center mb-4">
                <span className="w-9 h-0.5 bg-brand-brown" />
                <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                  Paso a paso
                </span>
                <span className="w-9 h-0.5 bg-brand-brown" />
              </div>
              <h2 className="section-title mb-4">Cómo trabajamos su caso</h2>
              <p className="text-sm text-neutral-400 max-w-xl mx-auto">
                Un proceso claro, transparente y orientado a obtener el mejor resultado posible.
              </p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute top-0 bottom-0 left-[42px] w-px bg-brand-brown/20" />
              <div className="space-y-0">
                {PROCESO.map((item, i) => (
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
            QUÉ HACER TRAS UN ACCIDENTE
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="container-custom max-w-6xl">
            <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                    Guía práctica
                  </span>
                </div>
                <h2 className="section-title mb-6">¿Qué hacer inmediatamente después de un accidente?</h2>
                <p className="text-sm text-neutral-400 leading-relaxed mb-8">
                  Los primeros pasos tras un siniestro son decisivos para su reclamación posterior. Siga estas pautas para proteger sus derechos:
                </p>
                <div className="space-y-4">
                  {[
                    'Llame al 112 si hay heridos. La asistencia sanitaria es prioritaria.',
                    'No mueva los vehículos hasta que llegue la Policía (salvo peligro).',
                    'Rellene el parte amistoso o solicite atestado policial.',
                    'Fotografíe la escena: posición de los vehículos, daños, señalización.',
                    'Acuda a urgencias aunque crea que no tiene lesiones graves.',
                    'No firme ningún documento de la aseguradora contraria sin asesoramiento.',
                    'Contacte con un abogado especialista antes de aceptar ninguna oferta.',
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
                      ¿Acaba de tener un accidente?
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed mb-6">
                      Llámenos ahora. Le indicaremos exactamente qué pasos dar para proteger su derecho a una indemnización justa.
                      La primera consulta es sin compromiso.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        'Evaluación inmediata de su caso',
                        'Asesoramiento sobre los primeros pasos',
                        'Sin coste ni compromiso',
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
                    <Link href="/es/contacto" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white text-sm font-medium px-6 py-3 rounded-xl border border-white/20 transition-all hover:bg-white/20">
                      Escribir por formulario →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            POR QUÉ ELEGIRNOS
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom max-w-6xl">
            <div className="reveal">
              <div className="bg-gradient-to-br from-brand-brown to-brand-brown/95 p-10 md:p-14 rounded-2xl">
                <div className="text-center mb-10">
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark mb-3">
                    ¿Por qué elegir García-Valcárcel & Cáceres?
                  </h2>
                  <p className="text-sm text-brand-dark/70 max-w-xl mx-auto">
                    Más de siete décadas resolviendo los casos más complejos de responsabilidad civil en España.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                  {[
                    { title: '75+', desc: 'Años de experiencia' },
                    { title: '1946', desc: 'Fundación del bufete' },
                    { title: '5', desc: 'Profesionales especializados' },
                    { title: 'Toda España', desc: 'Sede en Murcia, actuación nacional' },
                    { title: 'Trato directo', desc: 'Con el abogado titular' },
                    { title: 'Sin compromiso', desc: 'Primera consulta' },
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
            CIUDADES
        ═══════════════════════════════════════ */}
        {cities.length > 0 && (
          <section className="py-16 md:py-20 bg-neutral-50">
            <div className="container-custom max-w-6xl">
              <div className="reveal text-center mb-12">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                    Cobertura nacional
                  </span>
                  <span className="w-9 h-0.5 bg-brand-brown" />
                </div>
                <h2 className="section-title mb-4">Abogados de accidentes de tráfico en su ciudad</h2>
                <p className="text-sm text-neutral-400 max-w-xl mx-auto">
                  Con sede en Murcia, ofrecemos asesoramiento presencial y por videoconferencia en las principales ciudades de España.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/es/servicios/${FOLDER_SLUG}/${city.slug}`}
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
                <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Resolvemos sus dudas</span>
                <span className="w-9 h-0.5 bg-brand-brown" />
              </div>
              <h2 className="section-title mb-4">Preguntas frecuentes sobre accidentes de tráfico</h2>
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
            CTA FINAL
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
                  alt="GVC Abogados"
                  fill
                  className="object-contain p-4"
                  sizes="80px"
                />
              </div>
              <h2 className="section-title-white mb-6">
                No deje que la aseguradora decida cuánto vale su caso
              </h2>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                Primera consulta sin compromiso. Le diremos con honestidad qué indemnización puede esperar
                y cómo vamos a luchar para conseguirla.
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
