import { useCallback, useState, useEffect } from 'react';
import { getDonationRankRecipientByDonor } from '../api/getDonationRankRecipientByDonor';
import { useDonationTabStore } from '../state/donationTabStore';

/**
 * ✅ useGetDonationRankRecipientByDonor
 * - 특정 수신자(스레드 작성자)의 후원 랭킹 조회
 * - 페이징 + Zustand 캐시 유지
 * - 닫히기 전까지 데이터 유지
 */
export const useGetDonationRankRecipientByDonor = (
  threadId: string,
  currentMemberId: string,
) => {
  const { ranking, setRanking } = useDonationTabStore();
  const [loading, setLoading] = useState(false);

  /** ✅ 첫 페이지 포함한 데이터 로딩 */
  const loadMore = useCallback(async () => {
    // ⚠️ 데이터가 없거나 마지막 페이지일 경우 중단
    if ((!ranking.hasNext && ranking.items.length > 0) || loading) return;
    setLoading(true);

    try {
      const res = await getDonationRankRecipientByDonor({
        currentMemberId,
        threadId,
        cursorMark: ranking.nextCursor,
      });

      setRanking({
        items: [...(ranking.items ?? []), ...(res.items ?? [])],
        nextCursor: res.nextCursor,
        hasNext: res.hasNext,
      });
    } catch (err) {
      console.error('❌ getDonationRankRecipientByDonor 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [threadId, currentMemberId, ranking, loading]);

  /** ✅ 최초 1회 로딩 */
  useEffect(() => {
    if (!ranking.items?.length && !loading) {
      loadMore();
    }
  }, [threadId, currentMemberId]);

  return {
    items: ranking.items ?? [],
    hasNext: ranking.hasNext ?? false,
    loading,
    loadMore,
  };
};
