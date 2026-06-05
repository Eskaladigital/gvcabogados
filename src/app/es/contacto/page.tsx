import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ContactSection from '@/components/home/ContactSection';
import OfficeMap from '@/components/home/OfficeMap';
import { BreadcrumbSchema, LocalBusinessSchema } from '@/components/seo/SchemaOrg';

export const metadata: Metadata = {
  title: 'Contacto | Abogados en Murcia | GVC Abogados',
  description: 'Contacte con García-Valcárcel & Cáceres, abogados en Murcia. ☎ 968 241 025. Gran Vía 15, 3ª Planta, 30008 Murcia.',
  alternates: {
    canonical: 'https://www.gvcabogados.com/es/contacto',
    languages: { en: '/en/contact' },
  },
};

export default function ContactoPage() {
  const locale = 'es';

  const breadcrumbs = [
    { name: 'Inicio', href: '/es' },
    { name: 'Contacto', href: '/es/contacto' },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <LocalBusinessSchema locale={locale} />
      <Navbar locale={locale} />
      <main>
        <section className="bg-brand-dark py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
          <div className="container-custom relative z-10">
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-[700px] mt-4">
              Contacte con nuestros <em className="italic text-brand-gold font-normal">abogados en Murcia</em>
            </h1>
            <p className="text-neutral-300 text-base mt-4 max-w-[560px]">
              Cuéntenos su caso sin compromiso. Respondemos en menos de 24 horas.
            </p>
          </div>
        </section>

        <ContactSection locale={locale} />

        <OfficeMap locale={locale} />
      </main>
      <Footer locale={locale} />
      <ScrollReveal />
    </>
  );
}
