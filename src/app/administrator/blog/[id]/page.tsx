'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const editorRefEs = useRef<any>(null);
  const editorRefEn = useRef<any>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'es' | 'en'>('es');
  const [form, setForm] = useState({
    slug: '', title_es: '', title_en: '', excerpt_es: '', excerpt_en: '',
    content_es: '', content_en: '', category: '', cover_image: '', author: '',
    published: false, published_at: '',
  });

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/blog/${params.id}`);
      if (res.status === 401) { router.push('/administrator/login'); return; }
      if (!res.ok) { router.push('/administrator/blog'); return; }
      const data = await res.json();
      setForm({
        slug: data.slug || '', title_es: data.title_es || '', title_en: data.title_en || '',
        excerpt_es: data.excerpt_es || '', excerpt_en: data.excerpt_en || '',
        content_es: data.content_es || '', content_en: data.content_en || '',
        category: data.category || '', cover_image: data.cover_image || '',
        author: data.author || '', published: data.published || false,
        published_at: data.published_at ? data.published_at.split('T')[0] : '',
      });
      setLoading(false);
    })();
  }, [params.id, router]);

  const handleChange = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const contentEs = editorRefEs.current?.getContent() || form.content_es;
      const contentEn = editorRefEn.current?.getContent() || form.content_en;
      await fetch(`/api/blog/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, content_es: contentEs, content_en: contentEn, published_at: form.published_at + 'T12:00:00Z' }),
      });
      router.push('/administrator/blog');
    } catch { alert('Error al guardar'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('¿Eliminar artículo?')) return;
    await fetch(`/api/blog/${params.id}`, { method: 'DELETE' });
    router.push('/administrator/blog');
  };

  const tinymceKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || '';

  if (loading) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center text-neutral-400 text-sm">Cargando...</div>;

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-brand-dark">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/administrator/blog" className="text-neutral-400 hover:text-white"><ArrowLeft size={18} /></Link>
            <span className="text-white text-sm font-semibold">Editar artículo</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDelete} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"><Trash2 size={14} /> Eliminar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary !text-xs"><Save size={14} /> {saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="bg-white border border-neutral-200 p-6">
            <div className="flex gap-0 mb-6 border-b border-neutral-200">
              {(['es', 'en'] as const).map((lang) => (
                <button key={lang} onClick={() => setActiveTab(lang)} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${activeTab === lang ? 'border-brand-brown text-brand-brown' : 'border-transparent text-neutral-400'}`}>
                  {lang === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                </button>
              ))}
            </div>

            {activeTab === 'es' && (
              <>
                <div className="mb-4">
                  <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Título (ES)</label>
                  <input value={form.title_es} onChange={(e) => handleChange('title_es', e.target.value)} className="w-full text-lg font-serif font-semibold text-brand-dark bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:border-brand-brown" />
                </div>
                <div className="mb-4">
                  <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Extracto (ES)</label>
                  <textarea value={form.excerpt_es} onChange={(e) => handleChange('excerpt_es', e.target.value)} className="w-full text-sm text-brand-dark bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:border-brand-brown min-h-[60px] resize-y" />
                </div>
                <div className="mb-4">
                  <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Contenido (ES)</label>
                  <Editor apiKey={tinymceKey} onInit={(evt, editor) => (editorRefEs.current = editor)} initialValue={form.content_es} init={{ height: 500, menubar: true, plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount', toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | removeformat | code', content_style: 'body { font-family: Inter, sans-serif; font-size: 14px; }' }} />
                </div>
              </>
            )}

            {activeTab === 'en' && (
              <>
                <div className="mb-4">
                  <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Title (EN)</label>
                  <input value={form.title_en} onChange={(e) => handleChange('title_en', e.target.value)} className="w-full text-lg font-serif font-semibold text-brand-dark bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:border-brand-brown" />
                </div>
                <div className="mb-4">
                  <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Excerpt (EN)</label>
                  <textarea value={form.excerpt_en} onChange={(e) => handleChange('excerpt_en', e.target.value)} className="w-full text-sm text-brand-dark bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:border-brand-brown min-h-[60px] resize-y" />
                </div>
                <div className="mb-4">
                  <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Content (EN)</label>
                  <Editor apiKey={tinymceKey} onInit={(evt, editor) => (editorRefEn.current = editor)} initialValue={form.content_en} init={{ height: 500, menubar: true, plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount', toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | removeformat | code', content_style: 'body { font-family: Inter, sans-serif; font-size: 14px; }' }} />
                </div>
              </>
            )}
          </div>

          <div className="bg-white border border-neutral-200 p-5 h-fit">
            <h3 className="text-xs font-semibold text-brand-dark uppercase tracking-wider mb-4">Configuración</h3>
            {[
              { label: 'Slug (URL)', field: 'slug', placeholder: 'url-del-articulo' },
              { label: 'Categoría', field: 'category', placeholder: 'Derecho de Familia' },
              { label: 'Autor', field: 'author', placeholder: 'Nombre del autor' },
              { label: 'Imagen (URL)', field: 'cover_image', placeholder: 'https://...' },
            ].map((input) => (
              <div key={input.field} className="mb-4">
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">{input.label}</label>
                <input value={(form as any)[input.field]} onChange={(e) => handleChange(input.field, e.target.value)} className="w-full text-xs text-brand-dark bg-neutral-50 border border-neutral-200 px-3 py-2 outline-none focus:border-brand-brown" placeholder={input.placeholder} />
              </div>
            ))}
            <div className="mb-4">
              <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">Fecha</label>
              <input type="date" value={form.published_at} onChange={(e) => handleChange('published_at', e.target.value)} className="w-full text-xs text-brand-dark bg-neutral-50 border border-neutral-200 px-3 py-2 outline-none focus:border-brand-brown" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pub" checked={form.published} onChange={(e) => handleChange('published', e.target.checked)} className="accent-brand-brown" />
              <label htmlFor="pub" className="text-xs text-brand-dark font-medium">Publicado</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
