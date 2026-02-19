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
      maxTokens: 6000,
      systemPrompt: normalizeText(`Eres un abogado-redactor especialista en accidentes de tráfico con 20 años de experiencia en España. Redactas contenido web que un abogado real firmaría con su nombre. ${rules}

REGLA ANTI-GENERICIDAD: Antes de escribir CADA párrafo, pregúntate: "¿Podría copiar este párrafo en la página de otra ciudad cambiando solo el nombre?" Si la respuesta es SÍ, reescríbelo con información que SOLO aplique a ${locality.name}. Si no hay datos locales para ese punto, sustituye por contenido jurídico de alto valor (jurisprudencia real, cifras concretas del baremo 2024, ejemplos de indemnizaciones tipo, plazos exactos) que un usuario nunca encontraría en un artículo genérico.

PROHIBIDO:
- "los accidentes de tráfico constituyen una de las principales preocupaciones"
- "por su ubicación y características urbanas"
- "tanto en vías urbanas como interurbanas"
- "colisiones en cruces urbanos, atropellos en pasos de peatones"
- Cualquier frase que sea una obviedad aplicable a cualquier ciudad de España`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- intro_es: HTML semántico (<p>, <strong>, <em>, <h3>). 800-1200 palabras.

ESTRUCTURA OBLIGATORIA del intro_es:
1. PRIMER PÁRRAFO (gancho local): Dato concreto de ${locality.name} de la evidencia SERP (carretera específica, punto negro, estadística DGT, accidente reciente reportado). Si la evidencia menciona la N-IV, A-4, M-305 u otra vía, nombrar el tramo exacto y qué tipo de siniestros se producen ahí. NO generalidades.

2. SEGUNDO BLOQUE (valor jurídico real): Explica el baremo de tráfico 2024 con CIFRAS CONCRETAS. Ejemplo: "Una cervicalgia (whiplash) con 45 días de baja se indemniza con aproximadamente 3.200-4.500 € según el baremo actualizado". Da 2-3 ejemplos de indemnizaciones tipo. Esto es lo que el usuario REALMENTE quiere saber.

3. TERCER BLOQUE (proceso paso a paso en ${locality.name}): Dónde se presenta la reclamación (juzgado exacto si está en la evidencia), plazo de 1 año desde estabilización lesiones, los 3 meses de oferta motivada de la aseguradora, diferencia entre vía civil y penal.

4. CUARTO BLOQUE (por qué este despacho): Qué ofrece concretamente: colaboración con peritos médicos independientes para valorar lesiones, experiencia en negociación con aseguradoras, actuación en toda España, atención presencial y online en ${locality.name}. Primera consulta sin compromiso. PROHIBIDO: prometer resultados, decir "maximizar indemnización", decir que adelantamos gastos.

- intro_en: traducción profesional al inglés de intro_es. Misma longitud y estructura.`),
      validate: (r) => {
        if (!r.intro_es) throw new Error('Falta intro_es');
        const words = countWords(r.intro_es);
        if (words < 450) throw new Error(`intro_es: ${words} palabras (mín 450)`);
      },
    },
    {
      name: 'tipos_accidente',
      maxTokens: 1500,
      systemPrompt: normalizeText(`Eres un abogado especialista en siniestralidad vial. ${rules}
FORMATO: Las descripciones deben ser MUY BREVES (máximo 2 frases cortas). Esto aparece en tarjetas pequeñas de una web, NO en un artículo. Cada descripción: lesión típica + rango de indemnización. Nada más.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- tipos_accidente_es: array de 5 objetos {titulo, descripcion, icon}.

FORMATO ESTRICTO de cada descripcion: MÁXIMO 2 frases (30-40 palabras total). Ejemplo:
"Lesiones cervicales y lumbares frecuentes. Indemnización habitual: 2.000 – 6.000 € según días de baja."

Tipos: alcances traseros, colisiones laterales, atropellos, accidentes de moto, accidentes con vehículos pesados.
icon: "car", "motorcycle", "truck", "pedestrian", "shield".
- tipos_accidente_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.tipos_accidente_es) || r.tipos_accidente_es.length < 4) throw new Error('tipos_accidente_es: mín 4');
      },
    },
    {
      name: 'sections',
      maxTokens: 3000,
      systemPrompt: normalizeText(`Eres un abogado-redactor. ${rules}
FORMATO CRÍTICO: Estas secciones aparecen en TARJETAS de una web. El content de cada sección debe tener MÁXIMO 80-100 palabras. Usa listas HTML (<ul><li>) para datos concretos, NO párrafos largos. El usuario escanea, no lee muros de texto.
PROHIBIDO: repetir información de la intro. Cada sección aporta datos nuevos y concretos.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- sections_es: array de EXACTAMENTE 4 objetos {title, content}. content es HTML con listas. MÁXIMO 80-100 palabras cada uno.

SECCIÓN 1 - "Indemnizaciones según el Baremo"
Lista con cifras del baremo 2024:
<ul><li>Perjuicio básico: ~35 €/día</li><li>Moderado: ~58 €/día</li>... etc.</ul>
Solo datos, sin párrafos explicativos.

SECCIÓN 2 - "Plazos legales clave"
Lista de plazos: 72h parte médico, 7 días notificar aseguradora, 3 meses oferta motivada, 1 año prescripción. Formato lista.

SECCIÓN 3 - "Valoración de daños"
Breve: diferencia entre perito de la aseguradora y perito independiente. Tipos de daño (temporal, secuelas, patrimonial). Lista.

SECCIÓN 4 - "Recursos en ${locality.name}"
Datos CONCRETOS de la evidencia: dirección juzgado, comisaría, hospital. Si no hay datos, recursos generales de la Comunidad Autónoma. Lista.

- sections_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.sections_es) || r.sections_es.length !== 4) throw new Error('sections_es: exactamente 4');
      },
    },
    {
      name: 'que_hacer',
      maxTokens: 1500,
      systemPrompt: normalizeText(`Eres un abogado dando instrucciones rápidas a un cliente. ${rules}
FORMATO: Aparece en tarjetas pequeñas. Cada descripcion: MÁXIMO 2 frases cortas y directas (20-30 palabras). Sin rodeos.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- que_hacer_es: array de 6 objetos {paso, titulo, descripcion}. paso es "1","2"...

MÁXIMO 2 frases cortas por descripcion (20-30 palabras). Ejemplo:
"Llama al 112 y asegura la zona. La Policía Local de ${locality.name} acudirá al lugar."

Pasos: 1.Seguridad+112  2.Atención médica (72h)  3.Fotos y pruebas  4.No firmar nada de la aseguradora  5.Atestado policial  6.Contactar abogado

- que_hacer_en: traducción al inglés.`),
      validate: (r) => {
        if (!Array.isArray(r.que_hacer_es) || r.que_hacer_es.length < 5) throw new Error('que_hacer_es: mín 5');
      },
    },
    {
      name: 'process_faqs',
      maxTokens: 3000,
      systemPrompt: normalizeText(`Eres un abogado que responde preguntas de clientes de forma directa y con datos. ${rules}
FORMATO process: Cada paso es 1 frase directa (15-25 palabras).
FORMATO FAQs: Cada answer es 2-3 frases con datos concretos (cifras, plazos, artículos). NO párrafos largos. El answer es texto plano, NO HTML.`),
      userPrompt: normalizeText(`${context}

Genera JSON con:
- process_es: array de EXACTAMENTE 6 strings. 1 frase por paso (15-25 palabras). Ejemplo:
"Analizamos tu caso y documentación en la primera consulta sin compromiso para evaluar la viabilidad de la reclamación."

Pasos: consulta inicial → pruebas y peritaje → reclamación extrajudicial (3 meses) → negociación oferta → demanda judicial → cobro indemnización

- process_en: traducción al inglés.

- faqs_es: array de EXACTAMENTE 6 objetos {question, answer}. answer en texto plano, 2-3 frases máximo con cifras concretas.

Preguntas (adaptadas a ${locality.name}):
1. "¿Cuánto puedo cobrar por un accidente de tráfico?" — Rangos: cervicalgia 2.000-6.000€, fractura 8.000-15.000€, graves 30.000€+
2. "¿Cuánto tarda la reclamación?" — Extrajudicial 3-6 meses, judicial 12-18 meses
3. "¿Y si el accidente fue parcialmente culpa mía?" — Concurrencia de culpas, reducción proporcional
4. "¿Puedo reclamar sin parte amistoso?" — Alternativas: atestado, testigos, cámaras
5. "¿Me puede obligar la aseguradora a ir a su médico?" — Derechos, perito independiente
6. "¿Necesito abogado?" — Cuándo sí, ventaja media 30-40% más indemnización

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
