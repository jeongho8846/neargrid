// 📄 src/features/thread/screens/DetailThreadCommentScreen.tsx
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import { COLORS } from '@/common/styles/colors';
import type { ThreadComment } from '@/features/thread/model/ThreadCommentModel';
import ThreadCommentReplyList from '@/features/thread/lists/ThreadCommnetReplyList';
import BottomBlurGradient from '@/common/components/BottomBlurGradient/BottomBlurGradient';
import { useReadCommentThread } from '@/features/thread/hooks/useReadCommentThread';

type RouteParams = {
  DetailThreadComment: {
    comment?: ThreadComment;
    commentThreadId?: string;
    threadId?: string;
  };
};

/**
 * ✅ DetailThreadCommentScreen
 * - 부모 댓글 + 대댓글 목록 표시
 * - 입력창은 ThreadCommentReplyList 내부에서 관리
 * - comment 객체 또는 commentThreadId + threadId로 진입 가능
 *   1. comment 객체가 있는 경우: 바로 사용 (기존 방식)
 *   2. commentThreadId + threadId만 있는 경우: API 호출하여 comment 정보 가져옴
 */
const DetailThreadCommentScreen = () => {
  const { params } = useRoute<RouteProp<RouteParams, 'DetailThreadComment'>>();
  const navigation = useNavigation();

  // ✅ comment 또는 commentThreadId + threadId 중 하나는 반드시 존재
  const commentFromParams = params?.comment;
  const commentThreadIdFromParams = params?.commentThreadId;
  const threadIdFromParams = params?.threadId;

  // ✅ commentThreadId + threadId만 있는 경우 API 호출
  const { data: fetchedComment, isLoading } = useReadCommentThread(
    commentThreadIdFromParams && !commentFromParams
      ? commentThreadIdFromParams
      : undefined,
    threadIdFromParams && !commentFromParams ? threadIdFromParams : undefined,
  );

  // ✅ 최종 사용할 comment 결정
  const comment = commentFromParams ?? fetchedComment;

  // ✅ commentThreadId로 진입한 경우, 데이터가 로드될 때까지 대기
  const shouldWaitForFetch = !commentFromParams && commentThreadIdFromParams;
  const isWaitingForData = shouldWaitForFetch && (isLoading || !fetchedComment);

  // ✅ 로딩 중이거나 comment가 없는 경우
  if (isWaitingForData || !comment) {
    return (
      <View style={styles.container}>
        <AppCollapsibleHeader
          titleKey="STR_COMMENT"
          isAtTop={false}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppCollapsibleHeader
        titleKey="STR_COMMENT"
        isAtTop={false}
        onBackPress={() => navigation.goBack()}
      />
      <ThreadCommentReplyList parentComment={comment} />
      <BottomBlurGradient height={120}></BottomBlurGradient>
    </View>
  );
};

export default DetailThreadCommentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
