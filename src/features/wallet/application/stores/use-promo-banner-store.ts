import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  PromoBannerItem,
  CreatePromoBannerInput,
  UpdatePromoBannerInput,
} from '../../domain/entities/promo-banner';
import { SEED_PROMO_BANNERS } from '../../infrastructure/promo-banner-seed';

interface PromoBannerState {
  banners: PromoBannerItem[];
  addBanner: (input: CreatePromoBannerInput) => PromoBannerItem;
  updateBanner: (id: string, input: UpdatePromoBannerInput) => void;
  deleteBanner: (id: string) => void;
  toggleBannerStatus: (id: string) => void;
  reorderBanners: (orderedIds: string[]) => void;
  recordClick: (id: string) => void;
  recordView: (id: string) => void;
  resetToDefault: () => void;
}

export const usePromoBannerStore = create<PromoBannerState>()(
  persist(
    (set) => ({
      banners: SEED_PROMO_BANNERS,

      addBanner: (input: CreatePromoBannerInput) => {
        const id = `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const now = new Date().toISOString();

        let newBanner: PromoBannerItem;

        set((state) => {
          const maxOrder = state.banners.reduce((max, b) => Math.max(max, b.order), 0);

          newBanner = {
            ...input,
            id,
            order: maxOrder + 1,
            clickCount: 0,
            viewCount: 0,
            createdAt: now,
            updatedAt: now,
          };

          return {
            banners: [...state.banners, newBanner],
          };
        });

        // @ts-expect-error newBanner assigned in set callback
        return newBanner;
      },

      updateBanner: (id: string, input: UpdatePromoBannerInput) => {
        const now = new Date().toISOString();
        set((state) => ({
          banners: state.banners.map((b) =>
            b.id === id ? { ...b, ...input, updatedAt: now } : b
          ),
        }));
      },

      deleteBanner: (id: string) => {
        set((state) => ({
          banners: state.banners.filter((b) => b.id !== id),
        }));
      },

      toggleBannerStatus: (id: string) => {
        const now = new Date().toISOString();
        set((state) => ({
          banners: state.banners.map((b) =>
            b.id === id ? { ...b, isActive: !b.isActive, updatedAt: now } : b
          ),
        }));
      },

      reorderBanners: (orderedIds: string[]) => {
        set((state) => {
          const map = new Map(state.banners.map((b) => [b.id, b]));
          const reordered: PromoBannerItem[] = [];

          orderedIds.forEach((id, index) => {
            const item = map.get(id);
            if (item) {
              reordered.push({ ...item, order: index + 1 });
              map.delete(id);
            }
          });

          // Sisa item yang tidak ada di list urutan
          map.forEach((item) => {
            reordered.push(item);
          });

          return { banners: reordered };
        });
      },

      recordClick: (id: string) => {
        set((state) => ({
          banners: state.banners.map((b) =>
            b.id === id ? { ...b, clickCount: b.clickCount + 1 } : b
          ),
        }));
      },

      recordView: (id: string) => {
        set((state) => ({
          banners: state.banners.map((b) =>
            b.id === id ? { ...b, viewCount: b.viewCount + 1 } : b
          ),
        }));
      },

      resetToDefault: () => {
        set({ banners: SEED_PROMO_BANNERS });
      },
    }),
    {
      name: 'sakuin_promo_banners_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
