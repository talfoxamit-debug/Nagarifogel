import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';

export function Marquee({ dict }: { dict: Dict }) {
  const words = dict.marquee;
  // Duplicate the sequence so the scroll loops seamlessly.
  const items = [...words, ...words];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee__track">
        {items.map((w, i) => (
          <span key={i} className="marquee__item">
            {w}
            <span className="marquee__dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
