import { apiService } from '@/services/apiService';

/**
 * 🔹 특정 유저 차단 해제
 * POST /member/blockMemberCancle
 */
export const blockMemberCancelApi = async (
  currentMemberId: string,
  blockedMemberId: string,
) => {
  const { data } = await apiService.post('/member/blockMemberCancle', {
    current_member_id: currentMemberId,
    blocked_member_id: blockedMemberId,
  });
  return data;
};
