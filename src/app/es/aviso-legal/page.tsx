import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Aviso Legal — GVC Abogados Murcia',
  robots: 'noindex',
};

export default function AvisoLegalPage() {
  return (
    <>
      <Navbar locale="es" />
      <main className="py-16 md:py-24">
        <div className="container-custom max-w-[800px]">
          <h1 className="section-title mb-8">Aviso Legal</h1>
          <div className="prose-blog">
            <p>En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa que el presente sitio web es propiedad de:</p>
            <p><strong>García-Valcárcel & Cáceres Abogados</strong><br />Gran Vía, 15 — 3ª Planta<br />30008 Murcia, España<br />CIF: [CIF del despacho]<br />Teléfono: 968 241 025<br />Email: contacto@gvcabogados.com</p>
            <h2>Condiciones de uso</h2>
            <p>El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación plena de todas las condiciones incluidas en este Aviso Legal. El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que García-Valcárcel & Cáceres Abogados ofrece a través de su web.</p>
            <h2>Propiedad intelectual</h2>
            <p>Todos los contenidos de este sitio web, incluyendo textos, imágenes, logotipos, iconos, y software, son propiedad de García-Valcárcel & Cáceres Abogados o de sus licenciantes y están protegidos por las leyes de propiedad intelectual e industrial.</p>
            <h2>Limitación de responsabilidad</h2>
            <p>García-Valcárcel & Cáceres Abogados no se hace responsable de los posibles errores de seguridad que se puedan producir ni de los posibles daños que puedan causarse al sistema informático del usuario, como consecuencia de la presencia de virus en el ordenador utilizado para la conexión a los servicios y contenidos de la web.</p>
          </div>
        </div>
      </main>
      <Footer locale="es" />
    </>
  );
}
