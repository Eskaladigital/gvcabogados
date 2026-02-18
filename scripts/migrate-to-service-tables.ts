/**
 * Migración: service_content → 6 tablas por servicio.
 *
 * Lee todos los registros de service_content y los inserta en la tabla
 * correspondiente (svc_accidentes_trafico, svc_derecho_familia, etc).
 *
 * Los custom_sections_es/en se descomponen en columnas dedicadas.
 *
 * Uso: tsx scripts/migrate-to-service-tables.ts [--dry-run=true]
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Faltan variables de Supabase');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const dryRun = process.argv.includes('--dry-run=true');

const SERVICE_MAP: Record<string, { table: string; customFields: Record<string, string> }> = {
  'accidentes-trafico': {
    table: 'svc_accidentes_trafico',
    customFields: {
      tipos_accidente: 'tipos_accidente',
      que_hacer: 'que_hacer',
      stats: 'stats',
      intro: 'intro',
    },
  },
  'derecho-familia': {
    table: 'svc_derecho_familia',
    customFields: {
      areas: 'areas',
      que_saber: 'que_saber',
      stats: 'stats',
      intro: 'intro',
    },
  },
  'negligencias-medicas': {
    table: 'svc_negligencias_medicas',
    customFields: {
      tipos_negligencia: 'tipos_negligencia',
      hospitales: 'hospitales',
      stats: 'stats',
      intro: 'intro',
    },
  },
  'extranjeria': {
    table: 'svc_permisos_residencia',
    customFields: {
      tipos_permiso: 'tipos_permiso',
      documentacion: 'documentacion',
      stats: 'stats',
      intro: 'intro',
    },
  },
  'derecho-administrativo': {
    table: 'svc_responsabilidad_admin',
    customFields: {
      tipos_responsabilidad: 'tipos_responsabilidad',
      organismos: 'organismos',
      stats: 'stats',
      intro: 'intro',
    },
  },
  'responsabilidad-civil': {
    table: 'svc_responsabilidad_civil',
    customFields: {
      tipos_responsabilidad: 'tipos_responsabilidad',
      plazos_prescripcion: 'plazos_prescripcion',
      stats: 'stats',
      intro: 'intro',
    },
  },
};

async function migrate() {
  console.log(`\n=== Migración service_content → 6 tablas ===`);
  console.log(`Dry run: ${dryRun}\n`);

  const { data: rows, error } = await supabase
    .from('service_content')
    .select(`
      *,
      services!inner(service_key),
      localities!inner(name, slug)
    `)
    .order('slug_es');

  if (error) throw new Error(`Error leyendo service_content: ${error.message}`);
  if (!rows || rows.length === 0) {
    console.log('No hay registros en service_content. Nada que migrar.');
    return;
  }

  console.log(`Registros encontrados: ${rows.length}\n`);

  let migrated = 0, skipped = 0, errors = 0;

  for (const row of rows) {
    const serviceKey = (row.services as any).service_key as string;
    const mapping = SERVICE_MAP[serviceKey];

    if (!mapping) {
      console.log(`  Skip: ${serviceKey} — no tiene tabla destino`);
      skipped++;
      continue;
    }

    const locality = row.localities as any;
    console.log(`  ${serviceKey} / ${locality.name} → ${mapping.table}`);

    const newRow: Record<string, any> = {
      locality_id: row.locality_id,
      slug_es: row.slug_es,
      slug_en: row.slug_en,
      title_es: row.title_es,
      title_en: row.title_en,
      meta_description_es: row.meta_description_es,
      meta_description_en: row.meta_description_en,
      short_description_es: row.short_description_es,
      short_description_en: row.short_description_en,
      intro_es: row.long_description_es,
      intro_en: row.long_description_en,
      sections_es: row.sections_es,
      sections_en: row.sections_en,
      process_es: row.process_es,
      process_en: row.process_en,
      faqs_es: row.faqs_es,
      faqs_en: row.faqs_en,
      content_quality_score: row.content_quality_score,
    };

    const customEs = (row.custom_sections_es as Record<string, any>) || {};
    const customEn = (row.custom_sections_en as Record<string, any>) || {};

    for (const [srcKey, destKey] of Object.entries(mapping.customFields)) {
      if (srcKey === 'intro') {
        // intro already mapped from long_description
        // But if custom has it, use that instead
        if (customEs[srcKey]) newRow.intro_es = customEs[srcKey];
        if (customEn[srcKey]) newRow.intro_en = customEn[srcKey];
      } else {
        if (customEs[srcKey] != null) newRow[`${destKey}_es`] = customEs[srcKey];
        if (customEn[srcKey] != null) newRow[`${destKey}_en`] = customEn[srcKey];
      }
    }

    if (customEs.stats) newRow.stats_es = customEs.stats;
    if (customEn.stats) newRow.stats_en = customEn.stats;

    if (dryRun) {
      console.log(`    [dry-run] Sería insertado en ${mapping.table}`);
      migrated++;
      continue;
    }

    try {
      const { error: upsertError } = await supabase
        .from(mapping.table)
        .upsert(newRow, { onConflict: 'locality_id' });

      if (upsertError) {
        console.error(`    ERROR: ${upsertError.message}`);
        errors++;
      } else {
        console.log(`    OK`);
        migrated++;
      }
    } catch (e: any) {
      console.error(`    ERROR: ${e.message}`);
      errors++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESUMEN MIGRACIÓN`);
  console.log(`Migrados: ${migrated} | Omitidos: ${skipped} | Errores: ${errors}`);
  console.log(`${'='.repeat(50)}\n`);
}

migrate().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
