/**
 * Generador multi-paso: Accidentes de Tráfico
 * Tabla destino: svc_accidentes_trafico
 *
 * Cada campo de la tabla se genera con una llamada IA independiente.
 * Esto garantiza máxima calidad por sección.
 *
 * Uso: tsx scripts/generate-accidentes-trafico.ts --locality=murcia --force=true
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

const SERVICE_KEY = 'accidentes-trafico';
const TABLE_NAME = 'svc_accidentes_trafico';

function buildSerpQueries(locality: LocalityRow): string[] {
  return [
    ...baseSerpQueries(locality),
    `accidentes tráfico ${locality.name} estadísticas DGT`,
    `puntos negros carretera ${locality.name}`,
    `hospital urgencias traumatología ${locality.name}`,
    `autovía autopista ${locality.name} siniestros`,
    `Guardia Civil Tráfico ${locality.name} atestado`,
    `policía local ${locality.name} atestados accidentes`,
    `carreteras principales accesos ${locality.name}`,
  ];
}

function ctx(locality: LocalityRow, evidence: EvidenceItem[]): string {
  return `CIUDAD: ${locality.name}\nPROVINCIA: ${locality.province || '(misma)'}\nSERVICIO: Accidentes de Tráfico\n\n═══ EVIDENCIA SERP ═══\n${formatEvidence(evidence)}`;
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
- title_es: título SEO (máx 65 chars). Patrón: "Abogados de Accidentes de Tráfico en ${locality.name} | GVC Abogados"
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
      maxTokens: 3000,
      systemPrompt: `Eres un abogado-redactor especialista en accidentes de tráfico. Redactas contenido web extenso, específico y humano para SEO. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- intro_es: HTML semántico (<p>, <strong>, <em>, <h3>). 800-1200 palabras. Texto introductorio completo sobre accidentes de tráfico en ${locality.name}. Incluye: contexto local verificado (carreteras, estadísticas de la evidencia), tipos de accidentes en la zona, relevancia del servicio, qué ofrece el despacho, procedimiento general de reclamación.
- intro_en: traducción al inglés de intro_es. Misma longitud y estructura.

Cuando no haya datos locales en evidencia: usa normativa real (Ley 35/2015, Baremo de Tráfico), plazos, procedimientos verificables.`),
      validate: (r) => {
        if (!r.intro_es) throw new Error('Falta intro_es');
        const words = countWords(r.intro_es);
        if (words < 500) throw new Error(`intro_es: ${words} palabras (mín 500)`);
      },
    },
    {
      name: 'tipos_accidente',
      maxTokens: 2000,
      systemPrompt: `Eres un abogado especialista en siniestralidad vial. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- tipos_accidente_es: array de 4-6 objetos {titulo, descripcion, icon}. Tipos de accidentes de tráfico relevantes en ${locality.name}. Descripciones de 2-3 frases. Menciona datos locales de la evidencia cuando existan. icon: "car", "motorcycle", "truck", "pedestrian", "shield", "clock".
- tipos_accidente_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.tipos_accidente_es) || r.tipos_accidente_es.length < 3) throw new Error('tipos_accidente_es: mín 3');
      },
    },
    {
      name: 'sections',
      maxTokens: 4000,
      systemPrompt: `Eres un abogado-redactor de contenido jurídico de alta calidad. Cada sección debe ser sustancial (150+ palabras), con información jurídica real y específica. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- sections_es: array de EXACTAMENTE 4 objetos {title, content}. content es HTML (mín 150 palabras cada uno). Secciones informativas sobre accidentes de tráfico en ${locality.name}:
  1. Reclamación de indemnizaciones (proceso, baremo, Ley 35/2015)
  2. Acompañamiento y representación legal (fases, juzgados locales de la evidencia)
  3. Valoración de daños y perjuicios (peritos, tipos de daño)
  4. Atención cercana en ${locality.name} (datos locales de la evidencia)
- sections_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.sections_es) || r.sections_es.length !== 4) throw new Error('sections_es: exactamente 4');
      },
    },
    {
      name: 'que_hacer',
      maxTokens: 2000,
      systemPrompt: `Eres un abogado que asesora a víctimas de accidentes de tráfico. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- que_hacer_es: array de 5-7 objetos {paso, titulo, descripcion}. Pasos a seguir tras un accidente de tráfico en ${locality.name}. paso es "1","2"... Menciona recursos locales de la evidencia (comisaría, hospital, etc). Cada descripcion: 1-2 frases.
- que_hacer_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.que_hacer_es) || r.que_hacer_es.length < 5) throw new Error('que_hacer_es: mín 5');
      },
    },
    {
      name: 'process_faqs',
      maxTokens: 3000,
      systemPrompt: `Eres un abogado especialista en accidentes de tráfico que explica el proceso legal de forma clara. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- process_es: array de EXACTAMENTE 6 strings. Pasos del proceso legal de reclamación (texto plano, 1-2 frases cada uno).
- process_en: traducción al inglés.
- faqs_es: array de EXACTAMENTE 6 objetos {question, answer}. question en texto plano, answer en HTML. Preguntas frecuentes sobre accidentes de tráfico en ${locality.name}. Respuestas sustanciales (3-5 frases).
- faqs_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.process_es) || r.process_es.length !== 6) throw new Error('process_es: exactamente 6');
        if (!Array.isArray(r.faqs_es) || r.faqs_es.length !== 6) throw new Error('faqs_es: exactamente 6');
      },
    },
    {
      name: 'stats',
      maxTokens: 500,
      systemPrompt: `Eres un analista de datos de siniestralidad vial. ${rules}`,
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
  const tipos = results.tipos_accidente;
  const sections = results.sections;
  const queHacer = results.que_hacer;
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
    stats_es: stats.stats_es,
    stats_en: stats.stats_en,
    tipos_accidente_es: tipos.tipos_accidente_es,
    tipos_accidente_en: tipos.tipos_accidente_en,
    sections_es: sections.sections_es,
    sections_en: sections.sections_en,
    que_hacer_es: queHacer.que_hacer_es,
    que_hacer_en: queHacer.que_hacer_en,
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
