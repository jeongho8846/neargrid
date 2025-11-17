import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AppIcon from '@/common/components/AppIcon';
import { SPACING } from '@/common/styles';
import { usePermission } from '@/common/hooks/usePermission';
import PermissionDialog from '@/common/components/PermissionDialog';

type Props = {
  onPress: () => void; // 권한 허용 후 실행될 함수
};

export default function CameraPickerButton({ onPress }: Props) {
  const cameraPermission = usePermission('camera');

  const handlePress = async () => {
    // 1. 권한 확인
    const status = await cameraPermission.check();
    if (status === 'granted') {
      // 이미 허용됨 -> 바로 실행
      onPress();
      return;
    }

    // 2. 권한 요청 (다이얼로그 표시)
    const result = await cameraPermission.request();
    if (result.granted) {
      // 허용됨 -> 실행
      onPress();
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <AppIcon name="camera" type="ion" variant="secondary" />
      </TouchableOpacity>

      <PermissionDialog
        visible={cameraPermission.dialogVisible}
        type="camera"
        onConfirm={cameraPermission.handleConfirm}
        onClose={cameraPermission.handleClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
});
