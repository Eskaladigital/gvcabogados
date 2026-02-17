/**
 * Verifica tablas, RLS y datos en Supabase.
 * Usa SERVICE_ROLE_KEY (bypasea RLS) para diagnóstico.
 *
 * Ejecutar: npx tsx scripts/check-supabase-tables.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  console.log('\n🔍 DIAGNÓSTICO SUPABASE - GVC Abogados\n');
  console.log('URL:', url);
  console.log('---\n');

  // 1. service_content
  const { data: scData, error: scErr } = await supabase
    .from('service_content')
    .select('id, slug_es, title_es', { count: 'exact' })
    .limit(5);

  console.log('1. SERVICE_CONTENT');
  if (scErr) {
    console.log('   ❌ Error:', scErr.message);
  } else {
    const { count } = await supabase.from('service_content').select('*', { count: 'exact', head: true });
    console.log('   ✅ Total filas:', count);
    if (scData?.length) {
      console.log('   Ejemplos:', scData.map((r) => r.slug_es).join(', '));
      const murcia = scData.find((r) => r.slug_es?.includes('murcia'));
      if (murcia) console.log('   Con Murcia:', murcia.slug_es);
    }
  }
  console.log('');

  // 2. services
  const { count: svcCount, error: svcErr } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true });

  console.log('2. SERVICES');
  if (svcErr) console.log('   ❌ Error:', svcErr.message);
  else console.log('   ✅ Total:', svcCount);
  console.log('');

  // 3. localities
  const { count: locCount, error: locErr } = await supabase
    .from('localities')
    .select('*', { count: 'exact', head: true });

  console.log('3. LOCALITIES');
  if (locErr) console.log('   ❌ Error:', locErr.message);
  else console.log('   ✅ Total:', locCount);
  console.log('');

  // 4. blog_posts
  const { data: bpData, count: bpCount, error: bpErr } = await supabase
    .from('blog_posts')
    .select('id, slug_es, status', { count: 'exact' })
    .limit(5);

  console.log('4. BLOG_POSTS');
  if (bpErr) console.log('   ❌ Error:', bpErr.message);
  else {
    console.log('   ✅ Total:', bpCount);
    const published = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');
    console.log('   Publicados:', published.count);
    if (bpData?.length) console.log('   Ejemplos:', bpData.map((r) => `${r.slug_es} (${r.status})`).join(', '));
  }
  console.log('');

  // 5. blog_categories
  const { count: bcCount, error: bcErr } = await supabase
    .from('blog_categories')
    .select('*', { count: 'exact', head: true });

  console.log('5. BLOG_CATEGORIES');
  if (bcErr) console.log('   ❌ Error:', bcErr.message);
  else console.log('   ✅ Total:', bcCount);
  console.log('');

  // 6. Probar con ANON key (simula la web)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (anonKey) {
    const anonClient = createClient(url, anonKey);
    const { data: anonSc, error: anonErr } = await anonClient
      .from('service_content')
      .select('slug_es')
      .limit(3);

    console.log('6. PRUEBA CON ANON KEY (como la web)');
    if (anonErr) {
      console.log('   ❌ Error con anon:', anonErr.message);
      console.log('   → Posible RLS bloqueando. Ejecuta: supabase/enable-public-read-all-tables.sql');
    } else {
      console.log('   ✅ service_content accesible:', anonSc?.length ?? 0, 'filas');
    }

    const { data: anonBp, error: anonBpErr } = await anonClient
      .from('blog_posts')
      .select('slug_es')
      .eq('status', 'published')
      .limit(3);

    if (anonBpErr) {
      console.log('   ❌ blog_posts con anon:', anonBpErr.message);
    } else {
      console.log('   ✅ blog_posts accesible:', anonBp?.length ?? 0, 'filas');
    }
  }
  // 7. Buscar slug específico
  const slug = 'abogados-accidentes-trafico-murcia';
  const { data: slugData, error: slugErr } = await supabase
    .from('service_content')
    .select('slug_es, title_es')
    .eq('slug_es', slug)
    .maybeSingle();

  console.log('7. SLUG abogados-accidentes-trafico-murcia');
  if (slugErr) console.log('   ❌ Error:', slugErr.message);
  else if (slugData) console.log('   ✅ Encontrado:', slugData.title_es);
  else console.log('   ⚠️ No existe en service_content');

  console.log('\n--- Fin diagnóstico ---\n');
}

main().catch(console.error);
