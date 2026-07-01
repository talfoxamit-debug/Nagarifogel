'use client';

import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import type { Locale } from '@/lib/i18n';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { Icon } from './icons';
import { whatsappLink } from '@/lib/config';

type Status = 'idle' | 'sending' | 'success' | 'error';

const initial = {
  full_name: '',
  phone: '',
  email: '',
  project_type: '',
  budget: '',
  timeline: '',
  description: '',
  preferred_contact: 'whatsapp',
  consent: false,
};

export function QuoteForm({ dict, locale }: { dict: Dict; locale: Locale }) {
  const f = dict.quote.form;
  const [form, setForm] = React.useState(initial);
  const [status, setStatus] = React.useState<Status>('idle');

  const update = (key: keyof typeof initial) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const labelFor = (options: { value: string; label: string }[], value: string) =>
    options.find((o) => o.value === value)?.label || value;

  const buildWhatsappMessage = () => {
    const L = locale === 'he';
    const lines = [
      L ? `שלום אורי! אשמח להצעת מחיר.` : `Hi Oori! I'd love a quote.`,
      form.full_name && `${f.nameLabel}: ${form.full_name}`,
      form.project_type && `${f.projectTypeLabel}: ${labelFor(f.projectTypeOptions, form.project_type)}`,
      form.budget && `${f.budgetLabel}: ${labelFor(f.budgetOptions, form.budget)}`,
      form.timeline && `${f.timelineLabel}: ${labelFor(f.timelineOptions, form.timeline)}`,
      form.description && `${f.descriptionLabel}: ${form.description}`,
    ].filter(Boolean);
    return lines.join('\n');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('success');
        setForm(initial);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="quote" className="section quote">
      <div className="container container--narrow">
        <SectionHeader eyebrow={dict.quote.eyebrow} title={dict.quote.title} subtitle={dict.quote.subtitle} />

        <Reveal className="quote__card">
          {status === 'success' ? (
            <div className="quote__result" role="status">
              <span className="quote__result-icon" aria-hidden>✓</span>
              <h3>{dict.quote.success.title}</h3>
              <p>{dict.quote.success.body}</p>
              <a
                className="btn btn--whatsapp"
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="whatsapp" />
                {dict.quote.whatsappCta}
              </a>
            </div>
          ) : (
            <form className="quote__form" onSubmit={onSubmit} noValidate>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="full_name">{f.nameLabel} *</label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder={f.namePlaceholder}
                    value={form.full_name}
                    onChange={update('full_name')}
                  />
                </div>
                <div className="field">
                  <label htmlFor="phone">{f.phoneLabel} *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    dir="ltr"
                    placeholder={f.phonePlaceholder}
                    value={form.phone}
                    onChange={update('phone')}
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">{f.emailLabel}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    dir="ltr"
                    placeholder={f.emailPlaceholder}
                    value={form.email}
                    onChange={update('email')}
                  />
                </div>
                <div className="field">
                  <label htmlFor="project_type">{f.projectTypeLabel}</label>
                  <select id="project_type" name="project_type" value={form.project_type} onChange={update('project_type')}>
                    <option value="" disabled>
                      —
                    </option>
                    {f.projectTypeOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="budget">{f.budgetLabel}</label>
                  <select id="budget" name="budget" value={form.budget} onChange={update('budget')}>
                    <option value="" disabled>
                      —
                    </option>
                    {f.budgetOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="timeline">{f.timelineLabel}</label>
                  <select id="timeline" name="timeline" value={form.timeline} onChange={update('timeline')}>
                    <option value="" disabled>
                      —
                    </option>
                    {f.timelineOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="description">{f.descriptionLabel}</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder={f.descriptionPlaceholder}
                  value={form.description}
                  onChange={update('description')}
                />
              </div>

              <fieldset className="field field--radio">
                <legend>{f.contactMethodLabel}</legend>
                <div className="radio-row">
                  {f.contactMethodOptions.map((o) => (
                    <label key={o.value} className={`chip${form.preferred_contact === o.value ? ' is-active' : ''}`}>
                      <input
                        type="radio"
                        name="preferred_contact"
                        value={o.value}
                        checked={form.preferred_contact === o.value}
                        onChange={update('preferred_contact')}
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="consent">
                <input type="checkbox" name="consent" checked={form.consent} onChange={update('consent')} required />
                <span>{f.consentLabel}</span>
              </label>

              {status === 'error' && (
                <p className="form-error" role="alert">
                  <strong>{dict.quote.error.title}</strong> {dict.quote.error.body}
                </p>
              )}

              <div className="quote__actions">
                <button type="submit" className="btn btn--primary btn--lg" disabled={status === 'sending'}>
                  {status === 'sending' ? f.sending : f.submit}
                </button>
                <div className="quote__or">
                  <span>{dict.quote.orWhatsapp}</span>
                  <a
                    className="btn btn--whatsapp"
                    href={whatsappLink(buildWhatsappMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="whatsapp" />
                    {dict.quote.whatsappCta}
                  </a>
                </div>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export default QuoteForm;
