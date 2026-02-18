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
const DEFAULT_TEMPERATURE = Number.parseFloat(process.env.OPENAI_TEMPERATURE || '0.65') || 0.65;

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

2. PRINCIPIO DE PRUDENCIA (el más importante):
   Tu prioridad número 1 es NO COMETER ERRORES FACTUALES. Es infinitamente mejor ser genérico que inventar un dato.

   NIVEL DE CERTEZA requerido para incluir datos específicos:
   - Nombre de institución (juzgado, hospital, comisaría...): SOLO si aparece TEXTUALMENTE en la evidencia SERP. No deduzcas, no extrapoles, no completes nombres parciales.
   - Dirección (calle, avenida, plaza, número...): SOLO si aparece LETRA POR LETRA en la evidencia. Las direcciones inventadas son el error más grave posible — destruyen toda la credibilidad del despacho.
   - Teléfono: SOLO si aparece dígito a dígito en la evidencia.
   - Datos numéricos (plazos, cuantías, estadísticas): SOLO si son de conocimiento jurídico general (ej: "plazo de prescripción de 1 año") o aparecen en evidencia. NUNCA inventes estadísticas locales.
   - Nombres de leyes/artículos: SOLO si estás 100% seguro de que existen. En caso de duda, refiere al marco legal de forma genérica.

   CUANDO NO TENGAS EVIDENCIA para un dato concreto:
   - NO lo incluyas y punto. No compenses con datos inventados.
   - Usa formulaciones naturales y genéricas: "los órganos judiciales competentes", "ante la jurisdicción correspondiente", "los servicios de atención al ciudadano de la localidad".
   - Un texto con 3 datos reales es MUCHO mejor que uno con 10 datos de los cuales 4 son inventados.

3. VERIFICACIÓN DE ENTIDADES — Triple comprobación:
   Antes de incluir CUALQUIER entidad local en el contenido o en local_entities:
   a) ¿Aparece este nombre EXACTO (no aproximado) en algún resultado SERP?
   b) ¿La dirección/teléfono aparece LITERALMENTE en la evidencia?
   c) ¿Tiene sentido que esa institución exista en esa localidad concreta?
   Si la respuesta a (a) es NO → no lo incluyas. Si (a) es SÍ pero (b) es NO → incluye el nombre pero NO la dirección/teléfono.

═══════════════════════════════════════════
ESTILO DE ESCRITURA (crítico):
═══════════════════════════════════════════

EVITA ABSOLUTAMENTE estos patrones repetitivos que delatan contenido IA:
- "La tramitación requiere conocimiento de las instituciones locales" o variaciones.
- "Conocimiento específico de [institución local]" como muletilla.
- Repetir la misma dirección o institución más de UNA vez en todo el contenido.
- Comenzar todos los párrafos con la misma estructura gramatical.
- Frases que funcionan igual cambiando la ciudad: "contar con un abogado especializado marca la diferencia", "la normativa vigente establece", etc.
- Listas interminables de servicios sin profundizar en ninguno.

EN SU LUGAR, escribe así:
- Varía la estructura: datos, preguntas retóricas, escenarios prácticos (hipotéticos pero realistas).
- Sé CONCRETO cuando tengas datos verificados. Sé PRUDENTE (genérico con naturalidad) cuando no los tengas.
- Cada sección aporta información DISTINTA. No reformules la misma idea.
- Tono de profesional cercano: serio pero accesible, técnico pero comprensible.
- Incluye matices locales REALES solo si la evidencia los respalda.
- La long_description debe leerse como un artículo editorial, no como un folleto.

═══════════════════════════════════════════
FORMATO HTML DEL CONTENIDO:
═══════════════════════════════════════════

IMPORTANTE: Los campos de texto largo (long_description_es, y el campo "content" dentro de sections_es y faqs_es.answer)
deben entregarse en HTML semántico limpio, listo para insertar en una página web.

Etiquetas HTML permitidas y su uso:
- <h2>Subtítulo principal</h2> — para encabezados de sección dentro de long_description_es
- <h3>Subtítulo secundario</h3> — para sub-apartados
- <p>Texto de párrafo</p> — para cada párrafo de texto
- <strong>texto en negrita</strong> — para enfatizar conceptos clave (úsalo con moderación, máximo 2-3 por sección)
- <em>texto en cursiva</em> — para términos jurídicos o énfasis suave
- <ul><li>Elemento</li></ul> — para listas con viñetas (solo cuando realmente aporte claridad, no por defecto)
- <ol><li>Elemento</li></ol> — para listas numeradas
- <blockquote><p>Cita o destacado</p></blockquote> — para destacar un dato o cita relevante (máximo 1 por long_description)

PROHIBIDO en HTML:
- Clases CSS, estilos inline, atributos id, data-*, onclick, etc.
- Etiquetas <div>, <span>, <section>, <article>, <header>, <footer>
- Etiquetas <img>, <a>, <script>, <style>, <iframe>
- Atributos class="", style="", id=""
- HTML vacío o etiquetas sin contenido
- Anidar <p> dentro de <p>

