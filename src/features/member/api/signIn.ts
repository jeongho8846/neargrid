import { apiMember } from '../../../services/apiService';
import { AuthResponseDto } from '../types';

export const signIn = async (email: string, password: string) => {
  const res = await apiMember.post<AuthResponseDto>('/member/signIn', {
    email,
    password,
  });
  return res.data;
};
