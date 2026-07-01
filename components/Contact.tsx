import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { Icon } from './icons';
import { siteConfig, whatsappLink } from '@/lib/config';

export function Contact({ dict }: { dict: Dict }) {
  const waMsg =
    dict.brand.name === 'אורי'
      ? 'שלום אורי, אשמח לקבל הצעת מחיר לפרויקט עבודת עץ.'
      : "Hi Oori, I'd love to get a quote for a woodworking project.";

  const cards = [
    {
      icon: 'whatsapp',
      label: dict.contact.whatsappLabel,
      value: siteConfig.contactPhone,
      href: whatsappLink(waMsg),
      accent: true,
    },
    { icon: 'phone', label: dict.contact.phoneLabel, value: siteConfig.contactPhone, href: `tel:${siteConfig.contactPhone}` },
    { icon: 'mail', label: dict.contact.emailLabel, value: siteConfig.contactEmail, href: `mailto:${siteConfig.contactEmail}` },
    { icon: 'location', label: dict.contact.locationLabel, value: dict.contact.location },
    { icon: 'clock', label: dict.contact.hoursLabel, value: dict.contact.hours },
  ];

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <SectionHeader
          eyebrow={dict.contact.eyebrow}
          title={dict.contact.title}
          subtitle={dict.contact.subtitle}
        />
        <div className="contact__grid">
          {cards.map((c, i) => {
            const inner = (
              <>
                <span className={`contact-card__icon${c.accent ? ' contact-card__icon--accent' : ''}`}>
                  <Icon name={c.icon} />
                </span>
                <span className="contact-card__label">{c.label}</span>
                <span className="contact-card__value">{c.value}</span>
              </>
            );
            return (
              <Reveal key={i} className="contact-card" delay={(i % 3) * 70}>
                {c.href ? (
                  <a
                    className="contact-card__link"
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="contact-card__link">{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>
        <Reveal className="contact__cta">
          <a href="#quote" className="btn btn--primary btn--lg">
            {dict.contact.cta}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default Contact;
