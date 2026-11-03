import { cn } from '@/shared/utils/cn';
import { landingContent } from '../../content/landing.id';
import { Eyebrow, LandingContainer, SectionTitle, surfaceCardClass } from './landing-ui';

const { security } = landingContent;

export function SecuritySection() {
  return (
    <section id={security.id} aria-labelledby="security-heading" className="scroll-mt-4">
      <LandingContainer className="flex flex-col gap-10 pb-24 pt-12">
        <div className="flex max-w-[720px] flex-col gap-3.5">
          <Eyebrow>{security.eyebrow}</Eyebrow>
          <SectionTitle id="security-heading">{security.heading}</SectionTitle>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {security.items.map((item) => (
            <li
              key={item.title}
              className={cn(
                'flex flex-col gap-2.5 rounded-2xl p-7',
                item.featured ? 'lp-glow-card' : surfaceCardClass,
              )}
            >
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-[15px] leading-relaxed text-lp-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </LandingContainer>
    </section>
  );
}
