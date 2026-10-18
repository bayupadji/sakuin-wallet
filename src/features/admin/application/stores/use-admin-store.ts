import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeLocalStorage } from '@/shared/stores/safe-storage';

interface AdminUIState {
  statusFilter: 'all' | 'in_review' | 'approved' | 'rejected';
  setStatusFilter: (status: 'all' | 'in_review' | 'approved' | 'rejected') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  modalType: 'inspect' | 'approve' | 'reject' | 'reupload' | null;
  setModalType: (type: 'inspect' | 'approve' | 'reject' | 'reupload' | null) => void;
  reviewReason: string;
  setReviewReason: (reason: string) => void;
}

export const useAdminStore = create<AdminUIState>()(
  persist(
    (set) => ({
      statusFilter: 'all',
      setStatusFilter: (statusFilter) => set({ statusFilter }),
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      modalType: null,
      setModalType: (modalType) => set({ modalType }),
      reviewReason: '',
      setReviewReason: (reviewReason) => set({ reviewReason }),
    }),
    {
      name: 'sakuin-admin-ui',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ statusFilter: state.statusFilter }),
    }
  )
);
