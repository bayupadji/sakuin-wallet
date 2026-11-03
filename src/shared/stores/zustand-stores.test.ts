import { describe, it, expect, beforeEach } from 'vitest';
import { useWalletStore } from '../../features/wallet/application/stores/use-wallet-store';
import { useCardStore } from '../../features/card/application/stores/use-card-store';
import { useTransactionStore } from '../../features/transactions/application/stores/use-transaction-store';
import { usePublicStore } from '../../features/public/application/stores/use-public-store';
import { useAdminStore } from '../../features/admin/application/stores/use-admin-store';

describe('Zustand Modular Stores Suite (UI State Only)', () => {
  beforeEach(() => {
    useWalletStore.setState({ isBalanceHidden: false, modalMode: null });
    useCardStore.setState({
      isFreezeModalOpen: false,
      isMoreModalOpen: false,
      isPinModalOpen: false,
    });
    useTransactionStore.setState({
      activeTab: 'all',
      selectedMonth: 'all',
      searchQuery: '',
    });
    usePublicStore.setState({ usdInput: '100', activeFaqIndex: null });
    useAdminStore.setState({
      statusFilter: 'all',
      searchQuery: '',
      modalType: null,
      reviewReason: '',
    });
  });

  describe('useWalletStore', () => {
    it('toggles balance visibility properly', () => {
      expect(useWalletStore.getState().isBalanceHidden).toBe(false);
      useWalletStore.getState().toggleBalanceHidden();
      expect(useWalletStore.getState().isBalanceHidden).toBe(true);
      useWalletStore.getState().setBalanceHidden(false);
      expect(useWalletStore.getState().isBalanceHidden).toBe(false);
    });

    it('sets modalMode for quick actions', () => {
      useWalletStore.getState().setModalMode('topup');
      expect(useWalletStore.getState().modalMode).toBe('topup');
      useWalletStore.getState().setModalMode(null);
      expect(useWalletStore.getState().modalMode).toBeNull();
    });
  });

  describe('useCardStore', () => {
    it('controls freeze, more, and password re-auth dialogs without storing server data', () => {
      useCardStore.getState().setFreezeModalOpen(true);
      expect(useCardStore.getState().isFreezeModalOpen).toBe(true);

      useCardStore.getState().setMoreModalOpen(true);
      expect(useCardStore.getState().isMoreModalOpen).toBe(true);

      useCardStore.getState().setPinModalOpen(true);
      expect(useCardStore.getState().isPinModalOpen).toBe(true);
    });
  });

  describe('useTransactionStore', () => {
    it('manages tab, month period, and search query filters', () => {
      useTransactionStore.getState().setActiveTab('card');
      expect(useTransactionStore.getState().activeTab).toBe('card');

      useTransactionStore.getState().setSelectedMonth('2026-10');
      expect(useTransactionStore.getState().selectedMonth).toBe('2026-10');

      useTransactionStore.getState().setSearchQuery('AWS');
      expect(useTransactionStore.getState().searchQuery).toBe('AWS');
    });
  });

  describe('usePublicStore', () => {
    it('updates currency calculator input and accordion', () => {
      usePublicStore.getState().setUsdInput('500');
      expect(usePublicStore.getState().usdInput).toBe('500');

      usePublicStore.getState().toggleFaqIndex(2);
      expect(usePublicStore.getState().activeFaqIndex).toBe(2);
      usePublicStore.getState().toggleFaqIndex(2);
      expect(usePublicStore.getState().activeFaqIndex).toBeNull();
    });
  });

  describe('useAdminStore', () => {
    it('updates kyc queue filter and review decisions', () => {
      useAdminStore.getState().setStatusFilter('in_review');
      expect(useAdminStore.getState().statusFilter).toBe('in_review');

      useAdminStore.getState().setModalType('approve');
      expect(useAdminStore.getState().modalType).toBe('approve');

      useAdminStore.getState().setReviewReason('KTP photo verified clearly.');
      expect(useAdminStore.getState().reviewReason).toBe('KTP photo verified clearly.');
    });
  });
});
