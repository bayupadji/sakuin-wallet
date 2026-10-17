import { useQuery } from '@tanstack/react-query';
import { walletRepository } from '../container';
import { walletKeys } from './keys';

export function useWalletQuery(userId?: string) {
  return useQuery({
    queryKey: walletKeys.current(userId),
    queryFn: () => walletRepository.getWallet(userId),
  });
}
