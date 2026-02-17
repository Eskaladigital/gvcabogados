-- =====================================================
-- DIAGNÓSTICO: ¿Por qué el blog muestra 0 artículos?
-- =====================================================
-- Ejecuta este script en Supabase SQL Editor y revisa los resultados.
-- =====================================================

-- 1. ¿Hay posts en la tabla?
SELECT 'Total posts' as check_name, COUNT(*) as result FROM blog_posts;

-- 2. ¿Cuántos están publicados?
SELECT 'Posts publicados' as check_name, COUNT(*) as result 
FROM blog_posts WHERE status = 'published';

-- 3. Lista de posts con su status
SELECT id, slug_es, title_es, status, published_at 
FROM blog_posts 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. ¿RLS está habilitado en blog_posts?
SELECT relname as table_name, relrowsecurity as rls_enabled
FROM pg_class 
WHERE relname IN ('blog_posts', 'blog_categories');

-- 5. ¿Existen políticas RLS?
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN ('blog_posts', 'blog_categories');
