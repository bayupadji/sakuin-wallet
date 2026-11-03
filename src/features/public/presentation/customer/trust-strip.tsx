import { landingContent, } from '../../content/landing.id';
import { LandingContainer, LandingIcon, type IconName } from './landing-ui';

const { trustStrip, a11y } = landingContent;

export function TrustStrip() {
  return (
    <section aria-label={a11y.trustSection} className="border-y border-white/8">
      <LandingContainer className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-4 py-6">
        {trustStrip.map((item) => (
          <div key={item.text} className="flex items-center gap-3 text-[15px] font-semibold text-lp-body">
            <LandingIcon name={item.icon as IconName} size={22} className="shrink-0 text-lp-cyan" />
            {item.text}
          </div>
        ))}
      </LandingContainer>
    </section>
  );
}
