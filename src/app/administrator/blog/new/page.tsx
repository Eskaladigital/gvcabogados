'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

export default function NewBlogPostPage() {
  const router = useRouter();
  const editorRefEs = useRef<any>(null);
  const editorRefEn = useRef<any>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'es' | 'en'>('es');
  const [form, setForm] = useState({
    slug: '',
    title_es: '',
    title_en: '',
    excerpt_es: '',
    excerpt_en: '',
    content_es: '',
    content_en: '',
    category: '',
    cover_image: '',
    author: '',
    published: false,
    published_at: new Date().toISOString().split('T')[0],
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Auto-generate slug from ES title
    if (field === 'title_es' && !form.slug) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 80);
      setForm((prev) => ({ ...prev, slug }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const contentEs = editorRefEs.current?.getContent() || form.content_es;
      const contentEn = editorRefEn.current?.getContent() || form.content_en;

      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          content_es: contentEs,
          content_en: contentEn,
          published_at: form.published_at + 'T12:00:00Z',
        }),
      });

      if (res.ok) {
        router.push('/administrator/blog');
      }
    } catch (error) {
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const tinymceKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || '';

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-brand-dark">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/administrator/blog" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <span className="text-white text-sm font-semibold">Nuevo artículo</span>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary !text-xs">
            <Save size={14} /> {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main content */}
          <div className="bg-white border border-neutral-200 p-6">
            {/* Language tabs */}
            <div className="flex gap-0 mb-6 border-b border-neutral-200">
              {(['es', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === lang
                      ? 'border-brand-brown text-brand-brown'
                      : 'border-transparent text-neutral-400 hover:text-neutral-500'
                  }`}
                >
                  {lang === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                </button>
              ))}
            </div>

            {/* ES Fields */}
            <div className={activeTab === 'es' ? 'block' : 'hidden'}>
              <div className="mb-4">
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Título (ES)</label>
                <input
                  value={form.title_es}
                  onChange={(e) => handleChange('title_es', e.target.value)}
                  className="w-full text-lg font-serif font-semibold text-brand-dark bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:border-brand-brown"
                  placeholder="Título del artículo en español"
                />
              </div>
              <div className="mb-4">
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Extracto (ES)</label>
                <textarea
                  value={form.excerpt_es}
                  onChange={(e) => handleChange('excerpt_es', e.target.value)}
                  className="w-full text-sm text-brand-dark bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:border-brand-brown min-h-[60px] resize-y"
                  placeholder="Breve descripción del artículo"
                />
              </div>
              <div className="mb-4">
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Contenido (ES)</label>
                <Editor
                  apiKey={tinymceKey}
                  onInit={(evt, editor) => (editorRefEs.current = editor)}
                  initialValue={form.content_es}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                    toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | removeformat | code',
                    content_style: 'body { font-family: Inter, sans-serif; font-size: 14px; }',
                  }}
                />
              </div>
            </div>

            {/* EN Fields */}
            <div className={activeTab === 'en' ? 'block' : 'hidden'}>
              <div className="mb-4">
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Title (EN)</label>
                <input
                  value={form.title_en}
                  onChange={(e) => handleChange('title_en', e.target.value)}
                  className="w-full text-lg font-serif font-semibold text-brand-dark bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:border-brand-brown"
                  placeholder="Article title in English"
                />
              </div>
              <div className="mb-4">
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Excerpt (EN)</label>
                <textarea
                  value={form.excerpt_en}
                  onChange={(e) => handleChange('excerpt_en', e.target.value)}
                  className="w-full text-sm text-brand-dark bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:border-brand-brown min-h-[60px] resize-y"
                  placeholder="Brief article description"
                />
              </div>
              <div className="mb-4">
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Content (EN)</label>
                <Editor
                  apiKey={tinymceKey}
                  onInit={(evt, editor) => (editorRefEn.current = editor)}
                  initialValue={form.content_en}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                    toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | removeformat | code',
                    content_style: 'body { font-family: Inter, sans-serif; font-size: 14px; }',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-neutral-200 p-5">
              <h3 className="text-xs font-semibold text-brand-dark uppercase tracking-wider mb-4">Configuración</h3>
              <div className="mb-4">
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Slug (URL)</label>
                <input
                  value={form.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="w-full text-xs text-brand-dark bg-neutral-50 border border-neutral-200 px-3 py-2 outline-none focus:border-brand-brown"
                  placeholder="url-del-articulo"
                />
              </div>
              <div className="mb-4">
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Categoría</label>
                <input
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full text-xs text-brand-dark bg-neutral-50 border border-neutral-200 px-3 py-2 outline-none focus:border-brand-brown"
                  placeholder="Derecho de Familia"
                />
              </div>
              <div className="mb-4">
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Autor</label>
                <input
                  value={form.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="w-full text-xs text-brand-dark bg-neutral-50 border border-neutral-200 px-3 py-2 outline-none focus:border-brand-brown"
                  placeholder="Nombre del autor"
                />
              </div>
              <div className="mb-4">
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Fecha publicación</label>
                <input
                  type="date"
                  value={form.published_at}
                  onChange={(e) => handleChange('published_at', e.target.value)}
                  className="w-full text-xs text-brand-dark bg-neutral-50 border border-neutral-200 px-3 py-2 outline-none focus:border-brand-brown"
                />
              </div>
              <div className="mb-4">
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Imagen portada (URL)</label>
                <input
                  value={form.cover_image}
                  onChange={(e) => handleChange('cover_image', e.target.value)}
                  className="w-full text-xs text-brand-dark bg-neutral-50 border border-neutral-200 px-3 py-2 outline-none focus:border-brand-brown"
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.published}
                  onChange={(e) => handleChange('published', e.target.checked)}
                  className="accent-brand-brown"
                />
                <label htmlFor="published" className="text-xs text-brand-dark font-medium">
                  Publicar inmediatamente
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
