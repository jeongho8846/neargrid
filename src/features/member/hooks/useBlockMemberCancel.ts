import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blockMemberCancelApi } from '../api/blockMemberCancelApi';
import { MEMBER_KEYS } from '../keys/memberKeys';

export const useBlockMemberCancel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      currentMemberId,
      targetMemberId,
    }: {
      currentMemberId: string;
      targetMemberId: string;
    }) => blockMemberCancelApi(currentMemberId, targetMemberId),

    onSuccess: (_, { currentMemberId, targetMemberId }) => {
      console.log(
        '✅ [useBlockMemberCancel] 차단 해제 성공, 캐시 업데이트 시작',
      );

      queryClient.setQueryData(
        MEMBER_KEYS.blockedList(currentMemberId), // ✅ 여기 수정
        (oldList: any) =>
          Array.isArray(oldList)
            ? oldList.filter(m => m.id !== targetMemberId)
            : oldList,
      );
    },

    onError: error => {
      console.error('❌ [useBlockMemberCancel] 차단 해제 실패:', error);
    },
  });
};
