import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import AppText from '@/common/components/AppText';
import { COLORS, SPACING } from '@/common/styles';
import { useLogout } from '../hooks/useLogout';
import { openProfileMenuSheet } from '../sheets/openProfileMenuSheet'; // ✅ 원래 시트 재열기용 import
import { BottomSheetView } from '@gorhom/bottom-sheet';

// ✅ 단순히 시트 열기
export const openLogoutConfirmModal = ({
  isMyProfile,
}: {
  isMyProfile: boolean;
}) => {
  const { open } = useBottomSheetStore.getState();

  open(<LogoutConfirmContent isMyProfile={isMyProfile} />, {
    snapPoints: [220],
    enableHandlePanningGesture: false,
    enableContentPanningGesture: false,
    backdropPressToClose: true,
    initialIndex: 1,
  });
};

// ✅ 컴포넌트: 여기서 Hook 사용 가능 ✅
const LogoutConfirmContent = ({ isMyProfile }: { isMyProfile: boolean }) => {
  const { close } = useBottomSheetStore();
  const { logout } = useLogout();

  const handleConfirm = async () => {
    await logout();
    close();
  };

  const handleCancel = () => {
    close(); // 현재 confirm 시트 닫고
    setTimeout(() => {
      openProfileMenuSheet({ isMyProfile }); // 원래 시트 재오픈
    }, 250); // 닫힘 애니메이션 이후에 다시 열리도록 딜레이
  };

  return (
    <BottomSheetView style={styles.container}>
      <AppText
        i18nKey="STR_LOGOUT_CONFIRM"
        variant="body"
        style={styles.title}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancel]}
          onPress={handleCancel} // ✅ 바뀐 부분
        >
          <AppText i18nKey="STR_CANCEL" variant="body" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logout]}
          onPress={handleConfirm}
        >
          <AppText i18nKey="STR_LOGOUT" variant="body" />
        </TouchableOpacity>
      </View>
    </BottomSheetView>
  );
};

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
  logout: {
    backgroundColor: COLORS.error,
  },
});
