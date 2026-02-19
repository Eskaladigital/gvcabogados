/**
 * Generador multi-paso: Responsabilidad Civil
 * Tabla destino: svc_responsabilidad_civil
 *
 * Cada campo de la tabla se genera con una llamada IA independiente.
 * Esto garantiza máxima calidad por sección.
 *
 * Uso: tsx scripts/generate-responsabilidad-civil.ts --locality=murcia --force=true
 */

import {
  runMultiStepGenerator,
  baseSerpQueries,
  baseRules,
  formatEvidence,
  countWords,
  normalizeText,
  type LocalityRow,
  type ServiceRow,
  type EvidenceItem,
  type FieldStep,
} from './lib/generate-utils';

const SERVICE_KEY = 'responsabilidad-civil';
const TABLE_NAME = 'svc_responsabilidad_civil';

function buildSerpQueries(locality: LocalityRow): string[] {
  return [
    ...baseSerpQueries(locality),
    `responsabilidad civil ${locality.name}`,
    `seguro responsabilidad ${locality.name}`,
    `daños perjuicios ${locality.name}`,
    `juzgados primera instancia ${locality.name}`,
    `mediación civil ${locality.name}`,
  ];
}

function ctx(locality: LocalityRow, evidence: EvidenceItem[]): string {
  return `CIUDAD: ${locality.name}\nPROVINCIA: ${locality.province || '(misma)'}\nSERVICIO: Responsabilidad Civil\n\n═══ EVIDENCIA SERP ═══\n${formatEvidence(evidence)}`;
}

