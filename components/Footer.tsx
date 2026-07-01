import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import type { Locale } from '@/lib/i18n';
import { siteConfig, whatsappLink } from '@/lib/config';
import { Icon } from './icons';
import LogoMark from './Logo';

export function Footer({ dict, locale }: { dict: Dict; locale: Locale }) {
  const year = 2026;
  const links = [
    { href: '#about', label: dict.nav.about },
    { href: '#services', label: dict.nav.services },
    { href: '#gallery', label: dict.nav.gallery },
    { href: '#process', label: dict.nav.process },
    { href: '#contact', label: dict.nav.contact },
  ];

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <div className="site-footer__logo">
            <span className="site-footer__mark" aria-hidden>
              <LogoMark size={40} />
            </span>
            <span className="brand__name brand__name--footer">{dict.brand.name}</span>
          </div>
          <p className="site-footer__tagline">{dict.footer.tagline}</p>
        </div>

        <div className="site-footer__col">
          <h4 className="site-footer__heading">{dict.footer.quickLinks}</h4>
          <ul className="site-footer__links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h4 className="site-footer__heading">{dict.footer.contactTitle}</h4>
          <ul className="site-footer__links">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <span className="site-footer__ico"><Icon name="whatsapp" /></span>
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`tel:${siteConfig.contactPhone}`}>
                <span className="site-footer__ico"><Icon name="phone" /></span>
                {siteConfig.contactPhone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contactEmail}`}>
                <span className="site-footer__ico"><Icon name="mail" /></span>
                {siteConfig.contactEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container site-footer__bar">
        <p>
          © {year} {dict.brand.name}. {dict.footer.rights}
        </p>
        <p className="site-footer__credit">{dict.footer.credit}</p>
      </div>
    </footer>
  );
}

export default Footer;
