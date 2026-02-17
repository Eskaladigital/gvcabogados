import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ContactSection from '@/components/home/ContactSection';

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
        <section className="border-t border-neutral-200">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3145.7!2d-1.13!3d37.98!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sGran+V%C3%ADa+15%2C+30008+Murcia!5e0!3m2!1sen!2ses!4v1" className="w-full h-[400px] border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location" />
        </section>
      </main>
      <Footer locale={locale} />
      <ScrollReveal />
    </>
  );
}
