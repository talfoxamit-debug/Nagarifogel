'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Dict } from '@/content/dictionaries/types';
import type { Locale } from '@/lib/i18n';

type HeaderProps = {
  dict: Dict;
  locale: Locale;
};

export function Header({ dict, locale }: HeaderProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links: { href: string; label: string }[] = [
    { href: '#about', label: dict.nav.about },
    { href: '#services', label: dict.nav.services },
    { href: '#gallery', label: dict.nav.gallery },
    { href: '#process', label: dict.nav.process },
    { href: '#faq', label: dict.nav.faq },
    { href: '#contact', label: dict.nav.contact },
  ];

  const otherLocale: Locale = locale === 'he' ? 'en' : 'he';

  const close = () => setOpen(false);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Link href={`/${locale}`} className="brand" onClick={close}>
          <span className="brand__mark" aria-hidden>
            <svg viewBox="0 0 32 32" width="30" height="30">
              <path
                d="M6 24 L16 6 L26 24 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M11 24 L16 15 L21 24" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
            </svg>
          </span>
          <span className="brand__text">
            <span className="brand__name">{dict.brand.name}</span>
            <span className="brand__tag">{dict.brand.tagline}</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="site-nav__link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link href={`/${otherLocale}`} className="lang-toggle" aria-label={dict.nav.langToggle}>
            {dict.nav.langToggle}
          </Link>
          <a href="#quote" className="btn btn--primary btn--sm">
            {dict.nav.cta}
          </a>
          <button
            type="button"
            className={`menu-toggle${open ? ' is-open' : ''}`}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-menu${open ? ' is-open' : ''}`} onClick={close}>
        <nav className="mobile-menu__nav" onClick={(e) => e.stopPropagation()}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="mobile-menu__link" onClick={close}>
              {l.label}
            </a>
          ))}
          <a href="#quote" className="btn btn--primary" onClick={close}>
            {dict.nav.cta}
          </a>
          <Link href={`/${otherLocale}`} className="mobile-menu__lang" onClick={close}>
            {dict.nav.langToggle}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
