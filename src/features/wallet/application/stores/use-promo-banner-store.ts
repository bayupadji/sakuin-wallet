import { create } from 'zustand';
import {
  PromoBannerItem,
  CreatePromoBannerInput,
  UpdatePromoBannerInput,
} from '../../domain/entities/promo-banner';
import { SEED_PROMO_BANNERS } from '../../infrastructure/promo-banner-seed';

function syncBannersToServer(banners: PromoBannerItem[]) {
  if (typeof window === 'undefined') return;
  void fetch('/api/promo-banners', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ banners }),
  }).catch(() => {
    // Non-fatal in offline mode
  });
}

interface PromoBannerState {
  banners: PromoBannerItem[];
  hydrateFromServer: () => Promise<void>;
  addBanner: (input: CreatePromoBannerInput) => PromoBannerItem;
  updateBanner: (id: string, input: UpdatePromoBannerInput) => void;
  deleteBanner: (id: string) => void;
  toggleBannerStatus: (id: string) => void;
  reorderBanners: (orderedIds: string[]) => void;
  recordClick: (id: string) => void;
  recordView: (id: string) => void;
  resetToDefault: () => void;
}

export const usePromoBannerStore = create<PromoBannerState>()((set, get) => ({
  banners: SEED_PROMO_BANNERS.map((b) => ({ ...b })),

  hydrateFromServer: async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/promo-banners');
      if (!res.ok) return;
      const payload = (await res.json()) as { banners?: PromoBannerItem[] };
      if (Array.isArray(payload.banners) && payload.banners.length > 0) {
        set({ banners: payload.banners });
      }
    } catch {
      // Keep seed banners on offline error
    }
  },

  addBanner: (input: CreatePromoBannerInput) => {
    const id = `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const maxOrder = get().banners.reduce((max, b) => Math.max(max, b.order), 0);

    const newBanner: PromoBannerItem = {
      ...input,
      id,
      order: maxOrder + 1,
      clickCount: 0,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const next = [...get().banners, newBanner];
    set({ banners: next });
    syncBannersToServer(next);
    return newBanner;
  },

  updateBanner: (id: string, input: UpdatePromoBannerInput) => {
    const now = new Date().toISOString();
    const next = get().banners.map((b) =>
      b.id === id ? { ...b, ...input, updatedAt: now } : b
    );
    set({ banners: next });
    syncBannersToServer(next);
  },

  deleteBanner: (id: string) => {
    const next = get().banners.filter((b) => b.id !== id);
    set({ banners: next });
    syncBannersToServer(next);
  },

  toggleBannerStatus: (id: string) => {
    const now = new Date().toISOString();
    const next = get().banners.map((b) =>
      b.id === id ? { ...b, isActive: !b.isActive, updatedAt: now } : b
    );
    set({ banners: next });
    syncBannersToServer(next);
  },

  reorderBanners: (orderedIds: string[]) => {
    const map = new Map(get().banners.map((b) => [b.id, b]));
    const reordered: PromoBannerItem[] = [];

    orderedIds.forEach((id, index) => {
      const item = map.get(id);
      if (item) {
        reordered.push({ ...item, order: index + 1 });
        map.delete(id);
      }
    });

    map.forEach((item) => {
      reordered.push(item);
    });

    set({ banners: reordered });
    syncBannersToServer(reordered);
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
    const reset = SEED_PROMO_BANNERS.map((b) => ({ ...b }));
    set({ banners: reset });
    syncBannersToServer(reset);
  },
}));
