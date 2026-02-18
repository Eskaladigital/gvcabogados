/**
 * Generador de contenido para el servicio "Derecho de Familia".
 * Usa utilidades compartidas de ./lib/generate-utils y runGenerator().
 *
 * Uso:
 *   tsx scripts/generate-derecho-familia.ts
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

const SERVICE_KEY = 'derecho-familia';

function buildSerpQueries(locality: LocalityRow): string[] {
  const base = baseSerpQueries(locality);
  const loc = locality.province ? `${locality.name} (${locality.province})` : locality.name;
  return [
    ...base,
    `Juzgado de Familia ${locality.name}`,
    `Punto de Encuentro Familiar ${loc}`,
    `mediación familiar ${locality.name} servicio`,
    `Registro Civil ${locality.name} matrimonio divorcio`,
  ];
}

function buildSystemPrompt(): string {
  const base = baseSystemPrompt();
  return base + normalizeText(`

═══════════════════════════════════════════
ESPECÍFICO: DERECHO DE FAMILIA
═══════════════════════════════════════════

TONO: Empático y comprensivo. Los asuntos de familia son emocionalmente sensibles. Escribe con calidez profesional, sin dramatizar ni minimizar. Evita lenguaje frío o burocrático cuando hables de custodia, divorcio o pensiones.

custom_sections_es (OBLIGATORIO) — Estructura exacta:
- areas: array de objetos {titulo, descripcion} — Áreas del derecho de familia: divorcios, custodia, pensiones, régimen de visitas, liquidación de bienes, mediación. Mínimo 5-6 áreas.
- que_saber: array de objetos {paso, titulo, descripcion} — Consejos prácticos antes de iniciar un proceso familiar. Mínimo 4-5 pasos.
- stats: array de objetos {value, label} — Exactamente 4 estadísticas localizadas (ej: "60%", "Plazos de divorcio"; "3 meses", "Mediación familiar").
- intro: string (HTML opcional) — Introducción breve localizada para la sección de derecho de familia. Puede ser vacío "" si no aplica.

PROHIBIDO: "consulta gratuita", "gratuita", "gratis". PERMITIDO: "primera consulta sin compromiso".
`);
}

function buildUserPrompt(
  locality: LocalityRow,
  service: ServiceRow,
  evidence: EvidenceItem[],
  existing: any
): string {
  const existingBlock = existing?.long_description_es
    ? `CONTENIDO PREVIO (reescríbelo con enfoque fresco; NO copies estructuras ni frases):\n${existing.long_description_es}\n\n`
    : '';

  const evidenceText = evidence
    .map(
      (e, idx) =>
        `#${idx + 1}\nquery: ${e.query}\ntitle: ${e.title}\nurl: ${e.link}\nsnippet: ${e.snippet}`.trim()
    )
    .join('\n\n');

  return normalizeText(`
CONTEXTO:
- Ciudad: ${locality.name}
- Provincia: ${locality.province || '(misma)'}
- Servicio: ${service.name_es} (clave: ${service.service_key})
- Slug URL: abogados-${SERVICE_KEY}-${locality.slug}

${existingBlock}

═══ EVIDENCIA SERP ═══
Usa EXCLUSIVAMENTE esta evidencia para instituciones, direcciones y datos locales. Si no está aquí, NO EXISTE. No extrapoles, no inventes.

${evidenceText || '(sin evidencia — sé completamente genérico en referencias locales)'}

═══ QUÉ NECESITO (JSON exacto) ═══

Devuelve un objeto JSON con estas claves:

1. title_es (máx 65 caracteres)
2. meta_description_es (máx 180 caracteres)
3. short_description_es (260-320 caracteres)
4. long_description_es (900-1400 palabras, HTML semántico: <h2>, <h3>, <p>, <strong>, <em>, <ul>/<ol>/<li>, <blockquote>)
5. sections_es: EXACTAMENTE 4 objetos {title, content}. content en HTML semántico.
6. process_es: EXACTAMENTE 6 strings (pasos del proceso)
7. faqs_es: EXACTAMENTE 6 objetos {question, answer}. answer en HTML semántico.
8. custom_sections_es: objeto con:
   - areas: array de {titulo, descripcion} — áreas del derecho de familia (divorcios, custodia, pensiones, régimen visitas, liquidación bienes, mediación)
   - que_saber: array de {paso, titulo, descripcion} — consejos prácticos antes de iniciar un proceso familiar
   - stats: array de {value, label} — exactamente 4 estadísticas localizadas
   - intro: string (HTML opcional, puede ser "")
9. local_entities: array de entidades verificadas en evidencia (entity_type, name, source_url, address/phone/website/notes solo si en evidencia)
10. quality: {score: 0-100, notes?: string}

REGLAS:
- Tono empático: los asuntos de familia son sensibles.
- PROHIBIDO: "consulta gratuita", "gratuita", "gratis". OK: "primera consulta sin compromiso".
- Solo datos que aparezcan LITERALMENTE en la evidencia.
- Preguntas FAQ específicas de ${locality.name} cuando sea posible.
`);
}

function validateCustom(payload: BasePayload): void {
  const custom = payload.custom_sections_es;
  if (!custom || typeof custom !== 'object') {
    throw new Error('custom_sections_es es obligatorio y debe ser un objeto');
  }
  if (!Array.isArray(custom.areas) || custom.areas.length === 0) {
    throw new Error('custom_sections_es.areas es obligatorio y debe ser un array no vacío');
  }
  if (!Array.isArray(custom.que_saber) || custom.que_saber.length === 0) {
    throw new Error('custom_sections_es.que_saber es obligatorio y debe ser un array no vacío');
  }
  for (const a of custom.areas) {
    if (!a.titulo || !a.descripcion) {
      throw new Error('custom_sections_es.areas: cada elemento debe tener titulo y descripcion');
    }
  }
  for (const q of custom.que_saber) {
    if (q.paso == null || !q.titulo || !q.descripcion) {
      throw new Error('custom_sections_es.que_saber: cada elemento debe tener paso, titulo y descripcion');
    }
  }
}

const config = {
  serviceKey: SERVICE_KEY,
  buildSerpQueries,
  buildSystemPrompt,
  buildUserPrompt,
  validateCustom,
};

runGenerator(config).catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
