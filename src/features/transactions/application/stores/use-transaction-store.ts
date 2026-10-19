import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeLocalStorage } from '@/shared/stores/safe-storage';
import { TransactionItem, TransactionType } from '../../domain/entities/transaction';

interface TransactionUIState {
  activeTab: 'all' | TransactionType;
  setActiveTab: (tab: 'all' | TransactionType) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTransaction: TransactionItem | null;
  setSelectedTransaction: (tx: TransactionItem | null) => void;
  openReceipt: (tx: TransactionItem) => void;
  closeReceipt: () => void;
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
      selectedTransaction: null,
      setSelectedTransaction: (selectedTransaction) => set({ selectedTransaction }),
      openReceipt: (tx) => set({ selectedTransaction: tx }),
      closeReceipt: () => set({ selectedTransaction: null }),
    }),
    {
      name: 'sakuin-transaction-ui',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ activeTab: state.activeTab, selectedMonth: state.selectedMonth }),
    }
  )
);
