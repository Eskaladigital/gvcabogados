/**
 * Utilidades compartidas para los scripts de generación de contenido por servicio.
 * SERP API, OpenAI, Supabase, validación, upsert.
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SERP_API_KEY = process.env.SERP_API_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Faltan variables de Supabase');
if (!SERP_API_KEY) throw new Error('Falta SERP_API_KEY');
if (!OPENAI_API_KEY) throw new Error('Falta OPENAI_API_KEY');

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1';
export const DEFAULT_MAX_TOKENS = Number.parseInt(process.env.OPENAI_MAX_TOKENS || '4500', 10);
export const DEFAULT_TEMPERATURE = Number.parseFloat(process.env.OPENAI_TEMPERATURE || '0.6');

// ─── Types ───────────────────────────────────────────────

export type LocalityRow = { id: string; name: string; slug: string; province: string | null };
export type ServiceRow = { id: string; service_key: string; name_es: string; name_en: string | null };

export type SerpResult = { title: string; link: string; snippet: string };
export type EvidenceItem = { query: string; title: string; link: string; snippet: string };

export type EntityType = 'court' | 'hospital' | 'police' | 'registry' | 'government' | 'road' | 'mediation_center' | 'other';

export type LocalEntity = {
  entity_type: EntityType;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  notes?: string;
  source_url: string;
};

export type BasePayload = {
  title_es: string;
  meta_description_es: string;
  short_description_es: string;
  long_description_es: string;
  sections_es: Array<{ title: string; content: string }>;
  process_es: string[];
  faqs_es: Array<{ question: string; answer: string }>;
  custom_sections_es: Record<string, any>;
  local_entities: LocalEntity[];
  quality: { score: number; notes?: string };
};

// ─── CLI Args ────────────────────────────────────────────

export function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (const raw of argv.slice(2)) {
    const [k, ...rest] = raw.split('=');
    if (!k.startsWith('--')) continue;
    args[k.slice(2)] = rest.join('=') || 'true';
  }
  return {
    locality: (args.locality || 'all').trim(),
    force: (args.force || 'false').toLowerCase() === 'true',
    dryRun: (args['dry-run'] || 'false').toLowerCase() === 'true',
    limit: Number.parseInt(args.limit || '0', 10) || 0,
    verbose: (args.verbose || 'true').toLowerCase() === 'true',
    model: (args.model || '').trim() || DEFAULT_MODEL,
    maxTokens: Number.parseInt(args['max-tokens'] || '', 10) || DEFAULT_MAX_TOKENS,
  };
}

export type ScriptArgs = ReturnType<typeof parseArgs>;

// ─── Helpers ─────────────────────────────────────────────

export function ts() {
  return new Date().toISOString().slice(11, 19);
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function normalizeText(s: string) {
  return s.replace(/\s+/g, ' ').trim();
}

// ─── SERP ────────────────────────────────────────────────

export async function serpSearch(q: string): Promise<SerpResult[]> {
  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google');
  url.searchParams.set('q', q);
  url.searchParams.set('api_key', SERP_API_KEY);
  url.searchParams.set('hl', 'es');
  url.searchParams.set('gl', 'es');
  url.searchParams.set('num', '10');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`SERP error (${res.status})`);
  const json = await res.json();
  return (json.organic_results || []).map((r: any) => ({
    title: normalizeText(r.title || ''),
    link: r.link || '',
    snippet: normalizeText(r.snippet || ''),
  }));
}

export async function runSerpQueries(queries: string[], verbose: boolean): Promise<EvidenceItem[]> {
  const items: EvidenceItem[] = [];
  for (const q of queries) {
    const t0 = Date.now();
    const results = await serpSearch(q);
    if (verbose) console.log(`  SERP (${Date.now() - t0}ms) ${results.length} results: ${q}`);
    for (const r of results) {
      items.push({ query: q, ...r });
    }
    await sleep(1100);
  }
  const seen = new Set<string>();
  return items.filter((it) => {
    if (seen.has(it.link)) return false;
    seen.add(it.link);
    return true;
  }).slice(0, 30);
}

// ─── OpenAI ──────────────────────────────────────────────

export async function callOpenAI(systemPrompt: string, userPrompt: string, args: ScriptArgs): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: args.model,
    temperature: DEFAULT_TEMPERATURE,
    max_tokens: args.maxTokens,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  const text = completion.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('OpenAI no devolvió contenido.');
  if (args.verbose) {
    const u = completion.usage as any;
    console.log(`  OpenAI tokens: prompt=${u?.prompt_tokens ?? '—'} completion=${u?.completion_tokens ?? '—'}`);
  }
  return text;
}

export function safeJsonParse<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(raw.slice(start, end + 1)) as T;
    throw new Error('JSON inválido');
  }
}

// ─── Validation ──────────────────────────────────────────

const FORBIDDEN = [/consulta\s+gratuita/gi, /free\s+consultation/gi, /\bgratuita\b/gi, /\bgratis\b/gi];

export function validateBasePayload(p: BasePayload) {
  if (!p.title_es || !p.meta_description_es || !p.long_description_es) {
    throw new Error('Payload incompleto: faltan campos principales');
  }
  if (p.meta_description_es.length > 180) {
    throw new Error('meta_description_es demasiado larga (>180)');
  }
  const dump = JSON.stringify(p);
  if (FORBIDDEN.some((re) => re.test(dump))) {
    throw new Error('Contenido contiene frases prohibidas (gratuita/gratis)');
  }
}

export function validateEntityAgainstEvidence(entity: LocalEntity, evidence: EvidenceItem[]): boolean {
  const name = entity.name.toLowerCase();
  return evidence.some(
    (e) => e.title.toLowerCase().includes(name) || e.snippet.toLowerCase().includes(name)
  );
}

export function filterUnverifiedEntities(entities: LocalEntity[], evidence: EvidenceItem[], verbose: boolean): LocalEntity[] {
  const verified = entities.filter((e) => validateEntityAgainstEvidence(e, evidence));
  const removed = entities.length - verified.length;
  if (removed > 0 && verbose) {
    console.log(`  Filtradas ${removed} entidades no verificadas en evidencia SERP`);
  }
  return verified;
}

// ─── Supabase: load data ─────────────────────────────────

export async function loadLocalities(slugFilter: string): Promise<LocalityRow[]> {
  let query = supabase.from('localities').select('id,name,slug,province').eq('is_active', true).order('name');
  if (slugFilter !== 'all') query = query.eq('slug', slugFilter);
  const { data, error } = await query;
  if (error) throw new Error(`Error cargando localities: ${error.message}`);
  return data as LocalityRow[];
}

export async function loadService(serviceKey: string): Promise<ServiceRow> {
  const { data, error } = await supabase
    .from('services')
    .select('id,service_key,name_es,name_en')
    .eq('service_key', serviceKey)
    .single();
  if (error || !data) throw new Error(`Servicio '${serviceKey}' no encontrado: ${error?.message}`);
  return data as ServiceRow;
}

export async function getExistingContent(serviceId: string, localityId: string) {
  const { data, error } = await supabase
    .from('service_content')
    .select('*')
    .eq('service_id', serviceId)
    .eq('locality_id', localityId)
    .maybeSingle();
  if (error) throw new Error(`Error leyendo service_content: ${error.message}`);
  return data;
}

// ─── Supabase: upsert ────────────────────────────────────

export async function upsertContent(params: {
  serviceId: string;
  localityId: string;
  localitySlug: string;
  serviceKey: string;
  payload: BasePayload;
  existing: any;
  dryRun: boolean;
}) {
  const { serviceId, localityId, localitySlug, serviceKey, payload, existing, dryRun } = params;
  if (dryRun) { console.log('  [dry-run] No se escribe en Supabase'); return; }

  const slug_es = `abogados-${serviceKey}-${localitySlug}`;
  const slug_en = `${serviceKey}-lawyers-${localitySlug}`;

  const base: Record<string, any> = {
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
    custom_sections_es: payload.custom_sections_es,
    content_quality_score: payload.quality?.score ?? null,
    last_reviewed_at: new Date().toISOString(),
  };

  if (existing) {
    base.title_en = existing.title_en;
    base.meta_description_en = existing.meta_description_en;
    base.short_description_en = existing.short_description_en;
    base.long_description_en = existing.long_description_en;
    base.sections_en = existing.sections_en;
    base.process_en = existing.process_en;
    base.faqs_en = existing.faqs_en;
    base.custom_sections_en = existing.custom_sections_en;
    base.translation_status = existing.translation_status;
  }

  const { error } = await supabase.from('service_content').upsert(base, {
    onConflict: 'service_id,locality_id',
  });
  if (error) throw new Error(`Error upsert service_content: ${error.message}`);
}

export async function upsertLocalEntities(localityId: string, entities: LocalEntity[], dryRun: boolean) {
  if (entities.length === 0 || dryRun) return;

  const uniq = new Map<string, LocalEntity>();
  for (const e of entities) {
    const key = `${e.entity_type}::${e.name.toLowerCase().trim()}`;
    if (!uniq.has(key)) uniq.set(key, e);
  }

  const { data: existing } = await supabase
    .from('local_entities')
    .select('entity_type,name')
    .eq('locality_id', localityId);

  const existingSet = new Set((existing || []).map((r: any) => `${r.entity_type}::${r.name.toLowerCase().trim()}`));
  const toInsert = [...uniq.values()]
    .filter((e) => !existingSet.has(`${e.entity_type}::${e.name.toLowerCase().trim()}`))
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
  const { error } = await supabase.from('local_entities').insert(toInsert);
  if (error) throw new Error(`Error insertando local_entities: ${error.message}`);
}

// ─── Base SERP queries (comunes a todos los servicios) ───

export function baseSerpQueries(locality: LocalityRow): string[] {
  return [
    `Juzgados ${locality.name} dirección`,
    `Registro Civil ${locality.name}`,
    `Comisaría Policía Nacional ${locality.name}`,
    `Ayuntamiento ${locality.name} sede electrónica`,
  ];
}

// ─── System prompt base (reglas comunes) ─────────────────

export function baseSystemPrompt(): string {
  return normalizeText(`
Eres un abogado experto en comunicación jurídica y un redactor editorial de primer nivel. Tu trabajo es crear contenido web para un despacho de abogados premium en España que suene HUMANO, NATURAL y AUTORIZADO.

REGLAS ABSOLUTAS:
1. PROHIBIDO: "consulta gratuita", "gratuita", "gratis", "free consultation". Jamás. Puedes usar "primera consulta sin compromiso".
2. PRINCIPIO DE PRUDENCIA: NO COMETER ERRORES FACTUALES. Mejor ser genérico que inventar un dato.
   - Nombres de instituciones: SOLO si aparecen TEXTUALMENTE en la evidencia SERP.
   - Direcciones: SOLO si aparecen LETRA POR LETRA en la evidencia.
   - Teléfonos: SOLO si aparecen dígito a dígito.
   - Cuando no tengas evidencia: usa formulaciones genéricas naturales.
3. VERIFICACIÓN DE ENTIDADES: Solo incluir entidades que aparezcan con nombre EXACTO en evidencia SERP.

ESTILO:
- Varía la estructura: datos, preguntas retóricas, escenarios prácticos.
- Sé CONCRETO con datos verificados, PRUDENTE cuando no los tengas.
- Tono profesional cercano: serio pero accesible.
- NO repetir la misma información en secciones diferentes.
- NO muletillas como "la tramitación requiere conocimiento de las instituciones locales".

HTML PERMITIDO (para long_description_es, sections_es[].content, faqs_es[].answer):
<h2>, <h3>, <p>, <strong>, <em>, <ul>/<ol>/<li>, <blockquote>
PROHIBIDO: clases CSS, estilos inline, <div>, <span>, <a>, <img>, atributos class/style/id.

TEXTO PLANO (sin HTML): title_es, meta_description_es, short_description_es, process_es[], faqs_es[].question.

Devuelve SOLO JSON válido, sin markdown ni texto fuera del JSON.
`);
}

// ─── Runner genérico ─────────────────────────────────────

export type ServiceConfig = {
  serviceKey: string;
  buildSerpQueries: (locality: LocalityRow) => string[];
  buildSystemPrompt: () => string;
  buildUserPrompt: (locality: LocalityRow, service: ServiceRow, evidence: EvidenceItem[], existing: any) => string;
  validateCustom?: (payload: BasePayload) => void;
};

export async function runGenerator(config: ServiceConfig) {
  const args = parseArgs(process.argv);
  console.log(`\n[${ ts()}] === Generador: ${config.serviceKey} ===`);
  console.log(`[${ts()}] Modelo: ${args.model} | max_tokens: ${args.maxTokens} | dry-run: ${args.dryRun} | force: ${args.force}`);

  const service = await loadService(config.serviceKey);
  const localities = await loadLocalities(args.locality);
  console.log(`[${ts()}] Servicio: ${service.name_es} (${service.service_key})`);
  console.log(`[${ts()}] Localidades: ${localities.length}`);

  let processed = 0, created = 0, skipped = 0, failed = 0;

  for (const locality of localities) {
    if (args.limit > 0 && processed >= args.limit) break;
    processed++;

    try {
      const existing = await getExistingContent(service.id, locality.id);
      if (existing && !args.force) {
        skipped++;
        if (args.verbose) console.log(`  Skip: ${locality.name} (ya existe)`);
        continue;
      }

      console.log(`\n[${ts()}] (${processed}/${localities.length}) ${service.name_es} · ${locality.name}`);

      const queries = config.buildSerpQueries(locality);
      const evidence = await runSerpQueries(queries, args.verbose);
      console.log(`  Evidencia: ${evidence.length} URLs`);

      const systemP = config.buildSystemPrompt();
      const userP = config.buildUserPrompt(locality, service, evidence, existing);
      if (args.verbose) console.log(`  Prompt: ${userP.length.toLocaleString()} chars`);

      const t0 = Date.now();
      const raw = await callOpenAI(systemP, userP, args);
      console.log(`  OpenAI OK (${Date.now() - t0}ms)`);

      const payload = safeJsonParse<BasePayload>(raw);
      validateBasePayload(payload);
      if (config.validateCustom) config.validateCustom(payload);

      if (payload.local_entities) {
        payload.local_entities = filterUnverifiedEntities(payload.local_entities, evidence, args.verbose);
      }

      console.log(`  Validación OK | sections=${payload.sections_es?.length} faqs=${payload.faqs_es?.length} custom_keys=${Object.keys(payload.custom_sections_es || {}).join(',')}`);

      await upsertContent({
        serviceId: service.id,
        localityId: locality.id,
        localitySlug: locality.slug,
        serviceKey: config.serviceKey,
        payload,
        existing,
        dryRun: args.dryRun,
      });
      await upsertLocalEntities(locality.id, payload.local_entities || [], args.dryRun);

      created++;
      console.log(`  OK (${payload.quality?.score ?? '—'}/100)`);
    } catch (err: any) {
      failed++;
      console.error(`  ERROR: ${locality.name}: ${err?.message || err}`);
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESUMEN: ${config.serviceKey}`);
  console.log(`Procesadas: ${processed} | Creadas: ${created} | Omitidas: ${skipped} | Fallidas: ${failed}`);
  console.log(`${'='.repeat(50)}\n`);
}
