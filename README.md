# GVC Abogados — Web Corporativa

> **García-Valcárcel & Cáceres Abogados** · Bufete de Abogados en Murcia desde 1946
> Web corporativa multipágina, bilingüe (ES/EN), con blog administrable, SEO geolocalizado y modelo Hub & Spoke.

---

## Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Instalación y Desarrollo Local](#instalación-y-desarrollo-local)
5. [Variables de Entorno](#variables-de-entorno)
6. [Base de Datos (Supabase)](#base-de-datos-supabase)
7. [Arquitectura de Páginas y Servicios](#arquitectura-de-páginas-y-servicios)
8. [Sistema Bilingüe — Regla de Paridad ES/EN](#sistema-bilingüe--regla-de-paridad-esen)
9. [Hub & Spoke: Modelo SEO de Servicios](#hub--spoke-modelo-seo-de-servicios)
10. [Scripts de Generación de Contenido](#scripts-de-generación-de-contenido)
11. [Panel de Administración](#panel-de-administración)
12. [Blog con TinyMCE](#blog-con-tinymce)
13. [SEO y Metadatos](#seo-y-metadatos)
14. [Despliegue en Vercel](#despliegue-en-vercel)
15. [Personalización y Ampliación](#personalización-y-ampliación)

---

## Descripción del Proyecto

Web corporativa para el despacho de abogados **García-Valcárcel & Cáceres**, ubicado en Gran Vía, 15 — 3ª Planta, 30008 Murcia.

**Objetivo principal:** Potenciar los 6 servicios activos del despacho mediante un modelo Hub & Spoke (página genérica + páginas locales por ciudad), posicionando en SEO tanto a nivel nacional como local.

**Servicios activos (6):**

| Servicio | Carpeta ES | Carpeta EN | service_key |
|---|---|---|---|
| Accidentes de Tráfico | `accidentes-trafico` | `traffic-accidents` | `accidentes-trafico` |
| Derecho de Familia | `derecho-familia` | `family-law` | `derecho-familia` |
| Negligencias Médicas | `negligencias-medicas` | `medical-malpractice` | `negligencias-medicas` |
| Permisos de Residencia | `permisos-residencia` | `immigration` | `extranjeria` |
| Responsabilidad Administración | `responsabilidad-administracion` | `administrative-law` | `derecho-administrativo` |
| Responsabilidad Civil | `responsabilidad-civil` | `civil-liability` | `responsabilidad-civil` |

**Nota:** Los otros 8 servicios originales fueron descartados y eliminados de la base de datos.

### Características principales

- **6 servicios activos** con carpetas físicas independientes (no rutas dinámicas [slug])
- **Bilingüe ES/EN** con paridad total: cada página ES tiene su equivalente EN idéntica
- **Modelo Hub & Spoke SEO**: página genérica + páginas locales dinámicas por ciudad
- **Diseño premium** para accidentes-trafico y derecho-familia (secciones únicas hardcodeadas)
- **Contenido dinámico** desde Supabase con columnas JSONB `custom_sections_es/en`
- **Blog administrable** con panel en `/administrator` y editor TinyMCE
- **hreflang bidireccional** ES<->EN en todas las páginas
- **Redirects 301** para URLs antiguas (tanto ES como EN)
- **Sitemap dinámico** generado automáticamente
- **6 scripts de generación** de contenido por servicio (OpenAI + SERP API)

---

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 14** | Framework React con App Router, SSR/SSG |
| **TypeScript** | Tipado estático |
| **Tailwind CSS 3** | Estilos utility-first |
| **Supabase** | Base de datos PostgreSQL (services, service_content, localities, local_entities) |
| **TinyMCE** | Editor WYSIWYG para el blog |
| **OpenAI API** | Generación de contenido localizado por servicio |
| **SERP API** | Investigación de datos locales (juzgados, hospitales, etc.) |
| **Lucide React** | Iconos |
| **Vercel** | Hosting y despliegue |

---

## Estructura del Proyecto

```
gvcabogados-web/
├── public/images/
├── scripts/
│   ├── lib/generate-utils.ts          # Utilidades compartidas para generación
│   ├── generate-accidentes-trafico.ts # Script generación accidentes
│   ├── generate-derecho-familia.ts    # Script generación familia
│   ├── generate-negligencias-medicas.ts
│   ├── generate-permisos-residencia.ts
│   ├── generate-responsabilidad-administracion.ts
│   └── generate-responsabilidad-civil.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── sitemap.ts                 # Sitemap dinámico (ES + EN)
│   │   ├── robots.ts
│   │   ├── api/
│   │   ├── administrator/
│   │   ├── es/
│   │   │   ├── page.tsx               # Inicio ES
│   │   │   ├── sobre-nosotros/
│   │   │   ├── servicios/
│   │   │   │   ├── page.tsx           # Listado (6 servicios)
│   │   │   │   ├── accidentes-trafico/
│   │   │   │   │   ├── page.tsx       # Genérica (diseño premium)
│   │   │   │   │   └── [ciudad]/page.tsx  # Local dinámica
│   │   │   │   ├── derecho-familia/
│   │   │   │   │   ├── page.tsx       # Genérica (diseño premium)
│   │   │   │   │   └── [ciudad]/page.tsx
│   │   │   │   ├── negligencias-medicas/
│   │   │   │   │   ├── page.tsx       # Genérica (estándar)
│   │   │   │   │   └── [ciudad]/page.tsx
│   │   │   │   ├── permisos-residencia/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [ciudad]/page.tsx
│   │   │   │   ├── responsabilidad-administracion/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [ciudad]/page.tsx
│   │   │   │   └── responsabilidad-civil/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [ciudad]/page.tsx
│   │   │   ├── equipo/
│   │   │   ├── blog/
│   │   │   ├── contacto/
│   │   │   └── (páginas legales)
│   │   └── en/                        # ESPEJO EXACTO de /es/
│   │       ├── page.tsx               # Home EN
│   │       ├── about/
│   │       ├── services/
│   │       │   ├── page.tsx           # Listado (6 servicios)
│   │       │   ├── traffic-accidents/
│   │       │   │   ├── page.tsx       # Genérica (diseño premium)
│   │       │   │   └── [city]/page.tsx
│   │       │   ├── family-law/
│   │       │   │   ├── page.tsx       # Genérica (diseño premium)
│   │       │   │   └── [city]/page.tsx
│   │       │   ├── medical-malpractice/
│   │       │   │   ├── page.tsx
│   │       │   │   └── [city]/page.tsx
│   │       │   ├── immigration/
│   │       │   │   ├── page.tsx
│   │       │   │   └── [city]/page.tsx
│   │       │   ├── administrative-law/
│   │       │   │   ├── page.tsx
│   │       │   │   └── [city]/page.tsx
│   │       │   └── civil-liability/
│   │       │       ├── page.tsx
│   │       │       └── [city]/page.tsx
│   │       ├── team/
│   │       ├── blog/
│   │       └── contact/
│   ├── components/
│   │   ├── content/
│   │   │   ├── CityServicePage.tsx    # Componente compartido local (bilingüe)
│   │   │   └── RichTextContent.tsx
│   │   ├── layout/
│   │   ├── home/
│   │   ├── seo/
│   │   └── ui/
│   ├── data/
│   │   ├── services.ts                # 6 servicios activos + mapeos de slugs ES/EN
│   │   ├── translations.ts
│   │   ├── team.ts
│   │   └── landings.ts
│   └── lib/
│       ├── supabase.ts
│       ├── service-content.ts         # Funciones fetch Supabase (con custom_sections)
│       └── site-config.ts
├── next.config.js                     # Redirects 301 ES + EN
├── README.md
├── GUIA-CONTENIDO-MULTILOCAL.md
└── package.json
```

---

## Instalación y Desarrollo Local

### Requisitos previos
- **Node.js** 18+
- **npm**
- Cuenta en **Supabase**
- API Key de **TinyMCE** (tiny.cloud)
- API Key de **OpenAI** (para scripts de generación)
- API Key de **SERP API** (para scripts de generación)

### Pasos

```bash
cd gvcabogados-web
npm install
cp .env.example .env.local
# Editar .env.local con valores reales
npm run dev
```

---

## Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
SERP_API_KEY=...
NEXT_PUBLIC_TINYMCE_API_KEY=tu-key
NEXT_PUBLIC_SITE_URL=https://www.gvcabogados.com
CONTACT_EMAIL=contacto@gvcabogados.com
```

---

## Base de Datos (Supabase)

### Tablas principales

**services** — 6 servicios activos

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | PK |
| service_key | VARCHAR | Clave única (ej: `accidentes-trafico`) |
| name_es / name_en | VARCHAR | Nombre bilingüe |
| is_active | BOOLEAN | Solo 6 activos |

**service_content** — Contenido localizado por servicio y ciudad

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | PK |
| service_id | UUID | FK a services |
| locality_id | UUID | FK a localities |
| slug_es / slug_en | VARCHAR | URL slugs |
| title_es / title_en | VARCHAR | Títulos SEO |
| meta_description_es / _en | TEXT | Meta descriptions |
| long_description_es / _en | TEXT | Contenido largo |
| sections_es / _en | JSONB | Secciones [{title, content}] |
| process_es / _en | JSONB | Pasos del proceso |
| faqs_es / _en | JSONB | FAQs [{question, answer}] |
| **custom_sections_es / _en** | **JSONB** | **Secciones específicas por servicio** |

**localities** — Ciudades (Murcia, Alicante, Madrid, etc.)

**local_entities** — Entidades locales (juzgados, hospitales, etc.)

### custom_sections_es/en

Columnas JSONB libres que permiten contenido específico por servicio:

- **Accidentes de tráfico**: `stats`, `tipos_accidente`, `que_hacer`, `intro`
- **Derecho de familia**: `stats`, `areas`, `que_saber`, `intro`
- **Otros servicios**: Extensible según necesidad

---

## Arquitectura de Páginas y Servicios

### Rutas ES (`/es/servicios/`)

| Ruta | Tipo | Diseño |
|---|---|---|
| `/es/servicios` | Listado | 6 servicios |
| `/es/servicios/accidentes-trafico` | Genérica | Premium (hardcoded) |
| `/es/servicios/accidentes-trafico/murcia` | Local | Premium dinámico |
| `/es/servicios/derecho-familia` | Genérica | Premium (hardcoded) |
| `/es/servicios/derecho-familia/murcia` | Local | Premium dinámico |
| `/es/servicios/negligencias-medicas` | Genérica | Estándar |
| `/es/servicios/negligencias-medicas/murcia` | Local | CityServicePage |
| (ídem para permisos-residencia, responsabilidad-administracion, responsabilidad-civil) |

### Rutas EN (`/en/services/`) — ESPEJO EXACTO

| Ruta | Tipo | Diseño |
|---|---|---|
| `/en/services` | Listing | 6 services |
| `/en/services/traffic-accidents` | Generic | Premium (hardcoded) |
| `/en/services/traffic-accidents/murcia` | Local | Premium dynamic |
| `/en/services/family-law` | Generic | Premium (hardcoded) |
| `/en/services/family-law/murcia` | Local | Premium dynamic |
| `/en/services/medical-malpractice` | Generic | Standard |
| `/en/services/medical-malpractice/murcia` | Local | CityServicePage (locale='en') |
| (same for immigration, administrative-law, civil-liability) |

### Correspondencia de carpetas ES <-> EN

| Carpeta ES | Carpeta EN | service_key |
|---|---|---|
| `accidentes-trafico/` | `traffic-accidents/` | `accidentes-trafico` |
| `derecho-familia/` | `family-law/` | `derecho-familia` |
| `negligencias-medicas/` | `medical-malpractice/` | `negligencias-medicas` |
| `permisos-residencia/` | `immigration/` | `extranjeria` |
| `responsabilidad-administracion/` | `administrative-law/` | `derecho-administrativo` |
| `responsabilidad-civil/` | `civil-liability/` | `responsabilidad-civil` |

---

## Sistema Bilingüe — Regla de Paridad ES/EN

### REGLA FUNDAMENTAL

> **Toda modificación en una página ES debe replicarse en su equivalente EN, y viceversa.**
> Las páginas en `/es/` y `/en/` deben ser SIEMPRE un espejo exacto (mismo diseño, mismas secciones, texto traducido).

### Cómo funciona

1. **Carpetas físicas**: 6 carpetas en ES + 6 carpetas en EN con la misma estructura interna
2. **Slugs mapeados**: `FOLDER_SLUG_MAP` (ES) y `FOLDER_SLUG_MAP_EN` en `src/data/services.ts`
3. **hreflang bidireccional**: Cada página tiene `alternates.languages` apuntando a su par
4. **Navbar**: `getServicesByLocale(locale)` devuelve slugs correctos según el idioma
5. **CityServicePage**: Componente compartido que acepta `locale='es'|'en'` para páginas locales estándar
6. **Contenido Supabase**: Misma fila, columnas `_es` para español y `_en` para inglés
7. **alternateUrl**: La Navbar muestra el botón de cambio de idioma apuntando a la página equivalente

### Checklist al modificar una página de servicio

- [ ] Hacer el cambio en la página ES
- [ ] Replicar el mismo cambio (traducido) en la página EN equivalente
- [ ] Verificar que el hreflang sigue apuntando correctamente
- [ ] Si se añade una sección nueva, añadirla en ambos idiomas
- [ ] Si se modifica el CityServicePage, verificar que funciona con ambos locales

### Texto obligatorio

- ES: "Primera consulta sin compromiso" (NUNCA "Consulta gratuita")
- EN: "No-obligation initial consultation" (NUNCA "Free consultation")

---

## Hub & Spoke: Modelo SEO de Servicios

### Estructura

```
Página genérica (Hub)          Páginas locales (Spokes)
/es/servicios/accidentes-trafico
    ├── /murcia
    ├── /alicante
    ├── /madrid
    └── /valencia

/en/services/traffic-accidents
    ├── /murcia
    ├── /alicante
    ├── /madrid
    └── /valencia
```

### Flujo de datos (página local)

1. Next.js genera rutas estáticas con `generateStaticParams()` consultando Supabase
2. Cada página local llama a `getServiceContentByServiceAndCity(serviceKey, citySlug)`
3. El contenido se lee de `service_content` (columnas `_es` o `_en` según idioma)
4. Las secciones custom se leen de `custom_sections_es` o `custom_sections_en`
5. Si no hay contenido custom, se usan fallbacks estáticos definidos en cada página

### Tipos de páginas

- **Premium** (accidentes-trafico, derecho-familia): Secciones únicas hardcodeadas + contenido dinámico de Supabase para locales
- **Estándar** (los otros 4): Usan datos de `services.ts` para genéricas + `CityServicePage` para locales

---

## Scripts de Generación de Contenido

6 scripts independientes en `scripts/`, uno por servicio:

```bash
npm run generate:accidentes    # scripts/generate-accidentes-trafico.ts
npm run generate:familia       # scripts/generate-derecho-familia.ts
npm run generate:negligencias  # scripts/generate-negligencias-medicas.ts
npm run generate:extranjeria   # scripts/generate-permisos-residencia.ts
npm run generate:admin         # scripts/generate-responsabilidad-administracion.ts
npm run generate:civil         # scripts/generate-responsabilidad-civil.ts
```

Cada script:
- Usa `scripts/lib/generate-utils.ts` (Supabase, OpenAI, SERP API, validación)
- Genera `custom_sections_es` específicas para su servicio
- Valida la estructura del JSON generado
- Upsert en `service_content`

---

## Panel de Administración

URL: `/administrator/login`

- Login con Supabase Auth
- CRUD de artículos del blog (bilingüe, TinyMCE)
- Protegido con cookies HTTP-only y RLS

---

## Blog con TinyMCE

- Editor WYSIWYG con formato, listas, enlaces, imágenes
- Contenido bilingüe (_es / _en) en la misma entrada
- Publicación inmediata o borrador

---

## SEO y Metadatos

- **Meta title/description** únicos por página y idioma
- **Canonical URLs** en todas las páginas
- **hreflang** bidireccional ES<->EN
- **Sitemap.xml** dinámico (genéricas ES/EN + locales ES/EN + blog)
- **Robots.txt** con exclusión de admin y API
- **Schema.org**: BreadcrumbSchema, ServiceSchema, FAQSchema
- **Redirects 301** en `next.config.js` para URLs antiguas ES y EN

### Redirects configurados

**ES**: URLs antiguas `/es/servicios/abogados-X-ciudad` y `/es/abogados/abogados-X-ciudad` redirigen a `/es/servicios/{carpeta}/{ciudad}`

**EN**: URLs antiguas `/en/services/X-lawyers-murcia` y `/en/lawyers/X-lawyers-ciudad` redirigen a `/en/services/{carpeta}/{ciudad}`. Servicios inactivos redirigen a `/en/services`.

---

## Despliegue en Vercel

1. Push a GitHub (`main` branch)
2. Vercel detecta Next.js y despliega automáticamente
3. Variables de entorno configuradas en Vercel dashboard
4. Dominio: `www.gvcabogados.com`

---

## Personalización y Ampliación

### Colores (tailwind.config.js)

```javascript
brand: {
  dark: '#3D2B14',
  brown: '#A07D4A',
  gold: '#8B7D3C',
}
```

### Tipografías

- **Inter** — Texto general
- **Cormorant Garamond** — Títulos de sección
- **Playfair Display** — Hero y headlines

---

## Datos del Despacho

- **Nombre**: García-Valcárcel & Cáceres Abogados
- **Dirección**: Gran Vía, 15 — 3ª Planta, 30008 Murcia
- **Teléfono**: 968 241 025
- **Email**: contacto@gvcabogados.com
- **Fundación**: 1946
- **Web**: https://www.gvcabogados.com

---

2026 García-Valcárcel & Cáceres Abogados.
