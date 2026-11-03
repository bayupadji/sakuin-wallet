import { cn } from '@/shared/utils/cn';
import { landingContent } from '../../content/landing.id';

const { hero, a11y } = landingContent;
const visual = hero.visual;

const layer = 'col-start-1 row-start-1';
const mono = 'font-lp-mono';

function ChipPlaceholder({ className }: { className: string }) {
  return <span aria-hidden="true" className={cn('h-[26px] w-[34px] rounded-md', className)} />;
}

/**
 * Hero composition: phone mockup with three virtual cards fanned around it.
 * All values are sample data from the design file. Scaled down below `sm` so the cards stay inside the panel.
 */
export function HeroVisual() {
  return (
    <div
      role="img"
      aria-label={a11y.heroVisual}
      className="lp-glow-card relative grid min-h-[440px] place-items-center overflow-hidden rounded-2xl sm:min-h-[600px]"
    >
      <div aria-hidden="true" className={cn(layer, 'lp-stripes w-[46%] self-stretch justify-self-end')} />
      <svg
        aria-hidden="true"
        width="260"
        height="260"
        viewBox="0 0 260 260"
        fill="none"
        className={cn(layer, 'self-end justify-self-start')}
      >
        <circle cx="0" cy="260" r="90" stroke="rgba(34, 211, 238, 0.35)" />
        <circle cx="0" cy="260" r="135" stroke="rgba(34, 211, 238, 0.25)" />
        <circle cx="0" cy="260" r="180" stroke="rgba(34, 211, 238, 0.16)" />
        <circle cx="0" cy="260" r="225" stroke="rgba(34, 211, 238, 0.1)" />
      </svg>

      <div aria-hidden="true" className={cn(layer, 'grid origin-center scale-[0.6] place-items-center sm:scale-100')}>
        {/* Lavender card (behind) */}
        <div
          className={cn(
            layer,
            'lp-card-lavender flex h-[151px] w-[240px] translate-x-[150px] -translate-y-[190px] rotate-[14deg] flex-col justify-between rounded-2xl p-4 text-[#1e1b4b] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.7)]',
          )}
        >
          <span className="text-[11px] font-bold">{visual.lavender.label}</span>
          <span className={cn(mono, 'text-[13px] font-semibold tracking-[0.06em]')}>{visual.lavender.number}</span>
        </div>

        {/* Phone mockup */}
        <div
          className={cn(
            layer,
            'flex h-[530px] w-[250px] flex-col gap-3.5 rounded-[40px] border border-white/14 bg-lp-bg px-4 py-[18px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]',
          )}
        >
          <span className="h-1.5 w-[72px] self-center rounded-full bg-white/14" />
          <span className="text-xs font-semibold text-lp-muted">{visual.appLabel}</span>
          <span className="-mt-2 text-[26px] font-extrabold tracking-[-0.02em]">{visual.appBalance}</span>
          <div className="grid grid-cols-2 gap-2">
            {visual.appActions.map((action) => (
              <span
                key={action}
                className="rounded-xl bg-white/6 px-1 py-2.5 text-center text-[11px] font-semibold text-lp-body"
              >
                {action}
              </span>
            ))}
          </div>
          <span className="mt-1 text-xs font-semibold text-lp-muted">{visual.appTxTitle}</span>
          <div className="flex flex-col gap-2.5">
            {visual.appTx.map((tx) => (
              <div key={tx.label} className="flex justify-between text-xs">
                <span className="text-lp-body">{tx.label}</span>
                <span className={cn('font-bold', tx.tone === 'positive' && 'text-lp-mint')}>{tx.value}</span>
              </div>
            ))}
          </div>
          <span className="mt-auto text-center text-[10px] text-lp-muted">{a11y.sampleApp}</span>
        </div>

        {/* Azure card (left, front) */}
        <div
          className={cn(
            layer,
            'lp-card-azure flex h-[177px] w-[280px] -translate-x-[150px] translate-y-20 -rotate-12 flex-col justify-between rounded-[18px] px-5 py-[18px] text-white shadow-[0_30px_60px_-18px_rgba(0,0,0,0.75)]',
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-white/85">{visual.azure.label}</span>
              <span className="text-xl font-extrabold">{visual.azure.value}</span>
            </div>
            <ChipPlaceholder className="bg-white/35" />
          </div>
          <span className={cn(mono, 'text-[15px] font-semibold tracking-[0.08em]')}>{visual.azure.number}</span>
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-semibold text-white/85">{visual.validThru}</span>
              <span className={cn(mono, 'text-xs font-semibold')}>{visual.azure.valid}</span>
            </div>
            <span className="rounded-md border border-dashed border-white/70 px-1.5 py-1 text-[8px] font-bold tracking-[0.04em]">
              {visual.networkLogo}
            </span>
          </div>
        </div>

        {/* Pearl card (right, front) */}
        <div
          className={cn(
            layer,
            'lp-card-pearl flex h-[177px] w-[280px] translate-x-[160px] translate-y-[170px] rotate-[9deg] flex-col justify-between rounded-[18px] px-5 py-[18px] text-[#0f172a] shadow-[0_30px_60px_-18px_rgba(0,0,0,0.75)]',
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-[#334155]">{visual.pearl.label}</span>
              <span className="text-xl font-extrabold">{visual.pearl.value}</span>
            </div>
            <ChipPlaceholder className="bg-[#0f172a]/15" />
          </div>
          <span className={cn(mono, 'text-[15px] font-semibold tracking-[0.08em]')}>{visual.pearl.number}</span>
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-semibold text-[#334155]">{visual.validThru}</span>
              <span className={cn(mono, 'text-xs font-semibold')}>{visual.pearl.valid}</span>
            </div>
            <span className="rounded-md border border-dashed border-[#0f172a]/55 px-1.5 py-1 text-[8px] font-bold tracking-[0.04em]">
              {visual.networkLogo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
