/**
 * Generador de contenido multiciudad (incluye Murcia) con SERP API + OpenAI.
 *
 * Objetivo:
 * - Investigar información local verificable (juzgados, hospitales, comisarías, registros, etc.)
 * - Generar contenido SEO/marketing legal de alta calidad para cada (servicio, localidad)
 * - Guardar el resultado en Supabase (`service_content`) y los anclajes locales en (`local_entities`)
 *
 * Importante:
 * - PROHIBIDO mencionar "consulta gratuita" o "free consultation" (ni variaciones).
 * - No inventar entidades: solo usar nombres/URLs presentes en la evidencia de SERP.
 *
 * Uso:
 *   npm run generate:content
 *
 * Flags:
 *   --locality=<slug|all>      (default: all)
 *   --service=<service_key|all> (default: all)
 *   --force=true|false         (default: false) Regenera aunque exista contenido
 *   --dry-run=true|false       (default: false) No escribe en Supabase
 *   --limit=<n>                (default: 0 sin límite) Limita combinaciones procesadas
 *   --verbose=true|false       (default: true) Logs detallados
 *   --model=<openai_model>     (default: gpt-4.1) Override del modelo
 *   --max-tokens=<n>           (default: 3500) Máx tokens de salida por página
 *
 * Variables opcionales:
 *   OPENAI_MODEL               (si no se pasa --model)
 *   OPENAI_MAX_TOKENS          (si no se pasa --max-tokens)
 *   OPENAI_TEMPERATURE         (default: 0.5)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SERP_API_KEY = process.env.SERP_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1';
const DEFAULT_MAX_TOKENS = Number.parseInt(process.env.OPENAI_MAX_TOKENS || '3500', 10) || 3500;
const DEFAULT_TEMPERATURE = Number.parseFloat(process.env.OPENAI_TEMPERATURE || '0.5') || 0.5;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Faltan variables de Supabase. Revisa NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local');
}
if (!SERP_API_KEY) {
  throw new Error('Falta SERP_API_KEY en .env.local');
}
if (!OPENAI_API_KEY) {
  throw new Error('Falta OPENAI_API_KEY en .env.local');
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

type EntityType =
  | 'court'
  | 'hospital'
  | 'police'
  | 'registry'
  | 'government'
  | 'road'
  | 'mediation_center'
  | 'other';

type SerpOrganicResult = {
  title?: string;
  link?: string;
  snippet?: string;
  source?: string;
};

type SerpResponse = {
  search_metadata?: { id?: string; status?: string };
  search_information?: { total_results?: number };
  organic_results?: SerpOrganicResult[];
};

type LocalityRow = { id: string; name: string; slug: string; province: string | null };
type ServiceRow = { id: string; service_key: string; name_es: string; name_en: string | null; category: string | null };

type ServiceContentRow = {
  id: string;
  service_id: string;
  locality_id: string;
  slug_es: string;
  slug_en: string;
  title_es: string;
  meta_description_es: string | null;
  short_description_es: string | null;
  long_description_es: string | null;
  sections_es: unknown;
  process_es: unknown;
  faqs_es: unknown;
  title_en: string | null;
  meta_description_en: string | null;
  short_description_en: string | null;
  long_description_en: string | null;
  sections_en: unknown;
  process_en: unknown;
  faqs_en: unknown;
  translation_status: 'pending' | 'translated' | 'reviewed';
  content_quality_score: number | null;
  last_reviewed_at: string | null;
};

type GeneratedPayload = {
  title_es: string;
  meta_description_es: string;
  short_description_es: string;
  long_description_es: string;
  sections_es: Array<{ title: string; content: string }>;
  process_es: string[];
  faqs_es: Array<{ question: string; answer: string }>;
  local_entities: Array<{
    entity_type: EntityType;
    name: string;
    address?: string;
    phone?: string;
    website?: string;
    notes?: string;
    source_url: string;
  }>;
  quality: { score: number; notes?: string };
};

const FORBIDDEN_PHRASES = [
  /consulta\s+gratuita/gi,
  /free\s+consultation/gi,
  /\bgratuita\b/gi, // demasiado habitual en marketing; se prohíbe para evitar riesgos
  /\bgratis\b/gi,
];

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (const raw of argv.slice(2)) {
    const [k, ...rest] = raw.split('=');
    if (!k.startsWith('--')) continue;
    args[k.slice(2)] = rest.join('=') || 'true';
  }
  return {
    locality: (args.locality || 'all').trim(),
    service: (args.service || 'all').trim(),
    force: (args.force || 'false').toLowerCase() === 'true',
    dryRun: (args['dry-run'] || 'false').toLowerCase() === 'true',
    limit: Number.parseInt(args.limit || '0', 10) || 0,
    verbose: (args.verbose || 'true').toLowerCase() === 'true',
    model: (args.model || '').trim(),
    maxTokens: Number.parseInt(args['max-tokens'] || '', 10) || 0,
  };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function ts() {
  return new Date().toISOString().slice(11, 19);
}

function normalizeText(s: string) {
  return s.replace(/\s+/g, ' ').trim();
}

function containsForbidden(text: string) {
  return FORBIDDEN_PHRASES.some((re) => re.test(text));
}

function assertNoForbidden(payload: GeneratedPayload) {
  const dump = JSON.stringify(payload);
  if (containsForbidden(dump)) {
    throw new Error('El contenido generado contiene frases prohibidas (p. ej., "consulta gratuita" / "gratis").');
  }
}

function buildSlugs(serviceKey: string, serviceSlugEsBase: string, serviceSlugEnBase: string, localitySlug: string) {
  // Regla:
  // - Si el slug base termina en "-murcia", se reemplaza por "-<locality>"
  // - Si no, se añade "-<locality>" para garantizar unicidad por localidad
  const fix = (base: string) => {
    const b = base.trim();
    if (b.endsWith('-murcia')) return b.replace(/-murcia$/, `-${localitySlug}`);
    return `${b}-${localitySlug}`;
  };

  const slug_es = fix(serviceSlugEsBase || `abogados-${serviceKey}`);
  const slug_en = fix(serviceSlugEnBase || `${serviceKey}-lawyers`);
  return { slug_es, slug_en };
}

function serviceSlugBaseFromMurciaSlugs(serviceKey: string) {
  // Intento de inferencia: para mantener estilo consistente con lo ya existente en Murcia,
  // se recupera el registro de Murcia en `service_content` y se reutilizan slug_es/slug_en como base.
  // Si no existe, se aplica fallback.
  return { slugEsBase: `abogados-${serviceKey}-murcia`, slugEnBase: `${serviceKey}-lawyers-murcia` };
}

function buildSerpQueries(locality: LocalityRow, service: ServiceRow) {
  const loc = `${locality.name}${locality.province ? ` (${locality.province})` : ''}`;
  const serviceName = service.name_es;

  // Base local anchors (siempre)
  const base = [
    `Juzgados ${locality.name} dirección`,
    `Registro Civil ${locality.name}`,
    `Comisaría Policía Nacional ${locality.name}`,
    `Ayuntamiento ${locality.name} sede electrónica`,
  ];

  // Service-specific anchors (mínimo 2)
  switch (service.service_key) {
    case 'accidentes-trafico':
      return [
        ...base,
        `Urgencias hospital ${locality.name} accidentes de tráfico`,
        `Guardia Civil Tráfico ${locality.name}`,
        `carreteras principales ${locality.name} accesos A-7 A-30`,
        `atestado accidente de tráfico ${locality.name} dónde solicitar`,
      ];
    case 'negligencias-medicas':
      return [
        ...base,
        `hospital ${locality.name} quejas atención sanitaria`,
        `Servicio Murciano de Salud reclamaciones ${loc}`,
        `inspección médica reclamación ${locality.name}`,
        `defensor del paciente ${locality.name}`,
      ];
    case 'derecho-penal':
      return [
        ...base,
        `Juzgado de Guardia ${locality.name}`,
        `abogado penalista ${locality.name} asistencia detenido`,
        `Instituto de Medicina Legal ${loc}`,
      ];
    case 'derecho-familia':
      return [
        ...base,
        `Juzgado de Familia ${locality.name}`,
        `Punto de Encuentro Familiar ${loc}`,
        `mediación familiar ${locality.name} servicio`,
      ];
    case 'extranjeria':
      return [
        ...base,
        `Oficina de Extranjería ${locality.name}`,
        `cita previa extranjería ${loc}`,
        `comisaría expedición TIE ${locality.name}`,
      ];
    case 'derecho-administrativo':
      return [
        ...base,
        `Sede electrónica ${locality.name} recursos administrativos`,
        `Delegación del Gobierno ${loc}`,
        `BOP ${locality.province || locality.name} anuncios oficiales`,
      ];
    case 'derecho-inmobiliario':
      return [
        ...base,
        `Registro de la Propiedad ${locality.name}`,
        `Catastro ${locality.name} consulta`,
        `licencias urbanísticas ${locality.name}`,
      ];
    case 'derecho-sucesorio':
      return [
        ...base,
        `Notaría ${locality.name} herencias`,
        `Registro General de Actos de Última Voluntad ${loc}`,
        `certificado defunción ${locality.name} registro`,
      ];
    case 'derecho-mercantil':
      return [
        ...base,
        `Registro Mercantil ${locality.name}`,
        `Cámara de Comercio ${loc}`,
        `constitución de sociedades ${locality.name} trámites`,
      ];
    case 'derecho-bancario':
      return [
        ...base,
        `reclamación cláusulas bancarias ${locality.name}`,
        `Banco de España reclamaciones consumidores`,
        `servicios de consumo ${locality.name} reclamaciones`,
      ];
    case 'responsabilidad-civil':
      return [
        ...base,
        `compañías aseguradoras parte siniestro ${loc}`,
        `perito médico ${locality.name} valoración daños`,
        `baremo accidentes indemnización España`,
      ];
    case 'obligaciones-contratos':
      return [
        ...base,
        `reclamación de deudas ${locality.name} juicio monitorio`,
        `mediación civil ${locality.name}`,
        `burofax ${locality.name} envío`,
      ];
    case 'mediacion':
      return [
        ...base,
        `centro de mediación ${locality.name}`,
        `mediación civil y mercantil ${loc}`,
        `registro de mediadores ${locality.province || locality.name}`,
      ];
    case 'defensa-fondos-buitre':
      return [
        ...base,
        `desahucio alquiler ${locality.name} juzgados`,
        `servicios sociales vivienda ${locality.name}`,
        `oficina municipal vivienda ${locality.name}`,
        `sareb alquiler social ${locality.name}`,
      ];
    default:
      return [
        ...base,
        `${serviceName} ${locality.name} información`,
        `${serviceName} ${loc} trámites`,
      ];
  }
}

async function serpSearch(q: string) {
  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google');
  url.searchParams.set('q', q);
  url.searchParams.set('api_key', SERP_API_KEY!);
  url.searchParams.set('hl', 'es');
  url.searchParams.set('gl', 'es');
  url.searchParams.set('num', '10');

  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`SERP API error (${res.status}): ${normalizeText(t).slice(0, 400)}`);
  }
  const json = (await res.json()) as SerpResponse;
  return json;
}

function flattenEvidence(queries: string[], serp: SerpResponse[]) {
  const items: Array<{
    query: string;
    title: string;
    link: string;
    snippet: string;
  }> = [];

  for (let i = 0; i < serp.length; i++) {
    const q = queries[i] || '';
    const results = serp[i]?.organic_results || [];
    for (const r of results) {
      if (!r?.link) continue;
      items.push({
        query: q,
        title: normalizeText(r.title || ''),
        link: r.link,
        snippet: normalizeText(r.snippet || ''),
      });
    }
  }

  // Dedupe por link
  const seen = new Set<string>();
  const deduped: typeof items = [];
  for (const it of items) {
    if (seen.has(it.link)) continue;
    seen.add(it.link);
    deduped.push(it);
  }
  return deduped.slice(0, 30); // límite de evidencia a enviar al modelo
}

function systemPrompt() {
  return normalizeText(`
Eres un abogado experto en comunicación jurídica y un redactor editorial de primer nivel. Tu trabajo es crear contenido web para un despacho de abogados premium en España que suene HUMANO, NATURAL y AUTORIZADO —como si lo hubiera escrito un socio del bufete que conoce bien la ciudad.

═══════════════════════════════════════════
REGLAS ABSOLUTAS (inquebrantables):
═══════════════════════════════════════════

1. PROHIBIDO: "consulta gratuita", "gratuita", "gratis", "free consultation" y cualquier variación. Jamás.

2. NO INVENTAR DATOS: No puedes inventar nombres de juzgados, hospitales, comisarías, registros, direcciones, teléfonos ni ninguna institución.
   - SOLO puedes mencionar entidades que aparezcan EXPLÍCITAMENTE en la evidencia SERP proporcionada.
   - Si la evidencia dice "Juzgados de Murcia" genéricamente, NO extrapoles un nombre específico como "Juzgado de Primera Instancia nº3 de Murcia" salvo que aparezca literalmente.
   - Si no tienes evidencia suficiente sobre una institución concreta, NO LA MENCIONES. Es preferible ser genérico ("los juzgados competentes de la localidad") que inventar un nombre.
   - Las DIRECCIONES son especialmente sensibles: NO incluyas ninguna dirección (calle, avenida, plaza) que no esté textualmente en la evidencia. Una dirección inventada destruye la credibilidad.

3. VERIFICACIÓN DE ENTIDADES: Antes de incluir cualquier entidad local, pregúntate:
   - ¿Aparece este nombre EXACTO en algún resultado SERP?
   - ¿La dirección/teléfono aparece LITERALMENTE en la evidencia?
   - Si la respuesta a cualquiera es NO → no lo incluyas.

═══════════════════════════════════════════
ESTILO DE ESCRITURA (crítico):
═══════════════════════════════════════════

EVITA ABSOLUTAMENTE estos patrones repetitivos que delatan contenido generado por IA:
- "La tramitación requiere conocimiento de las instituciones locales" o variaciones.
- "Conocimiento específico de [institución local]" como muletilla.
- Repetir la dirección del despacho o de un juzgado más de UNA vez en todo el contenido.
- Comenzar todos los párrafos o secciones con la misma estructura gramatical.
- Frases genéricas que podrían aplicarse a CUALQUIER ciudad: "contar con un abogado especializado marca la diferencia", "la normativa vigente establece", etc. Si una frase funciona igual cambiando el nombre de la ciudad, es demasiado genérica.
- Listas interminables de servicios sin profundizar en ninguno.

EN SU LUGAR, escribe así:
- Varía la estructura: a veces empieza con un dato, otras con una pregunta retórica, otras con un caso práctico (hipotético pero realista).
- Sé CONCRETO cuando tengas datos: en lugar de "los juzgados de la localidad", di "el Juzgado de lo Social de Cartagena" (solo si aparece en evidencia).
- Sé PRUDENTE cuando NO tengas datos: usa formulaciones genéricas naturales sin pretender conocimiento que no tienes.
- Cada sección debe aportar información DISTINTA. No repitas la misma idea reformulada.
- El tono es el de un profesional cercano: serio pero accesible, técnico pero comprensible.
- Incluye matices locales REALES (si la evidencia los proporciona): particularidades del partido judicial, volumen de asuntos, peculiaridades de la zona.
- La long_description debe leerse como un artículo editorial, no como un folleto publicitario.

═══════════════════════════════════════════
FORMATO DE SALIDA:
═══════════════════════════════════════════
Devuelve SOLO JSON válido (sin markdown, sin comentarios, sin texto fuera del JSON).
Claves requeridas: title_es, meta_description_es, short_description_es, long_description_es, sections_es, process_es, faqs_es, local_entities, quality.
`);
}

function userPrompt(params: {
  locality: LocalityRow;
  service: ServiceRow;
  slug_es: string;
  evidence: ReturnType<typeof flattenEvidence>;
  existingSpanish?: Partial<ServiceContentRow> | null;
}) {
  const { locality, service, slug_es, evidence, existingSpanish } = params;
  const existingBlock = existingSpanish?.long_description_es
    ? `CONTENIDO EXISTENTE (para mejorar/reescribir manteniendo lo valioso):\n${existingSpanish.long_description_es}\n`
    : `CONTENIDO EXISTENTE: (no hay)\n`;

  const evidenceText = evidence
    .map((e, idx) => `#${idx + 1}\nquery: ${e.query}\ntitle: ${e.title}\nurl: ${e.link}\nsnippet: ${e.snippet}`.trim())
    .join('\n\n');

  return normalizeText(`
DATOS:
- Localidad: ${locality.name}
- Provincia: ${locality.province || ''}
- Servicio (clave): ${service.service_key}
- Servicio (nombre): ${service.name_es}
- Slug ES: ${slug_es}

${existingBlock}

EVIDENCIA SERP (usa SOLO esto para extraer entidades locales y hechos verificables):
${evidenceText || '(sin evidencia)'}

TAREAS:
1) Extrae "local_entities" como array. Cada elemento debe tener:
   - entity_type: uno de court|hospital|police|registry|government|road|mediation_center|other
   - name: nombre EXACTO como aparece en evidencia (o muy cercano)
   - source_url: URL exacta de donde sale
   - (opcional) address, phone, website, notes: SOLO si se puede respaldar con evidencia
   Minimiza duplicados y prioriza entidades realmente útiles para el servicio.

2) Genera el contenido SEO para "Abogados ${service.name_es} en ${locality.name}" con:
   - title_es: máximo 65 caracteres aprox (sin contar espacios extra)
   - meta_description_es: máximo 155-160 caracteres, sin emojis
   - short_description_es: 2-3 frases, 260-320 caracteres aprox
   - long_description_es: 900-1400 palabras, con subtítulos (H2/H3 en texto plano), enfoque local, y sin listas interminables
   - sections_es: EXACTAMENTE 4 secciones [{title, content}] con enfoque práctico y local
   - process_es: EXACTAMENTE 6 pasos claros y cortos (strings)
   - faqs_es: EXACTAMENTE 6 FAQs (preguntas específicas y útiles; respuestas 60-120 palabras)

3) Evalúa la calidad en quality:
   - score: 0-100 (más alto si hay buen anclaje local verificable y contenido diferenciado)
   - notes: 1-2 frases explicando el score

RECORDATORIO CRÍTICO:
- Prohibido "consulta gratuita"/"gratis"/"gratuita".
- No inventes: si una entidad no está en evidencia, no la añadas.
- Usa un estilo coherente con un bufete premium en España.
`);
}

async function generateWithOpenAI(input: string) {
  const completion = await openai.chat.completions.create({
    model: runtime.model,
    temperature: runtime.temperature,
    max_tokens: runtime.maxTokens,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt() },
      { role: 'user', content: input },
    ],
  });

  const text = completion.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('OpenAI no devolvió contenido.');
  if (runtime.verbose) {
    const u = completion.usage as any;
    const promptTokens = u?.prompt_tokens ?? u?.input_tokens ?? null;
    const completionTokens = u?.completion_tokens ?? u?.output_tokens ?? null;
    const totalTokens = u?.total_tokens ?? null;
    console.log(
      `🧾 [${ts()}] OpenAI usage: prompt=${promptTokens ?? '—'} completion=${completionTokens ?? '—'} total=${totalTokens ?? '—'}`
    );
  }
  return text;
}

function safeJsonParse<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    // Intento de rescate muy básico si viene con basura accidental
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start >= 0 && end > start) {
      const sliced = raw.slice(start, end + 1);
      return JSON.parse(sliced) as T;
    }
    throw e;
  }
}

function validatePayload(p: GeneratedPayload) {
  if (!p.title_es || !p.meta_description_es || !p.short_description_es || !p.long_description_es) {
    throw new Error('Payload incompleto: faltan campos principales.');
  }
  if (!Array.isArray(p.sections_es) || p.sections_es.length !== 4) {
    throw new Error('Payload inválido: sections_es debe tener exactamente 4 secciones.');
  }
  if (!Array.isArray(p.process_es) || p.process_es.length !== 6) {
    throw new Error('Payload inválido: process_es debe tener exactamente 6 pasos.');
  }
  if (!Array.isArray(p.faqs_es) || p.faqs_es.length !== 6) {
    throw new Error('Payload inválido: faqs_es debe tener exactamente 6 FAQs.');
  }
  if (!Array.isArray(p.local_entities)) {
    throw new Error('Payload inválido: local_entities debe ser array.');
  }
  if (p.meta_description_es.length > 180) {
    throw new Error('Payload inválido: meta_description_es demasiado larga (>180).');
  }
  assertNoForbidden(p);
}

async function upsertLocalEntities(localityId: string, entities: GeneratedPayload['local_entities'], dryRun: boolean) {
  if (entities.length === 0) return;

  // Reducir duplicados por (type + name)
  const uniq = new Map<string, (typeof entities)[number]>();
  for (const e of entities) {
    const key = `${e.entity_type}::${normalizeText(e.name).toLowerCase()}`;
    if (!uniq.has(key)) uniq.set(key, e);
  }
  const list = [...uniq.values()];

  if (dryRun) return;

  // Insertar (sin upsert: no hay constraint). Evitamos duplicar comprobando algunos existentes.
  const { data: existing, error: exErr } = await supabaseAdmin
    .from('local_entities')
    .select('entity_type,name')
    .eq('locality_id', localityId);

  if (exErr) throw new Error(`Error leyendo local_entities existentes: ${exErr.message}`);
  const existingSet = new Set((existing || []).map((r: any) => `${r.entity_type}::${normalizeText(r.name).toLowerCase()}`));

  const toInsert = list
    .filter((e) => !existingSet.has(`${e.entity_type}::${normalizeText(e.name).toLowerCase()}`))
    .map((e) => ({
      locality_id: localityId,
      entity_type: e.entity_type,
      name: e.name,
      address: e.address || null,
      phone: e.phone || null,
      website: e.website || null,
      notes: [e.notes, `Fuente: ${e.source_url}`].filter(Boolean).join(' | '),
    }));

  if (toInsert.length === 0) return;

  const { error: insErr } = await supabaseAdmin.from('local_entities').insert(toInsert);
  if (insErr) throw new Error(`Error insertando local_entities: ${insErr.message}`);
}

async function getExistingServiceContent(serviceId: string, localityId: string) {
  const { data, error } = await supabaseAdmin
    .from('service_content')
    .select('*')
    .eq('service_id', serviceId)
    .eq('locality_id', localityId)
    .maybeSingle();
  if (error) throw new Error(`Error leyendo service_content existente: ${error.message}`);
  return (data as ServiceContentRow | null) || null;
}

async function upsertServiceContent(params: {
  serviceId: string;
  localityId: string;
  slug_es: string;
  slug_en: string;
  payload: GeneratedPayload;
  existing: ServiceContentRow | null;
  dryRun: boolean;
}) {
  const { serviceId, localityId, slug_es, slug_en, payload, existing, dryRun } = params;
  if (dryRun) return;

  const base: Partial<ServiceContentRow> = {
    service_id: serviceId,
    locality_id: localityId,
    slug_es,
    slug_en,
    title_es: payload.title_es,
    meta_description_es: payload.meta_description_es,
    short_description_es: payload.short_description_es,
    long_description_es: payload.long_description_es,
    sections_es: payload.sections_es,
    process_es: payload.process_es,
    faqs_es: payload.faqs_es,
    translation_status: existing?.translation_status || 'pending',
    content_quality_score: payload.quality?.score ?? existing?.content_quality_score ?? null,
    last_reviewed_at: new Date().toISOString(),
  };

  // Preservar inglés si ya existe (para no pisar traducciones)
  if (existing) {
    base.title_en = existing.title_en;
    base.meta_description_en = existing.meta_description_en;
    base.short_description_en = existing.short_description_en;
    base.long_description_en = existing.long_description_en;
    base.sections_en = existing.sections_en;
    base.process_en = existing.process_en;
    base.faqs_en = existing.faqs_en;
  }

  const { error } = await supabaseAdmin.from('service_content').upsert(base, {
    onConflict: 'service_id,locality_id',
  });
  if (error) throw new Error(`Error upsert service_content: ${error.message}`);
}

async function main() {
  const args = parseArgs(process.argv);
  // Configuración runtime (modelo/tokens/verbose)
  runtime.verbose = args.verbose;
  runtime.model = args.model || DEFAULT_OPENAI_MODEL;
  runtime.maxTokens = args.maxTokens || DEFAULT_MAX_TOKENS;
  runtime.temperature = DEFAULT_TEMPERATURE;

  console.log(`🧠 [${ts()}] Modelo OpenAI: ${runtime.model}`);
  console.log(`🎛️  [${ts()}] max_tokens=${runtime.maxTokens} temp=${runtime.temperature}`);
  console.log(`🧾 [${ts()}] verbose=${runtime.verbose} dryRun=${args.dryRun} force=${args.force} limit=${args.limit || '∞'}`);
  if (runtime.model.toLowerCase().includes('gpt-5')) {
    console.log(`ℹ️  [${ts()}] Nota: modelos GPT-5 pueden tener límites/latencias más variables. Si da problemas, usa gpt-4.1 (default).`);
  }

  const { data: localities, error: locErr } = await supabaseAdmin
    .from('localities')
    .select('id,name,slug,province')
    .eq('is_active', true)
    .order('priority', { ascending: false });
  if (locErr) throw new Error(`Error cargando localities: ${locErr.message}`);

  const { data: services, error: srvErr } = await supabaseAdmin
    .from('services')
    .select('id,service_key,name_es,name_en,category')
    .eq('is_active', true)
    .order('priority', { ascending: false });
  if (srvErr) throw new Error(`Error cargando services: ${srvErr.message}`);

  const locFiltered = (localities as LocalityRow[]).filter((l) => (args.locality === 'all' ? true : l.slug === args.locality));
  const srvFiltered = (services as ServiceRow[]).filter((s) => (args.service === 'all' ? true : s.service_key === args.service));
  console.log(`📍 [${ts()}] Localidades: ${locFiltered.length} | Servicios: ${srvFiltered.length} | Combinaciones: ${locFiltered.length * srvFiltered.length}`);

  let processed = 0;
  let createdOrUpdated = 0;
  let skipped = 0;
  let failed = 0;

  for (const locality of locFiltered) {
    for (const service of srvFiltered) {
      if (args.limit > 0 && processed >= args.limit) break;
      processed++;

      const mustRegenerate = args.force || locality.slug === 'murcia'; // Murcia siempre se mejora por defecto

      // Inferir slug base (idealmente desde Murcia) para mantener consistencia
      const baseSlugs = serviceSlugBaseFromMurciaSlugs(service.service_key);
      const { slug_es, slug_en } = buildSlugs(service.service_key, baseSlugs.slugEsBase, baseSlugs.slugEnBase, locality.slug);

      try {
        const existing = await getExistingServiceContent(service.id, locality.id);
        if (existing && !mustRegenerate) {
          skipped++;
          if (runtime.verbose) console.log(`⏭️  [${ts()}] Skip (ya existe y no force): ${service.service_key} · ${locality.slug}`);
          continue;
        }

        console.log(`\n📌 [${ts()}] Generando (${processed}/${locFiltered.length * srvFiltered.length}): ${service.name_es} · ${locality.name} (${locality.slug})`);
        console.log(`🔗 [${ts()}] Slug ES: ${slug_es}`);

        const queries = buildSerpQueries(locality, service);
        if (runtime.verbose) {
          console.log(`🔎 [${ts()}] SERP queries (${queries.length}):`);
          for (const q of queries) console.log(`   - ${q}`);
        }
        const serpResponses: SerpResponse[] = [];

        // Rate-limit SERP: 1 request / ~1.1s
        for (const q of queries) {
          const t0 = Date.now();
          const r = await serpSearch(q);
          serpResponses.push(r);
          if (runtime.verbose) {
            const count = r?.organic_results?.length ?? 0;
            console.log(`🌐 [${ts()}] SERP OK (${Date.now() - t0}ms) results=${count} :: ${q}`);
          }
          await sleep(1100);
        }

        const evidence = flattenEvidence(queries, serpResponses);
        console.log(`📚 [${ts()}] Evidencia: ${evidence.length} URLs (dedupe, top 30)`);
        if (runtime.verbose) {
          for (const e of evidence.slice(0, 8)) console.log(`   - ${e.link}`);
        }

        const input = userPrompt({
          locality,
          service,
          slug_es,
          evidence,
          existingSpanish: existing
            ? {
                long_description_es: existing.long_description_es,
                short_description_es: existing.short_description_es,
                sections_es: existing.sections_es,
                process_es: existing.process_es,
                faqs_es: existing.faqs_es,
              }
            : null,
        });
        if (runtime.verbose) {
          console.log(`✍️  [${ts()}] Prompt length: ${input.length.toLocaleString()} chars`);
        }

        const tGen = Date.now();
        const raw = await generateWithOpenAI(input);
        console.log(`🧠 [${ts()}] OpenAI OK (${Date.now() - tGen}ms). Parsing/validando JSON...`);
        const payload = safeJsonParse<GeneratedPayload>(raw);
        validatePayload(payload);
        console.log(
          `✅ [${ts()}] Validación OK: sections=${payload.sections_es.length} process=${payload.process_es.length} faqs=${payload.faqs_es.length} entities=${payload.local_entities.length}`
        );

        await upsertLocalEntities(locality.id, payload.local_entities, args.dryRun);
        await upsertServiceContent({
          serviceId: service.id,
          localityId: locality.id,
          slug_es,
          slug_en,
          payload,
          existing,
          dryRun: args.dryRun,
        });

        createdOrUpdated++;
        console.log(`🏁 [${ts()}] OK (${payload.quality?.score ?? '—'}/100) ${args.dryRun ? '[dry-run]' : ''}`);
      } catch (err: any) {
        failed++;
        console.error(`❌ [${ts()}] Error en ${service.service_key} · ${locality.slug}: ${err?.message || err}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN');
  console.log('='.repeat(60));
  console.log(`Procesadas: ${processed}`);
  console.log(`✅ Generadas/actualizadas: ${createdOrUpdated}`);
  console.log(`⏭️  Omitidas: ${skipped}`);
  console.log(`❌ Fallidas: ${failed}`);
  console.log(`Modo: ${args.dryRun ? 'dry-run (sin escritura)' : 'escritura en Supabase'}`);
  console.log('='.repeat(60) + '\n');
}

const runtime: {
  verbose: boolean;
  model: string;
  maxTokens: number;
  temperature: number;
} = {
  verbose: true,
  model: DEFAULT_OPENAI_MODEL,
  maxTokens: DEFAULT_MAX_TOKENS,
  temperature: DEFAULT_TEMPERATURE,
};

main().catch((e) => {
  console.error('\n❌ Error fatal:', e);
  process.exit(1);
});

