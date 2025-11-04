import { apiContents } from '@/services/apiService';

type GetDonationRankDonorByRecipientParams = {
  donor_id?: string;
  current_member_id: string;
  cursor_mark?: string | null;
};

/**
 * ✅ 나에게 도네이션을 보낸 랭킹 조회
 * - 상세 로그 추가 (요청/응답/에러)
 */
export const getDonationRankDonorByRecipient = async ({
  donor_id,
  current_member_id,
  cursor_mark,
}: GetDonationRankDonorByRecipientParams) => {
  const endpoint = '/search/getDonationRankDonorByRecipient';

  console.log('📥 [getDonationRankDonorByRecipient] 요청 시작');
  console.log('🔗 URL:', endpoint);
  console.log('📦 Params:', {
    donor_id,
    current_member_id,
    cursor_mark,
  });
  const safeCursor = cursor_mark ?? '';

  try {
    const res = await apiContents.get(endpoint, {
      params: {
        donor_id,
        current_member_id,
        cursor_mark: safeCursor,
      },
    });

    console.log('✅ [getDonationRankDonorByRecipient] 요청 성공');
    console.log('📊 Status:', res.status);
    console.log('📤 Response:', JSON.stringify(res.data, null, 2));

    return res.data;
  } catch (error: any) {
    console.error('❌ [getDonationRankDonorByRecipient] 요청 실패');
    console.error('🚨 Error Message:', error.message);
    if (error.response) {
      console.error('📉 Status:', error.response.status);
      console.error('📩 Response Data:', error.response.data);
    } else {
      console.error('⚠️ No response (network or timeout)');
    }
    throw error;
  }
};
