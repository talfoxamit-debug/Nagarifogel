import * as React from 'react';

/**
 * LogoMark — a tree-ring / growth-ring emblem. Concentric, gently
 * off-centre rings evoke a cross-section of wood (and the "O" of Oori),
 * with a small carving gouge. Uses currentColor so it adapts to context.
 */
export function LogoMark({ className, size = 34 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-hidden
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="18" cy="21" rx="12.5" ry="13.5" stroke="currentColor" strokeWidth="1.5" opacity="0.85" />
      <ellipse cx="16.5" cy="21.5" rx="7.5" ry="8.5" stroke="currentColor" strokeWidth="1.3" opacity="0.65" />
      <ellipse cx="15.5" cy="22" rx="3.4" ry="4" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
      <circle cx="14.8" cy="22.2" r="1.3" fill="currentColor" opacity="0.75" />
      {/* carving gouge sweeping across the rings */}
      <path
        d="M6 12 Q 22 8, 34 16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export default LogoMark;
