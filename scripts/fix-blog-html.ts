/**
 * Script para limpiar el HTML de los artículos del blog
 * Remueve las etiquetas html, head, body que envuelven el contenido
 */

import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Limpia el HTML removiendo las etiquetas wrapper
 */
function cleanHTML(html: string): string {
  if (!html) return '';
  
  const $ = cheerio.load(html);
  
  // Si hay etiquetas html/body, extraer solo el contenido del body
  const bodyContent = $('body').html();
  if (bodyContent) {
    return bodyContent.trim();
  }
  
  // Si no hay body, devolver el HTML limpio
  return $.html().trim();
}

async function fixAllPosts() {
  console.log('🔧 Iniciando limpieza de HTML en artículos del blog...\n');

  try {
    // Obtener todos los posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, slug_es, title_es, content_es, content_en')
      .order('title_es');

    if (error) {
      console.error('❌ Error obteniendo posts:', error);
      return;
    }

    if (!posts || posts.length === 0) {
      console.log('⚠️  No hay posts para limpiar');
      return;
    }

    console.log(`📊 Total de artículos a limpiar: ${posts.length}\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const post of posts) {
      try {
        console.log(`🔧 Limpiando: ${post.title_es}`);

        // Limpiar contenido español
        const cleanedContentEs = cleanHTML(post.content_es);
        const cleanedContentEn = cleanHTML(post.content_en || post.content_es);

        // Actualizar en la base de datos
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            content_es: cleanedContentEs,
            content_en: cleanedContentEn
          })
          .eq('id', post.id);

        if (updateError) {
          console.error(`   ❌ Error actualizando: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ Limpiado exitosamente`);
          successCount++;
        }

      } catch (error) {
        console.error(`   ❌ Error procesando ${post.title_es}:`, error);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📈 RESUMEN DE LIMPIEZA');
    console.log('='.repeat(60));
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📊 Total: ${posts.length}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar
fixAllPosts().catch(console.error);
