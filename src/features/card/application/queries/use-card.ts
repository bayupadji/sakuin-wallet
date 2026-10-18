import { useQuery } from '@tanstack/react-query';
import { cardRepository } from '../container';
import { cardKeys } from './keys';

export function useCardQuery(userId?: string) {
  return useQuery({
    queryKey: cardKeys.details(userId),
    queryFn: () => cardRepository.getCardDetails(userId),
  });
}
