import { useCallback, useState, useEffect } from 'react';
import { getDonationRankDonorByRecipient } from '../api/getDonationRankDonorByRecipient';
import { useDonationTabStore } from '../state/donationTabStore';

/**
 * ✅ useGetDonationRankDonorByRecipient
 * - 나에게 도네이션을 보낸 랭킹 조회 (기부자 기준)
 * - 최초 1회만 호출, Zustand 캐시 유지
 */
export const useGetDonationRankDonorByRecipient = (
  currentMemberId: string,
  donorId?: string,
) => {
  const {
    rankDonorByRecipient,
    setRankDonorByRecipient,
    resetRankDonorByRecipient,
  } = useDonationTabStore();
  const [loading, setLoading] = useState(false);

  /** ✅ 더 불러오기 */
  const loadMore = useCallback(async () => {
    if (
      (!rankDonorByRecipient.hasNext &&
        rankDonorByRecipient.items.length > 0) ||
      loading
    )
      return;

    setLoading(true);
    try {
      const res = await getDonationRankDonorByRecipient({
        current_member_id: currentMemberId,
        donor_id: donorId,
        cursor_mark: rankDonorByRecipient.nextCursor,
      });

      const mapped =
        res.donationRankDonorByRecipientResponseDtos?.map((row: any) => ({
          memberId: row.recipientMember.id,
          profileImageUrl: row.recipientMember.profileImageUrl,
          nickname: row.recipientMember.nickName,
          realName: row.recipientMember.realName,
          totalAmount: row.totalDonationPoint,
        })) ?? [];

      setRankDonorByRecipient({
        items: [...(rankDonorByRecipient.items ?? []), ...mapped],
        nextCursor: res.nextCursorMark ?? null,
        hasNext: !!res.nextCursorMark,
      });
    } catch (err) {
      console.error('❌ getDonationRankDonorByRecipient 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [rankDonorByRecipient, currentMemberId, donorId, loading]);

  /** ✅ 최초 1회만 로드 (탭 전환 시 재호출 방지) */
  useEffect(() => {
    if (rankDonorByRecipient.items.length === 0 && !loading) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 👈 deps 비움

  /** ✅ 언마운트 시 정리 (선택 사항) */
  // useEffect(() => resetRankDonorByRecipient, []);

  return {
    items: rankDonorByRecipient.items ?? [],
    hasNext: rankDonorByRecipient.hasNext ?? false,
    loading,
    loadMore,
  };
};
