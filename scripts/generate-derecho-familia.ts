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
      maxTokens: 6000,
      systemPrompt: normalizeText(`Eres un abogado-redactor especialista en derecho de familia con 20 años de experiencia. Tono empático y comprensivo, pero con datos jurídicos concretos. ${rules}

REGLA ANTI-GENERICIDAD: Antes de escribir CADA párrafo, pregúntate: "¿Podría copiar este párrafo en la página de otra ciudad cambiando solo el nombre?" Si SÍ, reescríbelo con datos que SOLO apliquen a ${locality.name} o con contenido jurídico de alto valor (artículos del CC, cifras de pensiones, jurisprudencia).

PROHIBIDO:
- "los procesos de familia son situaciones difíciles"
- "cada caso es único"
- "le acompañamos en este momento difícil"
- Cualquier frase motivacional genérica`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- intro_es: HTML semántico (<p>, <strong>, <em>, <h3>). 800-1200 palabras.

ESTRUCTURA OBLIGATORIA:
1. GANCHO LOCAL: Juzgados de familia en ${locality.name} (de la evidencia SERP), volumen de divorcios si hay datos, particularidades del partido judicial.
2. VALOR JURÍDICO REAL: Tipos de divorcio (mutuo acuerdo vs contencioso), plazos reales (2-3 meses mutuo acuerdo, 6-12 meses contencioso), coste medio orientativo, qué incluye el convenio regulador.
3. PENSIONES Y CUSTODIA: Criterios para fijar pensión alimenticia (proporción ingresos, necesidades hijos), custodia compartida vs exclusiva, régimen de visitas estándar. CIFRAS: pensión media en España 150-400€/hijo.
4. POR QUÉ ESTE DESPACHO: Mediación, negociación extrajudicial, atención presencial y online en ${locality.name}, primera consulta sin compromiso.

- intro_en: traducción profesional al inglés. Misma longitud y estructura.
- banner_confidencialidad_es: 2-3 frases sobre discreción en asuntos familiares. BREVE.
- banner_confidencialidad_en: traducción.`),
      validate: (r) => {
        if (!r.intro_es) throw new Error('Falta intro_es');
        const words = countWords(r.intro_es);
        if (words < 450) throw new Error(`intro_es: ${words} palabras (mín 450)`);
        if (!r.banner_confidencialidad_es) throw new Error('Falta banner_confidencialidad_es');
      },
    },
    {
      name: 'areas',
      maxTokens: 1500,
      systemPrompt: normalizeText(`Eres un abogado de familia. ${rules}
FORMATO: Aparece en tarjetas pequeñas. Cada descripcion: MÁXIMO 2 frases cortas (30-40 palabras). Sin rodeos.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- areas_es: array de 6 objetos {titulo, descripcion, icon}.

MÁXIMO 2 frases por descripcion (30-40 palabras). Ejemplo:
"Tramitamos divorcios de mutuo acuerdo en 2-3 meses. Contenciosos: 6-12 meses con defensa completa."

Áreas: divorcios, custodias, pensiones alimenticias, régimen de visitas, liquidación gananciales, medidas paterno-filiales.
icon: "heart", "users", "money", "calendar", "scale", "shield".
- areas_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.areas_es) || r.areas_es.length < 4) throw new Error('areas_es: mín 4');
      },
    },
    {
      name: 'sections',
      maxTokens: 3000,
      systemPrompt: normalizeText(`Eres un abogado de familia. ${rules}
FORMATO CRÍTICO: Aparecen en TARJETAS. Cada content: MÁXIMO 80-100 palabras. Usa listas HTML (<ul><li>) para datos concretos. NO párrafos largos.
PROHIBIDO: repetir info de la intro.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- sections_es: array de EXACTAMENTE 4 objetos {title, content}. content es HTML con listas. MÁXIMO 80-100 palabras cada uno.

SECCIÓN 1 - "Mediación familiar"
Lista: cuándo procede, ventajas (más rápido, más barato, menos conflicto), recursos en ${locality.name} de la evidencia.

SECCIÓN 2 - "Convenio regulador"
Lista: qué debe incluir (custodia, pensión, vivienda, régimen visitas), homologación judicial.

SECCIÓN 3 - "Custodia compartida"
Lista: criterios del juez (edad hijos, proximidad domicilios, horarios padres), porcentaje de custodias compartidas en España (~40%).

SECCIÓN 4 - "Modificación de medidas"
Lista: cuándo se puede pedir (cambio ingresos, cambio residencia, mayoría edad hijo), plazo y procedimiento.

- sections_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.sections_es) || r.sections_es.length !== 4) throw new Error('sections_es: exactamente 4');
      },
    },
    {
      name: 'que_saber',
      maxTokens: 1500,
      systemPrompt: normalizeText(`Eres un abogado de familia dando consejos rápidos. ${rules}
FORMATO: Tarjetas pequeñas. Cada descripcion: MÁXIMO 2 frases cortas (20-30 palabras).`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- que_saber_es: array de 6 objetos {paso, titulo, descripcion}. paso es "1","2"...

MÁXIMO 2 frases cortas por descripcion. Ejemplo:
"El divorcio de mutuo acuerdo requiere mínimo 3 meses de matrimonio. Se resuelve en 2-3 meses."

Temas: 1.Tipos de divorcio  2.Pensión alimenticia  3.Custodia  4.Vivienda familiar  5.Mediación  6.Documentación necesaria

- que_saber_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.que_saber_es) || r.que_saber_es.length < 5) throw new Error('que_saber_es: mín 5');
      },
    },
    {
      name: 'process_faqs',
      maxTokens: 3000,
      systemPrompt: normalizeText(`Eres un abogado de familia que responde preguntas de clientes de forma directa. ${rules}
FORMATO process: 1 frase por paso (15-25 palabras).
FORMATO FAQs: 2-3 frases con datos concretos. Texto plano, NO HTML.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- process_es: array de EXACTAMENTE 6 strings. 1 frase por paso (15-25 palabras).
Pasos: consulta inicial → estudio del caso → negociación/mediación → demanda si necesario → juicio → ejecución sentencia

- process_en: traducción al inglés.

- faqs_es: array de EXACTAMENTE 6 objetos {question, answer}. answer en texto plano, 2-3 frases con cifras.

Preguntas (adaptadas a ${locality.name}):
1. "¿Cuánto cuesta un divorcio?" — Mutuo acuerdo 800-1.500€, contencioso 2.000-5.000€+
2. "¿Cuánto tarda un divorcio?" — Mutuo acuerdo 2-3 meses, contencioso 6-12 meses
3. "¿Cómo se calcula la pensión alimenticia?" — Proporción ingresos, necesidades hijos, media 150-400€/hijo
4. "¿Puedo pedir custodia compartida?" — Criterios, requisitos, tendencia judicial actual
5. "¿Qué pasa con la vivienda familiar?" — Se asigna al cónyuge custodio, alternativas
6. "¿Se puede modificar el convenio regulador?" — Sí, por cambio sustancial de circunstancias

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
- stats_es: array de EXACTAMENTE 4 objetos {value, label}. Estadísticas para la barra del hero. Locales (de la evidencia) o nacionales verificables.
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