function buildSteps(
  locality: LocalityRow,
  _service: ServiceRow,
  evidence: EvidenceItem[],
  _existing: any
): FieldStep[] {
  const context = ctx(locality, evidence);
  const rules = baseRules();

  return [
    {
      name: 'seo',
      maxTokens: 1000,
      systemPrompt: `Eres un experto SEO para despachos de abogados en España. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- title_es: título SEO (máx 65 chars). Patrón: "Abogados de Responsabilidad Civil en ${locality.name} | GVC Abogados"
- meta_description_es: (máx 160 chars) con mención a la ciudad
- short_description_es: (260-320 chars) resumen atractivo
- title_en: traducción del title_es al inglés
- meta_description_en: traducción
- short_description_en: traducción`),
      validate: (r) => {
        if (!r.title_es || !r.meta_description_es) throw new Error('Faltan campos SEO');
        if (r.meta_description_es.length > 180) throw new Error('meta_description_es > 180 chars');
      },
    },
    {
      name: 'intro',
      maxTokens: 6000,
      systemPrompt: normalizeText(`Eres un abogado-redactor especialista en responsabilidad civil con 20 años de experiencia. ${rules}

REGLA ANTI-GENERICIDAD: Cada párrafo debe contener datos que SOLO apliquen a ${locality.name} o contenido jurídico de alto valor (arts. 1902-1910 CC, 1101-1107 CC, LEC, LCS, jurisprudencia TS).

PROHIBIDO:
- "la responsabilidad civil es una institución fundamental"
- "cualquier persona puede causar un daño"
- Frases genéricas sobre el concepto de responsabilidad`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- intro_es: HTML semántico (<p>, <strong>, <em>, <h3>). 800-1200 palabras.

ESTRUCTURA OBLIGATORIA:
1. GANCHO LOCAL: Juzgados de primera instancia de ${locality.name} (de la evidencia SERP), centros de mediación. Contexto: tipos de reclamaciones civiles habituales en la zona.
2. VALOR JURÍDICO REAL: Diferencia entre responsabilidad contractual (art. 1101 CC, 5 años) y extracontractual (art. 1902 CC, 1 año). Conceptos indemnizatorios: daño emergente, lucro cesante, daño moral (art. 1106 CC). Cifras orientativas por tipo de caso.
3. PROCESO: Reclamación extrajudicial (burofax), acto de conciliación o mediación, demanda civil (juicio verbal hasta 6.000€, ordinario >6.000€), costas, ejecución de sentencia. Acción directa contra aseguradora (art. 76 LCS).
4. POR QUÉ ESTE DESPACHO: Experiencia en reclamaciones civiles, negociación extrajudicial, atención presencial y online en ${locality.name}. Primera consulta sin compromiso.

- intro_en: traducción profesional al inglés. Misma longitud y estructura.
- banner_conceptos_es: 2-3 frases sobre daño emergente, lucro cesante y daño moral. BREVE.
- banner_conceptos_en: traducción.`),
      validate: (r) => {
        if (!r.intro_es) throw new Error('Falta intro_es');
        const words = countWords(r.intro_es);
        if (words < 450) throw new Error(`intro_es: ${words} palabras (mín 450)`);
        if (!r.banner_conceptos_es) throw new Error('Falta banner_conceptos_es');
      },
    },
    {
      name: 'tipos_responsabilidad',
      maxTokens: 1500,
      systemPrompt: normalizeText(`Eres un abogado civilista. ${rules}
FORMATO: Tarjetas pequeñas. Cada descripcion: MÁXIMO 2 frases cortas (30-40 palabras). Artículo de ley + caso típico.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- tipos_responsabilidad_es: array de EXACTAMENTE 6 objetos {titulo, descripcion, icon}.

MÁXIMO 2 frases por descripcion (30-40 palabras). Ejemplo:
"Incumplimiento de obligaciones pactadas (art. 1101 CC). Plazo de reclamación: 5 años desde el incumplimiento."

Tipos: contractual, extracontractual, profesional, productos defectuosos, entre vecinos/inmisiones, comunidades de propietarios.
icon: "file-text", "alert-triangle", "briefcase", "package", "home", "users".
- tipos_responsabilidad_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.tipos_responsabilidad_es) || r.tipos_responsabilidad_es.length < 6)
          throw new Error('tipos_responsabilidad_es: mín 6');
      },
    },
    {
      name: 'sections',
      maxTokens: 3000,
      systemPrompt: normalizeText(`Eres un abogado civilista. ${rules}
FORMATO CRÍTICO: Tarjetas. Cada content: MÁXIMO 80-100 palabras. Listas HTML (<ul><li>). NO párrafos largos.
PROHIBIDO: repetir info de la intro.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- sections_es: array de EXACTAMENTE 4 objetos {title, content}. content es HTML con listas. MÁXIMO 80-100 palabras cada uno.

SECCIÓN 1 - "Reclamación extrajudicial"
Lista: burofax como primer paso, mediación civil, acto de conciliación, plazos para responder, ventajas de acuerdo previo.

SECCIÓN 2 - "Proceso judicial civil"
Lista: verbal (hasta 6.000€) vs ordinario (>6.000€), prueba pericial, costas, duración media 8-14 meses, ejecución sentencia.

SECCIÓN 3 - "Seguros de responsabilidad civil"
Lista: acción directa art. 76 LCS, plazo 1 año, reclamación simultánea a causante y aseguradora.

SECCIÓN 4 - "Juzgados en ${locality.name}"
Datos de la evidencia SERP: juzgados primera instancia, dirección, competencia territorial. Si no hay datos, procedimiento general.

- sections_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.sections_es) || r.sections_es.length !== 4)
          throw new Error('sections_es: exactamente 4');
      },
    },
    {
      name: 'plazos_prescripcion',
      maxTokens: 1200,
      systemPrompt: normalizeText(`Eres un abogado civilista especialista en prescripción. ${rules}
FORMATO: Cada descripcion: MÁXIMO 2 frases (30-40 palabras). Artículo + cómputo del plazo. Conciso.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- plazos_prescripcion_es: array de EXACTAMENTE 4 objetos {tipo, plazo, descripcion}.

MÁXIMO 2 frases por descripcion. Ejemplo:
"Desde que el perjudicado conoció el daño (art. 1968.2 CC). Se interrumpe por reclamación extrajudicial fehaciente."

Tipos y plazos:
1. Extracontractual: 1 año (art. 1968.2 CC)
2. Contractual: 5 años (art. 1964 CC)
3. Productos defectuosos: 3 años
4. Seguros: 1 año (art. 23 LCS)

- plazos_prescripcion_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.plazos_prescripcion_es) || r.plazos_prescripcion_es.length !== 4)
          throw new Error('plazos_prescripcion_es: exactamente 4');
      },
    },
    {
      name: 'process_faqs',
      maxTokens: 3000,
      systemPrompt: normalizeText(`Eres un abogado civilista que responde preguntas de forma directa. ${rules}
FORMATO process: 1 frase por paso (15-25 palabras).
FORMATO FAQs: 2-3 frases con datos concretos. Texto plano, NO HTML.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- process_es: array de EXACTAMENTE 6 strings. 1 frase por paso (15-25 palabras).
Pasos: consulta inicial → análisis del caso → reclamación extrajudicial → negociación/mediación → demanda judicial → cobro indemnización

- process_en: traducción al inglés.

- faqs_es: array de EXACTAMENTE 6 objetos {question, answer}. answer en texto plano, 2-3 frases con datos.

Preguntas:
1. "¿Cuánto tiempo tengo para reclamar daños?" — Extracontractual 1 año, contractual 5 años, seguros 1 año
2. "¿Puedo reclamar directamente a la aseguradora?" — Sí, acción directa art. 76 LCS, sin necesidad de demandar al causante
3. "¿Qué daños puedo reclamar?" — Daño emergente, lucro cesante, daño moral (art. 1106 CC)
4. "¿Necesito ir a juicio obligatoriamente?" — No, la mayoría se resuelven extrajudicialmente (burofax, mediación, acuerdo)
5. "¿Quién paga las costas del juicio?" — Normalmente la parte que pierde completamente (art. 394 LEC)
6. "¿Qué pruebas necesito?" — Documentación del daño, informes periciales, facturas, testigos

- faqs_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.process_es) || r.process_es.length !== 6)
          throw new Error('process_es: exactamente 6');
        if (!Array.isArray(r.faqs_es) || r.faqs_es.length !== 6)
          throw new Error('faqs_es: exactamente 6');
      },
    },
    {
      name: 'stats',
      maxTokens: 500,
      systemPrompt: `Eres un analista de datos de litigación civil. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- stats_es: array de EXACTAMENTE 4 objetos {value, label}. Estadísticas para la barra del hero.
- stats_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.stats_es) || r.stats_es.length !== 4)
          throw new Error('stats_es: exactamente 4');
      },
    },
  ];
}

