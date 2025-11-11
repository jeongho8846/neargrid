import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blockMemberCancelApi } from '../api/blockMemberCancelApi';
import { MEMBER_KEYS } from '../keys/memberKeys';

export const useBlockMemberCancel = (currentMemberId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blockedMemberId: string) =>
      blockMemberCancelApi(currentMemberId, blockedMemberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MEMBER_KEYS.blockedList(currentMemberId),
      });
    },
  });
};
