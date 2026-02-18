/**
 * Generador de contenido para el servicio "Responsabilidad de la Administración" / Derecho Administrativo.
 * Usa utilidades compartidas de ./lib/generate-utils y runGenerator().
 *
 * IMPORTANTE: El serviceKey en Supabase es 'derecho-administrativo' (clave antigua).
 *
 * Uso:
 *   tsx scripts/generate-responsabilidad-administracion.ts
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

const SERVICE_KEY = 'derecho-administrativo';

function buildSerpQueries(locality: LocalityRow): string[] {
  const base = baseSerpQueries(locality);
  const specific = [
    `Sede electrónica recursos administrativos ${locality.name}`,
    `Delegación del Gobierno ${locality.name}`,
    `BOP anuncios oficiales ${locality.name}`,
    `Tribunal Superior de Justicia ${locality.name}`,
    `contencioso-administrativo ${locality.name}`,
  ];
  return [...base, ...specific];
}

function buildSystemPrompt(): string {
  const base = baseSystemPrompt();
  const extension = normalizeText(`
═══════════════════════════════════════════
ESPECÍFICO: RESPONSABILIDAD DE LA ADMINISTRACIÓN / DERECHO ADMINISTRATIVO
═══════════════════════════════════════════

TONO: Autoritativo y preciso. Usa terminología jurídica correcta (recurso administrativo, vía contencioso-administrativa, responsabilidad patrimonial, silencio administrativo, etc.). Serio y profesional, sin dramatizar.

CUSTOM_SECTIONS_ES (obligatorio para este servicio):

Debes incluir en custom_sections_es exactamente estas claves:

1. tipos_responsabilidad: array de objetos {titulo, descripcion, icon}
   - Tipos de responsabilidad patrimonial de la Administración.
   - Incluir: sanitaria, vía pública, urbanismo, educativa, fuerzas de seguridad, funcionamiento de servicios públicos.
   - icon: nombre de icono (ej: "hospital", "road", "building", "school", "shield", "cog").
   - Mínimo 5, máximo 6 elementos.

2. plazos_recurso: array de objetos {tipo, plazo, descripcion}
   - Plazos para interponer recursos administrativos.
   - tipo: tipo de recurso (ej: "Recurso de alzada", "Recurso potestativo de reposición", "Reclamación previa").
   - plazo: plazo en días o texto (ej: "1 mes", "3 meses").
   - descripcion: breve explicación del plazo.
   - Mínimo 4, máximo 6 elementos.

3. stats: array de objetos {value, label}
   - Estadísticas relevantes sobre responsabilidad administrativa o contencioso-administrativo en España.
   - Exactamente 4 elementos.
   - value: número o texto (ej: "2 meses", "90%").
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
  - tipos_responsabilidad: array de {titulo, descripcion, icon}
  - plazos_recurso: array de {tipo, plazo, descripcion}
  - stats: array de {value, label} (4 elementos)
  - intro: string HTML opcional
- local_entities: array (solo entidades con nombre EXACTO en evidencia)
- quality: {score: 0-100, notes?: string}

REGLAS:
- PROHIBIDO: "consulta gratuita", "gratuita", "gratis". Permitido: "primera consulta sin compromiso".
- sections_es, process_es y faqs_es deben ser específicos de responsabilidad administrativa y contencioso-administrativo en ${locality.name}.
- custom_sections_es es OBLIGATORIO con tipos_responsabilidad y plazos_recurso.
- Tono: autoritativo, preciso con terminología jurídica.
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
  if (!Array.isArray(custom.tipos_responsabilidad)) {
    throw new Error('custom_sections_es debe incluir tipos_responsabilidad (array)');
  }
  if (!Array.isArray(custom.plazos_recurso)) {
    throw new Error('custom_sections_es debe incluir plazos_recurso (array)');
  }
  if (custom.tipos_responsabilidad.length < 5) {
    throw new Error('tipos_responsabilidad debe tener al menos 5 elementos');
  }
  if (custom.plazos_recurso.length < 4) {
    throw new Error('plazos_recurso debe tener al menos 4 elementos');
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
