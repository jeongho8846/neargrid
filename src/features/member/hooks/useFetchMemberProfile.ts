import { useState, useEffect } from 'react';
import { fetchMemberProfile } from '../api/fetchMemberProfile';

/**
 * ✅ useFetchMemberProfile (단순 버전 + 디버깅 로그 추가)
 */
export const useFetchMemberProfile = (
  currentMemberId: string,
  targetUserId: string,
  options?: { enabled?: boolean },
) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('🧭 [useFetchMemberProfile] 실행됨');
    console.log(' - currentMemberId:', currentMemberId);
    console.log(' - targetUserId:', targetUserId);
    console.log(' - enabled:', options?.enabled);

    if (!currentMemberId || !targetUserId) {
      console.log('⚠️ [useFetchMemberProfile] 조건 불충족 → 호출 안 함');
      return;
    }

    const load = async () => {
      console.log('🚀 [useFetchMemberProfile] API 호출 시작');
      try {
        setLoading(true);
        setError(null);

        const data = await fetchMemberProfile(currentMemberId, targetUserId);
        console.log('✅ [useFetchMemberProfile] API 성공');
        console.log('📦 받은 데이터:', data);

        setProfile(data);
        console.log('API에서 가져온 프로필 raw', data);
      } catch (err) {
        console.error('❌ [useFetchMemberProfile] API 에러:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
        console.log('🕐 [useFetchMemberProfile] 로딩 종료');
      }
    };

    load();
  }, [currentMemberId, targetUserId, options?.enabled]);

  // 상태 변화를 관찰하고 싶으면 추가 로그 ↓
  useEffect(() => {
    console.log('🎯 [useFetchMemberProfile] 상태 변경 →', {
      loading,
      hasProfile: !!profile,
      error: error ? error.message : null,
    });
  }, [loading, profile, error]);

  return { data: profile, isLoading: loading, error };
};
