'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { buttonVariants } from '@/shared/presentation/ui/button';
import { landingContent } from '../../content/landing.id';
import { LandingContainer, LandingIcon } from './landing-ui';

const { nav, brand, a11y } = landingContent;

const navLinkClass =
  'inline-flex min-h-[44px] items-center rounded-lg text-[15px] font-medium text-lp-body no-underline transition-colors hover:text-white motion-reduce:transition-none';

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointer = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [open]);

  return (
    <header className="border-b border-white/8">
      <LandingContainer>
        <nav aria-label={a11y.mainNav} className="flex flex-wrap items-center justify-between gap-4 py-4">
          <a href={brand.href} className="flex items-center gap-2.5 text-white no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-lp-accent text-white">
              <LandingIcon name="wallet" size={20} strokeWidth={2.2} />
            </span>
            <span className="text-[22px] font-extrabold tracking-[-0.02em]">
              {brand.name}
              <span className="font-semibold text-lp-muted">{brand.suffix}</span>
            </span>
          </a>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div ref={wrapperRef} className="relative">
              <button
                type="button"
                aria-expanded={open}
                aria-controls="menu-layanan"
                onClick={() => setOpen((value) => !value)}
                className="flex min-h-[44px] cursor-pointer items-center gap-1.5 text-[15px] font-medium text-lp-body"
              >
                {nav.services.label}
                <ChevronDown
                  className={cn('h-4 w-4 text-lp-muted transition-transform duration-200 motion-reduce:transition-none', open && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>
              {open && (
                <div
                  id="menu-layanan"
                  className="absolute left-0 top-12 z-10 flex w-[260px] flex-col rounded-[14px] border border-white/12 bg-lp-surface p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                >
                  {nav.services.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-[44px] items-center rounded-[10px] px-3 text-[15px] font-semibold text-white no-underline hover:bg-white/5"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {nav.links.map((link) => (
              <a key={link.label} href={link.href} className={navLinkClass}>
                {link.label}
              </a>
            ))}

            <Link
              href={nav.signIn.href}
              className={buttonVariants({
                variant: 'outline',
                size: 'md',
                className: 'min-h-[44px] rounded-xl border-white/20 px-[18px] text-[15px] font-semibold text-white hover:bg-white/5 no-underline',
              })}
            >
              {nav.signIn.label}
            </Link>
            <Link
              href={nav.signUp.href}
              className={buttonVariants({
                variant: 'primary',
                size: 'md',
                className: 'min-h-[44px] rounded-xl px-5 text-[15px] font-bold text-white shadow-md shadow-[#1D9BF0]/20 no-underline',
              })}
            >
              {nav.signUp.label}
            </Link>
          </div>
        </nav>
      </LandingContainer>
    </header>
  );
}
