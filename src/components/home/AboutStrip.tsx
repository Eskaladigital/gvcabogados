import Link from 'next/link';
import Image from 'next/image';
import { getTranslations, Locale } from '@/data/translations';

interface AboutStripProps {
  locale: Locale;
}

export default function AboutStrip({ locale }: AboutStripProps) {
  const t = getTranslations(locale);
  const prefix = `/${locale}`;

  return (
    <section className="py-12 md:py-20 bg-white border-b border-neutral-200">
      <div className="container-custom">
        {/* Primera parte: Título y texto */}
        <div className="reveal grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-12 items-center mb-12 md:mb-16">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-brand-dark leading-snug max-w-[340px]">
            {t.about.title}{' '}
            <span className="text-brand-brown">{t.about.titleHighlight}</span>{' '}
            {t.about.titleEnd}
          </h2>
          <div>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-[600px]">
              {t.about.text}
            </p>
            <Link
              href={`${prefix}/sobre-nosotros`}
              className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-brand-brown mt-4 hover:gap-2.5 transition-all"
            >
              {t.about.link} →
            </Link>
          </div>
        </div>

        {/* Segunda parte: Pedro y el León - Diseño inspirado en la página original */}
        <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Columna izquierda: Texto */}
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-brand-dark mb-4">
                {locale === 'es' ? 'El valor de la experiencia' : 'The value of experience'}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                {t.about.text}
              </p>
            </div>

            {/* Cita del fundador */}
            <div className="bg-neutral-50 border border-neutral-200 p-6 md:p-8">
              <h4 className="font-serif text-lg md:text-xl font-semibold text-brand-dark mb-2">
                Pedro A. García-Valcárcel
              </h4>
              <p className="text-[0.7rem] text-brand-brown uppercase tracking-wider mb-4">
                {locale === 'es' ? 'Socio Fundador' : 'Founding Partner'}
              </p>
              <div className="font-serif text-3xl text-brand-brown/30 leading-none mb-3">
                &ldquo;
              </div>
              <blockquote className="font-serif text-base md:text-lg text-brand-dark leading-relaxed italic">
                {t.about.founderQuote}
              </blockquote>
            </div>
          </div>

          {/* Columna derecha: Imagen con fondo marrón */}
          <div className="relative">
            {/* Fondo marrón detrás */}
            <div className="absolute -inset-4 md:-inset-6 bg-brand-brown rounded-2xl z-0" />
            
            {/* Contenedor de la imagen */}
            <div className="relative z-10">
              <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark2 to-brand-dark3">
                {/* Imagen */}
                <div className="absolute inset-0">
                  <Image
                    src="/images/team/garcia_valcarcel_caceres_abogados_socio_fundador.webp"
                    alt="Pedro A. García-Valcárcel - Socio Fundador"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={75}
                  />
                </div>
                
                {/* Icono del León superpuesto */}
                <div className="absolute bottom-6 right-6 w-16 h-16 md:w-20 md:h-20 bg-[#ccb27f] rounded-lg flex items-center justify-center z-[3] shadow-lg border-2 border-white/20">
                  <div className="w-10 h-10 md:w-12 md:h-12 relative">
                    <Image
                      src="/images/logo/gvcabogados_murcia_logo_leon_blanco.webp"
                      alt="León - Símbolo de Nobleza"
                      fill
                      className="object-contain opacity-90"
                      sizes="48px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
