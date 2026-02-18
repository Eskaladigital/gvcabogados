import '@/styles/globals.css';
import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import BackToTopButton from '@/components/layout/WhatsAppButton';

export const metadata: Metadata = {
  title: 'García-Valcárcel & Cáceres — Bufete de Abogados en Murcia',
  description:
    'Despacho de abogados en Murcia con más de 75 años de experiencia. Especialistas en responsabilidad civil: accidentes de tráfico, negligencias médicas, accidentes laborales y responsabilidad frente a la Administración.',
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
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        {children}
        <BackToTopButton />
      </body>
    </html>
  );
}
