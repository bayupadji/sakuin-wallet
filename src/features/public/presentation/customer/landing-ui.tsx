import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Button, buttonVariants } from '@/shared/presentation/ui/button';

export { Button, buttonVariants };

/** Shared building blocks for the landing page sections (design file "Sakuin Landing Page"). */

export function LandingContainer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-[1200px] px-6', className)} {...props} />;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-bold uppercase tracking-[0.06em] text-lp-cyan">{children}</p>
  );
}

export function SectionTitle({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        'text-[clamp(30px,3.6vw,44px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-balance',
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** Standard primary button class using existing buttonVariants tokens. */
export const primaryButtonClass = buttonVariants({
  variant: 'primary',
  className: 'rounded-xl font-bold no-underline',
});

/** Standard outline button class using existing buttonVariants tokens. */
export const outlineButtonClass = buttonVariants({
  variant: 'outline',
  className: 'rounded-xl font-semibold no-underline border-white/20 hover:bg-white/5 text-white',
});

export const surfaceCardClass = 'rounded-2xl border border-white/8 bg-lp-surface';

export type IconName = 'card' | 'bolt' | 'qr' | 'gift' | 'code' | 'cloud' | 'shield' | 'lock' | 'clock' | 'wallet';

const paths: Record<IconName, React.ReactNode> = {
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4" />
    </>
  ),
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path d="M14 14h3v3h-3z" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13M3 12h18" />
    </>
  ),
  code: <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" />,
  cloud: <path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z" />,
  shield: <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />,
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </>
  ),
};

/** Decorative line icon. Always hidden from assistive tech; pair it with visible text. */
export function LandingIcon({
  name,
  size = 24,
  className,
  strokeWidth = 2,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

export function IconTile({ name }: { name: IconName }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-lp-cyan/12 text-lp-sky-soft">
      <LandingIcon name={name} />
    </span>
  );
}
