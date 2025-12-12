import { apiContents } from '@/services/apiService';

/**
 * ✅ POST /follow/unfollowMember
 * - 현재 로그인 사용자가 targetMember를 언팔로우
 */
export const unfollowMember = async (
  currentMemberId: string,
  targetMemberId: string,
) => {
  const formData = new FormData();
  formData.append('member_id', currentMemberId);
  formData.append('unfollow_member_id', targetMemberId);

  await apiContents.post('/follow/unfollowMember', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
