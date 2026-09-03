'use client';

import { useEffect, useState } from 'react';
import { getTranslations, Locale } from '@/data/translations';
import { getServicesByLocale } from '@/data/services';

interface ContactSectionProps {
  locale: Locale;
}

const inputClass =
  'w-full font-sans text-[0.82rem] text-brand-dark bg-white border border-neutral-200 px-4 py-3 outline-none transition-colors focus:border-brand-brown';
const labelClass =
  'text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block';

export default function ContactSection({ locale }: ContactSectionProps) {
  const t = getTranslations(locale);
  const services = getServicesByLocale(locale);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [contactType, setContactType] = useState<'particular' | 'professional'>('particular');
  const [formStartedAt, setFormStartedAt] = useState(0);

  useEffect(() => {
    setFormStartedAt(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      area: formData.get('area'),
      message: formData.get('message'),
      contact_type: formData.get('contact_type'),
      company: formData.get('company'),
      referral_source: formData.get('referral_source'),
      gdpr_consent: formData.get('privacy') === 'on',
      locale,
      website: formData.get('website'),
      form_started_at: formStartedAt,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
        setContactType('particular');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-12 md:py-20" id="contact">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-16">
          <div className="reveal">
            <div className="mb-8">
              <h2 className="section-title">
                {t.contact.title}{' '}
                <span className="text-brand-brown">{t.contact.titleHighlight}</span>
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed mt-2">
                {t.contact.description}
              </p>
            </div>

            <div className="flex flex-col gap-5 mt-8">
              {[
                { label: t.contact.address.label, value: t.contact.address.value },
                { label: t.contact.phone.label, value: t.contact.phone.value },
                { label: t.contact.email.label, value: t.contact.email.value },
                { label: t.contact.schedule.label, value: t.contact.schedule.value },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-px bg-neutral-200 min-h-[35px] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[0.55rem] font-bold text-brand-brown uppercase tracking-[0.12em] mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-[0.82rem] text-neutral-500 leading-relaxed whitespace-pre-line">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="reveal relative bg-neutral-50 border border-neutral-200 p-8 md:p-10"
          >
            <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Sitio web</label>
              <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="mb-4">
              <span className={labelClass}>{t.contact.form.contactType}</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-[0.82rem] text-brand-dark">
                  <input
                    type="radio"
                    name="contact_type"
                    value="particular"
                    checked={contactType === 'particular'}
                    onChange={() => setContactType('particular')}
                  />
                  {t.contact.form.particular}
                </label>
                <label className="flex items-center gap-2 text-[0.82rem] text-brand-dark">
                  <input
                    type="radio"
                    name="contact_type"
                    value="professional"
                    checked={contactType === 'professional'}
                    onChange={() => setContactType('professional')}
                  />
                  {t.contact.form.professional}
                </label>
              </div>
            </div>

            {contactType === 'professional' && (
              <div className="mb-4">
                <label className={labelClass}>{t.contact.form.company}</label>
                <input
                  name="company"
                  type="text"
                  placeholder={t.contact.form.companyPlaceholder}
                  className={inputClass}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>{t.contact.form.name}</label>
                <input
                  name="name"
                  type="text"
                  placeholder={t.contact.form.namePlaceholder}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.contact.form.phone}</label>
                <input
                  name="phone"
                  type="tel"
                  placeholder={t.contact.form.phonePlaceholder}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>{t.contact.form.email}</label>
                <input
                  name="email"
                  type="email"
                  placeholder={t.contact.form.emailPlaceholder}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.contact.form.area}</label>
                <select name="area" className={`${inputClass} appearance-none cursor-pointer`}>
                  <option value="">{t.contact.form.areaPlaceholder}</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className={labelClass}>{t.contact.form.referral}</label>
              <select name="referral_source" className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="">{t.contact.form.referralPlaceholder}</option>
                <option value="google">{t.contact.form.referralGoogle}</option>
                <option value="social">{t.contact.form.referralSocial}</option>
                <option value="referral">{t.contact.form.referralKnown}</option>
                <option value="other">{t.contact.form.referralOther}</option>
              </select>
            </div>

            <div className="mb-4">
              <label className={labelClass}>{t.contact.form.message}</label>
              <textarea
                name="message"
                placeholder={t.contact.form.messagePlaceholder}
                required
                className={`${inputClass} min-h-[100px] resize-y`}
              />
            </div>

            <label className="flex items-start gap-2 mb-6 text-[0.78rem] text-neutral-500">
              <input type="checkbox" name="privacy" required className="mt-1" />
              <span>
                {t.contact.form.privacy}{' '}
                <a href="/es/politica-privacidad" className="text-brand-brown underline">
                  {t.contact.form.privacyLink}
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? t.contact.form.sending : t.contact.form.submit} →
            </button>

            {status === 'success' && (
              <p className="text-sm text-green-600 mt-4">{t.contact.form.success}</p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-600 mt-4">{t.contact.form.error}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
