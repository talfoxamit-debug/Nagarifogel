import * as React from 'react';
import type { Dict } from '@/content/dictionaries/types';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export function Process({ dict }: { dict: Dict }) {
  return (
    <section id="process" className="section section--alt process">
      <div className="container">
        <SectionHeader
          eyebrow={dict.process.eyebrow}
          title={dict.process.title}
          subtitle={dict.process.subtitle}
        />
        <ol className="process__steps">
          {dict.process.steps.map((step, i) => (
            <Reveal as="li" key={i} className="process-step" delay={i * 90}>
              <span className="process-step__num">{String(i + 1).padStart(2, '0')}</span>
              <div className="process-step__body">
                <h3 className="process-step__title">{step.title}</h3>
                <p className="process-step__desc">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Process;
