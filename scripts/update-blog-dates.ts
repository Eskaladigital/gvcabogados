/**
 * Script para actualizar las fechas de publicación de los artículos
 * Distribuye las fechas desde hoy hacia atrás con intervalos de 10-15 días
 */

import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Genera una fecha aleatoria entre 10-15 días antes de la fecha dada
 */
function getRandomDaysBefore(date: Date, minDays: number = 10, maxDays: number = 15): Date {
  const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - randomDays);
  
  // Establecer hora aleatoria entre 9:00 y 18:00
  const randomHour = Math.floor(Math.random() * 9) + 9; // 9-17
  const randomMinute = Math.floor(Math.random() * 60);
  newDate.setHours(randomHour, randomMinute, 0, 0);
  
  return newDate;
}

async function updatePublicationDates() {
  console.log('📅 Iniciando actualización de fechas de publicación...\n');

  try {
    // Obtener todos los artículos ordenados por título (para consistencia)
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, slug_es, title_es, published_at')
      .eq('status', 'published')
      .order('title_es', { ascending: true });

    if (error) {
      console.error('❌ Error obteniendo posts:', error);
      return;
    }

    if (!posts || posts.length === 0) {
      console.log('⚠️  No hay posts para actualizar');
      return;
    }

    console.log(`📊 Total de artículos a actualizar: ${posts.length}\n`);

    // Fecha de inicio (hoy)
    let currentDate = new Date();
    
    let successCount = 0;
    let errorCount = 0;

    for (const post of posts) {
      try {
        // Formatear fecha para mostrar
        const dateStr = currentDate.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        console.log(`📅 ${post.title_es}`);
        console.log(`   Fecha: ${dateStr}`);

        // Actualizar en Supabase
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            published_at: currentDate.toISOString()
          })
          .eq('id', post.id);

        if (updateError) {
          console.error(`   ❌ Error: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ Actualizado`);
          successCount++;
        }

        // Calcular siguiente fecha (10-15 días antes)
        currentDate = getRandomDaysBefore(currentDate, 10, 15);

      } catch (error) {
        console.error(`   ❌ Error procesando ${post.title_es}:`, error);
        errorCount++;
      }
    }

    // Calcular antigüedad del blog
    const oldestDate = currentDate;
    const monthsAgo = Math.floor((new Date().getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const yearsAgo = Math.floor(monthsAgo / 12);

    console.log('\n' + '='.repeat(60));
    console.log('📈 RESUMEN DE ACTUALIZACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📊 Total: ${posts.length}`);
    console.log('');
    console.log('📅 Rango de fechas:');
    console.log(`   Más reciente: ${new Date().toLocaleDateString('es-ES')}`);
    console.log(`   Más antiguo: ${oldestDate.toLocaleDateString('es-ES')}`);
    console.log(`   Antigüedad del blog: ~${yearsAgo} años y ${monthsAgo % 12} meses`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar
updatePublicationDates().catch(console.error);
