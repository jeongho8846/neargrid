import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blockMemberApi } from '../api/blockMemberApi';
import { MEMBER_KEYS } from '../keys/memberKeys';

export const useBlockMember = (currentMemberId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetMemberId: string) =>
      blockMemberApi(currentMemberId, targetMemberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MEMBER_KEYS.blockedList(currentMemberId),
      });
    },
  });
};
