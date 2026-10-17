import { useMutation, useQueryClient } from '@tanstack/react-query';
import { kycRepository } from '../container';
import { ReviewKycParams, SubmitKycParams } from '../../domain/repository';
import { kycKeys } from '../queries/keys';

export function useSubmitKycMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SubmitKycParams) => kycRepository.submitKyc(params),
    onSuccess: (newSubmission) => {
      queryClient.setQueryData(kycKeys.status(newSubmission.userId), newSubmission);
      queryClient.invalidateQueries({ queryKey: kycKeys.all });
    },
  });
}

export function useReviewKycMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ReviewKycParams) => kycRepository.reviewSubmission(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kycKeys.all });
    },
  });
}
