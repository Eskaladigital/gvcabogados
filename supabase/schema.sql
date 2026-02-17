-- =====================================================
-- SCHEMA PARA CONTENIDO MULTILOCAL - GVCABOGADOS
-- =====================================================
-- Ejecutar en: Supabase SQL Editor
-- Fecha: 2026-02-17
-- =====================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA 1: LOCALITIES (Localidades)
-- =====================================================

CREATE TABLE localities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  province VARCHAR(100) NOT NULL,
  population INTEGER,
  postal_code VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para localities
CREATE INDEX idx_localities_slug ON localities(slug);
CREATE INDEX idx_localities_province ON localities(province);
CREATE INDEX idx_localities_is_active ON localities(is_active);
CREATE INDEX idx_localities_priority ON localities(priority DESC);

-- Trigger para updated_at en localities
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_localities_updated_at
    BEFORE UPDATE ON localities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA 2: SERVICES (Servicios Base)
-- =====================================================

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_key VARCHAR(100) NOT NULL UNIQUE,
  name_es VARCHAR(200) NOT NULL,
  name_en VARCHAR(200) NOT NULL,
  icon VARCHAR(50),
  category VARCHAR(50),
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para services
CREATE INDEX idx_services_service_key ON services(service_key);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_services_category ON services(category);

-- =====================================================
-- TABLA 3: SERVICE_CONTENT (Contenido Localizado)
-- =====================================================

CREATE TABLE service_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  locality_id UUID NOT NULL REFERENCES localities(id) ON DELETE CASCADE,
  
  -- URLs
  slug_es VARCHAR(255) NOT NULL UNIQUE,
  slug_en VARCHAR(255) NOT NULL UNIQUE,
  
  -- Contenido Español
  title_es VARCHAR(255) NOT NULL,
  meta_description_es TEXT,
  short_description_es TEXT,
  long_description_es TEXT,
  
  -- Secciones (JSON array con {title, content})
  sections_es JSONB,
  
  -- Proceso de trabajo (JSON array de strings)
  process_es JSONB,
  
  -- FAQs (JSON array con {question, answer})
  faqs_es JSONB,
  
  -- Contenido Inglés
  title_en VARCHAR(255),
  meta_description_en TEXT,
  short_description_en TEXT,
  long_description_en TEXT,
  sections_en JSONB,
  process_en JSONB,
  faqs_en JSONB,
  
  -- Metadata
  translation_status VARCHAR(20) DEFAULT 'pending' CHECK (translation_status IN ('pending', 'translated', 'reviewed')),
  content_quality_score INTEGER CHECK (content_quality_score >= 0 AND content_quality_score <= 100),
  last_reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(service_id, locality_id)
);

-- Índices para service_content
CREATE INDEX idx_service_content_service ON service_content(service_id);
CREATE INDEX idx_service_content_locality ON service_content(locality_id);
CREATE INDEX idx_service_content_slug_es ON service_content(slug_es);
CREATE INDEX idx_service_content_slug_en ON service_content(slug_en);
CREATE INDEX idx_service_content_translation_status ON service_content(translation_status);
CREATE INDEX idx_service_content_quality ON service_content(content_quality_score DESC);

-- Trigger para updated_at en service_content
CREATE TRIGGER update_service_content_updated_at
    BEFORE UPDATE ON service_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA 4: LOCAL_ENTITIES (Entidades Locales)
-- =====================================================

CREATE TABLE local_entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locality_id UUID NOT NULL REFERENCES localities(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('court', 'hospital', 'police', 'registry', 'government', 'road', 'mediation_center', 'other')),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  website VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para local_entities
CREATE INDEX idx_local_entities_locality ON local_entities(locality_id);
CREATE INDEX idx_local_entities_type ON local_entities(entity_type);
CREATE INDEX idx_local_entities_locality_type ON local_entities(locality_id, entity_type);

-- =====================================================
-- TABLA 5: BLOG_CATEGORIES (Categorías del Blog)
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

-- Índices para blog_categories
CREATE INDEX idx_blog_categories_slug_es ON blog_categories(slug_es);
CREATE INDEX idx_blog_categories_slug_en ON blog_categories(slug_en);

-- =====================================================
-- TABLA 6: BLOG_POSTS (Artículos del Blog)
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
  author_name VARCHAR(100),
  
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
  
  -- Relacionado con servicios (opcional)
  related_service_keys JSONB, -- Array de service_keys relacionados
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para blog_posts
CREATE INDEX idx_blog_posts_slug_es ON blog_posts(slug_es);
CREATE INDEX idx_blog_posts_slug_en ON blog_posts(slug_en);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_views ON blog_posts(views_count DESC);

-- Trigger para updated_at en blog_posts
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA 7: BLOG_AUTHORS (Autores del Blog - Opcional)
-- =====================================================

CREATE TABLE blog_authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  bio_es TEXT,
  bio_en TEXT,
  avatar_url TEXT,
  email VARCHAR(255),
  role VARCHAR(100), -- Ej: "Socio", "Abogado", "Colaborador"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para blog_authors
