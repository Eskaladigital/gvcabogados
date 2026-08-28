/**
 * Lista de 301 Abogados → Expertos (negligencias, no Murcia).
 * Mantener alineada con ESTRATEGIA-SEO.md. next.config.js hace require de este archivo.
 */
const EXPERTOS = 'https://www.gvcexpertos.com'

/** slug de ciudad en Abogados → slug de landing en Expertos (null = home Expertos) */
const CITY_TO_EXPERTOS_SLUG = {
  albacete: 'abogados-negligencias-medicas-albacete',
  alcorcon: 'abogados-negligencias-medicas-alcorcon',
  barcelona: 'abogados-negligencias-medicas-barcelona',
  bilbao: null,
  cordoba: 'abogados-negligencias-medicas-cordoba',
  elche: 'abogados-negligencias-medicas-alicante',
  getafe: 'abogados-negligencias-medicas-madrid',
  'jerez-de-la-frontera': 'abogados-negligencias-medicas-jerez-de-la-frontera',
  leganes: 'abogados-negligencias-medicas-leganes',
  madrid: 'abogados-negligencias-medicas-madrid',
  malaga: 'abogados-negligencias-medicas-malaga',
  marbella: 'abogados-negligencias-medicas-marbella',
  'santa-coloma-de-gramenet': 'abogados-negligencias-medicas-barcelona',
  sevilla: 'abogados-negligencias-medicas-sevilla',
  valencia: 'abogados-negligencias-medicas-valencia',
  valladolid: 'abogados-negligencias-medicas-valladolid',
  vigo: 'abogados-negligencias-medicas-vigo',
  zaragoza: 'abogados-negligencias-medicas-zaragoza',
}

function expertosDest(locale, destSlug) {
  if (!destSlug) {
    return locale === 'en' ? `${EXPERTOS}/en` : `${EXPERTOS}/es`
  }
  return `${EXPERTOS}/${locale}/${destSlug}`
}

function buildExpertosNegligenciasRedirects() {
  const out = []
  for (const [slug, dest] of Object.entries(CITY_TO_EXPERTOS_SLUG)) {
    const esDest = expertosDest('es', dest)
    const enDest = expertosDest('en', dest)
    out.push(
      { source: `/es/servicios/negligencias-medicas/${slug}`, destination: esDest, permanent: true },
      { source: `/en/services/medical-malpractice/${slug}`, destination: enDest, permanent: true },
      { source: `/es/servicios/abogados-negligencias-medicas-${slug}`, destination: esDest, permanent: true },
      { source: `/es/abogados/abogados-negligencias-medicas-${slug}`, destination: esDest, permanent: true },
      { source: `/en/lawyers/medical-malpractice-lawyers-${slug}`, destination: enDest, permanent: true },
    )
  }
  return out
}

module.exports = {
  EXPERTOS,
  CITY_TO_EXPERTOS_SLUG,
  buildExpertosNegligenciasRedirects,
}
