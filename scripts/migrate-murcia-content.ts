/**
 * Script de Migración de Contenido de Murcia a Supabase
 * 
 * Este script migra todo el contenido perfeccionado de los servicios
 * desde src/data/services.ts a la base de datos de Supabase.
 * 
 * Uso: npm run migrate:murcia
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Cargar .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Crear cliente admin directamente aquí
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Importar servicios
import { services } from '../src/data/services.js';

interface MigrationStats {
  total: number;
  success: number;
  errors: number;
}

async function migrateMurciaContent() {
  console.log('🚀 Iniciando migración del contenido de Murcia...\n');

  const stats: MigrationStats = {
    total: services.length,
    success: 0,
    errors: 0
  };

  try {
    // 1. Obtener ID de Murcia
    console.log('📍 Buscando localidad de Murcia...');
    const { data: murcia, error: murciaError } = await supabaseAdmin
      .from('localities')
      .select('id')
      .eq('slug', 'murcia')
      .single();

    if (murciaError || !murcia) {
      throw new Error('No se encontró la localidad de Murcia. Asegúrate de haber ejecutado el schema.sql');
    }

    console.log(`✅ Murcia encontrada (ID: ${murcia.id})\n`);

    // 2. Migrar cada servicio
    console.log('📝 Migrando contenido de servicios...\n');

    for (const service of services) {
      try {
        console.log(`   Procesando: ${service.nameEs}...`);

        // 2.1 Obtener o crear el servicio en la tabla services
        let { data: dbService, error: serviceError } = await supabaseAdmin
          .from('services')
          .select('id')
          .eq('service_key', service.id)
          .single();

        if (serviceError || !dbService) {
          // Crear el servicio si no existe
          const { data: newService, error: createError } = await supabaseAdmin
            .from('services')
            .insert({
              service_key: service.id,
              name_es: service.nameEs,
              name_en: service.nameEn,
              icon: service.icon,
              category: service.category,
              priority: service.priority || 0,
              is_active: true
            })
            .select('id')
            .single();

          if (createError || !newService) {
            throw new Error(`Error creando servicio: ${createError?.message}`);
          }

          dbService = newService;
        }

        // 2.2 Insertar el contenido localizado
        const { error: contentError } = await supabaseAdmin
          .from('service_content')
          .upsert({
            service_id: dbService.id,
            locality_id: murcia.id,
            slug_es: service.slugEs,
            slug_en: service.slugEn,
            
            // Contenido Español
            title_es: `Abogados ${service.nameEs} en Murcia`,
            meta_description_es: `Abogados especializados en ${service.nameEs.toLowerCase()} en Murcia. ${service.descriptionEs}. Más de 75 años de experiencia. ☎ 968 241 025.`,
            short_description_es: service.descriptionEs,
            long_description_es: service.longDescriptionEs,
            sections_es: service.sectionsEs,
            process_es: service.processEs,
            faqs_es: service.faqsEs,
            
            // Contenido Inglés
            title_en: `${service.nameEn} Lawyers in Murcia`,
            meta_description_en: `Specialized ${service.nameEn.toLowerCase()} lawyers in Murcia. ${service.descriptionEn}. Over 75 years of experience. ☎ +34 968 241 025.`,
            short_description_en: service.descriptionEn,
            long_description_en: service.longDescriptionEn,
            sections_en: service.sectionsEn,
            process_en: service.processEn,
            faqs_en: service.faqsEn,
            
            // Metadata
            translation_status: 'translated',
            content_quality_score: 95, // Contenido perfeccionado manualmente
            last_reviewed_at: new Date().toISOString()
          }, {
            onConflict: 'service_id,locality_id'
          });

        if (contentError) {
          throw new Error(`Error insertando contenido: ${contentError.message}`);
        }

        console.log(`   ✅ ${service.nameEs} migrado correctamente`);
        stats.success++;

      } catch (error) {
        console.error(`   ❌ Error con ${service.nameEs}:`, error);
        stats.errors++;
      }
    }

    // 3. Resumen final
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(50));
    console.log(`Total de servicios: ${stats.total}`);
    console.log(`✅ Exitosos: ${stats.success}`);
    console.log(`❌ Errores: ${stats.errors}`);
    console.log('='.repeat(50));

    if (stats.errors === 0) {
      console.log('\n🎉 ¡Migración completada exitosamente!');
    } else {
      console.log('\n⚠️  Migración completada con algunos errores. Revisa los logs arriba.');
    }

  } catch (error) {
    console.error('\n❌ Error fatal en la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateMurciaContent();
