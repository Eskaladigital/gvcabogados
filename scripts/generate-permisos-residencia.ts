/**
 * Generador de contenido para el servicio "Permisos de Residencia" (extranjería).
 * Usa utilidades compartidas de ./lib/generate-utils y runGenerator().
 *
 * IMPORTANTE: El serviceKey en Supabase es 'extranjeria', no 'permisos-residencia'.
 *
 * Uso:
 *   tsx scripts/generate-permisos-residencia.ts
 *
 * Flags:
 *   --locality=<slug|all>   (default: all)
 *   --force=true|false      (default: false)
 *   --dry-run=true|false    (default: false)
 *   --limit=<n>             (default: 0 sin límite)
 *   --verbose=true|false    (default: true)
 *   --model=<openai_model>   (default: gpt-4.1)
 *   --max-tokens=<n>        (default: 4500)
 */

import {
  runGenerator,
  baseSerpQueries,
  baseSystemPrompt,
  type LocalityRow,
  type ServiceRow,
  type EvidenceItem,
  type BasePayload,
  normalizeText,
} from './lib/generate-utils';

const SERVICE_KEY = 'extranjeria';

function buildSerpQueries(locality: LocalityRow): string[] {
  const base = baseSerpQueries(locality);
  const specific = [
    `Oficina de Extranjería ${locality.name}`,
    `cita previa extranjería ${locality.name}`,
    `comisaría expedición TIE ${locality.name}`,
    `Subdelegación del Gobierno ${locality.name}`,
    `ONG ayuda inmigrantes ${locality.name}`,
  ];
  return [...base, ...specific];
}

function buildSystemPrompt(): string {
  const base = baseSystemPrompt();
  const extension = normalizeText(`
═══════════════════════════════════════════
ESPECÍFICO: PERMISOS DE RESIDENCIA / EXTRANJERÍA
═══════════════════════════════════════════

TONO: Útil, práctico y comprensivo con la complejidad de los procesos de inmigración. Los trámites de extranjería son exigentes y a menudo confusos. Escribe con claridad, orientación práctica y empatía hacia las personas que buscan regularizar su situación.

CUSTOM_SECTIONS_ES (obligatorio para este servicio):

Debes incluir en custom_sections_es exactamente estas claves:

1. tipos_permiso: array de objetos {titulo, descripcion, icon}
   - Tipos de permisos de residencia más habituales.
   - Incluir: arraigo social, arraigo laboral, residencia no lucrativa, reagrupación familiar, trabajo por cuenta ajena, estudiante.
   - icon: nombre de icono (ej: "home", "briefcase", "wallet", "family", "user", "graduation").
   - Mínimo 5, máximo 6 elementos.

2. documentacion: array de objetos {paso, titulo, descripcion}
   - Documentación requerida y pasos para tramitar permisos de residencia.
   - paso: número (1, 2, 3...).
   - titulo: título breve del paso.
   - descripcion: texto explicativo.
   - Mínimo 5, máximo 7 elementos.

3. stats: array de objetos {value, label}
   - Estadísticas relevantes sobre inmigración y permisos de residencia en España.
   - Exactamente 4 elementos.
   - value: número o texto (ej: "85%", "500.000").
   - label: descripción breve.

4. intro: string (HTML, opcional)
   - Texto introductorio localizado para la ciudad.
   - Usa <p>, <strong>, <em>. Sin clases ni estilos.

PROHIBIDO: "consulta gratuita", "gratuita", "gratis". PERMITIDO: "primera consulta sin compromiso".
`);
  return `${base}\n\n${extension}`;
}

