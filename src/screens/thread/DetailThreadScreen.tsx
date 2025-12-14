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
import RouteThread_ChildThreadList from '@/features/thread/lists/RouteThread_ChildThreadList';
import HubThread_ChildThreadList from '@/features/thread/lists/HubThread_ChildThreadList';
import AppCollapsibleHeader from '@/common/components/AppCollapsibleHeader/AppCollapsibleHeader';
import HubThreadFloatingActions from '@/features/thread/components/HubThreadFloatingActions';
import { COLORS } from '@/common/styles/colors';
import BottomBlurGradient from '@/common/components/BottomBlurGradient/BottomBlurGradient';
import GlobalInputBar from '@/common/components/GlobalInputBar/GlobalInputBar';
import { Thread } from '@/features/thread/model/ThreadModel';

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
 * - thread 객체 또는 threadId로 진입 가능 (타입 상관없이 동일하게 처리)
 *   1. thread 객체가 있는 경우: 바로 사용 (기존 방식)
 *   2. threadId만 있는 경우: API 호출하여 thread 정보 가져옴
 * - threadType에 따라 다른 컴포넌트 렌더링
 *   1. ROUTE_THREAD: RouteThread_ChildThreadList (자식 스레드 리스트)
 *   2. HUB_THREAD: HubThread_ChildThreadList (자식 스레드 리스트)
 *   3. 일반 Thread: ThreadCommentList (댓글 리스트)
 */
const DetailThreadScreen = () => {
  const { params } = useRoute<RouteProp<RouteParams, 'DetailThread'>>();
  const navigation = useNavigation();

  // ✅ thread 또는 threadId 중 하나는 반드시 존재
  const threadFromParams = params?.thread;
  const threadIdFromParams = params?.threadId;

  // ✅ 최종 threadId 결정 (thread 객체에서 추출하거나 직접 사용)
  const threadId = threadFromParams?.threadId ?? threadIdFromParams;

  // ✅ threadId가 있으면 항상 API 호출 (타입 상관없이)
  // thread 객체가 있어도 최신 데이터를 가져올 수 있음
  const { data: fetchedThread, isLoading } = useReadThread(threadId);

  const openInputBar = useGlobalInputBarStore(s => s.open);
  const closeInputBar = useGlobalInputBarStore(s => s.close);
  const commentListRef = useRef<ThreadCommentListRef>(null);

  // ✅ 최종 사용할 thread 결정
  // fetchedThread(최신 데이터) 우선, 없으면 threadFromParams 사용
  const thread = fetchedThread ?? threadFromParams;

  // ✅ threadType 분기
  const isRouteThread = thread?.threadType === 'ROUTE_THREAD';
  const isHubThread = thread?.threadType === 'HUB_THREAD';

  // ✅ 댓글 작성 훅 (Optimistic 반영) - 일반 스레드만
  const { handleSubmit } = useCreateThreadCommentWithOptimistic(
    thread?.threadId ?? '',
    commentListRef,
  );

  const handlePressPasteMyThread = useCallback(() => {
    navigation.navigate(
      'AttachMyThreadModal' as never,
      {
        onConfirm: (selectedThreads: Thread[]) => {
          console.log(
            'TODO: attach my thread into hub',
            thread?.threadId,
            selectedThreads?.map(t => t.threadId),
          );
        },
      } as never,
    );
  }, [navigation, thread?.threadId]);

  const handlePressCreateChildThread = useCallback(() => {
    console.log('TODO: create child thread under hub', thread?.threadId);
  }, [thread?.threadId]);

  // ✅ 포커스될 때 입력창 활성화 - 일반 스레드만
  useFocusEffect(
    useCallback(() => {
      if (!thread || isRouteThread || isHubThread) return;

      openInputBar({
        placeholder: '댓글을 입력하세요…',
        isFocusing: false,
        onSubmit: text => handleSubmit(text),
      });
      return () => closeInputBar();
    }, [
      openInputBar,
      closeInputBar,
      handleSubmit,
      thread,
      isRouteThread,
      isHubThread,
    ]),
  );

  // ✅ 로딩 중이거나 thread가 없는 경우
  if (isLoading || !thread) {
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

      {isRouteThread ? (
        <RouteThread_ChildThreadList
          threadId={thread.threadId}
          headerThread={thread}
        />
      ) : isHubThread ? (
        <HubThread_ChildThreadList
          threadId={thread.threadId}
          headerThread={thread}
        />
      ) : (
        <ThreadCommentList
          ref={commentListRef}
          threadId={thread.threadId}
          headerThread={thread}
        />
      )}

      {isHubThread && (
        <HubThreadFloatingActions
          onPressPasteMyThread={handlePressPasteMyThread}
          onPressCreateChildThread={handlePressCreateChildThread}
        />
      )}

      <BottomBlurGradient height={120} />

      {/* ✅ GlobalInputBar 추가 */}
      <GlobalInputBar />
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
