'use client';

import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import WoodImage from './WoodImage';
import { media } from '@/content/media';

// Varied tile spans create an editorial, gallery-like rhythm.
const spans = ['tile--tall', '', '', '', 'tile--wide', ''];

export function Gallery({ dict }: { dict: Dict }) {
  const items = dict.gallery.items;
  const [open, setOpen] = React.useState<number | null>(null);

  const close = React.useCallback(() => setOpen(null), []);
  const go = React.useCallback(
    (dir: number) => setOpen((cur) => (cur === null ? cur : (cur + dir + items.length) % items.length)),
    [items.length],
  );

  React.useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, go]);

  return (
    <section id="gallery" className="section gallery">
      <div className="container">
        <SectionHeader
          eyebrow={dict.gallery.eyebrow}
          title={dict.gallery.title}
          subtitle={dict.gallery.subtitle}
        />
        <div className="gallery__grid">
          {items.map((item, i) => (
            <Reveal key={i} className={`tile ${spans[i % spans.length]}`.trim()} delay={(i % 3) * 60}>
              <button type="button" className="tile__btn" onClick={() => setOpen(i)} aria-label={item.title}>
                <WoodImage seed={i * 13 + 3} src={media.gallery[i]} alt={item.title} />
                <div className="tile__overlay">
                  <span className="tile__category">{item.category}</span>
                  <span className="tile__title">{item.title}</span>
                  <span className="tile__zoom" aria-hidden>
                    +
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={items[open].title} onClick={close}>
          <button className="lightbox__close" onClick={close} aria-label="Close">
            ×
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media.gallery[open]} alt={items[open].title} className="lightbox__img" />
            <figcaption className="lightbox__caption">
              <span className="lightbox__cat">{items[open].category}</span>
              <span className="lightbox__title">{items[open].title}</span>
            </figcaption>
          </figure>
          <button
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

export default Gallery;
