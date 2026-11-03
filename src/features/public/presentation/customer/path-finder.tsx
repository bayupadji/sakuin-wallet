'use client';

import { useState } from 'react';
import { Button } from '@/shared/presentation/ui/button';
import { cn } from '@/shared/utils/cn';
import { landingContent } from '../../content/landing.id';
import { Eyebrow, LandingContainer, SectionTitle } from './landing-ui';

const { pathFinder, a11y } = landingContent;

export function PathFinder() {
  const [serviceId, setServiceId] = useState<string>(pathFinder.defaultService);
  const service = pathFinder.services.find((item) => item.id === serviceId) ?? pathFinder.services[0];
  const path = pathFinder.paths[service.kind];
  const brand = 'brand' in service ? service.brand : '';
  const fill = (text: string) => text.replaceAll('{brand}', brand);

  return (
    <section id={pathFinder.id} aria-labelledby="path-heading" className="scroll-mt-4">
      <LandingContainer className="pb-24 pt-12">
        <div className="lp-glow-card flex flex-col gap-8 rounded-2xl p-[clamp(28px,5vw,56px)]">
          <div className="flex max-w-[680px] flex-col gap-3">
            <Eyebrow>{pathFinder.eyebrow}</Eyebrow>
            <SectionTitle id="path-heading" className="text-[clamp(28px,3.4vw,40px)]">
              {pathFinder.heading}
            </SectionTitle>
          </div>

          <div role="group" aria-label={a11y.chooseService} className="flex flex-wrap gap-2.5">
            {pathFinder.services.map((item) => {
              const on = item.id === serviceId;
              return (
                <Button
                  key={item.id}
                  type="button"
                  variant={on ? 'primary' : 'outline'}
                  size="sm"
                  aria-pressed={on}
                  onClick={() => setServiceId(item.id)}
                  className={cn(
                    'min-h-[44px] rounded-full px-[18px] py-2.5 text-[15px] font-semibold transition-all',
                    on
                      ? 'shadow-md shadow-[#1D9BF0]/25'
                      : 'border-white/18 bg-transparent text-lp-body hover:text-white hover:bg-white/5',
                  )}
                >
                  {item.label}
                </Button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-stretch gap-6" aria-live="polite">
            <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-3 rounded-2xl border border-white/8 bg-white/4 p-7">
              <span className="self-start rounded-full bg-lp-cyan/14 px-3 py-1.5 text-[13px] font-bold text-lp-sky-soft">
                {path.badge}
              </span>
              <h3 className="text-2xl font-extrabold">{fill(path.title)}</h3>
              <p className="text-base leading-relaxed text-lp-muted">{path.desc}</p>
            </div>
            <ol className="flex min-w-0 flex-[1_1_420px] list-none flex-col gap-3 p-0">
              {path.steps.map((text, index) => (
                <li
                  key={text}
                  className="flex items-start gap-4 rounded-[14px] border border-white/8 bg-white/4 px-5 py-[18px]"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-lp-accent text-[15px] font-extrabold text-lp-bg"
                  >
                    {index + 1}
                  </span>
                  <span className="pt-1 text-base leading-[1.55] text-lp-strong">
                    <span className="sr-only">{`Langkah ${index + 1}: `}</span>
                    {fill(text)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
