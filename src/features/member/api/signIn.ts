import { apiMember } from '../../../services/apiService';
import { SignInResponseDto } from '../types';

export const signIn = async (email: string, password: string) => {
  const res = await apiMember.post<SignInResponseDto>('/member/signIn', {
    email,
    password,
  });
  return res.data;
};
