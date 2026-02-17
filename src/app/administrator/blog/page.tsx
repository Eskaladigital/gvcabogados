'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut } from 'lucide-react';

interface Post {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  category: string;
  published: boolean;
  published_at: string;
  created_at: string;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/blog');
      if (res.status === 401) {
        router.push('/administrator/login');
        return;
      }
      const data = await res.json();
      setPosts(data);
    } catch {
      router.push('/administrator/login');
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    });
    fetchPosts();
  }

  async function deletePost(id: string) {
    if (!confirm('¿Estás seguro de eliminar este artículo?')) return;
    await fetch(`/api/blog/${id}`, { method: 'DELETE' });
    fetchPosts();
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/administrator/login');
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-brand-dark">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-brown flex items-center justify-center font-serif text-sm font-bold text-white">GV</div>
            <span className="text-white text-sm font-semibold">Panel de Administración</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/es" className="text-neutral-400 text-xs hover:text-white transition-colors">Ver web →</Link>
            <button onClick={handleLogout} className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 text-xs">
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-2xl font-semibold text-brand-dark">Artículos del Blog</h1>
          <Link href="/administrator/blog/new" className="btn-primary">
            <Plus size={16} /> Nuevo artículo
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-neutral-400 text-sm">Cargando...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 border border-neutral-200 bg-white">
            <p className="text-neutral-400 text-sm mb-4">No hay artículos todavía.</p>
            <Link href="/administrator/blog/new" className="btn-primary">
              <Plus size={16} /> Crear primer artículo
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left p-4 text-[0.65rem] font-semibold text-neutral-400 uppercase tracking-wider">Título</th>
                  <th className="text-left p-4 text-[0.65rem] font-semibold text-neutral-400 uppercase tracking-wider">Categoría</th>
                  <th className="text-left p-4 text-[0.65rem] font-semibold text-neutral-400 uppercase tracking-wider">Estado</th>
                  <th className="text-left p-4 text-[0.65rem] font-semibold text-neutral-400 uppercase tracking-wider">Fecha</th>
                  <th className="text-right p-4 text-[0.65rem] font-semibold text-neutral-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="p-4">
                      <div className="text-sm font-medium text-brand-dark">{post.title_es}</div>
                      <div className="text-[0.65rem] text-neutral-300 mt-0.5">/{post.slug}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-neutral-400">{post.category || '—'}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 ${post.published ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        {post.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-neutral-400">
                      {new Date(post.published_at || post.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => togglePublish(post.id, post.published)}
                          className="p-1.5 text-neutral-400 hover:text-brand-brown transition-colors"
                          title={post.published ? 'Despublicar' : 'Publicar'}
                        >
                          {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <Link
                          href={`/administrator/blog/${post.id}`}
                          className="p-1.5 text-neutral-400 hover:text-brand-brown transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
