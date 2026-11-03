'use client';

import { useState } from 'react';
import { landingContent } from '../../content/landing.id';
import { Eyebrow, LandingContainer, SectionTitle } from './landing-ui';

const { fees } = landingContent;
const sim = fees.simulator;

const idr = (value: number) => value.toLocaleString('id-ID');

/** Table of fees plus a top-up simulator. Fee amounts are proposals (see content file). */
export function FeesSection() {
  const [amount, setAmount] = useState<number>(sim.defaultAmount);
  const fee = Math.max(sim.minFee, Math.round(amount * sim.feeRate));

  return (
    <section id={fees.id} aria-labelledby="fees-heading" className="scroll-mt-4">
      <LandingContainer className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-24 pt-12">
        <div className="lg:col-span-7 flex flex-col gap-5">
          <Eyebrow>{fees.eyebrow}</Eyebrow>
          <SectionTitle id="fees-heading">{fees.heading}</SectionTitle>
          <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-lp-surface">
            <table className="w-full border-collapse text-left text-[14px] sm:text-[15px] text-lp-strong">
              <thead>
                <tr className="bg-white/4 text-left">
                  <th scope="col" className="px-4 sm:px-[18px] py-3.5 font-bold">
                    {fees.columns.service}
                  </th>
                  <th scope="col" className="px-4 sm:px-[18px] py-3.5 font-bold text-right sm:text-left">
                    {fees.columns.fee}
                  </th>
                </tr>
              </thead>
              <tbody>
                {fees.rows.map((row) => (
                  <tr key={row.service} className="border-t border-white/8">
                    <th scope="row" className="px-4 sm:px-[18px] py-3.5 font-normal">
                      {row.service}
                    </th>
                    <td className="px-4 sm:px-[18px] py-3.5 font-semibold text-right sm:text-left">{row.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-lp-muted">{fees.note}</p>
        </div>

        <div className="lg:col-span-5 lp-glow-card flex flex-col gap-5 rounded-2xl p-6 sm:p-8">
          <h3 className="text-[22px] font-extrabold">{sim.heading}</h3>
          <label htmlFor="amount" className="flex justify-between text-[15px] font-semibold text-lp-strong">
            <span>{sim.amountLabel}</span>
            <span>Rp{idr(amount)}</span>
          </label>
          <input
            id="amount"
            type="range"
            min={sim.min}
            max={sim.max}
            step={sim.step}
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            className="h-11 w-full accent-lp-accent"
          />
          <div className="flex flex-col gap-3.5 rounded-[14px] border border-white/8 bg-white/4 p-5" aria-live="polite">
            <div className="flex justify-between gap-3 text-[15px]">
              <span className="text-lp-muted">{sim.paidLabel}</span>
              <span className="font-bold">Rp{idr(amount)}</span>
            </div>
            <div className="flex justify-between gap-3 text-[15px]">
              <span className="text-lp-muted">{sim.feeLabel}</span>
              <span className="font-bold">Rp{idr(fee)}</span>
            </div>
            <div className="flex justify-between gap-3 border-t border-white/8 pt-3.5 text-base">
              <span className="font-bold">{sim.resultLabel}</span>
              <span className="font-extrabold text-lp-mint">Rp{idr(amount)}</span>
            </div>
          </div>
          <p className="text-sm leading-[1.55] text-lp-muted">{sim.note}</p>
        </div>
      </LandingContainer>
    </section>
  );
}
