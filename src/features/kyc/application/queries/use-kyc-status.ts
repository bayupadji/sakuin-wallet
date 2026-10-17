import { useQuery } from '@tanstack/react-query';
import { kycRepository } from '../container';
import { kycKeys } from './keys';

export function useKycStatus(userId?: string) {
  return useQuery({
    queryKey: kycKeys.status(userId),
    queryFn: () => kycRepository.getLatestSubmission(userId),
  });
}

export function usePendingKycQueue() {
  return useQuery({
    queryKey: kycKeys.pendingQueue(),
    queryFn: () => kycRepository.getPendingSubmissions(),
  });
}
