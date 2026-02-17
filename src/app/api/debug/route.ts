import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Check env vars (solo mostrar si existen, no los valores)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

  results.env = {
    NEXT_PUBLIC_SUPABASE_URL: url ? `SET (${url.substring(0, 30)}...)` : 'MISSING',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey ? `SET (${anonKey.length} chars)` : 'MISSING',
    SUPABASE_SERVICE_ROLE_KEY: serviceKey ? `SET (${serviceKey.length} chars)` : 'MISSING',
    NEXT_PUBLIC_SITE_URL: siteUrl || 'NOT SET (usará default)',
  };

  if (!url || !serviceKey) {
    results.error = 'Faltan variables de entorno críticas';
    return NextResponse.json(results, { status: 500 });
  }

  // 2. Test con service role
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // blog_posts
  const { data: posts, error: postsErr, count: postsCount } = await admin
    .from('blog_posts')
    .select('id, title_es, slug_es', { count: 'exact' })
    .eq('status', 'published')
    .limit(3);

  results.blog_posts = postsErr
    ? { error: postsErr.message, code: postsErr.code, details: postsErr.details }
    : { count: postsCount, sample: posts?.map((p) => p.title_es) };

  // blog_categories
  const { data: cats, error: catsErr, count: catsCount } = await admin
    .from('blog_categories')
    .select('id, name_es', { count: 'exact' });

  results.blog_categories = catsErr
    ? { error: catsErr.message }
    : { count: catsCount, sample: cats?.map((c) => c.name_es) };

  // service_content
  const { count: scCount, error: scErr } = await admin
    .from('service_content')
    .select('id', { count: 'exact', head: true });

  results.service_content = scErr
    ? { error: scErr.message }
    : { count: scCount };

  // 3. Test con anon key
  const anon = createClient(url, anonKey);
  const { count: anonCount, error: anonErr } = await anon
    .from('blog_posts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');

  results.anon_blog_posts = anonErr
    ? { error: anonErr.message }
    : { count: anonCount };

  results.timestamp = new Date().toISOString();
  results.region = process.env.VERCEL_REGION || 'unknown';

  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
