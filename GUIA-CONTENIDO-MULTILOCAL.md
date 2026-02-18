# Guía de Contenido Multilocal — Hub & Spoke

## Resumen

Sistema de contenido geolocalizado para los **6 servicios activos** del despacho, con páginas genéricas (Hub) y locales (Spoke) en **español e inglés**.

**Estado actual:** Estructura completa ES + EN desplegada. 6 scripts de generación individuales creados.

---

## Servicios Activos (6)

| # | service_key | Carpeta ES | Carpeta EN | Diseño |
|---|---|---|---|---|
| 1 | `accidentes-trafico` | `accidentes-trafico` | `traffic-accidents` | Premium |
| 2 | `derecho-familia` | `derecho-familia` | `family-law` | Premium |
| 3 | `negligencias-medicas` | `negligencias-medicas` | `medical-malpractice` | Estándar |
| 4 | `extranjeria` | `permisos-residencia` | `immigration` | Estándar |
| 5 | `derecho-administrativo` | `responsabilidad-administracion` | `administrative-law` | Estándar |
| 6 | `responsabilidad-civil` | `responsabilidad-civil` | `civil-liability` | Estándar |

Los otros 8 servicios originales fueron eliminados de Supabase (tablas `services` y `service_content`).

---

## Arquitectura Hub & Spoke

### Estructura de URLs

```
ES (Hub):     /es/servicios/{carpeta-es}/
ES (Spoke):   /es/servicios/{carpeta-es}/{ciudad}/

EN (Hub):     /en/services/{carpeta-en}/
EN (Spoke):   /en/services/{carpeta-en}/{city}/
```

### Ejemplo completo: Accidentes de Tráfico

```
/es/servicios/accidentes-trafico/              <- Hub ES (premium)
/es/servicios/accidentes-trafico/murcia        <- Spoke ES
/es/servicios/accidentes-trafico/alicante      <- Spoke ES
/es/servicios/accidentes-trafico/madrid        <- Spoke ES

/en/services/traffic-accidents/                <- Hub EN (premium)
/en/services/traffic-accidents/murcia          <- Spoke EN
/en/services/traffic-accidents/alicante        <- Spoke EN
/en/services/traffic-accidents/madrid          <- Spoke EN
```

---

## Base de Datos

### Tablas en Supabase

**services** — 6 registros activos

**service_content** — Una fila por combinación servicio + ciudad
- Columnas estándar: `title_es/en`, `meta_description_es/en`, `long_description_es/en`, `sections_es/en`, `process_es/en`, `faqs_es/en`
- Columnas custom: `custom_sections_es`, `custom_sections_en` (JSONB libre)

**localities** — Ciudades con `name`, `slug`, `province`

**local_entities** — Juzgados, hospitales, etc. referenciados por `locality_id`

### Estructura de custom_sections

Cada servicio define su propia estructura JSONB:

**Accidentes de tráfico:**
```json
{
  "stats": [{ "value": "75+", "label": "Años de experiencia" }],
  "tipos_accidente": [{ "titulo": "Colisiones", "descripcion": "...", "icon": "car" }],
  "que_hacer": [{ "paso": "1", "titulo": "Proteger la zona", "descripcion": "..." }],
  "intro": "Texto introductorio personalizado..."
}
```

**Derecho de familia:**
```json
{
  "stats": [{ "value": "75+", "label": "Años de experiencia" }],
  "areas": [{ "titulo": "Divorcios", "descripcion": "..." }],
  "que_saber": [{ "paso": "1", "titulo": "Prepare la documentación", "descripcion": "..." }],
  "intro": "Texto introductorio personalizado..."
}
```

---

## Scripts de Generación

### Ejecución

```bash
npm run generate:accidentes -- --city murcia
npm run generate:familia -- --city murcia
npm run generate:negligencias -- --city murcia
npm run generate:extranjeria -- --city murcia
npm run generate:admin -- --city murcia
npm run generate:civil -- --city murcia
```

### Arquitectura de scripts

```
scripts/
├── lib/generate-utils.ts              # Módulo compartido
│   ├── Conexiones (Supabase, OpenAI, SERP)
│   ├── Parsing CLI (--city, --service)
│   ├── Llamadas SERP y OpenAI
│   ├── Validación base (frases prohibidas, entidades)
│   ├── Upsert en Supabase (incluye custom_sections_es/en)
│   └── runGenerator() — orquestador genérico
│
├── generate-accidentes-trafico.ts     # Config específica
├── generate-derecho-familia.ts
├── generate-negligencias-medicas.ts
├── generate-permisos-residencia.ts
├── generate-responsabilidad-administracion.ts
└── generate-responsabilidad-civil.ts
```

Cada script define:
- `serviceKey` — la clave de servicio en Supabase
- `buildSerpQueries()` — consultas SERP adaptadas al servicio
- `buildSystemPrompt()` — instrucciones para OpenAI con estructura JSON esperada
- `buildUserPrompt()` — contexto de ciudad + evidencia SERP
- `validateCustom()` — validación de la estructura `custom_sections_es` generada

---

