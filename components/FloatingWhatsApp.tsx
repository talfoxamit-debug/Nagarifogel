'use client';

import * as React from 'react';
import { whatsappLink } from '@/lib/config';
import { Icon } from './icons';

export function FloatingWhatsApp({ label, message }: { label: string; message?: string }) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      className={`fab-whatsapp${show ? ' is-visible' : ''}`}
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <span className="fab-whatsapp__icon">
        <Icon name="whatsapp" />
      </span>
      <span className="fab-whatsapp__label">{label}</span>
    </a>
  );
}

export default FloatingWhatsApp;
