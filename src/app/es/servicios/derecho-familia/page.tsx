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
const FOLDER_SLUG = 'derecho-familia';
const GENERIC_SLUG_EN = 'family-law';

export const metadata: Metadata = {
  title: 'Abogados de Derecho de Familia — Divorcios, Custodia, Pensiones | GVC Abogados',
  description:
    'Abogados especialistas en derecho de familia: divorcios, custodia de hijos, pensión de alimentos, régimen de visitas, liquidación de gananciales. Más de 55 años de experiencia. ☎ 968 241 025.',
  alternates: {
    canonical: `https://www.gvcabogados.com/es/servicios/${FOLDER_SLUG}`,
    languages: { en: `/en/services/${GENERIC_SLUG_EN}` },
  },
  openGraph: {
    title: 'Abogados de Derecho de Familia — GVC Abogados',
    description:
      'Especialistas en derecho de familia: divorcios, custodia, pensiones, régimen de visitas y liquidación de bienes. Más de 55 años de experiencia.',
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

const AREAS_FAMILIA = [
  {
    icon: Heart,
    title: 'Divorcios y separaciones',
    desc: 'Gestionamos divorcios de mutuo acuerdo y contenciosos con la máxima discreción. Protegemos sus intereses y los de sus hijos en cada fase del proceso.',
  },
  {
    icon: Baby,
    title: 'Custodia de hijos',
    desc: 'Custodia exclusiva, compartida o modificación del régimen vigente. Defendemos el interés superior del menor como principio rector.',
  },
  {
    icon: BadgeEuro,
    title: 'Pensión de alimentos',
    desc: 'Fijación, modificación o reclamación de impagos. Actuamos para que las pensiones sean justas y se cumplan efectivamente.',
  },
  {
    icon: Clock,
    title: 'Régimen de visitas',
    desc: 'Establecimiento, ampliación o restricción del régimen de visitas. Velamos por la estabilidad emocional de los menores.',
  },
  {
    icon: Home,
    title: 'Liquidación de gananciales',
    desc: 'Partición del patrimonio común tras el divorcio: vivienda familiar, cuentas bancarias, inversiones y deudas compartidas.',
  },
  {
    icon: Handshake,
    title: 'Mediación familiar',
    desc: 'Fomentamos el acuerdo entre las partes para reducir el coste emocional y económico. El diálogo como vía preferente.',
  },
  {
    icon: BookOpen,
    title: 'Parejas de hecho',
    desc: 'Asesoramiento sobre constitución, régimen económico y disolución de parejas de hecho. Derechos y obligaciones legales.',
  },
  {
    icon: Scale,
    title: 'Violencia de género',
    desc: 'Asistencia legal integral a víctimas: órdenes de protección, medidas cautelares y acompañamiento durante todo el proceso.',
  },
];

const PREOCUPACIONES = [
  { pregunta: '¿Qué pasará con mis hijos?', respuesta: 'Siempre prevalece el interés superior del menor. Trabajamos para conseguir el régimen de custodia y visitas más beneficioso para ellos, preservando la relación con ambos progenitores.' },
  { pregunta: '¿Perderé mi vivienda?', respuesta: 'El uso de la vivienda familiar se asigna en función de varios factores (custodia de menores, titularidad, situación económica). Le asesoramos para proteger su derecho sobre el inmueble.' },
  { pregunta: '¿Cuánto durará el proceso?', respuesta: 'Un divorcio de mutuo acuerdo puede resolverse en 2-3 meses. Un contencioso puede extenderse a 8-14 meses según la complejidad. Le damos estimaciones realistas desde el primer día.' },
  { pregunta: '¿Puedo modificar la pensión más adelante?', respuesta: 'Sí. Cuando cambian las circunstancias económicas o personales (pérdida de empleo, nuevo matrimonio, cambio de residencia), se puede solicitar una modificación de medidas ante el juzgado.' },
];

const PROCESO = [
  { step: 1, title: 'Primera consulta sin compromiso', desc: 'Escuchamos su situación con total confidencialidad. Evaluamos las opciones legales y le explicamos con claridad qué esperar en cada escenario.' },
  { step: 2, title: 'Estrategia personalizada', desc: 'Diseñamos un plan de acción adaptado a sus circunstancias: vía amistosa, mediación o contencioso. Usted decide con toda la información.' },
  { step: 3, title: 'Negociación o mediación', desc: 'Intentamos siempre llegar a un acuerdo razonable. El 70 % de nuestros casos de familia se resuelven sin necesidad de juicio.' },
  { step: 4, title: 'Procedimiento judicial', desc: 'Si el acuerdo no es posible, defendemos su posición ante el juzgado con firmeza y rigor. Preparamos cada detalle del caso.' },
  { step: 5, title: 'Ejecución y seguimiento', desc: 'Nos aseguramos de que la sentencia se cumpla: pensiones, régimen de visitas, liquidación de bienes. Le acompañamos hasta el final.' },
];

const FAQS = [
  { question: '¿Cuánto cuesta un divorcio?', answer: 'Depende del tipo de divorcio. Un <strong>divorcio de mutuo acuerdo</strong> es significativamente más económico que un contencioso. En la primera consulta, tras conocer su caso, le proporcionamos un presupuesto detallado y transparente, sin sorpresas.' },
  { question: '¿Puedo divorciarme sin acuerdo de mi cónyuge?', answer: 'Sí. En España no se necesita el consentimiento del otro cónyuge para divorciarse. Basta con que hayan transcurrido <strong>3 meses desde la celebración del matrimonio</strong>. Se tramitará como divorcio contencioso si no hay acuerdo.' },
  { question: '¿Qué es la custodia compartida y cuándo se concede?', answer: 'La custodia compartida implica que ambos progenitores conviven con los hijos en periodos alternos (semanas, quincenas o meses). Los tribunales la conceden cuando se demuestra que es <strong>beneficiosa para el menor</strong>, valorando la cercanía de domicilios, horarios laborales y la relación previa con ambos padres.' },
  { question: '¿Cuánto se paga de pensión de alimentos?', answer: 'No existe una cantidad fija. Se calcula en función de los <strong>ingresos del obligado al pago</strong>, las necesidades de los hijos (educación, sanidad, ocio) y el nivel de vida anterior de la familia. Los tribunales aplican tablas orientativas, pero cada caso es único.' },
  { question: '¿Se puede modificar un convenio regulador ya firmado?', answer: 'Sí, mediante un procedimiento de <strong>modificación de medidas</strong>. Es necesario acreditar un cambio sustancial en las circunstancias (pérdida de empleo, traslado, enfermedad, nuevas necesidades de los hijos). Podemos tramitarlo de mutuo acuerdo o por vía contenciosa.' },
  { question: '¿Qué derechos tengo como padre/madre no custodio?', answer: 'Tiene derecho a un <strong>régimen de visitas y comunicación</strong> con sus hijos, a ser informado sobre su educación, salud y bienestar, y a participar en las decisiones importantes de su vida. Si le impiden el contacto, podemos solicitar medidas judiciales de ejecución.' },
];

export default async function DerechoFamiliaPage() {
  const cities = await getCitiesForService();

  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: 'Áreas de Práctica', href: '/es/servicios' },
    { name: 'Derecho de Familia', href: `/es/servicios/${FOLDER_SLUG}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <ServiceSchema
        name="Abogados de Derecho de Familia — García-Valcárcel & Cáceres"
        description="Abogados especialistas en derecho de familia: divorcios, custodia, pensión de alimentos, régimen de visitas y liquidación de bienes."
        slug={FOLDER_SLUG}
        locale="es"
      />
      <FAQSchema faqs={FAQS} />

      <Navbar locale="es" alternateUrl={`/en/services/${GENERIC_SLUG_EN}`} />

      <main>
        {/* ═══════════════════════════════════════
            HERO
        ═══════════════════════════════════════ */}
        <section className="bg-[#1a1a1a] relative overflow-hidden min-h-[85vh] flex flex-col">
          <div className="absolute inset-0 opacity-20 z-0">
            <Image
              src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
              alt="Abogados de derecho de familia"
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
                  Derecho de Familia
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.8rem] font-bold text-white leading-[1.15] mb-5 md:mb-6">
                Abogados de{' '}
                <em className="italic text-brand-gold font-normal">derecho de familia</em>
              </h1>

              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8 md:mb-10 max-w-[560px]">
                Le acompañamos en los momentos más difíciles con <strong className="text-white">cercanía, discreción y rigor jurídico</strong>.
                Divorcios, custodia, pensiones y todo lo que afecta a su familia.
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
                  { value: '55+', label: 'Años de experiencia' },
                  { value: '70%', label: 'Resueltos por acuerdo' },
                  { value: 'Desde 1970', label: 'Bufete familiar' },
                  { value: 'Sin compromiso', label: 'Primera consulta' },
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
            INTRO — Enfoque humano
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom max-w-6xl">
            <div className="reveal grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-3">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-0.5 bg-brand-brown" />
                  <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">
                    Entendemos su situación
                  </span>
                </div>
                <h2 className="section-title mb-6">
                  Un bufete que entiende que detrás de cada expediente hay una familia
                </h2>
                <div className="space-y-4 text-sm text-neutral-500 leading-relaxed">
                  <p>
                    Los asuntos de familia no son un trámite más. Afectan a lo más importante de su vida:
                    sus hijos, su hogar, su estabilidad emocional y económica. Lo sabemos, y por eso trabajamos
                    con un enfoque que combina <strong className="text-brand-dark">firmeza legal</strong> y <strong className="text-brand-dark">sensibilidad personal</strong>.
                  </p>
                  <p>
                    Desde 1970, García-Valcárcel & Cáceres ha acompañado a cientos de familias en procesos
                    de divorcio, custodia y pensiones. Nuestra experiencia nos permite anticipar escenarios,
                    proponer soluciones realistas y, sobre todo, proteger lo que más le importa.
                  </p>
                  <p>
                    Priorizamos siempre el acuerdo y la mediación, porque un divorcio pactado es mejor para todos
                    — especialmente para los hijos. Pero cuando el acuerdo no es posible, defendemos su posición
                    ante los tribunales con toda la contundencia que el caso requiere.
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap mt-8">
                  <Link href="/es/contacto" className="btn-primary">Consultar mi caso →</Link>
                  <a href="tel:+34968241025" className="btn-outline-dark">☎ Llamar ahora</a>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="/images/slides/garcia_valcarcel_caceres_abogados_slide_home_v2.webp"
                      alt="Abogados especialistas en derecho de familia"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 400px"
                      quality={60}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-brand-brown-hover text-white p-6 rounded-2xl shadow-xl max-w-[220px]">
                    <Heart size={20} className="text-brand-brown mb-2" />
                    <div className="font-display text-3xl font-bold mb-1">Desde 1970</div>
                    <div className="text-[0.65rem] text-white/80 uppercase tracking-wider">Protegiendo familias</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            ÁREAS DE DERECHO DE FAMILIA
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="container-custom max-w-6xl">
            <div className="reveal text-center mb-14">
              <div className="flex items-center gap-3 justify-center mb-4">
                <span className="w-9 h-0.5 bg-brand-brown" />
                <span className="text-[0.6rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">Áreas de actuación</span>
                <span className="w-9 h-0.5 bg-brand-brown" />
              </div>
              <h2 className="section-title mb-4">En qué podemos ayudarle</h2>
              <p className="text-sm text-neutral-400 max-w-xl mx-auto">
                El derecho de familia abarca situaciones muy distintas. Nuestro equipo tiene experiencia específica en cada una de ellas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {AREAS_FAMILIA.map((area, i) => {
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
            LO QUE MÁS PREOCUPA
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
                    Sabemos lo que le preocupa
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-6">
                  Las preguntas que se hace antes de dar el paso
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                  Antes de iniciar un proceso de familia, es normal tener dudas y miedos.
                  Le respondemos con transparencia para que tome decisiones informadas.
                </p>
                <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-xl">
                  <ShieldCheck size={28} className="text-brand-brown shrink-0" />
                  <p className="text-[0.8rem] text-neutral-300">
                    Todo lo que nos cuente está protegido por el <strong className="text-white">secreto profesional</strong>.
                    Máxima confidencialidad garantizada.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="space-y-4">
                  {PREOCUPACIONES.map((item, i) => (
                    <div key={i} className="reveal bg-white/[0.06] backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:bg-white/[0.1] transition-all">
                      <h4 className="font-serif text-base font-semibold text-white mb-2">{item.pregunta}</h4>
                      <p className="text-[0.8rem] text-neutral-400 leading-relaxed">{item.respuesta}</p>
                    </div>
                  ))}
                </div>
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
              <h2 className="section-title mb-4">Cómo trabajamos su caso de familia</h2>
              <p className="text-sm text-neutral-400 max-w-xl mx-auto">
                Un proceso claro, humano y orientado a proteger lo que más importa: su familia.
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
            BANNER — Acuerdo vs. juicio
        ═══════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-neutral-50">
          <div className="container-custom max-w-6xl">
            <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-8 md:p-10 rounded-2xl border border-neutral-100 hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-brand-brown/10 rounded-xl flex items-center justify-center mb-6">
                  <Handshake size={28} className="text-brand-brown" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-brand-dark mb-3">Divorcio de mutuo acuerdo</h3>
                <ul className="space-y-3 text-sm text-neutral-500">
                  {[
                    'Duración estimada: 2-3 meses',
                    'Menor coste económico y emocional',
                    'Convenio regulador pactado',
                    'Un solo abogado puede representar a ambos',
                    'Ideal cuando hay voluntad de acuerdo',
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
                <h3 className="font-serif text-xl font-semibold mb-3">Divorcio contencioso</h3>
                <ul className="space-y-3 text-sm text-white/80">
                  {[
                    'Cuando no hay acuerdo posible',
                    'Duración estimada: 8-14 meses',
                    'Cada parte con su propio abogado',
                    'El juez decide sobre custodia, pensiones y bienes',
                    'Defendemos su posición con contundencia',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight size={14} className="text-brand-brown shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-white/15">
                  <p className="text-[0.8rem] text-white/70">
                    Nuestro objetivo siempre es explorar primero la vía amistosa. Si no es posible,
                    contará con un equipo experimentado a su lado.
                  </p>
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
                    ¿Por qué confiar en García-Valcárcel & Cáceres?
                  </h2>
                  <p className="text-sm text-brand-dark/70 max-w-xl mx-auto">
                    Más de siete décadas acompañando a familias en los momentos más delicados.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                  {[
                    { title: '55+', desc: 'Años de experiencia' },
                    { title: '1970', desc: 'Fundación del bufete' },
                    { title: '5', desc: 'Profesionales especializados' },
                    { title: 'Toda España', desc: 'Sede en Murcia, actuación nacional' },
                    { title: 'Trato directo', desc: 'Con el abogado titular' },
                    { title: 'Discreción', desc: 'Máxima confidencialidad' },
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
                <h2 className="section-title mb-4">Abogados de familia en su ciudad</h2>
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
              <h2 className="section-title mb-4">Preguntas frecuentes sobre derecho de familia</h2>
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
                Protejamos juntos lo que más le importa
              </h2>
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                Primera consulta sin compromiso. Le escuchamos, analizamos su situación y le explicamos
                con claridad cuáles son sus opciones y qué puede esperar.
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
