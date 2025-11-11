import { apiMember } from '@/services/apiService';

export const signOutApi = async (memberId: string) => {
  const formData = new FormData();
  formData.append('member_id', memberId);
  console.log('로그아웃 멤버아이디', memberId);
  const res = await apiMember.post('/member/signOut', formData);
  return res.data;
};
