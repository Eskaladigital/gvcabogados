'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  contact_type: string | null;
  company: string | null;
  inquiry_type: string | null;
  referral_source: string | null;
  message: string;
  is_read: boolean;
}

export default function AdminContactosPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const res = await fetch('/api/admin/contacts');
      if (res.status === 401) {
        router.push('/administrator/login');
        return;
      }
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      router.push('/administrator/login');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/administrator/login');
  }

  async function markRead(lead: Lead) {
    await fetch('/api/admin/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id, is_read: true }),
    });
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, is_read: true } : l)));
    setSelected({ ...lead, is_read: true });
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-brand-dark">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-brown flex items-center justify-center font-serif text-sm font-bold text-white">
                GV
              </div>
              <span className="text-white text-sm font-semibold">Panel de Administración</span>
            </div>
            <nav className="flex gap-4 text-xs">
              <Link href="/administrator/blog" className="text-neutral-400 hover:text-white">
                Blog
              </Link>
              <Link href="/administrator/contactos" className="text-white">
                Contactos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/es" className="text-neutral-400 text-xs hover:text-white transition-colors">
              Ver web →
            </Link>
            <button
              onClick={handleLogout}
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="font-serif text-2xl font-semibold text-brand-dark mb-8">Consultas web</h1>

        {loading ? (
          <div className="text-center py-20 text-neutral-400 text-sm">Cargando...</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 border border-neutral-200 bg-white text-neutral-500 text-sm">
            Aún no hay consultas.
          </div>
        ) : (
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-6">
            <div className="bg-white border border-neutral-200 divide-y">
              {leads.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => {
                    setSelected(lead);
                    if (!lead.is_read) markRead(lead);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-neutral-50 ${
                    !lead.is_read ? 'bg-brand-brown/5' : ''
                  }`}
                >
                  <div className="flex justify-between gap-2">
                    <span className="text-sm font-medium text-brand-dark">{lead.name}</span>
                    <span className="text-[0.7rem] text-neutral-400">
                      {new Date(lead.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 truncate">{lead.email}</p>
                </button>
              ))}
            </div>
            <div className="bg-white border border-neutral-200 p-6 text-sm text-neutral-600">
              {selected ? (
                <div className="space-y-2">
                  <h2 className="font-serif text-lg text-brand-dark">{selected.name}</h2>
                  <p>
                    <a href={`mailto:${selected.email}`} className="text-brand-brown">
                      {selected.email}
                    </a>
                  </p>
                  {selected.phone && (
                    <p>
                      <a href={`tel:${selected.phone}`}>{selected.phone}</a>
                    </p>
                  )}
                  <p>Tipo: {selected.contact_type === 'professional' ? 'Profesional' : 'Particular'}</p>
                  {selected.company && <p>Empresa: {selected.company}</p>}
                  {selected.inquiry_type && <p>Área: {selected.inquiry_type}</p>}
                  {selected.referral_source && <p>Origen: {selected.referral_source}</p>}
                  <p className="whitespace-pre-wrap pt-3 border-t border-neutral-100">{selected.message}</p>
                </div>
              ) : (
                <p className="text-neutral-400">Selecciona una consulta</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
