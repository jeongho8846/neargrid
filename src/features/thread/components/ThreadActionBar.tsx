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
import { openDonateSheet } from '../sheets/openDonateSheet';

type Props = {
  thread: Thread;
  isLoading?: boolean;
  listParams?: any[];
};

const ThreadActionBar: React.FC<Props> = ({
  thread,
  isLoading = false,
  listParams = [],
}) => {
  const { liked, likeCount, toggleLike, inflight } = useThreadLike({
    threadId: thread.threadId,
    initialLiked: false,
    initialCount: thread.popularityScore ?? 0,
    listParams,
  });

  const onPressLikeCount = useCallback(() => {
    openThreadLikeListSheet({ threadId: thread.threadId });
  }, [thread.threadId]);

  const onPressComment = useCallback(() => {
    openThreadCommentListSheet({ threadId: thread.threadId });
  }, [thread.threadId]);

  const onPressShare = useCallback(() => {
    openThreadShareSheet({ thread });
  }, [thread]);

  const onPressDonate = useCallback(() => {
    openDonateSheet({
      targetMemberId: thread.memberId,
      threadId: thread.threadId,
    });
  }, [thread.memberId, thread.threadId]);

  return (
    <View style={styles.container}>
      <View style={styles.rowLeft}>
        {/* 하트 */}
        <ContentsHeartButton
          liked={liked}
          onToggle={toggleLike}
          isLoading={isLoading}
          disabled={inflight}
        />

        {/* 하트 ↔ 좋아요수 = SPACING.sm */}
        <View style={{ marginLeft: SPACING.sm }}>
          <ContentsIconCountButton
            count={likeCount}
            onPress={onPressLikeCount}
            isLoading={isLoading}
            accessibilityLabel="좋아요한 유저 보기"
          />
        </View>

        {/* 좋아요수 ↔ 댓글 = SPACING.md */}
        <View style={{ marginLeft: SPACING.md }}>
          <ContentsIconCountButton
            icon={{ type: 'ion', name: 'chatbubble-outline', size: 20 }}
            count={0} // TODO: 댓글 수 연결
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
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap 제거: 개별 marginLeft로 컨트롤
  },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});
