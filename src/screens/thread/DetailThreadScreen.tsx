// 📄 src/features/thread/screens/DetailThreadScreen.tsx
import React, { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  RouteProp,
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';

import { useGlobalInputBarStore } from '@/common/state/globalInputBarStore';
import { useCreateThreadCommentWithOptimistic } from '@/features/thread/hooks/useCreateThreadCommentWithOptimistic';
import ThreadCommentList, {
  ThreadCommentListRef,
} from '@/features/thread/lists/ThreadCommentList';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import { COLORS } from '@/common/styles/colors';
import BottomBlurGradient from '@/common/components/BottomBlurGradient/BottomBlurGradient';

type RouteParams = {
  DetailThread: {
    thread: import('@/features/thread/model/ThreadModel').Thread;
  };
};

/**
 * ✅ DetailThreadScreen
 * - 스크린은 feature 조합 및 데이터 흐름만 담당
 * - UI 및 비즈니스 로직은 feature 내부에서 처리
 */
const DetailThreadScreen = () => {
  const { params } = useRoute<RouteProp<RouteParams, 'DetailThread'>>();
  const { thread } = params;
  const navigation = useNavigation();

  const openInputBar = useGlobalInputBarStore(s => s.open);
  const closeInputBar = useGlobalInputBarStore(s => s.close);
  const commentListRef = useRef<ThreadCommentListRef>(null);

  // ✅ 댓글 작성 훅 (Optimistic 반영)
  const { handleSubmit } = useCreateThreadCommentWithOptimistic(
    thread.threadId,
    commentListRef,
  );

  // ✅ 포커스될 때 입력창 활성화
  useFocusEffect(
    useCallback(() => {
      openInputBar({
        placeholder: '댓글을 입력하세요…',
        isFocusing: false,
        onSubmit: text => handleSubmit(text),
      });
      return () => closeInputBar();
    }, [openInputBar, closeInputBar, handleSubmit]),
  );

  return (
    <View style={styles.container}>
      <AppCollapsibleHeader
        titleKey="STR_FEED"
        isAtTop={false}
        onBackPress={() => navigation.goBack()}
      />
      <ThreadCommentList
        ref={commentListRef}
        threadId={thread.threadId}
        headerThread={thread}
      />
      <BottomBlurGradient height={120}></BottomBlurGradient>
    </View>
  );
};

export default DetailThreadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
