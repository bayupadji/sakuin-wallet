import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeLocalStorage } from '@/shared/stores/safe-storage';
import { TransactionType } from '../../domain/entities/transaction';

interface TransactionUIState {
  activeTab: 'all' | TransactionType;
  setActiveTab: (tab: 'all' | TransactionType) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useTransactionStore = create<TransactionUIState>()(
  persist(
    (set) => ({
      activeTab: 'all',
      setActiveTab: (activeTab) => set({ activeTab }),
      selectedMonth: 'all',
      setSelectedMonth: (selectedMonth) => set({ selectedMonth }),
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
    }),
    {
      name: 'sakuin-transaction-ui',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ activeTab: state.activeTab, selectedMonth: state.selectedMonth }),
    }
  )
);
