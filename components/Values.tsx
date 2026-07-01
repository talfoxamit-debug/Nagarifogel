import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import Reveal from './Reveal';
import { Icon } from './icons';

const valueIcons = ['handmade', 'leaf', 'ruler', 'heart'];

export function Values({ dict }: { dict: Dict }) {
  return (
    <section className="section values">
      <div className="container">
        <Reveal className="values__head">
          <p className="eyebrow">{dict.values.eyebrow}</p>
          <h2 className="values__title">{dict.values.title}</h2>
        </Reveal>
        <div className="values__grid">
          {dict.values.items.map((item, i) => (
            <Reveal key={i} className="value" delay={(i % 4) * 70}>
              <span className="value__icon">
                <Icon name={valueIcons[i % valueIcons.length]} />
              </span>
              <h3 className="value__title">{item.title}</h3>
              <p className="value__desc">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Values;
