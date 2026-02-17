import Link from 'next/link';
import Image from 'next/image';
import { getTranslations, Locale } from '@/data/translations';
import { getServicesByLocale } from '@/data/services';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-brand-dark/10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href={prefix} className="flex flex-col items-start gap-2">
              <div className="w-16 h-16 relative flex items-center justify-center">
                <Image
                  src="/images/logo/gvcabogados_murcia_logo_favicon_marron_sinfondo.webp"
                  alt="GV&C Logo"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-brand-dark text-base font-semibold">García-Valcárcel & Cáceres</span>
            </Link>
            <p className="text-[0.78rem] text-brand-dark/70 leading-relaxed max-w-[280px]">
              {t.footer.description}
            </p>
          </div>

          {/* Areas */}
          <div>
            <h4 className="text-[0.68rem] font-semibold text-brand-dark uppercase tracking-[0.12em] mb-2">
              {t.footer.areas}
            </h4>
            <ul className="flex flex-col gap-1 list-none">
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
            <h4 className="text-[0.68rem] font-semibold text-brand-dark uppercase tracking-[0.12em] mb-2">
              {t.footer.firm}
            </h4>
            <ul className="flex flex-col gap-1 list-none">
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
            <h4 className="text-[0.68rem] font-semibold text-brand-dark uppercase tracking-[0.12em] mb-2">
              {t.footer.contactSection}
            </h4>
            <ul className="flex flex-col gap-1 list-none">
              <li className="m-0 p-0 text-[0.78rem] text-brand-dark/70">Gran Vía, 15 · Murcia</li>
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
              <li className="m-0 p-0 text-[0.78rem] text-brand-dark/70">{locale === 'es' ? 'Lun–Vie: 9–14 / 17–20' : 'Mon–Fri: 9–14 / 17–20'}</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-5 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[0.68rem] text-brand-dark/70">{t.footer.rights}</p>
          <div className="flex gap-6">
            <Link href={`${prefix}/aviso-legal`} className="text-[0.68rem] text-brand-dark/70 hover:text-brand-dark transition-colors">
              {t.nav.legalNotice}
            </Link>
            <Link href={`${prefix}/politica-privacidad`} className="text-[0.68rem] text-brand-dark/70 hover:text-brand-dark transition-colors">
              {t.nav.privacy}
            </Link>
            <Link href={`${prefix}/politica-cookies`} className="text-[0.68rem] text-brand-dark/70 hover:text-brand-dark transition-colors">
              {t.nav.cookies}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
