/**
 * Generador multi-paso: Permisos de Residencia / Extranjería
 * Tabla destino: svc_permisos_residencia
 *
 * Cada campo de la tabla se genera con una llamada IA independiente.
 * Esto garantiza máxima calidad por sección.
 *
 * Uso: tsx scripts/generate-permisos-residencia.ts --locality=murcia --force=true
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

const SERVICE_KEY = 'extranjeria';
const TABLE_NAME = 'svc_permisos_residencia';

function buildSerpQueries(locality: LocalityRow): string[] {
  return [
    ...baseSerpQueries(locality),
    `oficina extranjería ${locality.name}`,
    `delegación gobierno ${locality.name}`,
    `NIE ${locality.name}`,
    `empadronamiento ${locality.name}`,
    `consulado ${locality.name}`,
    `arraigo social ${locality.name}`,
  ];
}

function ctx(locality: LocalityRow, evidence: EvidenceItem[]): string {
  return `CIUDAD: ${locality.name}\nPROVINCIA: ${locality.province || '(misma)'}\nSERVICIO: Permisos de Residencia / Extranjería\n\n═══ EVIDENCIA SERP ═══\n${formatEvidence(evidence)}`;
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
- title_es: título SEO (máx 65 chars). Patrón: "Abogados de Extranjería en ${locality.name} | GVC Abogados"
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
      systemPrompt: `Eres un abogado-redactor especialista en extranjería e inmigración. Redactas contenido web extenso, específico y humano para SEO. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- intro_es: HTML semántico (<p>, <strong>, <em>, <h3>). 800-1200 palabras. Texto introductorio completo sobre permisos de residencia y extranjería en ${locality.name}. Incluye: contexto local verificado (oficina de extranjería, delegación de gobierno de la evidencia), tipos de permisos más solicitados en la zona, relevancia del servicio, qué ofrece el despacho, procedimiento general de tramitación. CTA: "Primera consulta sin compromiso" (NUNCA "consulta gratuita").
- intro_en: traducción al inglés de intro_es. Misma longitud y estructura. CTA: "No-obligation initial consultation" (NUNCA "Free consultation").
- banner_oficina_es: texto HTML breve (2-4 frases) sobre la oficina de extranjería local o delegación de gobierno en ${locality.name}. Información práctica para el ciudadano extranjero. Usa <p>, <strong>. Sin clases ni estilos.
- banner_oficina_en: traducción al inglés.

Cuando no haya datos locales en evidencia: usa normativa real (Ley Orgánica 4/2000, Reglamento de Extranjería RD 557/2011), plazos, procedimientos verificables.`),
      validate: (r) => {
        if (!r.intro_es) throw new Error('Falta intro_es');
        const words = countWords(r.intro_es);
        if (words < 500) throw new Error(`intro_es: ${words} palabras (mín 500)`);
        if (!r.banner_oficina_es) throw new Error('Falta banner_oficina_es');
      },
    },
    {
      name: 'tipos_permiso',
      maxTokens: 2000,
      systemPrompt: `Eres un abogado especialista en extranjería e inmigración en España. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- tipos_permiso_es: array de EXACTAMENTE 6 objetos {titulo, descripcion, icon}. Tipos de permisos de residencia:
  1. Arraigo social (3 años residencia + contrato/medios)
  2. Arraigo familiar (padre de menor español o hijo de residente)
  3. Arraigo laboral (2 años residencia + relación laboral acreditada)
  4. Residencia comunitaria (familiar de ciudadano UE)
  5. Reagrupación familiar (requisitos, familiares reagrupables)
  6. Renovaciones (plazos, requisitos para renovar permisos)
  Descripciones de 2-3 frases con normativa real. Menciona datos locales de la evidencia cuando existan. icon: "home", "users", "briefcase", "flag", "heart", "refresh".
- tipos_permiso_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.tipos_permiso_es) || r.tipos_permiso_es.length < 6)
          throw new Error('tipos_permiso_es: mín 6');
      },
    },
    {
      name: 'sections',
      maxTokens: 4000,
      systemPrompt: `Eres un abogado-redactor de contenido jurídico de alta calidad. Cada sección debe ser sustancial (150+ palabras), con información jurídica real y específica. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- sections_es: array de EXACTAMENTE 4 objetos {title, content}. content es HTML (mín 150 palabras cada uno). Secciones informativas sobre permisos de residencia en ${locality.name}:
  1. Arraigo social: requisitos y procedimiento (3 años, empadronamiento, contrato, informe de integración social)
  2. Reagrupación familiar (quién puede reagrupar, requisitos económicos, vivienda adecuada)
  3. Renovación de permisos (plazos: 60 días antes / 90 días después, documentación necesaria)
  4. Recursos ante denegaciones (reposición, contencioso-administrativo, plazos)
- sections_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.sections_es) || r.sections_es.length !== 4)
          throw new Error('sections_es: exactamente 4');
      },
    },
    {
      name: 'documentacion',
      maxTokens: 2000,
      systemPrompt: `Eres un abogado que asesora a extranjeros sobre documentación para permisos de residencia en España. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- documentacion_es: array de 5-7 objetos {paso, titulo, descripcion}. Documentación y pasos necesarios para tramitar un permiso de residencia en ${locality.name}. paso es "1","2"... Menciona recursos locales de la evidencia (oficina de extranjería, delegación de gobierno, empadronamiento, etc). Cada descripcion: 1-2 frases. Incluir: empadronamiento, pasaporte vigente, antecedentes penales, informe de arraigo, contrato de trabajo, seguro médico, medios económicos.
- documentacion_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.documentacion_es) || r.documentacion_es.length < 5)
          throw new Error('documentacion_es: mín 5');
      },
    },
    {
      name: 'process_faqs',
      maxTokens: 3000,
      systemPrompt: `Eres un abogado especialista en extranjería que explica el proceso legal de forma clara. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- process_es: array de EXACTAMENTE 6 strings. Pasos del proceso legal de tramitación de permisos de residencia (texto plano, 1-2 frases cada uno).
- process_en: traducción al inglés.
- faqs_es: array de EXACTAMENTE 6 objetos {question, answer}. question en texto plano, answer en HTML. Preguntas frecuentes sobre permisos de residencia y extranjería en ${locality.name}. Respuestas sustanciales (3-5 frases).
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
      systemPrompt: `Eres un analista de datos de inmigración y extranjería. ${rules}`,
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
  const tipos = results.tipos_permiso;
  const sections = results.sections;
  const documentacion = results.documentacion;
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
    banner_oficina_es: intro.banner_oficina_es,
    banner_oficina_en: intro.banner_oficina_en,
    stats_es: stats.stats_es,
    stats_en: stats.stats_en,
    tipos_permiso_es: tipos.tipos_permiso_es,
    tipos_permiso_en: tipos.tipos_permiso_en,
    sections_es: sections.sections_es,
    sections_en: sections.sections_en,
    documentacion_es: documentacion.documentacion_es,
    documentacion_en: documentacion.documentacion_en,
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
