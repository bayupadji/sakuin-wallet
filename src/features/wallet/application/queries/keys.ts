export const walletKeys = {
  all: ['wallet'] as const,
  current: (userId?: string) => [...walletKeys.all, 'current', userId || 'me'] as const,
};
