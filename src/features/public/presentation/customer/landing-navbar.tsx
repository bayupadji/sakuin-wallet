'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { buttonVariants } from '@/shared/presentation/ui/button';
import { landingContent } from '../../content/landing.id';
import { LandingContainer, LandingIcon } from './landing-ui';

const { nav, brand, a11y } = landingContent;

const navLinkClass =
  'inline-flex min-h-[44px] items-center rounded-lg text-[15px] font-medium text-lp-body no-underline transition-colors hover:text-white motion-reduce:transition-none';

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // Handle keyboard Escape and click outside desktop menu
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setDrawerOpen(false);
      }
    };
    const onPointer = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, []);

  return (
    <header className="border-b border-white/8 relative z-30">
      <LandingContainer>
        <nav aria-label={a11y.mainNav} className="flex items-center justify-between gap-4 py-4">
          {/* Brand Logo */}
          <a href={brand.href} className="flex items-center gap-2.5 text-white no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-lp-accent text-white shadow-xs shadow-[#1D9BF0]/30">
              <LandingIcon name="wallet" size={20} strokeWidth={2.2} />
            </span>
            <span className="text-[22px] font-extrabold tracking-[-0.02em]">
              {brand.name}
              <span className="font-semibold text-lp-muted">{brand.suffix}</span>
            </span>
          </a>

          {/* Desktop Navigation Links (hidden on mobile & tablet, visible on lg+) */}
          <div className="hidden lg:flex items-center gap-x-6 gap-y-2">
            <div ref={wrapperRef} className="relative">
              <button
                type="button"
                aria-expanded={open}
                aria-controls="menu-layanan"
                onClick={() => setOpen((value) => !value)}
                className="flex min-h-[44px] cursor-pointer items-center gap-1.5 text-[15px] font-medium text-lp-body hover:text-white transition-colors"
              >
                {nav.services.label}
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-lp-muted transition-transform duration-200 motion-reduce:transition-none',
                    open && 'rotate-180'
                  )}
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
                      className="flex min-h-[44px] items-center rounded-[10px] px-3 text-[15px] font-semibold text-white no-underline hover:bg-white/5 transition-colors"
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
                className:
                  'min-h-[44px] rounded-xl border-white/20 px-[18px] text-[15px] font-semibold text-white hover:bg-white/5 no-underline',
              })}
            >
              {nav.signIn.label}
            </Link>
            <Link
              href={nav.signUp.href}
              className={buttonVariants({
                variant: 'primary',
                size: 'md',
                className:
                  'min-h-[44px] rounded-xl px-5 text-[15px] font-bold text-white shadow-md shadow-[#1D9BF0]/20 no-underline',
              })}
            >
              {nav.signUp.label}
            </Link>
          </div>

          {/* Mobile & Tablet Actions: Quick CTAs + Hamburger Button (visible on mobile & tablet <lg) */}
          <div className="flex lg:hidden items-center gap-2.5 sm:gap-3">
            <Link
              href={nav.signIn.href}
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: 'hidden sm:inline-flex min-h-[40px] px-3 text-sm font-semibold text-lp-body hover:text-white no-underline',
              })}
            >
              {nav.signIn.label}
            </Link>
            <Link
              href={nav.signUp.href}
              className={buttonVariants({
                variant: 'primary',
                size: 'sm',
                className: 'min-h-[40px] px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-[#1D9BF0]/20 no-underline',
              })}
            >
              {nav.signUp.label}
            </Link>
            <button
              type="button"
              aria-label={drawerOpen ? a11y.closeMenu : a11y.openMenu}
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setDrawerOpen((prev) => !prev)}
              className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl border border-white/12 bg-white/5 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#1D9BF0]"
            >
              {drawerOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </LandingContainer>

      {/* Mobile & Tablet Drawer Backdrop Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/75 backdrop-blur-xs transition-opacity duration-300 lg:hidden',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile & Tablet Drawer Slide-over Panel */}
      <div
        id="mobile-nav-drawer"
        role={drawerOpen ? 'dialog' : undefined}
        aria-modal={drawerOpen ? true : undefined}
        aria-label={a11y.mainNav}
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-[320px] sm:max-w-[360px] flex-col justify-between border-l border-white/10 bg-[#0F1115] p-6 sm:p-7 shadow-2xl transition-transform duration-300 ease-out lg:hidden',
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/8 pb-4">
          <a
            href={brand.href}
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-2.5 text-white no-underline"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-lp-accent text-white">
              <LandingIcon name="wallet" size={18} strokeWidth={2.2} />
            </span>
            <span className="text-xl font-extrabold tracking-[-0.02em]">
              {brand.name}
              <span className="font-semibold text-lp-muted">{brand.suffix}</span>
            </span>
          </a>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#1D9BF0] cursor-pointer"
            aria-label={a11y.closeMenu}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4">
          {/* Collapsible Layanan */}
          <div className="rounded-xl border border-white/8 bg-white/3 p-3">
            <button
              type="button"
              onClick={() => setMobileServicesOpen((prev) => !prev)}
              className="flex w-full min-h-[44px] items-center justify-between text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer"
            >
              <span>{nav.services.label}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-lp-muted transition-transform duration-200',
                  mobileServicesOpen && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>
            {mobileServicesOpen && (
              <div className="mt-2 space-y-1 pl-1 border-t border-white/6 pt-2">
                {nav.services.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex min-h-[44px] items-center rounded-lg px-2 text-[15px] font-medium text-lp-body hover:text-white hover:bg-white/5 no-underline transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Direct Links */}
          <div className="flex flex-col space-y-1">
            {nav.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className="flex min-h-[48px] items-center rounded-xl px-3.5 text-base font-medium text-lp-body hover:text-white hover:bg-white/5 no-underline transition-colors border border-transparent hover:border-white/6"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="border-t border-white/8 pt-5 space-y-3">
          <Link
            href={nav.signIn.href}
            onClick={() => setDrawerOpen(false)}
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className:
                'w-full justify-center min-h-[48px] rounded-xl border-white/20 text-base font-semibold text-white hover:bg-white/5 no-underline',
            })}
          >
            {nav.signIn.label}
          </Link>
          <Link
            href={nav.signUp.href}
            onClick={() => setDrawerOpen(false)}
            className={buttonVariants({
              variant: 'primary',
              size: 'lg',
              className:
                'w-full justify-center min-h-[48px] rounded-xl text-base font-bold text-white shadow-lg shadow-[#1D9BF0]/25 no-underline',
            })}
          >
            {nav.signUp.label}
          </Link>
          <p className="text-center text-[11px] text-lp-muted pt-1">
            Didukung Mitra Berlisensi PJP 1 Bank Indonesia
          </p>
        </div>
      </div>
    </header>
  );
}
