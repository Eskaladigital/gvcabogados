/**
 * Script para importar artículos del CSV a Supabase
 * Solo importa artículos con contenido escrito
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CSV_PATH = path.join(process.cwd(), 'Table 1-Grid view (7).csv');

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
 * Calcular tiempo de lectura
 */
function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200)); // 200 palabras por minuto
}

/**
 * Extraer excerpt del contenido
 */
function extractExcerpt(html: string): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.substring(0, 200) + (text.length > 200 ? '...' : '');
}

/**
 * Obtener categoría apropiada basándose en el título
 */
async function getCategoryForArticle(title: string): Promise<string | null> {
  const titleLower = title.toLowerCase();
  
  const categoryMapping: { [key: string]: string } = {
    'penal': 'derecho-penal',
    'delito': 'derecho-penal',
    'denuncia': 'derecho-penal',
    'querella': 'derecho-penal',
    'multa': 'derecho-penal',
    'juicio': 'derecho-penal',
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
    'inmobiliario': 'derecho-civil',
    'propiedad': 'derecho-civil',
    'negligencia': 'derecho-civil',
    'accidente': 'derecho-civil',
    'indemnizacion': 'derecho-civil',
    'bancario': 'derecho-civil',
    'banco': 'derecho-civil',
    'hipoteca': 'derecho-civil',
    'clausula': 'derecho-civil',
    'extranjeria': 'actualidad-juridica',
    'residencia': 'actualidad-juridica',
    'nie': 'actualidad-juridica',
    'nacionalidad': 'actualidad-juridica',
    'abogado': 'consejos-legales',
    'como': 'consejos-legales',
    'que hacer': 'consejos-legales',
    'guia': 'consejos-legales'
  };

  for (const [keyword, categorySlug] of Object.entries(categoryMapping)) {
    if (titleLower.includes(keyword)) {
      const { data } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug_es', categorySlug)
        .single();

      if (data) return data.id;
    }
  }

  // Por defecto
  const { data } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('slug_es', 'actualidad-juridica')
    .single();

  return data?.id || null;
}

/**
 * Obtener autor por defecto
 */
async function getDefaultAuthor(): Promise<string | null> {
  const { data } = await supabase
    .from('blog_authors')
    .select('id')
    .eq('slug', 'equipo-gvc')
    .single();

  return data?.id || null;
}

async function main() {
  console.log('🚀 Iniciando importación de artículos desde CSV...\n');

  try {
    // Leer el archivo CSV
    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    
    // Parsear CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`📊 Total de registros en CSV: ${records.length}`);

    // Filtrar artículos con contenido
    const articlesWithContent = records.filter((record: any) => {
      const hasContent = record['Texto ESP'] && record['Texto ESP'].trim().length > 100;
      return hasContent;
    });

    console.log(`✅ Artículos con contenido: ${articlesWithContent.length}\n`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    const authorId = await getDefaultAuthor();

    for (const record of articlesWithContent) {
      const title = record['URL'];
      const content = record['Texto ESP'];
      const contentEn = record['Texto ENG'] || content;

      if (!title || !content) {
        skippedCount++;
        continue;
      }

      try {
        const slug = generateSlug(title);
        
        // Verificar si ya existe
        const { data: existing } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('slug_es', slug)
          .single();

        if (existing) {
          console.log(`⏭️  Ya existe: ${title}`);
          skippedCount++;
          continue;
        }

        const readingTime = calculateReadingTime(content);
        const excerpt = extractExcerpt(content);
        const categoryId = await getCategoryForArticle(title);

        console.log(`📝 Importando: ${title}`);

        const { error } = await supabase
          .from('blog_posts')
          .insert({
            slug_es: slug,
            slug_en: slug + '-en',
            title_es: title,
            title_en: title,
            meta_description_es: excerpt,
            meta_description_en: excerpt,
            excerpt_es: excerpt,
            excerpt_en: extractExcerpt(contentEn),
            content_es: content,
            content_en: contentEn,
            category_id: categoryId,
            author_id: authorId,
            reading_time_minutes: readingTime,
            status: 'published',
            published_at: new Date().toISOString()
          });

        if (error) {
          console.error(`   ❌ Error: ${error.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ Importado exitosamente (${readingTime} min lectura)`);
          successCount++;
        }

        // Pequeña pausa
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`   ❌ Error procesando ${title}:`, error);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📈 RESUMEN DE IMPORTACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`⏭️  Omitidos (ya existen): ${skippedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📊 Total procesados: ${articlesWithContent.length}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

main().catch(console.error);
