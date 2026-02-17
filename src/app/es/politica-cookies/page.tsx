import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = { title: 'Política de Cookies — GVC Abogados Murcia', robots: 'noindex' };

export default function CookiesPage() {
  return (
    <>
      <Navbar locale="es" />
      <main className="py-16 md:py-24">
        <div className="container-custom max-w-[800px]">
          <h1 className="section-title mb-8">Política de Cookies</h1>
          <div className="prose-blog">
            <p>Este sitio web utiliza cookies para mejorar la experiencia del usuario. Al navegar por este sitio, usted acepta el uso de cookies de conformidad con nuestra política.</p>
            <h2>¿Qué son las cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten que el sitio recuerde sus acciones y preferencias durante un período de tiempo.</p>
            <h2>Tipos de cookies que utilizamos</h2>
            <p><strong>Cookies técnicas:</strong> Son necesarias para el funcionamiento del sitio web.</p>
            <p><strong>Cookies analíticas:</strong> Nos permiten conocer cómo interactúan los usuarios con el sitio web para mejorar su funcionamiento.</p>
            <h2>Cómo gestionar las cookies</h2>
            <p>Puede configurar su navegador para rechazar todas las cookies o para que le avise cuando se envía una cookie. Sin embargo, si rechaza las cookies, es posible que algunas funcionalidades del sitio no estén disponibles.</p>
          </div>
        </div>
      </main>
      <Footer locale="es" />
    </>
  );
}
