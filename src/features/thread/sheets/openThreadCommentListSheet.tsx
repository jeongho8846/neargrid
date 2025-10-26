// src/features/thread/sheets/openThreadCommentListSheet.tsx
import { StyleSheet } from 'react-native';
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

  open(
    <>
      <AppText style={styles.title}>댓글</AppText>
      <ThreadCommentList
        ref={r => {
          listRef.current = r;
        }}
        threadId={threadId}
      />
    </>,
    {
      snapPoints: ['90%'], // ✅ 2개 이상으로 설정
      initialIndex: 1, // ✅ 유효 인덱스
      enableHandlePanningGesture: true,
      enableContentPanningGesture: true,
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
