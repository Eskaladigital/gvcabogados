import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { getAllServiceContentSlugs } from '@/lib/service-content';
import { Home, Users, Briefcase, FileText, Phone, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sitemap | GVC Abogados',
  description: 'Navigate through all pages and legal services of García-Valcárcel & Cáceres Abogados in Murcia.',
  robots: 'noindex, follow',
};

export default async function SitemapPage() {
  const locale = 'en';
  
  // Get all service slugs from Supabase (English slugs)
  const serviceSlugs = await getAllServiceContentSlugs();

  const mainPages = [
    { href: '/en', label: 'Home', icon: Home },
    { href: '/en/about', label: 'About Us', icon: Users },
    { href: '/en/services', label: 'Practice Areas', icon: Scale },
    { href: '/en/team', label: 'Team', icon: Users },
    { href: '/en/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <>
      <Navbar locale={locale} />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero */}
        <section className="bg-brand-dark py-16 md:py-20">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Sitemap
              </h1>
              <p className="text-base text-neutral-300 leading-relaxed">
                Explore all pages and legal services we offer at García-Valcárcel & Cáceres Abogados.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="container-custom max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Main pages */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
                <h2 className="font-serif text-2xl font-bold text-brand-dark mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-brown rounded-lg flex items-center justify-center">
                    <Home size={20} className="text-white" />
                  </div>
                  Main Pages
                </h2>
                <ul className="space-y-3">
                  {mainPages.map((page) => (
                    <li key={page.href}>
                      <Link
                        href={page.href}
                        className="flex items-center gap-3 text-brand-dark hover:text-brand-brown transition-colors group"
                      >
                        <page.icon size={16} className="text-brand-brown shrink-0" />
                        <span className="group-hover:underline">{page.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal services */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
                <h2 className="font-serif text-2xl font-bold text-brand-dark mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-brown rounded-lg flex items-center justify-center">
                    <Scale size={20} className="text-white" />
                  </div>
                  Legal Services
                </h2>
                <div className="max-h-[600px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-100 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-brand-brown [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-brand-brown-hover">
                  <ul className="space-y-2">
                    {serviceSlugs.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/en/services/${item.slug}`}
                          className="block text-sm text-brand-dark hover:text-brand-brown transition-colors hover:underline py-1"
                        >
                          {item.slug}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500">
                    Total service pages: <strong>{serviceSlugs.length}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer info */}
            <div className="mt-12 bg-brand-brown/10 border border-brand-brown/20 p-6 rounded-xl text-center">
              <p className="text-sm text-brand-dark">
                Need help finding something?{' '}
                <Link href="/en/contact" className="font-semibold text-brand-brown hover:underline">
                  Contact Us
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
    </>
  );
}
