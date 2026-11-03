import { create } from 'zustand';

/**
 * UI-only modal state for Virtual Debit Card screens (AGENTS.md Section 9).
 * Card limits and transaction controls live in server state via TanStack Query (/api/card).
 */
interface CardUIState {
  isFreezeModalOpen: boolean;
  setFreezeModalOpen: (open: boolean) => void;
  isMoreModalOpen: boolean;
  setMoreModalOpen: (open: boolean) => void;
  isPinModalOpen: boolean;
  setPinModalOpen: (open: boolean) => void;
}

export const useCardStore = create<CardUIState>()((set) => ({
  isFreezeModalOpen: false,
  setFreezeModalOpen: (isFreezeModalOpen) => set({ isFreezeModalOpen }),
  isMoreModalOpen: false,
  setMoreModalOpen: (isMoreModalOpen) => set({ isMoreModalOpen }),
  isPinModalOpen: false,
  setPinModalOpen: (isPinModalOpen) => set({ isPinModalOpen }),
}));
