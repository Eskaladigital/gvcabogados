import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabaseAdmin } from '@/lib/supabase';
import { getActiveServices, getFolderSlug } from '@/data/services';
import { Home, Scale, Globe, BookOpen, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sitemap | GVC Abogados',
  description: 'Navigate through all pages and legal services of García-Valcárcel & Cáceres Abogados in Murcia.',
  robots: 'noindex, follow',
};

interface UrlGroup {
  title: string;
  icon: React.ReactNode;
  urls: { href: string; label: string }[];
}

export default async function SitemapPage() {
  const locale = 'en';
  const activeServices = getActiveServices();
  const activeIds = new Set(activeServices.map(s => s.id));

  const { data: servicePages } = await supabaseAdmin
    .from('service_content')
    .select('slug_es, slug_en, services!inner(service_key, name_es, name_en), localities!inner(slug, name)')
    .order('slug_es');

  const { data: blogPosts } = await supabaseAdmin
    .from('blog_posts')
    .select('slug_es, slug_en, title_es, title_en')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  // --- EN ---
  const staticPagesEn = [
    { href: '/en', label: 'Home' },
    { href: '/en/about', label: 'About Us' },
    { href: '/en/services', label: 'Practice Areas' },
    { href: '/en/team', label: 'Team' },
    { href: '/en/blog', label: 'Blog' },
    { href: '/en/contact', label: 'Contact' },
    { href: '/en/sitemap', label: 'Sitemap' },
  ];

  const genericServicesEn = activeServices.map((s) => ({
    href: `/en/services/${s.genericSlugEn}`,
    label: s.nameEn,
  }));

  const localPagesEn = (servicePages || [])
    .filter((sc: any) => sc.slug_en && activeIds.has(sc.services.service_key))
    .map((sc: any) => {
      const svc = activeServices.find(s => s.id === sc.services.service_key);
      return {
        href: `/en/services/${svc?.genericSlugEn || sc.services.service_key}/${sc.localities.slug}`,
        label: `${sc.services.name_en} — ${sc.localities.name}`,
      };
    });

  const blogPagesEn = (blogPosts || [])
    .filter((post: any) => post.slug_en)
    .map((post: any) => ({
      href: `/en/blog/${post.slug_en}`,
      label: post.title_en || post.slug_en,
    }));

  // --- ES ---
  const staticPagesEs = [
    { href: '/es', label: 'Inicio' },
    { href: '/es/sobre-nosotros', label: 'Sobre Nosotros' },
    { href: '/es/servicios', label: 'Áreas de Práctica' },
    { href: '/es/equipo', label: 'Equipo' },
    { href: '/es/blog', label: 'Blog' },
    { href: '/es/contacto', label: 'Contacto' },
    { href: '/es/politica-cookies', label: 'Política de Cookies' },
    { href: '/es/politica-privacidad', label: 'Política de Privacidad' },
    { href: '/es/aviso-legal', label: 'Aviso Legal' },
    { href: '/es/sitemap', label: 'Sitemap' },
  ];

  const genericServicesEs = activeServices.map((s) => ({
    href: `/es/servicios/${getFolderSlug(s.id)}`,
    label: s.nameEs,
  }));

  const localPagesEs = (servicePages || [])
    .filter((sc: any) => activeIds.has(sc.services.service_key))
    .map((sc: any) => ({
      href: `/es/servicios/${getFolderSlug(sc.services.service_key)}/${sc.localities.slug}`,
      label: `${sc.services.name_es} — ${sc.localities.name}`,
    }));

  const blogPagesEs = (blogPosts || []).map((post: any) => ({
    href: `/es/blog/${post.slug_es}`,
    label: post.title_es || post.slug_es,
  }));

  const groupsEn: UrlGroup[] = [
    { title: 'Main Pages', icon: <Home size={20} className="text-white" />, urls: staticPagesEn },
    { title: 'Services (Generic)', icon: <Scale size={20} className="text-white" />, urls: genericServicesEn },
    { title: `Services by City (${localPagesEn.length})`, icon: <Scale size={20} className="text-white" />, urls: localPagesEn },
    { title: `Blog (${blogPagesEn.length})`, icon: <BookOpen size={20} className="text-white" />, urls: blogPagesEn },
  ];

  const groupsEs: UrlGroup[] = [
    { title: 'Main Pages (ES)', icon: <Globe size={20} className="text-white" />, urls: staticPagesEs },
    { title: 'Services — Generic (ES)', icon: <Scale size={20} className="text-white" />, urls: genericServicesEs },
    { title: `Services by City (ES) (${localPagesEs.length})`, icon: <Scale size={20} className="text-white" />, urls: localPagesEs },
    { title: `Blog (ES) (${blogPagesEs.length})`, icon: <BookOpen size={20} className="text-white" />, urls: blogPagesEs },
  ];

  const totalUrls = [...groupsEn, ...groupsEs].reduce((sum, g) => sum + g.urls.length, 0);

  return (
    <>
      <Navbar locale={locale} />
      <main className="min-h-screen bg-neutral-50">
        <section className="bg-brand-dark py-16 md:py-20">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Sitemap
              </h1>
              <p className="text-base text-neutral-300 leading-relaxed">
                All pages and legal services at García-Valcárcel &amp; Cáceres Abogados — <strong className="text-white">{totalUrls} URLs</strong> in total.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container-custom max-w-6xl">
            {/* English */}
            <h2 className="font-display text-2xl font-bold text-brand-dark mb-6 flex items-center gap-2">
              <Globe size={24} className="text-brand-brown" />
              English (/en/)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {groupsEn.map((group) => (
                <UrlGroupCard key={group.title} group={group} />
              ))}
            </div>

            {/* Español */}
            <h2 className="font-display text-2xl font-bold text-brand-dark mb-6 flex items-center gap-2">
              <FileText size={24} className="text-brand-brown" />
              Español (/es/)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {groupsEs.map((group) => (
                <UrlGroupCard key={group.title} group={group} />
              ))}
            </div>

            <div className="mt-8 bg-brand-brown/10 border border-brand-brown/20 p-6 rounded-xl text-center">
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
    </>
  );
}

function UrlGroupCard({ group }: { group: UrlGroup }) {
  if (group.urls.length === 0) return null;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
      <h3 className="font-serif text-xl font-bold text-brand-dark mb-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-brown rounded-lg flex items-center justify-center shrink-0">
          {group.icon}
        </div>
        {group.title}
      </h3>
      <div className="max-h-[500px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-neutral-100 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-brand-brown [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-brand-brown-hover">
        <ul className="space-y-1.5">
          {group.urls.map((u) => (
            <li key={u.href}>
              <Link
                href={u.href}
                className="block text-sm text-brand-dark hover:text-brand-brown transition-colors hover:underline py-0.5"
              >
                {u.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 pt-3 border-t border-neutral-200">
        <p className="text-xs text-neutral-500">
          {group.urls.length} {group.urls.length === 1 ? 'page' : 'pages'}
        </p>
      </div>
    </div>
  );
}
