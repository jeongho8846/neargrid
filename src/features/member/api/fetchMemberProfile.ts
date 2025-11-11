import { apiContents } from '@/services/apiService';
import { MemberProfile } from '../model/MemberProfileModel';
import { mapMemberProfileDto } from '../mappers/memberMapper';

/**
 * ✅ GET /page/memberProfilePage
 * - 현재 로그인한 유저(currentMemberId)가 targetUserId의 프로필 페이지를 조회
 * - 디버깅 로그 포함 버전
 */
export const fetchMemberProfile = async (
  currentMemberId: string,
  targetUserId: string,
): Promise<MemberProfile> => {
  const endpoint = '/page/memberProfilePage';
  const params = {
    current_member_id: currentMemberId,
    member_id: targetUserId,
    Blankable_current_member_id: currentMemberId,
  };

  console.log('🌐 [fetchMemberProfile] 요청 시작');
  console.log('➡️ [Request URL]:', endpoint);
  console.log('📦 [Request Params]:', params);

  try {
    const start = Date.now();
    const res = await apiContents.get(endpoint, { params });
    const duration = Date.now() - start;

    console.log(`✅ [fetchMemberProfile] 응답 성공 (${duration}ms)`);
    console.log('📥 [Response Data!!!]:', res.data);

    const mapped = mapMemberProfileDto(res.data);
    console.log('🧭 [Mapped Domain Model]:', mapped);

    return mapped;
  } catch (error: any) {
    console.error('❌ [fetchMemberProfile] 요청 실패');
    console.error('🧾 [Error Message]:', error?.message);
    console.error('⚙️ [Error Config]:', error?.config);
    if (error?.response) {
      console.error('🚨 [Error Response]:', error.response.data);
      console.error('🚨 [Status Code]:', error.response.status);
    }
    throw error;
  }
};
