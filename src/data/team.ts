export interface TeamMember {
  id: string;
  name: string;
  roleEs: string;
  roleEn: string;
  bioEs: string;
  bioEn: string;
  image: string;
  isFounder?: boolean;
  isLawyer?: boolean;
}

export const team: TeamMember[] = [
  {
    id: 'pedro-garcia-valcarcel',
    name: 'Pedro Alfonso García-Válcarcel',
    roleEs: 'Socio Fundador',
    roleEn: 'Founding Partner',
    bioEs:
      'Fundador del bufete. Amplia trayectoria en derecho privado y público en la Región de Murcia. Con décadas de experiencia ejerciendo la abogacía con excelencia.',
    bioEn:
      'Firm founder. Extensive career in private and public law in the Region of Murcia. With decades of experience practicing law with excellence.',
    image: '/images/team/garcia_valcarcel_caceres_abogados_equipo_pedro.png',
    isFounder: true,
    isLawyer: true,
  },
  {
    id: 'raquel-garcia-valcarcel',
    name: 'Raquel García-Válcarcel',
    roleEs: 'Socia',
    roleEn: 'Partner',
    bioEs:
      'Especialista en derecho civil, familia y sucesiones. Mediadora acreditada por el Ministerio de Justicia.',
    bioEn:
      'Specialist in civil, family and inheritance law. Mediator accredited by the Ministry of Justice.',
    image: '/images/team/garcia_valcarcel_caceres_abogados_equipo_raquel.png',
    isLawyer: true,
  },
  {
    id: 'miguel-caceres',
    name: 'Miguel Cáceres',
    roleEs: 'Socio',
    roleEn: 'Partner',
    bioEs:
      'Experto en derecho penal, defensa corporativa y delitos económicos. Amplia experiencia en juicios penales complejos.',
    bioEn:
      'Expert in criminal law, corporate defense and economic crimes. Extensive experience in complex criminal trials.',
    image: '/images/team/garcia_valcarcel_caceres_abogados_equipo_miguel.png',
    isLawyer: true,
  },
  {
    id: 'olga-martinez',
    name: 'Olga Martínez',
    roleEs: 'Abogada',
    roleEn: 'Lawyer',
    bioEs:
      'Especialista en negligencias médicas y responsabilidad civil. Dedicación y rigor en la defensa de los derechos de los pacientes.',
    bioEn:
      'Specialist in medical malpractice and civil liability. Dedication and rigor in defending patient rights.',
    image: '/images/team/garcia_valcarcel_caceres_abogados_equipo_olga.png',
    isLawyer: true,
  },
  {
    id: 'carmen-martinez',
    name: 'Carmen Martínez',
    roleEs: 'Secretaria',
    roleEn: 'Secretary',
    bioEs:
      'Secretaria del bufete. Coordinación administrativa y atención al cliente con la máxima profesionalidad.',
    bioEn:
      'Firm secretary. Administrative coordination and customer service with the highest professionalism.',
    image: '/images/team/garcia_valcarcel_caceres_abogados_equipo_carmen.png',
    isLawyer: false,
  },
];

export function getTeamByLocale(locale: 'es' | 'en') {
  return team.map((m) => ({
    ...m,
    role: locale === 'es' ? m.roleEs : m.roleEn,
    bio: locale === 'es' ? m.bioEs : m.bioEn,
  }));
}
