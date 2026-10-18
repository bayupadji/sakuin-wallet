import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cardRepository } from '../container';
import { cardKeys } from '../queries/keys';
import { CardDetails } from '../../domain/entities/card-details';

export function useFreezeCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isFrozen: boolean) => cardRepository.toggleFreezeCard(isFrozen),
    onMutate: async (newFrozenState) => {
      await queryClient.cancelQueries({ queryKey: cardKeys.all });

      const previousCard = queryClient.getQueryData<CardDetails>(cardKeys.details());

      if (previousCard) {
        queryClient.setQueryData<CardDetails>(cardKeys.details(), {
          ...previousCard,
          isFrozen: newFrozenState,
        });
      }

      return { previousCard };
    },
    onError: (_err, _newFrozenState, context) => {
      if (context?.previousCard) {
        queryClient.setQueryData(cardKeys.details(), context.previousCard);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cardKeys.all });
    },
  });
}

export function useUpdateCardControlsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (controls: Partial<CardDetails>) => cardRepository.updateCardControls(controls),
    onMutate: async (newControls) => {
      await queryClient.cancelQueries({ queryKey: cardKeys.all });

      const previousCard = queryClient.getQueryData<CardDetails>(cardKeys.details());

      if (previousCard) {
        queryClient.setQueryData<CardDetails>(cardKeys.details(), {
          ...previousCard,
          ...newControls,
        });
      }

      return { previousCard };
    },
    onError: (_err, _newControls, context) => {
      if (context?.previousCard) {
        queryClient.setQueryData(cardKeys.details(), context.previousCard);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cardKeys.all });
    },
  });
}
