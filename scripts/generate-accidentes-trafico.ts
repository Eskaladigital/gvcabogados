/**
 * Generador de contenido para el servicio "Accidentes de Tráfico".
 * Usa utilidades compartidas de ./lib/generate-utils y runGenerator().
 *
 * Uso:
 *   tsx scripts/generate-accidentes-trafico.ts
 *
 * Flags:
 *   --locality=<slug|all>   (default: all)
 *   --force=true|false      (default: false)
 *   --dry-run=true|false    (default: false)
 *   --limit=<n>             (default: 0 sin límite)
 *   --verbose=true|false    (default: true)
 *   --model=<openai_model>  (default: gpt-4.1)
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

const SERVICE_KEY = 'accidentes-trafico';

function buildSerpQueries(locality: LocalityRow): string[] {
  const base = baseSerpQueries(locality);
  const specific = [
    `Urgencias hospital ${locality.name} accidentes de tráfico`,
    `Guardia Civil Tráfico ${locality.name}`,
    `carreteras principales ${locality.name} accesos`,
    `atestado accidente de tráfico ${locality.name} dónde solicitar`,
  ];
  return [...base, ...specific];
}

function buildSystemPrompt(): string {
  const base = baseSystemPrompt();
  const extension = normalizeText(`
CUSTOM_SECTIONS_ES (obligatorio para este servicio):

Debes incluir en custom_sections_es exactamente estas claves:

1. tipos_accidente: array de objetos {titulo, descripcion, icon}
   - Tipos de accidentes de tráfico más frecuentes en la zona/localidad.
   - icon: nombre de icono (ej: "car", "motorcycle", "truck", "pedestrian").
   - Mínimo 3, máximo 6 elementos.

2. que_hacer: array de objetos {paso, titulo, descripcion}
   - Pasos concretos a seguir tras un accidente de tráfico.
   - paso: número (1, 2, 3...).
   - titulo: título breve del paso.
   - descripcion: texto explicativo.
   - Exactamente 5-7 pasos.

3. stats: array de objetos {value, label}
   - Estadísticas locales o nacionales relevantes sobre accidentes.
   - Exactamente 4 elementos.
   - value: número o texto (ej: "85%", "1.200").
   - label: descripción breve.

4. intro: string (HTML, opcional)
   - Texto introductorio localizado para la ciudad.
   - Usa <p>, <strong>, <em>. Sin clases ni estilos.
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
  - tipos_accidente: array de {titulo, descripcion, icon}
  - que_hacer: array de {paso, titulo, descripcion}
  - stats: array de {value, label} (4 elementos)
  - intro: string HTML opcional
- local_entities: array (solo entidades con nombre EXACTO en evidencia)
- quality: {score: 0-100, notes?: string}

REGLAS:
- PROHIBIDO: "consulta gratuita", "gratuita", "gratis". Permitido: "primera consulta sin compromiso".
- sections_es, process_es y faqs_es deben ser específicos de accidentes de tráfico en ${locality.name}.
- custom_sections_es es OBLIGATORIO con tipos_accidente y que_hacer.
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
  if (!Array.isArray(custom.tipos_accidente)) {
    throw new Error('custom_sections_es debe incluir tipos_accidente (array)');
  }
  if (!Array.isArray(custom.que_hacer)) {
    throw new Error('custom_sections_es debe incluir que_hacer (array)');
  }
  if (custom.tipos_accidente.length < 3) {
    throw new Error('tipos_accidente debe tener al menos 3 elementos');
  }
  if (custom.que_hacer.length < 5) {
    throw new Error('que_hacer debe tener al menos 5 elementos');
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
