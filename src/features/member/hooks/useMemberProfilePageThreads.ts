import { useInfiniteQuery } from '@tanstack/react-query';
import {
  memberProfilePageThreads,
  MemberProfilePageThreadsResponse,
  PageThreadType,
} from '../api/memberProfilePageThreads';

type UseMemberProfilePageThreadsArgs = {
  currentMemberId: string;
  targetMemberId: string;
  pageThreadType?: PageThreadType;
  enabled?: boolean;
  initialPagingState?: string | null;
};

/**
 * ✅ 멤버 프로필 스레드 목록을 캐싱/페이징하며 조회하는 훅 (React Query 기반)
 */
export const useMemberProfilePageThreads = ({
  currentMemberId,
  targetMemberId,
  pageThreadType = 'THREAD',
  enabled = true,
  initialPagingState = null,
}: UseMemberProfilePageThreadsArgs) => {
  return useInfiniteQuery<MemberProfilePageThreadsResponse>({
    queryKey: [
      'memberProfilePageThreads',
      currentMemberId,
      targetMemberId,
      pageThreadType,
    ],
    queryFn: ({ pageParam }) =>
      memberProfilePageThreads({
        currentMemberId,
        targetMemberId,
        pageThreadType,
        pagingState: (pageParam as string | null) ?? null,
      }),
    initialPageParam: initialPagingState,
    getNextPageParam: lastPage =>
      (lastPage?.nextPagingState as string | null) ??
      (lastPage?.paging_state as string | null) ??
      null,
    enabled: enabled && !!currentMemberId && !!targetMemberId,
  });
};
