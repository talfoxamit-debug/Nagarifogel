'use client';

import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import SectionHeader from './SectionHeader';
import { media } from '@/content/media';

/**
 * BeforeAfter — a drag-to-reveal comparison slider. By default it shows
 * the same restoration photo with an "aged" filter as the before state,
 * so it works with a single image. To use real pairs, pass beforeSrc.
 */
export function BeforeAfter({ dict }: { dict: Dict }) {
  const ba = dict.beforeAfter;
  const afterSrc = media.gallery[3];
  const beforeSrc = afterSrc; // same piece, filtered to look "before"
  const [pos, setPos] = React.useState(52);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const dragging = React.useRef(false);

  const setFromClientX = React.useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  React.useEffect(() => {
    const move = (e: PointerEvent) => {
      if (dragging.current) setFromClientX(e.clientX);
    };
    const up = () => {
      dragging.current = false;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [setFromClientX]);

  return (
    <section className="section section--alt beforeafter">
      <div className="container container--narrow">
        <SectionHeader eyebrow={ba.eyebrow} title={ba.title} subtitle={ba.subtitle} />
        <div
          className="ba"
          ref={ref}
          style={{ '--pos': `${pos}%` } as React.CSSProperties}
          onPointerDown={(e) => {
            dragging.current = true;
            setFromClientX(e.clientX);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={afterSrc} alt="" className="ba__img" draggable={false} />
          <span className="ba__tag ba__tag--after">{ba.afterLabel}</span>

          <div className="ba__before">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={beforeSrc} alt="" className="ba__img ba__img--aged" draggable={false} />
            <span className="ba__tag ba__tag--before">{ba.beforeLabel}</span>
          </div>

          <div className="ba__handle" aria-hidden>
            <span className="ba__handle-btn">⟺</span>
          </div>

          <input
            className="ba__range"
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label={ba.title}
          />
        </div>
      </div>
    </section>
  );
}

export default BeforeAfter;
