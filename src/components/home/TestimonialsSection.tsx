import { getTranslations, Locale } from '@/data/translations';
import { getTestimonialsByLocale } from '@/data/testimonials';

interface TestimonialsSectionProps {
  locale: Locale;
}

export default function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const t = getTranslations(locale);
  const testimonials = getTestimonialsByLocale(locale);

  return (
    <section className="py-12 md:py-20 bg-neutral-50 border-b border-neutral-200">
      <div className="container-custom">
        <div className="mb-10">
          <h2 className="section-title">{t.testimonials.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="reveal bg-white border border-neutral-200 p-8 transition-all duration-300 hover:border-brand-brown hover:shadow-md"
            >
              <div className="font-serif text-5xl text-brand-brown opacity-30 leading-none mb-2">
                &ldquo;
              </div>
              <p className="font-serif text-base text-brand-dark leading-relaxed italic mb-6">
                {testimonial.text}
              </p>
              <div className="w-8 h-px bg-neutral-200 mb-4" />
              <div className="text-[0.78rem] font-semibold text-brand-dark">{testimonial.name}</div>
              <div className="text-[0.65rem] text-neutral-400 mt-0.5">{testimonial.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
