import { useQuery } from '@tanstack/react-query';
import { authRepository } from '../container';
import { authKeys } from './keys';

export function useAuthUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authRepository.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
  });
}
