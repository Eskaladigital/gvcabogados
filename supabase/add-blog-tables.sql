-- =====================================================
-- AÑADIR TABLAS DEL BLOG
-- =====================================================
-- Ejecutar este script después del schema principal
-- Fecha: 2026-02-17
-- =====================================================

-- =====================================================
-- TABLA: BLOG_CATEGORIES (Categorías del Blog)
-- =====================================================

CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_es VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  slug_es VARCHAR(100) NOT NULL UNIQUE,
  slug_en VARCHAR(100) NOT NULL UNIQUE,
  description_es TEXT,
  description_en TEXT,
  color VARCHAR(7), -- Color hex para UI
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_blog_categories_slug_es ON blog_categories(slug_es);
CREATE INDEX idx_blog_categories_slug_en ON blog_categories(slug_en);

-- =====================================================
-- TABLA: BLOG_AUTHORS (Autores del Blog)
-- =====================================================

CREATE TABLE blog_authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  bio_es TEXT,
  bio_en TEXT,
  avatar_url TEXT,
  email VARCHAR(255),
  role VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_blog_authors_slug ON blog_authors(slug);

-- =====================================================
-- TABLA: BLOG_POSTS (Artículos del Blog)
-- =====================================================

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- URLs y títulos
  slug_es VARCHAR(255) NOT NULL UNIQUE,
  slug_en VARCHAR(255) NOT NULL UNIQUE,
  title_es VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  
  -- Metadata
  meta_description_es TEXT,
  meta_description_en TEXT,
  
  -- Contenido (HTML desde TinyMCE)
  excerpt_es TEXT,
  excerpt_en TEXT,
  content_es TEXT NOT NULL,
  content_en TEXT,
  
  -- Relaciones
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES blog_authors(id) ON DELETE SET NULL,
  
  -- Imágenes
  featured_image_url TEXT,
  featured_image_alt_es VARCHAR(255),
  featured_image_alt_en VARCHAR(255),
  
  -- Estado y publicación
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP,
  
  -- SEO y Analytics
  views_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER,
  
  -- Tags (JSON array)
  tags_es JSONB,
  tags_en JSONB,
  
  -- Relacionado con servicios
  related_service_keys JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_blog_posts_slug_es ON blog_posts(slug_es);
CREATE INDEX idx_blog_posts_slug_en ON blog_posts(slug_en);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_views ON blog_posts(views_count DESC);

-- Trigger para updated_at
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS INICIALES: CATEGORÍAS
-- =====================================================

INSERT INTO blog_categories (name_es, name_en, slug_es, slug_en, color, is_active) VALUES
  ('Actualidad Jurídica', 'Legal News', 'actualidad-juridica', 'legal-news', '#714c20', true),
  ('Derecho Civil', 'Civil Law', 'derecho-civil', 'civil-law', '#ccb27f', true),
  ('Derecho Penal', 'Criminal Law', 'derecho-penal', 'criminal-law', '#8b4513', true),
  ('Consejos Legales', 'Legal Advice', 'consejos-legales', 'legal-advice', '#d4af37', true),
  ('Casos de Éxito', 'Success Stories', 'casos-exito', 'success-stories', '#b8860b', true);

-- =====================================================
-- DATOS INICIALES: AUTORES
-- =====================================================

INSERT INTO blog_authors (name, slug, role, is_active) VALUES
  ('Pedro A. García-Valcárcel', 'pedro-garcia-valcarcel', 'Socio Fundador', true),
  ('García-Valcárcel & Cáceres', 'equipo-gvc', 'Equipo Legal', true);

-- =====================================================
-- VISTAS ÚTILES PARA EL BLOG
-- =====================================================

-- Vista: Posts publicados con información completa
CREATE VIEW v_blog_posts_published AS
SELECT 
  bp.*,
  bc.name_es as category_name_es,
  bc.name_en as category_name_en,
  bc.slug_es as category_slug_es,
  bc.slug_en as category_slug_en,
  bc.color as category_color,
  ba.name as author_name,
  ba.slug as author_slug,
  ba.avatar_url as author_avatar
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
LEFT JOIN blog_authors ba ON bp.author_id = ba.id
WHERE bp.status = 'published'
ORDER BY bp.published_at DESC;

-- Vista: Estadísticas del blog
CREATE VIEW v_blog_stats AS
SELECT 
  COUNT(*) FILTER (WHERE status = 'published') as published_count,
  COUNT(*) FILTER (WHERE status = 'draft') as draft_count,
  COUNT(*) FILTER (WHERE status = 'archived') as archived_count,
  SUM(views_count) as total_views,
  AVG(reading_time_minutes) as avg_reading_time
FROM blog_posts;

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON TABLE blog_categories IS 'Categorías para organizar los artículos del blog';
COMMENT ON TABLE blog_posts IS 'Artículos del blog con contenido HTML de TinyMCE';
COMMENT ON TABLE blog_authors IS 'Autores de los artículos del blog';

COMMENT ON COLUMN blog_posts.content_es IS 'Contenido HTML generado con TinyMCE Editor';
COMMENT ON COLUMN blog_posts.status IS 'Estado del post: draft, published, archived';

-- =====================================================
-- FIN
-- =====================================================

SELECT 'Tablas del blog creadas exitosamente!' as message;
