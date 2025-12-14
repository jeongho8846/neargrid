import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { detachThreadToHubThread } from '../api/detachThreadToHubThread';
import type { Thread } from '../model/ThreadModel';

type Params = {
  currentMemberId?: string;
  hubThreadId?: string;
  threadId?: string;
};

/**
 * ✅ 허브 스레드에서 자식 스레드 분리 훅
 */
export const useDetachThreadFromHubThread = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const detach = useCallback(
    async ({ currentMemberId, hubThreadId, threadId }: Params) => {
      if (!currentMemberId || !hubThreadId || !threadId) {
        console.warn(
          '[useDetachThreadFromHubThread] 누락된 값',
          currentMemberId,
          hubThreadId,
          threadId,
        );
        return false;
      }

      try {
        setLoading(true);
        console.log('📡 detachThreadToHubThread 요청', {
          currentMemberId,
          hubThreadId,
          threadId,
        });
        await detachThreadToHubThread({
          currentMemberId,
          hubThreadId,
          threadId,
        });

        // ✅ Optimistic UI: 허브 자식 스레드 캐시에서 제거
        queryClient.setQueryData<Thread[]>(
          ['hubThreadChildThreads', hubThreadId],
          prev => (prev ?? []).filter(t => t.threadId !== threadId),
        );

        return true;
      } catch (error) {
        console.error('❌ detachThreadToHubThread 실패', error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [queryClient],
  );

  return { detach, loading };
};
