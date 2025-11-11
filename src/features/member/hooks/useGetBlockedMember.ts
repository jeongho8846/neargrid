import { useQuery } from '@tanstack/react-query';
import { getBlockedMemberApi } from '../api/getBlockedMemberApi';
import { MEMBER_KEYS } from '../keys/memberKeys';

export const useGetBlockedMember = (currentMemberId: string) => {
  return useQuery({
    queryKey: MEMBER_KEYS.blockedList(currentMemberId),
    queryFn: () => getBlockedMemberApi(currentMemberId),
    enabled: !!currentMemberId,
  });
};
