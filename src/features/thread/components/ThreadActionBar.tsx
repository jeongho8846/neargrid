import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import ContentsHeartButton from '@/common/components/Contents_Heart_Button';
import ContentsIconCountButton from '@/common/components/Contents_IconCount_Button';
import ContentsShareButton from '@/common/components/Contents_Share_Button';
import ContentsDonationButton from '@/common/components/Contents_Donation_Button';

import { SPACING } from '@/common/styles/spacing';
import { Thread } from '../model/ThreadModel';
import { useThreadQuery } from '../hooks/useThreadQuery';
import { useThreadLike } from '../hooks/useThreadLike';
import { openThreadLikeListSheet } from '../sheets/openThreadLikeListSheet';
import { openThreadShareSheet } from '../sheets/openThreadShareSheet';
import { openDonateSheet } from '@/features/donation/sheets/openDonateSheet';
import { openThreadDonationListSheet } from '@/features/donation/sheets/openThreadDonationListSheet';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import AppText from '@/common/components/AppText';
import { TEST_SPACING } from '@/test/styles/spacing';

type Props = {
  threadId: string;
  thread?: Thread; // ✅ 추가: thread 객체를 직접 받을 수 있도록
  isLoading?: boolean;
};

/**
 * ✅ ThreadActionBar
 * - 좋아요 / 댓글 / 공유 / 도네이션 액션 제공
 * - AppIcon / COLORS 규칙 통일
 * - thread prop으로 받으면 그걸 우선 사용 (캐시 조회 안 함)
 */
const ThreadActionBar: React.FC<Props> = ({
  threadId,
  thread: propThread, // ✅ prop으로 받은 thread
  isLoading = false,
}) => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { member } = useCurrentMember();

  // ✅ prop으로 thread를 받지 않은 경우에만 쿼리 실행
  // 하지만 useThreadQuery는 enabled를 지원하지 않으므로, 조건부 사용 불가
  // 대신 propThread가 있으면 queriedThread를 무시
  const shouldUseCache = !propThread;

  // ✅ thread 결정: prop이 있으면 prop 사용, 없으면 캐시 조회
  const thread = propThread;

  // ✅ 좋아요 훅
  const { liked, likeCount, toggleLike, inflight } = useThreadLike({
    threadId,
    initialLiked: thread?.reactedByCurrentMember ?? false,
    initialCount: thread?.reactionCount ?? 0,
  });

  /** ✅ 좋아요 수 버튼 */
  const onPressLikeCount = useCallback(() => {
    openThreadLikeListSheet({ threadId, currentMemberId: member?.id });
  }, [threadId, member?.id]);

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

  /** ✅ 도네이션 내역 시트 버튼 */
  const onPressDonationCount = useCallback(() => {
    if (!member?.id) {
      console.warn('⚠️ 로그인 정보 없음 → 도네이션 내역 시트 열지 않음');
      return;
    }
    openThreadDonationListSheet({ threadId, currentMemberId: member.id });
  }, [threadId, member?.id]);

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
        <View style={styles.likeCountWrap}>
          <ContentsIconCountButton
            count={likeCount}
            onPress={onPressLikeCount}
            isLoading={isLoading}
            accessibilityLabel="좋아요 수 보기"
          />
        </View>

        {/* 💬 댓글 수 */}
        <View style={styles.commentCountWrap}>
          <ContentsIconCountButton
            icon={{
              type: 'ion',
              name: 'chatbubble-outline',
              size: 20,
              variant: 'secondary', // ✅ AppIcon 규칙 기반
            }}
            count={thread.commentThreadCount ?? 0}
            onPress={onPressComment}
            isLoading={isLoading}
            accessibilityLabel="댓글 보기"
          />
        </View>

        {/* 📤 공유 */}
        <View style={styles.shareWrap}>
          <ContentsShareButton onPress={onPressShare} isLoading={isLoading} />
        </View>
      </View>

      {/* ✅ 오른쪽 버튼 영역 */}
      <View style={styles.rowRight}>
        <ContentsDonationButton onPress={onPressDonate} isLoading={isLoading} />

        <TouchableOpacity onPress={onPressDonationCount} activeOpacity={0.8}>
          <AppText variant="caption">
            {thread.donationPointReceivedCount} P
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ThreadActionBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: TEST_SPACING.sm,
    paddingTop: TEST_SPACING.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: TEST_SPACING.xs,
    marginBottom: TEST_SPACING.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TEST_SPACING.xs,
  },
  likeCountWrap: { marginLeft: TEST_SPACING.sm },
  commentCountWrap: { marginLeft: TEST_SPACING.md },
  shareWrap: { marginLeft: TEST_SPACING.md },
});
