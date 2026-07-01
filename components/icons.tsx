import * as React from 'react';

type IconProps = { className?: string };

const base = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const Icons: Record<string, (p: IconProps) => React.JSX.Element> = {
  'custom-furniture': ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
      <path d="M4 8h16v6H4z" />
      <path d="M5 14v5M19 14v5M5 17h14" />
    </svg>
  ),
  'art-pieces': ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <path d="M12 3l2.3 4.9 5.4.7-4 3.7 1 5.3L12 15.9 7.3 18.5l1-5.3-4-3.7 5.4-.7z" />
    </svg>
  ),
  'kitchens-builtins': ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <path d="M4 4h16v16H4z" />
      <path d="M4 12h16M12 4v16" />
      <path d="M7 7.5h1.5M15.5 7.5H17M7 15.5h1.5M15.5 15.5H17" />
    </svg>
  ),
  restoration: ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-5 5a1.5 1.5 0 0 0 2 2l5-5a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2z" />
    </svg>
  ),
  'doors-details': ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <path d="M6 3h12v18H6z" />
      <path d="M9 3v18M9 21h9" />
      <circle cx="14.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  commissions: ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  ),
  phone: ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  ),
  mail: ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  ),
  whatsapp: ({ className }) => (
    <svg viewBox="0 0 24 24" width={28} height={28} fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.8c2.17 0 4.2.85 5.74 2.38a8.06 8.06 0 0 1 2.38 5.73c0 4.48-3.65 8.12-8.12 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.06 8.06 0 0 1-1.24-4.28c0-4.48 3.64-8.12 8.12-8.12zm4.71 10.32c-.06-.1-.24-.16-.5-.29-.26-.13-1.52-.75-1.75-.84-.24-.09-.41-.13-.58.13-.17.26-.67.83-.82 1-.15.17-.3.19-.56.06-.26-.13-1.09-.4-2.07-1.28-.77-.68-1.28-1.53-1.43-1.79-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.46.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.92-.21-.5-.42-.43-.58-.44l-.5-.01c-.17 0-.45.06-.68.32-.24.26-.9.88-.9 2.15 0 1.27.92 2.5 1.05 2.66.13.17 1.82 2.78 4.42 3.9.62.27 1.1.43 1.47.55.62.2 1.18.17 1.63.1.5-.07 1.52-.62 1.74-1.22.21-.6.21-1.11.15-1.22z" />
    </svg>
  ),
  location: ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  clock: ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  handmade: ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <path d="M6 12V7a1.5 1.5 0 0 1 3 0v4M9 11V5.5a1.5 1.5 0 0 1 3 0V11M12 11V6.5a1.5 1.5 0 0 1 3 0V12" />
      <path d="M15 9.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-2.5-3.2a1.4 1.4 0 0 1 2.2-1.7L6 14" />
    </svg>
  ),
  leaf: ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <path d="M5 19c0-8 6-13 14-13 0 8-5 14-13 14M5 19c2-4 5-7 9-9" />
    </svg>
  ),
  ruler: ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <path d="M3 8h18v8H3z" />
      <path d="M7 8v3M11 8v4M15 8v3M19 8v4" />
    </svg>
  ),
  heart: ({ className }) => (
    <svg {...base} className={className} aria-hidden>
      <path d="M12 20s-7-4.3-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7 2.7c0 5-7 9.3-7 9.3z" />
    </svg>
  ),
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = Icons[name] || Icons['custom-furniture'];
  return <Cmp className={className} />;
}
