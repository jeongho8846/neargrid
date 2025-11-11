import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import { COLORS, SPACING } from '@/common/styles';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useBlockMember } from '@/features/member/hooks/useBlockMember';
import { openProfileMenuSheet } from '../sheets/openProfileMenuSheet'; // ✅ 원래 시트 재열기용 import
import { BottomSheetView } from '@gorhom/bottom-sheet';

/**
 * 🔹 차단 확인 모달 (로그아웃 모달과 동일한 UX)
 */
export const openBlockConfirmModal = ({
  isMyProfile,
  targetMemberId,
}: {
  isMyProfile: boolean;
  targetMemberId: string;
}) => {
  const { open } = useBottomSheetStore.getState();

  open(
    <BlockConfirmContent
      isMyProfile={isMyProfile}
      targetMemberId={targetMemberId}
    />,
    {
      snapPoints: [220],
      enableHandlePanningGesture: false,
      enableContentPanningGesture: false,
      backdropPressToClose: true,
      initialIndex: 1,
    },
  );
};

/**
 * ✅ 실제 confirm 시트 컴포넌트
 */
const BlockConfirmContent = ({
  isMyProfile,
  targetMemberId,
}: {
  isMyProfile: boolean;
  targetMemberId: string;
}) => {
  const { close } = useBottomSheetStore();
  const { member: currentMember } = useCurrentMember();
  const { mutate: blockMember } = useBlockMember(currentMember?.id ?? '');

  const handleConfirm = async () => {
    if (!targetMemberId || !currentMember) return;
    blockMember(targetMemberId, {
      onSuccess: () => {
        console.log('✅ 차단 완료:', targetMemberId);
        close();
      },
      onError: (err: any) => {
        console.error('❌ 차단 실패:', err?.message);
      },
    });
  };

  const handleCancel = () => {
    close();
    setTimeout(() => {
      openProfileMenuSheet({ isMyProfile, targetMemberId }); // ✅ 원래 시트 재오픈
    }, 250);
  };

  return (
    <BottomSheetView style={styles.container}>
      <AppText
        i18nKey="STR_BLOCK_CONFIRM"
        variant="body"
        style={styles.title}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancel]}
          onPress={handleCancel}
        >
          <AppText i18nKey="STR_CANCEL" variant="body" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.block]}
          onPress={handleConfirm}
        >
          <AppText i18nKey="STR_BLOCK" variant="body" />
        </TouchableOpacity>
      </View>
    </BottomSheetView>
  );
};

export default BlockConfirmContent;

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    color: COLORS.title,
    marginBottom: SPACING.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  button: {
    minWidth: 100,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancel: {
    backgroundColor: COLORS.gray_light,
  },
  block: {
    backgroundColor: COLORS.error,
  },
});
