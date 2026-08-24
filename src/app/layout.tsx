import '@/styles/globals.css';
import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import BackToTopButton from '@/components/layout/WhatsAppButton';
import { CookieConsentBar } from '@/components/CookieConsentBar';

export const metadata: Metadata = {
  title: 'García-Valcárcel & Cáceres — Bufete de Abogados en Murcia',
  description:
    'Despacho de abogados en Murcia con más de 55 años de experiencia. Especialistas en responsabilidad civil: accidentes de tráfico, negligencias médicas, accidentes laborales y responsabilidad frente a la Administración.',
  icons: {
    icon: '/images/logo/gvcabogados_murcia_logo_favicon_marron_sinfondo.webp',
    shortcut: '/images/logo/gvcabogados_murcia_logo_favicon_marron_sinfondo.webp',
    apple: '/images/logo/gvcabogados_murcia_logo_favicon_marron_sinfondo.webp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <Script
          id="gtag-consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              var granted = false;
              try { granted = localStorage.getItem('gvcabogados_cookie_consent') === 'granted'; } catch (e) {}
              var v = granted ? 'granted' : 'denied';
              gtag('consent', 'default', {
                analytics_storage: v,
                ad_storage: v,
                ad_user_data: v,
                ad_personalization: v,
                wait_for_update: 500
              });
            `,
          }}
        />
      </head>
      <body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        {children}
        <CookieConsentBar />
        <BackToTopButton />
      </body>
    </html>
  );
}
