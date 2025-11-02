import { apiContents } from '@/services/apiService';

type FetchFootPrintParams = {
  memberId: string;
  startDateTime: string; // ISO 형식 (예: "2025-01-25T02:42:00")
  endDateTime: string; // ISO 형식 (예: "2025-11-02T10:18:28")
};

/**
 * ✅ 회원 발자국(게시글) 조회 API
 * - 기간 내 특정 사용자의 작성글 리스트 반환
 */
export const fetchFootPrintContents = async ({
  memberId,
  startDateTime,
  endDateTime,
}: FetchFootPrintParams) => {
  console.log('📥 fetchFootPrintContents 호출됨');
  console.log('current_member_id:', memberId);
  console.log('start_date_time:', startDateTime);
  console.log('end_date_time:', endDateTime);

  try {
    const response = await apiContents.get('/thread/readThreadByMember', {
      params: {
        current_member_id: memberId, // 🔹 서버 Long 타입 대응
        start_date_time: startDateTime,
        end_date_time: endDateTime,
      },
    });

    console.log('📤 API 응답:', response.data);
    return response.data.threadResponseDtoList ?? [];
  } catch (err: any) {
    console.error('❌ fetchFootPrintContents 오류:', err);
    console.error('📛 서버 응답:', err.response?.data || '(서버 응답 없음)');
    throw err;
  }
};
