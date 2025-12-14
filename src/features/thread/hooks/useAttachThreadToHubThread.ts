import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { attachThreadToHubThread } from '../api/attachThreadToHubThread';
import type { Thread } from '../model/ThreadModel';

type Params = {
  currentMemberId?: string;
  hubThreadId?: string;
  threadIds: string[];
  selectedThreads?: Thread[];
};

/**
 * ✅ 허브 스레드에 내 스레드 붙이기 훅
 */
export const useAttachThreadToHubThread = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const attach = useCallback(
    async ({ currentMemberId, hubThreadId, threadIds, selectedThreads = [] }: Params) => {
      if (!currentMemberId || !hubThreadId || !threadIds.length) {
        console.warn(
          '[useAttachThreadToHubThread] 누락된 값',
          currentMemberId,
          hubThreadId,
          threadIds,
        );
        return false;
      }

      try {
        setLoading(true);
        console.log('📡 attachThreadToHubThread 요청', {
          currentMemberId,
          hubThreadId,
          threadIds,
        });
        await attachThreadToHubThread({
          currentMemberId,
          hubThreadId,
          threadIds,
        });

        // ✅ Optimistic UI: 허브 자식 스레드 캐시에 즉시 추가
        if (selectedThreads.length) {
          queryClient.setQueryData<Thread[]>(
            ['hubThreadChildThreads', hubThreadId],
            prev => {
              const existing = prev ?? [];
              const merged = [...existing];
              selectedThreads.forEach(t => {
                if (!merged.find(item => item.threadId === t.threadId)) {
                  merged.unshift(t);
                }
              });
              return merged;
            },
          );
        }

        return true;
      } catch (error) {
        console.error('❌ attachThreadToHubThread 실패', error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { attach, loading };
};
