import { landingContent } from '../../content/landing.id';
import { LandingContainer, LandingIcon } from './landing-ui';

const { partners, a11y } = landingContent;

export function PartnersBar() {
  return (
    <section aria-label={a11y.partnersSection}>
      <LandingContainer className="pb-12">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-2xl border border-white/8 bg-lp-surface px-6 py-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="mr-1.5 text-[13px] font-semibold text-lp-muted">{partners.topUpLabel}</span>
            {partners.methods.map((method) => (
              <span
                key={method}
                className="rounded-lg border border-white/16 px-3 py-1.5 text-[13px] font-bold text-white"
              >
                {method}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2.5 text-[13px] font-semibold text-lp-body">
            <LandingIcon name="shield" size={18} className="shrink-0 text-lp-cyan" />
            {partners.issuerNote}
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
