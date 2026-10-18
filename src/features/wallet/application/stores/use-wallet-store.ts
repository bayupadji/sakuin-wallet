import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeLocalStorage } from '@/shared/stores/safe-storage';

interface WalletUIState {
  isBalanceHidden: boolean;
  toggleBalanceHidden: () => void;
  setBalanceHidden: (hidden: boolean) => void;
  modalMode: 'topup' | 'receive' | null;
  setModalMode: (mode: 'topup' | 'receive' | null) => void;
}

export const useWalletStore = create<WalletUIState>()(
  persist(
    (set) => ({
      isBalanceHidden: false,
      toggleBalanceHidden: () =>
        set((state) => ({ isBalanceHidden: !state.isBalanceHidden })),
      setBalanceHidden: (hidden) => set({ isBalanceHidden: hidden }),
      modalMode: null,
      setModalMode: (modalMode) => set({ modalMode }),
    }),
    {
      name: 'sakuin-wallet-ui',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ isBalanceHidden: state.isBalanceHidden }),
    }
  )
);
