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
      maxTokens: 6000,
      systemPrompt: normalizeText(`Eres un abogado-redactor especialista en extranjería e inmigración con 20 años de experiencia en España. ${rules}

REGLA ANTI-GENERICIDAD: Cada párrafo debe contener datos que SOLO apliquen a ${locality.name} o contenido jurídico de alto valor (artículos LO 4/2000, RD 557/2011, plazos concretos, requisitos verificables).

PROHIBIDO:
- "la inmigración es un fenómeno complejo"
- "cada caso es diferente"
- "España es un país multicultural"
- Cualquier frase genérica sobre inmigración`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- intro_es: HTML semántico (<p>, <strong>, <em>, <h3>). 800-1200 palabras.

ESTRUCTURA OBLIGATORIA:
1. GANCHO LOCAL: Oficina de extranjería o delegación de gobierno en ${locality.name} (de la evidencia SERP). Población extranjera si hay datos. Contexto: trámites que se gestionan en esta localidad.
2. VALOR JURÍDICO REAL: Tipos de permisos más solicitados con REQUISITOS CONCRETOS: arraigo social (3 años + contrato + informe integración), arraigo familiar (padre/madre de menor español), arraigo laboral (2 años + relación laboral). Plazos de resolución: 3 meses silencio positivo residencia temporal.
3. PROCESO PASO A PASO: Dónde se presenta la solicitud (sede electrónica, oficina de extranjería), documentación necesaria, tasas (modelo 790 código 052, importe ~15-40€), toma de huellas, tarjeta TIE.
4. POR QUÉ ESTE DESPACHO: Experiencia en extranjería, tramitación de recursos contra denegaciones, atención en varios idiomas, presencial y online en ${locality.name}. Primera consulta sin compromiso.

- intro_en: traducción profesional al inglés. Misma longitud y estructura.
- banner_oficina_es: 2-3 frases sobre la oficina de extranjería local. BREVE. Datos de la evidencia si existen.
- banner_oficina_en: traducción.`),
      validate: (r) => {
        if (!r.intro_es) throw new Error('Falta intro_es');
        const words = countWords(r.intro_es);
        if (words < 450) throw new Error(`intro_es: ${words} palabras (mín 450)`);
        if (!r.banner_oficina_es) throw new Error('Falta banner_oficina_es');
      },
    },
    {
      name: 'tipos_permiso',
      maxTokens: 1500,
      systemPrompt: normalizeText(`Eres un abogado de extranjería. ${rules}
FORMATO: Tarjetas pequeñas. Cada descripcion: MÁXIMO 2 frases cortas (30-40 palabras). Requisito principal + plazo.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- tipos_permiso_es: array de EXACTAMENTE 6 objetos {titulo, descripcion, icon}.

MÁXIMO 2 frases por descripcion (30-40 palabras). Ejemplo:
"Requiere 3 años de residencia continuada, contrato de trabajo e informe de integración social. Resolución en 3 meses."

Tipos: arraigo social, arraigo familiar, arraigo laboral, residencia comunitaria, reagrupación familiar, renovaciones.
icon: "home", "users", "briefcase", "flag", "heart", "refresh".
- tipos_permiso_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.tipos_permiso_es) || r.tipos_permiso_es.length < 6)
          throw new Error('tipos_permiso_es: mín 6');
      },
    },
    {
      name: 'sections',
      maxTokens: 3000,
      systemPrompt: normalizeText(`Eres un abogado de extranjería. ${rules}
FORMATO CRÍTICO: Tarjetas. Cada content: MÁXIMO 80-100 palabras. Listas HTML (<ul><li>). NO párrafos largos.
PROHIBIDO: repetir info de la intro.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- sections_es: array de EXACTAMENTE 4 objetos {title, content}. content es HTML con listas. MÁXIMO 80-100 palabras cada uno.

SECCIÓN 1 - "Arraigo social: requisitos"
Lista: 3 años residencia, empadronamiento, contrato de trabajo o medios económicos, informe de integración social, antecedentes penales limpios.

SECCIÓN 2 - "Reagrupación familiar"
Lista: quién puede reagrupar, familiares reagrupables (cónyuge, hijos, ascendientes), requisitos económicos (IPREM), vivienda adecuada.

SECCIÓN 3 - "Renovación de permisos"
Lista: plazo 60 días antes / 90 días después de caducidad, documentación, consecuencias de retraso, silencio administrativo positivo.

SECCIÓN 4 - "Recursos ante denegación"
Lista: recurso de reposición (1 mes), recurso contencioso-administrativo (2 meses), cautelarísima para evitar expulsión.

- sections_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.sections_es) || r.sections_es.length !== 4)
          throw new Error('sections_es: exactamente 4');
      },
    },
    {
      name: 'documentacion',
      maxTokens: 1500,
      systemPrompt: normalizeText(`Eres un abogado dando instrucciones claras a un cliente extranjero. ${rules}
FORMATO: Tarjetas pequeñas. Cada descripcion: MÁXIMO 2 frases cortas (20-30 palabras).`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- documentacion_es: array de 6 objetos {paso, titulo, descripcion}. paso es "1","2"...

MÁXIMO 2 frases cortas por descripcion. Ejemplo:
"Certificado de empadronamiento del Ayuntamiento de ${locality.name}. Debe acreditar al menos 3 años de residencia."

Documentos: 1.Pasaporte vigente  2.Empadronamiento  3.Antecedentes penales  4.Contrato de trabajo  5.Informe de integración social  6.Tasa modelo 790

- documentacion_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.documentacion_es) || r.documentacion_es.length < 5)
          throw new Error('documentacion_es: mín 5');
      },
    },
    {
      name: 'process_faqs',
      maxTokens: 3000,
      systemPrompt: normalizeText(`Eres un abogado de extranjería que responde preguntas de forma directa. ${rules}
FORMATO process: 1 frase por paso (15-25 palabras).
FORMATO FAQs: 2-3 frases con datos concretos. Texto plano, NO HTML.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- process_es: array de EXACTAMENTE 6 strings. 1 frase por paso (15-25 palabras).
Pasos: consulta inicial → análisis de situación migratoria → preparación documentación → presentación solicitud → seguimiento expediente → obtención TIE

- process_en: traducción al inglés.

- faqs_es: array de EXACTAMENTE 6 objetos {question, answer}. answer en texto plano, 2-3 frases con datos.

Preguntas:
1. "¿Cuánto tarda en resolverse un arraigo social?" — 3 meses plazo legal, silencio positivo
2. "¿Puedo trabajar mientras tramito el permiso?" — Depende del tipo, autorización provisional
3. "¿Qué pasa si me deniegan el permiso?" — Recurso reposición 1 mes, contencioso 2 meses
4. "¿Necesito contrato de trabajo para el arraigo?" — Sí para arraigo social, alternativa: medios económicos
5. "¿Puedo salir de España mientras tramito?" — Riesgo de perder la solicitud, excepciones
6. "¿Cuánto cuesta tramitar un permiso de residencia?" — Tasas oficiales 15-40€, honorarios aparte

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
