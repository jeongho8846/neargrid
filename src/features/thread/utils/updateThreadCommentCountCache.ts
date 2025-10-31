// src/features/thread/utils/updateThreadCommentCountCache.ts
import { QueryClient } from '@tanstack/react-query';
import { THREAD_KEYS } from '../keys/threadKeys';
import { Thread } from '../model/ThreadModel';

/**
 * ✅ 댓글 수 캐시 갱신 유틸
 * - THREAD_KEYS 구조에 맞게 리스트(detail) 캐시 모두 수정
 */
export function updateThreadCommentCountCache(
  queryClient: QueryClient,
  threadId: string,
  delta: number,
) {
  if (!threadId) return;

  console.log('🧠 [updateThreadCommentCountCache] 시작', { threadId, delta });

  // ✅ 1️⃣ 리스트 캐시 갱신
  const listKey = THREAD_KEYS.list();
  const listData = queryClient.getQueryData<any>(listKey);

  if (listData?.pages) {
    const newListData = {
      ...listData,
      pages: listData.pages.map((page: any) => ({
        ...page,
        threads: page.threads.map((t: Thread) =>
          t.threadId === threadId
            ? {
                ...t,
                commentThreadCount: Math.max(
                  (t.commentThreadCount ?? 0) + delta,
                  0,
                ),
              }
            : t,
        ),
      })),
    };
    queryClient.setQueryData(listKey, newListData);
    console.log('✅ [updateThreadCommentCountCache] 리스트 캐시 갱신 완료');
  }

  // ✅ 2️⃣ 단일 thread 캐시 갱신
  const detailKey = THREAD_KEYS.detail(threadId);
  const detailData = queryClient.getQueryData<Thread>(detailKey);

  if (detailData) {
    const newDetailData = {
      ...detailData,
      commentThreadCount: Math.max(
        (detailData.commentThreadCount ?? 0) + delta,
        0,
      ),
    };
    queryClient.setQueryData(detailKey, newDetailData);
    console.log('✅ [updateThreadCommentCountCache] 디테일 캐시 갱신 완료');
  }
}
