import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getTranslations } from '@/data/translations';

export const metadata: Metadata = {
  title: 'About Us — Lawyers in Murcia | García-Valcárcel & Cáceres',
  description: 'Learn about the history and values of our law firm in Murcia. Founded in 1946, with over 75 years of legal excellence.',
  alternates: { canonical: 'https://www.gvcabogados.com/en/about' },
};

export default function AboutPage() {
  const locale = 'en';
  const t = getTranslations(locale);
  return (
    <>
      <Navbar locale={locale} />
      <main>
        <section className="bg-brand-dark py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
          <div className="container-custom relative z-10">
            <div className="flex items-center gap-3 mb-4"><span className="w-9 h-0.5 bg-brand-brown" /><span className="text-[0.7rem] font-semibold text-brand-brown tracking-[0.2em] uppercase">The Firm</span></div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-[700px]">Law firm in Murcia with <em className="italic text-brand-gold font-normal">over 75 years</em> of legal tradition</h1>
          </div>
        </section>
        <section className="py-12 md:py-20">
          <div className="container-custom">
            <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="section-title mb-6">Our <span className="text-brand-brown">History</span></h2>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">This firm was founded by <strong className="text-brand-dark">Pedro-Alfonso García-Valcárcel y Escribano</strong> and his uncle <strong className="text-brand-dark">Blas García-Valcárcel</strong>, who was already practicing law since November 6, 1946.</p>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">At García-Valcárcel & Cáceres we are experts in various areas of practice. We work in both private and public law, adapting our knowledge and team of experts to the needs of our clients.</p>
                <p className="text-sm text-neutral-500 leading-relaxed">Based in Gran Vía, Murcia, our firm has witnessed the evolution of Spanish law for over seven decades, always maintaining our commitment to excellence.</p>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 p-8">
                <div className="font-serif text-4xl text-brand-brown/30 leading-none mb-3">&ldquo;</div>
                <p className="font-serif text-lg text-brand-dark leading-relaxed italic mb-6">{t.about.founderQuote}</p>
                <div className="w-8 h-px bg-neutral-200 mb-3" />
                <div className="text-sm font-semibold text-brand-dark">Pedro A. García-Valcárcel</div>
                <div className="text-[0.65rem] text-brand-brown uppercase tracking-wider">Founding Partner</div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20 bg-neutral-50 border-y border-neutral-200">
          <div className="container-custom">
            <h2 className="section-title mb-10 text-center">Our <span className="text-brand-brown">Values</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[{ icon: '✦', title: 'Quality', desc: 'Maximum rigor in every case' }, { icon: '◆', title: 'Trust', desc: 'Total transparency with clients' }, { icon: '★', title: 'Experience', desc: 'Over 75 years of practice' }, { icon: '♦', title: 'Nobility', desc: 'Professional integrity and honesty' }].map((v, i) => (
                <div key={i} className="reveal text-center p-6 bg-white border border-neutral-200 hover:border-brand-brown transition-colors">
                  <div className="text-2xl text-brand-brown mb-3">{v.icon}</div>
                  <h3 className="font-serif text-lg font-semibold text-brand-dark mb-2">{v.title}</h3>
                  <p className="text-xs text-neutral-400">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
      <ScrollReveal />
    </>
  );
}
