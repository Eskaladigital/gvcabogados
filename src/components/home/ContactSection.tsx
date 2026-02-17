'use client';

import { useState } from 'react';
import { getTranslations, Locale } from '@/data/translations';
import { getServicesByLocale } from '@/data/services';

interface ContactSectionProps {
  locale: Locale;
}

export default function ContactSection({ locale }: ContactSectionProps) {
  const t = getTranslations(locale);
  const services = getServicesByLocale(locale);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
      locale,
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
          {/* Info */}
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

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="reveal bg-neutral-50 border border-neutral-200 p-8 md:p-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">
                  {t.contact.form.name}
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder={t.contact.form.namePlaceholder}
                  required
                  className="w-full font-sans text-[0.82rem] text-brand-dark bg-white border border-neutral-200 px-4 py-3 outline-none transition-colors focus:border-brand-brown"
                />
              </div>
              <div>
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">
                  {t.contact.form.phone}
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder={t.contact.form.phonePlaceholder}
                  className="w-full font-sans text-[0.82rem] text-brand-dark bg-white border border-neutral-200 px-4 py-3 outline-none transition-colors focus:border-brand-brown"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">
                  {t.contact.form.email}
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder={t.contact.form.emailPlaceholder}
                  required
                  className="w-full font-sans text-[0.82rem] text-brand-dark bg-white border border-neutral-200 px-4 py-3 outline-none transition-colors focus:border-brand-brown"
                />
              </div>
              <div>
                <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">
                  {t.contact.form.area}
                </label>
                <select
                  name="area"
                  className="w-full font-sans text-[0.82rem] text-brand-dark bg-white border border-neutral-200 px-4 py-3 outline-none transition-colors focus:border-brand-brown appearance-none cursor-pointer"
                >
                  <option value="">{t.contact.form.areaPlaceholder}</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-1.5 block">
                {t.contact.form.message}
              </label>
              <textarea
                name="message"
                placeholder={t.contact.form.messagePlaceholder}
                required
                className="w-full font-sans text-[0.82rem] text-brand-dark bg-white border border-neutral-200 px-4 py-3 outline-none transition-colors focus:border-brand-brown min-h-[100px] resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading'
                ? '...'
                : t.contact.form.submit}{' '}
              →
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
