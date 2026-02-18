/**
 * Generador multi-paso: Derecho de Familia
 * Tabla destino: svc_derecho_familia
 *
 * Cada campo de la tabla se genera con una llamada IA independiente.
 * Esto garantiza máxima calidad por sección.
 *
 * Uso: tsx scripts/generate-derecho-familia.ts --locality=murcia --force=true
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

const SERVICE_KEY = 'derecho-familia';
const TABLE_NAME = 'svc_derecho_familia';

function buildSerpQueries(locality: LocalityRow): string[] {
  return [
    ...baseSerpQueries(locality),
    `juzgados familia ${locality.name}`,
    `mediación familiar ${locality.name}`,
    `divorcio ${locality.name} abogados`,
    `custodia hijos ${locality.name} juzgado`,
    `régimen visitas ${locality.name}`,
    `pensión alimentos ${locality.name}`,
    `servicios sociales ${locality.name} familia`,
    `SAF SATAF ${locality.name} punto encuentro familiar`,
  ];
}

function ctx(locality: LocalityRow, evidence: EvidenceItem[]): string {
  return `CIUDAD: ${locality.name}\nPROVINCIA: ${locality.province || '(misma)'}\nSERVICIO: Derecho de Familia\n\n═══ EVIDENCIA SERP ═══\n${formatEvidence(evidence)}`;
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
- title_es: título SEO (máx 65 chars). Patrón: "Abogados de Derecho de Familia en ${locality.name} | GVC Abogados"
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
      maxTokens: 3500,
      systemPrompt: `Eres un abogado-redactor especialista en derecho de familia. Redactas contenido web extenso, específico y humano para SEO. Tono empático y comprensivo. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- intro_es: HTML semántico (<p>, <strong>, <em>, <h3>). 800-1200 palabras. Texto introductorio completo sobre derecho de familia en ${locality.name}. Incluye: contexto local verificado (juzgados de familia, mediación, SAF/SATAF de la evidencia), tipos de asuntos familiares en la zona, relevancia del servicio, qué ofrece el despacho, procedimiento general. CTA: "Primera consulta sin compromiso" (NUNCA "consulta gratuita").
- intro_en: traducción al inglés de intro_es. Misma longitud y estructura. CTA: "No-obligation initial consultation" (NUNCA "Free consultation").
- banner_confidencialidad_es: texto HTML breve (2-4 frases) para banner de confidencialidad. Mensaje de discreción y protección de datos en asuntos familiares.
- banner_confidencialidad_en: traducción al inglés.

Cuando no haya datos locales en evidencia: usa normativa real (CC, LEC, Ley de Enjuiciamiento Civil), plazos, procedimientos verificables.`),
      validate: (r) => {
        if (!r.intro_es) throw new Error('Falta intro_es');
        const words = countWords(r.intro_es);
        if (words < 500) throw new Error(`intro_es: ${words} palabras (mín 500)`);
        if (!r.banner_confidencialidad_es) throw new Error('Falta banner_confidencialidad_es');
      },
    },
    {
      name: 'areas',
      maxTokens: 2000,
      systemPrompt: `Eres un abogado especialista en derecho de familia. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- areas_es: array de 4-6 objetos {titulo, descripcion, icon}. Áreas de actuación: divorcios, custodias, pensiones alimenticias, régimen de visitas, liquidación sociedad gananciales, medidas paterno-filiales. Descripciones de 2-3 frases. Menciona datos locales de la evidencia cuando existan. icon: "heart", "users", "money", "calendar", "scale", "shield".
- areas_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.areas_es) || r.areas_es.length < 4) throw new Error('areas_es: mín 4');
      },
    },
    {
      name: 'sections',
      maxTokens: 4000,
      systemPrompt: `Eres un abogado-redactor de contenido jurídico de alta calidad. Cada sección debe ser sustancial (150+ palabras), con información jurídica real y específica. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- sections_es: array de EXACTAMENTE 4 objetos {title, content}. content es HTML (mín 150 palabras cada uno). Secciones informativas sobre derecho de familia en ${locality.name}:
  1. Mediación familiar (ventajas, cuándo procede, recursos locales de la evidencia)
  2. Convenio regulador (contenido, homologación, efectos)
  3. Custodia compartida (criterios, requisitos, práctica en juzgados locales)
  4. Modificación de medidas (cambio de circunstancias, procedimiento)
- sections_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.sections_es) || r.sections_es.length !== 4) throw new Error('sections_es: exactamente 4');
      },
    },
    {
      name: 'que_saber',
      maxTokens: 2000,
      systemPrompt: `Eres un abogado que asesora en procesos de familia. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- que_saber_es: array de 5-7 objetos {paso, titulo, descripcion}. Aspectos a considerar antes y durante un proceso de familia en ${locality.name}. paso es "1","2"... Menciona recursos locales de la evidencia (juzgados, mediación, PEF, etc). Cada descripcion: 1-2 frases.
- que_saber_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.que_saber_es) || r.que_saber_es.length < 5) throw new Error('que_saber_es: mín 5');
      },
    },
    {
      name: 'process_faqs',
      maxTokens: 3000,
      systemPrompt: `Eres un abogado especialista en derecho de familia que explica el proceso legal de forma clara. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- process_es: array de EXACTAMENTE 6 strings. Pasos del proceso legal en asuntos de familia (texto plano, 1-2 frases cada uno).
- process_en: traducción al inglés.
- faqs_es: array de EXACTAMENTE 6 objetos {question, answer}. question en texto plano, answer en HTML. Preguntas frecuentes sobre derecho de familia en ${locality.name}. Respuestas sustanciales (3-5 frases).
- faqs_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.process_es) || r.process_es.length !== 6) throw new Error('process_es: exactamente 6');
        if (!Array.isArray(r.faqs_es) || r.faqs_es.length !== 6) throw new Error('faqs_es: exactamente 6');
      },
    },
    {
      name: 'stats',
      maxTokens: 500,
      systemPrompt: `Eres un analista de datos jurídicos. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- stats_es: array de EXACTAMENTE 4 objetos {value, label}. Estadísticas relevantes para mostrar en la barra del hero. Pueden ser locales (de la evidencia) o nacionales verificables. Ejemplo: {value: "55+", label: "Años de experiencia"}, {value: "${locality.name}", label: "Atención presencial y online"}.
- stats_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.stats_es) || r.stats_es.length !== 4) throw new Error('stats_es: exactamente 4');
      },
    },
  ];
}

function assembleRow(results: Record<string, any>, locality: LocalityRow): Record<string, any> {
  const seo = results.seo;
  const intro = results.intro;
  const areas = results.areas;
  const sections = results.sections;
  const queSaber = results.que_saber;
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
    banner_confidencialidad_es: intro.banner_confidencialidad_es,
    banner_confidencialidad_en: intro.banner_confidencialidad_en,
    stats_es: stats.stats_es,
    stats_en: stats.stats_en,
    areas_es: areas.areas_es,
    areas_en: areas.areas_en,
    sections_es: sections.sections_es,
    sections_en: sections.sections_en,
    que_saber_es: queSaber.que_saber_es,
    que_saber_en: queSaber.que_saber_en,
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
