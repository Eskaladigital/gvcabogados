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
      maxTokens: 3500,
      systemPrompt: `Eres un abogado-redactor especialista en responsabilidad civil. Redactas contenido web extenso, específico y humano para SEO. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- intro_es: HTML semántico (<p>, <strong>, <em>, <h3>). 800-1200 palabras. Texto introductorio completo sobre responsabilidad civil en ${locality.name}. Incluye: contexto local verificado (juzgados de primera instancia, centros de mediación de la evidencia), tipos de reclamaciones de responsabilidad civil más habituales, relevancia del servicio, qué ofrece el despacho, procedimiento general de reclamación. CTA: "Primera consulta sin compromiso" (NUNCA "consulta gratuita").
- intro_en: traducción al inglés de intro_es. Misma longitud y estructura. CTA: "No-obligation initial consultation" (NUNCA "Free consultation").
- banner_conceptos_es: texto HTML breve (2-4 frases) sobre los conceptos indemnizatorios en responsabilidad civil: daño emergente, lucro cesante y daño moral (Art. 1106 CC). Usa <p>, <strong>. Sin clases ni estilos.
- banner_conceptos_en: traducción al inglés.

Cuando no haya datos locales en evidencia: usa normativa real (Código Civil arts. 1902-1910, 1101-1107, Ley de Enjuiciamiento Civil), plazos, procedimientos verificables.`),
      validate: (r) => {
        if (!r.intro_es) throw new Error('Falta intro_es');
        const words = countWords(r.intro_es);
        if (words < 500) throw new Error(`intro_es: ${words} palabras (mín 500)`);
        if (!r.banner_conceptos_es) throw new Error('Falta banner_conceptos_es');
      },
    },
    {
      name: 'tipos_responsabilidad',
      maxTokens: 2000,
      systemPrompt: `Eres un abogado especialista en responsabilidad civil. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- tipos_responsabilidad_es: array de EXACTAMENTE 6 objetos {titulo, descripcion, icon}. Tipos de responsabilidad civil:
  1. Contractual (incumplimiento de contratos, Art. 1101 CC)
  2. Extracontractual (daños a terceros sin relación contractual, Art. 1902 CC)
  3. Profesional (errores de profesionales: médicos, abogados, arquitectos, etc.)
  4. Por productos defectuosos (Ley General para la Defensa de los Consumidores)
  5. Entre vecinos / inmisiones (Art. 1908 CC, daños por agua, humo, ruidos)
  6. De comunidades de propietarios (responsabilidad de la comunidad, elementos comunes)
  Descripciones de 2-3 frases con normativa real. Menciona datos locales de la evidencia cuando existan. icon: "file-text", "alert-triangle", "briefcase", "package", "home", "users".
- tipos_responsabilidad_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.tipos_responsabilidad_es) || r.tipos_responsabilidad_es.length < 6)
          throw new Error('tipos_responsabilidad_es: mín 6');
      },
    },
    {
      name: 'sections',
      maxTokens: 4000,
      systemPrompt: `Eres un abogado-redactor de contenido jurídico de alta calidad. Cada sección debe ser sustancial (150+ palabras), con información jurídica real y específica. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- sections_es: array de EXACTAMENTE 4 objetos {title, content}. content es HTML (mín 150 palabras cada uno). Secciones informativas sobre responsabilidad civil en ${locality.name}:
  1. Reclamación extrajudicial y negociación (burofax, mediación, acuerdo previo)
  2. Proceso judicial civil (demanda, juicio ordinario/verbal, prueba pericial, juzgados locales de la evidencia)
  3. Seguros de responsabilidad civil (acción directa Art. 76 LCS, reclamación a aseguradora)
  4. Valoración de daños e indemnizaciones (daño emergente, lucro cesante, daño moral, criterios judiciales)
- sections_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.sections_es) || r.sections_es.length !== 4)
          throw new Error('sections_es: exactamente 4');
      },
    },
    {
      name: 'plazos_prescripcion',
      maxTokens: 2000,
      systemPrompt: `Eres un abogado especialista en plazos de prescripción de responsabilidad civil en España. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- plazos_prescripcion_es: array de EXACTAMENTE 4 objetos {tipo, plazo, descripcion}. Plazos de prescripción en responsabilidad civil:
  1. Extracontractual: 1 año (Art. 1968.2 CC, desde que lo supo el agraviado)
  2. Contractual: 5 años (Art. 1964 CC, reforma Ley 42/2015)
  3. Productos defectuosos: 3 años (desde el daño o conocimiento del defecto)
  4. Seguros: 1 año (Art. 23 LCS, acción directa contra aseguradora)
  Cada descripcion: 2-3 frases explicando el cómputo del plazo, interrupciones y particularidades.
- plazos_prescripcion_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.plazos_prescripcion_es) || r.plazos_prescripcion_es.length !== 4)
          throw new Error('plazos_prescripcion_es: exactamente 4');
      },
    },
    {
      name: 'process_faqs',
      maxTokens: 3000,
      systemPrompt: `Eres un abogado especialista en responsabilidad civil que explica el proceso legal de forma clara. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- process_es: array de EXACTAMENTE 6 strings. Pasos del proceso legal de reclamación por responsabilidad civil (texto plano, 1-2 frases cada uno).
- process_en: traducción al inglés.
- faqs_es: array de EXACTAMENTE 6 objetos {question, answer}. question en texto plano, answer en HTML. Preguntas frecuentes sobre responsabilidad civil en ${locality.name}. Respuestas sustanciales (3-5 frases).
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
- stats_es: array de EXACTAMENTE 4 objetos {value, label}. Estadísticas relevantes para mostrar en la barra del hero. Pueden ser locales (de la evidencia) o nacionales verificables. Ejemplo: {value: "55+", label: "Años de experiencia"}, {value: "${locality.name}", label: "Atención presencial y online"}.
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