El HTML debe ser SEMÁNTICO PURO: solo estructura, sin presentación. La web aplicará sus propios estilos.

Ejemplo de formato correcto para long_description_es:
"<h2>El derecho de familia en Cartagena</h2><p>Los procesos de separación y divorcio en el partido judicial de Cartagena presentan particularidades...</p><p>Uno de los aspectos más relevantes es la determinación de la custodia...</p><h3>Régimen de visitas y pensión compensatoria</h3><p>Cuando existe desacuerdo entre las partes...</p>"

Ejemplo de formato correcto para sections_es[].content:
"<p>La mediación familiar ofrece una alternativa eficaz al procedimiento contencioso...</p><p>En la práctica, <strong>más del 60% de las mediaciones</strong> alcanzan un acuerdo satisfactorio para ambas partes.</p>"

Campos que NO llevan HTML (texto plano):
- title_es, meta_description_es, short_description_es — texto plano puro
- process_es[] — cada paso es texto plano
- faqs_es[].question — texto plano
- local_entities — todos los campos en texto plano

═══════════════════════════════════════════
FORMATO DE SALIDA JSON:
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
    ? `CONTENIDO PREVIO (reescríbelo completamente con un enfoque fresco; NO copies estructuras ni frases):\n${existingSpanish.long_description_es}\n`
    : '';

  const evidenceText = evidence
    .map((e, idx) => `#${idx + 1}\nquery: ${e.query}\ntitle: ${e.title}\nurl: ${e.link}\nsnippet: ${e.snippet}`.trim())
    .join('\n\n');

  return normalizeText(`
CONTEXTO:
- Ciudad: ${locality.name}
- Provincia: ${locality.province || '(misma)'}
- Área legal: ${service.name_es} (clave: ${service.service_key})
- Slug para la URL: ${slug_es}

${existingBlock}

═══ EVIDENCIA SERP ═══
Usa EXCLUSIVAMENTE esta evidencia para extraer instituciones, direcciones, y datos locales.
TODO lo que no esté aquí, NO EXISTE para ti. No extrapoles, no deduzcas, no inventes.

${evidenceText || '(sin evidencia disponible — sé completamente genérico en referencias locales)'}

═══ QUÉ NECESITO ═══

A) LOCAL_ENTITIES (array):
   Solo entidades que aparezcan con nombre EXACTO en la evidencia anterior.
   Campos: entity_type (court|hospital|police|registry|government|road|mediation_center|other), name, source_url.
   Opcionales SOLO si están en evidencia: address, phone, website, notes.
   REGLA DE ORO: si dudas sobre si un dato es exacto → NO lo incluyas.
   Mejor tener 2 entidades verificadas que 8 inventadas.

B) CONTENIDO SEO — Piensa como un socio del bufete que escribe un artículo para el blog del despacho sobre su experiencia en ${service.name_es} en ${locality.name}:

   title_es (máx 65 caracteres):
   - Debe ser atractivo y específico, no un título genérico.

   meta_description_es (máx 155 caracteres, sin emojis):
   - Una propuesta de valor clara y concisa.

   short_description_es (260-320 caracteres):
   - 2-3 frases que enganchen. No repitas el título.

   long_description_es (900-1400 palabras, EN HTML SEMÁNTICO):
   - Escríbelo como un ARTÍCULO EDITORIAL, no como un catálogo de servicios.
   - Formato: HTML limpio con <h2>, <h3>, <p>, <strong>, <em>, <ul>/<ol>/<li>, <blockquote>. SIN clases CSS, SIN atributos style/id/class, SIN <div>/<span>/<a>/<img>.
   - PROHIBIDO: repetir direcciones, repetir instituciones más de una vez, muletillas como "la tramitación requiere conocimiento de las instituciones locales".
   - Cada párrafo (<p>) debe aportar información NUEVA.
   - Integra las referencias locales de forma NATURAL y DISTRIBUIDA, no acumuladas al principio.
   - Incluye al menos un ejemplo práctico o escenario realista (sin dar asesoramiento personalizado).
   - Varía las estructuras: no empieces 3 párrafos seguidos con la misma construcción gramatical.
   - Usa <strong> con moderación (máximo 3-4 en toda la long_description) para resaltar conceptos clave.
   - Usa máximo 1 <blockquote> para destacar un dato especialmente relevante.

   sections_es (EXACTAMENTE 4 objetos {title, content}):
   - title: texto plano (sin HTML).
   - content: HTML semántico limpio (mismas reglas que long_description: <p>, <strong>, <em>, <ul>/<li>, etc. Sin clases ni atributos).
   - Cada sección debe cubrir un ÁNGULO DIFERENTE del servicio en esa ciudad.
   - NO repitas información de long_description_es; cada sección profundiza en un tema distinto.
   - Títulos creativos y específicos, no genéricos (mal: "Nuestros servicios"; bien: "Custodia compartida en ${locality.name}: lo que dice la jurisprudencia local").
   - Contenido sustancial: 150-250 palabras por sección.

   process_es (EXACTAMENTE 6 strings):
   - 6 pasos del proceso de trabajo, claros y concretos.
   - Evita lenguaje corporativo vacío. Cada paso debe ser una acción real y entendible.

   faqs_es (EXACTAMENTE 6 objetos {question, answer}):
   - question: texto plano (sin HTML).
   - answer: HTML semántico limpio (<p>, <strong>, <em>, <ul>/<li>). Para respuestas cortas, un solo <p> es suficiente.
   - Preguntas que un cliente REAL haría, específicas de ${locality.name} cuando sea posible.
   - Respuestas de 60-120 palabras, útiles y directas.
   - NO preguntas genéricas que sirvan para cualquier ciudad española.

C) QUALITY:
   - score (0-100): Puntúa con honestidad. Si la evidencia era pobre y tuviste que ser genérico, baja la nota.
   - notes: 1-2 frases justificando.

═══ CHECKLIST FINAL (verifica antes de responder) ═══
□ ¿Alguna dirección que mencionas NO aparece literalmente en la evidencia? → Elimínala.
□ ¿Algún juzgado/institución que nombras NO está textualmente en la evidencia? → Elimínalo o hazlo genérico.
□ ¿Hay frases que funcionarían igual cambiando "${locality.name}" por cualquier otra ciudad? → Reescríbelas con más especificidad o elimínalas.
□ ¿Repites la misma idea en dos sitios diferentes? → Elimina una de las dos.
□ ¿Has usado "consulta gratuita", "gratis" o "gratuita"? → Prohibido.
□ ¿La long_description suena como un artículo de revista jurídica o como un folleto? → Debe sonar a artículo.
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

const REPETITIVE_PATTERNS = [
  /la tramitación requiere conocimiento/gi,
  /conocimiento de las instituciones locales/gi,
  /conocimientos? específicos? de/gi,
  /contar con un abogado especializado marca la diferencia/gi,
  /la normativa vigente establece/gi,
  /nuestro equipo de profesionales/gi,
  /profesionales altamente cualificados/gi,
  /amplia experiencia en el sector/gi,
];

function detectRepetitivePatterns(text: string): string[] {
  const warnings: string[] = [];
  for (const re of REPETITIVE_PATTERNS) {
    re.lastIndex = 0;
    const matches = text.match(re);
    if (matches && matches.length > 0) {
      warnings.push(`Patrón repetitivo detectado (${matches.length}x): "${matches[0]}"`);
    }
  }
  return warnings;
}

function countAddressRepetitions(text: string): number {
  const addressPatterns = [
    /(?:calle|c\/|avda\.?|avenida|plaza|paseo|ronda)\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]+(?:\d+|s\/n)/gi,
  ];
  let totalMatches = 0;
  for (const re of addressPatterns) {
    const matches = text.match(re);
    if (matches) {
      const unique = new Set(matches.map(m => m.toLowerCase().trim()));
      for (const addr of unique) {
        const count = matches.filter(m => m.toLowerCase().trim() === addr).length;
        if (count > 1) totalMatches += count - 1;
      }
    }
  }
  return totalMatches;
}

function validateEntityAgainstEvidence(
  entity: GeneratedPayload['local_entities'][number],
  evidence: Array<{ title: string; link: string; snippet: string }>
): boolean {
  const name = entity.name.toLowerCase();
  return evidence.some(
    (e) => e.title.toLowerCase().includes(name) || e.snippet.toLowerCase().includes(name) || e.link.toLowerCase().includes(name)
  );
}

function validatePayload(p: GeneratedPayload, evidence?: Array<{ title: string; link: string; snippet: string }>) {
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

  const fullText = [
    p.long_description_es,
    p.short_description_es,
    ...p.sections_es.map((s) => `${s.title} ${s.content}`),
    ...p.faqs_es.map((f) => `${f.question} ${f.answer}`),
  ].join(' ');

  const repetitiveWarnings = detectRepetitivePatterns(fullText);
  if (repetitiveWarnings.length > 0) {
    console.warn(`⚠️  Patrones repetitivos encontrados:\n${repetitiveWarnings.map(w => `   - ${w}`).join('\n')}`);
  }

  const addressRepeats = countAddressRepetitions(fullText);
  if (addressRepeats > 0) {
    console.warn(`⚠️  Direcciones repetidas ${addressRepeats} veces en el contenido. Considerar regenerar.`);
  }

  if (evidence && p.local_entities.length > 0) {
    const unverified = p.local_entities.filter((e) => !validateEntityAgainstEvidence(e, evidence));
    if (unverified.length > 0) {
      console.warn(`⚠️  ${unverified.length} entidades NO verificadas en evidencia SERP:`);
      for (const u of unverified) {
        console.warn(`   - [${u.entity_type}] "${u.name}" (fuente: ${u.source_url})`);
      }
      p.local_entities = p.local_entities.filter((e) => validateEntityAgainstEvidence(e, evidence));
      console.warn(`   → Entidades filtradas. Quedan ${p.local_entities.length} verificadas.`);
    }
  }
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
        validatePayload(payload, evidence);
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

