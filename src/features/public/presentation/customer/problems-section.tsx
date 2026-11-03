import { landingContent } from '../../content/landing.id';
import { Eyebrow, LandingContainer, SectionTitle, surfaceCardClass } from './landing-ui';
import { cn } from '@/shared/utils/cn';

const { problems } = landingContent;

export function ProblemsSection() {
  return (
    <section aria-labelledby="problems-heading">
      <LandingContainer className="flex flex-col gap-10 pb-12 pt-24">
        <div className="flex max-w-[720px] flex-col gap-3.5">
          <Eyebrow>{problems.eyebrow}</Eyebrow>
          <SectionTitle id="problems-heading">{problems.heading}</SectionTitle>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {problems.items.map((item) => (
            <li key={item.title} className={cn(surfaceCardClass, 'flex flex-col gap-2.5 p-7')}>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-base leading-relaxed text-lp-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </LandingContainer>
    </section>
  );
}
