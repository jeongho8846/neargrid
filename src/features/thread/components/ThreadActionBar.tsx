import React, { memo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

import ContentsHeartButton from '@/common/components/Contents_Heart_Button';
import ContentsIconCountButton from '@/common/components/Contents_IconCount_Button';
import ContentsShareButton from '@/common/components/Contents_Share_Button';
import ContentsDonationButton from '@/common/components/Contents_Donation_Button';

import { SPACING } from '@/common/styles/spacing';
import { Thread } from '../model/ThreadModel';
import { useThreadLike } from '../hooks/useThreadLike';
import { openThreadLikeListSheet } from '../sheets/openThreadLikeListSheet';
import { openThreadCommentListSheet } from '../sheets/openThreadCommentListSheet';
import { openThreadShareSheet } from '../sheets/openThreadShareSheet';
import { openDonateSheet } from '@/features/donation/sheets/openDonateSheet';

// ✅ 타입 전용 import로 런타임 번들에서 제외
type ListParams = Parameters<
  typeof import('../keys/threadKeys').THREAD_KEYS.list
>;

type Props = {
  thread: Thread;
  isLoading?: boolean;
  listParams?: ListParams;
};

const ThreadActionBar: React.FC<Props> = ({
  thread,
  isLoading = false,
  listParams = [] as ListParams,
}) => {
  const { liked, likeCount, toggleLike, inflight } = useThreadLike({
    threadId: thread.threadId,
    initialLiked: thread.reactedByCurrentMember,
    initialCount: thread.reactionCount ?? 0,
    listParams,
  });

  const onPressLikeCount = useCallback(() => {
    openThreadLikeListSheet({ threadId: thread.threadId });
  }, [thread.threadId]);

  const onPressComment = useCallback(() => {
    openThreadCommentListSheet({ threadId: thread.threadId });
  }, [thread.threadId]);

  const onPressShare = useCallback(() => {
    openThreadShareSheet({ threadId: thread.threadId });
  }, [thread]);

  const onPressDonate = useCallback(() => {
    openDonateSheet({
      currentMemberId: '682867966802399783', // ✅ 실제 로그인 유저 id
      threadId: thread.threadId, // hread 모델의 threadId✅ T
      currentPoint: 0, // 선택
    });
  }, [thread.threadId]);

  return (
    <View style={styles.container}>
      <View style={styles.rowLeft}>
        <ContentsHeartButton
          liked={liked}
          onToggle={toggleLike}
          isLoading={isLoading}
          disabled={inflight || !thread.available || thread.hiddenDueToReport}
        />

        {/* ❤️ 좋아요 수 (likeCount 사용) */}
        <View style={{ marginLeft: SPACING.sm }}>
          <ContentsIconCountButton
            count={likeCount} // ✅ fix: thread.commentThreadCount → likeCount
            onPress={onPressLikeCount}
            isLoading={isLoading}
            accessibilityLabel="좋아요한 유저 보기"
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

        <View style={{ marginLeft: SPACING.md }}>
          <ContentsShareButton onPress={onPressShare} isLoading={isLoading} />
        </View>
      </View>

      <View style={styles.rowRight}>
        <ContentsDonationButton onPress={onPressDonate} isLoading={isLoading} />
      </View>
    </View>
  );
};

export default memo(ThreadActionBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.md,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});
