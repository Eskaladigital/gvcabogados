export interface Testimonial {
  id: string;
  name: string;
  roleEs: string;
  roleEn: string;
  textEs: string;
  textEn: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Pedro Hurtado',
    roleEs: 'Cliente',
    roleEn: 'Client',
    textEs:
      'Excelentes abogados en Murcia especializados en negligencias médicas y accidentes laborales.',
    textEn:
      'Excellent lawyers in Murcia specialized in medical malpractice and workplace accidents.',
  },
  {
    id: '2',
    name: 'Ana Lucía P.',
    roleEs: 'Profesora',
    roleEn: 'Teacher',
    textEs:
      'Me sentí acompañada y protegida durante todo el proceso de divorcio. Un trato excepcional y humano.',
    textEn:
      'I felt supported and protected throughout the entire divorce process. Exceptional and humane treatment.',
  },
  {
    id: '3',
    name: 'Roberto M.',
    roleEs: 'Ingeniero',
    roleEn: 'Engineer',
    textEs:
      'Consiguieron un acuerdo muy favorable en mi despido improcedente. Transparencia y dedicación totales.',
    textEn:
      'They achieved a very favorable agreement in my unfair dismissal case. Total transparency and dedication.',
  },
];

export function getTestimonialsByLocale(locale: 'es' | 'en') {
  return testimonials.map((t) => ({
    id: t.id,
    name: t.name,
    role: locale === 'es' ? t.roleEs : t.roleEn,
    text: locale === 'es' ? t.textEs : t.textEn,
  }));
}
