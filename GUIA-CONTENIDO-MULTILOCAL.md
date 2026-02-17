# Guía de Implementación de Contenido Multilocal

## 📋 Resumen del Proyecto

Crear contenido específico y único para cada uno de los 14 servicios en múltiples localidades de la Región de Murcia y provincias cercanas, en español e inglés.

**Estado actual:** ✅ 14 servicios con contenido perfecto para Murcia  
**Objetivo:** Expandir a ~15-20 localidades adicionales con contenido localizado

---

## 🎯 Fase 1: Diseño de Base de Datos en Supabase

### 1.1 Tabla: `localities` (Localidades)

```sql
CREATE TABLE localities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  province VARCHAR(100) NOT NULL,
  population INTEGER,
  postal_code VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_localities_slug ON localities(slug);
CREATE INDEX idx_localities_province ON localities(province);
CREATE INDEX idx_localities_is_active ON localities(is_active);
```

**Datos iniciales a insertar:**
- Murcia (capital) - Ya tiene contenido
- Alicante
- Albacete
- Cartagena
- Lorca
- Molina de Segura
- Alcantarilla
- Jumilla
- Cieza
- Yecla
- Águilas
- Caravaca de la Cruz
- Totana
- Mazarrón
- San Javier
- (+ otras según población > 10,000 en radio 200km)

### 1.2 Tabla: `services` (Servicios Base)

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_key VARCHAR(100) NOT NULL UNIQUE,
  name_es VARCHAR(200) NOT NULL,
  name_en VARCHAR(200) NOT NULL,
  icon VARCHAR(50),
  category VARCHAR(50),
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Datos iniciales:** Los 14 servicios actuales
- accidentes-trafico
- derecho-familia
- derecho-bancario
- derecho-penal
- derecho-inmobiliario
- derecho-sucesorio
- derecho-mercantil
- responsabilidad-civil
- obligaciones-contratos
- mediacion
- extranjeria
- derecho-administrativo
- defensa-fondos-buitre
- negligencias-medicas

### 1.3 Tabla: `service_content` (Contenido Localizado)

```sql
CREATE TABLE service_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  locality_id UUID REFERENCES localities(id) ON DELETE CASCADE,
  
  -- URLs
  slug_es VARCHAR(255) NOT NULL,
  slug_en VARCHAR(255) NOT NULL,
  
  -- Contenido Español
  title_es VARCHAR(255) NOT NULL,
  meta_description_es TEXT,
  short_description_es TEXT,
  long_description_es TEXT,
  
  -- Secciones (JSON array con {title, content})
  sections_es JSONB,
  
  -- Proceso de trabajo (JSON array de strings)
  process_es JSONB,
  
  -- FAQs (JSON array con {question, answer})
  faqs_es JSONB,
  
  -- Contenido Inglés
  title_en VARCHAR(255),
  meta_description_en TEXT,
  short_description_en TEXT,
  long_description_en TEXT,
  sections_en JSONB,
  process_en JSONB,
  faqs_en JSONB,
  
  -- Metadata
  translation_status VARCHAR(20) DEFAULT 'pending', -- pending, translated, reviewed
  content_quality_score INTEGER, -- 0-100
  last_reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(service_id, locality_id)
);

-- Índices
CREATE INDEX idx_service_content_service ON service_content(service_id);
CREATE INDEX idx_service_content_locality ON service_content(locality_id);
CREATE INDEX idx_service_content_slug_es ON service_content(slug_es);
CREATE INDEX idx_service_content_slug_en ON service_content(slug_en);
CREATE INDEX idx_service_content_translation_status ON service_content(translation_status);
```

### 1.4 Tabla: `local_entities` (Entidades Locales de Referencia)

```sql
CREATE TABLE local_entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locality_id UUID REFERENCES localities(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL, -- court, hospital, police, registry, etc.
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  website VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_local_entities_locality ON local_entities(locality_id);
CREATE INDEX idx_local_entities_type ON local_entities(entity_type);
```

**Tipos de entidades a recopilar:**
- `court` - Juzgados (Familia, Penal, Primera Instancia, etc.)
- `hospital` - Hospitales y centros sanitarios
- `police` - Comisarías y policía local
- `registry` - Registros (Civil, Propiedad, Mercantil)
- `government` - Ayuntamiento, oficinas administrativas
- `road` - Carreteras principales de la zona
- `mediation_center` - Centros de mediación
- `other` - Otras entidades relevantes

---

## ⚙️ Fase 2: Migración del Contenido de Murcia

### 2.1 Script: `scripts/migrate-murcia-content.ts`

**Objetivo:** Migrar el contenido perfeccionado de Murcia desde `src/data/services.ts` a Supabase

```typescript
// Script que:
// 1. Lee el contenido actual de services.ts
// 2. Inserta la localidad "Murcia" en localities
// 3. Inserta los 14 servicios en services
// 4. Inserta todo el contenido en service_content
// 5. Genera los slugs correctos (abogados-[servicio]-murcia)
```

