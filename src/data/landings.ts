/**
 * SEO Landing pages data for geographic targeting.
 * Each landing has unique, city-specific content to avoid duplicate content issues.
 */

export interface LandingPage {
  serviceId: string;
  city: string;
  slugEs: string;
  slugEn: string;
  titleEs: string;
  titleEn: string;
  metaDescriptionEs: string;
  metaDescriptionEn: string;
  h1Es: string;
  h1En: string;
  introEs: string;
  introEn: string;
  // Unique city-specific content to avoid duplicate content
  cityContentEs: string;
  cityContentEn: string;
  // City-specific advantages
  advantagesEs: string[];
  advantagesEn: string[];
}

export const landingPages: LandingPage[] = [
  {
    serviceId: 'accidentes-trafico',
    city: 'Alicante',
    slugEs: 'accidentes-trafico-alicante',
    slugEn: 'traffic-accidents-alicante',
    titleEs: 'Abogados Accidentes de Tráfico en Alicante | GVC Abogados',
    titleEn: 'Traffic Accident Lawyers in Alicante | GVC Lawyers',
    metaDescriptionEs:
      'Abogados especializados en accidentes de tráfico en Alicante. Reclamamos tu indemnización con 97% de éxito. Consulta gratuita. ☎ 968 241 025.',
    metaDescriptionEn:
      'Specialized traffic accident lawyers for Alicante. We claim your compensation with 97% success. Free consultation. ☎ +34 968 241 025.',
    h1Es: 'Abogados de Accidentes de Tráfico en Alicante',
    h1En: 'Traffic Accident Lawyers in Alicante',
    introEs:
      'Desde nuestro despacho en Murcia, García-Valcárcel & Cáceres ofrece asistencia legal especializada en accidentes de tráfico a clientes de Alicante y toda la provincia. Con más de 75 años de experiencia, luchamos por conseguir la máxima indemnización para las víctimas de accidentes de tráfico.',
    introEn:
      'From our office in Murcia, García-Valcárcel & Cáceres offers specialized legal assistance in traffic accidents to clients in Alicante and the entire province. With over 75 years of experience, we fight for maximum compensation for traffic accident victims.',
    cityContentEs:
      'Alicante es una de las provincias con mayor densidad de tráfico del Levante español, especialmente en la AP-7, la A-70 y la N-332, vías con alta siniestralidad. Si ha sufrido un accidente de tráfico en Alicante, Elche, Benidorm, Torrevieja o cualquier localidad de la provincia, nuestros abogados le asistirán tanto de forma presencial como por videoconferencia. Conocemos la casuística específica de los accidentes en la zona: colisiones en autovías de peaje, atropellos en zonas turísticas, accidentes de moto en carreteras costeras y siniestros en la N-340. Tramitamos su reclamación ante los juzgados de Alicante o de Murcia, según convenga a su caso.',
    cityContentEn:
      'Alicante is one of the provinces with the highest traffic density in eastern Spain, especially on the AP-7, A-70 and N-332 roads with high accident rates. If you have had a traffic accident in Alicante, Elche, Benidorm, Torrevieja or anywhere in the province, our lawyers will assist you both in person and by video conference.',
    advantagesEs: [
      'Experiencia con accidentes en AP-7, A-70 y carreteras de la costa alicantina',
      'Atención presencial y por videoconferencia para clientes de Alicante',
      'Tramitación ante juzgados de Alicante y Murcia',
      'Coordinación con peritos médicos en la provincia de Alicante',
      'Primera consulta gratuita sin compromiso',
      'Solo cobramos si ganamos su caso',
    ],
    advantagesEn: [
      'Experience with accidents on AP-7, A-70 and Alicante coastal roads',
      'In-person and video conference attention for Alicante clients',
      'Filing before Alicante and Murcia courts',
      'Coordination with medical experts in Alicante province',
      'Free initial consultation with no obligation',
      'No win, no fee',
    ],
  },
  {
    serviceId: 'accidentes-trafico',
    city: 'Cartagena',
    slugEs: 'accidentes-trafico-cartagena',
    slugEn: 'traffic-accidents-cartagena',
    titleEs: 'Abogados Accidentes de Tráfico en Cartagena | GVC Abogados',
    titleEn: 'Traffic Accident Lawyers in Cartagena | GVC Lawyers',
    metaDescriptionEs:
      'Abogados de accidentes de tráfico en Cartagena. Indemnización máxima garantizada. Solo 30 min desde nuestro despacho en Murcia. ☎ 968 241 025.',
    metaDescriptionEn:
      'Traffic accident lawyers in Cartagena. Maximum compensation guaranteed. Only 30 min from our Murcia office. ☎ +34 968 241 025.',
    h1Es: 'Abogados de Accidentes de Tráfico en Cartagena',
    h1En: 'Traffic Accident Lawyers in Cartagena',
    introEs:
      'García-Valcárcel & Cáceres, despacho de abogados con sede en Murcia capital (a solo 30 minutos de Cartagena), presta servicio especializado en accidentes de tráfico a clientes de Cartagena, La Manga, Los Alcázares y todo el Campo de Cartagena.',
    introEn:
      'García-Valcárcel & Cáceres, a law firm based in Murcia city (only 30 minutes from Cartagena), provides specialized traffic accident services to clients in Cartagena, La Manga, Los Alcázares and the entire Cartagena area.',
    cityContentEs:
      'Cartagena y su comarca presentan características viales particulares: la autovía A-30 entre Murcia y Cartagena, las carreteras de acceso a La Manga del Mar Menor (especialmente peligrosas en época estival), la variante de Los Belones y las rotondas del polígono industrial de Cartagena son puntos de frecuente siniestralidad. Nuestro equipo conoce en detalle los juzgados de Cartagena y trabaja habitualmente con peritos y médicos forenses de la zona. Al estar a solo 30 minutos en coche, ofrecemos la misma cercanía que un despacho local pero con la experiencia de más de 75 años.',
    cityContentEn:
      'Cartagena and its district have particular road characteristics: the A-30 motorway between Murcia and Cartagena, the access roads to La Manga del Mar Menor (especially dangerous in summer), and the industrial areas are frequent accident spots. Being only 30 minutes away, we offer the same proximity as a local firm but with over 75 years of experience.',
    advantagesEs: [
      'A solo 30 minutos de Cartagena: misma cercanía que un despacho local',
      'Conocimiento de los juzgados de Cartagena y sus particularidades',
      'Experiencia en accidentes en A-30, carreteras de La Manga y zona portuaria',
      'Red de peritos médicos en Cartagena y comarca',
      'Primera consulta gratuita presencial o por videoconferencia',
      'Más de 75 años de experiencia en la Región de Murcia',
    ],
    advantagesEn: [
      'Only 30 minutes from Cartagena: same proximity as a local firm',
      'Knowledge of Cartagena courts and their particularities',
      'Experience with A-30 accidents, La Manga roads and port area',
      'Network of medical experts in Cartagena area',
      'Free initial consultation in person or by video conference',
      'Over 75 years of experience in the Region of Murcia',
    ],
  },
  {
    serviceId: 'derecho-familia',
    city: 'Madrid',
    slugEs: 'divorcios-madrid',
    slugEn: 'divorce-lawyers-madrid',
    titleEs: 'Abogados Divorcios en Madrid — Mutuo Acuerdo y Contencioso | GVC Abogados',
    titleEn: 'Divorce Lawyers in Madrid — Amicable & Contentious | GVC Lawyers',
    metaDescriptionEs:
      'Abogados especialistas en divorcios en Madrid. Mutuo acuerdo desde 600€. Custodia compartida. Pensiones alimenticias. ☎ 968 241 025.',
    metaDescriptionEn:
      'Specialist divorce lawyers in Madrid. Amicable from €600. Shared custody. Child support. ☎ +34 968 241 025.',
    h1Es: 'Abogados de Divorcios en Madrid',
    h1En: 'Divorce Lawyers in Madrid',
    introEs:
      'García-Valcárcel & Cáceres ofrece asesoramiento jurídico especializado en divorcios para clientes en Madrid. Gestionamos divorcios de mutuo acuerdo y contenciosos, custodia compartida, pensiones alimenticias y liquidación de bienes gananciales.',
    introEn:
      'García-Valcárcel & Cáceres offers specialized legal advice on divorce for clients in Madrid. We handle amicable and contentious divorces, shared custody, child support and community property liquidation.',
    cityContentEs:
      'Aunque nuestra sede está en Murcia, atendemos un número creciente de clientes madrileños que valoran nuestra experiencia de más de 75 años, nuestras tarifas competitivas frente a los precios habituales de los despachos de la capital, y la posibilidad de gestionar gran parte del proceso por videoconferencia. Para las actuaciones procesales que requieren presencia en Madrid, coordinamos con procuradores de los Juzgados de Familia de Madrid (Plaza de Castilla) para garantizar una representación eficaz. Muchos de nuestros clientes de Madrid nos contactaron inicialmente porque el divorcio incluye bienes inmuebles en la Región de Murcia o porque uno de los cónyuges reside en Murcia.',
    cityContentEn:
      'Although our headquarters are in Murcia, we serve a growing number of Madrid clients who value our 75+ years of experience, competitive fees compared to typical Madrid firm prices, and the ability to manage much of the process via video conference.',
    advantagesEs: [
      'Tarifas competitivas: hasta un 40% menos que despachos de Madrid centro',
      'Gestión por videoconferencia sin necesidad de desplazarse',
      'Coordinación con procuradores en Juzgados de Familia de Madrid',
      'Experiencia con divorcios que implican bienes en varias comunidades autónomas',
      'Divorcio de mutuo acuerdo desde 600€',
      'Primera consulta gratuita por videollamada',
    ],
    advantagesEn: [
      'Competitive fees: up to 40% less than central Madrid firms',
      'Video conference management without the need to travel',
      'Coordination with court agents at Madrid Family Courts',
      'Experience with divorces involving assets in multiple regions',
      'Amicable divorce from €600',
      'Free initial consultation by video call',
    ],
  },
  {
    serviceId: 'derecho-familia',
    city: 'Alicante',
    slugEs: 'divorcios-alicante',
    slugEn: 'divorce-lawyers-alicante',
    titleEs: 'Abogados Divorcios en Alicante — Custodia y Pensiones | GVC Abogados',
    titleEn: 'Divorce Lawyers in Alicante — Custody & Support | GVC Lawyers',
    metaDescriptionEs:
      'Abogados de divorcios en Alicante. Mutuo acuerdo, contencioso, custodia compartida. 75+ años de experiencia. ☎ 968 241 025.',
    metaDescriptionEn:
      'Divorce lawyers in Alicante. Amicable, contentious, shared custody. 75+ years of experience. ☎ +34 968 241 025.',
    h1Es: 'Abogados de Divorcios en Alicante',
    h1En: 'Divorce Lawyers in Alicante',
    introEs:
      'Desde Murcia, nuestro equipo de abogados especializados en derecho de familia ofrece sus servicios a clientes de Alicante, Elche, Benidorm y toda la provincia. Más de 75 años de experiencia en divorcios, custodia de menores y pensiones alimenticias.',
    introEn:
      'From Murcia, our team of lawyers specialized in family law offers services to clients in Alicante, Elche, Benidorm and the entire province. Over 75 years of experience in divorce, child custody and support.',
    cityContentEs:
      'La cercanía geográfica entre Murcia y Alicante (menos de 1 hora por autovía A-7) nos permite atender a clientes alicantinos con la misma agilidad que un despacho local. Los divorcios en Alicante presentan particularidades propias, como la frecuente existencia de bienes inmuebles en zonas turísticas (Costa Blanca, Torrevieja, Orihuela Costa) que requieren una valoración y reparto especializado. En los casos de custodia compartida, los juzgados de Alicante aplican criterios específicos que conocemos en detalle por nuestra práctica habitual en la zona.',
    cityContentEn:
      'The geographical proximity between Murcia and Alicante (less than 1 hour via the A-7 motorway) allows us to serve Alicante clients as efficiently as a local firm. Divorces in Alicante have specific characteristics, such as the frequent existence of real estate in tourist areas requiring specialized valuation.',
    advantagesEs: [
      'A menos de 1 hora: Murcia-Alicante por la A-7',
      'Experiencia en reparto de bienes en zonas turísticas de Costa Blanca',
      'Conocimiento de los criterios de custodia compartida de los juzgados alicantinos',
      'Atención presencial en Murcia y por videoconferencia',
      'Coordinación con procuradores en Alicante capital y Elche',
      'Primera consulta gratuita',
    ],
    advantagesEn: [
      'Less than 1 hour away: Murcia-Alicante via the A-7',
      'Experience in property division in Costa Blanca tourist areas',
      'Knowledge of shared custody criteria in Alicante courts',
      'In-person attention in Murcia and by video conference',
      'Coordination with court agents in Alicante and Elche',
      'Free initial consultation',
    ],
  },
  {
    serviceId: 'derecho-inmobiliario',
    city: 'Toledo',
    slugEs: 'inmobiliario-toledo',
    slugEn: 'real-estate-lawyers-toledo',
    titleEs: 'Abogados Derecho Inmobiliario en Toledo | GVC Abogados',
    titleEn: 'Real Estate Lawyers in Toledo | GVC Lawyers',
    metaDescriptionEs:
      'Abogados inmobiliarios en Toledo. Compraventa, arrendamientos, desahucios, propiedad horizontal. Consulta gratuita por videoconferencia. ☎ 968 241 025.',
    metaDescriptionEn:
      'Real estate lawyers for Toledo. Property sales, leases, evictions, condominium law. Free video consultation. ☎ +34 968 241 025.',
    h1Es: 'Abogados de Derecho Inmobiliario en Toledo',
    h1En: 'Real Estate Lawyers in Toledo',
    introEs:
      'García-Valcárcel & Cáceres presta servicios de asesoramiento inmobiliario a clientes en Toledo y Castilla-La Mancha. Gestionamos compraventas, arrendamientos, desahucios y conflictos de propiedad horizontal con más de 75 años de experiencia.',
    introEn:
      'García-Valcárcel & Cáceres provides real estate advisory services to clients in Toledo and Castilla-La Mancha. We manage property sales, leases, evictions and condominium disputes with over 75 years of experience.',
    cityContentEs:
      'Toledo y su provincia están experimentando un auge inmobiliario impulsado por la cercanía a Madrid y los precios más competitivos de la vivienda. Esto genera una demanda creciente de asesoramiento jurídico en operaciones de compraventa, contratos de alquiler (tanto residenciales como turísticos, muy frecuentes en el casco histórico de Toledo) y conflictos con comunidades de propietarios. Nuestro despacho atiende a clientes toledanos por videoconferencia y coordina las actuaciones procesales con procuradores locales ante los juzgados de Toledo.',
    cityContentEn:
      'Toledo and its province are experiencing a real estate boom driven by proximity to Madrid and more competitive housing prices. This generates growing demand for legal advice on property transactions.',
    advantagesEs: [
      'Asesoramiento por videoconferencia sin necesidad de desplazarse',
      'Experiencia en operaciones inmobiliarias en zonas con normativa patrimonial',
      'Tarifas competitivas frente a despachos de Madrid o Toledo capital',
      'Coordinación con procuradores y notarías en Toledo',
      'Revisión de contratos de arras y escrituras de compraventa',
      'Primera consulta gratuita',
    ],
    advantagesEn: [
      'Video conference advice without the need to travel',
      'Experience in real estate transactions in heritage-regulated areas',
      'Competitive fees compared to Madrid or Toledo city firms',
      'Coordination with court agents and notaries in Toledo',
      'Review of deposit contracts and purchase deeds',
      'Free initial consultation',
    ],
  },
  {
    serviceId: 'derecho-bancario',
    city: 'Valencia',
    slugEs: 'derecho-bancario-valencia',
    slugEn: 'banking-law-lawyers-valencia',
    titleEs: 'Abogados Derecho Bancario en Valencia — Tarjetas Revolving y Cláusulas Abusivas | GVC',
    titleEn: 'Banking Law Lawyers in Valencia — Revolving Cards & Unfair Clauses | GVC',
    metaDescriptionEs:
      'Abogados bancarios en Valencia. Tarjetas revolving, cláusulas suelo, gastos hipotecarios. 95% de éxito. Consulta gratuita. ☎ 968 241 025.',
    metaDescriptionEn:
      'Banking lawyers for Valencia. Revolving cards, floor clauses, mortgage expenses. 95% success rate. Free consultation. ☎ +34 968 241 025.',
    h1Es: 'Abogados de Derecho Bancario en Valencia',
    h1En: 'Banking Law Lawyers in Valencia',
    introEs:
      'Nuestro despacho en Murcia ofrece servicios especializados de derecho bancario a clientes de Valencia y toda la Comunidad Valenciana. Reclamamos por tarjetas revolving, cláusulas abusivas y gastos hipotecarios indebidos con un 95% de éxito.',
    introEn:
      'Our firm in Murcia offers specialized banking law services to clients in Valencia and the entire Valencian Community. We claim for revolving cards, abusive clauses and undue mortgage expenses with a 95% success rate.',
    cityContentEs:
      'Valencia es una de las ciudades de España con mayor incidencia de reclamaciones bancarias: miles de consumidores valencianos tienen tarjetas revolving de Wizink, Cetelem, Cofidis o Caixabank con intereses que superan la tasa de usura. Nuestro despacho ha gestionado reclamaciones bancarias para clientes de Valencia capital, Gandía, Sagunto, Paterna y Torrent, entre otras localidades. La gestión se realiza íntegramente de forma telemática: revisamos su documentación bancaria, calculamos las cantidades a reclamar y presentamos la demanda sin que tenga que desplazarse. Coordinamos las actuaciones con procuradores especializados ante los juzgados de Valencia.',
    cityContentEn:
      'Valencia is one of the cities in Spain with the highest incidence of banking claims: thousands of Valencian consumers have revolving cards with interest rates exceeding the usury rate. Our firm has managed banking claims for clients throughout Valencia province.',
    advantagesEs: [
      'Gestión 100% telemática: no necesita desplazarse a Murcia',
      '95% de éxito en reclamaciones bancarias',
      'Centenares de casos gestionados frente a Wizink, Cetelem, Cofidis, Caixabank',
      'Cálculo gratuito de las cantidades a reclamar',
      'Coordinación con procuradores especializados en Valencia',
      'Solo cobramos si recuperamos su dinero',
    ],
    advantagesEn: [
      '100% remote management: no need to travel to Murcia',
      '95% success rate in banking claims',
      'Hundreds of cases managed against Wizink, Cetelem, Cofidis, Caixabank',
      'Free calculation of amounts to claim',
      'Coordination with specialized court agents in Valencia',
      'No win, no fee',
    ],
  },
  {
    serviceId: 'derecho-penal',
    city: 'Albacete',
    slugEs: 'derecho-penal-albacete',
    slugEn: 'criminal-law-lawyers-albacete',
    titleEs: 'Abogados Penalistas en Albacete — Defensa Penal 24h | GVC Abogados',
    titleEn: 'Criminal Lawyers in Albacete — 24h Criminal Defense | GVC Lawyers',
    metaDescriptionEs:
      'Abogados penalistas en Albacete. Asistencia al detenido 24h, defensa penal integral, delitos económicos. Consulta gratuita. ☎ 968 241 025.',
    metaDescriptionEn:
      'Criminal lawyers in Albacete. 24h detainee assistance, comprehensive criminal defense, economic crimes. Free consultation. ☎ +34 968 241 025.',
    h1Es: 'Abogados Penalistas en Albacete',
    h1En: 'Criminal Lawyers in Albacete',
    introEs:
      'García-Valcárcel & Cáceres ofrece servicios de defensa penal a clientes en Albacete y provincia. Asistencia letrada al detenido las 24 horas, defensa en juicios penales y asesoramiento en delitos económicos.',
    introEn:
      'García-Valcárcel & Cáceres offers criminal defense services to clients in Albacete and its province. 24-hour legal assistance to detainees, defense in criminal trials and advice on economic crimes.',
    cityContentEs:
      'Albacete, como capital de provincia con una amplia demarcación judicial, presenta una casuística penal variada que incluye desde delitos contra la propiedad y tráfico de drogas hasta delitos económicos relacionados con la actividad empresarial y agrícola de la zona. Nuestro despacho atiende a clientes de Albacete capital, Hellín, Villarrobledo, Almansa y La Roda, entre otras localidades. Para la asistencia urgente al detenido, coordinamos con abogados colaboradores en Albacete para garantizar la presencia inmediata en comisaría, mientras que la dirección letrada de la defensa la asume directamente nuestro equipo especialista en derecho penal.',
    cityContentEn:
      'Albacete, as a provincial capital with a wide judicial district, presents varied criminal cases from property crimes to economic crimes related to business and agricultural activity in the area. Our firm serves clients throughout Albacete province.',
    advantagesEs: [
      'Asistencia letrada al detenido coordinada con abogados en Albacete',
      'Dirección de la defensa penal por nuestro equipo especializado',
      'Experiencia en delitos económicos y contra la propiedad',
      'Atención presencial y por videoconferencia',
      'Conocimiento de los juzgados penales de Albacete',
      'Primera consulta gratuita y confidencial',
    ],
    advantagesEn: [
      'Detainee assistance coordinated with lawyers in Albacete',
      'Criminal defense directed by our specialized team',
      'Experience in economic and property crimes',
      'In-person and video conference attention',
      'Knowledge of Albacete criminal courts',
      'Free and confidential initial consultation',
    ],
  },
  {
    serviceId: 'derecho-sucesorio',
    city: 'Almería',
    slugEs: 'herencias-almeria',
    slugEn: 'inheritance-lawyers-almeria',
    titleEs: 'Abogados Herencias en Almería — Testamentos y Sucesiones | GVC Abogados',
    titleEn: 'Inheritance Lawyers in Almería — Wills & Succession | GVC Lawyers',
    metaDescriptionEs:
      'Abogados de herencias en Almería. Testamentos, partición de bienes, legítimas, impuesto de sucesiones. Consulta gratuita. ☎ 968 241 025.',
    metaDescriptionEn:
      'Inheritance lawyers for Almería. Wills, estate division, legitimate portions, inheritance tax. Free consultation. ☎ +34 968 241 025.',
    h1Es: 'Abogados de Herencias en Almería',
    h1En: 'Inheritance Lawyers in Almería',
    introEs:
      'Nuestro bufete de abogados ofrece asesoramiento integral en herencias y sucesiones a clientes de Almería y toda la provincia. Tramitación completa de herencias, testamentos e impugnaciones con más de 75 años de experiencia.',
    introEn:
      'Our law firm offers comprehensive advice on inheritance and succession to clients in Almería and the entire province. Complete processing of inheritances, wills and contestations with over 75 years of experience.',
    cityContentEs:
      'Almería presenta particularidades en materia sucesoria que requieren un conocimiento especializado: la importante presencia de comunidad extranjera (especialmente británica, alemana y nórdica) en la zona de Mojácar, Vera, Garrucha y la costa almeriense genera herencias internacionales que deben tramitarse conforme al Reglamento Europeo de Sucesiones. Además, las fincas rústicas agrícolas del Poniente almeriense (invernaderos, terrenos de cultivo) plantean valoraciones complejas en las particiones hereditarias. Nuestro equipo tiene experiencia en herencias transfronterizas y en la fiscalidad sucesoria de Andalucía, que presenta diferencias significativas respecto a la de Murcia.',
    cityContentEn:
      'Almería has specific inheritance characteristics: the significant foreign community (especially British, German and Nordic) on the Almería coast generates international inheritances that must be processed under the European Succession Regulation. Additionally, the agricultural estates in western Almería (greenhouses, farmland) pose complex valuations.',
    advantagesEs: [
      'Experiencia en herencias internacionales (Reglamento Europeo de Sucesiones)',
      'Conocimiento de la fiscalidad sucesoria de Andalucía',
      'Valoración de fincas rústicas y explotaciones agrícolas',
      'Gestión de herencias con bienes en varias comunidades autónomas',
      'Atención en español e inglés para herederos extranjeros',
      'Primera consulta gratuita por videoconferencia',
    ],
    advantagesEn: [
      'Experience in international inheritances (European Succession Regulation)',
      'Knowledge of Andalusia\'s inheritance tax system',
      'Valuation of rural estates and agricultural operations',
      'Management of inheritances with assets in multiple regions',
      'Assistance in Spanish and English for foreign heirs',
      'Free initial consultation by video conference',
    ],
  },
];

export function getLandingPageBySlug(slug: string, locale: 'es' | 'en') {
  return landingPages.find((lp) => (locale === 'es' ? lp.slugEs : lp.slugEn) === slug);
}

export function getAllLandingPageSlugs(locale: 'es' | 'en') {
  return landingPages.map((lp) => (locale === 'es' ? lp.slugEs : lp.slugEn));
}
