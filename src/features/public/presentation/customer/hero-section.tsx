import Link from 'next/link';
import { buttonVariants } from '@/shared/presentation/ui/button';
import { landingContent } from '../../content/landing.id';
import { HeroVisual } from './hero-visual';
import { LandingContainer, LandingIcon } from './landing-ui';

const { hero } = landingContent;

export function HeroSection() {
  return (
    <section id="top" aria-labelledby="hero-heading">
      <LandingContainer className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 pb-16 pt-10 sm:pt-14 lg:pt-[72px]">
        <div className="w-full lg:flex-[1_1_460px] flex flex-col gap-6 max-w-2xl lg:max-w-none">
          <div className="flex items-center gap-2.5 self-start rounded-full border border-white/8 bg-white/6 py-1 pl-1 pr-3.5">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-lp-body">
              {hero.badgeTag}
            </span>
            <LandingIcon name="shield" size={16} className="text-lp-sky" />
            <span className="text-xs font-medium text-lp-body">{hero.badgeText}</span>
          </div>

          <h1
            id="hero-heading"
            className="text-[clamp(38px,5vw,60px)] font-extrabold leading-[1.06] tracking-[-0.035em] text-white text-balance"
          >
            {hero.headline}
          </h1>

          <p className="max-w-[540px] text-lg leading-[1.65] text-lp-muted text-pretty">{hero.subheadline}</p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={hero.primaryCta.href}
              className={buttonVariants({
                variant: 'primary',
                size: 'lg',
                className: 'h-14 rounded-xl px-7 text-lg font-bold shadow-lg shadow-[#1D9BF0]/25 no-underline',
              })}
            >
              {hero.primaryCta.label}
            </Link>
            <a
              href={hero.secondaryCta.href}
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
                className: 'h-14 rounded-xl px-6 text-base font-semibold border-white/20 text-white hover:bg-white/5 no-underline',
              })}
            >
              {hero.secondaryCta.label}
            </a>
          </div>

          <p className="text-sm text-lp-muted">{hero.note}</p>
        </div>

        <div className="w-full lg:flex-[1_1_440px] max-w-2xl lg:max-w-none">
          <HeroVisual />
        </div>
      </LandingContainer>
    </section>
  );
}
