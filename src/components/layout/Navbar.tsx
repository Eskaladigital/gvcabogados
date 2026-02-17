'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, Search, Phone, Mail, ChevronDown, 
  Car, Users, Building2, Scale, Home, FileText, 
  Briefcase, Shield, Clipboard, Handshake, Globe, 
  Landmark, Stethoscope 
} from 'lucide-react';
import { getTranslations, Locale } from '@/data/translations';
import { getServicesByLocale } from '@/data/services';

interface NavbarProps {
  locale: Locale;
  alternateUrl?: string; // URL alternativa para el idioma opuesto
}

export default function Navbar({ locale, alternateUrl }: NavbarProps) {
  const t = getTranslations(locale);
  const pathname = usePathname();
  const servicesRaw = getServicesByLocale(locale);
  // Ordenar servicios alfabéticamente por nombre
  const services = [...servicesRaw].sort((a, b) => a.name.localeCompare(b.name, locale));
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const otherLocale = locale === 'es' ? 'en' : 'es';

  // Generar URL alternativa si no se proporciona
  const getAlternateUrl = () => {
    if (alternateUrl) return alternateUrl;
    
    // Simple fallback: reemplazar /es/ por /en/ o viceversa
    const currentPath = pathname || '';
    if (locale === 'es') {
      return currentPath.replace('/es/', '/en/').replace('/es', '/en');
    } else {
      return currentPath.replace('/en/', '/es/').replace('/en', '/es');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const prefix = `/${locale}`;
  
  // Rutas traducidas según el idioma
  const routes = {
    about: locale === 'es' ? 'sobre-nosotros' : 'about',
    services: locale === 'es' ? 'servicios' : 'services',
    team: locale === 'es' ? 'equipo' : 'team',
    contact: locale === 'es' ? 'contacto' : 'contact',
    blog: 'blog', // igual en ambos idiomas
  };

  // Función para obtener el icono blanco y sólido según el servicio
  const getServiceIcon = (serviceId: string) => {
    const iconProps = { size: 14, className: 'text-white flex-shrink-0' };
    switch (serviceId) {
      case 'accidentes-trafico':
        return <Car {...iconProps} />;
      case 'derecho-familia':
        return <Users {...iconProps} />;
      case 'derecho-bancario':
        return <Building2 {...iconProps} />;
      case 'derecho-penal':
        return <Scale {...iconProps} />;
      case 'derecho-inmobiliario':
        return <Home {...iconProps} />;
      case 'derecho-sucesorio':
        return <FileText {...iconProps} />;
      case 'derecho-mercantil':
        return <Briefcase {...iconProps} />;
      case 'responsabilidad-civil':
        return <Shield {...iconProps} />;
      case 'extranjeria':
        return <Clipboard {...iconProps} />;
      case 'mediacion':
        return <Handshake {...iconProps} />;
      case 'obligaciones-contratos':
        return <FileText {...iconProps} />;
      case 'derecho-administrativo':
        return <Landmark {...iconProps} />;
      case 'defensa-fondos-buitre':
        return <Shield {...iconProps} />;
      case 'negligencias-medicas':
        return <Stethoscope {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Topbar */}
      <div className="hidden lg:block bg-brand-brown py-2 text-[0.7rem] text-brand-dark border-b border-brand-dark/10">
        <div className="container-custom flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1.5">
              <Phone size={11} className="text-neutral-400" />
              968 241 025
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={11} className="text-neutral-400" />
              contacto@gvcabogados.com
            </span>
          </div>
          <div className="flex items-center">
            <Link
              href={getAlternateUrl()}
              className="text-brand-dark/80 hover:text-brand-dark transition-colors uppercase font-semibold tracking-wider"
            >
              {otherLocale.toUpperCase()}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav
        className={`bg-brand-brown sticky top-0 z-[200] transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.4)]' : ''
        }`}
      >
        <div className="container-custom flex items-center justify-between h-[62px] md:h-[70px]">
          {/* Logo */}
          <Link href={prefix} className="flex items-center gap-2.5 no-underline">
            <div className="w-[42px] h-[42px] md:w-[50px] md:h-[50px] relative flex items-center justify-center">
              <Image
                src="/images/logo/gvcabogados_murcia_logo_favicon_marron_sinfondo.png"
                alt="GV&C Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="text-brand-dark text-sm md:text-[1.15rem] font-bold leading-tight tracking-tight">
              García-Valcárcel & Cáceres
              <span className="block font-normal text-brand-dark/70 text-[0.52rem] md:text-[0.7rem] tracking-[0.08em] uppercase">
                Bufete de Abogados
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex gap-0 list-none h-full">
            <li className="flex items-center">
              <Link
                href={prefix}
                className="text-brand-dark/80 text-[0.78rem] font-medium px-5 h-full flex items-center border-b-2 border-transparent hover:text-brand-dark hover:border-brand-brown-hover transition-all"
              >
                {t.nav.home}
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                href={`${prefix}/${routes.about}`}
                className="text-brand-dark/80 text-[0.78rem] font-medium px-5 h-full flex items-center border-b-2 border-transparent hover:text-brand-dark hover:border-brand-brown-hover transition-all"
              >
                {t.nav.about}
              </Link>
            </li>
            <li
              className="flex items-center relative group"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link
                href={`${prefix}/${routes.services}`}
                className="text-brand-dark/80 text-[0.78rem] font-medium px-5 h-full flex items-center gap-1 border-b-2 border-transparent hover:text-brand-dark hover:border-brand-brown-hover transition-all"
              >
                {t.nav.services}
                <ChevronDown size={12} />
              </Link>
              {/* Dropdown */}
              <div
                className={`absolute top-full left-0 bg-brand-brown border border-brand-dark/20 min-w-[280px] py-2 shadow-xl transition-all duration-200 ${
                  servicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                {services.map((s) => (
                  <Link
                    key={s.id}
                    href={`${prefix}/${routes.services}/${s.slug}`}
                    className="flex items-center gap-2 px-5 py-2 text-brand-dark/80 text-[0.75rem] hover:bg-brand-dark/10 hover:text-brand-dark transition-colors"
                  >
                    {getServiceIcon(s.id)}
                    <span>{s.name}</span>
                  </Link>
                ))}
              </div>
            </li>
            <li className="flex items-center">
              <Link
                href={`${prefix}/${routes.team}`}
                className="text-brand-dark/80 text-[0.78rem] font-medium px-5 h-full flex items-center border-b-2 border-transparent hover:text-brand-dark hover:border-brand-brown-hover transition-all"
              >
                {t.nav.team}
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                href={`${prefix}/${routes.blog}`}
                className="text-brand-dark/80 text-[0.78rem] font-medium px-5 h-full flex items-center border-b-2 border-transparent hover:text-brand-dark hover:border-brand-brown-hover transition-all"
              >
                {t.nav.blog}
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                href={`${prefix}/${routes.contact}`}
                className="text-brand-dark/80 text-[0.78rem] font-medium px-5 h-full flex items-center border-b-2 border-transparent hover:text-brand-dark hover:border-brand-brown-hover transition-all"
              >
                {t.nav.contact}
              </Link>
            </li>
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href={`/${otherLocale}`}
                  className="lg:hidden text-brand-dark/80 text-[0.65rem] font-semibold uppercase tracking-wider hover:text-brand-dark transition-colors"
            >
              {otherLocale.toUpperCase()}
            </Link>
            <Link href={`${prefix}/${routes.contact}`} className="!bg-brand-brown-hover !text-white !text-[0.62rem] md:!text-[0.72rem] !px-3 md:!px-5 !py-2 md:!py-2.5 inline-flex items-center gap-2 font-semibold tracking-wide transition-all duration-300 border-none cursor-pointer hover:!bg-brand-dark hover:-translate-y-0.5 hover:shadow-lg">
              {t.nav.cta}
            </Link>
            <button
              className="lg:hidden text-brand-dark text-2xl bg-transparent border-none cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-brand-brown border-t border-brand-dark/10 pb-6">
            <div className="container-custom flex flex-col gap-1 pt-4">
              {[
                { href: prefix, label: t.nav.home },
                { href: `${prefix}/${routes.about}`, label: t.nav.about },
                { href: `${prefix}/${routes.services}`, label: t.nav.services },
                { href: `${prefix}/${routes.team}`, label: t.nav.team },
                { href: `${prefix}/${routes.blog}`, label: t.nav.blog },
                { href: `${prefix}/${routes.contact}`, label: t.nav.contact },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-brand-dark/80 text-sm py-3 border-b border-brand-dark/10 hover:text-brand-dark transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-4 items-center mt-4 text-brand-dark/70 text-xs">
                <span className="flex items-center gap-1"><Phone size={11} /> 968 241 025</span>
                <span className="flex items-center gap-1"><Mail size={11} /> contacto@gvcabogados.com</span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
