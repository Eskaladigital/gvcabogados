/**
 * Script de migración de artículos de blog desde la web antigua
 * Scrapea, descarga imágenes, convierte a WebP e inserta en Supabase
 */

import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno del archivo .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import sharp from 'sharp';

// Configuración
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Lista de URLs reales de artículos a migrar (obtenidas del sitemap)
const BLOG_ARTICLES = [
  {
    title: 'Cómo solicitar el arraigo social en Murcia',
    oldUrl: 'https://www.gvcabogados.com/es/blog/como-solicitar-el-arraigo-social-en-murcia'
  },
  {
    title: 'Matrimonio civil vs matrimonio religioso: implicaciones legales en España y recomendaciones prácticas',
    oldUrl: 'https://www.gvcabogados.com/es/blog/matrimonio-civil-vs-matrimonio-religioso-implicaciones-legales-en-espana-y-recomendaciones-practicas'
  },
  {
    title: '¿Qué hacer si el inquilino no paga el alquiler? Guía legal práctica para propietarios en Murcia',
    oldUrl: 'https://www.gvcabogados.com/es/blog/que-hacer-si-el-inquilino-no-paga-el-alquiler-guia-legal-practica-para-propietarios-en-murcia'
  },
  {
    title: 'Cómo hacer un testamento válido en España: guía completa con enfoque práctico',
    oldUrl: 'https://www.gvcabogados.com/es/blog/como-hacer-un-testamento-valido-en-espana-guia-completa-con-enfoque-practico'
  },
  {
    title: 'Reclamación por latigazo cervical: requisitos y pruebas',
    oldUrl: 'https://www.gvcabogados.com/es/blog/reclamacion-por-latigazo-cervical-requisitos-y-pruebas'
  },
  {
    title: '¿Cuánto tarda en cobrarse una indemnización por accidente de tráfico?',
    oldUrl: 'https://www.gvcabogados.com/es/blog/cuanto-tarda-en-cobrarse-una-indemnizacion-por-accidente-de-trafico'
  },
  {
    title: 'Abogados de extranjería en Murcia: trámites más comunes',
    oldUrl: 'https://www.gvcabogados.com/es/blog/abogados-de-extranjeria-en-murcia-tramites-mas-comunes'
  },
  {
    title: 'Impugnación de testamento: cuándo es posible',
    oldUrl: 'https://www.gvcabogados.com/es/blog/impugnacion-de-testamento-cuando-es-posible'
  },
  {
    title: 'Denuncia vs querella: qué diferencia hay y cuándo usar cada una',
    oldUrl: 'https://www.gvcabogados.com/es/blog/denuncia-vs-querella-que-diferencia-hay-y-cuando-usar-cada-una'
  },
  {
    title: 'Modificación de medidas en custodia y pensión: cuándo es posible',
    oldUrl: 'https://www.gvcabogados.com/es/blog/modificacion-de-medidas-en-custodia-y-pension-cuando-es-posible'
  },
  {
    title: 'Contrato de arras: qué es y qué riesgos tiene',
    oldUrl: 'https://www.gvcabogados.com/es/blog/contrato-de-arras-que-es-y-que-riesgos-tiene'
  },
  {
    title: 'Diferencia entre mala praxis y negligencia médica: lo que debes saber',
    oldUrl: 'https://www.gvcabogados.com/es/blog/diferencia-entre-mala-praxis-y-negligencia-medica-lo-que-debes-saber'
  },
  {
    title: 'Muertes hospitalarias: cuándo puede existir negligencia médica',
    oldUrl: 'https://www.gvcabogados.com/es/blog/muertes-hospitalarias-cuando-puede-existir-negligencia-medica'
  },
  {
    title: '¿Qué pasa si no pago una multa en Murcia?',
    oldUrl: 'https://www.gvcabogados.com/es/blog/que-pasa-si-no-pago-una-multa-en-murcia'
  },
  {
    title: 'Contratos de alquiler en Murcia: puntos clave para no tener problemas',
    oldUrl: 'https://www.gvcabogados.com/es/blog/contratos-de-alquiler-en-murcia-puntos-clave-para-no-tener-problemas'
  },
  {
    title: 'Impuestos que se pagan al heredar en Murcia',
    oldUrl: 'https://www.gvcabogados.com/es/blog/impuestos-que-se-pagan-al-heredar-en-murcia'
  },
  {
    title: 'Orden de alejamiento: qué significa y cómo se solicita',
    oldUrl: 'https://www.gvcabogados.com/es/blog/orden-de-alejamiento-que-significa-y-como-se-solicita'
  },
  {
    title: 'Divorcio en Murcia: cuánto cuesta y cuánto tarda',
    oldUrl: 'https://www.gvcabogados.com/es/blog/divorcio-en-murcia-cuanto-cuesta-y-cuanto-tarda'
  },
  {
    title: 'Delito de lesiones: claves legales y jurisprudencia actual para no perder su caso',
    oldUrl: 'https://www.gvcabogados.com/es/blog/delito-de-lesiones-claves-legales-y-jurisprudencia-actual-para-no-perder-su-caso'
  },
  {
    title: 'Indemnización por negligencia médica: cómo se calcula en España',
    oldUrl: 'https://www.gvcabogados.com/es/blog/indemnizacion-por-negligencia-medica-como-se-calcula-en-espana'
  },
  {
    title: 'Mediación vs Arbitraje: Diferencias clave',
    oldUrl: 'https://www.gvcabogados.com/es/blog/mediacion-vs-arbitraje-diferencias-clave'
  },
  {
    title: '¿Qué hacer si heredas deudas con la herencia? Guía práctica de GVC Abogados (Murcia)',
    oldUrl: 'https://www.gvcabogados.com/es/blog/que-hacer-si-heredas-deudas-con-la-herencia-guia-practica-de-gvc-abogados-murcia'
  },
  {
    title: 'Renovación de tarjeta de residencia: plazos y documentos',
    oldUrl: 'https://www.gvcabogados.com/es/blog/renovacion-de-tarjeta-de-residencia-plazos-y-documentos'
  },
  {
    title: 'Mejores abogados de negligencias médicas en Murcia: guía práctica para elegir con acierto',
    oldUrl: 'https://www.gvcabogados.com/es/blog/mejores-abogados-de-negligencias-medicas-en-murcia-guia-practica-para-elegir-con-acierto'
  },
  {
    title: '¿Cuánto tiempo tarda un juicio en España?',
    oldUrl: 'https://www.gvcabogados.com/es/blog/cuanto-tiempo-tarda-un-juicio-en-espana'
  },
  {
    title: '¿Qué hacer si recibes una citación judicial como investigado?',
    oldUrl: 'https://www.gvcabogados.com/es/blog/que-hacer-si-recibes-una-citacion-judicial-como-investigado'
  },
  {
    title: '¿Qué consecuencias tiene un delito de alcoholemia al volante?',
    oldUrl: 'https://www.gvcabogados.com/es/blog/que-consecuencias-tiene-un-delito-de-alcoholemia-al-volante'
  },
  {
    title: 'Divorcio express en Murcia: requisitos y procedimiento',
    oldUrl: 'https://www.gvcabogados.com/es/blog/divorcio-express-en-murcia-requisitos-y-procedimiento'
  },
  {
    title: '¿Cómo reclamar una negligencia médica en Murcia paso a paso?',
    oldUrl: 'https://www.gvcabogados.com/es/blog/como-reclamar-una-negligencia-medica-en-murcia-paso-a-paso'
  },
  {
    title: 'Lesiones permanentes tras un accidente: cómo reclamar indemnización en Murcia',
    oldUrl: 'https://www.gvcabogados.com/es/blog/lesiones-permanentes-tras-un-accidente-como-reclamar-indemnizacion-en-murcia'
  },
  {
    title: 'Reagrupación familiar en España: guía práctica y actualizada',
    oldUrl: 'https://www.gvcabogados.com/es/blog/reagrupacion-familiar-en-espana-guia-practica-y-actualizada'
  },
  {
    title: '¿Qué pruebas necesito para demostrar una negligencia médica?',
    oldUrl: 'https://www.gvcabogados.com/es/blog/que-pruebas-necesito-para-demostrar-una-negligencia-medica'
  },
  {
    title: 'Inhabilitación profesional: en qué casos se aplica',
    oldUrl: 'https://www.gvcabogados.com/es/blog/inhabilitacion-profesional-en-que-casos-se-aplica'
  },
  {
    title: 'Mi ex pareja no cumple con el régimen de visitas: soluciones legales en Murcia',
    oldUrl: 'https://www.gvcabogados.com/es/blog/mi-ex-pareja-no-cumple-con-el-regimen-de-visitas-soluciones-legales-en-murcia'
  },
  {
    title: '¿Qué pasa si me despiden estando de baja médica?',
    oldUrl: 'https://www.gvcabogados.com/es/blog/que-pasa-si-me-despiden-estando-de-baja-medica'
  },
  {
    title: 'Vicios ocultos en una vivienda: cómo reclamar al vendedor',
    oldUrl: 'https://www.gvcabogados.com/es/blog/vicios-ocultos-en-una-vivienda-como-reclamar-al-vendedor'
  }
];

