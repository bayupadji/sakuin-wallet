export const fxKeys = {
  all: ['fx'] as const,
  rate: () => [...fxKeys.all, 'rate'] as const,
};
