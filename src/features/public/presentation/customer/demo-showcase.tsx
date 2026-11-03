'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from '@/shared/presentation/ui/button';
import { cn } from '@/shared/utils/cn';
import { landingContent } from '../../content/landing.id';
import { LandingContainer } from './landing-ui';

const { demo, a11y } = landingContent;

export function DemoShowcase() {
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);

  return (
    <section id="demo" aria-label={a11y.demoSection} className="scroll-mt-4">
      <LandingContainer className="pb-24 pt-6">
        <div className="lp-glow-card flex flex-col items-center gap-7 overflow-hidden rounded-2xl p-[clamp(28px,5vw,56px)]">
          <div className="grid min-h-[300px] w-full place-items-center sm:min-h-[360px]">
            <div
              aria-hidden="true"
              className="lp-card-pearl col-start-1 row-start-1 h-[190px] w-[300px] translate-x-[40px] -translate-y-5 rotate-[10deg] rounded-[20px] shadow-[0_30px_60px_-18px_rgba(0,0,0,0.8)] sm:h-[214px] sm:w-[340px] sm:translate-x-[70px] sm:-translate-y-[30px]"
            />
            <div
              aria-hidden="true"
              className="lp-card-azure col-start-1 row-start-1 flex h-[190px] w-[300px] -translate-x-10 translate-y-3 -rotate-[8deg] flex-col justify-between rounded-[20px] px-6 py-[22px] text-white shadow-[0_30px_60px_-18px_rgba(0,0,0,0.8)] sm:h-[214px] sm:w-[340px] sm:-translate-x-[60px] sm:translate-y-5"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-semibold text-white/85">{demo.card.balanceLabel}</span>
                <span className="text-2xl font-extrabold">{demo.card.balance}</span>
              </div>
              <span className="font-lp-mono text-[17px] font-semibold tracking-[0.08em]">{demo.card.number}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setPlaying((value) => !value);
                setStep(0);
              }}
              aria-label={playing ? demo.closeLabel : demo.playLabel}
              className="col-start-1 row-start-1 flex h-[84px] w-[84px] cursor-pointer items-center justify-center rounded-full border border-white/35 bg-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-md"
            >
              {playing ? (
                <X className="h-7 w-7 text-white" strokeWidth={2.5} aria-hidden="true" />
              ) : (
                <Play className="h-[30px] w-[30px] fill-white text-white" aria-hidden="true" />
              )}
            </button>
          </div>

          <h2 className="text-center text-[clamp(24px,3vw,34px)] font-extrabold tracking-[-0.02em]">
            {demo.heading}
          </h2>

          <p
            hidden={playing}
            className={cn('max-w-[560px] text-center text-base text-lp-muted', playing && 'hidden')}
          >
            {demo.idleText}
          </p>

          <div
            hidden={!playing}
            className={cn('w-full max-w-[760px] flex-col gap-4', playing ? 'flex' : 'hidden')}
          >
            <div className="grid grid-cols-3 gap-2.5">
              {demo.steps.map((item, index) => (
                <Button
                  key={item.short}
                  type="button"
                  variant={step === index ? 'primary' : 'outline'}
                  size="md"
                  aria-pressed={step === index}
                  onClick={() => setStep(index)}
                  className={cn(
                    'min-h-[44px] rounded-[10px] text-[15px] font-bold',
                    step === index
                      ? 'shadow-md shadow-[#1D9BF0]/20'
                      : 'border-white/12 bg-transparent text-lp-muted hover:text-white hover:bg-white/5',
                  )}
                >
                  {item.short}
                </Button>
              ))}
            </div>
            {demo.steps.map((item, index) => {
              const isCurrent = step === index;
              return (
                <div
                  key={item.short}
                  role={isCurrent && playing ? 'status' : undefined}
                  hidden={!isCurrent}
                  className={cn(
                    'flex-col gap-2 rounded-[14px] border border-white/8 bg-white/4 px-[22px] py-5',
                    isCurrent ? 'flex' : 'hidden',
                  )}
                >
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-base leading-relaxed text-lp-muted">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
