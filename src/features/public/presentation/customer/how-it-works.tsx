import { cn } from '@/shared/utils/cn';
import { landingContent } from '../../content/landing.id';
import { Eyebrow, LandingContainer, SectionTitle, surfaceCardClass } from './landing-ui';

const { how } = landingContent;

export function HowItWorks() {
  return (
    <section id={how.id} aria-labelledby="how-heading" className="scroll-mt-4">
      <LandingContainer className="flex flex-col gap-10 pb-16 pt-12">
        <div className="flex max-w-[720px] flex-col gap-3.5">
          <Eyebrow>{how.eyebrow}</Eyebrow>
          <SectionTitle id="how-heading">{how.heading}</SectionTitle>
        </div>
        <ol className="grid list-none grid-cols-1 md:grid-cols-3 gap-5 p-0">
          {how.steps.map((step, index) => (
            <li key={step.title} className={cn(surfaceCardClass, 'flex flex-col gap-3.5 p-7')}>
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-lp-accent text-[17px] font-extrabold text-lp-bg"
              >
                {index + 1}
              </span>
              <h3 className="text-xl font-bold">
                <span className="sr-only">{`Langkah ${index + 1}: `}</span>
                {step.title}
              </h3>
              <p className="text-base leading-relaxed text-lp-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </LandingContainer>
    </section>
  );
}
