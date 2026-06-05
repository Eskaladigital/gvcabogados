import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ContactSection from '@/components/home/ContactSection';
import OfficeMap from '@/components/home/OfficeMap';

export const metadata: Metadata = { title: 'Contact — Free Consultation | Lawyers in Murcia | GVC Lawyers', description: 'Contact our law firm in Murcia. Free consultation with no obligation. Phone: +34 968 241 025.', alternates: { canonical: 'https://www.gvcabogados.com/en/contact' } };

export default function ContactPageEn() {
  const locale = 'en';
  return (
    <>
      <Navbar locale={locale} />
      <main>
        <section className="bg-brand-dark py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
          <div className="container-custom relative z-10">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-[700px]">Contact <em className="italic text-brand-gold font-normal">us</em></h1>
            <p className="text-neutral-300 text-base mt-4 max-w-[560px]">Tell us about your case with no obligation. First consultation is free.</p>
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