CREATE INDEX idx_blog_authors_slug ON blog_authors(slug);

-- Añadir relación de autor a blog_posts (opcional, si no usas author_name)
ALTER TABLE blog_posts ADD COLUMN author_id UUID REFERENCES blog_authors(id) ON DELETE SET NULL;
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);

-- =====================================================
-- DATOS INICIALES: CATEGORÍAS DEL BLOG
-- =====================================================

INSERT INTO blog_categories (name_es, name_en, slug_es, slug_en, color, is_active) VALUES
  ('Actualidad Jurídica', 'Legal News', 'actualidad-juridica', 'legal-news', '#714c20', true),
  ('Derecho Civil', 'Civil Law', 'derecho-civil', 'civil-law', '#ccb27f', true),
  ('Derecho Penal', 'Criminal Law', 'derecho-penal', 'criminal-law', '#8b4513', true),
  ('Consejos Legales', 'Legal Advice', 'consejos-legales', 'legal-advice', '#d4af37', true),
  ('Casos de Éxito', 'Success Stories', 'casos-exito', 'success-stories', '#b8860b', true);

-- =====================================================
-- DATOS INICIALES: AUTORES DEL BLOG
-- =====================================================

INSERT INTO blog_authors (name, slug, role, is_active) VALUES
  ('Pedro A. García-Valcárcel', 'pedro-garcia-valcarcel', 'Socio Fundador', true),
  ('García-Valcárcel & Cáceres', 'equipo-gvc', 'Equipo Legal', true);

-- =====================================================
-- DATOS INICIALES: LOCALIDADES
-- =====================================================

INSERT INTO localities (name, slug, province, population, is_active, priority) VALUES
  ('Murcia', 'murcia', 'Murcia', 453258, true, 100),
  ('Alicante', 'alicante', 'Alicante', 334887, true, 90),
  ('Cartagena', 'cartagena', 'Murcia', 218534, true, 85),
  ('Albacete', 'albacete', 'Albacete', 173329, true, 80),
  ('Lorca', 'lorca', 'Murcia', 95515, true, 70),
  ('Molina de Segura', 'molina-de-segura', 'Murcia', 73718, true, 65),
  ('Alcantarilla', 'alcantarilla', 'Murcia', 42327, true, 60),
  ('Jumilla', 'jumilla', 'Murcia', 25755, true, 55),
  ('Cieza', 'cieza', 'Murcia', 35179, true, 55),
  ('Yecla', 'yecla', 'Murcia', 34520, true, 55),
  ('Águilas', 'aguilas', 'Murcia', 35427, true, 50),
  ('Caravaca de la Cruz', 'caravaca-de-la-cruz', 'Murcia', 26449, true, 50),
  ('Totana', 'totana', 'Murcia', 32284, true, 50),
  ('Mazarrón', 'mazarron', 'Murcia', 33640, true, 50),
  ('San Javier', 'san-javier', 'Murcia', 33432, true, 50);

-- =====================================================
-- DATOS INICIALES: SERVICIOS
-- =====================================================

INSERT INTO services (service_key, name_es, name_en, icon, category, priority, is_active) VALUES
  ('accidentes-trafico', 'Accidentes de Tráfico', 'Traffic Accidents', 'Car', 'privado', 100, true),
  ('derecho-familia', 'Derecho de Familia', 'Family Law', 'Users', 'privado', 95, true),
  ('derecho-bancario', 'Derecho Bancario', 'Banking Law', 'Building2', 'privado', 90, true),
  ('derecho-penal', 'Derecho Penal', 'Criminal Law', 'Scale', 'publico', 90, true),
  ('derecho-inmobiliario', 'Derecho Inmobiliario', 'Real Estate Law', 'Home', 'privado', 85, true),
  ('derecho-sucesorio', 'Derecho Sucesorio', 'Inheritance Law', 'FileText', 'privado', 85, true),
  ('derecho-mercantil', 'Derecho Mercantil', 'Commercial Law', 'Briefcase', 'privado', 80, true),
  ('responsabilidad-civil', 'Responsabilidad Civil y Seguros', 'Civil Liability and Insurance', 'Shield', 'privado', 80, true),
  ('obligaciones-contratos', 'Obligaciones y Contratos', 'Obligations and Contracts', 'FileText', 'privado', 75, true),
  ('mediacion', 'Mediación Civil y Mercantil', 'Civil and Commercial Mediation', 'Handshake', 'privado', 70, true),
  ('extranjeria', 'Extranjería e Inmigración', 'Immigration Law', 'Clipboard', 'publico', 70, true),
  ('derecho-administrativo', 'Derecho Administrativo', 'Administrative Law', 'Landmark', 'publico', 65, true),
  ('defensa-fondos-buitre', 'Defensa frente a Fondos Buitre', 'Vulture Fund Defense', 'Shield', 'privado', 60, true),
  ('negligencias-medicas', 'Negligencias Médicas', 'Medical Malpractice', 'Stethoscope', 'privado', 90, true);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista: Contenido completo con nombres de servicio y localidad
