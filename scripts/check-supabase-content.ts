/**
 * Script para verificar qué contenido existe en Supabase
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Faltan variables de Supabase en .env.local');
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('🔍 Verificando contenido en Supabase...\n');

  // Check localities
  const { data: localities, error: locErr } = await supabaseAdmin
    .from('localities')
    .select('id, name, slug, is_active')
    .order('name');

  if (locErr) {
    console.error('❌ Error al leer localities:', locErr);
  } else {
    console.log(`✅ Localidades: ${localities?.length || 0}`);
    console.log('Localidades activas:');
    localities?.filter(l => l.is_active).forEach(l => {
      console.log(`  - ${l.name} (${l.slug})`);
    });
    console.log('');
  }

  // Check services
  const { data: services, error: srvErr } = await supabaseAdmin
    .from('services')
    .select('id, service_key, name_es, is_active')
    .order('name_es');

  if (srvErr) {
    console.error('❌ Error al leer services:', srvErr);
  } else {
    console.log(`✅ Servicios: ${services?.length || 0}`);
    console.log('Servicios activos:');
    services?.filter(s => s.is_active).forEach(s => {
      console.log(`  - ${s.name_es} (${s.service_key})`);
    });
    console.log('');
  }

  // Check service_content
  const { data: content, error: contentErr } = await supabaseAdmin
    .from('service_content')
    .select(`
      id,
      slug_es,
      title_es,
      services!inner(service_key, name_es),
      localities!inner(name, slug)
    `)
    .order('slug_es');

  if (contentErr) {
    console.error('❌ Error al leer service_content:', contentErr);
  } else {
    console.log(`✅ Contenido de servicios: ${content?.length || 0}`);
    if (content && content.length > 0) {
      console.log('Contenido disponible:');
      content.forEach((c: any) => {
        console.log(`  - ${c.slug_es}`);
        console.log(`    Servicio: ${c.services.name_es} (${c.services.service_key})`);
        console.log(`    Localidad: ${c.localities.name} (${c.localities.slug})`);
      });
    } else {
      console.log('⚠️  No hay contenido generado aún.');
      console.log('   Ejecuta: npm run migrate:murcia');
      console.log('   Y luego: npm run generate:content');
    }
  }
}

main().catch((e) => {
  console.error('\n❌ Error:', e);
  process.exit(1);
});
