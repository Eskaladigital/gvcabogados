-- =====================================================
-- LECTURA PÚBLICA PARA TODAS LAS TABLAS
-- =====================================================
-- Asegura que la web (anon key) pueda leer todo el contenido.
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Proyecto: txzrfgybtkrvxmmtpwao
-- =====================================================

-- DESHABILITAR RLS en todas las tablas públicas
-- (Sin RLS = acceso total de lectura para anon/authenticated)
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'localities', 'services', 'service_content', 'local_entities',
    'blog_categories', 'blog_posts', 'blog_authors'
  ];
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    BEGIN
      EXECUTE format('ALTER TABLE IF EXISTS %I DISABLE ROW LEVEL SECURITY', t);
      RAISE NOTICE 'RLS deshabilitado en: %', t;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Tabla % no existe o error: %', t, SQLERRM;
    END;
  END LOOP;
END $$;

-- Verificación
SELECT 
  relname as tabla,
  relrowsecurity as rls_habilitado
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' 
  AND relname IN ('localities', 'services', 'service_content', 'blog_posts', 'blog_categories')
  AND relkind = 'r'
ORDER BY relname;

SELECT '✅ Script completado - todas las tablas sin restricciones RLS' as resultado;
