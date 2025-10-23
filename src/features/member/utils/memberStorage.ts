// src/features/member/utils/memberStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Member } from '../types';

const MEMBER_KEY = 'current_member';

export const memberStorage = {
  async saveMember(member: Member) {
    try {
      await AsyncStorage.setItem(MEMBER_KEY, JSON.stringify(member));
    } catch (e) {
      console.log('❌ memberStorage.saveMember 실패:', e);
    }
  },

  async getMember(): Promise<Member | null> {
    try {
      const json = await AsyncStorage.getItem(MEMBER_KEY);
      return json ? JSON.parse(json) : null;
    } catch (e) {
      console.log('❌ memberStorage.getMember 실패:', e);
      return null;
    }
  },

  async clearMember() {
    try {
      await AsyncStorage.removeItem(MEMBER_KEY);
    } catch (e) {
      console.log('❌ memberStorage.clearMember 실패:', e);
    }
  },
};
