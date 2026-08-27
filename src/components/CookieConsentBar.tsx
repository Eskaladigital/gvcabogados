'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, Cookie, Shield, X } from 'lucide-react';
import { Locale } from '@/data/translations';

export const OPEN_COOKIE_SETTINGS = 'openCookieSettings';
const KEY = 'gvcabogados_cookie_consent';
const PREFS_KEY = 'gvcabogados_cookie_preferences';

type Prefs = {
  necessary: true;
  analytics: boolean;
};

const ALL_ON: Prefs = { necessary: true, analytics: true };
const ONLY_NECESSARY: Prefs = { necessary: true, analytics: false };

function updateGtag(prefs: Prefs) {
  if (typeof window === 'undefined' || !(window as any).gtag) return;
  const v = prefs.analytics ? 'granted' : 'denied';
  (window as any).gtag('consent', 'update', {
    analytics_storage: v,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

function persist(prefs: Prefs) {
  localStorage.setItem(KEY, prefs.analytics ? 'granted' : 'denied');
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  updateGtag(prefs);
}

function readPrefs(): Prefs | null {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Prefs>;
      return { necessary: true, analytics: Boolean(parsed.analytics) };
    }
    const legacy = localStorage.getItem(KEY);
    if (legacy === 'granted') return ALL_ON;
    if (legacy === 'denied') return ONLY_NECESSARY;
  } catch {
    /* modo privado */
  }
  return null;
}

export function openCookieSettings() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS));
}

export function CookieSettingsButton({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {label ?? 'Configurar cookies'}
    </button>
  );
}

function localeFromPath(): Locale {
  if (typeof window === 'undefined') return 'es';
  return window.location.pathname.startsWith('/en') ? 'en' : 'es';
}

export function CookieConsentBar() {
  const [view, setView] = useState<'hidden' | 'banner' | 'settings'>('hidden');
  const [prefs, setPrefs] = useState<Prefs>(ALL_ON);
  const [locale, setLocale] = useState<Locale>('es');

  useEffect(() => {
    setLocale(localeFromPath());
    const stored = readPrefs();
    if (stored) {
      setPrefs(stored);
      updateGtag(stored);
    } else {
      setView('banner');
    }
    const open = () => {
      const current = readPrefs();
      if (current) setPrefs(current);
      setView('settings');
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, open);
  }, []);

  const acceptAll = useCallback(() => {
    persist(ALL_ON);
    setPrefs(ALL_ON);
    setView('hidden');
  }, []);

  const rejectAll = useCallback(() => {
    persist(ONLY_NECESSARY);
    setPrefs(ONLY_NECESSARY);
    setView('hidden');
  }, []);

  const save = useCallback(() => {
    persist(prefs);
    setView('hidden');
  }, [prefs]);

  const es = locale === 'es';
  const prefix = `/${locale}`;

  if (view === 'hidden') return null;

  if (view === 'settings') {
    return (
      <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Cookie className="h-8 w-8 text-[#3d2b1f]" aria-hidden="true" />
              <h2 id="cookie-settings-title" className="text-xl font-bold text-brand-dark">
                {es ? 'Configuración de cookies' : 'Cookie settings'}
              </h2>
            </div>
            <button type="button" onClick={() => setView(readPrefs() ? 'hidden' : 'banner')} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg" aria-label={es ? 'Cerrar' : 'Close'}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-brand-dark/70 mb-6">
              {es
                ? 'Elige qué tipos de cookies deseas aceptar. Las cookies necesarias no se pueden desactivar.'
                : 'Choose which cookies to accept. Necessary cookies cannot be turned off.'}
            </p>
            <Category
              title={es ? 'Cookies necesarias' : 'Necessary cookies'}
              description={es ? 'Esenciales para el funcionamiento del sitio y recordar tu consentimiento.' : 'Essential for the site to work and to remember your consent.'}
              enabled
              required
            />
            <Category
              title={es ? 'Cookies analíticas' : 'Analytics cookies'}
              description={es ? 'Nos permiten medir visitas y mejorar la web (Google Analytics).' : 'Help us measure visits and improve the site (Google Analytics).'}
              enabled={prefs.analytics}
              onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
            />
            <p className="text-sm text-brand-dark/60 mt-6">
              {es ? 'Más información en la ' : 'More information in our '}
              <Link href={`${prefix}/politica-cookies`} className="text-[#3d2b1f] underline" onClick={() => setView('hidden')}>
                {es ? 'Política de cookies' : 'Cookie policy'}
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 bg-brand-brown/30">
            <button type="button" onClick={rejectAll} className="flex-1 px-4 py-2.5 text-brand-dark border border-brand-dark/20 rounded-lg font-medium hover:bg-white">
              {es ? 'Rechazar todas' : 'Reject all'}
            </button>
            <button type="button" onClick={save} className="flex-1 px-4 py-2.5 text-brand-dark bg-white border border-brand-dark/20 rounded-lg font-medium">
              {es ? 'Guardar preferencias' : 'Save preferences'}
            </button>
            <button type="button" onClick={acceptAll} className="flex-1 px-4 py-2.5 bg-[#3d2b1f] text-white rounded-lg font-medium">
              {es ? 'Aceptar todas' : 'Accept all'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 bg-white border-t border-brand-dark/10 shadow-lg md:p-6" role="region" aria-label={es ? 'Banner de consentimiento de cookies' : 'Cookie consent banner'}>
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="flex-1 flex items-start gap-3">
          <Cookie className="h-8 w-8 text-[#3d2b1f] flex-shrink-0 mt-1" aria-hidden="true" />
          <div>
            <h3 className="text-lg font-bold text-brand-dark mb-1">{es ? 'Utilizamos cookies' : 'We use cookies'}</h3>
            <p className="text-brand-dark/70 text-sm">
              {es
                ? 'Usamos cookies de analítica para medir visitas y mejorar la web. Puedes aceptar todas o configurar tus preferencias. '
                : 'We use analytics cookies to measure visits and improve the site. You can accept all or set your preferences. '}
              <Link href={`${prefix}/politica-cookies`} className="underline">
                {es ? 'Política de cookies' : 'Cookie policy'}
              </Link>
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
          <button type="button" onClick={() => setView('settings')} className="px-4 py-2 text-brand-dark bg-brand-brown rounded-lg font-medium text-sm">
            {es ? 'Configurar' : 'Settings'}
          </button>
          <button type="button" onClick={acceptAll} className="px-4 py-2 bg-[#3d2b1f] text-white rounded-lg font-medium text-sm">
            {es ? 'Aceptar todas' : 'Accept all'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Category({
  title,
  description,
  enabled,
  required,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  required?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className={`p-4 rounded-xl border-2 mb-4 ${enabled ? 'border-[#3d2b1f] bg-[#3d2b1f]/5' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${enabled ? 'bg-[#3d2b1f] text-white' : 'bg-gray-200 text-gray-500'}`} aria-hidden="true">
          {required ? <Shield className="h-5 w-5" /> : <BarChart3 className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1 gap-3">
            <h3 className="font-semibold text-brand-dark">{title}</h3>
            {required ? (
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">
                {localeFromPath() === 'en' ? 'Always on' : 'Siempre activas'}
              </span>
            ) : (
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={enabled} onChange={(e) => onChange?.(e.target.checked)} aria-label={title} />
                <span className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-[#3d2b1f] transition-colors" />
                <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
              </label>
            )}
          </div>
          <p className="text-sm text-brand-dark/70">{description}</p>
        </div>
      </div>
    </div>
  );
}
