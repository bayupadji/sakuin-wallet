import { cn } from '@/shared/utils/cn';
import { landingContent } from '../../content/landing.id';
import { Eyebrow, IconTile, LandingContainer, SectionTitle, surfaceCardClass, type IconName } from './landing-ui';

const { products } = landingContent;

export function ProductsSection() {
  return (
    <section id={products.id} aria-labelledby="products-heading" className="scroll-mt-4">
      <LandingContainer className="flex flex-col gap-10 pb-24 pt-12">
        <div className="flex max-w-[720px] flex-col gap-3.5">
          <Eyebrow>{products.eyebrow}</Eyebrow>
          <SectionTitle id="products-heading">{products.heading}</SectionTitle>
          <p className="text-lg leading-relaxed text-lp-muted">{products.body}</p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {products.core.map((item) => (
            <li
              key={item.id}
              id={item.id}
              className="lp-glow-card flex flex-col gap-3.5 rounded-2xl p-7 scroll-mt-24"
            >
              <IconTile name={item.icon as IconName} />
              <h3 className="text-[22px] font-extrabold">{item.title}</h3>
              <p className="text-base leading-relaxed text-lp-muted">{item.body}</p>
              <ul className="flex flex-col gap-2 text-[15px] text-lp-strong">
                {item.points.map((point) => (
                  <li key={point}>
                    <span aria-hidden="true">✓ </span>
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="text-[15px] text-lp-muted">{products.alsoLabel}</p>
        <ul className="-mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {products.also.map((item) => (
            <li key={item.title} className={cn(surfaceCardClass, 'flex flex-col gap-3 p-7')}>
              <IconTile name={item.icon as IconName} />
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-base leading-relaxed text-lp-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </LandingContainer>
    </section>
  );
}
