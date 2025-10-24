// ✅ openThreadCommentListSheet.tsx
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { useGlobalInputBarStore } from '@/common/state/globalInputBarStore';
import ThreadCommentList from '../lists/ThreadCommentList';
import { createThreadComment } from '../api/createThreadComment';
import { View, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';

export const openThreadCommentListSheet = ({
  threadId,
  currentMemberId,
}: {
  threadId: string;
  currentMemberId: string;
}) => {
  const { open } = useBottomSheetStore.getState();
  const { open: openInputBar, close: closeInputBar } =
    useGlobalInputBarStore.getState();

  open(
    <View style={styles.container}>
      <AppText style={styles.title}>댓글</AppText>
      <ThreadCommentList threadId={threadId} />
    </View>,
    {
      snapPoints: ['90%'],
      initialIndex: 1,
      onCloseCallback: closeInputBar, // ✅ 여기서 타입 에러 없음!
    },
  );

  openInputBar({
    placeholder: '댓글을 입력하세요...',
    onSubmit: async text => {
      await createThreadComment({ threadId, text, currentMemberId });
      // TODO: 댓글 새로고침
    },
  });
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, marginBottom: SPACING.sm, alignSelf: 'center' },
});
