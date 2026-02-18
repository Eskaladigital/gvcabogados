-- =====================================================
-- MIGRACIÓN: 6 TABLAS POR SERVICIO
-- =====================================================
-- Reemplaza la tabla genérica service_content con
-- 6 tablas especializadas, una por servicio.
-- Cada columna mapea exactamente una sección de la página.
-- =====================================================

-- =====================================================
-- 1. svc_accidentes_trafico
-- =====================================================
-- Secciones: hero+stats, intro, tipos_accidente, sections, banner_baremo, que_hacer, process, faqs
CREATE TABLE svc_accidentes_trafico (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locality_id UUID NOT NULL REFERENCES localities(id) ON DELETE CASCADE,
  slug_es VARCHAR(255) NOT NULL UNIQUE,
  slug_en VARCHAR(255) NOT NULL UNIQUE,

  -- SEO
  title_es VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  meta_description_es TEXT,
  meta_description_en TEXT,
  short_description_es TEXT,
  short_description_en TEXT,

  -- Intro (texto largo de introducción)
  intro_es TEXT,
  intro_en TEXT,

  -- Stats bar [{value, label}]
  stats_es JSONB,
  stats_en JSONB,

  -- Tipos de accidente [{titulo, descripcion, icon}]
  tipos_accidente_es JSONB,
  tipos_accidente_en JSONB,

  -- Secciones de contenido [{title, content}]
  sections_es JSONB,
  sections_en JSONB,

  -- Banner baremo (texto HTML)
  banner_baremo_es TEXT,
  banner_baremo_en TEXT,

  -- Qué hacer tras accidente [{paso, titulo, descripcion}]
  que_hacer_es JSONB,
  que_hacer_en JSONB,

  -- Proceso [{paso, titulo, descripcion}]
  process_es JSONB,
  process_en JSONB,

  -- FAQs [{question, answer}]
  faqs_es JSONB,
  faqs_en JSONB,

  -- Metadata
  content_quality_score INTEGER CHECK (content_quality_score >= 0 AND content_quality_score <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(locality_id)
);

CREATE INDEX idx_svc_acc_locality ON svc_accidentes_trafico(locality_id);
CREATE INDEX idx_svc_acc_slug_es ON svc_accidentes_trafico(slug_es);
CREATE INDEX idx_svc_acc_slug_en ON svc_accidentes_trafico(slug_en);

CREATE TRIGGER update_svc_accidentes_trafico_updated_at
    BEFORE UPDATE ON svc_accidentes_trafico
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. svc_derecho_familia
-- =====================================================
-- Secciones: hero+stats, intro, areas, sections, banner_confidencialidad, que_saber, process, faqs
CREATE TABLE svc_derecho_familia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locality_id UUID NOT NULL REFERENCES localities(id) ON DELETE CASCADE,
  slug_es VARCHAR(255) NOT NULL UNIQUE,
  slug_en VARCHAR(255) NOT NULL UNIQUE,

  title_es VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  meta_description_es TEXT,
  meta_description_en TEXT,
  short_description_es TEXT,
  short_description_en TEXT,

  intro_es TEXT,
  intro_en TEXT,

  stats_es JSONB,
  stats_en JSONB,

  -- Áreas de actuación [{titulo, descripcion}]
  areas_es JSONB,
  areas_en JSONB,

  sections_es JSONB,
  sections_en JSONB,

  -- Banner confidencialidad (texto HTML)
  banner_confidencialidad_es TEXT,
  banner_confidencialidad_en TEXT,

  -- Qué debe saber [{paso, titulo, descripcion}]
  que_saber_es JSONB,
  que_saber_en JSONB,

  process_es JSONB,
  process_en JSONB,

  faqs_es JSONB,
  faqs_en JSONB,

  content_quality_score INTEGER CHECK (content_quality_score >= 0 AND content_quality_score <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(locality_id)
);

CREATE INDEX idx_svc_fam_locality ON svc_derecho_familia(locality_id);
CREATE INDEX idx_svc_fam_slug_es ON svc_derecho_familia(slug_es);
CREATE INDEX idx_svc_fam_slug_en ON svc_derecho_familia(slug_en);

CREATE TRIGGER update_svc_derecho_familia_updated_at
    BEFORE UPDATE ON svc_derecho_familia
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. svc_negligencias_medicas
-- =====================================================
-- Secciones: hero+stats, intro, tipos_negligencia, sections, banner_plazos, hospitales, process, faqs
CREATE TABLE svc_negligencias_medicas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locality_id UUID NOT NULL REFERENCES localities(id) ON DELETE CASCADE,
  slug_es VARCHAR(255) NOT NULL UNIQUE,
  slug_en VARCHAR(255) NOT NULL UNIQUE,

  title_es VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  meta_description_es TEXT,
  meta_description_en TEXT,
  short_description_es TEXT,
  short_description_en TEXT,

  intro_es TEXT,
  intro_en TEXT,

  stats_es JSONB,
  stats_en JSONB,

  -- Tipos de negligencia [{titulo, descripcion, icon}]
  tipos_negligencia_es JSONB,
  tipos_negligencia_en JSONB,

  sections_es JSONB,
  sections_en JSONB,

  -- Banner plazos (texto HTML)
  banner_plazos_es TEXT,
  banner_plazos_en TEXT,

  -- Hospitales y centros [{nombre, tipo, direccion}]
  hospitales_es JSONB,
  hospitales_en JSONB,

  process_es JSONB,
  process_en JSONB,

  faqs_es JSONB,
  faqs_en JSONB,

  content_quality_score INTEGER CHECK (content_quality_score >= 0 AND content_quality_score <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(locality_id)
);

CREATE INDEX idx_svc_neg_locality ON svc_negligencias_medicas(locality_id);
CREATE INDEX idx_svc_neg_slug_es ON svc_negligencias_medicas(slug_es);
CREATE INDEX idx_svc_neg_slug_en ON svc_negligencias_medicas(slug_en);

CREATE TRIGGER update_svc_negligencias_medicas_updated_at
    BEFORE UPDATE ON svc_negligencias_medicas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. svc_permisos_residencia
-- =====================================================
-- Secciones: hero+stats, intro, tipos_permiso, sections, banner_oficina, documentacion, process, faqs
CREATE TABLE svc_permisos_residencia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locality_id UUID NOT NULL REFERENCES localities(id) ON DELETE CASCADE,
  slug_es VARCHAR(255) NOT NULL UNIQUE,
  slug_en VARCHAR(255) NOT NULL UNIQUE,

  title_es VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  meta_description_es TEXT,
  meta_description_en TEXT,
  short_description_es TEXT,
  short_description_en TEXT,

  intro_es TEXT,
  intro_en TEXT,

  stats_es JSONB,
  stats_en JSONB,

  -- Tipos de permiso [{titulo, descripcion, icon}]
  tipos_permiso_es JSONB,
  tipos_permiso_en JSONB,

  sections_es JSONB,
  sections_en JSONB,

  -- Banner oficina extranjería (texto HTML)
  banner_oficina_es TEXT,
  banner_oficina_en TEXT,

  -- Documentación necesaria [{paso, titulo, descripcion}]
  documentacion_es JSONB,
  documentacion_en JSONB,

  process_es JSONB,
  process_en JSONB,

  faqs_es JSONB,
  faqs_en JSONB,

  content_quality_score INTEGER CHECK (content_quality_score >= 0 AND content_quality_score <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(locality_id)
);

CREATE INDEX idx_svc_perm_locality ON svc_permisos_residencia(locality_id);
CREATE INDEX idx_svc_perm_slug_es ON svc_permisos_residencia(slug_es);
CREATE INDEX idx_svc_perm_slug_en ON svc_permisos_residencia(slug_en);

CREATE TRIGGER update_svc_permisos_residencia_updated_at
    BEFORE UPDATE ON svc_permisos_residencia
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. svc_responsabilidad_admin
-- =====================================================
-- Secciones: hero+stats, intro, tipos_responsabilidad, sections, banner_plazos, organismos, process, faqs
CREATE TABLE svc_responsabilidad_admin (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locality_id UUID NOT NULL REFERENCES localities(id) ON DELETE CASCADE,
  slug_es VARCHAR(255) NOT NULL UNIQUE,
  slug_en VARCHAR(255) NOT NULL UNIQUE,

  title_es VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  meta_description_es TEXT,
  meta_description_en TEXT,
  short_description_es TEXT,
  short_description_en TEXT,

  intro_es TEXT,
  intro_en TEXT,

  stats_es JSONB,
  stats_en JSONB,

  -- Tipos de responsabilidad patrimonial [{titulo, descripcion, icon}]
  tipos_responsabilidad_es JSONB,
  tipos_responsabilidad_en JSONB,

  sections_es JSONB,
  sections_en JSONB,

  -- Banner plazos recurso (texto HTML)
  banner_plazos_es TEXT,
  banner_plazos_en TEXT,

  -- Organismos públicos [{nombre, tipo, direccion}]
  organismos_es JSONB,
  organismos_en JSONB,

  process_es JSONB,
  process_en JSONB,

  faqs_es JSONB,
  faqs_en JSONB,

  content_quality_score INTEGER CHECK (content_quality_score >= 0 AND content_quality_score <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(locality_id)
);

CREATE INDEX idx_svc_radm_locality ON svc_responsabilidad_admin(locality_id);
CREATE INDEX idx_svc_radm_slug_es ON svc_responsabilidad_admin(slug_es);
CREATE INDEX idx_svc_radm_slug_en ON svc_responsabilidad_admin(slug_en);

CREATE TRIGGER update_svc_responsabilidad_admin_updated_at
    BEFORE UPDATE ON svc_responsabilidad_admin
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. svc_responsabilidad_civil
-- =====================================================
-- Secciones: hero+stats, intro, tipos_responsabilidad, sections, banner_conceptos, plazos_prescripcion, process, faqs
CREATE TABLE svc_responsabilidad_civil (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locality_id UUID NOT NULL REFERENCES localities(id) ON DELETE CASCADE,
  slug_es VARCHAR(255) NOT NULL UNIQUE,
  slug_en VARCHAR(255) NOT NULL UNIQUE,

  title_es VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  meta_description_es TEXT,
  meta_description_en TEXT,
  short_description_es TEXT,
  short_description_en TEXT,

  intro_es TEXT,
  intro_en TEXT,

  stats_es JSONB,
  stats_en JSONB,

  -- Tipos de responsabilidad civil [{titulo, descripcion, icon}]
  tipos_responsabilidad_es JSONB,
  tipos_responsabilidad_en JSONB,

  sections_es JSONB,
  sections_en JSONB,

  -- Banner conceptos indemnizatorios (texto HTML)
  banner_conceptos_es TEXT,
  banner_conceptos_en TEXT,

  -- Plazos de prescripción [{tipo, plazo, descripcion}]
  plazos_prescripcion_es JSONB,
  plazos_prescripcion_en JSONB,

  process_es JSONB,
  process_en JSONB,

  faqs_es JSONB,
  faqs_en JSONB,

  content_quality_score INTEGER CHECK (content_quality_score >= 0 AND content_quality_score <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(locality_id)
);

CREATE INDEX idx_svc_rciv_locality ON svc_responsabilidad_civil(locality_id);
CREATE INDEX idx_svc_rciv_slug_es ON svc_responsabilidad_civil(slug_es);
CREATE INDEX idx_svc_rciv_slug_en ON svc_responsabilidad_civil(slug_en);

CREATE TRIGGER update_svc_responsabilidad_civil_updated_at
    BEFORE UPDATE ON svc_responsabilidad_civil
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HABILITAR LECTURA PÚBLICA (RLS)
-- =====================================================
ALTER TABLE svc_accidentes_trafico ENABLE ROW LEVEL SECURITY;
ALTER TABLE svc_derecho_familia ENABLE ROW LEVEL SECURITY;
ALTER TABLE svc_negligencias_medicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE svc_permisos_residencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE svc_responsabilidad_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE svc_responsabilidad_civil ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read svc_accidentes_trafico" ON svc_accidentes_trafico FOR SELECT USING (true);
CREATE POLICY "Public read svc_derecho_familia" ON svc_derecho_familia FOR SELECT USING (true);
CREATE POLICY "Public read svc_negligencias_medicas" ON svc_negligencias_medicas FOR SELECT USING (true);
CREATE POLICY "Public read svc_permisos_residencia" ON svc_permisos_residencia FOR SELECT USING (true);
CREATE POLICY "Public read svc_responsabilidad_admin" ON svc_responsabilidad_admin FOR SELECT USING (true);
CREATE POLICY "Public read svc_responsabilidad_civil" ON svc_responsabilidad_civil FOR SELECT USING (true);

-- =====================================================
-- COMENTARIOS
-- =====================================================
COMMENT ON TABLE svc_accidentes_trafico IS 'Contenido por localidad: Accidentes de Tráfico';
COMMENT ON TABLE svc_derecho_familia IS 'Contenido por localidad: Derecho de Familia';
COMMENT ON TABLE svc_negligencias_medicas IS 'Contenido por localidad: Negligencias Médicas';
COMMENT ON TABLE svc_permisos_residencia IS 'Contenido por localidad: Permisos de Residencia e Inmigración';
COMMENT ON TABLE svc_responsabilidad_admin IS 'Contenido por localidad: Responsabilidad de la Administración';
COMMENT ON TABLE svc_responsabilidad_civil IS 'Contenido por localidad: Responsabilidad Civil y Seguros';

SELECT '6 tablas de servicio creadas exitosamente!' as message;