**Tareas:**
- [ ] Crear script de migración
- [ ] Ejecutar y verificar datos en Supabase
- [ ] Confirmar que todo el contenido de Murcia está correctamente almacenado

---

## 🤖 Fase 3: Generación de Contenido con IA

### 3.1 Script: `scripts/generate-local-content.ts`

**Estrategia de generación:**

1. **Investigación Automática con SERP API:**
   - Buscar información específica de cada localidad
   - Identificar juzgados, hospitales, carreteras, etc.
   - Extraer contexto local relevante

2. **Generación con OpenAI GPT-4:**
   - Usar el contenido de Murcia como plantilla base
   - Adaptar con información local específica
   - Mantener estructura y tono profesional

3. **Elementos a localizar por servicio:**
   - **Accidentes de Tráfico:** Carreteras locales (A-30, A-7, etc.), hospitales cercanos, juzgados de lo penal
   - **Derecho de Familia:** Juzgados de Familia, centros de mediación local
   - **Derecho Bancario:** Juzgados de Primera Instancia especializados
   - **Derecho Penal:** Juzgados de Instrucción y Penal, comisarías locales
   - **Derecho Inmobiliario:** Registro de la Propiedad local
   - **Derecho Sucesorio:** Registro Civil, notarías locales
   - **Derecho Mercantil:** Registro Mercantil local
   - **Etc.**

### 3.2 Prompt Template para OpenAI

```
Eres un experto en derecho español y copywriting legal. Tu tarea es adaptar el contenido de un servicio legal de Murcia para la localidad de {LOCALIDAD}.

SERVICIO: {SERVICE_NAME}
LOCALIDAD: {LOCALITY_NAME}
PROVINCIA: {PROVINCE}

CONTENIDO BASE (MURCIA):
{MURCIA_CONTENT}

INFORMACIÓN LOCAL DISPONIBLE:
{LOCAL_ENTITIES}

INSTRUCCIONES:
1. Mantén la estructura exacta del contenido base
2. Reemplaza todas las referencias a "Murcia" por "{LOCALIDAD}"
3. Sustituye las entidades locales de Murcia (juzgados, hospitales, carreteras) por las de {LOCALIDAD}
4. Si no hay información específica disponible, usa términos genéricos apropiados
5. Mantén el tono profesional y la longitud similar al original
6. Incluye menciones naturales a la localidad para SEO local
7. Asegúrate de que el contenido sea único y no duplicado

IMPORTANTE: El contenido debe ser específico y útil para alguien en {LOCALIDAD}, no una simple sustitución de nombres.

GENERA:
- long_description_es
- sections_es (4 secciones con title y content)
- process_es (6 pasos)
- faqs_es (5 preguntas y respuestas)
```

### 3.3 Configuración del Script

```typescript
// scripts/generate-local-content.ts
interface GenerationConfig {
  openaiApiKey: string;
  serpApiKey: string;
  supabaseUrl: string;
  supabaseKey: string;
  
  // Configuración de generación
  batchSize: number; // Cuántos servicios procesar a la vez
  delayBetweenRequests: number; // ms entre llamadas a OpenAI
  maxRetries: number;
  
  // Localidades a procesar
  localities: string[]; // IDs o slugs
  services: string[]; // IDs o keys
}
```

**Tareas:**
- [ ] Configurar API keys en `.env.local`
- [ ] Crear script de generación
- [ ] Implementar búsqueda con SERP API
- [ ] Implementar generación con OpenAI
- [ ] Añadir logging y manejo de errores
- [ ] Ejecutar generación por lotes
- [ ] Revisar calidad del contenido generado

---

## 🌍 Fase 4: Traducción al Inglés

### 4.1 Script: `scripts/translate-content.ts`

**Objetivo:** Traducir todo el contenido español al inglés usando OpenAI

### 4.2 Prompt Template para Traducción

```
Eres un traductor profesional especializado en contenido legal. Traduce el siguiente contenido de servicios legales del español al inglés.

IMPORTANTE:
- Mantén el tono profesional y formal
- Usa terminología legal apropiada en inglés
- No traduzcas nombres propios (calles, juzgados, etc.)
- Mantén la estructura y formato exactos
- Preserva cualquier {variable} sin traducir

CONTENIDO A TRADUCIR:
{SPANISH_CONTENT}

GENERA LA TRADUCCIÓN EN FORMATO JSON:
{
  "title_en": "...",
  "meta_description_en": "...",
  "short_description_en": "...",
  "long_description_en": "...",
  "sections_en": [...],
  "process_en": [...],
  "faqs_en": [...]
}
```

**Tareas:**
- [ ] Crear script de traducción
- [ ] Traducir contenido por lotes
- [ ] Revisar calidad de traducciones
- [ ] Actualizar campo `translation_status` en DB

---

## 🔗 Fase 5: Integración con Next.js

### 5.1 Actualizar Routing Dinámico

**Crear:** `src/app/es/abogados/[servicio-ciudad]/page.tsx`