CREATE VIEW v_service_content_full AS
SELECT 
  sc.*,
  s.service_key,
  s.name_es as service_name_es,
  s.name_en as service_name_en,
  l.name as locality_name,
  l.slug as locality_slug,
  l.province
FROM service_content sc
JOIN services s ON sc.service_id = s.id
JOIN localities l ON sc.locality_id = l.id;

-- Vista: Estadísticas de contenido por localidad
CREATE VIEW v_content_stats_by_locality AS
SELECT 
  l.name as locality,
  l.province,
  COUNT(sc.id) as total_content,
  COUNT(CASE WHEN sc.translation_status = 'translated' THEN 1 END) as translated_count,
  COUNT(CASE WHEN sc.translation_status = 'reviewed' THEN 1 END) as reviewed_count,
  AVG(sc.content_quality_score) as avg_quality_score
FROM localities l
LEFT JOIN service_content sc ON l.id = sc.locality_id
WHERE l.is_active = true
GROUP BY l.id, l.name, l.province
ORDER BY total_content DESC;

-- Vista: Estadísticas de contenido por servicio
CREATE VIEW v_content_stats_by_service AS
SELECT 
  s.service_key,
  s.name_es,
  s.category,
  COUNT(sc.id) as total_localities,
  COUNT(CASE WHEN sc.translation_status = 'translated' THEN 1 END) as translated_count,
  AVG(sc.content_quality_score) as avg_quality_score
FROM services s
LEFT JOIN service_content sc ON s.id = sc.service_id
WHERE s.is_active = true
GROUP BY s.id, s.service_key, s.name_es, s.category
ORDER BY s.priority DESC;

-- =====================================================
-- POLÍTICAS RLS (Row Level Security) - OPCIONAL
-- =====================================================

-- Habilitar RLS en todas las tablas
-- ALTER TABLE localities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE services ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE service_content ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE local_entities ENABLE ROW LEVEL SECURITY;

-- Política: Lectura pública para contenido activo
-- CREATE POLICY "Public read access" ON service_content
--   FOR SELECT USING (true);

-- CREATE POLICY "Public read access" ON localities
--   FOR SELECT USING (is_active = true);

-- CREATE POLICY "Public read access" ON services
--   FOR SELECT USING (is_active = true);

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función: Obtener contenido por slug
CREATE OR REPLACE FUNCTION get_service_content_by_slug(
  p_slug VARCHAR,
  p_locale VARCHAR DEFAULT 'es'
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  meta_description TEXT,
  short_description TEXT,
  long_description TEXT,
  sections JSONB,
  process JSONB,
  faqs JSONB,
  service_name VARCHAR,
  locality_name VARCHAR,
  province VARCHAR
) AS $$
BEGIN
  IF p_locale = 'es' THEN
    RETURN QUERY
    SELECT 
      sc.id,
      sc.title_es::VARCHAR,
      sc.meta_description_es,
      sc.short_description_es,
      sc.long_description_es,
      sc.sections_es,
      sc.process_es,
      sc.faqs_es,
      s.name_es::VARCHAR,
      l.name::VARCHAR,
      l.province::VARCHAR
    FROM service_content sc
    JOIN services s ON sc.service_id = s.id
    JOIN localities l ON sc.locality_id = l.id
    WHERE sc.slug_es = p_slug;
  ELSE
    RETURN QUERY
    SELECT 
      sc.id,
      sc.title_en::VARCHAR,
      sc.meta_description_en,
      sc.short_description_en,
      sc.long_description_en,
      sc.sections_en,
      sc.process_en,
      sc.faqs_en,
      s.name_en::VARCHAR,
      l.name::VARCHAR,
      l.province::VARCHAR
    FROM service_content sc
    JOIN services s ON sc.service_id = s.id
    JOIN localities l ON sc.locality_id = l.id
    WHERE sc.slug_en = p_slug;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTARIOS EN TABLAS
-- =====================================================

COMMENT ON TABLE localities IS 'Localidades donde se ofrece el servicio';
COMMENT ON TABLE services IS 'Servicios legales base del despacho';
COMMENT ON TABLE service_content IS 'Contenido localizado para cada servicio por localidad';
COMMENT ON TABLE local_entities IS 'Entidades locales de referencia (juzgados, hospitales, etc.)';
COMMENT ON TABLE blog_categories IS 'Categorías para organizar los artículos del blog';
COMMENT ON TABLE blog_posts IS 'Artículos del blog con contenido HTML de TinyMCE';
COMMENT ON TABLE blog_authors IS 'Autores de los artículos del blog';

COMMENT ON COLUMN service_content.translation_status IS 'Estado de la traducción: pending, translated, reviewed';
COMMENT ON COLUMN service_content.content_quality_score IS 'Puntuación de calidad del contenido (0-100)';
COMMENT ON COLUMN blog_posts.content_es IS 'Contenido HTML generado con TinyMCE Editor';
COMMENT ON COLUMN blog_posts.status IS 'Estado del post: draft, published, archived';

-- =====================================================
-- FIN DEL SCHEMA
-- =====================================================

SELECT 'Schema creado exitosamente!' as message;
