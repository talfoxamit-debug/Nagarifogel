import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import WoodImage from './WoodImage';
import { media } from '@/content/media';

// Varied tile spans create an editorial, gallery-like rhythm.
const spans = ['tile--tall', '', '', '', 'tile--wide', ''];

export function Gallery({ dict }: { dict: Dict }) {
  return (
    <section id="gallery" className="section gallery">
      <div className="container">
        <SectionHeader
          eyebrow={dict.gallery.eyebrow}
          title={dict.gallery.title}
          subtitle={dict.gallery.subtitle}
        />
        <div className="gallery__grid">
          {dict.gallery.items.map((item, i) => (
            <Reveal key={i} className={`tile ${spans[i % spans.length]}`.trim()} delay={(i % 3) * 60}>
              <WoodImage seed={i * 13 + 3} src={media.gallery[i]} alt={item.title} />
              <div className="tile__overlay">
                <span className="tile__category">{item.category}</span>
                <span className="tile__title">{item.title}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
