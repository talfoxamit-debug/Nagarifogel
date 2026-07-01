'use client';

import * as React from 'react';

/**
 * StatCounter — counts up to a numeric target when scrolled into view.
 * Parses a value string like "20+", "500+", "100%" into number + suffix.
 */
export function StatCounter({ value }: { value: string }) {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const prefix = match ? match[1] : '';
  const target = match ? parseInt(match[2], 10) : 0;
  const suffix = match ? match[3] : value;

  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = React.useState(match ? 0 : target);
  const started = React.useRef(false);

  React.useEffect(() => {
    if (!match) return;
    const node = ref.current;
    if (!node) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplay(target);
      return;
    }

    const run = () => {
      if (started.current) return;
      started.current = true;
      const duration = 1400;
      let startTime = 0;
      const step = (t: number) => {
        if (!startTime) startTime = t;
        const p = Math.min((t - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (typeof IntersectionObserver === 'undefined') {
      run();
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [match, target]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default StatCounter;
