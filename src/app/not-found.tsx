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
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      <header className="border-b border-white/10">
        <div className="container-custom py-4 flex items-center justify-between">
          <Link href={i.home} className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo/gvcabogados_murcia_logo_leon_blanco.webp"
                alt="GVC Abogados"
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-sm font-bold text-white tracking-wide">
                García-Valcárcel &amp; Cáceres
              </div>
              <div className="text-[0.55rem] text-neutral-400 uppercase tracking-[0.15em]">
                {i.subtitle}
              </div>
            </div>
          </Link>

          <div className="flex gap-3">
            <Link
              href="/es"
              className={`text-xs font-medium transition-colors px-3 py-1.5 rounded border ${
                !isEn
                  ? 'text-white border-brand-brown/50 bg-brand-brown/10'
                  : 'text-neutral-400 border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              ES
            </Link>
            <Link
              href="/en"
              className={`text-xs font-medium transition-colors px-3 py-1.5 rounded border ${
                isEn
                  ? 'text-white border-brand-brown/50 bg-brand-brown/10'
                  : 'text-neutral-400 border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              EN
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 40%, rgba(204,178,127,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(204,178,127,0.3) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 text-center px-6 py-20 max-w-2xl mx-auto">
          <div className="font-display text-[8rem] sm:text-[10rem] font-bold text-brand-brown/20 leading-none select-none">
            404
          </div>

          <div className="relative -mt-10 sm:-mt-14">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              {i.heading}
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-10 max-w-md mx-auto">
              {i.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
              <Link
                href={i.home}
                className="inline-flex items-center justify-center gap-2 bg-brand-brown text-white text-xs font-semibold px-8 py-4 tracking-wide transition-all duration-300 hover:bg-brand-brown/80 hover:-translate-y-0.5 hover:shadow-xl"
              >
                {i.backHome}
              </Link>
              <a
                href="tel:+34968241025"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white text-xs font-semibold px-8 py-4 tracking-wide transition-all duration-300 hover:border-white/40 hover:bg-white/5"
              >
                ☎ 968 241 025
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-10">
            <p className="text-[0.65rem] text-neutral-500 uppercase tracking-[0.2em] mb-6">
              {i.areasLabel}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {i.areas.map((area) => (
                <Link
                  key={area.href}
                  href={area.href}
                  className="group bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-brand-brown/40 hover:bg-brand-brown/5 transition-all"
                >
                  <span className="text-xs text-neutral-300 group-hover:text-brand-brown transition-colors">
                    {area.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-6">
        <div className="container-custom text-center">
          <p className="text-[0.65rem] text-neutral-500">
            © {new Date().getFullYear()} García-Valcárcel &amp; Cáceres Abogados. Gran Vía, 15 — Murcia.
          </p>
        </div>
      </footer>
    </div>
  );
}
