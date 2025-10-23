import { useState } from 'react';
import { signIn } from '../api/signIn';
import { tokenStorage } from '../utils/tokenStorage';
import { toMember } from '../mappers';
import { memberStorage } from '../utils/memberStorage';

export const useSignin = () => {
  const [loading, setLoading] = useState(false);

  const signin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { accessToken, refreshToken, ...dto } = await signIn(
        email,
        password,
      );

      await tokenStorage.saveTokens(accessToken, refreshToken);

      const member = toMember(dto);
      await memberStorage.saveMember(member);

      return { success: true, member };
    } catch (err: any) {
      console.log('❌ 로그인 실패:', err?.response || err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { signin, loading };
};
