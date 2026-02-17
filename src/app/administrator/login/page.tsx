'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      router.push('/administrator/blog');
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-brown mx-auto flex items-center justify-center font-serif text-lg font-bold text-white mb-4">
            GV
          </div>
          <h1 className="font-serif text-2xl text-white font-semibold">Administración</h1>
          <p className="text-neutral-400 text-sm mt-1">García-Valcárcel & Cáceres</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full font-sans text-sm text-brand-dark bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:border-brand-brown transition-colors"
              placeholder="admin@gvcabogados.com"
            />
          </div>

          <div className="mb-6">
            <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full font-sans text-sm text-brand-dark bg-neutral-50 border border-neutral-200 px-4 py-3 outline-none focus:border-brand-brown transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
