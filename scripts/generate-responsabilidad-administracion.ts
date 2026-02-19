/**
 * Generador multi-paso: Responsabilidad Patrimonial de la Administración
 * Tabla destino: svc_responsabilidad_admin
 *
 * Cada campo de la tabla se genera con una llamada IA independiente.
 * Esto garantiza máxima calidad por sección.
 *
 * Uso: tsx scripts/generate-responsabilidad-administracion.ts --locality=murcia --force=true
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

const SERVICE_KEY = 'derecho-administrativo';
const TABLE_NAME = 'svc_responsabilidad_admin';

function buildSerpQueries(locality: LocalityRow): string[] {
  return [
    ...baseSerpQueries(locality),
    `responsabilidad patrimonial administración ${locality.name}`,
    `ayuntamiento ${locality.name}`,
    `juzgado contencioso-administrativo ${locality.name}`,
    `TSJMU TSJCA ${locality.name}`,
    `vía pública ${locality.name}`,
    `urbanismo ${locality.name}`,
  ];
}

function ctx(locality: LocalityRow, evidence: EvidenceItem[]): string {
  return `CIUDAD: ${locality.name}\nPROVINCIA: ${locality.province || '(misma)'}\nSERVICIO: Responsabilidad Patrimonial de la Administración\n\n═══ EVIDENCIA SERP ═══\n${formatEvidence(evidence)}`;
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
- title_es: título SEO (máx 65 chars). Patrón: "Abogados de Responsabilidad Patrimonial en ${locality.name} | GVC Abogados"
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
      systemPrompt: normalizeText(`Eres un abogado-redactor especialista en derecho administrativo y responsabilidad patrimonial con 20 años de experiencia. ${rules}

REGLA ANTI-GENERICIDAD: Cada párrafo debe contener datos que SOLO apliquen a ${locality.name} o contenido jurídico de alto valor (Ley 39/2015, Ley 40/2015, LJCA, jurisprudencia TS/TSJ).

PROHIBIDO:
- "la administración pública tiene la obligación de responder"
- "los ciudadanos tienen derecho a ser indemnizados"
- Cualquier frase obvia sobre derechos del ciudadano`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- intro_es: HTML semántico (<p>, <strong>, <em>, <h3>). 800-1200 palabras.

ESTRUCTURA OBLIGATORIA:
1. GANCHO LOCAL: Ayuntamiento de ${locality.name} (de la evidencia SERP), juzgados contencioso-administrativos competentes, TSJ de la comunidad. Casos típicos en la localidad (mal estado aceras, baches, servicios públicos).
2. VALOR JURÍDICO REAL: Requisitos de la responsabilidad patrimonial: daño efectivo, relación causal, funcionamiento normal o anormal del servicio público, plazo de 1 año (art. 67.1 Ley 39/2015). Diferencia entre responsabilidad objetiva y subjetiva. Cifras orientativas: caída en vía pública 3.000-30.000€, error administrativo 5.000-50.000€.
3. PROCEDIMIENTO: Reclamación administrativa previa obligatoria (6 meses silencio = desestimación), recurso contencioso-administrativo (2 meses desde resolución), prueba pericial, dictamen del Consejo de Estado o Consultivo autonómico en cuantías >50.000€.
4. POR QUÉ ESTE DESPACHO: Experiencia en reclamaciones contra la Administración, conocimiento de la práctica del TSJ local, atención presencial y online en ${locality.name}. Primera consulta sin compromiso.

- intro_en: traducción profesional al inglés. Misma longitud y estructura.
- banner_plazos_es: 2-3 frases sobre el plazo de 1 año para reclamar. BREVE.
- banner_plazos_en: traducción.`),
      validate: (r) => {
        if (!r.intro_es) throw new Error('Falta intro_es');
        const words = countWords(r.intro_es);
        if (words < 450) throw new Error(`intro_es: ${words} palabras (mín 450)`);
        if (!r.banner_plazos_es) throw new Error('Falta banner_plazos_es');
      },
    },
    {
      name: 'tipos_responsabilidad',
      maxTokens: 1500,
      systemPrompt: normalizeText(`Eres un abogado de derecho administrativo. ${rules}
FORMATO: Tarjetas pequeñas. Cada descripcion: MÁXIMO 2 frases cortas (30-40 palabras). Caso típico + rango indemnización.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- tipos_responsabilidad_es: array de EXACTAMENTE 6 objetos {titulo, descripcion, icon}.

MÁXIMO 2 frases por descripcion (30-40 palabras). Ejemplo:
"Caídas por mal estado de aceras o baches. Indemnizaciones habituales de 3.000 a 30.000 € según la gravedad de las lesiones."

Tipos: sanitaria, urbanística, vía pública, servicios públicos, penitenciaria, educativa.
icon: "hospital", "building", "road", "shield", "lock", "school".
- tipos_responsabilidad_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.tipos_responsabilidad_es) || r.tipos_responsabilidad_es.length < 6)
          throw new Error('tipos_responsabilidad_es: mín 6');
      },
    },
    {
      name: 'sections',
      maxTokens: 3000,
      systemPrompt: normalizeText(`Eres un abogado administrativista. ${rules}
FORMATO CRÍTICO: Tarjetas. Cada content: MÁXIMO 80-100 palabras. Listas HTML (<ul><li>). NO párrafos largos.
PROHIBIDO: repetir info de la intro.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- sections_es: array de EXACTAMENTE 4 objetos {title, content}. content es HTML con listas. MÁXIMO 80-100 palabras cada uno.

SECCIÓN 1 - "Requisitos de la reclamación"
Lista: daño efectivo y evaluable, relación de causalidad, funcionamiento normal o anormal, plazo 1 año, legitimación activa.

SECCIÓN 2 - "Reclamación administrativa previa"
Lista: escrito dirigido al órgano competente, 6 meses para resolver, silencio = desestimación, dictamen Consejo Consultivo si >50.000€.

SECCIÓN 3 - "Vía contencioso-administrativa"
Lista: plazo 2 meses desde resolución, juzgado competente, prueba pericial, costas, duración media 12-18 meses.

SECCIÓN 4 - "Organismos en ${locality.name}"
Datos de la evidencia SERP: ayuntamiento, juzgados contencioso, TSJ. Si no hay datos, procedimiento general.

- sections_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.sections_es) || r.sections_es.length !== 4)
          throw new Error('sections_es: exactamente 4');
      },
    },
    {
      name: 'organismos',
      maxTokens: 1500,
      systemPrompt: `Eres un analista que extrae datos verificables de evidencia. SOLO incluyes lo que aparece TEXTUALMENTE en la evidencia. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- organismos_es: array de objetos {nombre, tipo, direccion}. Organismos de la evidencia SERP: ayuntamientos, juzgados, TSJ, delegación de gobierno. Si NO hay datos verificables, devuelve [].
- organismos_en: traducción (nombres propios y direcciones se mantienen).

IMPORTANTE: Si la evidencia no contiene datos exactos, devuelve []. No inventes.`),
      validate: (r) => {
        if (!Array.isArray(r.organismos_es)) throw new Error('organismos_es debe ser array');
      },
    },
    {
      name: 'process_faqs',
      maxTokens: 3000,
      systemPrompt: normalizeText(`Eres un abogado administrativista que responde preguntas de forma directa. ${rules}
FORMATO process: 1 frase por paso (15-25 palabras).
FORMATO FAQs: 2-3 frases con datos concretos. Texto plano, NO HTML.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- process_es: array de EXACTAMENTE 6 strings. 1 frase por paso (15-25 palabras).
Pasos: consulta inicial → análisis del caso → reclamación administrativa → espera resolución (6 meses) → recurso contencioso si necesario → cobro indemnización

- process_en: traducción al inglés.

- faqs_es: array de EXACTAMENTE 6 objetos {question, answer}. answer en texto plano, 2-3 frases con datos.

Preguntas:
1. "¿Cuánto tiempo tengo para reclamar?" — 1 año desde que se produjo el daño o desde el alta médica
2. "¿Puedo reclamar al Ayuntamiento por una caída en la calle?" — Sí, responsabilidad patrimonial por mal estado vía pública
3. "¿Cuánto puedo cobrar?" — Depende del daño: caída leve 3.000-10.000€, lesiones graves 20.000-50.000€+
4. "¿Es obligatoria la reclamación administrativa previa?" — Sí, requisito previo al contencioso (art. 32 Ley 40/2015)
5. "¿Cuánto tarda el procedimiento?" — Administrativa 6 meses, contencioso 12-18 meses adicionales
6. "¿Quién paga si gano?" — La Administración condenada, incluidas costas si hay mala fe

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
      systemPrompt: `Eres un analista de datos de derecho administrativo. ${rules}`,
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
  const organismos = results.organismos;
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
    banner_plazos_es: intro.banner_plazos_es,
    banner_plazos_en: intro.banner_plazos_en,
    stats_es: stats.stats_es,
    stats_en: stats.stats_en,
    tipos_responsabilidad_es: tipos.tipos_responsabilidad_es,
    tipos_responsabilidad_en: tipos.tipos_responsabilidad_en,
    sections_es: sections.sections_es,
    sections_en: sections.sections_en,
    organismos_es: organismos.organismos_es,
    organismos_en: organismos.organismos_en,
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
