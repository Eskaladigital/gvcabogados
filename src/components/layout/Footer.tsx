import Link from 'next/link';
import Image from 'next/image';
import { getTranslations, Locale } from '@/data/translations';
import { getServicesByLocale } from '@/data/services';
import { CookieSettingsButton } from '@/components/CookieConsentBar';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const t = getTranslations(locale);
  const services = getServicesByLocale(locale).slice(0, 6);
  const prefix = `/${locale}`;

  return (
    <footer className="bg-brand-brown pt-14 text-brand-dark">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.7fr_1fr_0.9fr] gap-x-8 gap-y-10 pb-10 border-b border-brand-dark/10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href={prefix} className="flex items-center gap-3">
              <div className="w-12 h-12 relative shrink-0">
                <Image
                  src="/images/logo/gvcabogados_murcia_logo_favicon_marron_sinfondo.webp"
                  alt="GV&C Logo"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <span className="text-brand-dark text-base font-semibold leading-tight">García-Valcárcel<br />& Cáceres</span>
            </Link>
            <p className="text-[0.78rem] text-brand-dark/70 leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Areas */}
          <div>
            <h4 className="text-[0.68rem] font-semibold text-brand-dark uppercase tracking-[0.12em] mb-3">
              {t.footer.areas}
            </h4>
            <ul className="flex flex-col gap-1.5 list-none">
              {services.map((s) => (
                <li key={s.id} className="m-0 p-0">
                  <Link
                    href={`${prefix}/servicios/${s.slug}`}
                    className="text-[0.78rem] text-brand-dark/70 hover:text-brand-dark transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Firm */}
          <div>
            <h4 className="text-[0.68rem] font-semibold text-brand-dark uppercase tracking-[0.12em] mb-3">
              {t.footer.firm}
            </h4>
            <ul className="flex flex-col gap-1.5 list-none">
              <li className="m-0 p-0">
                <Link href={`${prefix}/sobre-nosotros`} className="text-[0.78rem] text-brand-dark/70 hover:text-brand-dark transition-colors">
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li className="m-0 p-0">
                <Link href={`${prefix}/equipo`} className="text-[0.78rem] text-brand-dark/70 hover:text-brand-dark transition-colors">
                  {t.footer.teamLink}
                </Link>
              </li>
              <li className="m-0 p-0">
                <Link href={`${prefix}/blog`} className="text-[0.78rem] text-brand-dark/70 hover:text-brand-dark transition-colors">
                  {t.footer.news}
                </Link>
              </li>
              <li className="m-0 p-0">
                <Link href={`${prefix}/sitemap`} className="text-[0.78rem] text-brand-dark/70 hover:text-brand-dark transition-colors">
                  {t.nav.sitemap}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[0.68rem] font-semibold text-brand-dark uppercase tracking-[0.12em] mb-3">
              {t.footer.contactSection}
            </h4>
            <ul className="flex flex-col gap-1.5 list-none">
              <li className="m-0 p-0 text-[0.78rem] text-brand-dark/70">Gran Vía, 15 — 3ª Planta<br />30008 Murcia</li>
              <li className="m-0 p-0">
                <a href="tel:+34968241025" className="text-[0.78rem] text-brand-dark/70 hover:text-brand-dark transition-colors">
                  968 241 025
                </a>
              </li>
              <li className="m-0 p-0">
                <a href="mailto:contacto@gvcabogados.com" className="text-[0.78rem] text-brand-dark/70 hover:text-brand-dark transition-colors">
                  contacto@gvcabogados.com
                </a>
              </li>
              <li className="m-0 p-0 text-[0.78rem] text-brand-dark/70">{t.contact.schedule.value}</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[0.68rem] font-semibold text-brand-dark uppercase tracking-[0.12em] mb-3">
              Legal
            </h4>
            <ul className="flex flex-col gap-1.5 list-none">
              <li className="m-0 p-0">
                <Link href={`${prefix}/aviso-legal`} className="text-[0.78rem] text-brand-dark/70 hover:text-brand-dark transition-colors">
                  {t.nav.legalNotice}
                </Link>
              </li>
              <li className="m-0 p-0">
                <Link href={`${prefix}/politica-privacidad`} className="text-[0.78rem] text-brand-dark/70 hover:text-brand-dark transition-colors">
                  {t.nav.privacy}
                </Link>
              </li>
              <li className="m-0 p-0">
                <Link href={`${prefix}/politica-cookies`} className="text-[0.78rem] text-brand-dark/70 hover:text-brand-dark transition-colors">
                  {t.nav.cookies}
                </Link>
              </li>
              <li className="m-0 p-0">
                <CookieSettingsButton
                  className="text-[0.78rem] text-brand-dark/70 hover:text-brand-dark transition-colors bg-transparent p-0 border-0 cursor-pointer"
                  label={locale === 'es' ? 'Configurar cookies' : 'Manage cookies'}
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-5 flex flex-col items-center gap-3">
          <p className="text-[0.68rem] text-brand-dark/70">{t.footer.rights}</p>
          <p className="text-[0.68rem] text-brand-dark/70 text-center leading-relaxed">
            <span className="block sm:inline">Hecho con <span className="text-red-600 inline-block animate-pulse">❤️</span> en Murcia</span>
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline mt-1 sm:mt-0">
              Web desarrollada por{' '}
              <a href="https://www.eskaladigital.com" target="_blank" rel="noopener noreferrer" className="text-brand-dark font-medium whitespace-nowrap hover:underline">
                ESKALA Agencia de Marketing Digital
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
