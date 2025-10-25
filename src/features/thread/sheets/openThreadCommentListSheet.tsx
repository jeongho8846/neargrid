// src/features/thread/sheets/openThreadCommentListSheet.tsx
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { useGlobalInputBarStore } from '@/common/state/globalInputBarStore';
import { useLocationStore } from '@/features/location/state/locationStore';
import ThreadCommentList from '../lists/ThreadCommentList';
import { createThreadComment } from '../api/createThreadComment';
import { View, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';

export const openThreadCommentListSheet = ({
  threadId,
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
      onCloseCallback: closeInputBar,
    },
  );

  openInputBar({
    placeholder: '댓글을 입력하세요...',
    onSubmit: async text => {
      const { latitude, longitude } = useLocationStore.getState();
      if (!latitude || !longitude) {
        console.warn('위치 정보 없음');
        return;
      }

      await createThreadComment({
        threadId,
        description: text,
      });

      console.log('댓글 등록 완료 ✅');
      // TODO: 댓글 리스트 새로고침
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
