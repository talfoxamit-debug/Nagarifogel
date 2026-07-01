import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import WoodImage from './WoodImage';

export function Hero({ dict }: { dict: Dict }) {
  return (
    <section id="home" className="hero">
      <div className="hero__media" aria-hidden>
        <WoodImage seed={42} priority />
        <div className="hero__scrim" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <p className="eyebrow eyebrow--light">{dict.hero.eyebrow}</p>
          <h1 className="hero__title">
            {dict.hero.title} <span className="hero__accent">{dict.hero.titleAccent}</span>
          </h1>
          <p className="hero__subtitle">{dict.hero.subtitle}</p>
          <div className="hero__actions">
            <a href="#quote" className="btn btn--primary btn--lg">
              {dict.hero.ctaPrimary}
            </a>
            <a href="#gallery" className="btn btn--ghost btn--lg">
              {dict.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </div>

      <a href="#about" className="hero__scroll" aria-label={dict.hero.scroll}>
        <span>{dict.hero.scroll}</span>
        <span className="hero__scroll-line" aria-hidden />
      </a>
    </section>
  );
}

export default Hero;
