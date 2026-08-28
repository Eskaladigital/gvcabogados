export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceSection {
  title: string;
  content: string;
}

export interface Service {
  id: string;
  slugEs: string;
  slugEn: string;
  genericSlugEs: string;
  genericSlugEn: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  longDescriptionEs: string;
  longDescriptionEn: string;
  icon: string;
  priority: number;
  category: 'privado' | 'publico';
  // SEO expanded content
  sectionsEs: ServiceSection[];
  sectionsEn: ServiceSection[];
  faqsEs: ServiceFAQ[];
  faqsEn: ServiceFAQ[];
  processEs: string[];
  processEn: string[];
}

export const services: Service[] = [
  {
    id: 'accidentes-trafico',
    slugEs: 'abogados-accidentes-trafico-murcia',
    slugEn: 'traffic-accident-lawyers-murcia',
    genericSlugEs: 'accidentes-trafico',
    genericSlugEn: 'traffic-accidents',
    nameEs: 'Accidentes de Tráfico',
    nameEn: 'Traffic Accidents',
    descriptionEs: 'Reclamaciones por accidentes de tráfico. Expertos en el baremo de tráfico, indemnizaciones y defensa de víctimas',
    descriptionEn: 'Traffic accident claims. Experts in the traffic injury scale, compensation and victim defense',
    longDescriptionEs:
      'Nuestro equipo de abogados en Murcia está especializado en la tramitación de reclamaciones por accidentes de tráfico, con un profundo conocimiento del baremo de valoración de daños personales (Ley 35/2015). Nos encargamos de todo el proceso: desde la recogida de pruebas y la negociación con las compañías aseguradoras, hasta la defensa judicial si fuera necesario. Luchamos por conseguir la máxima indemnización para nuestros clientes, cubriendo daños materiales, lesiones personales, lucro cesante y daño moral.',
    longDescriptionEn:
      'Our team of lawyers in Murcia specializes in handling traffic accident claims, with deep expertise in the personal injury assessment scale (Law 35/2015). We manage the entire process: from evidence collection and negotiation with insurance companies, to court defense if necessary. We fight to obtain the maximum compensation for our clients, covering material damages, personal injuries, lost earnings and moral damages.',
    icon: '🚗',
    priority: 1,
    category: 'privado',
    sectionsEs: [
      {
        title: 'Tipos de accidentes de tráfico que gestionamos en Murcia',
        content: 'Nuestro despacho en Murcia abarca todos los tipos de siniestros viales: colisiones entre vehículos, atropellos a peatones, accidentes de moto y bicicleta, salidas de vía, accidentes en cadena y siniestros por estado deficiente de las carreteras. En Murcia, atendemos especialmente accidentes en las autovías A-30 y A-7, que registran frecuentes retenciones y siniestros, especialmente en los tramos de Molina de Segura, Martínez del Puerto y el nudo de Espinardo. También reclamamos cuando el responsable se ha dado a la fuga o no tiene seguro, acudiendo al Consorcio de Compensación de Seguros para que nuestros clientes reciban su indemnización igualmente.',
      },
      {
        title: 'Indemnizaciones por accidentes de tráfico: baremo 2024',
        content: 'Aplicamos el baremo de valoración de daños personales (Ley 35/2015) para calcular la indemnización máxima que le corresponde. Este baremo tiene en cuenta las lesiones temporales, las secuelas permanentes, el perjuicio estético, el lucro cesante y los gastos de asistencia sanitaria futura. En García-Valcárcel & Cáceres realizamos un estudio detallado de cada caso para que ningún concepto indemnizatorio quede sin reclamar. Trabajamos con los principales centros de referencia de Murcia como el Hospital HLA La Vega (con su Unidad de Lesionados de Tráfico) y la red Ribera Sanitario para obtener informes médicos precisos que respalden su reclamación.',
      },
      {
        title: 'Tramitación ante los Juzgados de Murcia',
        content: 'Cuando la negociación extrajudicial no es suficiente, interponemos demandas ante los Juzgados de lo Penal de Murcia, ubicados en la Ciudad de la Justicia (Avda. Ciudad de la Justicia, s/n, 30011 Murcia). Nuestros abogados conocen perfectamente los procedimientos y los plazos de los tribunales murcianos, lo que nos permite agilizar los trámites y obtener resoluciones favorables para nuestros clientes. También gestionamos la obtención de atestados policiales a través del Grupo de Atestados de la Policía Local de Murcia.',
      },
      {
        title: 'Negociación con compañías aseguradoras',
        content: 'Las aseguradoras suelen ofrecer indemnizaciones muy por debajo de lo que legalmente corresponde. Nuestros abogados cuentan con amplia experiencia en la negociación extrajudicial con las principales compañías de seguros en España. Si no aceptan una oferta justa, no dudamos en acudir a los tribunales de Murcia para defender los derechos de nuestros clientes.',
      },
    ],
    sectionsEn: [
      {
        title: 'Types of traffic accidents we handle',
        content: 'Our firm in Murcia covers all types of road accidents: vehicle collisions, pedestrian accidents, motorcycle and bicycle accidents, road departures, chain collisions and accidents caused by poor road conditions. We also claim when the responsible party has fled or has no insurance, going to the Insurance Compensation Consortium so our clients receive their compensation.',
      },
      {
        title: 'Traffic accident compensation: 2024 scale',
        content: 'We apply the personal injury assessment scale (Law 35/2015) to calculate the maximum compensation you are entitled to. This scale takes into account temporary injuries, permanent disabilities, aesthetic damage, lost earnings and future healthcare costs. At García-Valcárcel & Cáceres we carry out a detailed study of each case so that no compensation concept goes unclaimed.',
      },
      {
        title: 'Negotiation with insurance companies',
        content: 'Insurance companies usually offer compensation well below what is legally due. Our lawyers have extensive experience in out-of-court negotiation with major insurance companies in Spain. If they do not accept a fair offer, we do not hesitate to go to court to defend our clients\' rights.',
      },
    ],
    faqsEs: [
      { question: '¿Cuánto tiempo tengo para reclamar tras un accidente de tráfico en Murcia?', answer: 'El plazo general de prescripción es de 1 año desde la fecha del accidente o desde el alta médica definitiva. Es importante actuar cuanto antes para preservar las pruebas y no perder sus derechos. En Murcia, puede solicitar el atestado policial a través del Grupo de Atestados de la Policía Local (policia.atestados@ayto-murcia.es) o presencialmente en sus dependencias.' },
      { question: '¿Puedo reclamar si el accidente fue parcialmente culpa mía?', answer: 'Sí. En España se aplica la concurrencia de culpas, lo que significa que puede recibir una indemnización proporcional aunque haya contribuido parcialmente al accidente. Los tribunales de Murcia aplican esta doctrina de forma habitual en sus resoluciones.' },
      { question: '¿Cuánto cuesta contratar un abogado de accidentes de tráfico en Murcia?', answer: 'En García-Valcárcel & Cáceres los honorarios se pactan de forma transparente. En muchos casos trabajamos a resultado, es decir, solo cobramos si usted gana. Nuestro despacho está ubicado en Gran Vía 15, en pleno centro de Murcia, facilitando el acceso a nuestros clientes.' },
      { question: '¿Qué indemnización puedo recibir por un accidente de tráfico?', answer: 'La cuantía depende de la gravedad de las lesiones, las secuelas, el tiempo de recuperación y los perjuicios económicos. Un accidente con cervicalgia leve puede suponer entre 2.000€ y 6.000€, mientras que lesiones graves pueden superar los 100.000€. En Murcia trabajamos con centros especializados como el Hospital HLA La Vega y la red Ribera Sanitario para valorar correctamente las lesiones según el baremo vigente.' },
      { question: '¿Dónde se tramitan los juicios por accidentes de tráfico en Murcia?', answer: 'Los accidentes de tráfico con lesiones se tramitan ante los Juzgados de lo Penal de Murcia, ubicados en la Ciudad de la Justicia (Avda. Ciudad de la Justicia, s/n, 30011 Murcia). Si el accidente solo causa daños materiales, se puede reclamar ante los Juzgados de Primera Instancia. Nuestro despacho conoce perfectamente los procedimientos y plazos de estos tribunales.' },
    ],
    faqsEn: [
      { question: 'How long do I have to claim after a traffic accident?', answer: 'The general limitation period is 1 year from the date of the accident or from the final medical discharge. It is important to act as soon as possible to preserve evidence.' },
      { question: 'Can I claim if the accident was partially my fault?', answer: 'Yes. In Spain, contributory negligence applies, meaning you can receive proportional compensation even if you partially contributed to the accident.' },
      { question: 'How much does a traffic accident lawyer cost?', answer: 'At García-Valcárcel & Cáceres we offer a free initial consultation. Fees are agreed transparently and in many cases we work on a no-win-no-fee basis.' },
      { question: 'How much compensation can I receive for a traffic accident?', answer: 'The amount depends on the severity of injuries, sequelae, recovery time and economic losses. A mild whiplash accident can be between €2,000 and €6,000, while serious injuries can exceed €100,000.' },
    ],
    processEs: [
      'Contacto inicial: evaluamos su caso sin compromiso',
      'Recopilación de pruebas: atestado policial, informes médicos, fotos',
      'Reclamación extrajudicial a la aseguradora',
      'Negociación de la indemnización máxima',
      'Demanda judicial si la aseguradora no ofrece una cantidad justa',
      'Cobro de la indemnización y cierre del caso',
    ],
    processEn: [
      'Initial contact: we evaluate your case with no obligation',
      'Evidence collection: police report, medical records, photos',
      'Extrajudicial claim to the insurance company',
      'Negotiation for maximum compensation',
      'Court lawsuit if the insurer does not offer a fair amount',
      'Collection of compensation and case closure',
    ],
  },
  {
    id: 'derecho-familia',
    slugEs: 'abogados-derecho-familia-murcia',
    slugEn: 'family-law-lawyers-murcia',
    genericSlugEs: 'derecho-familia',
    genericSlugEn: 'family-law',
    nameEs: 'Derecho de Familia',
    nameEn: 'Family Law',
    descriptionEs: 'Divorcios, custodia, pensiones alimenticias y mediación familiar',
    descriptionEn: 'Divorce, custody, child support and family mediation',
    longDescriptionEs:
      'Abogados especializados en derecho de familia en Murcia. Gestionamos divorcios de mutuo acuerdo y contenciosos, regulación de custodia compartida o exclusiva, pensiones alimenticias, regímenes de visitas, liquidación de bienes gananciales, y procesos de mediación familiar. Nuestro enfoque busca siempre la solución más favorable para nuestros clientes, priorizando el bienestar de los menores.',
    longDescriptionEn:
      'Lawyers specialized in family law in Murcia. We handle both amicable and contentious divorces, shared or sole custody arrangements, child support, visitation rights, community property liquidation, and family mediation processes. Our approach always seeks the most favorable solution for our clients, prioritizing the welfare of minors.',
    icon: '👨‍👩‍👧',
    priority: 1,
    category: 'privado',
    sectionsEs: [
      {
        title: 'Divorcio de mutuo acuerdo en Murcia',
        content: 'El divorcio de mutuo acuerdo es la vía más rápida y económica para disolver un matrimonio. En nuestro despacho redactamos el convenio regulador que recoge todos los acuerdos sobre custodia de hijos, pensión alimenticia, uso de la vivienda y reparto de bienes. El proceso puede resolverse en pocas semanas ante el Juzgado de Familia Número 1 de Murcia (Avda. Ciudad de la Justicia, s/n, 30011 Murcia) o incluso ante notario si no hay hijos menores. Antes de iniciar el procedimiento, recomendamos acudir al Centro de Mediación de la Región de Murcia para intentar alcanzar acuerdos, lo que puede agilizar significativamente el proceso.',
      },
      {
        title: 'Divorcio contencioso y custodia compartida',
        content: 'Cuando no hay acuerdo entre los cónyuges, tramitamos divorcios contenciosos defendiendo sus intereses con firmeza ante los Juzgados de Primera Instancia de Murcia. Tenemos amplia experiencia en procedimientos de custodia compartida, que es el régimen cada vez más habitual en los tribunales de Murcia. Preparamos la estrategia procesal adecuada, incluyendo informes periciales y pruebas documentales que respalden su posición. Los juzgados murcianos valoran positivamente la mediación previa, por lo que siempre exploramos esta vía antes de iniciar el proceso contencioso.',
      },
      {
        title: 'Pensiones alimenticias y modificación de medidas',
        content: 'Calculamos la pensión alimenticia que corresponde según la jurisprudencia actual de los tribunales de Murcia y las circunstancias de cada familia. Si sus condiciones económicas han cambiado, también tramitamos la modificación de medidas ante el Juzgado de Familia correspondiente para ajustar la pensión, el régimen de visitas o la custodia a la nueva situación. Conocemos los criterios que aplican los jueces de Murcia en estos casos, lo que nos permite calcular pensiones más ajustadas a la realidad judicial.',
      },
      {
        title: 'Mediación familiar en Murcia',
        content: 'Antes de iniciar cualquier procedimiento judicial, siempre recomendamos explorar la vía de la mediación familiar. En Murcia contamos con el Centro de Mediación de la Región de Murcia (C/ Nueva Nº 22, 1ºB, Murcia) y otros centros acreditados. La mediación es obligatoria como Medio Adecuado de Solución de Conflictos (MASC) antes de presentar demanda civil en muchos casos. Nuestro despacho puede acompañarle en este proceso, que suele ser más rápido, económico y menos traumático que un juicio.',
      },
    ],
    sectionsEn: [
      {
        title: 'Amicable divorce in Murcia',
        content: 'An amicable divorce is the fastest and most affordable way to dissolve a marriage. At our firm we draft the regulatory agreement covering all custody, child support, housing use and property division agreements. The process can be resolved in a few weeks before the Court or even before a notary if there are no minor children.',
      },
      {
        title: 'Contentious divorce and shared custody',
        content: 'When there is no agreement between spouses, we handle contentious divorces defending your interests firmly. We have extensive experience in shared custody proceedings, which is the increasingly common arrangement in Murcia courts.',
      },
      {
        title: 'Child support and modification of measures',
        content: 'We calculate the child support that corresponds according to current case law and each family\'s circumstances. If your financial conditions have changed, we also process modification of measures to adjust support, visitation or custody to the new situation.',
      },
    ],
    faqsEs: [
      { question: '¿Cuánto tarda un divorcio de mutuo acuerdo en Murcia?', answer: 'Un divorcio de mutuo acuerdo puede resolverse en 4-8 semanas desde que se presenta la demanda ante el Juzgado de Familia Número 1 de Murcia (Avda. Ciudad de la Justicia, s/n). Ante notario (sin hijos menores) puede ser aún más rápido, en torno a 2-3 semanas. El proceso se agiliza si previamente se ha realizado mediación familiar en el Centro de Mediación de la Región de Murcia.' },
      { question: '¿Cuánto cuesta un divorcio en Murcia?', answer: 'Un divorcio de mutuo acuerdo tiene un coste desde 600€ más tasas judiciales. El divorcio contencioso varía según la complejidad, pero siempre informamos de los honorarios de forma transparente antes de comenzar. Si se realiza mediación previa (coste aproximado 100€), el proceso puede ser más económico al evitarse parte del litigio.' },
      { question: '¿Puedo pedir la custodia compartida en Murcia?', answer: 'Sí. La custodia compartida es cada vez más habitual en los tribunales de Murcia. Los jueces del Juzgado de Familia la conceden cuando ambos progenitores tienen capacidad para cuidar a los menores y viven en la misma localidad o cercanías. En García-Valcárcel & Cáceres preparamos la documentación necesaria para demostrar que ambos progenitores están capacitados para ejercer la custodia compartida.' },
      { question: '¿Se puede modificar la pensión alimenticia?', answer: 'Sí, si ha habido un cambio sustancial de circunstancias (pérdida de empleo, cambio de ingresos, mayoría de edad de los hijos) puede solicitar una modificación de medidas ante el Juzgado de Familia de Murcia. Tramitamos estas modificaciones conociendo los criterios que aplican los jueces murcianos en estos casos.' },
      { question: '¿Es obligatoria la mediación antes del divorcio en Murcia?', answer: 'La mediación familiar es obligatoria como Medio Adecuado de Solución de Conflictos (MASC) antes de presentar demanda civil en muchos casos. En Murcia puede acudir al Centro de Mediación de la Región de Murcia (C/ Nueva Nº 22, 1ºB). La primera sesión informativa puede ayudar a alcanzar acuerdos sin necesidad de juicio.' },
    ],
    faqsEn: [
      { question: 'How long does an amicable divorce take in Murcia?', answer: 'An amicable divorce can be resolved in 4-8 weeks. Before a notary (without minor children) it can be even faster, around 2-3 weeks.' },
      { question: 'How much does a divorce cost?', answer: 'An amicable divorce starts from €600 plus court fees. Contentious divorce varies by complexity, but we always inform fees transparently beforehand.' },
      { question: 'Can I request shared custody in Murcia?', answer: 'Yes. Shared custody is increasingly common in Murcia when both parents have the capacity to care for minors and live in the same area.' },
      { question: 'Can child support be modified?', answer: 'Yes, if there has been a substantial change in circumstances (job loss, income change, children reaching adulthood) you can request a modification of measures.' },
    ],
    processEs: [
      'Contacto inicial: analizamos su situación familiar',
      'Asesoramiento sobre el tipo de divorcio más conveniente',
      'Redacción del convenio regulador o demanda contenciosa',
      'Negociación de custodia, pensiones y reparto de bienes',
      'Presentación ante el Juzgado de Familia de Murcia',
      'Seguimiento hasta la sentencia firme',
    ],
    processEn: [
      'Initial contact: we analyze your family situation',
      'Advice on the most suitable type of divorce',
      'Drafting of regulatory agreement or contentious petition',
      'Negotiation of custody, support and property division',
      'Filing before the Murcia Family Court',
      'Follow-up until final judgment',
    ],
  },
  {
    id: 'derecho-bancario',
    slugEs: 'abogados-derecho-bancario-murcia',
    slugEn: 'banking-law-lawyers-murcia',
    genericSlugEs: 'derecho-bancario',
    genericSlugEn: 'banking-law',
    nameEs: 'Derecho Bancario',
    nameEn: 'Banking Law',
    descriptionEs: 'Cláusulas abusivas, reclamaciones hipotecarias y tarjetas revolving',
    descriptionEn: 'Unfair clauses, mortgage claims and revolving credit cards',
    longDescriptionEs:
      'Somos expertos en derecho bancario en Murcia. Reclamamos por cláusulas suelo, gastos hipotecarios abusivos, tarjetas revolving con intereses usurarios, productos financieros complejos (preferentes, swaps), y cualquier tipo de abuso bancario. Defendemos los derechos de los consumidores frente a las entidades financieras con un alto porcentaje de éxito.',
    longDescriptionEn:
      'We are experts in banking law in Murcia. We claim for floor clauses, abusive mortgage expenses, revolving credit cards with usurious interest rates, complex financial products (preferred shares, swaps), and any type of banking abuse. We defend consumer rights against financial institutions with a high success rate.',
    icon: '🏦',
    priority: 4,
    category: 'privado',
    sectionsEs: [
      {
        title: 'Reclamación de tarjetas revolving en Murcia',
        content: 'Las tarjetas revolving (Wizink, Citibank, Cetelem, Cofidis, entre otras) aplican intereses que en muchos casos superan el umbral de usura establecido por el Tribunal Supremo. Si tiene o ha tenido una tarjeta revolving, es muy probable que pueda recuperar todos los intereses pagados de más. En nuestro despacho hemos gestionado centenares de reclamaciones con un porcentaje de éxito superior al 95%. Las demandas se interponen ante los Juzgados de Primera Instancia de Murcia ubicados en la Ciudad de la Justicia.',
      },
      {
        title: 'Gastos hipotecarios y cláusulas abusivas ante el Juzgado especializado',
        content: 'Tras las sentencias del Tribunal Supremo y del TJUE, miles de consumidores pueden reclamar la devolución de gastos hipotecarios indebidamente cobrados: gestoría, registro, notaría, tasación y el Impuesto de Actos Jurídicos Documentados (IAJD). También reclamamos por cláusulas suelo, vencimiento anticipado, intereses de demora abusivos y comisiones de apertura. En Murcia, el Juzgado de Primera Instancia número 16 es el órgano especializado en estas reclamaciones y ha dictado sentencias pioneras anulando cláusulas IRPH y otras cláusulas abusivas. Este juzgado está ubicado en la Ciudad de la Justicia (Avda. Ciudad de la Justicia, s/n, 30011 Murcia).',
      },
      {
        title: 'Productos financieros tóxicos',
        content: 'Si invirtió en participaciones preferentes, obligaciones subordinadas, bonos estructurados o swaps sin recibir la información adecuada, puede reclamar la nulidad del contrato y la devolución de su inversión. Nuestros abogados tienen experiencia contrastada en la defensa de pequeños ahorradores frente a las entidades financieras ante los tribunales de Murcia. También puede obtener información y asesoramiento a través de la Dirección General de Consumo de la Región de Murcia.',
      },
    ],
    sectionsEn: [
      {
        title: 'Revolving credit card claims',
        content: 'Revolving credit cards (Wizink, Citibank, Cetelem, Cofidis, among others) apply interest rates that in many cases exceed the usury threshold established by the Supreme Court. If you have or had a revolving card, you can likely recover all overpaid interest. Our firm has handled hundreds of claims with a success rate above 95%.',
      },
      {
        title: 'Mortgage expenses and unfair clauses',
        content: 'Following Supreme Court and CJEU rulings, thousands of consumers can claim refund of unduly charged mortgage expenses: management, registry, notary, valuation and stamp duty. We also claim for floor clauses, early termination, abusive default interest and opening commissions.',
      },
      {
        title: 'Toxic financial products',
        content: 'If you invested in preferred shares, subordinated bonds, structured bonds or swaps without receiving adequate information, you can claim contract nullity and refund of your investment.',
      },
    ],
    faqsEs: [
      { question: '¿Puedo reclamar por mi tarjeta revolving en Murcia?', answer: 'Sí, si su tarjeta revolving aplica una TAE superior al 20%, es muy probable que los intereses sean declarados usurarios y pueda recuperar todo lo pagado de más. Incluso si ya la canceló, puede reclamar. Las demandas se interponen ante los Juzgados de Primera Instancia de Murcia en la Ciudad de la Justicia.' },
      { question: '¿Qué gastos hipotecarios puedo recuperar?', answer: 'Puede reclamar los gastos de gestoría, registro de la propiedad, notaría, tasación y, en algunas comunidades, parte del IAJD. La cantidad media recuperada oscila entre 1.500€ y 4.000€. En Murcia, el Juzgado de Primera Instancia número 16 (especializado en derecho bancario) ha anulado recientemente cláusulas de gastos de constitución hipotecaria y otras cláusulas abusivas.' },
      { question: '¿Tiene plazo la reclamación bancaria?', answer: 'Las reclamaciones por cláusulas abusivas no prescriben según la jurisprudencia europea. Las tarjetas revolving tienen un plazo de 5 años desde la última liquidación. Consúltenos para evaluar su caso concreto. También puede obtener información en la Dirección General de Consumo de la Región de Murcia.' },
      { question: '¿Cuánto tarda una reclamación bancaria en Murcia?', answer: 'La reclamación extrajudicial al banco suele tardar 1-3 meses. Si hay que ir a juicio, el proceso se tramita ante el Juzgado de Primera Instancia número 16 de Murcia (especializado en derecho bancario). Este juzgado está actualmente saturado, con tiempos de espera de 16-18 meses solo para registrar la demanda, por lo que es importante iniciar el proceso cuanto antes. El Tribunal Superior de Justicia de Murcia está estudiando medidas de refuerzo para agilizar estos procedimientos.' },
    ],
    faqsEn: [
      { question: 'Can I claim for my revolving credit card?', answer: 'Yes, if your revolving card applies an APR above 20%, the interest is very likely to be declared usurious and you can recover everything overpaid. Even if you already cancelled it.' },
      { question: 'What mortgage expenses can I recover?', answer: 'You can claim management fees, property registry, notary, valuation and in some regions part of stamp duty. Average recovery is between €1,500 and €4,000.' },
      { question: 'Is there a deadline for banking claims?', answer: 'Claims for unfair clauses do not expire according to EU case law. Revolving cards have a 5-year period from the last settlement. Contact us to evaluate your specific case.' },
      { question: 'How long does a banking claim take?', answer: 'The extrajudicial claim to the bank usually takes 1-3 months. If court proceedings are needed, the process can extend between 6 and 18 months.' },
    ],
    processEs: [
      'Estudio gratuito de su documentación bancaria',
      'Cálculo de las cantidades a reclamar',
      'Reclamación previa al servicio de atención al cliente del banco',
      'Demanda judicial si el banco no acepta devolver las cantidades',
      'Juicio y sentencia favorable',
      'Cobro de las cantidades reclamadas más intereses legales',
    ],
    processEn: [
      'Free study of your banking documentation',
      'Calculation of amounts to claim',
      'Prior claim to the bank\'s customer service',
      'Lawsuit if the bank refuses to refund',
      'Trial and favorable judgment',
      'Collection of claimed amounts plus legal interest',
    ],
  },
  {
    id: 'derecho-penal',
    slugEs: 'abogados-derecho-penal-murcia',
    slugEn: 'criminal-law-lawyers-murcia',
    genericSlugEs: 'derecho-penal',
    genericSlugEn: 'criminal-law',
    nameEs: 'Derecho Penal',
    nameEn: 'Criminal Law',
    descriptionEs: 'Defensa penal integral, asistencia al detenido y delitos económicos',
    descriptionEn: 'Comprehensive criminal defense, detainee assistance and economic crimes',
    longDescriptionEs:
      'Despacho de abogados penalistas en Murcia con amplia experiencia en todo tipo de delitos. Ofrecemos asistencia letrada al detenido las 24 horas, defensa en juicios penales, delitos económicos y contra la propiedad, delitos contra las personas, violencia de género, y delitos de tráfico. Actuamos con la máxima diligencia desde el primer momento.',
    longDescriptionEn:
      'Criminal law firm in Murcia with extensive experience in all types of crimes. We offer 24-hour legal assistance to detainees, defense in criminal trials, economic and property crimes, crimes against persons, gender violence, and traffic offenses. We act with the utmost diligence from the very first moment.',
    icon: '⚖️',
    priority: 2,
    category: 'publico',
    sectionsEs: [
      {
        title: 'Asistencia letrada al detenido 24 horas en Murcia',
        content: 'Si usted o un familiar ha sido detenido, tiene derecho a la asistencia de un abogado desde el primer momento. En García-Valcárcel & Cáceres ofrecemos un servicio de asistencia letrada urgente las 24 horas del día, los 365 días del año. Le acompañamos durante la declaración en comisaría, le informamos de sus derechos y preparamos su defensa desde el primer instante. Si el caso pasa a la fase de instrucción, actuamos ante los Juzgados de Instrucción de Murcia ubicados en la Ciudad de la Justicia (Avda. Ciudad de la Justicia, s/n, 30011 Murcia).',
      },
      {
        title: 'Delitos económicos y contra la propiedad',
        content: 'Defendemos a nuestros clientes acusados de estafa, apropiación indebida, insolvencia punible, delitos fiscales, blanqueo de capitales, hurto, robo y daños ante los Juzgados de lo Penal de Murcia. Analizamos cada caso en profundidad para construir la estrategia de defensa más sólida, buscando la absolución o la mínima pena posible. Conocemos los criterios que aplican los jueces penales de Murcia, lo que nos permite preparar defensas más efectivas.',
      },
      {
        title: 'Violencia de género y delitos contra las personas',
        content: 'Actuamos como acusación particular en nombre de las víctimas de violencia de género, lesiones, amenazas, coacciones y acoso ante los Juzgados de lo Penal de Murcia. También ejercemos la defensa penal de personas acusadas de estos delitos, garantizando siempre el derecho a la presunción de inocencia y a un juicio justo. Los casos de violencia de género se tramitan en los Juzgados de Violencia sobre la Mujer de Murcia, con los que mantenemos una relación profesional fluida.',
      },
    ],
    sectionsEn: [
      {
        title: '24-hour legal assistance for detainees',
        content: 'If you or a family member has been detained, you have the right to a lawyer from the very first moment. At García-Valcárcel & Cáceres we offer urgent legal assistance 24 hours a day, 365 days a year.',
      },
      {
        title: 'Economic and property crimes',
        content: 'We defend clients accused of fraud, embezzlement, punishable insolvency, tax crimes, money laundering, theft, robbery and damages. We analyze each case in depth to build the strongest defense strategy.',
      },
      {
        title: 'Gender violence and crimes against persons',
        content: 'We act as private prosecution on behalf of victims of gender violence, injuries, threats, coercion and harassment. We also provide criminal defense for persons accused of these crimes, always guaranteeing the right to presumption of innocence.',
      },
    ],
    faqsEs: [
      { question: '¿Qué hago si me detienen?', answer: 'Tiene derecho a guardar silencio y a solicitar un abogado. No declare nada sin la presencia de su letrado. Llame a nuestro teléfono de urgencias y le asistiremos inmediatamente en comisaría.' },
      { question: '¿Cuánto tiempo pueden tenerme detenido?', answer: 'El plazo máximo de detención es de 72 horas, tras las cuales deben ponerle en libertad o a disposición judicial. En la práctica, la mayoría de detenciones se resuelven en 24-48 horas.' },
      { question: '¿Qué diferencia hay entre un delito leve y un delito grave?', answer: 'Los delitos leves (antiguas faltas) se juzgan en juicios rápidos y conllevan multas. Los delitos menos graves pueden conllevar penas de hasta 5 años de prisión, y los graves superan esa duración.' },
    ],
    faqsEn: [
      { question: 'What should I do if I am detained?', answer: 'You have the right to remain silent and request a lawyer. Do not make any statements without your lawyer present. Call our emergency number and we will assist you immediately.' },
      { question: 'How long can they keep me detained?', answer: 'The maximum detention period is 72 hours, after which they must release you or bring you before a judge. In practice, most detentions are resolved within 24-48 hours.' },
      { question: 'What is the difference between a minor and a serious crime?', answer: 'Minor crimes are judged in fast trials and carry fines. Less serious crimes can carry up to 5 years in prison, and serious crimes exceed that duration.' },
    ],
    processEs: [
      'Asistencia urgente al detenido (24h)',
      'Análisis del caso y la acusación',
      'Diseño de la estrategia de defensa',
      'Fase de instrucción: proposición de pruebas',
      'Juicio oral: defensa ante el tribunal',
      'Recurso de apelación si es necesario',
    ],
    processEn: [
      'Urgent assistance to detainee (24h)',
      'Analysis of the case and charges',
      'Design of defense strategy',
      'Investigation phase: evidence proposal',
      'Oral trial: defense before the court',
      'Appeal if necessary',
    ],
  },
  {
    id: 'derecho-inmobiliario',
    slugEs: 'abogados-derecho-inmobiliario-murcia',
    slugEn: 'real-estate-law-lawyers-murcia',
    genericSlugEs: 'derecho-inmobiliario',
    genericSlugEn: 'real-estate-law',
    nameEs: 'Derecho Inmobiliario',
    nameEn: 'Real Estate Law',
    descriptionEs: 'Compraventa, arrendamientos y propiedad horizontal',
    descriptionEn: 'Property sales, leases and condominium law',
    longDescriptionEs:
      'Asesoramiento jurídico integral en materia inmobiliaria en Murcia. Gestionamos compraventas de inmuebles, contratos de arrendamiento, desahucios, comunidades de propietarios, propiedad horizontal, reclamaciones por vicios ocultos, y litigios urbanísticos. Protegemos los intereses de nuestros clientes en todas las operaciones inmobiliarias.',
    longDescriptionEn:
      'Comprehensive legal advice on real estate matters in Murcia. We manage property purchases, lease agreements, evictions, homeowner associations, condominium law, hidden defect claims, and urban planning litigation. We protect our clients\' interests in all real estate transactions.',
    icon: '🏠',
    priority: 2,
    category: 'privado',
    sectionsEs: [
      {
        title: 'Compraventa de inmuebles en Murcia',
        content: 'Le acompañamos en todo el proceso de compra o venta de su vivienda, local o terreno. Revisamos el contrato de arras, comprobamos cargas registrales en el Registro de la Propiedad de Murcia (Avda. Teniente General Gutiérrez Mellado, 9, 2º, 30008 Murcia), verificamos la situación urbanística del inmueble y le asesoramos fiscalmente para optimizar la operación. Nuestra intervención evita sorpresas desagradables y protege su inversión. En Murcia existen múltiples Registros de la Propiedad (37 en total en la provincia), y conocemos los procedimientos de cada uno.',
      },
      {
        title: 'Arrendamientos y desahucios',
        content: 'Redactamos contratos de alquiler que protejan tanto al propietario como al inquilino según la LAU vigente. En caso de impago, tramitamos procedimientos de desahucio express ante los Juzgados de Primera Instancia de Murcia para recuperar la posesión del inmueble en el menor tiempo posible. También defendemos a inquilinos frente a cláusulas abusivas o desahucios injustificados. Los desahucios en Murcia se tramitan en la Ciudad de la Justicia, donde conocemos los plazos y procedimientos específicos.',
      },
      {
        title: 'Comunidades de propietarios y propiedad horizontal',
        content: 'Asesoramos a comunidades de vecinos en la redacción y modificación de estatutos, impugnación de acuerdos, reclamación de derramas e impagos de cuotas, y conflictos entre propietarios. Representamos tanto a comunidades como a propietarios individuales ante los Juzgados de Primera Instancia de Murcia. Conocemos la jurisprudencia específica de los tribunales murcianos en materia de propiedad horizontal.',
      },
    ],
    sectionsEn: [
      {
        title: 'Property purchases in Murcia',
        content: 'We accompany you throughout the process of buying or selling your home, premises or land. We review the deposit contract, check registry charges, verify the property\'s urban planning status and advise you fiscally to optimize the transaction.',
      },
      {
        title: 'Leases and evictions',
        content: 'We draft rental contracts that protect both landlord and tenant under current legislation. In case of non-payment, we process express eviction procedures to recover possession in the shortest possible time.',
      },
      {
        title: 'Homeowner associations and condominium law',
        content: 'We advise homeowner associations on drafting and amending bylaws, challenging agreements, claiming assessments and unpaid fees, and disputes between owners.',
      },
    ],
    faqsEs: [
      { question: '¿Necesito abogado para comprar una vivienda?', answer: 'No es obligatorio, pero es muy recomendable. Un abogado inmobiliario revisa las cargas del inmueble, el contrato de arras y la escritura de compraventa para evitar problemas futuros que pueden costarle miles de euros.' },
      { question: '¿Cuánto tarda un desahucio por impago en Murcia?', answer: 'Con el procedimiento de desahucio express, el plazo medio en Murcia es de 3 a 6 meses desde la presentación de la demanda. Si el inquilino se opone, puede alargarse hasta 8-12 meses.' },
      { question: '¿Puedo reclamar por vicios ocultos en una vivienda?', answer: 'Sí, tiene un plazo de 6 meses desde el descubrimiento del vicio para reclamar al vendedor. Si se trata de obra nueva, el plazo puede ser de hasta 10 años para defectos estructurales.' },
    ],
    faqsEn: [
      { question: 'Do I need a lawyer to buy a property?', answer: 'It is not mandatory, but highly recommended. A real estate lawyer reviews property charges, the deposit contract and the deed of sale to avoid future problems.' },
      { question: 'How long does an eviction for non-payment take in Murcia?', answer: 'With the express eviction procedure, the average time in Murcia is 3 to 6 months from filing the claim.' },
      { question: 'Can I claim for hidden defects in a property?', answer: 'Yes, you have a 6-month period from discovery of the defect to claim from the seller. For new construction, the period can be up to 10 years for structural defects.' },
    ],
    processEs: [
      'Consulta inicial sobre su operación inmobiliaria',
      'Estudio de la documentación del inmueble',
      'Asesoramiento legal y fiscal personalizado',
      'Redacción o revisión de contratos',
      'Acompañamiento en la firma ante notario',
      'Gestión post-venta y resolución de incidencias',
    ],
    processEn: [
      'Initial consultation on your real estate transaction',
      'Study of property documentation',
      'Personalized legal and tax advice',
      'Contract drafting or review',
      'Accompaniment at notary signing',
      'Post-sale management and incident resolution',
    ],
  },
  {
    id: 'derecho-sucesorio',
    slugEs: 'abogados-derecho-sucesorio-murcia',
    slugEn: 'inheritance-law-lawyers-murcia',
    genericSlugEs: 'derecho-sucesorio',
    genericSlugEn: 'inheritance-law',
    nameEs: 'Derecho Sucesorio',
    nameEn: 'Inheritance Law',
    descriptionEs: 'Herencias, testamentos, partición de bienes y planificación sucesoria',
    descriptionEn: 'Inheritance, wills, estate division and succession planning',
    longDescriptionEs:
      'Abogados especialistas en herencias y sucesiones en Murcia. Gestionamos la tramitación completa de herencias, redacción e impugnación de testamentos, partición de bienes hereditarios, declaraciones de herederos, planificación sucesoria y fiscal, y reclamación de legítimas. Experiencia contrastada en sucesiones complejas.',
    longDescriptionEn:
      'Lawyers specializing in inheritance and succession in Murcia. We manage the complete processing of inheritances, drafting and contesting wills, division of inherited assets, declarations of heirs, succession and tax planning, and claiming legitimate portions. Proven experience in complex successions.',
    icon: '📜',
    priority: 3,
    category: 'privado',
    sectionsEs: [
      {
        title: 'Tramitación completa de herencias en Murcia',
        content: 'Nos encargamos de todo el proceso sucesorio: obtención de certificado de defunción y últimas voluntades en el Registro Civil Único de Murcia (Avda. Ciudad de la Justicia, s/n, 30011 Murcia), apertura del testamento, inventario y valoración de bienes, liquidación del Impuesto de Sucesiones (con las bonificaciones de hasta el 99% que aplica la Región de Murcia para herencias entre padres e hijos y entre cónyuges), escritura de aceptación y adjudicación de herencia ante notario, e inscripción de bienes en el Registro de la Propiedad de Murcia (Avda. Teniente General Gutiérrez Mellado, 9, 2º).',
      },
      {
        title: 'Impugnación de testamentos y reclamación de legítimas',
        content: 'Si considera que un testamento perjudica sus derechos como heredero forzoso, podemos impugnarlo ante los Juzgados de Primera Instancia de Murcia por incapacidad del testador, vicios del consentimiento o preterición. También reclamamos la legítima cuando no se ha respetado la porción que la ley reserva a hijos y cónyuge. Conocemos la jurisprudencia específica de los tribunales murcianos en esta materia.',
      },
      {
        title: 'Planificación sucesoria y fiscal en la Región de Murcia',
        content: 'Le asesoramos para organizar su sucesión de forma que sus herederos paguen los menores impuestos posibles. La Región de Murcia cuenta con bonificaciones muy ventajosas en el Impuesto de Sucesiones (hasta el 99% para herencias entre padres e hijos y entre cónyuges) que conviene aprovechar. Redactamos testamentos, fideicomisos y pactos sucesorios adaptados a su situación familiar y patrimonial, optimizando la carga fiscal según la normativa autonómica murciana.',
      },
    ],
    sectionsEn: [
      {
        title: 'Complete inheritance processing',
        content: 'We handle the entire succession process: obtaining death and last will certificates, opening the will, inventory and valuation of assets, settlement of Inheritance Tax, acceptance and adjudication deed, and registration of assets.',
      },
      {
        title: 'Contesting wills and claiming legitimate portions',
        content: 'If you believe a will harms your rights as a forced heir, we can contest it for testator incapacity, consent defects or preterition. We also claim the legitimate portion when the legally reserved share has not been respected.',
      },
      {
        title: 'Succession and tax planning',
        content: 'We advise you on organizing your succession so that your heirs pay the lowest possible taxes. The Region of Murcia has inheritance tax allowances that should be taken advantage of.',
      },
    ],
    faqsEs: [
      { question: '¿Cuánto tiempo tengo para aceptar una herencia?', answer: 'No hay un plazo legal fijo, pero el Impuesto de Sucesiones debe liquidarse en 6 meses desde el fallecimiento (prorrogable otros 6 meses). Le recomendamos iniciar los trámites cuanto antes.' },
      { question: '¿Puedo renunciar a una herencia con deudas?', answer: 'Sí, puede renunciar a la herencia o aceptarla a beneficio de inventario, lo que significa que solo responderá de las deudas con los bienes heredados, nunca con los suyos propios.' },
      { question: '¿Cuánto se paga de Impuesto de Sucesiones en Murcia?', answer: 'La Región de Murcia aplica bonificaciones de hasta el 99% para herencias entre padres e hijos y entre cónyuges, lo que reduce significativamente la carga fiscal.' },
    ],
    faqsEn: [
      { question: 'How long do I have to accept an inheritance?', answer: 'There is no fixed legal deadline, but Inheritance Tax must be settled within 6 months of death (extendable by another 6 months). We recommend starting procedures as soon as possible.' },
      { question: 'Can I renounce an inheritance with debts?', answer: 'Yes, you can renounce the inheritance or accept it with benefit of inventory, meaning you will only be liable for debts with inherited assets, never with your own.' },
      { question: 'How much Inheritance Tax is paid in Murcia?', answer: 'The Region of Murcia applies allowances of up to 99% for inheritances between parents and children and between spouses, significantly reducing the tax burden.' },
    ],
    processEs: [
      'Consulta inicial y estudio de la documentación sucesoria',
      'Obtención de certificados (defunción, últimas voluntades, seguros)',
      'Inventario y valoración de bienes hereditarios',
      'Negociación del cuaderno particional entre herederos',
      'Liquidación del Impuesto de Sucesiones',
      'Escritura de aceptación e inscripción registral',
    ],
    processEn: [
      'Initial consultation and study of succession documentation',
      'Obtaining certificates (death, last wills, insurance)',
      'Inventory and valuation of inherited assets',
      'Negotiation of partition among heirs',
      'Settlement of Inheritance Tax',
      'Acceptance deed and registry inscription',
    ],
  },
  {
    id: 'derecho-mercantil',
    slugEs: 'abogados-derecho-mercantil-murcia',
    slugEn: 'commercial-law-lawyers-murcia',
    genericSlugEs: 'derecho-mercantil',
    genericSlugEn: 'commercial-law',
    nameEs: 'Derecho Mercantil',
    nameEn: 'Commercial Law',
    descriptionEs: 'Constitución de sociedades, contratos mercantiles y litigios empresariales',
    descriptionEn: 'Company formation, commercial contracts and business litigation',
    longDescriptionEs:
      'Asesoramiento mercantil integral en Murcia. Nos ocupamos de la constitución y disolución de sociedades, redacción y revisión de contratos mercantiles, conflictos entre socios, concursos de acreedores, protección de la propiedad industrial e intelectual, y todo tipo de litigios empresariales.',
    longDescriptionEn:
      'Comprehensive commercial law advice in Murcia. We handle company formation and dissolution, drafting and reviewing commercial contracts, shareholder disputes, insolvency proceedings, intellectual and industrial property protection, and all types of business litigation.',
    icon: '💼',
    priority: 3,
    category: 'privado',
    sectionsEs: [
      { title: 'Constitución y gestión de sociedades en Murcia', content: 'Asesoramos en la constitución de sociedades limitadas, anónimas, cooperativas y otras formas jurídicas. Redactamos estatutos sociales, pactos de socios, ampliaciones y reducciones de capital, transformaciones, fusiones y escisiones. Gestionamos la inscripción en el Registro Mercantil de Murcia (Torre "Z" – Av. Teniente Montesinos, 8, 30100 Murcia), donde conocemos los procedimientos y plazos específicos. También gestionamos la disolución y liquidación ordenada de empresas.' },
      { title: 'Conflictos entre socios y gobierno corporativo', content: 'Mediamos y litigamos en conflictos societarios ante los Juzgados de Primera Instancia de Murcia: impugnación de acuerdos sociales, ejercicio de la acción de responsabilidad contra administradores, exclusión y separación de socios, y resolución de bloqueos decisorios. Conocemos la jurisprudencia específica de los tribunales murcianos en materia societaria.' },
      { title: 'Concursos de acreedores e insolvencia', content: 'Asesoramos tanto a deudores como a acreedores en procedimientos concursales ante los Juzgados de lo Mercantil de Murcia. Preparamos solicitudes de concurso voluntario, defendemos créditos en la masa pasiva y negociamos convenios o planes de liquidación. Los procedimientos concursales en Murcia se tramitan en la Ciudad de la Justicia, donde mantenemos una relación profesional fluida con los órganos competentes.' },
    ],
    sectionsEn: [
      { title: 'Company formation and management', content: 'We advise on the formation of limited companies, corporations, cooperatives and other legal forms. We draft articles of association, shareholder agreements, capital increases and reductions.' },
      { title: 'Shareholder disputes and corporate governance', content: 'We mediate and litigate in corporate disputes: challenging corporate resolutions, exercising liability actions against directors, exclusion and separation of shareholders.' },
      { title: 'Insolvency proceedings', content: 'We advise both debtors and creditors in insolvency proceedings. We prepare voluntary insolvency applications, defend credits and negotiate agreements or liquidation plans.' },
    ],
    faqsEs: [
      { question: '¿Cuánto cuesta constituir una sociedad limitada?', answer: 'El coste total de constitución de una SL oscila entre 500€ y 1.200€ incluyendo honorarios de notario, registro y asesoramiento legal. El capital social mínimo es de 1 euro desde la reforma de 2022.' },
      { question: '¿Qué hacer si un socio no cumple con sus obligaciones?', answer: 'Puede ejercitar la acción de exclusión de socio si existe justa causa. También puede impugnar los acuerdos sociales adoptados en contra de la ley o los estatutos.' },
      { question: '¿Cuándo debo solicitar el concurso de acreedores?', answer: 'Debe solicitarlo dentro de los 2 meses siguientes a conocer su situación de insolvencia. No hacerlo a tiempo puede acarrear responsabilidad personal del administrador.' },
    ],
    faqsEn: [
      { question: 'How much does it cost to form a limited company?', answer: 'The total cost of forming an SL ranges from €500 to €1,200 including notary, registry and legal advice fees. The minimum share capital is €1 since the 2022 reform.' },
      { question: 'What to do if a partner doesn\'t fulfill obligations?', answer: 'You can exercise the partner exclusion action if there is just cause. You can also challenge corporate resolutions adopted against the law or bylaws.' },
      { question: 'When should I file for insolvency?', answer: 'You must file within 2 months of becoming aware of your insolvency situation. Failing to do so in time can lead to personal liability for the director.' },
    ],
    processEs: [
      'Consulta empresarial y análisis de necesidades',
      'Asesoramiento sobre la estructura societaria óptima',
      'Redacción de estatutos y pactos de socios',
      'Trámites de constitución ante notario y registro',
      'Seguimiento continuo de la actividad societaria',
      'Representación en litigios mercantiles',
    ],
    processEn: [
      'Business consultation and needs analysis',
      'Advice on optimal corporate structure',
      'Drafting of bylaws and shareholder agreements',
      'Formation procedures before notary and registry',
      'Ongoing monitoring of corporate activity',
      'Representation in commercial litigation',
    ],
  },
  {
    id: 'responsabilidad-civil',
    slugEs: 'abogados-responsabilidad-civil-murcia',
    slugEn: 'civil-liability-insurance-lawyers-murcia',
    genericSlugEs: 'responsabilidad-civil',
    genericSlugEn: 'civil-liability',
    nameEs: 'Responsabilidad Civil y Seguros',
    nameEn: 'Civil Liability & Insurance',
    descriptionEs: 'Reclamaciones por daños, seguros y responsabilidad extracontractual',
    descriptionEn: 'Damage claims, insurance and tort liability',
    longDescriptionEs:
      'Expertos en responsabilidad civil y derecho de seguros en Murcia. Gestionamos reclamaciones por daños y perjuicios, responsabilidad contractual y extracontractual, siniestros de seguros, accidentes laborales, y caídas en la vía pública. Luchamos para que nuestros clientes reciban la indemnización justa.',
    longDescriptionEn:
      'Experts in civil liability and insurance law in Murcia. We handle claims for damages, contractual and non-contractual liability, insurance claims, workplace accidents, and falls on public roads. We fight for our clients to receive fair compensation.',
    icon: '🛡️',
    priority: 1,
    category: 'privado',
    sectionsEs: [
      { title: 'Reclamaciones por daños y perjuicios en Murcia', content: 'Tramitamos reclamaciones por todo tipo de daños ante los Juzgados de Primera Instancia de Murcia: patrimoniales (daño emergente y lucro cesante) y extrapatrimoniales (daño moral). Valoramos cada caso para reclamar la máxima indemnización posible según la jurisprudencia de los tribunales de Murcia. Conocemos los criterios de valoración que aplican los jueces murcianos en estos casos.' },
      { title: 'Siniestros de seguros', content: 'Le representamos frente a las compañías aseguradoras cuando se niegan a pagar o infravaloran un siniestro. Ya sea un seguro de hogar, comercio, vida, responsabilidad civil o cualquier otra póliza, defendemos sus derechos como asegurado. Si es necesario, interponemos demandas ante los tribunales de Murcia para obtener la indemnización justa.' },
      { title: 'Caídas y accidentes en la vía pública de Murcia', content: 'Si ha sufrido una caída en la vía pública de Murcia por el mal estado del pavimento, mobiliario urbano defectuoso u otras causas imputables al Ayuntamiento, tiene derecho a una indemnización por responsabilidad patrimonial de la Administración. Tramitamos estas reclamaciones ante el Ayuntamiento de Murcia a través de su Sede Electrónica (sede.murcia.es) o presencialmente. El plazo para reclamar es de 1 año desde los hechos. Si el Ayuntamiento no responde favorablemente, interponemos recurso contencioso-administrativo ante el Tribunal Superior de Justicia de la Región de Murcia.' },
    ],
    sectionsEn: [
      { title: 'Damage claims', content: 'We process claims for all types of damages: patrimonial and non-patrimonial. We assess each case to claim the maximum possible compensation.' },
      { title: 'Insurance claims', content: 'We represent you against insurance companies when they refuse to pay or undervalue a claim.' },
      { title: 'Falls and accidents on public roads', content: 'If you have suffered a fall on public roads due to poor pavement condition, you are entitled to compensation.' },
    ],
    faqsEs: [
      { question: '¿Cuánto tiempo tengo para reclamar por daños y perjuicios?', answer: 'El plazo general es de 1 año para responsabilidad extracontractual y 5 años para responsabilidad contractual. Actúe cuanto antes para no perder sus derechos.' },
      { question: '¿Puedo reclamar si mi aseguradora no quiere pagar?', answer: 'Sí, si su aseguradora rechaza el siniestro o le ofrece una cantidad inferior a la real, puede reclamar judicialmente. Además, si hay mala fe, la aseguradora puede ser condenada a pagar intereses del 20%.' },
    ],
    faqsEn: [
      { question: 'How long do I have to claim for damages?', answer: 'The general period is 1 year for tort liability and 5 years for contractual liability. Act as soon as possible to preserve your rights.' },
      { question: 'Can I claim if my insurer refuses to pay?', answer: 'Yes, if your insurer rejects the claim or offers less than the real amount, you can take legal action.' },
    ],
    processEs: [
      'Evaluación inicial de su reclamación',
      'Recopilación de pruebas y peritajes',
      'Reclamación extrajudicial al responsable o aseguradora',
      'Demanda judicial si no hay acuerdo',
      'Juicio y sentencia',
      'Cobro de la indemnización',
    ],
    processEn: [
      'Free evaluation of your claim',
      'Evidence collection and expert reports',
      'Extrajudicial claim to the responsible party or insurer',
      'Lawsuit if there is no agreement',
      'Trial and judgment',
      'Collection of compensation',
    ],
  },
  {
    id: 'obligaciones-contratos',
    slugEs: 'abogados-obligaciones-contratos-murcia',
    slugEn: 'contracts-obligations-lawyers-murcia',
    genericSlugEs: 'obligaciones-contratos',
    genericSlugEn: 'obligations-contracts',
    nameEs: 'Obligaciones y Contratos',
    nameEn: 'Obligations & Contracts',
    descriptionEs: 'Redacción, revisión e incumplimiento de contratos',
    descriptionEn: 'Contract drafting, review and breach of contract',
    longDescriptionEs:
      'Asesoramiento legal en obligaciones y contratos en Murcia. Redactamos, revisamos y negociamos todo tipo de contratos civiles y mercantiles. Actuamos en caso de incumplimiento contractual, resolución de contratos, reclamación de deudas e indemnización por daños derivados del incumplimiento.',
    longDescriptionEn:
      'Legal advice on obligations and contracts in Murcia. We draft, review and negotiate all types of civil and commercial contracts. We act in cases of breach of contract, contract termination, debt collection and compensation for damages arising from non-compliance.',
    icon: '📋',
    priority: 2,
    category: 'privado',
    sectionsEs: [
      { title: 'Redacción y revisión de contratos en Murcia', content: 'Redactamos contratos a medida que protejan sus intereses: contratos de prestación de servicios, compraventa, préstamo, distribución, franquicia, confidencialidad y cualquier otra modalidad. También revisamos contratos antes de su firma para detectar cláusulas perjudiciales. Si surge un conflicto, actuamos ante los Juzgados de Primera Instancia de Murcia ubicados en la Ciudad de la Justicia (Avda. Ciudad de la Justicia, s/n, 30011 Murcia), donde conocemos los procedimientos y plazos específicos.' },
      { title: 'Incumplimiento contractual y reclamación de deudas', content: 'Si la otra parte no cumple con lo pactado, le asesoramos sobre sus opciones: requerir el cumplimiento forzoso, resolver el contrato o reclamar una indemnización por daños y perjuicios. Tramitamos procedimientos monitorios (para deudas documentadas superiores a 2.000€) y procedimientos ordinarios ante los Juzgados de Primera Instancia de Murcia para el cobro de deudas. Conocemos los criterios que aplican los jueces murcianos en estos casos, lo que nos permite preparar las demandas de forma más efectiva.' },
    ],
    sectionsEn: [
      { title: 'Contract drafting and review', content: 'We draft customized contracts that protect your interests: service agreements, sales, loans, distribution, franchise, confidentiality and any other type.' },
      { title: 'Breach of contract and debt collection', content: 'If the other party fails to comply, we advise on your options: demand specific performance, terminate the contract or claim compensation for damages.' },
    ],
    faqsEs: [
      { question: '¿Qué puedo hacer si me deben dinero y no me pagan?', answer: 'Puede iniciar un procedimiento monitorio (para deudas documentadas) que es rápido y económico. Si la deuda es superior a 250.000€ o está en disputa, hay que acudir al procedimiento ordinario.' },
      { question: '¿Es válido un contrato verbal?', answer: 'Sí, los contratos verbales son válidos en España, pero son difíciles de probar. Siempre recomendamos formalizar los acuerdos por escrito para evitar problemas.' },
    ],
    faqsEn: [
      { question: 'What can I do if someone owes me money and won\'t pay?', answer: 'You can initiate a payment order procedure (for documented debts) which is fast and affordable.' },
      { question: 'Is a verbal contract valid?', answer: 'Yes, verbal contracts are valid in Spain, but they are difficult to prove. We always recommend formalizing agreements in writing.' },
    ],
    processEs: [
      'Consulta sobre su situación contractual',
      'Análisis de la documentación existente',
      'Redacción o revisión del contrato',
      'Negociación con la otra parte',
      'Reclamación extrajudicial si hay incumplimiento',
      'Demanda judicial si es necesario',
    ],
    processEn: [
      'Consultation about your contractual situation',
      'Analysis of existing documentation',
      'Contract drafting or review',
      'Negotiation with the other party',
      'Extrajudicial claim if there is breach',
      'Lawsuit if necessary',
    ],
  },
  {
    id: 'mediacion',
    slugEs: 'abogados-mediacion-murcia',
    slugEn: 'mediation-lawyers-murcia',
    genericSlugEs: 'mediacion',
    genericSlugEn: 'mediation',
    nameEs: 'Mediación Civil y Mercantil',
    nameEn: 'Civil & Commercial Mediation',
    descriptionEs: 'Resolución alternativa de conflictos y arbitraje',
    descriptionEn: 'Alternative dispute resolution and arbitration',
    longDescriptionEs:
      'Servicios de mediación civil y mercantil en Murcia. Ofrecemos vías alternativas de resolución de conflictos que permiten alcanzar acuerdos satisfactorios para ambas partes de forma más rápida y económica que la vía judicial. Mediadores acreditados por el Ministerio de Justicia.',
    longDescriptionEn:
      'Civil and commercial mediation services in Murcia. We offer alternative dispute resolution methods that enable satisfactory agreements for both parties more quickly and economically than through the courts. Mediators accredited by the Ministry of Justice.',
    icon: '🤝',
    priority: 4,
    category: 'privado',
    sectionsEs: [
      { title: 'Ventajas de la mediación frente al juicio en Murcia', content: 'La mediación permite resolver conflictos en semanas en lugar de los meses o años que tarda un juicio. Es confidencial, voluntaria y mucho más económica. Además, el acuerdo alcanzado en mediación tiene la misma fuerza ejecutiva que una sentencia judicial una vez elevado a escritura pública. En Murcia puede acudir al Centro de Mediación de la Región de Murcia (C/ Nueva Nº 22, 1ºB, Murcia, teléfono 968 449 275) o a otros centros acreditados. La mediación es obligatoria como Medio Adecuado de Solución de Conflictos (MASC) antes de presentar demanda civil en muchos casos.' },
      { title: 'Mediación familiar, vecinal y empresarial', content: 'Mediamos en conflictos de herencias, divorcios, relaciones vecinales, disputas entre socios, reclamaciones de cantidad y cualquier conflicto civil o mercantil susceptible de acuerdo. Los juzgados de Murcia valoran positivamente la mediación previa, lo que puede agilizar los procedimientos judiciales si finalmente es necesario acudir a los tribunales. El coste inicial de apertura de expediente en el Centro de Mediación de Murcia es de 100€.' },
    ],
    sectionsEn: [
      { title: 'Advantages of mediation over trial', content: 'Mediation allows resolving conflicts in weeks instead of the months or years a trial takes. It is confidential, voluntary and much more affordable.' },
      { title: 'Family, neighborhood and business mediation', content: 'We mediate in inheritance conflicts, divorces, neighborhood relations, partner disputes and any civil or commercial conflict.' },
    ],
    faqsEs: [
      { question: '¿Es obligatoria la mediación?', answer: 'No, la mediación es voluntaria. Sin embargo, algunos juzgados la recomiendan como paso previo al juicio y puede ser valorada positivamente por el tribunal.' },
      { question: '¿El acuerdo de mediación es vinculante?', answer: 'Sí, una vez firmado y elevado a escritura pública, el acuerdo de mediación tiene la misma fuerza ejecutiva que una sentencia judicial.' },
    ],
    faqsEn: [
      { question: 'Is mediation mandatory?', answer: 'No, mediation is voluntary. However, some courts recommend it as a step prior to trial and it can be valued positively by the tribunal.' },
      { question: 'Is the mediation agreement binding?', answer: 'Yes, once signed and notarized, the mediation agreement has the same enforceability as a court judgment.' },
    ],
    processEs: [
      'Sesión informativa inicial',
      'Aceptación voluntaria de las partes',
      'Sesiones de mediación (presenciales u online)',
      'Negociación asistida por el mediador',
      'Redacción del acuerdo de mediación',
      'Elevación a escritura pública si procede',
    ],
    processEn: [
      'Free informational session',
      'Voluntary acceptance by the parties',
      'Mediation sessions (in-person or online)',
      'Mediator-assisted negotiation',
      'Drafting of the mediation agreement',
      'Notarization if applicable',
    ],
  },
  {
    id: 'extranjeria',
    slugEs: 'abogados-extranjeria-murcia',
    slugEn: 'immigration-lawyers-murcia',
    genericSlugEs: 'extranjeria',
    genericSlugEn: 'immigration',
    nameEs: 'Extranjería e Inmigración',
    nameEn: 'Immigration Law',
    descriptionEs: 'Permisos de residencia, trabajo, nacionalidad y visados',
    descriptionEn: 'Residence permits, work permits, nationality and visas',
    longDescriptionEs:
      'Abogados de extranjería en Murcia. Tramitamos permisos de residencia y trabajo, reagrupación familiar, solicitudes de nacionalidad española, visados, recursos contra denegaciones, y regularización de situaciones administrativas irregulares. Atención personalizada en varios idiomas.',
    longDescriptionEn:
      'Immigration lawyers in Murcia. We process residence and work permits, family reunification, Spanish nationality applications, visas, appeals against denials, and regularization of irregular administrative situations. Personalized attention in several languages.',
    icon: '🌍',
    priority: 1,
    category: 'publico',
    sectionsEs: [
      { title: 'Permisos de residencia y trabajo en Murcia', content: 'Tramitamos todas las modalidades de autorización de residencia ante la Oficina de Extranjería de la Delegación del Gobierno en Murcia (Calle Francisco Alfonso Hidalgo Martínez, Km.388, N-301. Cabezo Cortado-Espinardo, 38, 30100 Murcia, teléfono 968 989 600): residencia no lucrativa, arraigo social, laboral y familiar, residencia por inversión (Golden Visa), autorizaciones de trabajo por cuenta ajena y propia. Le guiamos en cada paso del proceso administrativo y gestionamos la solicitud de cita previa (citaprevia.murcia@correo.gob.es).' },
      { title: 'Nacionalidad española', content: 'Le asesoramos y acompañamos en todo el proceso de obtención de la nacionalidad española: por residencia (10 años, 5 años, 2 años o 1 año según el caso), por matrimonio o por carta de naturaleza. Preparamos su expediente y le representamos ante el Registro Civil Único de Murcia (Avda. Ciudad de la Justicia, s/n, 30011 Murcia, teléfono 968 83 90 30). Conocemos los procedimientos específicos y los plazos de resolución en Murcia.' },
      { title: 'Recursos contra denegaciones', content: 'Si le han denegado un permiso de residencia, trabajo o nacionalidad, interponemos recursos de alzada, reposición o contencioso-administrativos ante los tribunales de Murcia para defender sus derechos. Nuestra tasa de éxito en recursos de extranjería es alta gracias a un conocimiento exhaustivo de la normativa y de los criterios que aplican los órganos administrativos y judiciales de Murcia.' },
    ],
    sectionsEn: [
      { title: 'Residence and work permits', content: 'We process all types of residence authorizations: non-lucrative residence, social/labor/family ties, investor residence (Golden Visa), and employed/self-employed work authorizations.' },
      { title: 'Spanish nationality', content: 'We advise and accompany you through the entire process of obtaining Spanish nationality: by residence, marriage or naturalization letter.' },
      { title: 'Appeals against denials', content: 'If your residence, work or nationality permit has been denied, we file administrative or contentious-administrative appeals to defend your rights.' },
    ],
    faqsEs: [
      { question: '¿Cuánto tarda un permiso de residencia?', answer: 'El plazo legal de resolución es de 3 meses, pero en la práctica puede tardar entre 3 y 8 meses según la oficina de extranjería y el tipo de permiso solicitado.' },
      { question: '¿Puedo trabajar mientras espero mi permiso?', answer: 'Depende del tipo de autorización solicitada. Con algunas figuras como el arraigo social, puede trabajar desde que se concede la autorización. Le asesoramos sobre su caso particular.' },
      { question: '¿Necesito abogado para pedir la nacionalidad española?', answer: 'No es obligatorio, pero es muy recomendable. Un abogado especialista prepara la documentación correctamente, evita errores que causan denegaciones y le representa si hay que recurrir.' },
    ],
    faqsEn: [
      { question: 'How long does a residence permit take?', answer: 'The legal resolution period is 3 months, but in practice it can take between 3 and 8 months depending on the immigration office.' },
      { question: 'Can I work while waiting for my permit?', answer: 'It depends on the type of authorization requested. With some figures like social ties, you can work once the authorization is granted.' },
      { question: 'Do I need a lawyer for Spanish nationality?', answer: 'Not mandatory, but highly recommended. A specialist lawyer prepares documentation correctly and avoids errors that cause denials.' },
    ],
    processEs: [
      'Consulta inicial y evaluación de su situación migratoria',
      'Recopilación y preparación de la documentación',
      'Presentación de la solicitud ante la Administración',
      'Seguimiento del expediente administrativo',
      'Resolución y obtención del permiso/nacionalidad',
      'Recurso en caso de denegación',
    ],
    processEn: [
      'Initial consultation and evaluation of your immigration situation',
      'Document collection and preparation',
      'Filing the application with the Administration',
      'Follow-up of the administrative file',
      'Resolution and obtaining the permit/nationality',
      'Appeal in case of denial',
    ],
  },
  {
    id: 'derecho-administrativo',
    slugEs: 'abogados-derecho-administrativo-murcia',
    slugEn: 'administrative-law-lawyers-murcia',
    genericSlugEs: 'derecho-administrativo',
    genericSlugEn: 'administrative-law',
    nameEs: 'Derecho Administrativo',
    nameEn: 'Administrative Law',
    descriptionEs: 'Recursos administrativos, contencioso-administrativo y urbanismo',
    descriptionEn: 'Administrative appeals, administrative litigation and urban planning',
    longDescriptionEs:
      'Expertos en derecho administrativo en Murcia. Interponemos recursos administrativos y contencioso-administrativos, gestionamos expedientes de responsabilidad patrimonial de la administración, urbanismo, medio ambiente, contratación pública y sanciones administrativas.',
    longDescriptionEn:
      'Experts in administrative law in Murcia. We file administrative and contentious-administrative appeals, manage government liability cases, urban planning, environmental law, public procurement and administrative sanctions.',
    icon: '🏛️',
    priority: 4,
    category: 'publico',
    sectionsEs: [
      { title: 'Recursos administrativos y contencioso-administrativos en Murcia', content: 'Interponemos recursos de alzada, reposición y contencioso-administrativos ante los tribunales de Murcia contra cualquier acto de la Administración que vulnere sus derechos: sanciones, denegaciones de licencias, expropiaciones, liquidaciones tributarias y resoluciones desfavorables de cualquier organismo público. Los recursos contencioso-administrativos se tramitan ante la Sala de lo Contencioso-Administrativo del Tribunal Superior de Justicia de la Región de Murcia, ubicado en el Palacio de Justicia (Ronda de Garay, 7, 30003 Murcia).' },
      { title: 'Responsabilidad patrimonial del Ayuntamiento de Murcia', content: 'Si ha sufrido daños por el funcionamiento de un servicio público (hospitales, carreteras, instalaciones municipales), tiene derecho a una indemnización. Tramitamos reclamaciones de responsabilidad patrimonial frente al Ayuntamiento de Murcia a través de su Sede Electrónica (sede.murcia.es) o presencialmente. El plazo para reclamar es de 1 año desde los hechos o desde la determinación del alcance de las secuelas. También gestionamos reclamaciones frente a la Comunidad Autónoma de la Región de Murcia y la Administración del Estado.' },
    ],
    sectionsEn: [
      { title: 'Administrative and contentious-administrative appeals', content: 'We file appeals against any act of the Administration that violates your rights: sanctions, license denials, expropriations, tax assessments and unfavorable resolutions.' },
      { title: 'Government liability', content: 'If you have suffered damages from the operation of a public service, you are entitled to compensation. We process claims against municipalities, regional governments and the State.' },
    ],
    faqsEs: [
      { question: '¿Cuánto tiempo tengo para recurrir una sanción administrativa?', answer: 'El plazo para interponer recurso de alzada es de 1 mes desde la notificación. Para el recurso contencioso-administrativo, el plazo es de 2 meses. No deje pasar estos plazos.' },
      { question: '¿Puedo reclamar al Ayuntamiento por una caída en la calle?', answer: 'Sí, si la caída se debe al mal estado del pavimento o del mobiliario urbano, puede presentar una reclamación de responsabilidad patrimonial ante el Ayuntamiento. El plazo es de 1 año.' },
    ],
    faqsEn: [
      { question: 'How long do I have to appeal an administrative sanction?', answer: 'The period for filing an administrative appeal is 1 month from notification. For a contentious-administrative appeal, the period is 2 months.' },
      { question: 'Can I claim from the City Council for a fall in the street?', answer: 'Yes, if the fall is due to poor pavement or urban furniture condition, you can file a government liability claim. The period is 1 year.' },
    ],
    processEs: [
      'Análisis de la resolución administrativa',
      'Estudio de viabilidad del recurso',
      'Interposición del recurso administrativo',
      'Recurso contencioso-administrativo si es necesario',
      'Representación ante el tribunal',
      'Ejecución de la sentencia favorable',
    ],
    processEn: [
      'Analysis of the administrative resolution',
      'Feasibility study of the appeal',
      'Filing of the administrative appeal',
      'Contentious-administrative appeal if necessary',
      'Representation before the court',
      'Enforcement of the favorable judgment',
    ],
  },
  {
    id: 'defensa-fondos-buitre',
    slugEs: 'abogados-defensa-fondos-buitre-murcia',
    slugEn: 'vulture-fund-defense-lawyers-murcia',
    genericSlugEs: 'defensa-fondos-buitre',
    genericSlugEn: 'vulture-fund-defense',
    nameEs: 'Defensa frente a Fondos Buitre',
    nameEn: 'Vulture Fund Defense',
    descriptionEs: 'Protección legal para inquilinos frente a fondos buitre, acoso inmobiliario y desahucios abusivos',
    descriptionEn: 'Legal protection for tenants against vulture funds, real estate harassment and abusive evictions',
    longDescriptionEs:
      'Abogados especializados en la defensa de inquilinos frente a fondos buitre en Murcia. Los fondos buitre son entidades de inversión que compran propiedades a precios reducidos y presionan a los inquilinos mediante acoso inmobiliario, negativa a renovar contratos o desahucios abusivos. Le ayudamos a defender sus derechos como inquilino, proteger su vivienda y combatir prácticas de acoso inmobiliario. Conocemos la nueva Ley de Vivienda que refuerza la protección de los inquilinos y los recursos legales disponibles ante los tribunales de Murcia.',
    longDescriptionEn:
      'Lawyers specialized in defending tenants against vulture funds in Murcia. Vulture funds are investment entities that buy properties at reduced prices and pressure tenants through real estate harassment, refusal to renew contracts or abusive evictions. We help you defend your rights as a tenant, protect your home and combat real estate harassment practices.',
    icon: '🛡️',
    priority: 4,
    category: 'privado',
    sectionsEs: [
      {
        title: '¿Qué son los fondos buitre y cómo operan?',
        content: 'Los fondos buitre son entidades de inversión (como Blackstone, Cerberus, Lone Star o Apollo) que compran propiedades e hipotecas a precios muy reducidos (entre 30% y 70% por debajo del valor de mercado), frecuentemente adquiridas de bancos. Su objetivo es obtener altas rentabilidades a corto plazo desalojando inquilinos, reformando las propiedades y vendiéndolas o convirtiéndolas en pisos turísticos. En Murcia, estos fondos han adquirido numerosas propiedades tras la crisis inmobiliaria y buscan maximizar beneficios presionando a los inquilinos para que abandonen sus viviendas.',
      },
      {
        title: 'Acoso inmobiliario: tácticas de presión documentadas',
        content: 'Los fondos buitre utilizan tácticas de "acoso inmobiliario" para crear condiciones de vida insostenibles sin necesidad de procedimientos de desahucio formales: obras intensas y permanentes con ruido continuado en horarios sensibles, deterioro deliberado de elementos esenciales (ascensores averiados, filtraciones, goteras), amenazas de desahucio e indemnizaciones para convencer a inquilinos de marcharse, y presión continuada en el tiempo. En 2025, el Juzgado de Instrucción número 17 de Madrid admitió la primera querella colectiva por acoso inmobiliario contra una Socimi, estableciendo un precedente importante. En Murcia, podemos denunciar estas prácticas ante los Juzgados de Instrucción correspondientes.',
      },
      {
        title: 'Protección legal del inquilino: nueva Ley de Vivienda',
        content: 'La Ley 12/2023 ha reforzado significativamente la posición del inquilino frente a fondos buitre: los contratos se prorrogan automáticamente 5 años (o 7 si el arrendador es persona jurídica), las subidas de renta están limitadas al IPC o IRAV, el comprador debe respetar el contrato vigente aunque no esté inscrito, y existen prórrogas extraordinarias de hasta 3 años en zonas de mercado tensionado. En García-Valcárcel & Cáceres conocemos perfectamente esta normativa y la aplicamos para proteger sus derechos ante los tribunales de Murcia.',
      },
      {
        title: 'Recursos legales frente a desahucios de fondos buitre',
        content: 'Si un fondo buitre inicia un proceso de desahucio contra usted, tiene múltiples recursos legales: puede interponer recursos durante el procedimiento conforme permite la Ley Procesal, consignar rentas arrendaticias como mecanismo de defensa, alegar irregularidades en la cesión del préstamo o en la compra de la propiedad, y denunciar acoso inmobiliario si ha sufrido presión. Los juzgados de Murcia están cada vez más sensibilizados con esta problemática. También podemos negociar soluciones alternativas como la compra de la vivienda mediante derecho de tanteo o acuerdos de desalojo con indemnización justa.',
      },
    ],
    sectionsEn: [
      {
        title: 'What are vulture funds and how do they operate?',
        content: 'Vulture funds are investment entities (such as Blackstone, Cerberus, Lone Star or Apollo) that buy properties and mortgages at very reduced prices (30% to 70% below market value), often acquired from banks. Their objective is to obtain high short-term returns by evicting tenants, renovating properties and selling them or converting them into tourist apartments.',
      },
      {
        title: 'Real estate harassment: documented pressure tactics',
        content: 'Vulture funds use "real estate harassment" tactics to create unsustainable living conditions without formal eviction procedures: intense and permanent construction work with continuous noise at sensitive hours, deliberate deterioration of essential elements, threats of eviction and compensation to convince tenants to leave.',
      },
      {
        title: 'Legal protection for tenants: new Housing Law',
        content: 'Law 12/2023 has significantly strengthened the tenant\'s position against vulture funds: contracts are automatically extended for 5 years (or 7 if the landlord is a legal entity), rent increases are limited to CPI or IRAV, and the buyer must respect the current contract even if not registered.',
      },
      {
        title: 'Legal resources against vulture fund evictions',
        content: 'If a vulture fund initiates an eviction process against you, you have multiple legal resources: you can file appeals during the procedure, consign rental payments as a defense mechanism, allege irregularities in the loan assignment or property purchase, and report real estate harassment if you have suffered pressure.',
      },
    ],
    faqsEs: [
      { question: '¿Qué puedo hacer si un fondo buitre compra mi vivienda y me presiona para que me vaya?', answer: 'Tiene varios recursos legales. En primer lugar, la nueva Ley de Vivienda establece que el nuevo propietario debe respetar su contrato vigente. Si sufre acoso inmobiliario (obras, ruido, deterioro deliberado), puede denunciarlo ante los Juzgados de Instrucción de Murcia. También puede consignar las rentas si hay conflicto y ejercer su derecho a prórroga del contrato. Nuestro despacho le asesora sobre la mejor estrategia según su caso.' },
      { question: '¿Puedo renovar mi contrato aunque el fondo buitre no quiera?', answer: 'Sí. La Ley 12/2023 establece prórrogas obligatorias de 5 años (o 7 si el arrendador es persona jurídica como los fondos buitre). Además, existen prórrogas extraordinarias de hasta 3 años en zonas de mercado tensionado. El propietario no puede negarse a estas prórrogas sin causa justificada. En Murcia, podemos ayudarle a ejercer estos derechos ante los tribunales.' },
      { question: '¿Qué es el acoso inmobiliario y cómo se denuncia?', answer: 'El acoso inmobiliario son prácticas destinadas a hacer la vida insostenible al inquilino para que abandone voluntariamente: obras continuadas, ruido, deterioro deliberado de servicios, amenazas. En 2025 se admitió la primera querella colectiva por acoso inmobiliario en Madrid, estableciendo un precedente. En Murcia, puede denunciarlo ante los Juzgados de Instrucción, y los responsables pueden enfrentar penas de prisión y disolución de la entidad.' },
      { question: '¿Cuánto cuesta defenderse de un fondo buitre?', answer: 'En García-Valcárcel & Cáceres los honorarios se pactan de forma transparente. En muchos casos, trabajamos con tarifas ajustadas para inquilinos que se enfrentan a situaciones de vulnerabilidad. También podemos trabajar a resultado en casos de reclamación de indemnizaciones por acoso inmobiliario.' },
      { question: '¿Puedo comprar la vivienda antes que el fondo buitre?', answer: 'Sí, existe el derecho de tanteo y retracto que permite a los inquilinos que habitan la vivienda comprarla antes que terceros. Sin embargo, este derecho debe ejercerse correctamente y en tiempo. Le asesoramos sobre cómo ejercer este derecho y negociar con el fondo buitre o el banco vendedor para adquirir la propiedad en condiciones justas.' },
    ],
    faqsEn: [
      { question: 'What can I do if a vulture fund buys my home and pressures me to leave?', answer: 'You have several legal resources. First, the new Housing Law establishes that the new owner must respect your current contract. If you suffer real estate harassment, you can report it to the courts. You can also consign rents if there is a conflict and exercise your right to contract extension.' },
      { question: 'Can I renew my contract even if the vulture fund doesn\'t want to?', answer: 'Yes. Law 12/2023 establishes mandatory extensions of 5 years (or 7 if the landlord is a legal entity like vulture funds). In addition, there are extraordinary extensions of up to 3 years in stressed market areas. The owner cannot refuse these extensions without justified cause.' },
      { question: 'What is real estate harassment and how is it reported?', answer: 'Real estate harassment are practices aimed at making life unsustainable for the tenant so they leave voluntarily: continuous construction, noise, deliberate deterioration of services, threats. In 2025, the first collective complaint for real estate harassment was admitted in Madrid, establishing a precedent.' },
      { question: 'How much does it cost to defend against a vulture fund?', answer: 'At García-Valcárcel & Cáceres we offer a free initial consultation to evaluate your case. Fees are agreed transparently and, in many cases, we work with adjusted rates for tenants facing vulnerability situations.' },
      { question: 'Can I buy the property before the vulture fund?', answer: 'Yes, there is the right of first refusal that allows tenants who inhabit the property to buy it before third parties. However, this right must be exercised correctly and on time. We advise you on how to exercise this right and negotiate with the vulture fund or selling bank.' },
    ],
    processEs: [
      'Contacto inicial: evaluamos su situación y el tipo de presión que sufre',
      'Análisis de su contrato de arrendamiento y derechos como inquilino',
      'Estrategia de defensa: recursos legales, denuncia de acoso o negociación',
      'Ejercicio de derechos: prórrogas, consignación de rentas, recursos procesales',
      'Denuncia de acoso inmobiliario si procede ante los Juzgados de Instrucción',
      'Negociación de soluciones alternativas o defensa en juicio si es necesario',
    ],
    processEn: [
      'Initial contact: we evaluate your situation and type of pressure you are suffering',
      'Analysis of your lease contract and rights as a tenant',
      'Defense strategy: legal resources, harassment complaint or negotiation',
      'Exercise of rights: extensions, rent consignment, procedural appeals',
      'Report of real estate harassment if applicable before the Investigation Courts',
      'Negotiation of alternative solutions or defense in trial if necessary',
    ],
  },
  {
    id: 'negligencias-medicas',
    slugEs: 'abogados-negligencias-medicas-murcia',
    slugEn: 'medical-malpractice-lawyers-murcia',
    genericSlugEs: 'negligencias-medicas',
    genericSlugEn: 'medical-malpractice',
    nameEs: 'Negligencias Médicas',
    nameEn: 'Medical Malpractice',
    descriptionEs: 'Reclamaciones por errores médicos, responsabilidad sanitaria e indemnizaciones',
    descriptionEn: 'Claims for medical errors, healthcare liability and compensation',
    longDescriptionEs:
      'Abogados especializados en negligencias médicas en Murcia. Reclamamos por errores de diagnóstico, fallos quirúrgicos, infecciones hospitalarias, consentimiento informado y cualquier tipo de mala praxis sanitaria ante el Servicio Murciano de Salud (SMS) y los tribunales competentes. Si el daño ocurrió fuera de Murcia, el producto nacional es GVC Expertos (gvcexpertos.com).',
    longDescriptionEn:
      'Lawyers specialized in medical malpractice in Murcia. We claim for diagnostic errors, surgical failures, hospital infections, informed consent and any type of healthcare malpractice. If the harm occurred outside Murcia, the national product is GVC Expertos (gvcexpertos.com).',
    icon: '🏥',
    priority: 5,
    category: 'privado',
    sectionsEs: [
      {
        title: 'Tipos de negligencias médicas que reclamamos en Murcia',
        content: 'Tramitamos reclamaciones por todo tipo de negligencias médicas ante el Servicio Murciano de Salud (SMS): errores de diagnóstico preoperatorios, complicaciones quirúrgicas con daños neurológicos, deficiencias técnicas en intervenciones, dejar cuerpos extraños durante operaciones, negligencia en atención de urgencias, infecciones hospitalarias y falta de consentimiento informado adecuado. Los casos se resuelven mediante dictámenes del Consejo Jurídico de la Región de Murcia y, si es necesario, ante los tribunales competentes.',
      },
      {
        title: 'Reclamación de responsabilidad patrimonial sanitaria',
        content: 'Las reclamaciones por negligencias médicas en Murcia se tramitan como responsabilidad patrimonial de la Administración ante el Servicio Murciano de Salud. El SMS admite las reclamaciones a trámite y las remite a su correduría de seguros para comunicación a la compañía aseguradora correspondiente. El plazo para reclamar es de 1 año desde el conocimiento de los hechos o desde la determinación del alcance de las secuelas. Las indemnizaciones varían según la gravedad: desde 3.000€ en casos leves hasta más de 50.000€ en casos graves.',
      },
      {
        title: 'Hospitales y centros sanitarios de Murcia',
        content: 'Trabajamos con casos de negligencias médicas ocurridas en todos los hospitales y centros sanitarios de la Región de Murcia: Hospital Universitario Virgen de la Arrixaca, Hospital General Universitario Reina Sofía, Hospital Morales Meseguer, Hospital HLA La Vega, Hospital de Molina, Hospital de Caravaca, y centros de salud de toda la región. Conocemos los procedimientos específicos de reclamación ante el SMS y los criterios que aplica el Consejo Jurídico de la Región de Murcia en estos casos.',
      },
    ],
    sectionsEn: [
      {
        title: 'Types of medical malpractice we claim in Murcia',
        content: 'We process claims for all types of medical malpractice before the Murcian Health Service (SMS): preoperative diagnostic errors, surgical complications with neurological damage, technical deficiencies in interventions, leaving foreign bodies during operations, negligence in emergency care, hospital infections and lack of adequate informed consent.',
      },
      {
        title: 'Healthcare liability claims',
        content: 'Medical malpractice claims in Murcia are processed as government liability before the Murcian Health Service. The SMS admits claims and refers them to its insurance brokerage for communication to the corresponding insurance company. The period to claim is 1 year from knowledge of the facts or from determination of the scope of sequelae.',
      },
      {
        title: 'Hospitals and healthcare centers in Murcia',
        content: 'We work with medical malpractice cases occurring in all hospitals and healthcare centers in the Region of Murcia: Virgen de la Arrixaca University Hospital, Reina Sofía General University Hospital, Morales Meseguer Hospital, HLA La Vega Hospital, Molina Hospital, Caravaca Hospital, and health centers throughout the region.',
      },
    ],
    faqsEs: [
      { question: '¿Cuánto tiempo tengo para reclamar por una negligencia médica en Murcia?', answer: 'El plazo para reclamar responsabilidad patrimonial ante el Servicio Murciano de Salud es de 1 año desde el conocimiento de los hechos o desde la determinación del alcance de las secuelas. Es importante actuar cuanto antes para preservar las pruebas médicas y documentación necesaria.' },
      { question: '¿Qué indemnización puedo recibir por una negligencia médica?', answer: 'Las indemnizaciones varían según la gravedad de la negligencia y las secuelas. En Murcia, los casos documentados oscilan entre 3.000€ en casos leves hasta más de 50.000€ en casos graves con daños neurológicos permanentes o complicaciones severas. El Consejo Jurídico de la Región de Murcia valora cada caso según su gravedad y las secuelas permanentes.' },
      { question: '¿Cómo se tramita una reclamación por negligencia médica en Murcia?', answer: 'La reclamación se presenta ante el Servicio Murciano de Salud, que la admite a trámite y la remite a su correduría de seguros. El SMS evalúa el caso y emite un dictamen a través del Consejo Jurídico de la Región de Murcia. Si la reclamación no es aceptada o la indemnización ofrecida es insuficiente, puede interponerse recurso contencioso-administrativo ante los tribunales.' },
      { question: '¿Qué hospitales de Murcia cubren las reclamaciones?', answer: 'Tramitamos reclamaciones por negligencias médicas ocurridas en todos los hospitales y centros sanitarios de la Región de Murcia: Hospital Universitario Virgen de la Arrixaca, Hospital General Universitario Reina Sofía, Hospital Morales Meseguer, Hospital HLA La Vega, Hospital de Molina, Hospital de Caravaca, y todos los centros de salud públicos y privados de la región.' },
    ],
    faqsEn: [
      { question: 'How long do I have to claim for medical malpractice in Murcia?', answer: 'The period to claim government liability before the Murcian Health Service is 1 year from knowledge of the facts or from determination of the scope of sequelae. It is important to act as soon as possible to preserve medical evidence and necessary documentation.' },
      { question: 'What compensation can I receive for medical malpractice?', answer: 'Compensation varies according to the severity of the malpractice and sequelae. In Murcia, documented cases range from €3,000 in mild cases to over €50,000 in serious cases with permanent neurological damage or severe complications.' },
      { question: 'How is a medical malpractice claim processed in Murcia?', answer: 'The claim is filed with the Murcian Health Service, which admits it for processing and refers it to its insurance brokerage. The SMS evaluates the case and issues an opinion through the Legal Council of the Region of Murcia. If the claim is not accepted or the offered compensation is insufficient, a contentious-administrative appeal can be filed before the courts.' },
      { question: 'Which hospitals in Murcia do the claims cover?', answer: 'We process claims for medical malpractice occurring in all hospitals and healthcare centers in the Region of Murcia: Virgen de la Arrixaca University Hospital, Reina Sofía General University Hospital, Morales Meseguer Hospital, HLA La Vega Hospital, Molina Hospital, Caravaca Hospital, and all public and private health centers in the region.' },
    ],
    processEs: [
      'Contacto inicial: evaluamos su caso de negligencia médica',
      'Recopilación de documentación médica e informes periciales',
      'Reclamación ante el Servicio Murciano de Salud (SMS)',
      'Seguimiento del dictamen del Consejo Jurídico de la Región de Murcia',
      'Negociación de la indemnización con la aseguradora del SMS',
      'Recurso contencioso-administrativo si la indemnización es insuficiente',
    ],
    processEn: [
      'Initial contact: we evaluate your medical malpractice case',
      'Collection of medical documentation and expert reports',
      'Claim before the Murcian Health Service (SMS)',
      'Follow-up of the opinion of the Legal Council of the Region of Murcia',
      'Negotiation of compensation with the SMS insurer',
      'Contentious-administrative appeal if compensation is insufficient',
    ],
  },
];

