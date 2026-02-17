/**
 * Configuración central del sitio.
 * Dominio fijo para GVC Abogados (evita que env vars de otros proyectos lo sobrescriban).
 */
const DEFAULT_SITE_URL = 'https://www.gvcabogados.com';
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.includes('gvcabogados'))
    ? process.env.NEXT_PUBLIC_SITE_URL
    : DEFAULT_SITE_URL;
