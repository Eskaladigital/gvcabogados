import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Hero from '@/components/home/Hero';
import AboutStrip from '@/components/home/AboutStrip';
import ServicesSection from '@/components/home/ServicesSection';
import TeamSection from '@/components/home/TeamSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ContactSection from '@/components/home/ContactSection';
import StrategicCTAs from '@/components/home/StrategicCTAs';
import { LocalBusinessSchema } from '@/components/seo/SchemaOrg';

export const metadata: Metadata = {
  title: 'Lawyers in Murcia, Spain — García-Valcárcel & Cáceres | Law Firm since 1946',
  description:
    'Lawyers in Murcia, Spain with over 75 years of experience. Specialists in traffic accidents, divorce, banking law, criminal law, real estate and inheritance law. Free initial consultation. ☎ +34 968 241 025.',
  alternates: {
    canonical: 'https://www.gvcabogados.com/en',
    languages: { es: '/es' },
  },
  openGraph: {
    title: 'Lawyers in Murcia, Spain — García-Valcárcel & Cáceres',
    description: 'Law firm in Murcia founded in 1946. Over 75 years of experience. Free initial consultation.',
    url: 'https://www.gvcabogados.com/en',
    siteName: 'García-Valcárcel & Cáceres Lawyers',
    locale: 'en_GB',
    type: 'website',
  },
};

export default function HomePageEn() {
  const locale = 'en';

  return (
    <>
      <LocalBusinessSchema locale={locale} />
      <Navbar locale={locale} />
      <main>
        <Hero locale={locale} />
        <AboutStrip locale={locale} />
        <ServicesSection locale={locale} />
        <StrategicCTAs locale={locale} />
        <TeamSection locale={locale} />
        <TestimonialsSection locale={locale} />
        <ContactSection locale={locale} />
      </main>
      <Footer locale={locale} />
      <ScrollReveal />
    </>
  );
}
