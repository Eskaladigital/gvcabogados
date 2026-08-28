/**
 * Valla SEO GVC: negligencias fuera de Murcia viven en Expertos.
 * Guía: W - GVCABOGADOS/ESTRATEGIA-SEO.md
 * Los 301 están en next.config.js (require de negligencias-valla.cjs — misma lista).
 */
export const EXPERTOS_URL = 'https://www.gvcexpertos.com'
export const NEGLIGENCIAS_KEEP_CITY = 'murcia'

export function shouldIndexServiceLocality(
  serviceKey: string,
  localitySlug: string,
): boolean {
  if (serviceKey !== 'negligencias-medicas') return true
  return localitySlug === NEGLIGENCIAS_KEEP_CITY
}
