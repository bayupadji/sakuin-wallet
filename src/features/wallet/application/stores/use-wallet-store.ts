import { create } from 'zustand';

interface WalletUIState {
  isBalanceHidden: boolean;
  toggleBalanceHidden: () => void;
  setBalanceHidden: (hidden: boolean) => void;
}

export const useWalletStore = create<WalletUIState>((set) => ({
  isBalanceHidden: false,
  toggleBalanceHidden: () =>
    set((state) => ({ isBalanceHidden: !state.isBalanceHidden })),
  setBalanceHidden: (hidden: boolean) => set({ isBalanceHidden: hidden }),
}));
