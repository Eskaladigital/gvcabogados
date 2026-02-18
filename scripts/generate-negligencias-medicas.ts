/**
 * Generador multi-paso: Negligencias Médicas
 * Tabla destino: svc_negligencias_medicas
 *
 * Cada campo de la tabla se genera con una llamada IA independiente.
 * Esto garantiza máxima calidad por sección.
 *
 * Uso: tsx scripts/generate-negligencias-medicas.ts --locality=murcia --force=true
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

const SERVICE_KEY = 'negligencias-medicas';
const TABLE_NAME = 'svc_negligencias_medicas';

function buildSerpQueries(locality: LocalityRow): string[] {
  const region = locality.province || locality.name;
  return [
    ...baseSerpQueries(locality),
    `hospital ${locality.name}`,
    `centro salud ${locality.name}`,
    `urgencias ${locality.name}`,
    `negligencia médica ${locality.name}`,
    `juzgados instrucción ${locality.name}`,
    `servicio salud ${region}`,
  ];
}

function ctx(locality: LocalityRow, evidence: EvidenceItem[]): string {
  return `CIUDAD: ${locality.name}\nPROVINCIA: ${locality.province || '(misma)'}\nSERVICIO: Negligencias Médicas\n\n═══ EVIDENCIA SERP ═══\n${formatEvidence(evidence)}`;
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
- title_es: título SEO (máx 65 chars). Patrón: "Abogados de Negligencias Médicas en ${locality.name} | GVC Abogados"
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
      systemPrompt: `Eres un abogado-redactor especialista en negligencia médica. Redactas contenido web extenso, específico y humano para SEO. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- intro_es: HTML semántico (<p>, <strong>, <em>, <h3>). 800-1200 palabras. Texto introductorio completo sobre negligencia médica en ${locality.name}. Incluye: contexto local verificado (hospitales, centros de salud de la evidencia), tipos de negligencia en la zona, relevancia del servicio, qué ofrece el despacho, procedimiento general de reclamación.
- intro_en: traducción al inglés de intro_es. Misma longitud y estructura.

Cuando no haya datos locales en evidencia: usa normativa real (Ley 41/2002, plazos de reclamación), procedimientos verificables.`),
      validate: (r) => {
        if (!r.intro_es) throw new Error('Falta intro_es');
        const words = countWords(r.intro_es);
        if (words < 500) throw new Error(`intro_es: ${words} palabras (mín 500)`);
      },
    },
    {
      name: 'tipos_negligencia',
      maxTokens: 2000,
      systemPrompt: `Eres un abogado especialista en responsabilidad sanitaria. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- tipos_negligencia_es: array de 4-6 objetos {titulo, descripcion, icon}. Tipos de negligencia médica relevantes. Incluir al menos: errores diagnóstico, quirúrgicas, urgencias/triaje, obstétricas, medicación, infecciones hospitalarias. Descripciones de 2-3 frases. icon: "stethoscope", "scalpel", "ambulance", "baby", "pill", "hospital".
- tipos_negligencia_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.tipos_negligencia_es) || r.tipos_negligencia_es.length < 4)
          throw new Error('tipos_negligencia_es: mín 4');
      },
    },
    {
      name: 'sections',
      maxTokens: 4000,
      systemPrompt: `Eres un abogado-redactor de contenido jurídico de alta calidad. Cada sección debe ser sustancial (150+ palabras), con información jurídica real y específica. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- sections_es: array de EXACTAMENTE 4 objetos {title, content}. content es HTML (mín 150 palabras cada uno). Secciones informativas sobre negligencia médica en ${locality.name}:
  1. Reclamación por negligencia (proceso, requisitos, vías)
  2. Peritaje médico (importancia, quién lo realiza, valor probatorio)
  3. Vía judicial y administrativa (diferencias, cuándo usar cada una)
  4. Plazos de reclamación (1 año civil, 1 año administrativo, prescripción)
- sections_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.sections_es) || r.sections_es.length !== 4)
          throw new Error('sections_es: exactamente 4');
      },
    },
    {
      name: 'hospitales',
      maxTokens: 2000,
      systemPrompt: `Eres un analista que extrae datos verificables de evidencia. SOLO incluyes lo que aparece TEXTUALMENTE en la evidencia. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- hospitales_es: array de objetos {nombre, tipo, direccion}. Hospitales y centros de salud que aparezcan EXPLÍCITAMENTE en la evidencia SERP. tipo: "hospital", "centro de salud", "urgencias", etc. Si NO hay evidencia con nombres/direcciones verificables, devuelve array VACÍO [].
- hospitales_en: traducción al inglés (mismo array, con nombres traducidos si procede; direcciones se mantienen).

IMPORTANTE: Si la evidencia no contiene nombres exactos de hospitales o centros con dirección, devuelve []. No inventes.`),
      validate: (r) => {
        if (!Array.isArray(r.hospitales_es)) throw new Error('hospitales_es debe ser array');
      },
    },
    {
      name: 'process_faqs',
      maxTokens: 3000,
      systemPrompt: `Eres un abogado especialista en negligencia médica que explica el proceso legal de forma clara. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- process_es: array de EXACTAMENTE 6 strings. Pasos del proceso legal de reclamación por negligencia médica (texto plano, 1-2 frases cada uno).
- process_en: traducción al inglés.
- faqs_es: array de EXACTAMENTE 6 objetos {question, answer}. question en texto plano, answer en HTML. Preguntas frecuentes sobre negligencia médica en ${locality.name}. Respuestas sustanciales (3-5 frases).
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
      systemPrompt: `Eres un analista de datos de responsabilidad sanitaria. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- stats_es: array de EXACTAMENTE 4 objetos {value, label}. Estadísticas relevantes para mostrar en la barra del hero. Pueden ser locales (de la evidencia) o nacionales verificables. Ejemplo: {value: "55+", label: "Años de experiencia"}, {value: "${locality.name}", label: "Atención presencial y online"}.
- stats_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.stats_es) || r.stats_es.length !== 4)
          throw new Error('stats_es: exactamente 4');
      },
    },
    {
      name: 'banner_plazos',
      maxTokens: 800,
      systemPrompt: `Eres un abogado que informa sobre plazos de reclamación. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- banner_plazos_es: texto HTML breve (2-4 frases) sobre plazos de reclamación por negligencia médica. Mencionar: 1 año desde el conocimiento del daño (vía civil), 1 año (vía administrativa). Usa <p>, <strong>. Sin clases ni estilos.
- banner_plazos_en: traducción al inglés.`),
      validate: (r) => {
        if (!r.banner_plazos_es) throw new Error('Falta banner_plazos_es');
      },
    },
  ];
}

function assembleRow(results: Record<string, any>, locality: LocalityRow): Record<string, any> {
  const seo = results.seo;
  const intro = results.intro;
  const tipos = results.tipos_negligencia;
  const sections = results.sections;
  const hospitales = results.hospitales;
  const pf = results.process_faqs;
  const stats = results.stats;
  const banner = results.banner_plazos;

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
    tipos_negligencia_es: tipos.tipos_negligencia_es,
    tipos_negligencia_en: tipos.tipos_negligencia_en,
    sections_es: sections.sections_es,
    sections_en: sections.sections_en,
    hospitales_es: hospitales.hospitales_es,
    hospitales_en: hospitales.hospitales_en,
    process_es: pf.process_es,
    process_en: pf.process_en,
    faqs_es: pf.faqs_es,
    faqs_en: pf.faqs_en,
    banner_plazos_es: banner.banner_plazos_es,
    banner_plazos_en: banner.banner_plazos_en,
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
