import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Car, Users, Building2, Scale, Home, FileText, 
  Briefcase, Shield, Clipboard, Handshake, Globe, 
  Landmark, Stethoscope 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getServicesByLocale } from '@/data/services';

export const metadata: Metadata = {
  title: 'Practice Areas — Legal Services in Murcia | GVC Lawyers',
  description: 'Specialized legal services in Murcia: traffic accidents, divorce, banking law, criminal law, real estate, inheritance and more.',
  alternates: { canonical: 'https://www.gvcabogados.com/en/services' },
};

export default function ServicesPageEn() {
  const locale = 'en';
  const services = getServicesByLocale(locale);

  // Función para obtener el icono sólido según el servicio
  const getServiceIcon = (serviceId: string) => {
    const iconProps = { size: 28, className: 'text-brand-dark flex-shrink-0' };
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
      case 'obligaciones':
        return <Globe {...iconProps} />;
      case 'derecho-administrativo':
        return <Landmark {...iconProps} />;
      case 'negligencias-medicas':
        return <Stethoscope {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar locale={locale} />
      <main>
        <section className="bg-brand-dark py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
          <div className="container-custom relative z-10">
            <div className="section-tag">Practice Areas</div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-[700px]">Specialized <em className="italic text-brand-gold font-normal">legal services</em> in Murcia</h1>
            <p className="text-neutral-300 text-base mt-4 max-w-[560px]">Our multidisciplinary team covers all areas of private and public law, offering comprehensive solutions.</p>
          </div>
        </section>
        <section className="py-12 md:py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link key={service.id} href={`/en/services/${service.slug}`} className="reveal group bg-white border border-neutral-200 p-6 hover:border-brand-brown hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="mb-3">{getServiceIcon(service.id)}</div>
                  <h2 className="font-serif text-lg font-semibold text-brand-dark mb-2 group-hover:text-brand-brown transition-colors">{service.name}</h2>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">{service.description}</p>
                  <span className="text-[0.7rem] font-semibold text-brand-brown opacity-0 group-hover:opacity-100 transition-opacity">Learn more →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <ScrollReveal />
    </>
  );
}