## Regla de Paridad ES/EN

### OBLIGATORIO

> Cada vez que se modifica una página en `/es/`, se DEBE replicar el mismo cambio (traducido) en su equivalente `/en/`, y viceversa.

### Correspondencia de archivos

| Archivo ES | Archivo EN |
|---|---|
| `es/servicios/accidentes-trafico/page.tsx` | `en/services/traffic-accidents/page.tsx` |
| `es/servicios/accidentes-trafico/[ciudad]/page.tsx` | `en/services/traffic-accidents/[city]/page.tsx` |
| `es/servicios/derecho-familia/page.tsx` | `en/services/family-law/page.tsx` |
| `es/servicios/derecho-familia/[ciudad]/page.tsx` | `en/services/family-law/[city]/page.tsx` |
| `es/servicios/negligencias-medicas/page.tsx` | `en/services/medical-malpractice/page.tsx` |
| `es/servicios/negligencias-medicas/[ciudad]/page.tsx` | `en/services/medical-malpractice/[city]/page.tsx` |
| `es/servicios/permisos-residencia/page.tsx` | `en/services/immigration/page.tsx` |
| `es/servicios/permisos-residencia/[ciudad]/page.tsx` | `en/services/immigration/[city]/page.tsx` |
| `es/servicios/responsabilidad-administracion/page.tsx` | `en/services/administrative-law/page.tsx` |
| `es/servicios/responsabilidad-administracion/[ciudad]/page.tsx` | `en/services/administrative-law/[city]/page.tsx` |
| `es/servicios/responsabilidad-civil/page.tsx` | `en/services/civil-liability/page.tsx` |
| `es/servicios/responsabilidad-civil/[ciudad]/page.tsx` | `en/services/civil-liability/[city]/page.tsx` |

### Diferencias entre ES y EN

Las páginas son idénticas en diseño y estructura. Solo cambian:
- El texto (traducido)
- El `locale` ('es' vs 'en')
- Las rutas (`/es/contacto` vs `/en/contact`, etc.)
- Las columnas de Supabase leídas (`_es` vs `_en`)
- El `params` de la ruta local (`ciudad` en ES, `city` en EN)

### Componente CityServicePage (bilingüe)

`src/components/content/CityServicePage.tsx` acepta `locale='es'|'en'` y renderiza automáticamente en el idioma correcto. Se usa para las 4 páginas locales estándar.

Las páginas premium (accidentes-trafico y derecho-familia) tienen su propio diseño inline tanto en ES como en EN.

---

## Mapeos de Slugs

Definidos en `src/data/services.ts`:

```typescript
FOLDER_SLUG_MAP = {
  'accidentes-trafico': 'accidentes-trafico',
  'derecho-familia': 'derecho-familia',
  'negligencias-medicas': 'negligencias-medicas',
  'extranjeria': 'permisos-residencia',
  'derecho-administrativo': 'responsabilidad-administracion',
  'responsabilidad-civil': 'responsabilidad-civil',
};

FOLDER_SLUG_MAP_EN = {
  'accidentes-trafico': 'traffic-accidents',
  'derecho-familia': 'family-law',
  'negligencias-medicas': 'medical-malpractice',
  'extranjeria': 'immigration',
  'derecho-administrativo': 'administrative-law',
  'responsabilidad-civil': 'civil-liability',
};
```

`getFolderSlug(serviceId, locale)` devuelve el slug correcto según el idioma.

`getServicesByLocale(locale)` devuelve los 6 servicios activos con slugs y nombres en el idioma correspondiente.

---

## Redirects 301

Configurados en `next.config.js`:

### ES
- `/es/servicios/abogados-X-ciudad` -> `/es/servicios/{carpeta}/{ciudad}`
- `/es/abogados/abogados-X-ciudad` -> `/es/servicios/{carpeta}/{ciudad}`
- `/es/servicios/extranjeria` -> `/es/servicios/permisos-residencia`
- `/es/servicios/derecho-administrativo` -> `/es/servicios/responsabilidad-administracion`

### EN
- `/en/services/X-lawyers-murcia` -> `/en/services/{carpeta-en}`
- `/en/lawyers/X-lawyers-city` -> `/en/services/{carpeta-en}/{city}`
- Servicios inactivos EN -> `/en/services`

---

## Checklist para Añadir Nueva Ciudad

1. Insertar la localidad en la tabla `localities` de Supabase
2. Insertar entidades locales en `local_entities` (juzgados, hospitales, etc.)
3. Ejecutar los 6 scripts de generación para esa ciudad
4. Verificar que las páginas se generan correctamente (`generateStaticParams` las recoge automáticamente)
5. El sitemap las incluye automáticamente

---

## Checklist para Modificar un Servicio

1. Hacer el cambio en la página ES
2. **Replicar el mismo cambio (traducido) en la página EN**
3. Si se modifica el diseño, actualizar ambas versiones
4. Si se añade una sección custom, actualizar el script de generación
5. Verificar hreflang y alternateUrl

---

**Última actualización:** 2026-02-18
**Estado:** En producción — 6 servicios activos, estructura ES + EN completa
