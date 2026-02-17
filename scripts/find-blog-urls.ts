/**
 * Script para encontrar las URLs reales de los artículos del blog
 * desde la web antigua de GVCAbogados
 */

import * as cheerio from 'cheerio';

// Lista de títulos de artículos
const ARTICLE_TITLES = [
  'Cómo solicitar el arraigo social en Murcia',
  'Matrimonio civil vs matrimonio religioso: implicaciones legales en España y recomendaciones prácticas',
  '¿Qué hacer si el inquilino no paga el alquiler? Guía legal práctica para propietarios en Murcia',
  'Cómo hacer un testamento válido en España: guía completa con enfoque práctico',
  'Reclamación por latigazo cervical: requisitos y pruebas',
  '¿Cuánto tarda en cobrarse una indemnización por accidente de tráfico?',
  'Abogados de extranjería en Murcia: trámites más comunes',
  'Impugnación de testamento: cuándo es posible',
  'Denuncia vs querella: qué diferencia hay y cuándo usar cada una',
  'Modificación de medidas en custodia y pensión: cuándo es posible',
  'Contrato de arras: qué es y qué riesgos tiene',
  'Diferencia entre mala praxis y negligencia médica: lo que debes saber',
  'Muertes hospitalarias: cuándo puede existir negligencia médica',
  '¿Qué pasa si no pago una multa en Murcia?',
  'Contratos de alquiler en Murcia: puntos clave para no tener problemas',
  'Impuestos que se pagan al heredar en Murcia',
  'Orden de alejamiento: qué significa y cómo se solicita',
  'Divorcio en Murcia: cuánto cuesta y cuánto tarda',
  'Delito de lesiones: claves legales y jurisprudencia actual para no perder su caso',
  'Indemnización por negligencia médica: cómo se calcula en España',
  'Mediación vs Arbitraje: Diferencias clave',
  '¿Qué hacer si heredas deudas con la herencia? Guía práctica de GVC Abogados (Murcia)',
  'Renovación de tarjeta de residencia: plazos y documentos',
  'Mejores abogados de negligencias médicas en Murcia: guía práctica para elegir con acierto',
  '¿Cuánto tiempo tarda un juicio en España?',
  '¿Qué hacer si recibes una citación judicial como investigado?',
  '¿Qué consecuencias tiene un delito de alcoholemia al volante?',
  'Divorcio express en Murcia: requisitos y procedimiento',
  '¿Cómo reclamar una negligencia médica en Murcia paso a paso?',
  'Lesiones permanentes tras un accidente: cómo reclamar indemnización en Murcia',
  'Reagrupación familiar en España: guía práctica y actualizada',
  '¿Qué pruebas necesito para demostrar una negligencia médica?',
  'Inhabilitación profesional: en qué casos se aplica',
  'Mi ex pareja no cumple con el régimen de visitas: soluciones legales en Murcia',
  '¿Qué pasa si me despiden estando de baja médica?',
  'Vicios ocultos en una vivienda: cómo reclamar al vendedor'
];

/**
 * Busca las URLs reales de los artículos en el sitemap o blog listing
 */
async function findBlogUrls() {
  console.log('🔍 Buscando URLs de artículos en la web antigua...\n');

  try {
    // Intentar primero el sitemap
    const sitemapUrl = 'https://www.gvcabogados.com/index.php?option=com_jmap&view=sitemap&lang=es';
    console.log(`📄 Obteniendo sitemap: ${sitemapUrl}`);
    
    const response = await fetch(sitemapUrl);
    if (!response.ok) {
      console.log(`⚠️  Error obteniendo sitemap: ${response.status}`);
      return generateEstimatedUrls();
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Buscar todos los enlaces en la página
    const articleUrls: { title: string; url: string }[] = [];
    
    // Buscar enlaces que contengan los títulos
    $('a').each((_, elem) => {
      const linkText = $(elem).text().trim();
      const href = $(elem).attr('href');
      
      if (href && linkText) {
        // Verificar si el texto coincide con alguno de los títulos
        const matchingTitle = ARTICLE_TITLES.find(title => 
          normalizeString(title) === normalizeString(linkText)
        );

        if (matchingTitle && (href.includes('blog') || href.includes('actualidad'))) {
          // Construir URL completa
          const fullUrl = href.startsWith('http') 
            ? href 
            : `https://www.gvcabogados.com${href}`;

          articleUrls.push({
            title: matchingTitle,
            url: fullUrl
          });

          console.log(`✅ Encontrado: ${matchingTitle}`);
          console.log(`   URL: ${fullUrl}\n`);
        }
      }
    });

    // Para los que no encontramos, generar URLs estimadas
    const foundTitles = new Set(articleUrls.map(a => a.title));
    const notFound = ARTICLE_TITLES.filter(t => !foundTitles.has(t));

    if (notFound.length > 0) {
      console.log(`\n⚠️  No se encontraron URLs para ${notFound.length} artículos. Generando URLs estimadas...\n`);
      
      notFound.forEach(title => {
        const estimatedUrl = generateUrlFromTitle(title);
        articleUrls.push({
          title,
          url: estimatedUrl
        });
        console.log(`🔮 Estimado: ${title}`);
        console.log(`   URL: ${estimatedUrl}\n`);
      });
    }

    // Guardar resultados en un archivo JSON
    const output = {
      total: articleUrls.length,
      found: articleUrls.length - notFound.length,
      estimated: notFound.length,
      articles: articleUrls
    };

    const outputPath = 'scripts/blog-urls.json';
    await Bun.write(outputPath, JSON.stringify(output, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN');
    console.log('='.repeat(60));
    console.log(`✅ URLs encontradas: ${articleUrls.length - notFound.length}`);
    console.log(`🔮 URLs estimadas: ${notFound.length}`);
    console.log(`📁 Guardado en: ${outputPath}`);
    console.log('='.repeat(60));

    return articleUrls;

  } catch (error) {
    console.error('❌ Error buscando URLs:', error);
    return generateEstimatedUrls();
  }
}

/**
 * Normaliza string para comparación
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Genera URL estimada desde el título
 */
function generateUrlFromTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return `https://www.gvcabogados.com/actualidad/${slug}`;
}

/**
 * Genera todas las URLs estimadas
 */
function generateEstimatedUrls() {
  console.log('🔮 Generando todas las URLs estimadas...\n');
  
  return ARTICLE_TITLES.map(title => ({
    title,
    url: generateUrlFromTitle(title)
  }));
}

// Ejecutar
findBlogUrls().catch(console.error);
