import { ChevronDown } from 'lucide-react';
import { landingContent } from '../../content/landing.id';
import { SectionTitle } from './landing-ui';

const { faq } = landingContent;

/**
 * Native <details name="faq"> keeps one answer open at a time without JavaScript.
 * The first item starts open, as in the design.
 */
export function FaqSection() {
  return (
    <section id={faq.id} aria-labelledby="faq-heading" className="mx-auto flex w-full max-w-[880px] scroll-mt-4 flex-col gap-8 px-6 pb-24 pt-12">
      <SectionTitle id="faq-heading" className="text-center">
        {faq.heading}
      </SectionTitle>
      <div className="flex flex-col gap-3">
        {faq.items.map((item, index) => (
          <details key={item.id} name="faq" open={index === 0} className="group rounded-[14px] border border-white/8 bg-lp-surface">
            <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 px-[22px] py-[18px] text-left text-[17px] font-bold text-white [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <ChevronDown
                className="h-5 w-5 shrink-0 text-lp-muted transition-transform duration-200 motion-reduce:transition-none group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="px-[22px] pb-5 text-base leading-[1.65] text-lp-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
