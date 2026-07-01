import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import Reveal from './Reveal';
import { media } from '@/content/media';

export function CtaBand({ dict }: { dict: Dict }) {
  return (
    <section className="cta-band">
      <div
        className="cta-band__bg"
        style={{ backgroundImage: `url(${media.ctaBg})` }}
        aria-hidden
      />
      <div className="cta-band__scrim" aria-hidden />
      <div className="container cta-band__inner">
        <Reveal>
          <p className="eyebrow eyebrow--light">{dict.brand.tagline}</p>
          <h2 className="cta-band__title">{dict.banner.title}</h2>
          <p className="cta-band__subtitle">{dict.banner.subtitle}</p>
          <a href="#quote" className="btn btn--primary btn--lg">
            {dict.banner.button}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default CtaBand;
