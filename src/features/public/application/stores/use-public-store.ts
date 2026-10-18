import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeLocalStorage } from '@/shared/stores/safe-storage';

interface PublicUIState {
  usdInput: string;
  setUsdInput: (val: string) => void;
  activeFaqIndex: number | null;
  toggleFaqIndex: (index: number) => void;
}

export const usePublicStore = create<PublicUIState>()(
  persist(
    (set) => ({
      usdInput: '100',
      setUsdInput: (usdInput) => set({ usdInput }),
      activeFaqIndex: null,
      toggleFaqIndex: (index) =>
        set((state) => ({
          activeFaqIndex: state.activeFaqIndex === index ? null : index,
        })),
    }),
    {
      name: 'sakuin-public-ui',
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);
