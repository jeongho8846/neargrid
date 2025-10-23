import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import ThreadCommentList from '../lists/ThreadCommentList';
import { SPACING } from '@/common/styles/spacing';

export const openThreadCommentListSheet = ({
  threadId,
}: {
  threadId: string;
}) => {
  const { open } = useBottomSheetStore.getState();
  open(
    <View style={styles.container}>
      <AppText style={styles.title}>댓글</AppText>
      <ThreadCommentList threadId={threadId} />
    </View>,
    { snapPoints: ['90%'], initialIndex: 1 },
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: { fontSize: 18, marginBottom: SPACING.sm, alignSelf: 'center' },
});
