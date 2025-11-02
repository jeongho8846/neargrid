import { useState, useEffect, useCallback } from 'react';
import { useFetchFootPrintContents } from '@/features/footPrint/hooks/useFetchFootPrintContents';
import { Thread } from '@/features/thread/model/ThreadModel';
import { mapFootPrintToThread } from '../mappers/memberMapper';

/**
 * ✅ useFetchMemberThreads
 * - 특정 유저의 FootPrint 기반 게시글 데이터를 가져오는 훅
 * - 내부적으로 useFetchFootPrintContents 재사용
 */
export const useFetchMemberThreads = (
  memberId: string,
  options?: {
    startDateTime?: string;
    endDateTime?: string;
    enabled?: boolean;
  },
) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const { fetchContents, loading } = useFetchFootPrintContents();

  /** 📦 FootPrint → Thread 변환 및 저장 */
  const loadMemberThreads = useCallback(async () => {
    if (!memberId || options?.enabled === false) return;

    try {
      const data = await fetchContents({
        memberId,
        startDateTime: options?.startDateTime ?? '1900-01-01T00:00:00Z',
        endDateTime: options?.endDateTime ?? new Date().toISOString(),
      });

      const mapped = (data?.threadResponseSingleDtos ?? []).map(
        mapFootPrintToThread,
      );
      setThreads(mapped);
    } catch (err) {
      console.error('[useFetchMemberThreads] error:', err);
    }
  }, [
    memberId,
    options?.startDateTime,
    options?.endDateTime,
    options?.enabled,
    fetchContents,
  ]);

  useEffect(() => {
    loadMemberThreads();
  }, [loadMemberThreads]);

  return { threads, loading, refetch: loadMemberThreads };
};
