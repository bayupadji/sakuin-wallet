import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeLocalStorage } from '@/shared/stores/safe-storage';

interface CardUIState {
  monthlyLimit: number;
  setMonthlyLimit: (limit: number) => void;
  onlineTransactions: boolean;
  non3dsTransactions: boolean;
  atmWithdrawals: boolean;
  toggleOnlineTransactions: () => void;
  toggleNon3dsTransactions: () => void;
  toggleAtmWithdrawals: () => void;
  setOnlineTransactions: (val: boolean) => void;
  setNon3dsTransactions: (val: boolean) => void;
  setAtmWithdrawals: (val: boolean) => void;
  isFreezeModalOpen: boolean;
  setFreezeModalOpen: (open: boolean) => void;
  isMoreModalOpen: boolean;
  setMoreModalOpen: (open: boolean) => void;
  isPinModalOpen: boolean;
  setPinModalOpen: (open: boolean) => void;
}

export const useCardStore = create<CardUIState>()(
  persist(
    (set) => ({
      monthlyLimit: 2000,
      setMonthlyLimit: (monthlyLimit) => set({ monthlyLimit }),
      onlineTransactions: true,
      non3dsTransactions: true,
      atmWithdrawals: false,
      toggleOnlineTransactions: () =>
        set((state) => ({ onlineTransactions: !state.onlineTransactions })),
      toggleNon3dsTransactions: () =>
        set((state) => ({ non3dsTransactions: !state.non3dsTransactions })),
      toggleAtmWithdrawals: () =>
        set((state) => ({ atmWithdrawals: !state.atmWithdrawals })),
      setOnlineTransactions: (onlineTransactions) => set({ onlineTransactions }),
      setNon3dsTransactions: (non3dsTransactions) => set({ non3dsTransactions }),
      setAtmWithdrawals: (atmWithdrawals) => set({ atmWithdrawals }),
      isFreezeModalOpen: false,
      setFreezeModalOpen: (isFreezeModalOpen) => set({ isFreezeModalOpen }),
      isMoreModalOpen: false,
      setMoreModalOpen: (isMoreModalOpen) => set({ isMoreModalOpen }),
      isPinModalOpen: false,
      setPinModalOpen: (isPinModalOpen) => set({ isPinModalOpen }),
    }),
    {
      name: 'sakuin-card-ui',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        monthlyLimit: state.monthlyLimit,
        onlineTransactions: state.onlineTransactions,
        non3dsTransactions: state.non3dsTransactions,
        atmWithdrawals: state.atmWithdrawals,
      }),
    }
  )
);
