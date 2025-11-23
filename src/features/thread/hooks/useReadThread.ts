import { useQuery } from '@tanstack/react-query';
import { readThread } from '../api/readThread';
import { Thread } from '../model/ThreadModel';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { THREAD_KEYS } from '../keys/threadKeys';

export const useReadThread = (threadId: string | undefined) => {
  const { member } = useCurrentMember();
  const memberId = member?.id;

  console.log('🔍 [useReadThread] enabled 체크:', {
    threadId: !!threadId,
    memberId: !!memberId,
  });

  const result = useQuery<Thread | null>({
    queryKey: threadId ? THREAD_KEYS.detail(threadId) : ['thread', 'undefined'],
    queryFn: () => {
      if (!threadId) {
        return Promise.resolve(null);
      }
      console.log(
        '🔥 [useReadThread] queryFn 실행!',
        threadId,
        new Date().toLocaleTimeString(),
      );
      return readThread(threadId, memberId);
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
  });

  console.log('🔍 [useReadThread] Hook 실행:', {
    threadId,
    dataUpdatedAt: new Date(result.dataUpdatedAt).toLocaleTimeString(),
    isStale: result.isStale,
    isFetching: result.isFetching,
  });

  return result;
};
