'use client';

import { useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { landingContent } from '../../content/landing.id';
import { Eyebrow, LandingContainer } from './landing-ui';

const { planner, a11y } = landingContent;

const idr = (value: number) => value.toLocaleString('id-ID');

export function KreditPlanner() {
  const [picked, setPicked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(planner.items.map((item) => [item.id, item.defaultOn])),
  );

  const selected = planner.items.filter((item) => picked[item.id]);
  const total = selected.reduce((sum, item) => sum + item.price, 0);

  return (
    <section aria-labelledby="planner-title">
      <LandingContainer className="pb-24 pt-8">
        <div className="lp-glow-card flex flex-wrap gap-8 rounded-2xl p-[clamp(28px,5vw,48px)]">
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-[18px]">
            <Eyebrow>{planner.eyebrow}</Eyebrow>
            <h2
              id="planner-title"
              className="text-[clamp(26px,3vw,36px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-balance"
            >
              {planner.heading}
            </h2>
            <p className="text-base leading-relaxed text-lp-muted">{planner.body}</p>
            <div role="group" aria-label={a11y.chooseNeeds} className="flex flex-col gap-2.5">
              {planner.items.map((item) => {
                const on = !!picked[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPicked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                    className={cn(
                      'flex min-h-[52px] cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[15px] text-white',
                      on ? 'border-lp-accent bg-lp-accent/12' : 'border-white/12 bg-transparent',
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'flex h-[22px] w-[22px] items-center justify-center rounded-md border-[1.5px] text-sm font-extrabold',
                          on ? 'border-lp-accent bg-lp-accent text-lp-bg' : 'border-white/35',
                        )}
                      >
                        {on ? '✓' : ''}
                      </span>
                      {item.label}
                    </span>
                    <span className="font-bold">Rp{idr(item.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex min-w-0 flex-[1_1_320px] flex-col justify-center gap-4">
            <div className="flex flex-col gap-2 rounded-[14px] border border-white/8 bg-white/4 p-6">
              <span className="text-sm font-semibold text-lp-muted">{planner.totalLabel}</span>
              <span className="text-[40px] font-extrabold tracking-[-0.02em]" aria-live="polite">
                Rp{idr(total)}
              </span>
              <span className="text-sm text-lp-muted">
                {selected.length} {planner.countSuffix}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 rounded-[14px] border border-lp-mint/25 bg-lp-mint/8 p-5">
              <span className="text-[15px] font-bold text-lp-mint">{planner.separateTitle}</span>
              <span className="text-sm leading-relaxed text-lp-body">{planner.separateText}</span>
            </div>
            <span className="text-[13px] text-lp-muted">{planner.sampleNote}</span>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
