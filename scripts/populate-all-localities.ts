/**
 * Script para poblar todas las ciudades españolas con más de 50.000 habitantes
 * 
 * Uso: npm run populate:localities
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

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

// Lista completa de ciudades españolas con más de 50.000 habitantes
// Datos aproximados basados en padrón 2024-2025
const cities = [
  // Madrid
  { name: 'Madrid', slug: 'madrid', province: 'Madrid', population: 3223000, priority: 100 },
  { name: 'Móstoles', slug: 'mostoles', province: 'Madrid', population: 209000, priority: 90 },
  { name: 'Alcalá de Henares', slug: 'alcala-de-henares', province: 'Madrid', population: 199000, priority: 85 },
  { name: 'Fuenlabrada', slug: 'fuenlabrada', province: 'Madrid', population: 194000, priority: 85 },
  { name: 'Leganés', slug: 'leganes', province: 'Madrid', population: 189000, priority: 85 },
  { name: 'Getafe', slug: 'getafe', province: 'Madrid', population: 185000, priority: 85 },
  { name: 'Alcorcón', slug: 'alcorcon', province: 'Madrid', population: 171000, priority: 80 },
  { name: 'Torrejón de Ardoz', slug: 'torrejon-de-ardoz', province: 'Madrid', population: 138000, priority: 75 },
  { name: 'Parla', slug: 'parla', province: 'Madrid', population: 133000, priority: 75 },
  { name: 'Alcobendas', slug: 'alcobendas', province: 'Madrid', population: 118000, priority: 70 },
  { name: 'Las Rozas de Madrid', slug: 'las-rozas-de-madrid', province: 'Madrid', population: 96000, priority: 65 },
  { name: 'San Sebastián de los Reyes', slug: 'san-sebastian-de-los-reyes', province: 'Madrid', population: 92000, priority: 65 },
  { name: 'Rivas-Vaciamadrid', slug: 'rivas-vaciamadrid', province: 'Madrid', population: 90000, priority: 60 },
  { name: 'Pozuelo de Alarcón', slug: 'pozuelo-de-alarcon', province: 'Madrid', population: 87000, priority: 60 },
  { name: 'Coslada', slug: 'coslada', province: 'Madrid', population: 82000, priority: 55 },
  { name: 'Valdemoro', slug: 'valdemoro', province: 'Madrid', population: 79000, priority: 55 },
  { name: 'Majadahonda', slug: 'majadahonda', province: 'Madrid', population: 72000, priority: 50 },
  { name: 'Collado Villalba', slug: 'collado-villalba', province: 'Madrid', population: 65000, priority: 50 },
  { name: 'Boadilla del Monte', slug: 'boadilla-del-monte', province: 'Madrid', population: 62000, priority: 50 },
  { name: 'Aranjuez', slug: 'aranjuez', province: 'Madrid', population: 60000, priority: 50 },
  { name: 'Arganda del Rey', slug: 'arganda-del-rey', province: 'Madrid', population: 58000, priority: 50 },
  { name: 'Tres Cantos', slug: 'tres-cantos', province: 'Madrid', population: 52000, priority: 50 },
  
  // Barcelona
  { name: 'Barcelona', slug: 'barcelona', province: 'Barcelona', population: 1637000, priority: 100 },
  { name: 'Badalona', slug: 'badalona', province: 'Barcelona', population: 223000, priority: 90 },
  { name: 'Sabadell', slug: 'sabadell', province: 'Barcelona', population: 216000, priority: 90 },
  { name: 'Terrassa', slug: 'terrassa', province: 'Barcelona', population: 223000, priority: 90 },
  { name: "L'Hospitalet de Llobregat", slug: 'hospitalet-de-llobregat', province: 'Barcelona', population: 269000, priority: 90 },
  { name: 'Santa Coloma de Gramenet', slug: 'santa-coloma-de-gramenet', province: 'Barcelona', population: 120000, priority: 80 },
  { name: 'Sant Cugat del Vallès', slug: 'sant-cugat-del-valles', province: 'Barcelona', population: 95000, priority: 70 },
  { name: 'Cornellà de Llobregat', slug: 'cornella-de-llobregat', province: 'Barcelona', population: 90000, priority: 65 },
  { name: 'Sant Boi de Llobregat', slug: 'sant-boi-de-llobregat', province: 'Barcelona', population: 84000, priority: 60 },
  { name: 'Rubí', slug: 'rubi', province: 'Barcelona', population: 80000, priority: 60 },
  { name: 'Manresa', slug: 'manresa', province: 'Barcelona', population: 78000, priority: 55 },
  { name: 'Mataró', slug: 'mataro', province: 'Barcelona', population: 129000, priority: 75 },
  { name: 'Vilanova i la Geltrú', slug: 'vilanova-i-la-geltru', province: 'Barcelona', population: 68000, priority: 50 },
  { name: 'Castelldefels', slug: 'castelldefels', province: 'Barcelona', population: 68000, priority: 50 },
  { name: 'Viladecans', slug: 'viladecans', province: 'Barcelona', population: 66000, priority: 50 },
  { name: 'El Prat de Llobregat', slug: 'el-prat-de-llobregat', province: 'Barcelona', population: 65000, priority: 50 },
  { name: 'Granollers', slug: 'granollers', province: 'Barcelona', population: 62000, priority: 50 },
  { name: 'Cerdanyola del Vallès', slug: 'cerdanyola-del-valles', province: 'Barcelona', population: 58000, priority: 50 },
  { name: 'Mollet del Vallès', slug: 'mollet-del-valles', province: 'Barcelona', population: 52000, priority: 50 },
  
  // Valencia
  { name: 'Valencia', slug: 'valencia', province: 'Valencia', population: 792000, priority: 100 },
  { name: 'Torrent', slug: 'torrent', province: 'Valencia', population: 84000, priority: 70 },
  { name: 'Gandia', slug: 'gandia', province: 'Valencia', population: 76000, priority: 60 },
  { name: 'Paterna', slug: 'paterna', province: 'Valencia', population: 72000, priority: 60 },
  { name: 'Sagunto', slug: 'sagunto', province: 'Valencia', population: 68000, priority: 55 },
  { name: 'Alzira', slug: 'alzira', province: 'Valencia', population: 46000, priority: 50 },
  
  // Sevilla
  { name: 'Sevilla', slug: 'sevilla', province: 'Sevilla', population: 684000, priority: 100 },
  { name: 'Dos Hermanas', slug: 'dos-hermanas', province: 'Sevilla', population: 137000, priority: 85 },
  { name: 'Alcalá de Guadaíra', slug: 'alcala-de-guadaira', province: 'Sevilla', population: 76000, priority: 60 },
  
  // Zaragoza
  { name: 'Zaragoza', slug: 'zaragoza', province: 'Zaragoza', population: 675000, priority: 100 },
  
  // Málaga
  { name: 'Málaga', slug: 'malaga', province: 'Málaga', population: 578000, priority: 100 },
  { name: 'Marbella', slug: 'marbella', province: 'Málaga', population: 150000, priority: 80 },
  { name: 'Mijas', slug: 'mijas', province: 'Málaga', population: 87000, priority: 65 },
  { name: 'Vélez-Málaga', slug: 'velez-malaga', province: 'Málaga', population: 82000, priority: 60 },
  { name: 'Fuengirola', slug: 'fuengirola', province: 'Málaga', population: 82000, priority: 60 },
  { name: 'Torremolinos', slug: 'torremolinos', province: 'Málaga', population: 70000, priority: 55 },
  { name: 'Estepona', slug: 'estepona', province: 'Málaga', population: 72000, priority: 55 },
  { name: 'Benalmádena', slug: 'benalmadena', province: 'Málaga', population: 70000, priority: 55 },
  
  // Murcia (ya existe, pero la incluimos para referencia)
  { name: 'Murcia', slug: 'murcia', province: 'Murcia', population: 453000, priority: 100 },
  { name: 'Cartagena', slug: 'cartagena', province: 'Murcia', population: 218000, priority: 85 },
  { name: 'Lorca', slug: 'lorca', province: 'Murcia', population: 95000, priority: 70 },
  { name: 'Molina de Segura', slug: 'molina-de-segura', province: 'Murcia', population: 73000, priority: 65 },
  { name: 'Alcantarilla', slug: 'alcantarilla', province: 'Murcia', population: 42000, priority: 50 },
  
  // Bilbao/Vizcaya
  { name: 'Bilbao', slug: 'bilbao', province: 'Vizcaya', population: 346000, priority: 100 },
  { name: 'Getxo', slug: 'getxo', province: 'Vizcaya', population: 78000, priority: 60 },
  { name: 'Barakaldo', slug: 'barakaldo', province: 'Vizcaya', population: 101000, priority: 75 },
  { name: 'Portugalete', slug: 'portugalete', province: 'Vizcaya', population: 46000, priority: 50 },
  
  // Córdoba
  { name: 'Córdoba', slug: 'cordoba', province: 'Córdoba', population: 323000, priority: 100 },
  
  // Alicante
  { name: 'Alicante', slug: 'alicante', province: 'Alicante', population: 335000, priority: 90 },
  { name: 'Elche', slug: 'elche', province: 'Alicante', population: 234000, priority: 85 },
  { name: 'Torrevieja', slug: 'torrevieja', province: 'Alicante', population: 95000, priority: 70 },
  { name: 'Orihuela', slug: 'orihuela', province: 'Alicante', population: 82000, priority: 60 },
  { name: 'Benidorm', slug: 'benidorm', province: 'Alicante', population: 72000, priority: 55 },
  { name: 'Alcoy', slug: 'alcoy', province: 'Alicante', population: 60000, priority: 50 },
  { name: 'San Vicente del Raspeig', slug: 'san-vicente-del-raspeig', province: 'Alicante', population: 59000, priority: 50 },
  
  // Valladolid
  { name: 'Valladolid', slug: 'valladolid', province: 'Valladolid', population: 298000, priority: 100 },
  
  // Vigo
  { name: 'Vigo', slug: 'vigo', province: 'Pontevedra', population: 293000, priority: 100 },
  { name: 'Ourense', slug: 'ourense', province: 'Ourense', population: 105000, priority: 75 },
  
  // Gijón
  { name: 'Gijón', slug: 'gijon', province: 'Asturias', population: 271000, priority: 100 },
  { name: 'Oviedo', slug: 'oviedo', province: 'Asturias', population: 220000, priority: 90 },
  
  // Granada
  { name: 'Granada', slug: 'granada', province: 'Granada', population: 231000, priority: 100 },
  
  // Vitoria
  { name: 'Vitoria-Gasteiz', slug: 'vitoria-gasteiz', province: 'Álava', population: 253000, priority: 100 },
  
  // A Coruña
  { name: 'A Coruña', slug: 'a-coruna', province: 'A Coruña', population: 247000, priority: 100 },
  { name: 'Santiago de Compostela', slug: 'santiago-de-compostela', province: 'A Coruña', population: 98000, priority: 70 },
  
  // Santa Cruz de Tenerife
  { name: 'Santa Cruz de Tenerife', slug: 'santa-cruz-de-tenerife', province: 'Santa Cruz de Tenerife', population: 208000, priority: 90 },
  { name: 'San Cristóbal de La Laguna', slug: 'san-cristobal-de-la-laguna', province: 'Santa Cruz de Tenerife', population: 158000, priority: 80 },
  
  // Pamplona
  { name: 'Pamplona', slug: 'pamplona', province: 'Navarra', population: 203000, priority: 100 },
  
  // Albacete
  { name: 'Albacete', slug: 'albacete', province: 'Albacete', population: 173000, priority: 80 },
  
  // Badajoz
  { name: 'Badajoz', slug: 'badajoz', province: 'Badajoz', population: 150000, priority: 80 },
  
  // Donostia
  { name: 'Donostia-San Sebastián', slug: 'donostia-san-sebastian', province: 'Guipúzcoa', population: 188000, priority: 90 },
  
  // Santander
  { name: 'Santander', slug: 'santander', province: 'Cantabria', population: 172000, priority: 90 },
  
  // Jerez
  { name: 'Jerez de la Frontera', slug: 'jerez-de-la-frontera', province: 'Cádiz', population: 213000, priority: 85 },
  { name: 'Algeciras', slug: 'algeciras', province: 'Cádiz', population: 123000, priority: 75 },
  { name: 'Cádiz', slug: 'cadiz', province: 'Cádiz', population: 114000, priority: 70 },
  
  // Tarragona
  { name: 'Tarragona', slug: 'tarragona', province: 'Tarragona', population: 140000, priority: 80 },
  { name: 'Reus', slug: 'reus', province: 'Tarragona', population: 104000, priority: 70 },
  
  // León
  { name: 'León', slug: 'leon', province: 'León', population: 124000, priority: 75 },
  
  // Lleida
  { name: 'Lleida', slug: 'lleida', province: 'Lleida', population: 140000, priority: 80 },
  
  // Cáceres
  { name: 'Cáceres', slug: 'caceres', province: 'Cáceres', population: 96000, priority: 65 },
  
  // Burgos
  { name: 'Burgos', slug: 'burgos', province: 'Burgos', population: 175000, priority: 85 },
  
  // Salamanca
  { name: 'Salamanca', slug: 'salamanca', province: 'Salamanca', population: 144000, priority: 75 },
  
  // Logroño
  { name: 'Logroño', slug: 'logrono', province: 'La Rioja', population: 151000, priority: 80 },
  
  // Castellón
  { name: 'Castellón de la Plana', slug: 'castellon-de-la-plana', province: 'Castellón', population: 176000, priority: 85 },
  
  // Las Palmas
  { name: 'Las Palmas de Gran Canaria', slug: 'las-palmas-de-gran-canaria', province: 'Las Palmas', population: 379000, priority: 95 },
  { name: 'Telde', slug: 'telde', province: 'Las Palmas', population: 102000, priority: 70 },
  
  // Toledo
  { name: 'Toledo', slug: 'toledo', province: 'Toledo', population: 86000, priority: 60 },
  { name: 'Talavera de la Reina', slug: 'talavera-de-la-reina', province: 'Toledo', population: 84000, priority: 60 },
  
  // Jaén
  { name: 'Jaén', slug: 'jaen', province: 'Jaén', population: 112000, priority: 70 },
  { name: 'Linares', slug: 'linares', province: 'Jaén', population: 56000, priority: 50 },
  
  // Huelva
  { name: 'Huelva', slug: 'huelva', province: 'Huelva', population: 144000, priority: 75 },
  
  // Palma
  { name: 'Palma', slug: 'palma', province: 'Illes Balears', population: 419000, priority: 95 },
  
  // Girona
  { name: 'Girona', slug: 'girona', province: 'Girona', population: 103000, priority: 70 },
];

async function populateLocalities() {
  console.log('🚀 Poblando localidades españolas (>50k habitantes)...\n');

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const city of cities) {
    try {
      // Verificar si existe
      const { data: existing, error: checkError } = await supabaseAdmin
        .from('localities')
        .select('id, name, is_active')
        .eq('slug', city.slug)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        // Actualizar si está inactiva o cambiar prioridad/población
        if (!existing.is_active || existing.name !== city.name) {
          const { error: updateError } = await supabaseAdmin
            .from('localities')
            .update({
              name: city.name,
              province: city.province,
              population: city.population,
              priority: city.priority,
              is_active: true,
            })
            .eq('slug', city.slug);

          if (updateError) throw updateError;
          updated++;
          console.log(`   ✅ Actualizada: ${city.name} (${city.population.toLocaleString()} hab.)`);
        } else {
          skipped++;
        }
      } else {
        // Crear nueva
        const { error: insertError } = await supabaseAdmin.from('localities').insert({
          name: city.name,
          slug: city.slug,
          province: city.province,
          population: city.population,
          priority: city.priority,
          is_active: true,
        });

        if (insertError) throw insertError;
        created++;
        console.log(`   ➕ Creada: ${city.name} (${city.population.toLocaleString()} hab.)`);
      }
    } catch (error: any) {
      errors++;
      console.error(`   ❌ Error con ${city.name}: ${error.message}`);
    }
  }

  // Desactivar las que no están en la lista (excepto las que ya tienen contenido)
  const { data: allLocalities } = await supabaseAdmin
    .from('localities')
    .select('id, slug, name');

  if (allLocalities) {
    const activeSlugs = new Set(cities.map((c) => c.slug));
    const { data: withContent } = await supabaseAdmin
      .from('service_content')
      .select('locality_id')
      .limit(10000);

    const localitiesWithContent = new Set((withContent || []).map((r: any) => r.locality_id));

    for (const loc of allLocalities) {
      if (!activeSlugs.has(loc.slug) && !localitiesWithContent.has(loc.id)) {
        await supabaseAdmin
          .from('localities')
          .update({ is_active: false })
          .eq('id', loc.id);
        console.log(`   ⏸️  Desactivada: ${loc.name} (sin contenido)`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN');
  console.log('='.repeat(60));
  console.log(`➕ Creadas: ${created}`);
  console.log(`✅ Actualizadas: ${updated}`);
  console.log(`⏭️  Omitidas: ${skipped}`);
  console.log(`❌ Errores: ${errors}`);
  console.log(`📋 Total procesadas: ${cities.length}`);
  console.log('='.repeat(60) + '\n');
}

populateLocalities().catch((e) => {
  console.error('\n❌ Error fatal:', e);
  process.exit(1);
});
