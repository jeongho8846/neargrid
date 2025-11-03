import { useCallback, useState } from 'react';
import { getDonationThreadByThread } from '../api/getDonationThreadByThread';
import { useDonationTabStore } from '../state/donationTabStore';

/**
 * ✅ useGetDonationThreadByThread
 * - 스레드 후원 내역 조회 (페이징 + 캐시 유지)
 */
export const useGetDonationThreadByThread = (
  threadId: string,
  currentMemberId: string,
) => {
  const { record, setRecord } = useDonationTabStore();
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (!threadId || !currentMemberId) {
      console.warn('⚠️ threadId 또는 currentMemberId 누락됨');
      return;
    }
    if (!record.hasNext || loading) return;

    setLoading(true);
    console.log('🚀 [useGetDonationThreadByThread] loadMore 실행', {
      threadId,
      currentMemberId,
      nextCursor: record.nextCursor,
    });

    try {
      const res = await getDonationThreadByThread({
        currentMemberId,
        threadId,
        pagingState: record.nextCursor,
      });

      console.log('📥 [RES] getDonationThreadByThread 성공:', res);

      setRecord({
        items: [...record.items, ...res.items],
        nextCursor: res.nextCursor,
        hasNext: res.hasNext,
      });
    } catch (err) {
      console.error('❌ getDonationThreadByThread 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [
    threadId,
    currentMemberId,
    record.nextCursor,
    record.items,
    record.hasNext,
    loading,
    setRecord,
  ]);

  return {
    items: record.items,
    hasNext: record.hasNext,
    loading,
    loadMore,
  };
};
