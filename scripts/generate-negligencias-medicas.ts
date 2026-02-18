/**
 * Generador de contenido para el servicio "Negligencias Médicas".
 * Usa utilidades compartidas de ./lib/generate-utils y runGenerator().
 *
 * Uso:
 *   tsx scripts/generate-negligencias-medicas.ts
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

const SERVICE_KEY = 'negligencias-medicas';

function buildSerpQueries(locality: LocalityRow): string[] {
  const base = baseSerpQueries(locality);
  const specific = [
    `hospital ${locality.name} quejas atención sanitaria`,
    `Servicio de Salud reclamaciones ${locality.name}`,
    `inspección médica reclamación ${locality.name}`,
    `defensor del paciente ${locality.name}`,
    `colegios médicos ${locality.name}`,
  ];
  return [...base, ...specific];
}

function buildSystemPrompt(): string {
  const base = baseSystemPrompt();
  const extension = normalizeText(`
CUSTOM_SECTIONS_ES (obligatorio para este servicio):

Debes incluir en custom_sections_es exactamente estas claves:

1. tipos_negligencia: array de objetos {titulo, descripcion, icon}
   - Tipos de negligencia médica más frecuentes.
   - Incluir: errores diagnóstico, cirugía, farmacológicos, obstétrica, urgencias, estética.
   - icon: nombre de icono (ej: "stethoscope", "scalpel", "pill", "baby", "ambulance", "aesthetic").
   - Mínimo 5, máximo 6 elementos.

2. proceso_reclamacion: array de objetos {paso, titulo, descripcion}
   - Pasos concretos para interponer una reclamación por negligencia médica.
   - paso: número (1, 2, 3...).
   - titulo: título breve del paso.
   - descripcion: texto explicativo.
   - Exactamente 6 pasos.

3. stats: array de objetos {value, label}
   - Estadísticas relevantes sobre negligencia médica en España.
   - Exactamente 4 elementos.
   - value: número o texto (ej: "85%", "12.000").
   - label: descripción breve.

4. intro: string (HTML, opcional)
   - Texto introductorio localizado para la ciudad.
   - Usa <p>, <strong>, <em>. Sin clases ni estilos.

TONO Y ESTILO (negligencia médica):
- Serio y técnico pero accesible.
- Empático con los pacientes y sus familias.
- Evitar dramatismo; priorizar información útil y veraz.
- Lenguaje jurídico preciso sin perder claridad.
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
  - tipos_negligencia: array de {titulo, descripcion, icon}
  - proceso_reclamacion: array de {paso, titulo, descripcion}
  - stats: array de {value, label} (4 elementos)
  - intro: string HTML opcional
- local_entities: array (solo entidades con nombre EXACTO en evidencia)
- quality: {score: 0-100, notes?: string}

REGLAS:
- PROHIBIDO: "consulta gratuita", "gratuita", "gratis". Permitido: "primera consulta sin compromiso".
- sections_es, process_es y faqs_es deben ser específicos de negligencia médica en ${locality.name}.
- custom_sections_es es OBLIGATORIO con tipos_negligencia y proceso_reclamacion.
- Tono: serio, técnico pero accesible, empático con los pacientes.
`);
}

function validateCustom(payload: BasePayload): void {
  const custom = payload.custom_sections_es;
  if (!custom || typeof custom !== 'object') {
    throw new Error('custom_sections_es es obligatorio y debe ser un objeto');
  }
  if (!Array.isArray(custom.tipos_negligencia)) {
    throw new Error('custom_sections_es debe incluir tipos_negligencia (array)');
  }
  if (!Array.isArray(custom.proceso_reclamacion)) {
    throw new Error('custom_sections_es debe incluir proceso_reclamacion (array)');
  }
  if (custom.tipos_negligencia.length < 5) {
    throw new Error('tipos_negligencia debe tener al menos 5 elementos');
  }
  if (custom.proceso_reclamacion.length !== 6) {
    throw new Error('proceso_reclamacion debe tener exactamente 6 elementos');
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
});