const ACTIVE_SERVICE_IDS = [
  'accidentes-trafico',
  'derecho-familia',
  'negligencias-medicas',
  'extranjeria',
  'derecho-administrativo',
  'responsabilidad-civil',
];

const FOLDER_SLUG_MAP: Record<string, string> = {
  'accidentes-trafico': 'accidentes-trafico',
  'derecho-familia': 'derecho-familia',
  'negligencias-medicas': 'negligencias-medicas',
  'extranjeria': 'permisos-residencia',
  'derecho-administrativo': 'responsabilidad-administracion',
  'responsabilidad-civil': 'responsabilidad-civil',
};

const FOLDER_SLUG_MAP_EN: Record<string, string> = {
  'accidentes-trafico': 'traffic-accidents',
  'derecho-familia': 'family-law',
  'negligencias-medicas': 'medical-malpractice',
  'extranjeria': 'immigration',
  'derecho-administrativo': 'administrative-law',
  'responsabilidad-civil': 'civil-liability',
};

const DISPLAY_NAME_ES: Record<string, string> = {
  'extranjeria': 'Permisos de Residencia e Inmigración',
  'derecho-administrativo': 'Responsabilidad de la Administración',
};

const DISPLAY_NAME_EN: Record<string, string> = {
  'extranjeria': 'Immigration & Residence Permits',
  'derecho-administrativo': 'Government Liability',
};

