import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import { Icon } from './icons';

export function Services({ dict }: { dict: Dict }) {
  return (
    <section id="services" className="section section--alt services">
      <div className="container">
        <SectionHeader
          eyebrow={dict.services.eyebrow}
          title={dict.services.title}
          subtitle={dict.services.subtitle}
        />
        <div className="services__grid">
          {dict.services.items.map((item, i) => (
            <Reveal key={item.key} className="service-card" delay={(i % 3) * 80}>
              <span className="service-card__icon">
                <Icon name={item.key} />
              </span>
              <h3 className="service-card__title">{item.title}</h3>
              <p className="service-card__desc">{item.description}</p>
              <a href="#quote" className="service-card__link">
                {dict.nav.cta}
                <span aria-hidden className="arrow">→</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