function assembleRow(results: Record<string, any>, locality: LocalityRow): Record<string, any> {
  const seo = results.seo;
  const intro = results.intro;
  const tipos = results.tipos_responsabilidad;
  const sections = results.sections;
  const plazos = results.plazos_prescripcion;
  const pf = results.process_faqs;
  const stats = results.stats;

  return {
    title_es: seo.title_es,
    title_en: seo.title_en,
    meta_description_es: seo.meta_description_es,
    meta_description_en: seo.meta_description_en,
    short_description_es: seo.short_description_es,
    short_description_en: seo.short_description_en,
    intro_es: intro.intro_es,
    intro_en: intro.intro_en,
    banner_conceptos_es: intro.banner_conceptos_es,
    banner_conceptos_en: intro.banner_conceptos_en,
    stats_es: stats.stats_es,
    stats_en: stats.stats_en,
    tipos_responsabilidad_es: tipos.tipos_responsabilidad_es,
    tipos_responsabilidad_en: tipos.tipos_responsabilidad_en,
    sections_es: sections.sections_es,
    sections_en: sections.sections_en,
    plazos_prescripcion_es: plazos.plazos_prescripcion_es,
    plazos_prescripcion_en: plazos.plazos_prescripcion_en,
    process_es: pf.process_es,
    process_en: pf.process_en,
    faqs_es: pf.faqs_es,
    faqs_en: pf.faqs_en,
    content_quality_score: 80,
  };
}

runMultiStepGenerator({
  serviceKey: SERVICE_KEY,
  tableName: TABLE_NAME,
  buildSerpQueries,
  buildSteps,
  assembleRow,
}).catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
