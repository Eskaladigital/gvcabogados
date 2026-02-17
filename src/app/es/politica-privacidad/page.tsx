import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = { title: 'Política de Privacidad — GVC Abogados Murcia', robots: 'noindex' };

export default function PrivacidadPage() {
  return (
    <>
      <Navbar locale="es" />
      <main className="py-16 md:py-24">
        <div className="container-custom max-w-[800px]">
          <h1 className="section-title mb-8">Política de Privacidad</h1>
          <div className="prose-blog">
            <p>En García-Valcárcel & Cáceres Abogados, respetamos y protegemos la privacidad de nuestros usuarios de conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).</p>
            <h2>Responsable del tratamiento</h2>
            <p><strong>García-Valcárcel & Cáceres Abogados</strong><br />Gran Vía, 15 — 3ª Planta, 30008 Murcia<br />Email: contacto@gvcabogados.com</p>
            <h2>Finalidad del tratamiento</h2>
            <p>Los datos personales recogidos a través del formulario de contacto serán tratados con la finalidad de atender su consulta jurídica y, en su caso, prestarle los servicios profesionales solicitados.</p>
            <h2>Legitimación</h2>
            <p>La base legal para el tratamiento es el consentimiento del interesado y la ejecución de un contrato de prestación de servicios jurídicos.</p>
            <h2>Derechos</h2>
            <p>Puede ejercer sus derechos de acceso, rectificación, supresión, portabilidad, limitación y oposición enviando un email a contacto@gvcabogados.com.</p>
          </div>
        </div>
      </main>
      <Footer locale="es" />
    </>
  );
}
