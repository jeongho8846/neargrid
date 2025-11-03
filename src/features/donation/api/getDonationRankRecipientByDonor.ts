import { apiContents } from '@/services/apiService';

export type DonationRankingItem = {
  donorId: string;
  donorNickname: string;
  donorProfileImageUrl?: string;
  totalAmount: number;
  rank: number;
};

export type DonationRankingResponse = {
  items: DonationRankingItem[];
  nextCursor?: string;
  hasNext: boolean;
};

/**
 * ✅ 특정 스레드의 후원 랭킹 조회
 * @endpoint GET /search/getDonationRankThreadByDonor
 */
export const getDonationRankRecipientByDonor = async ({
  currentMemberId,
  threadId,
  cursorMark,
}: {
  currentMemberId: string;
  threadId: string;
  cursorMark?: string;
}) => {
  console.log('📥 getDonationRankRecipientByDonor 호출됨');
  console.log('current_member_id:', currentMemberId);
  console.log('thread_id:', threadId);
  console.log('cursor_mark:', cursorMark ?? '');

  try {
    const res = await apiContents.get('/search/getDonationRankThreadByDonor', {
      params: {
        current_member_id: currentMemberId,
        thread_id: threadId,
        cursor_mark: cursorMark ?? '',
      },
    });

    console.log('📥 [RES] getDonationRankRecipientByDonor 성공:', res.data);

    // ✅ 서버 응답 매핑
    const items =
      res.data.donationRankThreadByDonorResponseDtos?.map(
        (dto: any, index: number) => ({
          donorId: dto.donorMember?.id ?? '',
          donorNickname: dto.donorMember?.nickName ?? '',
          donorProfileImageUrl: dto.donorMember?.profileImageUrl ?? '',
          totalAmount: dto.totalDonationPoint ?? 0,
          rank: index + 1, // 서버에서 rank 안주는 경우 인덱스로 대체
        }),
      ) ?? [];

    const mapped: DonationRankingResponse = {
      items,
      nextCursor: res.data.nextCursorMark ?? undefined,
      hasNext: !!res.data.nextCursorMark,
    };

    return mapped;
  } catch (error: any) {
    console.error('❌ [ERR] getDonationRankRecipientByDonor:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    throw error;
  }
};
