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
      maxTokens: 6000,
      systemPrompt: normalizeText(`Eres un abogado-redactor especialista en negligencia médica y responsabilidad sanitaria con 20 años de experiencia. ${rules}

REGLA ANTI-GENERICIDAD: Antes de escribir CADA párrafo, pregúntate: "¿Podría copiar este párrafo en la página de otra ciudad cambiando solo el nombre?" Si SÍ, reescríbelo con datos locales de la evidencia o con contenido jurídico de alto valor (Ley 41/2002, plazos concretos, tipos de indemnización, jurisprudencia TS).

PROHIBIDO:
- "la negligencia médica es un tema complejo"
- "cada caso requiere un análisis individualizado"
- "contar con profesionales especializados es fundamental"
- Cualquier frase obvia aplicable a cualquier ciudad`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- intro_es: HTML semántico (<p>, <strong>, <em>, <h3>). 800-1200 palabras.

ESTRUCTURA OBLIGATORIA:
1. GANCHO LOCAL: Hospitales y centros sanitarios de ${locality.name} (de la evidencia SERP). Servicio de salud de la comunidad autónoma. Contexto: dónde se producen las negligencias en esta localidad.
2. VALOR JURÍDICO REAL: Qué constituye negligencia médica (lex artis), diferencia entre error médico y negligencia, carga de la prueba (inversión en algunos supuestos). Plazos: 1 año desde conocimiento del daño (civil), 1 año (administrativa). Cifras: indemnizaciones medias por tipo de negligencia (diagnóstico tardío cáncer: 50.000-300.000€, error quirúrgico: 30.000-200.000€, infección nosocomial: 10.000-80.000€).
3. VÍAS DE RECLAMACIÓN: Vía civil (contra médico/clínica privada), vía administrativa (contra sanidad pública, art. 32 Ley 40/2015), vía penal (imprudencia grave). Juzgados competentes de la evidencia SERP.
4. POR QUÉ ESTE DESPACHO: Colaboración con peritos médicos independientes, experiencia en reclamaciones contra sanidad pública y privada, atención presencial y online, primera consulta sin compromiso. PROHIBIDO: prometer resultados, decir "maximizar", decir que adelantamos gastos.

- intro_en: traducción profesional al inglés. Misma longitud y estructura.`),
      validate: (r) => {
        if (!r.intro_es) throw new Error('Falta intro_es');
        const words = countWords(r.intro_es);
        if (words < 450) throw new Error(`intro_es: ${words} palabras (mín 450)`);
      },
    },
    {
      name: 'tipos_negligencia',
      maxTokens: 1500,
      systemPrompt: normalizeText(`Eres un abogado especialista en responsabilidad sanitaria. ${rules}
FORMATO: Tarjetas pequeñas. Cada descripcion: MÁXIMO 2 frases cortas (30-40 palabras). Lesión típica + rango de indemnización.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- tipos_negligencia_es: array de 6 objetos {titulo, descripcion, icon}.

MÁXIMO 2 frases por descripcion (30-40 palabras). Ejemplo:
"Diagnóstico tardío o erróneo que agrava el pronóstico. Indemnizaciones de 30.000 a 300.000 € según la gravedad."

Tipos: errores diagnóstico, errores quirúrgicos, negligencia en urgencias/triaje, negligencia obstétrica, errores de medicación, infecciones hospitalarias.
icon: "stethoscope", "scalpel", "ambulance", "baby", "pill", "hospital".
- tipos_negligencia_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.tipos_negligencia_es) || r.tipos_negligencia_es.length < 4)
          throw new Error('tipos_negligencia_es: mín 4');
      },
    },
    {
      name: 'sections',
      maxTokens: 3000,
      systemPrompt: normalizeText(`Eres un abogado especialista en negligencias médicas. ${rules}
FORMATO CRÍTICO: Tarjetas. Cada content: MÁXIMO 80-100 palabras. Listas HTML (<ul><li>). NO párrafos largos.
PROHIBIDO: repetir info de la intro.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- sections_es: array de EXACTAMENTE 4 objetos {title, content}. content es HTML con listas. MÁXIMO 80-100 palabras cada uno.

SECCIÓN 1 - "Requisitos de la reclamación"
Lista: lex artis, relación causal, daño acreditable, informe pericial médico, historia clínica.

SECCIÓN 2 - "Peritaje médico"
Lista: quién lo realiza (perito independiente), qué valora, diferencia con médico forense, coste orientativo.

SECCIÓN 3 - "Vía civil vs administrativa"
Lista: civil (médico/clínica privada, 1 año plazo), administrativa (sanidad pública, 1 año, art. 32 Ley 40/2015), penal (imprudencia grave).

SECCIÓN 4 - "Recursos sanitarios en ${locality.name}"
Datos de la evidencia SERP: hospitales, centros de salud, servicio autonómico de salud. Si no hay datos, recursos generales.

- sections_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.sections_es) || r.sections_es.length !== 4)
          throw new Error('sections_es: exactamente 4');
      },
    },
    {
      name: 'hospitales',
      maxTokens: 1500,
      systemPrompt: `Eres un analista que extrae datos verificables de evidencia. SOLO incluyes lo que aparece TEXTUALMENTE en la evidencia. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- hospitales_es: array de objetos {nombre, tipo, direccion}. Hospitales y centros de salud que aparezcan EXPLÍCITAMENTE en la evidencia SERP. Si NO hay evidencia con nombres/direcciones verificables, devuelve array VACÍO [].
- hospitales_en: traducción al inglés (direcciones se mantienen).

IMPORTANTE: Si la evidencia no contiene nombres exactos con dirección, devuelve []. No inventes.`),
      validate: (r) => {
        if (!Array.isArray(r.hospitales_es)) throw new Error('hospitales_es debe ser array');
      },
    },
    {
      name: 'process_faqs',
      maxTokens: 3000,
      systemPrompt: normalizeText(`Eres un abogado de negligencias médicas que responde preguntas de forma directa. ${rules}
FORMATO process: 1 frase por paso (15-25 palabras).
FORMATO FAQs: 2-3 frases con datos concretos. Texto plano, NO HTML.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- process_es: array de EXACTAMENTE 6 strings. 1 frase por paso (15-25 palabras).
Pasos: consulta inicial → obtener historia clínica → peritaje médico → reclamación administrativa o extrajudicial → demanda judicial → cobro indemnización

- process_en: traducción al inglés.

- faqs_es: array de EXACTAMENTE 6 objetos {question, answer}. answer en texto plano, 2-3 frases con cifras.

Preguntas:
1. "¿Cuánto puedo cobrar por una negligencia médica?" — Rangos: diagnóstico tardío 30.000-300.000€, error quirúrgico 30.000-200.000€, infección 10.000-80.000€
2. "¿Cuánto tiempo tengo para reclamar?" — 1 año desde conocimiento del daño, vía civil y administrativa
3. "¿Cómo demuestro la negligencia?" — Informe pericial médico independiente, historia clínica, pruebas
4. "¿Puedo reclamar contra la sanidad pública?" — Sí, vía administrativa (art. 32 Ley 40/2015)
5. "¿Quién paga el perito médico?" — El coste del perito lo asume el cliente, pero se puede incluir como gasto reclamable en la indemnización
6. "¿Qué diferencia hay entre error médico y negligencia?" — Error no siempre = negligencia, clave: lex artis

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
- stats_es: array de EXACTAMENTE 4 objetos {value, label}. Estadísticas para la barra del hero.
- stats_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.stats_es) || r.stats_es.length !== 4)
          throw new Error('stats_es: exactamente 4');
      },
    },
    {
      name: 'banner_plazos',
      maxTokens: 500,
      systemPrompt: `Eres un abogado que informa sobre plazos de reclamación. ${rules}`,
      userPrompt: normalizeText(`${context}

Genera JSON con:
- banner_plazos_es: texto HTML breve (2-3 frases). Plazos: 1 año vía civil, 1 año vía administrativa. Usa <p>, <strong>. BREVE.
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