export function getActiveServices() {
  return services.filter((s) => ACTIVE_SERVICE_IDS.includes(s.id));
}

export function getFolderSlug(serviceId: string, locale: 'es' | 'en' = 'es'): string {
  if (locale === 'en') return FOLDER_SLUG_MAP_EN[serviceId] || serviceId;
  return FOLDER_SLUG_MAP[serviceId] || serviceId;
}

export function getServicesByLocale(locale: 'es' | 'en') {
  return getActiveServices()
    .sort((a, b) => a.priority - b.priority)
    .map((s) => ({
      id: s.id,
      slug: getFolderSlug(s.id, locale),
      localSlug: locale === 'es' ? s.slugEs : s.slugEn,
      name: locale === 'es'
        ? (DISPLAY_NAME_ES[s.id] || s.nameEs)
        : (DISPLAY_NAME_EN[s.id] || s.nameEn),
      description: locale === 'es' ? s.descriptionEs : s.descriptionEn,
      longDescription: locale === 'es' ? s.longDescriptionEs : s.longDescriptionEn,
      icon: s.icon,
      priority: s.priority,
      category: s.category,
      sections: locale === 'es' ? s.sectionsEs : s.sectionsEn,
      faqs: locale === 'es' ? s.faqsEs : s.faqsEn,
      process: locale === 'es' ? s.processEs : s.processEn,
    }));
}

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slugEs === slug || s.slugEn === slug);
}

export function getServiceByGenericSlug(slug: string) {
  return services.find((s) => s.genericSlugEs === slug || s.genericSlugEn === slug);
}
