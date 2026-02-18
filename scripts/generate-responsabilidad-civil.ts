/**
 * Generador de contenido para el servicio "Responsabilidad Civil".
 * Usa utilidades compartidas de ./lib/generate-utils y runGenerator().
 *
 * Uso:
 *   tsx scripts/generate-responsabilidad-civil.ts
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

const SERVICE_KEY = 'responsabilidad-civil';

function buildSerpQueries(locality: LocalityRow): string[] {
  const base = baseSerpQueries(locality);
  const specific = [
    `compañías aseguradoras parte siniestro ${locality.name}`,
    `perito médico valoración daños ${locality.name}`,
    `baremo accidentes indemnización ${locality.name}`,
    `Juzgado Primera Instancia ${locality.name}`,
    `mediación civil ${locality.name}`,
  ];
  return [...base, ...specific];
}

function buildSystemPrompt(): string {
  const base = baseSystemPrompt();
  const extension = normalizeText(`
CUSTOM_SECTIONS_ES (obligatorio para este servicio):

Debes incluir en custom_sections_es exactamente estas claves:

1. tipos_responsabilidad: array de objetos {titulo, descripcion, icon}
   - Tipos de responsabilidad civil: contractual, extracontractual, profesional, producto defectuoso, animal, inmueble.
   - icon: nombre de icono (ej: "file-contract", "scale", "briefcase", "package", "paw", "building").
   - Mínimo 5, máximo 6 elementos.

2. conceptos_indemnizacion: array de objetos {concepto, descripcion, rango}
   - Conceptos indemnizatorios y rangos orientativos (daños personales, materiales, morales, lucro cesante, etc.).
   - concepto: nombre del concepto.
   - descripcion: explicación breve.
   - rango: rango orientativo o referencia (ej: "según baremo", "X-Y €").
   - Mínimo 4, máximo 6 elementos.

3. stats: array de objetos {value, label}
   - Estadísticas relevantes sobre responsabilidad civil e indemnizaciones en España.
   - Exactamente 4 elementos.
   - value: número o texto (ej: "85%", "12.000").
   - label: descripción breve.

4. intro: string (HTML, opcional)
   - Texto introductorio localizado para la ciudad.
   - Usa <p>, <strong>, <em>. Sin clases ni estilos.

TONO Y ESTILO (responsabilidad civil y seguros):
- Profesional, preciso, enfocado en resultados y compensación.
- Lenguaje jurídico técnico pero accesible.
- Priorizar información práctica sobre indemnizaciones y procedimientos.
- Evitar dramatismo; ser directo y orientado a la resolución.
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
  - conceptos_indemnizacion: array de {concepto, descripcion, rango}
  - stats: array de {value, label} (4 elementos)
  - intro: string HTML opcional
- local_entities: array (solo entidades con nombre EXACTO en evidencia)
- quality: {score: 0-100, notes?: string}

REGLAS:
- PROHIBIDO: "consulta gratuita", "gratuita", "gratis". Permitido: "primera consulta sin compromiso".
- sections_es, process_es y faqs_es deben ser específicos de responsabilidad civil y seguros en ${locality.name}.
- custom_sections_es es OBLIGATORIO con tipos_responsabilidad y conceptos_indemnizacion.
- Tono: profesional, preciso, enfocado en resultados y compensación.
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
  if (!Array.isArray(custom.conceptos_indemnizacion)) {
    throw new Error('custom_sections_es debe incluir conceptos_indemnizacion (array)');
  }
  if (custom.tipos_responsabilidad.length < 5) {
    throw new Error('tipos_responsabilidad debe tener al menos 5 elementos');
  }
  if (custom.conceptos_indemnizacion.length < 4) {
    throw new Error('conceptos_indemnizacion debe tener al menos 4 elementos');
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
