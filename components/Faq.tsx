import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export function Faq({ dict }: { dict: Dict }) {
  if (!dict.faq?.items?.length) return null;
  return (
    <section id="faq" className="section faq">
      <div className="container container--narrow">
        <SectionHeader eyebrow={dict.faq.eyebrow} title={dict.faq.title} />
        <div className="faq__list">
          {dict.faq.items.map((item, i) => (
            <Reveal as="details" key={i} className="faq__item" delay={(i % 4) * 50}>
              <summary className="faq__q">
                <span>{item.q}</span>
                <span className="faq__icon" aria-hidden />
              </summary>
              <div className="faq__a">
                <p>{item.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
