import '@/styles/globals.css';
import type { Metadata } from 'next';
import { GoogleAnalytics } from '@/components/seo/GoogleAnalytics';
import BackToTopButton from '@/components/layout/WhatsAppButton';

export const metadata: Metadata = {
  title: 'García-Valcárcel & Cáceres — Bufete de Abogados en Murcia',
  description:
    'Despacho de abogados en Murcia con más de 75 años de experiencia. Especialistas en accidentes de tráfico, divorcios, derecho bancario, penal, inmobiliario y sucesorio.',
  icons: {
    icon: '/images/logo/gvcabogados_murcia_logo_favicon_marron_sinfondo.webp',
    shortcut: '/images/logo/gvcabogados_murcia_logo_favicon_marron_sinfondo.webp',
    apple: '/images/logo/gvcabogados_murcia_logo_favicon_marron_sinfondo.webp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body>
        <GoogleAnalytics />
        {children}
        <BackToTopButton />
      </body>
    </html>
  );
}
