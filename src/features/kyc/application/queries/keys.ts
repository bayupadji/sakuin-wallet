export const kycKeys = {
  all: ['kyc'] as const,
  status: (userId?: string) => [...kycKeys.all, 'status', userId || 'current'] as const,
  pendingQueue: () => [...kycKeys.all, 'pending-queue'] as const,
};
