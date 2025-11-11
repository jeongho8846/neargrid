import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import MemberBlockedItemCard from '../components/MemberBlockedItemCard';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useGetBlockedMember } from '@/features/member/hooks/useGetBlockedMember';
import { useBlockMemberCancel } from '@/features/member/hooks/useBlockMemberCancel';

export const openBlockedMemberListSheet = () => {
  const { open } = useBottomSheetStore.getState();

  open(<BlockedMemberListSheetContent />, {
    snapPoints: ['90%'],
    initialIndex: 1,
    enableHandlePanningGesture: true,
    enableContentPanningGesture: true,
  });
};

const BlockedMemberListSheetContent: React.FC = () => {
  const { member: currentMember } = useCurrentMember(); // ✅ 현재 로그인 유저
  const { data, isLoading } = useGetBlockedMember(currentMember?.id ?? '');
  const { mutate: unblockMember } = useBlockMemberCancel(); // ✅ 훅은 루트에서만 호출

  const members = data ?? [];

  const handleUnblockPress = (targetId: string) => {
    if (!currentMember?.id) return;
    unblockMember({
      currentMemberId: currentMember.id,
      targetMemberId: targetId,
    });
  };

  const renderItem = ({ item }: any) => (
    <MemberBlockedItemCard
      id={item.id}
      nickName={item.nickName}
      profileImageUrl={item.profileImageUrl}
      onPressProfile={memberId => console.log('🔹 프로필 이동:', memberId)}
      onUnblockPress={handleUnblockPress}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <AppText
        i18nKey="STR_BLOCKED_LIST"
        variant="caption"
        style={styles.title}
        isLoading={isLoading}
      />

      <BottomSheetFlatList
        showsVerticalScrollIndicator={false}
        data={members}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !isLoading && (
            <AppText
              i18nKey="STR_BLOCK_EMPTY"
              variant="caption"
              style={styles.empty}
            />
          )
        }
      />
    </View>
  );
};

export default BlockedMemberListSheetContent;

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.body,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  listContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  empty: {
    alignSelf: 'center',
    color: COLORS.body,
    marginTop: SPACING.lg,
  },
});
