// src/features/member/utils/memberStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Member } from '../types';

const MEMBER_KEY = '@papaya:current_member'; // ✅ 1. 네임스페이스 추가

export const memberStorage = {
  async saveMember(member: Member): Promise<void> {
    // ✅ 2. 반환 타입 명시
    console.log(
      '💾 [memberStorage] 유저 데이터 저장:',
      member.id,
      member.nickname,
    );
    try {
      await AsyncStorage.setItem(MEMBER_KEY, JSON.stringify(member));
      console.log('✅ [memberStorage] 저장 성공');
    } catch (e) {
      console.error('❌ [memberStorage] saveMember 실패:', e);
      throw e; // ✅ 3. 에러 전파 (호출부에서 처리 가능하게)
    }
  },

  async getMember(): Promise<Member | null> {
    try {
      const json = await AsyncStorage.getItem(MEMBER_KEY);
      if (!json) {
        console.log('ℹ️ [memberStorage] 저장된 유저 없음');
        return null;
      }

      const member = JSON.parse(json) as Member;
      console.log(
        '✅ [memberStorage] 유저 데이터 로드:',
        member.id,
        member.nickname,
      );
      return member;
    } catch (e) {
      console.error('❌ [memberStorage] getMember 실패:', e);
      // ✅ 4. 손상된 데이터 자동 삭제
      await this.clearMember();
      return null;
    }
  },

  async clearMember(): Promise<void> {
    // ✅ 5. 반환 타입 명시
    try {
      await AsyncStorage.removeItem(MEMBER_KEY);
      console.log('✅ [memberStorage] 유저 데이터 삭제 완료');
    } catch (e) {
      console.error('❌ [memberStorage] clearMember 실패:', e);
      throw e;
    }
  },
};
