// 📄 src/features/thread/components/ThreadActionBar.tsx
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

import ContentsHeartButton from '@/common/components/Contents_Heart_Button';
import ContentsIconCountButton from '@/common/components/Contents_IconCount_Button';
import ContentsShareButton from '@/common/components/Contents_Share_Button';
import ContentsDonationButton from '@/common/components/Contents_Donation_Button';

import { SPACING } from '@/common/styles/spacing';
import { useThreadQuery } from '../hooks/useThreadQuery';
import { useThreadLike } from '../hooks/useThreadLike';
import { openThreadLikeListSheet } from '../sheets/openThreadLikeListSheet';
import { openThreadCommentListSheet } from '../sheets/openThreadCommentListSheet';
import { openThreadShareSheet } from '../sheets/openThreadShareSheet';
import { openDonateSheet } from '@/features/donation/sheets/openDonateSheet';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

type Props = {
  threadId: string;
  isLoading?: boolean;
};

/**
 * ✅ ThreadActionBar
 * - React Query 캐시 기반 구조
 * - 캐시가 갱신되면 자동으로 리렌더됨
 * - 좋아요 / 댓글 / 공유 / 도네이션 액션 제공
 */
const ThreadActionBar: React.FC<Props> = ({ threadId, isLoading = false }) => {
  const { data: thread } = useThreadQuery(threadId);
  const { member } = useCurrentMember();

  // ✅ 좋아요 관련 훅 (캐시 자동 동기화)
  const { liked, likeCount, toggleLike, inflight } = useThreadLike({
    threadId,
    initialLiked: thread?.reactedByCurrentMember ?? false,
    initialCount: thread?.reactionCount ?? 0,
  });

  /**
   * ✅ 모든 useCallback은 조건문보다 위에 선언해야 함
   * (React Hook 규칙: 항상 같은 순서로 호출)
   */
  const onPressLikeCount = useCallback(() => {
    openThreadLikeListSheet({ threadId });
  }, [threadId]);

  const onPressComment = useCallback(() => {
    openThreadCommentListSheet({ threadId });
  }, [threadId]);

  const onPressShare = useCallback(() => {
    openThreadShareSheet({ threadId });
  }, [threadId]);

  const onPressDonate = useCallback(() => {
    if (!member?.id) {
      console.warn('⚠️ 로그인 정보 없음 → 도네이션 시트 열지 않음');
      return;
    }
    openDonateSheet({
      currentMemberId: member.id,
      threadId,
      currentPoint: 0, // TODO: 추후 유저 포인트 연동
    });
  }, [member, threadId]);

  // ✅ thread 데이터가 아직 캐시에 없으면 렌더링 생략
  if (!thread) return null;

  return (
    <View style={styles.container}>
      {/* ✅ 왼쪽 버튼 영역 */}
      <View style={styles.rowLeft}>
        {/* ❤️ 좋아요 버튼 */}
        <ContentsHeartButton
          liked={liked}
          onToggle={toggleLike}
          isLoading={isLoading}
          disabled={inflight || !thread.available || thread.hiddenDueToReport}
        />

        {/* ❤️ 좋아요 수 */}
        <View style={{ marginLeft: SPACING.sm }}>
          <ContentsIconCountButton
            count={likeCount}
            onPress={onPressLikeCount}
            isLoading={isLoading}
            accessibilityLabel="좋아요 수 보기"
          />
        </View>

        {/* 💬 댓글 수 */}
        <View style={{ marginLeft: SPACING.md }}>
          <ContentsIconCountButton
            icon={{ type: 'ion', name: 'chatbubble-outline', size: 20 }}
            count={thread.commentThreadCount ?? 0}
            onPress={onPressComment}
            isLoading={isLoading}
            accessibilityLabel="댓글 보기"
          />
        </View>

        {/* 📤 공유 */}
        <View style={{ marginLeft: SPACING.md }}>
          <ContentsShareButton onPress={onPressShare} isLoading={isLoading} />
        </View>
      </View>

      {/* ✅ 오른쪽 버튼 영역 */}
      <View style={styles.rowRight}>
        <ContentsDonationButton onPress={onPressDonate} isLoading={isLoading} />
      </View>
    </View>
  );
};

export default ThreadActionBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.md,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
});
