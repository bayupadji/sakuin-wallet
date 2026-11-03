import { cn } from '@/shared/utils/cn';
import { landingContent } from '../../content/landing.id';
import { DemoShowcase } from './demo-showcase';
import { FaqSection } from './faq-section';
import { FeesSection } from './fees-section';
import { FinalCta } from './final-cta';
import { HeroSection } from './hero-section';
import { HowItWorks } from './how-it-works';
import { KreditPlanner } from './kredit-planner';
import { LandingFooter } from './landing-footer';
import { LandingNavbar } from './landing-navbar';
import { PartnersBar } from './partners-bar';
import { PathFinder } from './path-finder';
import { ProblemsSection } from './problems-section';
import { ProductsSection } from './products-section';
import { SecuritySection } from './security-section';
import { TrustStrip } from './trust-strip';

/** Public landing page. Dark, self-contained theme from the design file "Sakuin Landing Page". */
export function LandingPage() {
  return (
    <div
      className={cn(
        'min-h-screen w-full overflow-x-hidden bg-lp-bg font-lp-sans text-white antialiased',
        '[&_a:focus-visible]:outline-[3px] [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-lp-sky',
        '[&_button:focus-visible]:outline-[3px] [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-lp-sky',
        '[&_input:focus-visible]:outline-[3px] [&_input:focus-visible]:outline-offset-2 [&_input:focus-visible]:outline-lp-sky',
        '[&_summary:focus-visible]:outline-[3px] [&_summary:focus-visible]:outline-offset-2 [&_summary:focus-visible]:outline-lp-sky',
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-lp-surface focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        {landingContent.a11y.skipToContent}
      </a>
      <LandingNavbar />
      <main id="main">
        <HeroSection />
        <PartnersBar />
        <DemoShowcase />
        <TrustStrip />
        <ProblemsSection />
        <HowItWorks />
        <KreditPlanner />
        <PathFinder />
        <ProductsSection />
        <FeesSection />
        <SecuritySection />
        <FaqSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
