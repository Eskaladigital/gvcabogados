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
      maxTokens: 3500,
      systemPrompt: `Eres un abogado-redactor especialista en derecho administrativo y responsabilidad patrimonial. Redactas contenido web extenso, específico y humano para SEO. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- intro_es: HTML semántico (<p>, <strong>, <em>, <h3>). 800-1200 palabras. Texto introductorio completo sobre responsabilidad patrimonial de la administración en ${locality.name}. Incluye: contexto local verificado (ayuntamiento, juzgados contencioso-administrativos de la evidencia), tipos de reclamaciones más frecuentes, relevancia del servicio, qué ofrece el despacho, procedimiento general de reclamación. CTA: "Primera consulta sin compromiso" (NUNCA "consulta gratuita").
- intro_en: traducción al inglés de intro_es. Misma longitud y estructura. CTA: "No-obligation initial consultation" (NUNCA "Free consultation").
- banner_plazos_es: texto HTML breve (2-4 frases) sobre el plazo de 1 año para reclamar responsabilidad patrimonial (art. 67.1 Ley 39/2015 y art. 32 Ley 40/2015). Usa <p>, <strong>. Sin clases ni estilos.
- banner_plazos_en: traducción al inglés.

Cuando no haya datos locales en evidencia: usa normativa real (Ley 39/2015, Ley 40/2015, LJCA), plazos, procedimientos verificables.`),
      validate: (r) => {
        if (!r.intro_es) throw new Error('Falta intro_es');
        const words = countWords(r.intro_es);
        if (words < 500) throw new Error(`intro_es: ${words} palabras (mín 500)`);
        if (!r.banner_plazos_es) throw new Error('Falta banner_plazos_es');
      },
    },
    {
      name: 'tipos_responsabilidad',
      maxTokens: 2000,
      systemPrompt: `Eres un abogado especialista en derecho administrativo y responsabilidad patrimonial. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- tipos_responsabilidad_es: array de EXACTAMENTE 6 objetos {titulo, descripcion, icon}. Tipos de responsabilidad patrimonial de la administración:
  1. Sanitaria (errores en sanidad pública, listas de espera, daños en hospitales públicos)
  2. Urbanística (licencias denegadas indebidamente, inactividad administrativa, expropiaciones)
  3. Vía pública (caídas por mal estado de aceras, baches, señalización deficiente)
  4. Servicios públicos (funcionamiento anormal de servicios, educación, transporte)
  5. Penitenciaria (daños en centros penitenciarios, responsabilidad de Instituciones Penitenciarias)
  6. Educativa (accidentes en centros educativos públicos, bullying no atajado)
  Descripciones de 2-3 frases con normativa real. Menciona datos locales de la evidencia cuando existan. icon: "hospital", "building", "road", "shield", "lock", "school".
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
- sections_es: array de EXACTAMENTE 4 objetos {title, content}. content es HTML (mín 150 palabras cada uno). Secciones informativas sobre responsabilidad patrimonial en ${locality.name}:
  1. Requisitos de la reclamación (daño efectivo, relación causal, funcionamiento anormal, plazo 1 año)
  2. Procedimiento administrativo previo (reclamación ante la administración, silencio administrativo, resolución)
  3. Vía contencioso-administrativa (recurso ante juzgados, plazos, prueba pericial)
  4. Indemnizaciones y valoración del daño (criterios, baremos, tipos de daño indemnizable)
- sections_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.sections_es) || r.sections_es.length !== 4)
          throw new Error('sections_es: exactamente 4');
      },
    },
    {
      name: 'organismos',
      maxTokens: 2000,
      systemPrompt: `Eres un analista que extrae datos verificables de evidencia. SOLO incluyes lo que aparece TEXTUALMENTE en la evidencia. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- organismos_es: array de objetos {nombre, tipo, direccion}. Organismos administrativos y judiciales que aparezcan EXPLÍCITAMENTE en la evidencia SERP para ${locality.name}: ayuntamientos, juzgados contencioso-administrativos, TSJ, delegación de gobierno, etc. tipo: "ayuntamiento", "juzgado", "tribunal", "delegación", etc. Si NO hay evidencia con nombres/direcciones verificables, devuelve array VACÍO [].
- organismos_en: traducción al inglés (mismo array, con tipos traducidos si procede; nombres propios y direcciones se mantienen).

IMPORTANTE: Si la evidencia no contiene nombres exactos de organismos con dirección, devuelve []. No inventes.`),
      validate: (r) => {
        if (!Array.isArray(r.organismos_es)) throw new Error('organismos_es debe ser array');
      },
    },
    {
      name: 'process_faqs',
      maxTokens: 3000,
      systemPrompt: `Eres un abogado especialista en derecho administrativo que explica el proceso legal de forma clara. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- process_es: array de EXACTAMENTE 6 strings. Pasos del proceso legal de reclamación por responsabilidad patrimonial (texto plano, 1-2 frases cada uno).
- process_en: traducción al inglés.
- faqs_es: array de EXACTAMENTE 6 objetos {question, answer}. question en texto plano, answer en HTML. Preguntas frecuentes sobre responsabilidad patrimonial de la administración en ${locality.name}. Respuestas sustanciales (3-5 frases).
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
