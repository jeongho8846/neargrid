// 📄 src/features/thread/screens/DetailThreadScreen.tsx
import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import {
  RouteProp,
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';

import { useGlobalInputBarStore } from '@/common/state/globalInputBarStore';
import { useCreateThreadCommentWithOptimistic } from '@/features/thread/hooks/useCreateThreadCommentWithOptimistic';
import { useReadThread } from '@/features/thread/hooks/useReadThread';
import ThreadCommentList, {
  ThreadCommentListRef,
} from '@/features/thread/lists/ThreadCommentList';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import { COLORS } from '@/common/styles/colors';
import BottomBlurGradient from '@/common/components/BottomBlurGradient/BottomBlurGradient';

type RouteParams = {
  DetailThread: {
    thread?: import('@/features/thread/model/ThreadModel').Thread;
    threadId?: string;
  };
};

/**
 * ✅ DetailThreadScreen
 * - 스크린은 feature 조합 및 데이터 흐름만 담당
 * - UI 및 비즈니스 로직은 feature 내부에서 처리
 * - thread 객체 또는 threadId로 진입 가능
 *   1. thread 객체가 있는 경우: 바로 사용 (기존 방식)
 *   2. threadId만 있는 경우: API 호출하여 thread 정보 가져옴
 */
const DetailThreadScreen = () => {
  const { params } = useRoute<RouteProp<RouteParams, 'DetailThread'>>();
  const navigation = useNavigation();

  // ✅ thread 또는 threadId 중 하나는 반드시 존재
  const threadFromParams = params?.thread;
  const threadIdFromParams = params?.threadId;

  // ✅ threadId만 있는 경우 API 호출
  const { data: fetchedThread, isLoading } = useReadThread(
    threadIdFromParams && !threadFromParams ? threadIdFromParams : undefined,
  );

  const openInputBar = useGlobalInputBarStore(s => s.open);
  const closeInputBar = useGlobalInputBarStore(s => s.close);
  const commentListRef = useRef<ThreadCommentListRef>(null);

  // ✅ 최종 사용할 thread 결정
  // threadFromParams가 있으면 우선 사용, 없으면 fetchedThread 사용
  const thread = threadFromParams ?? fetchedThread;

  // ✅ threadId만으로 진입한 경우, 데이터가 로드될 때까지 대기
  const shouldWaitForFetch = !threadFromParams && threadIdFromParams;
  const isWaitingForData = shouldWaitForFetch && (isLoading || !fetchedThread);

  // ✅ 댓글 작성 훅 (Optimistic 반영)
  const { handleSubmit } = useCreateThreadCommentWithOptimistic(
    thread?.threadId ?? '',
    commentListRef,
  );

  // ✅ 포커스될 때 입력창 활성화
  useFocusEffect(
    useCallback(() => {
      if (!thread) return;

      openInputBar({
        placeholder: '댓글을 입력하세요…',
        isFocusing: false,
        onSubmit: text => handleSubmit(text),
      });
      return () => closeInputBar();
    }, [openInputBar, closeInputBar, handleSubmit, thread]),
  );

  // ✅ 로딩 중이거나 thread가 없는 경우
  if (isWaitingForData || !thread) {
    return (
      <View style={styles.container}>
        <AppCollapsibleHeader
          titleKey="STR_FEED"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
