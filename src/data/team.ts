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
      'Sobrino de D. Blas García-Valcárcel, quien comenzó a ejercer en 1946. Fundó formalmente la firma en 1970. Amplia trayectoria en derecho privado y público en la Región de Murcia. Especialista en responsabilidad civil con décadas de experiencia.',
    bioEn:
      'Nephew of D. Blas García-Valcárcel, who began practicing in 1946. Formally established the firm in 1970. Extensive career in private and public law in the Region of Murcia. Specialist in civil liability with decades of experience.',
    image: '/images/team/garcia_valcarcel_caceres_abogados_equipo_pedro.webp',
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
    image: '/images/team/garcia_valcarcel_caceres_abogados_equipo_raquel.webp',
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
    image: '/images/team/garcia_valcarcel_caceres_abogados_equipo_miguel.webp',
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
    image: '/images/team/garcia_valcarcel_caceres_abogados_equipo_olga.webp',
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
    image: '/images/team/garcia_valcarcel_caceres_abogados_equipo_carmen.webp',
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