```typescript
// Estructura:
// /es/abogados/accidentes-trafico-alicante
// /es/abogados/derecho-familia-cartagena
// etc.

export async function generateStaticParams() {
  // Fetch todas las combinaciones de servicio-localidad desde Supabase
  const { data } = await supabase
    .from('service_content')
    .select('slug_es');
  
  return data.map(item => ({
    'servicio-ciudad': item.slug_es
  }));
}
```

### 5.2 Crear Cliente de Supabase

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 5.3 Funciones Helper

```typescript
// src/lib/content.ts
export async function getServiceContent(serviceKey: string, localitySlug: string, locale: 'es' | 'en') {
  // Fetch contenido desde Supabase
  // Cache con Next.js revalidation
}

export async function getAllLocalitiesForService(serviceKey: string) {
  // Para generar menús/listados
}
```

**Tareas:**
- [ ] Instalar `@supabase/supabase-js`
- [ ] Configurar cliente de Supabase
- [ ] Crear página dinámica de landing
- [ ] Implementar ISR (Incremental Static Regeneration)
- [ ] Añadir enlaces internos entre localidades
- [ ] Generar sitemap dinámico

---

## 📊 Fase 6: SEO y Optimización

### 6.1 Sitemap Dinámico

```typescript
// src/app/sitemap.ts
export default async function sitemap() {
  const { data } = await supabase
    .from('service_content')
    .select('slug_es, slug_en, updated_at');
  
  return data.map(item => ({
    url: `https://gvcabogados.com/es/abogados/${item.slug_es}`,
    lastModified: item.updated_at,
    changeFrequency: 'monthly',
    priority: 0.8
  }));
}
```

### 6.2 Internal Linking

- Crear componente de "Servicios en otras ciudades"
- Añadir breadcrumbs con localidad
- Listar localidades cercanas al final de cada landing

**Tareas:**
- [ ] Implementar sitemap dinámico
- [ ] Añadir schema markup local (LocalBusiness)
- [ ] Implementar internal linking
- [ ] Optimizar imágenes por localidad (si aplica)

---

## 📈 Fase 7: Analytics y Monitoreo

### 7.1 Métricas a Trackear

- Páginas generadas totalmente
- Calidad del contenido (score)
- Estado de traducción
- Tráfico por localidad
- Conversiones por landing

### 7.2 Dashboard Admin (Opcional)

Crear un dashboard simple para:
- Ver estado de generación
- Marcar contenido para revisión manual
- Re-generar contenido específico
- Activar/desactivar localidades

---

## 🎯 Cronograma Estimado

| Fase | Duración | Dependencias |
|------|----------|--------------|
| 1. Base de datos | 1 día | - |
| 2. Migración Murcia | 0.5 días | Fase 1 |
| 3. Generación contenido | 2-3 días | Fases 1, 2 |
| 4. Traducción | 1 día | Fase 3 |
| 5. Integración Next.js | 1-2 días | Fases 1-4 |
| 6. SEO | 0.5 días | Fase 5 |
| 7. Testing | 1 día | Todas |

**Total estimado: 7-9 días**

---

## ✅ Checklist de Progreso

### Base de Datos
- [ ] Crear tabla `localities`
- [ ] Crear tabla `services`
- [ ] Crear tabla `service_content`
- [ ] Crear tabla `local_entities`
- [ ] Insertar localidades iniciales
- [ ] Insertar servicios base

### Scripts
- [ ] Script migración Murcia
- [ ] Script generación contenido
- [ ] Script traducción
- [ ] Script recolección entidades locales (SERP)

### Integración
- [ ] Instalar Supabase client
- [ ] Configurar variables de entorno
- [ ] Crear página dinámica landing
- [ ] Implementar fetching de datos
- [ ] Configurar ISR/SSG

### SEO
- [ ] Sitemap dinámico
- [ ] Schema markup
- [ ] Internal linking
- [ ] Meta tags dinámicos

### Testing
- [ ] Verificar todas las URLs generadas
- [ ] Revisar calidad de contenido (muestra)
- [ ] Verificar traducciones
- [ ] Test de rendimiento
- [ ] Test de SEO

---

## 📝 Notas Importantes

1. **Calidad sobre Cantidad:** Mejor 10 localidades con contenido excelente que 50 con contenido mediocre
2. **Revisión Manual:** Revisar manualmente al menos una muestra del 20% del contenido generado
3. **Entidades Locales:** Verificar que juzgados, hospitales, etc. existan realmente en cada localidad
4. **Evitar Penalizaciones:** Asegurar que el contenido es único y no "thin content"
5. **Cache Strategy:** Usar ISR con revalidación de 7 días para equilibrar frescura y rendimiento

---

## 🔧 Variables de Entorno Necesarias

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# SERP API
SERP_API_KEY=your_serp_api_key
```

---

## 📞 Contacto y Soporte

Para dudas sobre esta guía o el proceso de implementación, documentar aquí los issues encontrados y soluciones aplicadas.

---

**Última actualización:** 2026-02-17  
**Versión:** 1.0  
**Estado:** 🟡 En Progreso
