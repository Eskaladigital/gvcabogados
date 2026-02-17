# GVC Abogados — Web Corporativa

> **García-Valcárcel & Cáceres Abogados** · Bufete de Abogados en Murcia desde 1946  
> Web corporativa multipágina, bilingüe (ES/EN), con blog administrable y SEO geolocalizado.

---

## 📋 Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Instalación y Desarrollo Local](#instalación-y-desarrollo-local)
5. [Variables de Entorno](#variables-de-entorno)
6. [Base de Datos (Supabase)](#base-de-datos-supabase)
7. [Arquitectura de Páginas](#arquitectura-de-páginas)
8. [Sistema Bilingüe](#sistema-bilingüe)
9. [Panel de Administración](#panel-de-administración)
10. [Blog con TinyMCE](#blog-con-tinymce)
11. [Landing Pages SEO](#landing-pages-seo)
12. [SEO y Metadatos](#seo-y-metadatos)
13. [Despliegue en Vercel](#despliegue-en-vercel)
14. [Personalización y Ampliación](#personalización-y-ampliación)

---

## Descripción del Proyecto

Web corporativa para el despacho de abogados **García-Valcárcel & Cáceres**, ubicado en Gran Vía, 15 — 3ª Planta, 30008 Murcia.

**Objetivo principal:** Potenciar los servicios del despacho (accidentes de tráfico, divorcios, derecho bancario, penal, inmobiliario, sucesorio, etc.) posicionando en Murcia como sede principal y creando landing pages geolocalizadas para captar clientes de otras ciudades.

**Nota:** Negligencias médicas tiene su propia web especializada con SEO dedicado. En esta web se referencia pero sin competir con ese proyecto.

### Características principales

- **Multipágina** con estructura completa: Inicio, Sobre Nosotros, Servicios (13 áreas), Equipo, Blog, Contacto
- **Bilingüe** ES/EN con rutas `/es/` y `/en/` independientes
- **Blog administrable** con panel en `/administrator` y editor TinyMCE (contenido bilingüe)
- **Landing pages SEO** geolocalizadas para ciudades clave (Alicante, Madrid, Toledo, Valencia, etc.)
- **Formulario de contacto** con selector de área legal
- **Diseño premium** inspirado en el HTML de referencia (colores marrones, tipografías serif, estética legal elegante)
- **Botón WhatsApp** flotante
- **Sitemap dinámico** y robots.txt generados automáticamente
- **Animaciones** de entrada con Intersection Observer

---

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 14** | Framework React con App Router, SSR/SSG |
| **TypeScript** | Tipado estático |
| **Tailwind CSS 3** | Estilos utility-first |
| **Supabase** | Base de datos PostgreSQL + Auth |
| **TinyMCE** | Editor WYSIWYG para el blog |
| **OpenAI API** | Disponible para futuras integraciones (generación de contenido) |
| **Framer Motion** | Animaciones (disponible, uso opcional) |
| **Lucide React** | Iconos |
| **Vercel** | Hosting y despliegue |

---

## Estructura del Proyecto

```
gvcabogados-web/
├── public/
│   └── images/
│       ├── icons/          # Iconos de servicios
│       ├── logo/           # Logos del despacho
│       └── team/           # Fotos del equipo
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Layout raíz
│   │   ├── sitemap.ts      # Sitemap dinámico
│   │   ├── robots.ts       # Robots.txt
│   │   ├── api/
│   │   │   ├── auth/       # Login/logout admin
│   │   │   ├── blog/       # CRUD blog posts
│   │   │   │   └── [id]/   # Operaciones por ID
│   │   │   └── contact/    # Formulario de contacto
│   │   ├── administrator/
│   │   │   ├── login/      # Página de login
│   │   │   └── blog/       # Gestión de artículos
│   │   │       ├── new/    # Crear artículo
│   │   │       └── [id]/   # Editar artículo
│   │   ├── es/
│   │   │   ├── page.tsx              # Inicio ES
│   │   │   ├── sobre-nosotros/      # La Firma
│   │   │   ├── servicios/           # Listado servicios
│   │   │   │   └── [slug]/          # Detalle servicio
│   │   │   ├── equipo/             # Equipo
│   │   │   ├── blog/               # Blog listado
│   │   │   │   └── [slug]/         # Artículo individual
│   │   │   ├── contacto/           # Contacto + mapa
│   │   │   ├── abogados/
│   │   │   │   └── [servicio-ciudad]/ # Landings SEO
│   │   │   ├── aviso-legal/
│   │   │   ├── politica-privacidad/
│   │   │   └── politica-cookies/
│   │   └── en/
│   │       ├── page.tsx              # Home EN
│   │       ├── about/
│   │       ├── services/
│   │       │   └── [slug]/
│   │       ├── team/
│   │       ├── blog/
│   │       │   └── [slug]/
│   │       ├── contact/
│   │       └── lawyers/
│   │           └── [service-city]/   # SEO Landings EN
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Barra de navegación sticky
│   │   │   ├── Footer.tsx            # Pie de página
│   │   │   └── WhatsAppButton.tsx    # Botón flotante WhatsApp
│   │   ├── home/
│   │   │   ├── Hero.tsx              # Sección hero principal
│   │   │   ├── AboutStrip.tsx        # Banda "sobre nosotros"
│   │   │   ├── ServicesSection.tsx   # Grid de servicios
│   │   │   ├── StatsSection.tsx      # Estadísticas (75+ años, 3000+ casos...)
│   │   │   ├── TeamSection.tsx       # Tarjetas del equipo
│   │   │   ├── TestimonialsSection.tsx # Testimonios
│   │   │   └── ContactSection.tsx    # Formulario de contacto
│   │   └── ui/
│   │       └── ScrollReveal.tsx      # Animaciones de entrada
│   ├── data/
│   │   ├── services.ts       # 13 servicios jurídicos con prioridad
│   │   ├── team.ts           # 5 miembros del equipo
│   │   ├── testimonials.ts   # Testimonios de clientes
│   │   ├── translations.ts   # Traducciones ES/EN completas
│   │   └── landings.ts       # Landing pages SEO por ciudad
│   ├── lib/
│   │   ├── supabase.ts        # Cliente Supabase (browser)
│   │   └── supabase-server.ts # Cliente Supabase (server/SSR)
│   └── styles/
│       └── globals.css         # Estilos globales + Tailwind
├── supabase/
│   └── schema.sql              # Schema SQL para Supabase
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
└── package.json
```

---

## Instalación y Desarrollo Local

### Requisitos previos
- **Node.js** 18+ 
- **npm** o **yarn**
- Cuenta en **Supabase** (gratuita)
- API Key de **TinyMCE** (gratuita en tiny.cloud)
- API Key de **OpenAI** (opcional)

### Pasos

```bash
# 1. Ir a la carpeta del proyecto
cd gvcabogados-web

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores reales

# 4. Configurar base de datos
# Ejecutar el contenido de supabase/schema.sql en el SQL Editor de Supabase

# 5. Crear usuario admin en Supabase
# Ir a Authentication > Users > Invite user
# Email: admin@gvcabogados.com (o el que prefieras)

# 6. Copiar imágenes del equipo
# Copiar las imágenes de ../images/ a public/images/team/ y public/images/logo/

# 7. Ejecutar en desarrollo
npm run dev
```

La web estará disponible en **http://localhost:3000** (redirige a /es automáticamente).

---

## Variables de Entorno

Archivo `.env.local` (nunca subir a Git):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI (opcional, para futuras integraciones)
OPENAI_API_KEY=sk-...

# TinyMCE (editor del blog)
NEXT_PUBLIC_TINYMCE_API_KEY=tu-key

# URL del sitio
NEXT_PUBLIC_SITE_URL=https://www.gvcabogados.com

# Email de contacto
CONTACT_EMAIL=contacto@gvcabogados.com
```

---

## Base de Datos (Supabase)

### Configuración inicial

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar el archivo `supabase/schema.sql`
3. Ir a **Authentication > Users** y crear un usuario admin

### Tablas

**blog_posts** — Artículos del blog (bilingüe)
| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Primary key |
| slug | TEXT | URL amigable (único) |
| title_es / title_en | TEXT | Título ES/EN |
| excerpt_es / excerpt_en | TEXT | Extracto ES/EN |
| content_es / content_en | TEXT | Contenido HTML ES/EN |
| category | TEXT | Categoría |
| cover_image | TEXT | URL imagen portada |
| author | TEXT | Nombre del autor |
| published | BOOLEAN | Estado publicación |
| published_at | TIMESTAMP | Fecha publicación |

**contact_submissions** — Consultas del formulario
| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Primary key |
| name, phone, email | TEXT | Datos contacto |
| area | TEXT | Área legal seleccionada |
| message | TEXT | Mensaje |
| locale | TEXT | Idioma (es/en) |

---

## Arquitectura de Páginas

### Rutas Español (`/es/`)

| Ruta | Página |
|---|---|
| `/es` | Inicio (Home) |
| `/es/sobre-nosotros` | La Firma |
| `/es/servicios` | Áreas de Práctica (listado) |
| `/es/servicios/[slug]` | Detalle de servicio |
| `/es/equipo` | Equipo de abogados |
| `/es/blog` | Blog jurídico |
| `/es/blog/[slug]` | Artículo individual |
| `/es/contacto` | Contacto + mapa |
| `/es/abogados/[servicio-ciudad]` | Landing SEO por ciudad |
| `/es/aviso-legal` | Aviso legal |
| `/es/politica-privacidad` | Política de privacidad |
| `/es/politica-cookies` | Política de cookies |

### Rutas English (`/en/`)

| Ruta | Página |
|---|---|
| `/en` | Home |
| `/en/about` | The Firm |
| `/en/services` | Practice Areas |
| `/en/services/[slug]` | Service detail |
| `/en/team` | Team |
| `/en/blog` | Legal Blog |
| `/en/blog/[slug]` | Blog post |
| `/en/contact` | Contact |
| `/en/lawyers/[service-city]` | SEO Landing |

### Rutas de Administración

| Ruta | Descripción |
|---|---|
| `/administrator/login` | Login admin |
| `/administrator/blog` | Gestión de artículos |
| `/administrator/blog/new` | Nuevo artículo |
| `/administrator/blog/[id]` | Editar artículo |

---

## Sistema Bilingüe

La web utiliza un sistema de carpetas para gestionar los dos idiomas:

- **`/es/`** — Español (idioma principal, SEO prioritario)
- **`/en/`** — English (idioma secundario)

### Cómo funciona

1. **Traducciones estáticas**: `src/data/translations.ts` contiene todas las cadenas de texto
2. **Servicios bilingües**: Cada servicio tiene `nameEs/nameEn`, `descriptionEs/descriptionEn`, etc.
3. **Equipo bilingüe**: Roles y biografías en ambos idiomas
4. **Blog bilingüe**: Cada artículo tiene campos `_es` y `_en`
5. **Selector de idioma**: En el navbar (topbar en desktop, inline en mobile)
6. **Metadatos hreflang**: Cada página tiene `alternates.languages` para SEO

### Añadir un nuevo idioma

1. Crear carpeta `src/app/[nuevo-idioma]/` con las páginas
2. Añadir traducciones a `translations.ts`
3. Añadir campos a los archivos de datos
4. Actualizar el navbar con el nuevo idioma

---

## Panel de Administración

### Acceso

URL: `/administrator/login`

### Funcionalidades

- **Login** con email/contraseña (Supabase Auth)
- **Listar** todos los artículos del blog (publicados y borradores)
- **Crear** nuevos artículos con editor TinyMCE (bilingüe)
- **Editar** artículos existentes
- **Publicar/Despublicar** artículos con un clic
- **Eliminar** artículos con confirmación

### Seguridad

- Autenticación vía cookies HTTP-only
- API routes protegidas con token de sesión
- Row Level Security en Supabase
- Panel no indexado por robots.txt

---

## Blog con TinyMCE

### Editor

El blog utiliza **TinyMCE** como editor WYSIWYG con las siguientes funcionalidades:
- Formato de texto (negrita, cursiva, subrayado)
- Encabezados (H2, H3...)
- Listas ordenadas y desordenadas
- Inserción de enlaces e imágenes
- Vista de código HTML
- Tabla de contenidos

### Configuración

1. Registrar cuenta gratuita en [tiny.cloud](https://www.tiny.cloud)
2. Obtener API Key
3. Añadir al `.env.local` como `NEXT_PUBLIC_TINYMCE_API_KEY`

### Flujo de publicación

1. Admin accede a `/administrator/blog/new`
2. Rellena título, extracto y contenido en ES y EN (pestañas)
3. Configura slug, categoría, autor, fecha e imagen
4. Marca "Publicar inmediatamente" o guarda como borrador
5. El artículo aparece automáticamente en `/es/blog` y `/en/blog`

---

## Landing Pages SEO

### Estrategia

Las landing pages permiten posicionar para búsquedas geolocalizadas tipo:
- "abogados accidentes de tráfico Alicante"
- "abogados divorcios Madrid"  
- "abogados derecho inmobiliario Toledo"

### Landing pages actuales

| Servicio | Ciudad | URL ES |
|---|---|---|
| Accidentes de Tráfico | Alicante | `/es/abogados/accidentes-trafico-alicante` |
| Accidentes de Tráfico | Cartagena | `/es/abogados/accidentes-trafico-cartagena` |
| Divorcios | Madrid | `/es/abogados/divorcios-madrid` |
| Divorcios | Alicante | `/es/abogados/divorcios-alicante` |
| Derecho Inmobiliario | Toledo | `/es/abogados/inmobiliario-toledo` |
| Derecho Bancario | Valencia | `/es/abogados/derecho-bancario-valencia` |
| Derecho Penal | Albacete | `/es/abogados/derecho-penal-albacete` |
| Herencias | Almería | `/es/abogados/herencias-almeria` |

### Añadir nuevas landing pages

Editar `src/data/landings.ts` y añadir un nuevo objeto al array `landingPages`:

```typescript
{
  serviceId: 'derecho-familia',  // ID del servicio en services.ts
  city: 'Granada',
  slugEs: 'divorcios-granada',
  slugEn: 'divorce-lawyers-granada',
  titleEs: 'Abogados Divorcios en Granada | GVC Abogados',
  titleEn: 'Divorce Lawyers in Granada | GVC Lawyers',
  metaDescriptionEs: '...',
  metaDescriptionEn: '...',
  h1Es: 'Abogados de Divorcios en Granada',
  h1En: 'Divorce Lawyers in Granada',
  introEs: '...',
  introEn: '...',
}
```

No hace falta tocar nada más. Next.js genera la página automáticamente via `generateStaticParams`.

---

## SEO y Metadatos

### Implementado

- **Meta title y description** únicos por página
- **Canonical URLs** en todas las páginas
- **Hreflang** alternates (ES↔EN)
- **Sitemap.xml** dinámico con todas las rutas
- **Robots.txt** con exclusión de admin y API
- **Open Graph** básico vía Next.js Metadata API
- **Schema.org** preparado para añadir (LegalService, LocalBusiness)

### Prioridades SEO

Los servicios tienen campo `priority` (1-5):
- **Priority 1**: Accidentes de tráfico, Derecho de familia → máximo peso SEO
- **Priority 2**: Derecho bancario, Penal, Inmobiliario → peso alto
- **Priority 3**: Sucesorio, Mercantil, Responsabilidad civil, Extranjería → peso medio
- **Priority 4**: Obligaciones, Mediación, Administrativo → peso normal
- **Priority 5**: Negligencias médicas → peso bajo (tiene web propia)

---

## Despliegue en Vercel

### Pasos

1. **Subir a GitHub**
   ```bash
   cd gvcabogados-web
   git init
   git add .
   git commit -m "Initial commit - GVC Abogados web"
   git remote add origin https://github.com/tu-usuario/gvcabogados-web.git
   git push -u origin main
   ```

2. **Conectar con Vercel**
   - Ir a [vercel.com](https://vercel.com) > New Project
   - Importar repositorio de GitHub
   - Framework: Next.js (autodetectado)

3. **Configurar variables de entorno** en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_TINYMCE_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `CONTACT_EMAIL`

4. **Deploy** — Vercel construye y despliega automáticamente

5. **Dominio personalizado**
   - En Vercel > Settings > Domains > Add `www.gvcabogados.com`
   - Configurar DNS del dominio apuntando a Vercel

---

## Personalización y Ampliación

### Colores (tailwind.config.js)

```javascript
brand: {
  dark: '#3D2B14',      // Marrón oscuro principal
  brown: '#A07D4A',     // Marrón dorado (CTAs, acentos)
  gold: '#8B7D3C',      // Dorado (highlights)
}
```

### Tipografías

- **Inter** → Texto general (sans-serif)
- **Cormorant Garamond** → Títulos de sección (serif)
- **Playfair Display** → Hero y headlines (display serif)

### Imágenes del equipo

Colocar las fotos en `public/images/team/`:
- `pedro.png` → Pedro A. García-Valcárcel
- `raquel.png` → Raquel García-Valcárcel
- `miguel.png` → Miguel Cáceres
- `olga.png` → Olga Martínez
- `carmen.png` → Carmen Martínez

### Futuras integraciones

- **OpenAI**: Generar borradores de artículos del blog, resúmenes de servicios
- **Resend/SendGrid**: Envío de emails desde el formulario de contacto
- **Google Analytics 4**: Seguimiento de conversiones
- **Google Search Console**: Monitorización SEO
- **Schema.org**: Datos estructurados (LegalService, LocalBusiness, FAQPage)

---

## Datos del Despacho

- **Nombre**: García-Valcárcel & Cáceres Abogados
- **Dirección**: Gran Vía, 15 — 3ª Planta, 30008 Murcia
- **Teléfono**: 968 241 025
- **Email**: contacto@gvcabogados.com
- **Horario**: Lun–Vie: 9:00–14:00 / 17:00–20:00
- **Fundación**: 1946
- **Web actual**: https://www.gvcabogados.com

---

© 2026 García-Valcárcel & Cáceres Abogados. Proyecto desarrollado para reemplazar la web corporativa existente.
