import { describe, it, expect, beforeEach } from 'vitest';
import { formatBytes } from './application/services/image-compressor';
import { usePromoBannerStore } from './application/stores/use-promo-banner-store';

describe('Image Compressor Utilities', () => {
  it('formats byte sizes correctly', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(2.5 * 1024 * 1024)).toBe('2.5 MB');
  });
});

describe('Promo Banner Store & CMS State', () => {
  beforeEach(() => {
    usePromoBannerStore.getState().resetToDefault();
  });

  it('initializes with seed promo banners', () => {
    const banners = usePromoBannerStore.getState().banners;
    expect(banners.length).toBeGreaterThanOrEqual(3);
    expect(banners[0].id).toBe('banner-visa-platinum');
    expect(banners[0].isActive).toBe(true);
  });

  it('can toggle banner active status', () => {
    const { toggleBannerStatus } = usePromoBannerStore.getState();
    const targetId = 'banner-visa-platinum';

    toggleBannerStatus(targetId);
    let banner = usePromoBannerStore.getState().banners.find((b) => b.id === targetId);
    expect(banner?.isActive).toBe(false);

    toggleBannerStatus(targetId);
    banner = usePromoBannerStore.getState().banners.find((b) => b.id === targetId);
    expect(banner?.isActive).toBe(true);
  });

  it('can add a new banner with compression metadata', () => {
    const { addBanner } = usePromoBannerStore.getState();

    const created = addBanner({
      title: 'Promo Spesial Imlek 2026',
      badge: 'CASHBACK VALAS',
      headline: 'Dapatkan Saldo Bonus USD',
      summary: 'Cashback langsung 5% setiap top up via QRIS.',
      period: '1 - 28 Februari 2026',
      imageSrc: 'data:image/webp;base64,mockCompressedImage',
      alt: 'Promo Spesial Imlek 2026',
      steps: ['Buka menu Top Up', 'Pilih QRIS'],
      terms: ['Maksimal cashback $10 USD'],
      ctaText: 'Klaim Sekarang',
      actionType: 'topup',
      isActive: true,
      originalImageSizeFormatted: '3.4 MB',
      compressedImageSizeFormatted: '92 KB',
      compressionSavingsPercent: 97,
    });

    expect(created.id).toBeTruthy();
    expect(created.order).toBeGreaterThanOrEqual(4);
    expect(created.compressionSavingsPercent).toBe(97);

    const all = usePromoBannerStore.getState().banners;
    expect(all.some((b) => b.id === created.id)).toBe(true);
  });

  it('can update an existing banner', () => {
    const { updateBanner } = usePromoBannerStore.getState();
    const targetId = 'banner-topup-fx';

    updateBanner(targetId, {
      title: 'Top Up Bebas Biaya Khusus Hari Ini',
      headline: 'Kurs 100% Murni Tanpa Potongan',
    });

    const updated = usePromoBannerStore.getState().banners.find((b) => b.id === targetId);
    expect(updated?.title).toBe('Top Up Bebas Biaya Khusus Hari Ini');
    expect(updated?.headline).toBe('Kurs 100% Murni Tanpa Potongan');
  });

  it('can delete a banner', () => {
    const { deleteBanner } = usePromoBannerStore.getState();
    const targetId = 'banner-receive-pay';

    deleteBanner(targetId);
    const exists = usePromoBannerStore.getState().banners.some((b) => b.id === targetId);
    expect(exists).toBe(false);
  });

  it('can reorder banners', () => {
    const { reorderBanners, banners } = usePromoBannerStore.getState();
    const firstId = banners[0].id;
    const secondId = banners[1].id;

    reorderBanners([secondId, firstId]);

    const stateBanners = usePromoBannerStore.getState().banners;
    expect(stateBanners[0].id).toBe(secondId);
    expect(stateBanners[0].order).toBe(1);
    expect(stateBanners[1].id).toBe(firstId);
    expect(stateBanners[1].order).toBe(2);
  });

  it('records impressions and clicks', () => {
    const { recordClick, recordView } = usePromoBannerStore.getState();
    const targetId = 'banner-visa-platinum';

    const initial = usePromoBannerStore.getState().banners.find((b) => b.id === targetId)!;
    const initialClicks = initial.clickCount;
    const initialViews = initial.viewCount;

    recordClick(targetId);
    recordView(targetId);

    const updated = usePromoBannerStore.getState().banners.find((b) => b.id === targetId)!;
    expect(updated.clickCount).toBe(initialClicks + 1);
    expect(updated.viewCount).toBe(initialViews + 1);
  });
});
