/**
 * Script de Verificación de Supabase
 * Verifica qué tablas existen y su estructura
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Cargar .env.local
config({ path: resolve(process.cwd(), '.env.local') });

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

async function verifyDatabase() {
  console.log('🔍 Verificando estructura de base de datos...\n');

  try {
    // Verificar localities
    console.log('📍 Tabla: localities');
    const { data: localities, error: locError } = await supabaseAdmin
      .from('localities')
      .select('*')
      .limit(5);
    
    if (locError) {
      console.log('   ❌ Error:', locError.message);
    } else {
      console.log(`   ✅ ${localities?.length || 0} registros encontrados`);
      if (localities && localities.length > 0) {
        console.log(`   Ejemplo: ${localities[0].name} (${localities[0].slug})`);
      }
    }

    // Verificar services
    console.log('\n📋 Tabla: services');
    const { data: services, error: servError } = await supabaseAdmin
      .from('services')
      .select('*')
      .limit(5);
    
    if (servError) {
      console.log('   ❌ Error:', servError.message);
    } else {
      console.log(`   ✅ ${services?.length || 0} registros encontrados`);
      if (services && services.length > 0) {
        console.log(`   Ejemplo: ${services[0].name_es}`);
      }
    }

    // Verificar service_content
    console.log('\n📄 Tabla: service_content');
    const { data: content, error: contentError } = await supabaseAdmin
      .from('service_content')
      .select('*')
      .limit(5);
    
    if (contentError) {
      console.log('   ❌ Error:', contentError.message);
    } else {
      console.log(`   ✅ ${content?.length || 0} registros encontrados`);
      if (content && content.length > 0) {
        console.log(`   Ejemplo: ${content[0].title_es}`);
      }
    }

    // Verificar blog_posts
    console.log('\n📝 Tabla: blog_posts');
    const { data: posts, error: postsError } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .limit(5);
    
    if (postsError) {
      console.log('   ❌ Error:', postsError.message);
    } else {
      console.log(`   ✅ ${posts?.length || 0} registros encontrados`);
    }

    // Verificar blog_categories
    console.log('\n🏷️  Tabla: blog_categories');
    const { data: categories, error: catError } = await supabaseAdmin
      .from('blog_categories')
      .select('*');
    
    if (catError) {
      console.log('   ❌ Error:', catError.message);
    } else {
      console.log(`   ✅ ${categories?.length || 0} registros encontrados`);
      if (categories && categories.length > 0) {
        categories.forEach(cat => console.log(`   - ${cat.name_es}`));
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Verificación completada');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error fatal:', error);
  }
}

verifyDatabase();
