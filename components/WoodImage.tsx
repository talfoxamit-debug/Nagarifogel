import * as React from 'react';

/**
 * WoodImage — a self-contained, on-brand placeholder that renders an
 * elegant wood-panel SVG (warm gradient + grain + growth rings). It is
 * fully deterministic (seeded) so it is SSR-safe, and needs no external
 * images. To use a real photo instead, pass `src` (see content/media.ts).
 *
 * Colours are driven by CSS custom properties (--wood-*) so the panel
 * always matches the site palette.
 */

type WoodImageProps = {
  seed?: number;
  src?: string;
  alt?: string;
  label?: string;
  sublabel?: string;
  className?: string;
  priority?: boolean;
};

// Small deterministic PRNG (mulberry32) — same output on server & client.
function makeRng(seed: number) {
  let a = seed * 1664525 + 1013904223;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function WoodImage({
  seed = 1,
  src,
  alt = '',
  label,
  sublabel,
  className,
  priority,
}: WoodImageProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    );
  }

  const rng = makeRng(seed + 7);
  const uid = `w${seed}`;
  const w = 800;
  const h = 600;

  // Vary the gradient direction and which two wood tones anchor the panel.
  const tones = ['var(--wood-deep)', 'var(--wood-mid)', 'var(--wood-warm)', 'var(--wood-light)'];
  const iA = Math.floor(rng() * tones.length);
  let iB = Math.floor(rng() * tones.length);
  if (iB === iA) iB = (iB + 1) % tones.length;
  const angle = 20 + Math.floor(rng() * 50);

  // Long, softly curved grain lines.
  const grain: string[] = [];
  const lines = 9;
  for (let i = 0; i < lines; i++) {
    const x = (w / (lines + 1)) * (i + 1) + (rng() - 0.5) * 26;
    const bow = (rng() - 0.5) * 60;
    grain.push(`M ${x} -20 C ${x + bow} ${h * 0.33}, ${x - bow} ${h * 0.66}, ${x + bow * 0.4} ${h + 20}`);
  }

  // A couple of growth-ring knots.
  const knots = Array.from({ length: 2 }, () => ({
    cx: 120 + rng() * (w - 240),
    cy: 120 + rng() * (h - 240),
    r: 26 + rng() * 26,
  }));

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt || label || 'Woodwork'}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <linearGradient
          id={`${uid}-g`}
          x1="0"
          y1="0"
          x2={Math.cos((angle * Math.PI) / 180)}
          y2={Math.sin((angle * Math.PI) / 180)}
        >
          <stop offset="0%" stopColor={tones[iA]} />
          <stop offset="100%" stopColor={tones[iB]} />
        </linearGradient>
        <filter id={`${uid}-n`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.012" numOctaves={2} seed={seed} result="n" />
          <feColorMatrix in="n" type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.08" intercept="0" />
          </feComponentTransfer>
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </defs>

      <rect width={w} height={h} fill={`url(#${uid}-g)`} />

      <g stroke="var(--wood-grain)" fill="none" strokeLinecap="round">
        {grain.map((d, i) => (
          <path key={i} d={d} strokeWidth={i % 3 === 0 ? 2.2 : 1.1} opacity={0.10 + (i % 3) * 0.05} />
        ))}
      </g>

      {knots.map((k, i) => (
        <g key={i} fill="none" stroke="var(--wood-grain)" opacity={0.16}>
          <ellipse cx={k.cx} cy={k.cy} rx={k.r} ry={k.r * 0.7} strokeWidth={2} />
          <ellipse cx={k.cx} cy={k.cy} rx={k.r * 0.6} ry={k.r * 0.42} strokeWidth={1.4} />
          <ellipse cx={k.cx} cy={k.cy} rx={k.r * 0.26} ry={k.r * 0.18} strokeWidth={1.1} />
        </g>
      ))}

      {/* fine grain texture */}
      <rect width={w} height={h} fill="var(--wood-deep)" filter={`url(#${uid}-n)`} opacity={0.5} />

      {/* subtle vignette for depth */}
      <rect width={w} height={h} fill={`url(#${uid}-g)`} opacity={0} />

      {label && (
        <g>
          <rect x="0" y={h - 118} width={w} height="118" fill="var(--wood-deep)" opacity="0.34" />
          <text x="40" y={h - 60} fill="var(--wood-cream)" fontSize="34" fontWeight="600" style={{ fontFamily: 'inherit' }}>
            {label}
          </text>
          {sublabel && (
            <text x="40" y={h - 28} fill="var(--wood-cream)" fontSize="19" opacity="0.85" style={{ fontFamily: 'inherit' }}>
              {sublabel}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}

export default WoodImage;
