import { landingContent, type FooterLink } from '../../content/landing.id';
import { LandingContainer } from './landing-ui';

const { footer, brand, a11y } = landingContent;

const linkClass = 'inline-flex min-h-[44px] items-center text-[15px] text-lp-body no-underline hover:text-white';

function FooterItem({ link }: { link: FooterLink }) {
  if (link.href) {
    return (
      <a href={link.href} className={linkClass}>
        {link.label}
      </a>
    );
  }
  return (
    <span className="inline-flex min-h-[44px] items-center gap-2 text-[15px] text-lp-muted">
      {link.label}
      <span className="rounded-full border border-white/16 px-2 py-0.5 text-xs">{footer.soon}</span>
    </span>
  );
}

function FooterColumn({ label, title, links }: { label: string; title: string; links: readonly FooterLink[] }) {
  return (
    <nav aria-label={label} className="flex flex-col">
      <span className="mb-1.5 font-bold">{title}</span>
      {links.map((link) => (
        <FooterItem key={link.label} link={link} />
      ))}
    </nav>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-white/8">
      <LandingContainer className="flex flex-col gap-8 pb-10 pt-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 flex flex-col gap-3">
            <span className="text-[22px] font-extrabold">
              {brand.name}
              <span className="font-semibold text-lp-muted">{brand.suffix}</span>
            </span>
            <p className="max-w-[520px] text-sm leading-[1.7] text-lp-body">{footer.legal}</p>
            <p className="max-w-[520px] text-[13px] leading-[1.7] text-lp-muted">{footer.regulatory}</p>
          </div>
          <div className="col-span-1">
            <FooterColumn label={a11y.footerServices} title={footer.services.title} links={footer.services.links} />
          </div>
          <div className="col-span-1">
            <FooterColumn label={a11y.footerSupport} title={footer.support.title} links={footer.support.links} />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6">
          <span className="text-[13px] text-lp-muted">{footer.copyright}</span>
          <div className="flex flex-wrap gap-2.5">
            {footer.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-lg border border-dashed border-white/25 px-3 py-1.5 text-xs font-bold text-lp-body"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
        <p className="max-w-[920px] text-[13px] leading-[1.7] text-lp-muted">{footer.disclaimer}</p>
      </LandingContainer>
    </footer>
  );
}
