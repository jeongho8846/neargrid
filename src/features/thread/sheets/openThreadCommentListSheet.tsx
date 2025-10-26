// src/features/thread/sheets/openThreadCommentListSheet.tsx
import { View, StyleSheet } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { useGlobalInputBarStore } from '@/common/state/globalInputBarStore';
import { memberStorage } from '@/features/member/utils/memberStorage';
import { createThreadComment } from '../api/createThreadComment';
import ThreadCommentList, {
  ThreadCommentListRef,
} from '../lists/ThreadCommentList';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { updateThreadCommentCountCache } from '../utils/updateThreadCommentCountCache';

/**
 * ✅ Hook 금지 구역
 * Hook(useRef, useState 등) 대신 일반 객체로 ref 관리
 */
export const openThreadCommentListSheet = async ({
  threadId,
}: {
  threadId: string;
}) => {
  const { open } = useBottomSheetStore.getState();
  const { open: openInputBar, close: closeInputBar } =
    useGlobalInputBarStore.getState();

  // ✅ 일반 객체로 ref 대체
  const listRef: { current: ThreadCommentListRef | null } = { current: null };

  const member = await memberStorage.getMember();
  if (!member) {
    console.warn('로그인 유저 정보 없음');
    return;
  }

  // ✅ 시트 열기
  open(
    <View style={styles.container}>
      <AppText style={styles.title}>댓글</AppText>

      {/* ref 연결 */}
      <ThreadCommentList
        ref={r => {
          listRef.current = r;
        }}
        threadId={threadId}
      />
    </View>,
    {
      snapPoints: ['90%'],
      initialIndex: 1,
      onCloseCallback: closeInputBar,
    },
  );

  // ✅ 인풋바 열기
  openInputBar({
    placeholder: '댓글을 입력하세요...',
    onSubmit: async text => {
      if (!text.trim()) return;

      const tempId = `${member.id}_${Date.now()}`;
      const tempComment = {
        commentThreadId: tempId,
        description: text,
        memberNickName: member.nickname,
        memberProfileImageUrl: member.profileImageUrl ?? '',
        createDatetime: new Date().toISOString(),
        isPending: true,
      };
      listRef.current?.addOptimisticComment(tempComment as any);

      try {
        const res = await createThreadComment({
          threadId,
          description: text,
        });

        // ✅ 성공 시 캐시에서 commentThreadCount +1
        updateThreadCommentCountCache(threadId);

        // ✅ 임시 댓글 → 실제 데이터로 교체
        listRef.current?.replaceTempComment(tempId, {
          ...res,
          isPending: false,
        });
      } catch (err) {
        console.error('댓글 등록 실패:', err);
        listRef.current?.removeTempComment(tempId);
      }
    },
  });
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 18,
    marginBottom: SPACING.sm,
    alignSelf: 'center',
  },
});
