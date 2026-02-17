import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import OpenAI from 'openai';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiKey = process.env.OPENAI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 200);
}

async function translateText(text: string, type: 'title' | 'excerpt' | 'content' | 'meta'): Promise<string> {
  const systemPrompts: Record<string, string> = {
    title: 'You are a professional legal translator. Translate the following Spanish legal article title to English. Return ONLY the translated title, nothing else. Keep it concise and professional.',
    excerpt: 'You are a professional legal translator. Translate the following Spanish legal article excerpt to English. Return ONLY the translated text, nothing else. Keep the same tone and length.',
    meta: 'You are a professional legal translator. Translate the following Spanish meta description to English. Return ONLY the translated text, nothing else. Keep it under 160 characters and SEO-friendly.',
    content: 'You are a professional legal translator specializing in Spanish law. Translate the following HTML content from Spanish to English. IMPORTANT RULES:\n- Keep ALL HTML tags exactly as they are (h1, h2, h3, p, ul, li, strong, em, a, etc.)\n- Translate ONLY the text content between tags\n- Keep href URLs unchanged\n- Keep image src and alt attributes unchanged\n- Maintain the same HTML structure\n- Use proper British/American legal terminology\n- References to Spanish laws should keep the original Spanish name in italics followed by an English translation in parentheses\n- Return ONLY the translated HTML, nothing else.',
  };

  const maxTokens: Record<string, number> = {
    title: 200,
    excerpt: 500,
    meta: 300,
    content: 4000,
  };

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompts[type] },
      { role: 'user', content: text },
    ],
    max_tokens: maxTokens[type],
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content?.trim() || '';
}

async function translateContentInChunks(htmlContent: string): Promise<string> {
  const MAX_CHUNK_SIZE = 3000;

  if (htmlContent.length <= MAX_CHUNK_SIZE) {
    return translateText(htmlContent, 'content');
  }

  // Split by paragraphs/sections to avoid breaking HTML
  const sections = htmlContent.split(/(?=<h[1-6]|<p>|<ul>|<ol>|<div>|<section>|<article>)/gi);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const section of sections) {
    if ((currentChunk + section).length > MAX_CHUNK_SIZE && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = section;
    } else {
      currentChunk += section;
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  console.log(`    Contenido dividido en ${chunks.length} partes para traducción...`);

  const translatedChunks: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    console.log(`    Traduciendo parte ${i + 1}/${chunks.length}...`);
    const translated = await translateText(chunks[i], 'content');
    translatedChunks.push(translated);
    // Pequeña pausa entre llamadas para evitar rate limits
    if (i < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return translatedChunks.join('\n');
}

async function main() {
  console.log('==============================================');
  console.log('  TRADUCCIÓN DE ARTÍCULOS DEL BLOG AL INGLÉS');
  console.log('  Usando OpenAI GPT-4o-mini');
  console.log('==============================================\n');

  // Obtener todos los posts publicados que NO tienen traducción
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug_es, title_es, excerpt_es, content_es, meta_description_es, tags_es, title_en, slug_en')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error al obtener posts:', error);
    return;
  }

  if (!posts || posts.length === 0) {
    console.log('No hay artículos publicados para traducir.');
    return;
  }

  // Filtrar los que no tienen traducción real (slug_en termina en -en = traducción falsa)
  const postsToTranslate = posts.filter(p => {
    if (!p.title_en || !p.slug_en) return true;
    if (p.slug_en === p.slug_es) return true;
    if (p.slug_en === p.slug_es + '-en') return true;
    // Verificar si el título sigue en español (contiene caracteres típicos del español)
    if (p.title_en && /[áéíóúñ¿¡]/i.test(p.title_en)) return true;
    return false;
  });

  console.log(`Total de artículos publicados: ${posts.length}`);
  console.log(`Artículos por traducir: ${postsToTranslate.length}`);
  console.log(`Artículos ya traducidos: ${posts.length - postsToTranslate.length}\n`);

  if (postsToTranslate.length === 0) {
    console.log('Todos los artículos ya están traducidos.');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < postsToTranslate.length; i++) {
    const post = postsToTranslate[i];
    console.log(`\n[${i + 1}/${postsToTranslate.length}] Traduciendo: "${post.title_es}"`);

    try {
      // 1. Traducir título
      console.log('  -> Traduciendo título...');
      const titleEn = await translateText(post.title_es, 'title');
      console.log(`     "${titleEn}"`);

      // 2. Generar slug en inglés
      const slugEn = generateSlug(titleEn);
      console.log(`  -> Slug EN: ${slugEn}`);

      // Verificar que el slug no existe ya
      const { data: existingSlug } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug_en', slugEn)
        .neq('id', post.id)
        .single();

      const finalSlugEn = existingSlug ? `${slugEn}-${Date.now()}` : slugEn;

      // 3. Traducir excerpt
      let excerptEn = '';
      if (post.excerpt_es) {
        console.log('  -> Traduciendo excerpt...');
        excerptEn = await translateText(post.excerpt_es, 'excerpt');
      }

      // 4. Traducir meta description
      let metaDescEn = '';
      if (post.meta_description_es) {
        console.log('  -> Traduciendo meta description...');
        metaDescEn = await translateText(post.meta_description_es, 'meta');
      }

      // 5. Traducir contenido HTML
      console.log('  -> Traduciendo contenido HTML...');
      const contentEn = await translateContentInChunks(post.content_es);

      // 6. Traducir tags si existen
      let tagsEn: string[] | null = null;
      if (post.tags_es && Array.isArray(post.tags_es) && post.tags_es.length > 0) {
        console.log('  -> Traduciendo tags...');
        const tagsText = post.tags_es.join(', ');
        const translatedTags = await translateText(tagsText, 'title');
        tagsEn = translatedTags.split(',').map((t: string) => t.trim()).filter(Boolean);
      }

      // 7. Guardar en Supabase
      console.log('  -> Guardando en Supabase...');
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title_en: titleEn,
          slug_en: finalSlugEn,
          excerpt_en: excerptEn || null,
          content_en: contentEn,
          meta_description_en: metaDescEn || null,
          tags_en: tagsEn,
          updated_at: new Date().toISOString(),
        })
        .eq('id', post.id);

      if (updateError) {
        console.error(`  ✗ Error al guardar: ${updateError.message}`);
        errorCount++;
      } else {
        console.log(`  ✓ Traducido correctamente`);
        successCount++;
      }

      // Pausa entre artículos para no saturar la API
      if (i < postsToTranslate.length - 1) {
        console.log('  (pausa de 1s...)');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (err: any) {
      console.error(`  ✗ Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n==============================================');
  console.log('  RESULTADO FINAL');
  console.log('==============================================');
  console.log(`  Traducidos correctamente: ${successCount}`);
  console.log(`  Errores: ${errorCount}`);
  console.log(`  Total procesados: ${successCount + errorCount}`);
  console.log('==============================================\n');
}

main().catch(console.error);
