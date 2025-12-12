import { apiContents } from '@/services/apiService';

/**
 * ✅ POST /follow/followMember
 * - 현재 로그인 사용자가 targetMember를 팔로우
 */
export const followMember = async (
  currentMemberId: string,
  targetMemberId: string,
) => {
  const formData = new FormData();
  formData.append('member_id', currentMemberId);
  formData.append('follow_member_id', targetMemberId);

  await apiContents.post('/follow/followMember', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
