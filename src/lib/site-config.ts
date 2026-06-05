import { Locale } from '@/data/translations';

/**
 * Configuración central del sitio.
 * Dominio fijo para GVC Abogados (evita que env vars de otros proyectos lo sobrescriban).
 */
const DEFAULT_SITE_URL = 'https://www.gvcabogados.com';
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.includes('gvcabogados'))
    ? process.env.NEXT_PUBLIC_SITE_URL
    : DEFAULT_SITE_URL;

export const OFFICE_LOCATION = {
  name: 'García-Valcárcel & Cáceres Abogados',
  addressEs: 'Gran Vía, 15 — 3ª Planta, 30008 Murcia, España',
  addressEn: 'Gran Vía, 15 — 3rd Floor, 30008 Murcia, Spain',
  lat: 37.9834,
  lng: -1.1299,
  zoom: 17,
} as const;

/** Embed de Google Maps centrado en la sede con marcador en la dirección exacta. */
export function getOfficeMapEmbedUrl(locale: Locale): string {
  const { name, addressEs, addressEn, lat, lng, zoom } = OFFICE_LOCATION;
  const address = locale === 'es' ? addressEs : addressEn;
  const marker = encodeURIComponent(`${name}, ${address}`);
  const hl = locale === 'es' ? 'es' : 'en';

  return `https://maps.google.com/maps?q=${marker}&ll=${lat},${lng}&z=${zoom}&hl=${hl}&output=embed`;
}
