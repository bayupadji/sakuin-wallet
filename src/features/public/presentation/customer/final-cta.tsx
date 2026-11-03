import { Button } from '@/shared/presentation/ui/button';
import { landingContent } from '../../content/landing.id';
import { LandingContainer } from './landing-ui';

const { finalCta, a11y } = landingContent;

/** Plain GET form: the email is carried to the sign-up page. No waitlist is stored, so no success is faked. */
export function FinalCta() {
  return (
    <section id={finalCta.id} aria-labelledby="final-cta-heading" className="px-6 pb-24">
      <LandingContainer className="px-0">
        <div className="lp-glow-card-violet flex flex-col items-center gap-[18px] rounded-2xl p-[clamp(32px,6vw,72px)] text-center">
          <h2
            id="final-cta-heading"
            className="max-w-[760px] text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance"
          >
            {finalCta.heading}
          </h2>
          <p className="max-w-[600px] text-lg text-lp-muted text-pretty">{finalCta.body}</p>
          <form action={finalCta.action} method="get" className="mt-2 flex w-full max-w-[560px] flex-wrap justify-center gap-3">
            <label htmlFor="cta-email" className="sr-only">
              {a11y.emailLabel}
            </label>
            <input
              id="cta-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={finalCta.emailPlaceholder}
              className="h-14 min-w-0 flex-[1_1_260px] rounded-xl border border-white/18 bg-white/4 px-[18px] text-base text-white placeholder:text-lp-muted focus:border-[#1D9BF0] focus:outline-none focus:ring-2 focus:ring-[#1D9BF0]/30"
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="h-14 rounded-xl px-7 text-lg font-bold shadow-lg shadow-[#1D9BF0]/25 cursor-pointer"
            >
              {finalCta.submit}
            </Button>
          </form>
        </div>
      </LandingContainer>
    </section>
  );
}
