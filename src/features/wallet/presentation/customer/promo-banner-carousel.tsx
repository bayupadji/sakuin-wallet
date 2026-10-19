'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { PromoDetailModal } from './promo-detail-modal';
import { usePromoBannerStore } from '../../application/stores/use-promo-banner-store';

export interface PromoImageBanner {
  id: string;
  title: string;
  alt: string;
  imageSrc: string;
  ctaHref?: string;
  actionType?: 'topup' | 'receive';
}

const PROMO_BANNERS: PromoImageBanner[] = [
  {
    id: 'banner-visa-platinum',
    title: 'Kartu Debit Virtual VISA Platinum',
    alt: 'Promo Kartu Debit Virtual VISA Platinum Sakuin Dompet Digital Dollar untuk Transaksi Global',
    imageSrc: '/banners/promo-visa-card.jpg',
    ctaHref: '/card',
  },
  {
    id: 'banner-topup-fx',
    title: 'Top Up Rupiah ke Saldo USD Real-Time',
    alt: 'Promo Top Up Rupiah ke USD Instan via Virtual Account BCA dan QRIS Bebas Margin Valas',
    imageSrc: '/banners/promo-topup-fx.jpg',
    actionType: 'topup',
  },
  {
    id: 'banner-receive-pay',
    title: 'Terima Pembayaran Global Instan ke USD',
    alt: 'Promo Terima Pembayaran Global dan Tagihan Freelancer Otomatis Jadi Saldo USD',
    imageSrc: '/banners/promo-receive-pay.jpg',
    actionType: 'receive',
  },
];

export interface PromoBannerCarouselProps {
  onTopUpClick?: () => void;
  onReceiveClick?: () => void;
  className?: string;
  autoPlayIntervalMs?: number;
}

export function PromoBannerCarousel({
  onTopUpClick,
  onReceiveClick,
  className,
  autoPlayIntervalMs = 4500,
}: PromoBannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPromoId, setSelectedPromoId] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const storeBanners = usePromoBannerStore((state) => state.banners);
  const recordBannerClick = usePromoBannerStore((state) => state.recordClick);
  const recordBannerView = usePromoBannerStore((state) => state.recordView);

  const activeBanners = useMemo(() => {
    const list = storeBanners
      .filter((b) => b.isActive)
      .sort((a, b) => a.order - b.order);
    return list.length > 0 ? list : PROMO_BANNERS;
  }, [storeBanners]);

  const totalSlides = activeBanners.length;

  useEffect(() => {
    if (activeBanners[currentSlide]) {
      recordBannerView(activeBanners[currentSlide].id);
    }
  }, [currentSlide, activeBanners, recordBannerView]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Automatic auto-scroll timer with pause handling (also pause when modal is open)
  useEffect(() => {
    if (isPaused || selectedPromoId !== null) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayIntervalMs);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, selectedPromoId, nextSlide, autoPlayIntervalMs]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  function handleBannerClick(banner: { id: string }) {
    recordBannerClick(banner.id);
    setSelectedPromoId(banner.id);
  }

  function handlePromoAction(actionType?: import('../../domain/entities/promo-banner').PromoActionType) {
    if (actionType === 'topup' && onTopUpClick) {
      onTopUpClick();
    } else if (actionType === 'receive' && onReceiveClick) {
      onReceiveClick();
    }
  }

  return (
    <>
      <section
        aria-roledescription="carousel"
        aria-label="Banner Promo Gambar Sakuin"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        className={cn(
          'group relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#0c121e] shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
          className
        )}
      >
        {/* Sliding Track for pure image banners */}
        <div
          className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {PROMOBANNERS_MAPPED(activeBanners, handleBannerClick)}
        </div>

        {/* Floating Navigation Controls (Previous & Next Arrow Buttons) */}
        <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
          <button
            type="button"
            onClick={prevSlide}
            className="pointer-events-auto flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-950/70 text-white backdrop-blur-md border border-slate-700/60 shadow-lg opacity-80 sm:opacity-0 group-hover:opacity-100 hover:bg-slate-900 hover:scale-105 transition-all cursor-pointer focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-teal-400"
            aria-label="Slide banner sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none">
          <button
            type="button"
            onClick={nextSlide}
            className="pointer-events-auto flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-950/70 text-white backdrop-blur-md border border-slate-700/60 shadow-lg opacity-80 sm:opacity-0 group-hover:opacity-100 hover:bg-slate-900 hover:scale-105 transition-all cursor-pointer focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-teal-400"
            aria-label="Slide banner berikutnya"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Floating Bottom Center Bar: Dot Pagination */}
        <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-950/80 px-2.5 py-1 backdrop-blur-md shadow-xl z-20">
          <div className="flex items-center gap-1.5">
            {activeBanners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 cursor-pointer min-h-[6px]',
                  currentSlide === index
                    ? 'w-5 bg-teal-400 shadow-sm shadow-teal-400/50'
                    : 'w-1.5 bg-slate-600 hover:bg-slate-400'
                )}
                aria-label={`Lihat banner ${index + 1}: ${banner.title}`}
                aria-current={currentSlide === index ? 'true' : 'false'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Detail Modal */}
      <PromoDetailModal
        promoId={selectedPromoId}
        isOpen={selectedPromoId !== null}
        onClose={() => setSelectedPromoId(null)}
        onActionClick={handlePromoAction}
      />
    </>
  );
}

function PROMOBANNERS_MAPPED(
  banners: Array<{ id: string; title: string; alt: string; imageSrc: string }>,
  onBannerClick: (banner: { id: string }) => void
) {
  return banners.map((banner) => {
    const ImageContent = (
      <div className="relative w-full h-36 sm:h-44 md:h-48 lg:h-52 overflow-hidden bg-slate-950">
        <Image
          src={banner.imageSrc}
          alt={banner.alt}
          fill
          unoptimized={banner.imageSrc.startsWith('data:')}
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 90vw, 1152px"
          className="object-cover object-left sm:object-center transition-transform duration-500 group-hover:scale-[1.01]"
        />
        {/* Subtle dark gradient overlay at the bottom for dot visibility */}
        <div
          className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>
    );

    return (
      <div key={banner.id} className="w-full shrink-0">
        <button
          type="button"
          onClick={() => onBannerClick(banner)}
          className="block w-full text-left focus:outline-none cursor-pointer p-0 border-0 bg-transparent group/btn"
          aria-label={`Buka rincian promo: ${banner.title}`}
        >
          {ImageContent}
        </button>
      </div>
    );
  });
}
