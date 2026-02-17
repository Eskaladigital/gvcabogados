-- =====================================================
-- POLÍTICAS RLS PARA EL BLOG
-- =====================================================
-- Permite lectura pública de posts publicados y categorías.
-- Ejecutar si el blog muestra "0 artículos" en producción.
-- =====================================================

-- Habilitar RLS en tablas del blog (si no está ya)
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Categorías: lectura pública para todos
DROP POLICY IF EXISTS "blog_categories_public_read" ON blog_categories;
CREATE POLICY "blog_categories_public_read" ON blog_categories
  FOR SELECT USING (is_active = true);

-- Autores: lectura pública
DROP POLICY IF EXISTS "blog_authors_public_read" ON blog_authors;
CREATE POLICY "blog_authors_public_read" ON blog_authors
  FOR SELECT USING (is_active = true);

-- Posts: solo publicados visibles para anónimos
DROP POLICY IF EXISTS "blog_posts_public_read_published" ON blog_posts;
CREATE POLICY "blog_posts_public_read_published" ON blog_posts
  FOR SELECT USING (status = 'published');

SELECT 'Políticas RLS del blog aplicadas correctamente' as message;
