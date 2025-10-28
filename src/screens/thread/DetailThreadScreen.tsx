// src/features/thread/screens/DetailThreadScreen.tsx
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

type RouteParams = {
  DetailThread: {
    thread: import('@/features/thread/model/ThreadModel').Thread;
  };
};

const DetailThreadScreen = () => {
  const { params } = useRoute<RouteProp<RouteParams, 'DetailThread'>>();
  const { thread } = params;
  const navigation = useNavigation();

  const openInputBar = useGlobalInputBarStore(s => s.open);
  const closeInputBar = useGlobalInputBarStore(s => s.close);
  const commentListRef = useRef<ThreadCommentListRef>(null);

  // ✅ 댓글 작성 로직을 훅에서 받아옴
  const { handleSubmit } = useCreateThreadCommentWithOptimistic(
    thread.threadId,
    commentListRef,
  );

  useFocusEffect(
    useCallback(() => {
      openInputBar({
        placeholder: '댓글을 입력하세요…',
        isFocusing: false,
        onSubmit: (text: string) => handleSubmit(text), // ← parent 없음 = 댓글
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
