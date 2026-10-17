import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authRepository } from '../container';
import { SignInParams, SignUpParams } from '../../domain/repository';
import { authKeys } from '../queries/keys';

export function useSignInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SignInParams) => authRepository.signIn(params),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user(), user);
    },
  });
}

export function useSignUpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SignUpParams) => authRepository.signUp(params),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user(), user);
    },
  });
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authRepository.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}
