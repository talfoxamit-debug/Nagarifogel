import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export function Testimonials({ dict }: { dict: Dict }) {
  if (!dict.testimonials?.items?.length) return null;
  return (
    <section className="section section--alt testimonials">
      <div className="container">
        <SectionHeader eyebrow={dict.testimonials.eyebrow} title={dict.testimonials.title} />
        <div className="testimonials__grid">
          {dict.testimonials.items.map((t, i) => (
            <Reveal key={i} className="testimonial" delay={(i % 3) * 80}>
              <span className="testimonial__mark" aria-hidden>
                &#8220;
              </span>
              <p className="testimonial__quote">{t.quote}</p>
              <div className="testimonial__author">
                <span className="testimonial__name">{t.author}</span>
                <span className="testimonial__role">{t.role}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
