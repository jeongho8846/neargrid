import { apiService } from '@/services/apiService';

/**
 * 🔹 특정 유저 차단하기
 * POST /member/blockMember
 */
export const blockMemberApi = async (
  currentMemberId: string,
  targetMemberId: string,
) => {
  const { data } = await apiService.post('/member/blockMember', {
    current_member_id: currentMemberId,
    target_member_id: targetMemberId,
  });
  return data;
};
