import { describe, it, expect, beforeEach } from 'vitest';
import { useWalletStore } from '../../features/wallet/application/stores/use-wallet-store';
import { useCardStore } from '../../features/card/application/stores/use-card-store';
import { useTransactionStore } from '../../features/transactions/application/stores/use-transaction-store';
import { usePublicStore } from '../../features/public/application/stores/use-public-store';
import { useAdminStore } from '../../features/admin/application/stores/use-admin-store';

describe('Zustand Modular Stores Suite', () => {
  beforeEach(() => {
    useWalletStore.setState({ isBalanceHidden: false, modalMode: null });
    useCardStore.setState({
      monthlyLimit: 2000,
      onlineTransactions: true,
      non3dsTransactions: true,
      atmWithdrawals: false,
      isFreezeModalOpen: false,
      isMoreModalOpen: false,
    });
    useTransactionStore.setState({
      activeTab: 'all',
      searchQuery: '',
      selectedTransaction: null,
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
    it('updates monthly spending limit and security controls', () => {
      useCardStore.getState().setMonthlyLimit(3500);
      expect(useCardStore.getState().monthlyLimit).toBe(3500);

      useCardStore.getState().toggleAtmWithdrawals();
      expect(useCardStore.getState().atmWithdrawals).toBe(true);

      useCardStore.getState().setOnlineTransactions(false);
      expect(useCardStore.getState().onlineTransactions).toBe(false);
    });

    it('controls freeze and more dialogs', () => {
      useCardStore.getState().setFreezeModalOpen(true);
      expect(useCardStore.getState().isFreezeModalOpen).toBe(true);

      useCardStore.getState().setMoreModalOpen(true);
      expect(useCardStore.getState().isMoreModalOpen).toBe(true);
    });
  });

  describe('useTransactionStore', () => {
    it('filters and manages receipt drawer', () => {
      useTransactionStore.getState().setActiveTab('card');
      expect(useTransactionStore.getState().activeTab).toBe('card');

      useTransactionStore.getState().setSearchQuery('AWS');
      expect(useTransactionStore.getState().searchQuery).toBe('AWS');

      const mockTx = {
        id: 'tx-test',
        title: 'Test Tx',
        merchant: 'Test Merchant',
        type: 'card' as const,
        category: 'Tech',
        status: 'success' as const,
        amountUsdCents: 1000n,
        amountIdr: 162500,
        fxRate: 16250,
        feeIdr: 0,
        channel: 'VISA',
        referenceId: 'REF-1',
        idempotencyKey: 'idemp_1',
        ledgerSequence: 'LDG-1',
        timestampUtc: '2026-10-18',
        timestampWib: '18 Okt 2026',
      };

      useTransactionStore.getState().openReceipt(mockTx);
      expect(useTransactionStore.getState().selectedTransaction).toEqual(mockTx);

      useTransactionStore.getState().closeReceipt();
      expect(useTransactionStore.getState().selectedTransaction).toBeNull();
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
