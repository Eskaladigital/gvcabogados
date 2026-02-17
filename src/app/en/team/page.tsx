import { Metadata } from 'next';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTopButton from '@/components/layout/WhatsAppButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getTeamByLocale } from '@/data/team';
import { getTranslations } from '@/data/translations';

export const metadata: Metadata = { title: 'Team — Professional Lawyers in Murcia | GVC Lawyers', description: 'Meet our team of lawyers in Murcia.', alternates: { canonical: 'https://www.gvcabogados.com/en/team' } };

export default function TeamPageEn() {
  const locale = 'en';
  const t = getTranslations(locale);
  const members = getTeamByLocale(locale);
  return (
    <>
      <Navbar locale={locale} />
      <main>
        <section className="bg-brand-dark py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
          <div className="container-custom relative z-10">
            <div className="section-tag">Our Team</div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-[700px]">Professionals <em className="italic text-brand-gold font-normal">committed</em> to your case</h1>
            <p className="text-neutral-300 text-base mt-4 max-w-[560px]">{t.team.description}</p>
          </div>
        </section>
        <section className="py-12 md:py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((m) => (
                <div key={m.id} className="reveal group bg-white border border-neutral-200 overflow-hidden rounded-2xl hover:-translate-y-1 hover:shadow-lg hover:border-brand-brown transition-all duration-500">
                  <div className="aspect-[3/4] relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-brand-dark2 to-brand-dark3">
                    {/* Placeholder de fondo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl text-white/10 font-serif font-bold">{m.name[0]}</span>
                    </div>
                    {/* Imagen real */}
                    <div className="absolute inset-0">
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-brand-dark/70 to-transparent z-[2]" />
                    <div className="absolute top-4 right-4 w-11 h-11 bg-brand-brown-hover rounded-full flex items-center justify-center z-[3] border-2 border-white/20 shadow-lg">
                      <div className="w-6 h-6 relative">
                        <Image
                          src="/images/logo/gvcabogados_murcia_logo_leon_blanco.png"
                          alt="Lion"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="font-serif text-lg font-semibold text-brand-dark mb-1">{m.name}</div>
                    <div className="text-[0.65rem] font-semibold text-brand-brown uppercase tracking-[0.08em] mb-3">{m.role}</div>
                    <p className="text-[0.8rem] text-neutral-400 leading-relaxed">{m.bio}</p>
                  </div>
                  <div className="h-[3px] bg-gradient-to-r from-brand-brown to-brand-gold w-0 group-hover:w-full transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <BackToTopButton />
      <ScrollReveal />
    </>
  );
}