function buildUserPrompt(
  locality: LocalityRow,
  service: ServiceRow,
  evidence: EvidenceItem[],
  existing: any
): string {
  const evidenceText = evidence
    .map((e, idx) => `#${idx + 1}\nquery: ${e.query}\ntitle: ${e.title}\nurl: ${e.link}\nsnippet: ${e.snippet}`.trim())
    .join('\n\n');

  const existingBlock = existing?.long_description_es
    ? `\nCONTENIDO PREVIO (reescríbelo con enfoque fresco; NO copies estructuras):\n${existing.long_description_es}\n`
    : '';

  return normalizeText(`
CONTEXTO:
- Ciudad: ${locality.name}
- Provincia: ${locality.province || '(misma)'}
- Servicio: ${service.name_es} (${service.service_key})

${existingBlock}

═══ EVIDENCIA SERP ═══
Usa EXCLUSIVAMENTE esta evidencia para extraer instituciones, direcciones y datos locales.
Todo lo que no esté aquí, NO EXISTE. No extrapoles, no deduzcas, no inventes.

${evidenceText || '(sin evidencia — sé completamente genérico en referencias locales)'}

═══ ESTRUCTURA JSON REQUERIDA ═══

Devuelve un JSON con estas claves exactas:

- title_es (máx 65 caracteres)
- meta_description_es (máx 180 caracteres)
- short_description_es (260-320 caracteres)
- long_description_es (HTML semántico: <h2>, <h3>, <p>, <strong>, <em>, <ul>/<ol>/<li>, <blockquote>)
- sections_es: EXACTAMENTE 4 objetos {title, content} — content en HTML
- process_es: EXACTAMENTE 6 strings (pasos del proceso)
- faqs_es: EXACTAMENTE 6 objetos {question, answer} — answer en HTML
- custom_sections_es: objeto con:
  - tipos_permiso: array de {titulo, descripcion, icon}
  - documentacion: array de {paso, titulo, descripcion}
  - stats: array de {value, label} (4 elementos)
  - intro: string HTML opcional
- local_entities: array (solo entidades con nombre EXACTO en evidencia)
- quality: {score: 0-100, notes?: string}

REGLAS:
- PROHIBIDO: "consulta gratuita", "gratuita", "gratis". Permitido: "primera consulta sin compromiso".
- sections_es, process_es y faqs_es deben ser específicos de permisos de residencia y extranjería en ${locality.name}.
- custom_sections_es es OBLIGATORIO con tipos_permiso y documentacion.
- Tono: útil, práctico, comprensivo con la complejidad de los procesos de inmigración.
`);
}

function validateCustom(payload: BasePayload): void {
  if (!Array.isArray(payload.sections_es) || payload.sections_es.length !== 4) {
    throw new Error('sections_es debe tener exactamente 4 secciones');
  }
  if (!Array.isArray(payload.process_es) || payload.process_es.length !== 6) {
    throw new Error('process_es debe tener exactamente 6 pasos');
  }
  if (!Array.isArray(payload.faqs_es) || payload.faqs_es.length !== 6) {
    throw new Error('faqs_es debe tener exactamente 6 FAQs');
  }

  const custom = payload.custom_sections_es;
  if (!custom || typeof custom !== 'object') {
    throw new Error('custom_sections_es es obligatorio y debe ser un objeto');
  }
  if (!Array.isArray(custom.tipos_permiso)) {
    throw new Error('custom_sections_es debe incluir tipos_permiso (array)');
  }
  if (!Array.isArray(custom.documentacion)) {
    throw new Error('custom_sections_es debe incluir documentacion (array)');
  }
  if (custom.tipos_permiso.length < 5) {
    throw new Error('tipos_permiso debe tener al menos 5 elementos');
  }
  if (custom.documentacion.length < 5) {
    throw new Error('documentacion debe tener al menos 5 elementos');
  }
  if (Array.isArray(custom.stats) && custom.stats.length !== 4) {
    throw new Error('stats debe tener exactamente 4 elementos');
  }
}

runGenerator({
  serviceKey: SERVICE_KEY,
  buildSerpQueries,
  buildSystemPrompt,
  buildUserPrompt,
  validateCustom,
}).catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
