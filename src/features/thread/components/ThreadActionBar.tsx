// 📄 src/features/thread/components/ThreadActionBar.tsx
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import ContentsHeartButton from '@/common/components/Contents_Heart_Button';
import ContentsIconCountButton from '@/common/components/Contents_IconCount_Button';
import ContentsShareButton from '@/common/components/Contents_Share_Button';
import ContentsDonationButton from '@/common/components/Contents_Donation_Button';

import { SPACING } from '@/common/styles/spacing';
import { useThreadQuery } from '../hooks/useThreadQuery';
import { useThreadLike } from '../hooks/useThreadLike';
import { openThreadLikeListSheet } from '../sheets/openThreadLikeListSheet';
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
 * - 좋아요 / 댓글 / 공유 / 도네이션 액션 제공
 */
const ThreadActionBar: React.FC<Props> = ({ threadId, isLoading = false }) => {
  const navigation = useNavigation<any>();

  const route = useRoute();
  const { data: thread } = useThreadQuery(threadId);
  const { member } = useCurrentMember();

  // ✅ 좋아요 훅 (캐시 자동 동기화)
  const { liked, likeCount, toggleLike, inflight } = useThreadLike({
    threadId,
    initialLiked: thread?.reactedByCurrentMember ?? false,
    initialCount: thread?.reactionCount ?? 0,
  });

  /** ✅ 좋아요 수 버튼 */
  const onPressLikeCount = useCallback(() => {
    openThreadLikeListSheet({ threadId });
  }, [threadId]);

  /** ✅ 댓글 버튼 → DetailThreadScreen 이동 */
  const onPressComment = useCallback(() => {
    if (!thread) return;
    if (route.name === 'DetailThread') return; // 이미 DetailThread면 무시
    navigation.navigate('DetailThread', { thread });
  }, [thread, route.name, navigation]);

  /** ✅ 공유 버튼 */
  const onPressShare = useCallback(() => {
    openThreadShareSheet({ threadId });
  }, [threadId]);

  /** ✅ 도네이션 버튼 */
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

  // ✅ thread 데이터가 없으면 렌더링 생략
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
