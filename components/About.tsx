import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import Reveal from './Reveal';
import WoodImage from './WoodImage';
import { media } from '@/content/media';

export function About({ dict }: { dict: Dict }) {
  return (
    <section id="about" className="section about">
      <div className="container about__grid">
        <Reveal className="about__media">
          <div className="about__frame">
            <WoodImage seed={7} src={media.about} alt={dict.about.title} />
          </div>
          <div className="about__badge">
            <span className="about__badge-num">{dict.about.stats[0]?.value}</span>
            <span className="about__badge-label">{dict.about.stats[0]?.label}</span>
          </div>
        </Reveal>

        <Reveal className="about__content" delay={80}>
          <p className="eyebrow">{dict.about.eyebrow}</p>
          <h2 className="about__title">{dict.about.title}</h2>
          <p className="about__lead">{dict.about.lead}</p>
          {dict.about.paragraphs.map((p, i) => (
            <p key={i} className="about__para">
              {p}
            </p>
          ))}

          <blockquote className="about__quote">{dict.about.quote}</blockquote>
          <p className="about__signature">{dict.about.signature}</p>

          <div className="about__stats">
            {dict.about.stats.map((s, i) => (
              <div key={i} className="stat">
                <span className="stat__value">{s.value}</span>
                <span className="stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default About;
