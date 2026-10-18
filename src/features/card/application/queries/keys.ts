export const cardKeys = {
  all: ['card'] as const,
  details: (userId?: string) => [...cardKeys.all, 'details', userId || 'me'] as const,
};