// Directorio para imágenes
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'blog');

// Asegurar que existe el directorio de imágenes
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

/**
 * Genera slug desde título
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Descarga imagen y la convierte a WebP
 */
async function downloadAndConvertImage(imageUrl: string, slug: string, index: number): Promise<string | null> {
  try {
    // Si es URL relativa, convertir a absoluta
    const fullUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `https://www.gvcabogados.com${imageUrl}`;

    console.log(`  📥 Descargando imagen: ${fullUrl}`);
    
    const response = await fetch(fullUrl);
    if (!response.ok) {
      console.log(`  ⚠️  Error al descargar imagen: ${response.status}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);

    // Nombre del archivo WebP
    const webpFilename = `${slug}-${index}.webp`;
    const webpPath = path.join(IMAGES_DIR, webpFilename);

    // Convertir a WebP con optimización
    await sharp(imageBuffer)
      .webp({ quality: 85 })
      .resize(1200, null, { withoutEnlargement: true })
      .toFile(webpPath);

    console.log(`  ✅ Imagen convertida: ${webpFilename}`);
    return `/images/blog/${webpFilename}`;

  } catch (error) {
    console.error(`  ❌ Error procesando imagen:`, error);
    return null;
  }
}

/**
 * Procesa el contenido HTML y descarga todas las imágenes
 */
async function processContentImages(html: string, slug: string): Promise<string> {
  const $ = cheerio.load(html);
  const images = $('img');
  let imageIndex = 1;

  for (let i = 0; i < images.length; i++) {
    const img = $(images[i]);
    const originalSrc = img.attr('src');
    
    if (originalSrc) {
      const newSrc = await downloadAndConvertImage(originalSrc, slug, imageIndex);
      if (newSrc) {
        img.attr('src', newSrc);
        imageIndex++;
      }
    }
  }

  // Devolver solo el contenido del body, sin las etiquetas html/head/body
  return $('body').html() || $.html();
}

/**
 * Scrapea un artículo individual
 */
async function scrapeArticle(article: { title: string; oldUrl: string }) {
  console.log(`\n🔍 Scrapeando: ${article.title}`);
  console.log(`   URL: ${article.oldUrl}`);
  
  try {
    // Intentar obtener el contenido de la URL
    const response = await fetch(article.oldUrl);
    
    if (!response.ok) {
      console.log(`⚠️  URL no accesible (${response.status}), se usará contenido mock`);
      return createMockArticle(article);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extraer información del artículo
    const slug = generateSlug(article.title);
    
    // Buscar específicamente el cuerpo del artículo
    let articleBody = $('.com-content-article__body[itemprop="articleBody"]').html() ||
                      $('[itemprop="articleBody"]').html() ||
                      $('.article-body').html();

    if (!articleBody) {
      console.log(`   ⚠️  No se encontró el cuerpo del artículo, se usará contenido mock`);
      return createMockArticle(article);
    }

    console.log(`   ✓ Contenido del artículo encontrado`);

    // Procesar el contenido del artículo
    const $content = cheerio.load(articleBody);
    
    // Limpiar elementos no deseados
    $content('script, style, .social-share, .article-info, .breadcrumbs, .tags').remove();
    
    // Limpiar atributos inline
    $content('*').each((_, elem) => {
      const $elem = $content(elem);
      $elem.removeAttr('style');
      $elem.removeAttr('onclick');
      $elem.removeAttr('itemscope');
      $elem.removeAttr('itemtype');
      $elem.removeAttr('itemprop');
      $elem.removeAttr('data-module_id');
      $elem.removeAttr('role');
      $elem.removeAttr('aria-label');
      $elem.removeAttr('aria-hidden');
    });

    // Extraer meta description
    const metaDescription = $('meta[name="description"]').attr('content') || 
                           $('meta[property="og:description"]').attr('content') ||
                           '';

    // Extraer imagen destacada
    let featuredImage = $('meta[property="og:image"]').attr('content') ||
                        $content('img').first().attr('src') ||
                        '';

    // Procesar el contenido
    let processedContent = $content.html() || '';
    
    // Procesar imágenes en el contenido
    processedContent = await processContentImages(processedContent, slug);

    // Descargar imagen destacada
    let featuredImagePath = null;
    if (featuredImage) {
      featuredImagePath = await downloadAndConvertImage(featuredImage, slug, 0);
    }

    // Calcular tiempo de lectura
    const textContent = processedContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 palabras por minuto, mínimo 1

    // Extraer primer párrafo como excerpt
    const $tempContent = cheerio.load(processedContent);
    const paragraphs = $tempContent('p');
    let excerpt = '';
    for (let i = 0; i < paragraphs.length; i++) {
      const text = $tempContent(paragraphs[i]).text().trim();
      if (text.length > 50) {
        excerpt = text.substring(0, 200) + (text.length > 200 ? '...' : '');
        break;
      }
    }
    
    if (!excerpt) {
      excerpt = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');
    }

    console.log(`   ✅ Scrapeado exitosamente`);
    console.log(`   📝 Palabras: ${wordCount} | Tiempo lectura: ${readingTime} min`);

    return {
      slug_es: slug,
      slug_en: slug + '-en',
      title_es: article.title,
      title_en: article.title, // Por ahora igual, traducir después
      meta_description_es: metaDescription || excerpt,
      meta_description_en: metaDescription || excerpt,
      excerpt_es: excerpt,
      excerpt_en: excerpt,
      content_es: processedContent,
      content_en: processedContent,
      featured_image_url: featuredImagePath,
      featured_image_alt_es: article.title,
      featured_image_alt_en: article.title,
      reading_time_minutes: readingTime,
      status: 'published',
      published_at: new Date().toISOString()
    };

  } catch (error) {
    console.error(`❌ Error scrapeando ${article.title}:`, error);
    return createMockArticle(article);
  }
}

/**
 * Crea un artículo mock si no se puede scrapear
 */
function createMockArticle(article: { title: string; oldUrl: string }) {
  const slug = generateSlug(article.title);
  
  return {
    slug_es: slug,
    slug_en: slug + '-en',
    title_es: article.title,
    title_en: article.title,
    meta_description_es: `Información legal sobre ${article.title.toLowerCase()}`,
    meta_description_en: `Legal information about ${article.title.toLowerCase()}`,
    excerpt_es: `Artículo sobre ${article.title.toLowerCase()}. Consulte con nuestros abogados expertos en Murcia.`,
    excerpt_en: `Article about ${article.title.toLowerCase()}. Consult with our expert lawyers in Murcia.`,
    content_es: `<h1>${article.title}</h1><p>Este artículo ha sido migrado desde la web anterior. El contenido será actualizado próximamente.</p><p>Para más información, contacte con GVC Abogados.</p>`,
    content_en: `<h1>${article.title}</h1><p>This article has been migrated from the previous website. Content will be updated soon.</p><p>For more information, contact GVC Abogados.</p>`,
    featured_image_url: null,
    featured_image_alt_es: article.title,
    featured_image_alt_en: article.title,
    reading_time_minutes: 5,
    status: 'draft', // Como mock, dejar como borrador
    published_at: new Date().toISOString()
  };
}

/**
 * Obtiene categoría apropiada basándose en el título
 */
async function getCategoryForArticle(title: string): Promise<string | null> {
  const titleLower = title.toLowerCase();
  
  // Mapeo de palabras clave a categorías
  const categoryMapping: { [key: string]: string } = {
    'penal': 'derecho-penal',
    'delito': 'derecho-penal',
    'denuncia': 'derecho-penal',
    'querella': 'derecho-penal',
    'alcoholemia': 'derecho-penal',
    'inhabilitacion': 'derecho-penal',
    'civil': 'derecho-civil',
    'familia': 'derecho-civil',
    'divorcio': 'derecho-civil',
    'custodia': 'derecho-civil',
    'testamento': 'derecho-civil',
    'herencia': 'derecho-civil',
    'heredar': 'derecho-civil',
    'arras': 'derecho-civil',
    'alquiler': 'derecho-civil',
    'vivienda': 'derecho-civil',
    'negligencia': 'derecho-civil',
    'accidente': 'derecho-civil',
    'indemnizacion': 'derecho-civil',
    'mediacion': 'consejos-legales',
    'arbitraje': 'consejos-legales',
    'como': 'consejos-legales',
    'que hacer': 'consejos-legales',
    'guia': 'consejos-legales'
  };

  for (const [keyword, categorySlug] of Object.entries(categoryMapping)) {
    if (titleLower.includes(keyword)) {
      // Obtener ID de categoría
      const { data, error } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug_es', categorySlug)
        .single();

      if (data && !error) {
        return data.id;
      }
    }
  }

  // Por defecto, "Actualidad Jurídica"
  const { data } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('slug_es', 'actualidad-juridica')
    .single();

  return data?.id || null;
}

/**
 * Obtiene autor por defecto
 */
async function getDefaultAuthor(): Promise<string | null> {
  const { data } = await supabase
    .from('blog_authors')
    .select('id')
    .eq('slug', 'equipo-gvc')
    .single();

  return data?.id || null;
}

/**
 * Inserta artículo en Supabase
 */
async function insertArticle(articleData: any) {
  try {
    // Obtener categoría y autor
    const categoryId = await getCategoryForArticle(articleData.title_es);
    const authorId = await getDefaultAuthor();

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        ...articleData,
        category_id: categoryId,
        author_id: authorId
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ Error insertando en DB:`, error);
      return null;
    }

    console.log(`✅ Artículo insertado en DB: ${data.slug_es}`);
    return data;

  } catch (error) {
    console.error(`❌ Error en inserción:`, error);
    return null;
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando migración de artículos de blog...\n');
  console.log(`📊 Total de artículos a migrar: ${BLOG_ARTICLES.length}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const article of BLOG_ARTICLES) {
    try {
      // Scrapear artículo
      const articleData = await scrapeArticle(article);
      
      // Insertar en Supabase
      const result = await insertArticle(articleData);
      
      if (result) {
        successCount++;
      } else {
        errorCount++;
      }

      // Pequeña pausa para no saturar
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`❌ Error procesando ${article.title}:`, error);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📈 RESUMEN DE MIGRACIÓN');
  console.log('='.repeat(60));
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📊 Total: ${BLOG_ARTICLES.length}`);
  console.log('='.repeat(60));
}

// Ejecutar
main().catch(console.error);
