// 📄 src/features/thread/screens/DetailThreadCommentScreen.tsx
import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import {
  useRoute,
  RouteProp,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import { COLORS } from '@/common/styles/colors';
import type { ThreadComment } from '@/features/thread/model/ThreadCommentModel';
import ThreadCommentReplyList from '@/features/thread/lists/ThreadCommnetReplyList';
import BottomBlurGradient from '@/common/components/BottomBlurGradient/BottomBlurGradient';
import { useReadCommentThread } from '@/features/thread/hooks/useReadCommentThread';
import GlobalInputBar from '@/common/components/GlobalInputBar/GlobalInputBar';
import { useGlobalInputBarStore } from '@/common/state/globalInputBarStore';
import { useCreateThreadCommentReplyWithOptimistic } from '@/features/thread/hooks/useCreateThreadCommentReplyWithOptimistic';
import { ThreadCommentListRef } from '@/features/thread/lists/ThreadCommentList';

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
 * - GlobalInputBar와 Optimistic Update 연동
 * - comment 객체 또는 commentThreadId + threadId로 진입 가능
 */
const DetailThreadCommentScreen = () => {
  const { params } = useRoute<RouteProp<RouteParams, 'DetailThreadComment'>>();
  const navigation = useNavigation();

  const commentFromParams = params?.comment;
  const commentThreadIdFromParams = params?.commentThreadId;
  const threadIdFromParams = params?.threadId;

  const { data: fetchedComment, isLoading } = useReadCommentThread(
    commentThreadIdFromParams && !commentFromParams
      ? commentThreadIdFromParams
      : undefined,
    threadIdFromParams && !commentFromParams ? threadIdFromParams : undefined,
  );

  const comment = commentFromParams ?? fetchedComment;

  // ✅ GlobalInputBar 상태 관리
  const openInputBar = useGlobalInputBarStore(s => s.open);
  const closeInputBar = useGlobalInputBarStore(s => s.close);
  const replyListRef = useRef<ThreadCommentListRef>(null);

  // ✅ 대댓글 작성 훅 (Optimistic Update 포함)
  const { handleSubmit } = useCreateThreadCommentReplyWithOptimistic(
    comment?.threadId ?? '',
    replyListRef,
  );

  // ✅ 포커스될 때 입력창 활성화 및 onSubmit 연결
  useFocusEffect(
    useCallback(() => {
      if (!comment) return;

      openInputBar({
        placeholder: '답글을 입력하세요…',
        isFocusing: false,
        // ✅ parentCommentThreadId를 미리 전달하는 래퍼 함수
        onSubmit: (text: string) => handleSubmit(text, comment.commentThreadId),
      });
      return () => closeInputBar();
    }, [openInputBar, closeInputBar, handleSubmit, comment]),
  );

  const shouldWaitForFetch = !commentFromParams && commentThreadIdFromParams;
  const isWaitingForData = shouldWaitForFetch && (isLoading || !fetchedComment);

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

      {/* ✅ ref 연결 */}
      <ThreadCommentReplyList ref={replyListRef} parentComment={comment} />

      <BottomBlurGradient height={120} />
      <GlobalInputBar />
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
