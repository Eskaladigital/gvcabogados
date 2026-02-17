import { Locale } from '@/data/translations';

// ═══════════════════════════════════════════════════════
// SCHEMA.ORG JSON-LD — GVC Abogados
// ═══════════════════════════════════════════════════════

interface SchemaProps {
  locale: Locale;
}

export function LocalBusinessSchema({ locale }: SchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LegalService', 'LocalBusiness'],
    '@id': 'https://www.gvcabogados.com/#organization',
    name: 'García-Valcárcel & Cáceres Abogados',
    alternateName: 'GVC Abogados',
    url: 'https://www.gvcabogados.com',
    logo: 'https://www.gvcabogados.com/images/logo/gvc-logo.png',
    image: 'https://www.gvcabogados.com/images/hero-bg.png',
    description: locale === 'es'
      ? 'Bufete de abogados en Murcia fundado en 1946. Más de 75 años de experiencia en derecho privado y público. Especialistas en accidentes de tráfico, divorcios, derecho bancario, penal, inmobiliario y sucesorio.'
      : 'Law firm in Murcia, Spain founded in 1946. Over 75 years of experience in private and public law.',
    foundingDate: '1946-11-06',
    telephone: '+34968241025',
    email: 'contacto@gvcabogados.com',
    address: { '@type': 'PostalAddress', streetAddress: 'Gran Vía, 15 — 3ª Planta', addressLocality: 'Murcia', postalCode: '30008', addressRegion: 'Región de Murcia', addressCountry: 'ES' },
    geo: { '@type': 'GeoCoordinates', latitude: 37.9834, longitude: -1.1299 },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '14:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '17:00', closes: '20:00' },
    ],
    priceRange: '€€',
    areaServed: [
      { '@type': 'City', name: 'Murcia' },
      { '@type': 'AdministrativeArea', name: 'Región de Murcia' },
      { '@type': 'City', name: 'Alicante' },
      { '@type': 'City', name: 'Cartagena' },
    ],
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 5 },
    knowsLanguage: ['es', 'en'],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '47', bestRating: '5' },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

interface BreadcrumbItem { name: string; href: string }

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem', position: i + 1, name: item.name,
      item: `https://www.gvcabogados.com${item.href}`,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function ServiceSchema({ name, description, slug, locale }: { name: string; description: string; slug: string; locale: Locale }) {
  const schema = {
    '@context': 'https://schema.org', '@type': 'LegalService', name, description,
    url: `https://www.gvcabogados.com/${locale === 'es' ? 'es/servicios' : 'en/services'}/${slug}`,
    provider: { '@type': 'LegalService', '@id': 'https://www.gvcabogados.com/#organization', name: 'García-Valcárcel & Cáceres Abogados' },
    areaServed: { '@type': 'City', name: 'Murcia' }, serviceType: name,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function ArticleSchema({ title, description, slug, author, publishedAt, image, locale }: { title: string; description: string; slug: string; author: string; publishedAt: string; image?: string; locale: Locale }) {
  const schema = {
    '@context': 'https://schema.org', '@type': 'Article', headline: title, description,
    url: `https://www.gvcabogados.com/${locale}/blog/${slug}`, datePublished: publishedAt,
    author: { '@type': 'Person', name: author || 'García-Valcárcel & Cáceres' },
    publisher: { '@type': 'Organization', '@id': 'https://www.gvcabogados.com/#organization', name: 'García-Valcárcel & Cáceres Abogados' },
    ...(image && { image }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
