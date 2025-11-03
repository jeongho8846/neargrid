import { apiContents } from '@/services/apiService';

export type DonationRecordItem = {
  donationId: string;
  donorId: string;
  donorNickname: string;
  donorProfileImageUrl?: string;
  amount: number;
  message?: string; // ✅ 추가
  createdAt: string;
};

export type DonationRecordResponse = {
  items: DonationRecordItem[];
  nextCursor?: string;
  hasNext: boolean;
};

/**
 * ✅ 특정 스레드의 후원 기록 조회
 * @endpoint /donation/getDonationThreadByThread
 */
export const getDonationThreadByThread = async ({
  currentMemberId,
  threadId,
  pagingState,
}: {
  currentMemberId: string;
  threadId: string;
  pagingState?: string;
}) => {
  console.log('📥 getDonationThreadByThread 호출됨');
  console.log('current_member_id:', currentMemberId);
  console.log('thread_id:', threadId);
  console.log('paging_state_str:', pagingState ?? '');

  try {
    const res = await apiContents.get('/donation/getDonationThreadByThread', {
      params: {
        current_member_id: currentMemberId,
        thread_id: threadId,
        paging_state_str: pagingState ?? '',
      },
    });

    console.log('📥 [RES] getDonationThreadByThread 성공:', res.data);

    // ✅ 서버 응답 매핑
    const items =
      res.data.donationThreadResponseDtos?.map((dto: any) => ({
        donationId: dto.donationThreadId,
        donorId: dto.donorId,
        donorNickname: dto.donorMemberResponseSimpleDto?.nickName ?? '',
        donorProfileImageUrl:
          dto.donorMemberResponseSimpleDto?.profileImageUrl ?? '',
        amount: dto.netPoint ?? 0,
        message: dto.message ?? '', // ✅ 메시지 추가
        createdAt: dto.createDateTime,
      })) ?? [];

    const mapped: DonationRecordResponse = {
      items,
      nextCursor: res.data.nextPagingState ?? undefined,
      hasNext: !!res.data.nextPagingState,
    };

    return mapped;
  } catch (error: any) {
    console.error('❌ [ERR] getDonationThreadByThread:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    throw error;
  }
};
