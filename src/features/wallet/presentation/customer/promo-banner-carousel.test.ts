import { describe, it, expect } from 'vitest';
import { PromoBannerCarousel } from './promo-banner-carousel';
import { PROMO_DETAILS, PromoDetailModal } from './promo-detail-modal';

describe('PromoBannerCarousel & PromoDetailModal', () => {
  it('is a valid React component function', () => {
    expect(typeof PromoBannerCarousel).toBe('function');
    expect(typeof PromoDetailModal).toBe('function');
  });

  it('contains comprehensive detail for all three promo banners', () => {
    const bannerIds = ['banner-visa-platinum', 'banner-topup-fx', 'banner-receive-pay'];

    for (const id of bannerIds) {
      const detail = PROMO_DETAILS[id];
      expect(detail).toBeDefined();
      expect(detail.title).toBeTruthy();
      expect(detail.headline).toBeTruthy();
      expect(detail.summary).toBeTruthy();
      expect(detail.period).toBeTruthy();
      expect(detail.steps.length).toBeGreaterThan(0);
      expect(detail.terms.length).toBeGreaterThan(0);
      expect(detail.ctaText).toBeTruthy();
    }
  });

  it('has valid promo codes where applicable', () => {
    expect(PROMO_DETAILS['banner-visa-platinum'].promoCode).toBe('SAKUINVISA');
    expect(PROMO_DETAILS['banner-topup-fx'].promoCode).toBe('BEBASMARKUP');
    expect(PROMO_DETAILS['banner-receive-pay'].promoCode).toBe('GLOBALINVOICE');
  });
});
