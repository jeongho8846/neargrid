import { useCallback, useState } from 'react';
import { followMember } from '../api/followMember';
import { unfollowMember } from '../api/unfollowMember';

type Params = {
  currentMemberId?: string;
  targetMemberId?: string;
  onChange?: (isFollowed: boolean) => void;
};

/**
 * ✅ 팔로우/언팔로우 토글 훅
 * - UI 상태를 즉시 반영하기 위해 onChange 콜백 제공
 */
export const useFollowMember = ({
  currentMemberId,
  targetMemberId,
  onChange,
}: Params) => {
  const [loading, setLoading] = useState(false);

  const toggleFollow = useCallback(
    async (isCurrentlyFollowed: boolean) => {
      if (!currentMemberId || !targetMemberId) {
        console.warn(
          '[useFollowMember] memberId가 없어 요청을 건너뜁니다.',
          currentMemberId,
          targetMemberId,
        );
        return;
      }

      try {
        setLoading(true);
        if (isCurrentlyFollowed) {
          console.log('📡 언팔로우 요청:', currentMemberId, '→', targetMemberId);
          await unfollowMember(currentMemberId, targetMemberId);
        } else {
          console.log('📡 팔로우 요청:', currentMemberId, '→', targetMemberId);
          await followMember(currentMemberId, targetMemberId);
        }

        onChange?.(!isCurrentlyFollowed);
      } catch (error) {
        console.error(
          isCurrentlyFollowed
            ? '❌ 언팔로우 실패'
            : '❌ 팔로우 실패',
          error,
        );
      } finally {
        setLoading(false);
      }
    },
    [currentMemberId, targetMemberId, onChange],
  );

  return { toggleFollow, loading };
};
