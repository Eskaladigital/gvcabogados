/**
 * Script de prueba para scrapear un solo artículo
 * Verificar funcionamiento antes de la migración completa
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

// Artículo de prueba
const TEST_ARTICLE = {
  title: 'Cómo solicitar el arraigo social en Murcia',
  oldUrl: 'https://www.gvcabogados.com/es/blog/como-solicitar-el-arraigo-social-en-murcia'
};

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'blog');

// Asegurar que existe el directorio de imágenes
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function downloadAndConvertImage(imageUrl: string, slug: string, index: number): Promise<string | null> {
  try {
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

    const webpFilename = `${slug}-${index}.webp`;
    const webpPath = path.join(IMAGES_DIR, webpFilename);

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

  return $.html();
}

async function scrapeArticle() {
  console.log(`\n🔍 Scrapeando artículo de prueba`);
  console.log(`📄 Título: ${TEST_ARTICLE.title}`);
  console.log(`🔗 URL: ${TEST_ARTICLE.oldUrl}\n`);
  
  try {
    const response = await fetch(TEST_ARTICLE.oldUrl);
    
    if (!response.ok) {
      console.log(`❌ URL no accesible: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const slug = generateSlug(TEST_ARTICLE.title);
    
    // Buscar específicamente el cuerpo del artículo
    let articleBody = $('.com-content-article__body[itemprop="articleBody"]').html() ||
                      $('[itemprop="articleBody"]').html() ||
                      $('.article-body').html();

    if (!articleBody) {
      console.log(`⚠️  No se encontró el cuerpo del artículo con selectores estándar`);
      return null;
    }

    console.log(`✓ Contenido del artículo encontrado`);

    // Procesar el contenido del artículo
    const $content = cheerio.load(articleBody);
    
    // Limpiar elementos no deseados
    $content('script, style, .social-share, .article-info, .breadcrumbs, .tags').remove();
    
    // Limpiar atributos inline style
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

    const metaDescription = $('meta[name="description"]').attr('content') || 
                           $('meta[property="og:description"]').attr('content') ||
                           '';

    let featuredImage = $('meta[property="og:image"]').attr('content') ||
                        $content('img').first().attr('src') ||
                        '';

    let processedContent = $content.html() || '';
    
    console.log(`\n📥 Procesando imágenes del contenido...`);
    processedContent = await processContentImages(processedContent, slug);

    let featuredImagePath = null;
    if (featuredImage) {
      console.log(`\n📥 Procesando imagen destacada...`);
      featuredImagePath = await downloadAndConvertImage(featuredImage, slug, 0);
    }

    const textContent = processedContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

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

    console.log(`\n✅ Scrapeado completado`);
    console.log(`📝 Palabras: ${wordCount}`);
    console.log(`⏱️  Tiempo de lectura: ${readingTime} min`);
    console.log(`📄 Excerpt: ${excerpt.substring(0, 100)}...`);

    const articleData = {
      slug_es: slug,
      slug_en: slug + '-en',
      title_es: TEST_ARTICLE.title,
      title_en: TEST_ARTICLE.title,
      meta_description_es: metaDescription || excerpt,
      meta_description_en: metaDescription || excerpt,
      excerpt_es: excerpt,
      excerpt_en: excerpt,
      content_es: processedContent,
      content_en: processedContent,
      featured_image_url: featuredImagePath,
      featured_image_alt_es: TEST_ARTICLE.title,
      featured_image_alt_en: TEST_ARTICLE.title,
      reading_time_minutes: readingTime,
      status: 'published',
      published_at: new Date().toISOString()
    };

    // Guardar JSON para inspección
    const jsonPath = path.join(process.cwd(), 'scripts', 'test-article-output.json');
    fs.writeFileSync(jsonPath, JSON.stringify(articleData, null, 2));
    console.log(`\n💾 Datos guardados en: ${jsonPath}`);

    // Guardar HTML del contenido para inspección
    const htmlPath = path.join(process.cwd(), 'scripts', 'test-article-content.html');
    fs.writeFileSync(htmlPath, processedContent);
    console.log(`💾 Contenido HTML guardado en: ${htmlPath}`);

    return articleData;

  } catch (error) {
    console.error(`❌ Error:`, error);
    return null;
  }
}

async function insertToDatabase(articleData: any) {
  console.log(`\n💾 Insertando en Supabase...`);

  try {
    // Obtener categoría por defecto
    const { data: category } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug_es', 'actualidad-juridica')
      .single();

    // Obtener autor por defecto
    const { data: author } = await supabase
      .from('blog_authors')
      .select('id')
      .eq('slug', 'equipo-gvc')
      .single();

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        ...articleData,
        category_id: category?.id || null,
        author_id: author?.id || null
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ Error insertando en DB:`, error);
      return null;
    }

    console.log(`✅ Artículo insertado en Supabase`);
    console.log(`🆔 ID: ${data.id}`);
    console.log(`🔗 Slug: ${data.slug_es}`);
    return data;

  } catch (error) {
    console.error(`❌ Error en inserción:`, error);
    return null;
  }
}

async function main() {
  console.log('🧪 TEST: Scraping de un solo artículo\n');
  console.log('='.repeat(60));

  const articleData = await scrapeArticle();
  
  if (!articleData) {
    console.log('\n❌ No se pudo scrapear el artículo');
    return;
  }

  console.log('\n' + '='.repeat(60));
  console.log('¿Deseas insertar este artículo en Supabase?');
  console.log('Revisa los archivos generados primero:');
  console.log('- scripts/test-article-output.json');
  console.log('- scripts/test-article-content.html');
  console.log('\nSi todo está correcto, descomenta la línea de inserción');
  console.log('='.repeat(60));

  // Descomentar la siguiente línea para insertar en la base de datos
  // await insertToDatabase(articleData);
}

main().catch(console.error);
