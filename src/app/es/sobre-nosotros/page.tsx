import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { BreadcrumbSchema, LocalBusinessSchema } from '@/components/seo/SchemaOrg';
import { getTranslations } from '@/data/translations';

export const metadata: Metadata = {
  title: 'Sobre Nosotros — Bufete de Abogados en Murcia desde 1946 | García-Valcárcel & Cáceres',
  description:
    'Conozca la historia de García-Valcárcel & Cáceres, bufete de abogados en Murcia fundado en 1946 por D. Blas García-Valcárcel. Más de 75 años de experiencia y 5 profesionales especializados en responsabilidad civil.',
  alternates: {
    canonical: 'https://www.gvcabogados.com/es/sobre-nosotros',
    languages: { en: '/en/about' },
  },
  openGraph: {
    title: 'Sobre Nosotros — Bufete de Abogados en Murcia desde 1946',
    description: 'Bufete de abogados en Murcia fundado en 1946 por D. Blas García-Valcárcel. Especialistas en responsabilidad civil con más de 75 años de experiencia.',
    locale: 'es_ES',
  },
};

export default function SobreNosotrosPage() {
  const locale = 'es';
  const t = getTranslations(locale);

  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: 'Sobre Nosotros', href: '/es/sobre-nosotros' },
  ];

  const timeline = [
    { year: '1946', event: 'D. Blas García-Valcárcel inicia el ejercicio de la abogacía en Murcia el 6 de noviembre, fundando el despacho.' },
    { year: '1970s', event: 'D. Pedro-Alfonso García-Valcárcel y Escribano se incorpora al bufete, ampliando las áreas de práctica al derecho bancario y mercantil.' },
    { year: '1990s', event: 'El despacho se consolida como referente en Murcia en accidentes de tráfico y derecho de familia.' },
    { year: '2000s', event: 'Incorporación de nuevos profesionales y apertura de las áreas de extranjería, derecho administrativo y mediación civil y mercantil.' },
    { year: '2010s', event: 'Inicio de la defensa de consumidores frente a abusos bancarios: cláusulas suelo, gastos hipotecarios y tarjetas revolving.' },
    { year: 'Hoy', event: 'Con más de 75 años de experiencia acumulada, el equipo de 5 profesionales de García-Valcárcel & Cáceres es referente en responsabilidad civil en Murcia, ofreciendo un servicio integral y personalizado desde la Gran Vía.' },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <LocalBusinessSchema locale={locale} />
      <Navbar locale={locale} />
      <main>
        {/* Hero Banner */}
        <section className="bg-brand-dark py-20 md:py-28 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
          <div className="container-custom relative z-10">
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-[700px] mt-4">
              Bufete de abogados en Murcia con{' '}
              <em className="italic text-brand-gold font-normal">más de 75 años</em> de tradición
              jurídica
            </h1>
            <p className="text-neutral-300 text-base mt-4 max-w-[560px]">
              Fundado en 1946, García-Valcárcel & Cáceres es uno de los despachos de abogados con más
              historia de la Región de Murcia. Conozca quiénes somos y los valores que nos definen.
            </p>
          </div>
        </section>

        {/* History */}
        <section className="py-12 md:py-20">
          <div className="container-custom">
            <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark mb-6">
                  Nuestra <span className="text-brand-brown">Historia</span>
                </h2>
                <p className="text-sm text-brand-dark/80 leading-relaxed mb-4">
                  Este bufete fue fundado por{' '}
                  <strong className="text-brand-dark">D. Blas García-Valcárcel</strong>,
                  quien inició el ejercicio de la abogacía en Murcia el 6 de noviembre de 1946.
                  Posteriormente se incorporó su sobrino{' '}
                  <strong className="text-brand-dark">
                    D. Pedro-Alfonso García-Valcárcel y Escribano
                  </strong>, ampliando las áreas de práctica del despacho.
                </p>
                <p className="text-sm text-brand-dark/80 leading-relaxed mb-4">
                  En García-Valcárcel & Cáceres somos especialistas en responsabilidad civil:
                  accidentes de tráfico, negligencias médicas, accidentes laborales y responsabilidad
                  frente a la Administración. También trabajamos en otras áreas del derecho privado y público, adaptando
                  nuestro equipo de expertos a las necesidades de cada cliente. Nuestra filosofía se
                  basa en entender cada caso como único y ofrecer un asesoramiento personalizado.
                </p>
                <p className="text-sm text-brand-dark/80 leading-relaxed mb-4">
                  Con sede en la Gran Vía de Murcia, nuestro despacho ha sido testigo de la evolución
                  del derecho en España durante más de siete décadas, manteniendo siempre el compromiso
                  con la excelencia y la defensa rigurosa de los intereses de nuestros clientes.
                </p>
                <p className="text-sm text-brand-dark/80 leading-relaxed">
                  Hoy, nuestro equipo de cuatro abogados y una secretaria atiende a clientes
                  procedentes de toda la Región de Murcia, Alicante, Almería, Albacete y otras
                  provincias, tanto de forma presencial en nuestro despacho como por videoconferencia.
                </p>
              </div>
              <div className="bg-brand-brown-hover text-white p-8">
                <div className="font-serif text-4xl text-white/30 leading-none mb-3">
                  &ldquo;
                </div>
                <blockquote className="font-serif text-lg text-white leading-relaxed italic mb-6">
                  {t.about.founderQuote}
                </blockquote>
                <div className="w-8 h-px bg-white/20 mb-3" />
                <div className="text-sm font-semibold text-white">
                  Pedro A. García-Valcárcel
                </div>
                <div className="text-[0.65rem] text-white/80 uppercase tracking-wider">
                  Socio Fundador
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-12 md:py-20 bg-brand-brown text-brand-dark">
          <div className="container-custom max-w-[700px]">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-center mb-12">
              Más de <span className="text-brand-brown-hover">75 años</span> de trayectoria
            </h2>
            <div className="relative">
              <div className="absolute left-[18px] top-0 bottom-0 w-px bg-brand-dark/10" />
              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <div key={i} className="reveal flex items-start gap-6 relative">
                    <div className="w-9 h-9 rounded-full bg-brand-brown-hover text-white flex items-center justify-center text-[0.55rem] font-bold shrink-0 z-10 border-2 border-brand-dark/20">
                      {item.year === 'Hoy' ? '✦' : item.year.slice(-2)}
                    </div>
                    <div className="pt-1">
                      <div className="text-xs font-bold text-brand-brown-hover uppercase tracking-wider mb-1">
                        {item.year}
                      </div>
                      <p className="text-sm text-brand-dark/80 leading-relaxed">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-10 md:py-14 bg-brand-brown text-brand-dark">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 text-center">
              {[
                { value: '75+', label: 'Años de experiencia' },
                { value: '14', label: 'Áreas de práctica' },
                { value: '1946', label: 'Año de fundación' },
                { value: '5', label: 'Profesionales' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="reveal px-4 md:px-6 md:border-r md:border-brand-dark/10 md:last:border-r-0"
                >
                  <div className="font-display text-3xl md:text-5xl font-bold leading-none">
                    {stat.value}
                  </div>
                  <div className="text-[0.6rem] uppercase tracking-[0.12em] text-brand-dark/70 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 md:py-20 bg-neutral-50 border-y border-neutral-200">
          <div className="container-custom">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark text-center mb-4">
              Nuestros <span className="text-brand-brown">Valores</span>
            </h2>
            <p className="text-sm text-brand-dark/70 text-center max-w-[500px] mx-auto mb-10">
              Los principios que guían nuestra actuación profesional desde 1946
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: '✦',
                  title: 'Calidad',
                  desc: 'Exigencia máxima en el estudio y la resolución de cada caso. No aceptamos más asuntos de los que podemos atender con la dedicación que merecen.',
                },
                {
                  icon: '◆',
                  title: 'Confianza',
                  desc: 'Transparencia total con el cliente: informamos de las opciones reales, los costes, los plazos y las probabilidades de éxito sin crear falsas expectativas.',
                },
                {
                  icon: '★',
                  title: 'Experiencia',
                  desc: 'Más de 75 años de trayectoria nos permiten ofrecer un asesoramiento experto basado en una práctica contrastada.',
                },
                {
                  icon: '♦',
                  title: 'Nobleza',
                  desc: 'Integridad y honestidad profesional. Como refleja nuestro símbolo, el león, actuamos con nobleza, generosidad y honor en la defensa de nuestros clientes.',
                },
              ].map((v, i) => (
                <div
                  key={i}
                  className="reveal text-center p-6 bg-white border border-neutral-200 hover:border-brand-brown transition-colors"
                >
                  <div className="text-2xl text-brand-brown mb-3">{v.icon}</div>
                  <h3 className="font-serif text-lg font-semibold text-brand-dark mb-2">
                    {v.title}
                  </h3>
                  <p className="text-xs text-brand-dark/70 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Differentiators */}
        <section className="py-12 md:py-20">
          <div className="container-custom max-w-[800px]">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark text-center mb-10">
              ¿Qué nos <span className="text-brand-brown">diferencia</span>?
            </h2>
            <div className="reveal space-y-8">
              {[
                {
                  title: 'Trato directo con el abogado que lleva su caso',
                  text: 'En nuestro despacho no hay intermediarios ni pasantes. Desde la primera consulta hasta la resolución, usted habla directamente con el letrado responsable de su asunto.',
                },
                {
                  title: 'Despacho boutique frente a grandes fábricas de juicios',
                  text: 'No somos un despacho masivo que trata los casos como números. Seleccionamos los asuntos que aceptamos para garantizar una dedicación total a cada cliente.',
                },
                {
                  title: 'Presencia ininterrumpida en Murcia desde 1946',
                  text: 'Conocemos los tribunales, los juzgados y los profesionales del derecho en Murcia como pocos. Esa red de contactos y conocimiento local es una ventaja real para nuestros clientes.',
                },
                {
                  title: 'Honorarios claros y sin sorpresas',
                  text: 'Antes de comenzar cualquier actuación, le presentamos un presupuesto detallado y cerrado. Sin costes ocultos ni sorpresas a final de mes.',
                },
              ].map((d, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-1 h-full min-h-[40px] bg-brand-brown rounded-full shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-base font-semibold text-brand-dark mb-1">
                      {d.title}
                    </h3>
                    <p className="text-sm text-brand-dark/80 leading-relaxed">{d.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 bg-brand-brown-hover text-white">
          <div className="container-custom text-center max-w-[600px]">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
              ¿Necesita asesoramiento jurídico?
            </h2>
            <p className="text-sm text-white/90 leading-relaxed mb-8">
              Cuéntenos su caso sin compromiso.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/es/contacto" className="inline-flex items-center gap-2 bg-brand-brown text-white text-xs font-semibold px-6 py-3 tracking-wide transition-all duration-300 border-none cursor-pointer hover:bg-brand-brown/90 hover:-translate-y-0.5 hover:shadow-lg">
                Contactar →
              </Link>
              <a href="tel:+34968241025" className="btn-outline">
                ☎ 968 241 025
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <ScrollReveal />
    </>
  );
}
