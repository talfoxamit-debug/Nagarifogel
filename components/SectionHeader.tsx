import * as React from 'react';
import Reveal from './Reveal';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'start' | 'center';
  className?: string;
};

export function SectionHeader({ eyebrow, title, subtitle, align = 'center', className = '' }: Props) {
  return (
    <Reveal className={`section-header section-header--${align} ${className}`.trim()}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="section-header__title">{title}</h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </Reveal>
  );
}

export default SectionHeader;
