import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import { PermissionType } from '@/services/device/permissionService';

interface PermissionDialogProps {
  visible: boolean;
  type: PermissionType;
  onConfirm: () => void;
  onClose: () => void;
}

const PERMISSION_ICONS: Record<PermissionType, string> = {
  camera: 'camera',
  gallery: 'image',
  location: 'location',
  notification: 'notifications',
};

const PermissionDialog: React.FC<PermissionDialogProps> = ({
  visible,
  type,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();

  const titleKey = `STR_PERMISSION_${type.toUpperCase()}_TITLE`;
  const rationaleKey = `STR_PERMISSION_${type.toUpperCase()}_RATIONALE`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.iconContainer}>
            <AppIcon
              name={PERMISSION_ICONS[type]}
              type="ion"
              size={48}
              color={COLORS.button_active}
            />
          </View>

          <AppText variant="title" style={styles.title}>
            {t(titleKey)}
          </AppText>

          <AppText variant="body" style={styles.message}>
            {t(rationaleKey)}
          </AppText>

          <TouchableOpacity
            style={styles.button}
            onPress={onConfirm}
            activeOpacity={0.7}
          >
            <AppText variant="button" style={styles.buttonText}>
              {t('STR_PERMISSION_ALLOW')}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.sheet_backdrop,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  dialog: {
    backgroundColor: COLORS.sheet_background,
    borderRadius: 16,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.input_background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: COLORS.caption,
    marginBottom: SPACING.xl,
  },
  button: {
    width: '100%',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.button_active,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.button_variant,
    fontWeight: '600',
  },
});

export default PermissionDialog;
