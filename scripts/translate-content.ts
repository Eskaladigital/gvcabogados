/**
 * Traduce el contenido ES → EN de la tabla service_content en Supabase.
 * Lee las columnas _es y genera las columnas _en equivalentes usando OpenAI.
 *
 * Traduce: title_en, meta_description_en, short_description_en, long_description_en,
 *          sections_en, process_en, faqs_en, custom_sections_en.
 *
 * Uso:
 *   tsx scripts/translate-content.ts
 *
 * Flags:
 *   --service=<service_key|all>  (default: all)
 *   --locality=<slug|all>        (default: all)
 *   --force=true|false            (default: false) Retraduce aunque ya exista _en
 *   --dry-run=true|false          (default: false)
 *   --limit=<n>                   (default: 0, sin límite)
 *   --model=<openai_model>        (default: gpt-4.1-mini)
 *   --verbose=true|false          (default: true)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Faltan variables de Supabase');
if (!OPENAI_API_KEY) throw new Error('Falta OPENAI_API_KEY');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (const raw of argv.slice(2)) {
    const [k, ...rest] = raw.split('=');
    if (!k.startsWith('--')) continue;
    args[k.slice(2)] = rest.join('=') || 'true';
  }
  return {
    service: (args.service || 'all').trim(),
    locality: (args.locality || 'all').trim(),
    force: (args.force || 'false').toLowerCase() === 'true',
    dryRun: (args['dry-run'] || 'false').toLowerCase() === 'true',
    limit: Number.parseInt(args.limit || '0', 10) || 0,
    model: (args.model || '').trim() || DEFAULT_MODEL,
    verbose: (args.verbose || 'true').toLowerCase() === 'true',
  };
}

function ts() {
  return new Date().toISOString().slice(11, 19);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const SYSTEM_PROMPT = `You are a professional legal translator specializing in Spanish law, translating from Spanish to English for a premium law firm website.

RULES:
1. Translate ALL text content accurately, maintaining the professional legal tone.
2. Keep HTML tags exactly as they are (<h2>, <h3>, <p>, <strong>, <em>, <ul>, <ol>, <li>, <blockquote>). Translate ONLY the text between tags.
3. Do NOT translate proper nouns (names of courts, institutions, streets, cities — keep them in Spanish).
4. Spanish law references: keep the original name and add English translation in parentheses on first mention.
5. NEVER use "free consultation" or "free". Use "no-obligation initial consultation" instead.
6. Use British/American legal terminology where appropriate.
7. Maintain the same length and depth as the original.
8. Return ONLY the translated content, nothing else (no markdown, no explanations).`;

const CUSTOM_SECTIONS_PROMPT = `You are a professional legal translator. Translate the following JSON object from Spanish to English for a law firm website.

RULES:
1. Translate all text values (titulo → title equivalent, descripcion → description equivalent, label, etc.)
2. Keep the EXACT SAME JSON structure and keys — do NOT rename keys.
3. Keep proper nouns in Spanish (court names, institution names, street names, cities).
4. NEVER use "free consultation" or "free". Use "no-obligation initial consultation".
5. Keep numeric values and icons unchanged.
6. Return ONLY valid JSON, nothing else.`;

interface TranslatedContent {
  title_en: string;
  meta_description_en: string;
  short_description_en: string;
  long_description_en: string;
  sections_en: Array<{ title: string; content: string }>;
  process_en: string[];
  faqs_en: Array<{ question: string; answer: string }>;
  custom_sections_en: Record<string, any> | null;
}

async function translateField(text: string, fieldType: string, model: string): Promise<string> {
  const maxTokens: Record<string, number> = {
    title: 200,
    meta: 300,
    short: 500,
    long: 4500,
    sections: 4500,
    process: 1000,
    faqs: 4000,
    custom: 4000,
  };

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: fieldType === 'custom' ? CUSTOM_SECTIONS_PROMPT : SYSTEM_PROMPT },
      { role: 'user', content: text },
    ],
    max_tokens: maxTokens[fieldType] || 2000,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content?.trim() || '';
}

async function translateRow(row: any, model: string, verbose: boolean): Promise<TranslatedContent> {
  // 1. Title
  if (verbose) console.log('    Traduciendo title...');
  const title_en = await translateField(
    `Translate this legal page title to English (max 65 chars):\n${row.title_es}`,
    'title',
    model
  );

  // 2. Meta description
  if (verbose) console.log('    Traduciendo meta_description...');
  const meta_description_en = await translateField(
    `Translate this meta description to English (max 155 chars, SEO-friendly):\n${row.meta_description_es}`,
    'meta',
    model
  );

  // 3. Short description
  if (verbose) console.log('    Traduciendo short_description...');
  const short_description_en = await translateField(
    `Translate this short description to English (260-320 chars):\n${row.short_description_es}`,
    'short',
    model
  );

  // 4. Long description (HTML)
  if (verbose) console.log('    Traduciendo long_description...');
  const long_description_en = await translateField(
    `Translate this HTML legal content to English. Keep all HTML tags intact:\n\n${row.long_description_es}`,
    'long',
    model
  );

  // 5. Sections (array of {title, content})
  if (verbose) console.log('    Traduciendo sections...');
  const sectionsRaw = await translateField(
    `Translate this JSON array of legal content sections to English. Each object has "title" (plain text) and "content" (HTML). Keep HTML tags intact. Return ONLY a valid JSON array:\n\n${JSON.stringify(row.sections_es)}`,
    'sections',
    model
  );
  let sections_en: Array<{ title: string; content: string }>;
  try {
    sections_en = JSON.parse(sectionsRaw);
  } catch {
    const start = sectionsRaw.indexOf('[');
    const end = sectionsRaw.lastIndexOf(']');
    sections_en = JSON.parse(sectionsRaw.slice(start, end + 1));
  }

  // 6. Process (array of strings)
  if (verbose) console.log('    Traduciendo process...');
  const processRaw = await translateField(
    `Translate this JSON array of legal process steps to English. Return ONLY a valid JSON array of strings:\n\n${JSON.stringify(row.process_es)}`,
    'process',
    model
  );
  let process_en: string[];
  try {
    process_en = JSON.parse(processRaw);
  } catch {
    const start = processRaw.indexOf('[');
    const end = processRaw.lastIndexOf(']');
    process_en = JSON.parse(processRaw.slice(start, end + 1));
  }

  // 7. FAQs (array of {question, answer})
  if (verbose) console.log('    Traduciendo faqs...');
  const faqsRaw = await translateField(
    `Translate this JSON array of legal FAQs to English. Each object has "question" (plain text) and "answer" (HTML). Keep HTML tags intact. Return ONLY a valid JSON array:\n\n${JSON.stringify(row.faqs_es)}`,
    'faqs',
    model
  );
  let faqs_en: Array<{ question: string; answer: string }>;
  try {
    faqs_en = JSON.parse(faqsRaw);
  } catch {
    const start = faqsRaw.indexOf('[');
    const end = faqsRaw.lastIndexOf(']');
    faqs_en = JSON.parse(faqsRaw.slice(start, end + 1));
  }

  // 8. Custom sections (JSONB, estructura libre)
  let custom_sections_en: Record<string, any> | null = null;
  if (row.custom_sections_es && Object.keys(row.custom_sections_es).length > 0) {
    if (verbose) console.log('    Traduciendo custom_sections...');
    const customRaw = await translateField(
      `Translate this JSON object to English. Keep the same keys, translate all text values:\n\n${JSON.stringify(row.custom_sections_es)}`,
      'custom',
      model
    );
    try {
      custom_sections_en = JSON.parse(customRaw);
    } catch {
      const start = customRaw.indexOf('{');
      const end = customRaw.lastIndexOf('}');
      custom_sections_en = JSON.parse(customRaw.slice(start, end + 1));
    }
  }

  return {
    title_en,
    meta_description_en,
    short_description_en,
    long_description_en,
    sections_en,
    process_en,
    faqs_en,
    custom_sections_en,
  };
}

function validateTranslation(t: TranslatedContent): void {
  if (!t.title_en) throw new Error('title_en vacío');
  if (!t.long_description_en) throw new Error('long_description_en vacío');
  if (!Array.isArray(t.sections_en) || t.sections_en.length === 0) throw new Error('sections_en vacío o no es array');
  if (!Array.isArray(t.process_en) || t.process_en.length === 0) throw new Error('process_en vacío o no es array');
  if (!Array.isArray(t.faqs_en) || t.faqs_en.length === 0) throw new Error('faqs_en vacío o no es array');

  const dump = JSON.stringify(t).toLowerCase();
  if (dump.includes('free consultation') || dump.includes('free legal')) {
    throw new Error('Traducción contiene "free consultation" — prohibido');
  }
}

async function main() {
  const args = parseArgs(process.argv);
  console.log(`\n[${ts()}] === Traductor service_content ES → EN ===`);
  console.log(`[${ts()}] Modelo: ${args.model} | force: ${args.force} | dry-run: ${args.dryRun} | limit: ${args.limit || '∞'}`);

  // Build query
  let query = supabase
    .from('service_content')
    .select('*, services!inner(service_key), localities!inner(name, slug)')
    .order('slug_es');

  if (args.service !== 'all') {
    query = query.eq('services.service_key', args.service);
  }
  if (args.locality !== 'all') {
    query = query.eq('localities.slug', args.locality);
  }
  if (!args.force) {
    query = query.is('title_en', null);
  }

  const { data: rows, error } = await query;
  if (error) throw new Error(`Error consultando service_content: ${error.message}`);
  if (!rows || rows.length === 0) {
    console.log(`[${ts()}] No hay filas pendientes de traducción.`);
    return;
  }

  const total = args.limit > 0 ? Math.min(rows.length, args.limit) : rows.length;
  console.log(`[${ts()}] Filas a traducir: ${total} (de ${rows.length} encontradas)\n`);

  let translated = 0;
  let failed = 0;

  for (let i = 0; i < total; i++) {
    const row = rows[i];
    const sk = (row.services as any).service_key;
    const city = (row.localities as any).name;

    console.log(`[${ts()}] (${i + 1}/${total}) ${sk} · ${city}`);

    if (!row.long_description_es) {
      console.log('  Skip: sin contenido ES');
      continue;
    }

    try {
      const t = await translateRow(row, args.model, args.verbose);
      validateTranslation(t);

      if (args.verbose) {
        console.log(`  title_en: ${t.title_en.substring(0, 70)}...`);
        console.log(`  sections: ${t.sections_en.length} | faqs: ${t.faqs_en.length} | process: ${t.process_en.length}`);
        console.log(`  custom_sections_en: ${t.custom_sections_en ? Object.keys(t.custom_sections_en).join(', ') : 'null'}`);
      }

      if (!args.dryRun) {
        const { error: upErr } = await supabase
          .from('service_content')
          .update({
            title_en: t.title_en,
            meta_description_en: t.meta_description_en,
            short_description_en: t.short_description_en,
            long_description_en: t.long_description_en,
            sections_en: t.sections_en,
            process_en: t.process_en,
            faqs_en: t.faqs_en,
            custom_sections_en: t.custom_sections_en,
            translation_status: 'translated',
          })
          .eq('id', row.id);

        if (upErr) throw new Error(`Error actualizando: ${upErr.message}`);
      }

      translated++;
      console.log(`  OK ${args.dryRun ? '[dry-run]' : ''}\n`);
    } catch (err: any) {
      failed++;
      console.error(`  ERROR: ${err?.message || err}\n`);
    }

    await sleep(500);
  }

  console.log('='.repeat(50));
  console.log('RESUMEN TRADUCCIÓN');
  console.log(`Traducidas: ${translated} | Fallidas: ${failed} | Total procesadas: ${total}`);
  console.log('='.repeat(50) + '\n');
}

main().catch((e) => {
  console.error('\nError fatal:', e);
  process.exit(1);
});
