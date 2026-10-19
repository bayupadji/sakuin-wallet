/**
 * Entity Domain untuk Promo Banner pada Dompet Digital Sakuin
 */

export type PromoActionType = 'topup' | 'receive' | 'card' | 'custom';

export interface PromoBannerItem {
  id: string;
  badge: string;
  title: string;
  headline: string;
  summary: string;
  period: string;
  promoCode?: string;
  imageSrc: string;
  alt: string;
  steps: string[];
  terms: string[];
  ctaText: string;
  ctaHref?: string;
  actionType?: PromoActionType;
  isActive: boolean;
  order: number;
  clickCount: number;
  viewCount: number;
  originalImageSizeFormatted?: string;
  compressedImageSizeFormatted?: string;
  compressionSavingsPercent?: number;
  createdAt: string;
  updatedAt: string;
}

export type CreatePromoBannerInput = Omit<
  PromoBannerItem,
  'id' | 'order' | 'clickCount' | 'viewCount' | 'createdAt' | 'updatedAt'
>;

export type UpdatePromoBannerInput = Partial<CreatePromoBannerInput> & {
  isActive?: boolean;
  order?: number;
};
