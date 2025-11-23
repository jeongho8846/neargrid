// src/features/member/hooks/useCurrentMember.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { memberStorage } from '../utils/memberStorage';
import { Member } from '../types';

export const MEMBER_KEYS = {
  current: ['member', 'current'] as const,
};

export const useCurrentMember = () => {
  const { data: member, isLoading: loading } = useQuery<Member | null>({
    queryKey: MEMBER_KEYS.current,
    queryFn: () => memberStorage.getMember(),
    staleTime: Infinity, // 캐시 무한 유지
  });

  return {
    member: member ?? null,
    loading,
    isLoggedIn: !!member,
  };
};

// 로그인 시 사용
export const useSetMember = () => {
  const queryClient = useQueryClient();

  return async (member: Member) => {
    await memberStorage.saveMember(member);
    queryClient.setQueryData(MEMBER_KEYS.current, member);
  };
};

// 로그아웃 시 사용
export const useClearMember = () => {
  const queryClient = useQueryClient();

  return async () => {
    await memberStorage.clearMember();
    queryClient.setQueryData(MEMBER_KEYS.current, null);
  };
};
