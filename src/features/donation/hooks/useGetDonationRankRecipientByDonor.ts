import { useCallback, useState, useEffect } from 'react';
import { getDonationRankRecipientByDonor } from '../api/getDonationRankRecipientByDonor';
import { useDonationTabStore } from '../state/donationTabStore';

/**
 * ✅ useGetDonationRankRecipientByDonor
 * - 내가 도네이션을 보낸 랭킹 조회 (수신자 기준)
 * - 최초 1회만 호출
 * - Zustand 캐시 유지 (탭 전환 시 재호출 X)
 */
export const useGetDonationRankRecipientByDonor = (
  currentMemberId: string,
  recipientId?: string,
) => {
  const { rankRecipientByDonor, setRankRecipientByDonor } =
    useDonationTabStore();
  const [loading, setLoading] = useState(false);

  /** ✅ 페이징 로드 */
  const loadMore = useCallback(async () => {
    if (
      (!rankRecipientByDonor.hasNext &&
        rankRecipientByDonor.items.length > 0) ||
      loading
    )
      return;

    setLoading(true);
    try {
      const res = await getDonationRankRecipientByDonor({
        current_member_id: currentMemberId,
        recipient_id: recipientId,
        cursor_mark: rankRecipientByDonor.nextCursor,
      });

      const mapped =
        res.donationRankRecipientByDonorResponseDtos?.map((row: any) => ({
          memberId: row.recipientMember?.id ?? row.donorMember?.id,
          profileImageUrl:
            row.recipientMember?.profileImageUrl ??
            row.donorMember?.profileImageUrl,
          nickname: row.recipientMember?.nickName ?? row.donorMember?.nickName,
          realName: row.recipientMember?.realName ?? row.donorMember?.realName,
          totalAmount: row.totalDonationPoint,
        })) ?? [];

      setRankRecipientByDonor({
        items: [...(rankRecipientByDonor.items ?? []), ...mapped],
        nextCursor: res.nextCursorMark ?? null,
        hasNext: !!res.nextCursorMark,
      });
    } catch (err) {
      console.error('❌ getDonationRankRecipientByDonor 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [rankRecipientByDonor, currentMemberId, recipientId, loading]);

  /** ✅ 최초 1회만 로드 (탭 전환 시 재호출 방지) */
  useEffect(() => {
    if (rankRecipientByDonor.items.length === 0 && !loading) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 👈 최초 1회만 실행

  return {
    items: rankRecipientByDonor.items ?? [],
    hasNext: rankRecipientByDonor.hasNext ?? false,
    loading,
    loadMore,
  };
};
