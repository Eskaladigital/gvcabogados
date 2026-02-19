'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const t = {
  es: {
    subtitle: 'Bufete de Abogados',
    heading: 'Página no encontrada',
    description:
      'Lo sentimos, la página que busca no existe o ha sido movida. Puede volver al inicio o explorar nuestras áreas de práctica.',
    backHome: 'Volver al inicio',
    areasLabel: 'Áreas de práctica',
    home: '/es',
    areas: [
      { name: 'Accidentes de Tráfico', href: '/es/servicios/accidentes-trafico' },
      { name: 'Derecho de Familia', href: '/es/servicios/derecho-familia' },
      { name: 'Negligencias Médicas', href: '/es/servicios/negligencias-medicas' },
      { name: 'Inmigración', href: '/es/servicios/permisos-residencia' },
      { name: 'Responsabilidad Civil', href: '/es/servicios/responsabilidad-civil' },
      { name: 'Resp. Administración', href: '/es/servicios/responsabilidad-administracion' },
    ],
  },
  en: {
    subtitle: 'Law Firm',
    heading: 'Page not found',
    description:
      'Sorry, the page you are looking for does not exist or has been moved. You can return to the homepage or explore our practice areas.',
    backHome: 'Back to homepage',
    areasLabel: 'Practice areas',
    home: '/en',
    areas: [
      { name: 'Traffic Accidents', href: '/en/services/traffic-accidents' },
      { name: 'Family Law', href: '/en/services/family-law' },
      { name: 'Medical Malpractice', href: '/en/services/medical-malpractice' },
      { name: 'Immigration', href: '/en/services/immigration' },
      { name: 'Civil Liability', href: '/en/services/civil-liability' },
      { name: 'Administrative Law', href: '/en/services/administrative-law' },
    ],
  },
};

export default function NotFound() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith('/en');
  const i = isEn ? t.en : t.es;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="border-b border-brand-brown/20 bg-white">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link href={i.home} className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo/gvcabogados_murcia_logo_favicon_marron_sinfondo.webp"
                alt="GVC Abogados"
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-sm font-bold text-brand-dark tracking-wide">
                García-Valcárcel &amp; Cáceres
              </div>
              <div className="text-[0.55rem] text-brand-dark/50 uppercase tracking-[0.15em]">
                {i.subtitle}
              </div>
            </div>
          </Link>

          <div className="flex gap-3">
            <Link
              href="/es"
              className={`text-xs font-medium transition-colors px-3 py-1.5 rounded border ${
                !isEn
                  ? 'text-brand-dark border-brand-brown bg-brand-brown/15'
                  : 'text-brand-dark/40 border-brand-brown/20 hover:text-brand-dark hover:border-brand-brown/40'
              }`}
            >
              ES
            </Link>
            <Link
              href="/en"
              className={`text-xs font-medium transition-colors px-3 py-1.5 rounded border ${
                isEn
                  ? 'text-brand-dark border-brand-brown bg-brand-brown/15'
                  : 'text-brand-dark/40 border-brand-brown/20 hover:text-brand-dark hover:border-brand-brown/40'
              }`}
            >
              EN
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(61,43,20,.3) 1px,transparent 1px), linear-gradient(90deg,rgba(61,43,20,.3) 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative z-10 text-center px-6 py-20 max-w-2xl mx-auto">
          <div className="font-display text-[8rem] sm:text-[10rem] font-bold text-brand-brown/30 leading-none select-none">
            404
          </div>

          <div className="relative -mt-10 sm:-mt-14">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark mb-4">
              {i.heading}
            </h1>
            <p className="text-brand-dark/60 text-sm sm:text-base leading-relaxed mb-10 max-w-md mx-auto">
              {i.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
              <Link
                href={i.home}
                className="inline-flex items-center justify-center gap-2 bg-brand-brown text-brand-dark text-xs font-semibold px-8 py-4 tracking-wide transition-all duration-300 hover:bg-brand-brown/80 hover:-translate-y-0.5 hover:shadow-xl"
              >
                {i.backHome}
              </Link>
              <a
                href="tel:+34968241025"
                className="inline-flex items-center justify-center gap-2 border border-brand-dark/20 text-brand-dark text-xs font-semibold px-8 py-4 tracking-wide transition-all duration-300 hover:border-brand-dark/40 hover:bg-brand-dark/5"
              >
                ☎ 968 241 025
              </a>
            </div>
          </div>

          <div className="border-t border-brand-brown/20 pt-10">
            <p className="text-[0.65rem] text-brand-dark/40 uppercase tracking-[0.2em] mb-6">
              {i.areasLabel}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {i.areas.map((area) => (
                <Link
                  key={area.href}
                  href={area.href}
                  className="group bg-white border border-brand-brown/20 rounded-xl px-4 py-3 hover:border-brand-brown hover:shadow-md transition-all"
                >
                  <span className="text-xs text-brand-dark/70 group-hover:text-brand-dark transition-colors">
                    {area.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-brand-brown/20 py-6 bg-white">
        <div className="container-custom text-center">
          <p className="text-[0.65rem] text-brand-dark/40">
            © {new Date().getFullYear()} García-Valcárcel &amp; Cáceres Abogados. Plaza Fuensanta, 3 — Murcia.
          </p>
        </div>
      </footer>
    </div>
  );
}
