import { Metadata } from 'next';
import { getTranslations } from '@/data/translations';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTopButton from '@/components/layout/WhatsAppButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Hero from '@/components/home/Hero';
import AboutStrip from '@/components/home/AboutStrip';
import ServicesSection from '@/components/home/ServicesSection';
import TeamSection from '@/components/home/TeamSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ContactSection from '@/components/home/ContactSection';
import { LocalBusinessSchema } from '@/components/seo/SchemaOrg';

export const metadata: Metadata = {
  title: 'Abogados en Murcia — García-Valcárcel & Cáceres | Bufete desde 1946',
  description:
    'Abogados en Murcia con más de 75 años de experiencia. Especialistas en accidentes de tráfico, divorcios, derecho bancario, penal, inmobiliario y sucesorio. ☎ 968 241 025.',
  alternates: {
    canonical: 'https://www.gvcabogados.com/es',
    languages: { en: '/en' },
  },
  openGraph: {
    title: 'Abogados en Murcia — García-Valcárcel & Cáceres',
    description: 'Bufete de abogados en Murcia fundado en 1946. Más de 75 años de experiencia.',
    url: 'https://www.gvcabogados.com/es',
    siteName: 'García-Valcárcel & Cáceres Abogados',
    locale: 'es_ES',
    type: 'website',
  },
};

export default function HomePageEs() {
  const locale = 'es';

  return (
    <>
      <LocalBusinessSchema locale={locale} />
      <Navbar locale={locale} />
      <main>
        <Hero locale={locale} />
        <AboutStrip locale={locale} />
        <ServicesSection locale={locale} />
        <TeamSection locale={locale} />
        <TestimonialsSection locale={locale} />
        <ContactSection locale={locale} />
      </main>
      <Footer locale={locale} />
      <BackToTopButton />
      <ScrollReveal />
    </>
  );
}
