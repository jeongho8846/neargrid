import React from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';

type Props = {
  visible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const AppDialog: React.FC<Props> = ({
  visible,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            {onCancel && (
              <TouchableOpacity style={styles.button} onPress={onCancel}>
                <Text style={styles.cancel}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={styles.confirm}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // ✅ 배경 오버레이
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // 팔레트엔 없으므로 임시 직접 지정
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ✅ 다이얼로그 본체
  dialog: {
    width: '75%',
    backgroundColor: COLORS.background, // 다크 배경
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // ✅ 제목 텍스트
  title: {
    ...FONT.title,
    color: COLORS.text,
    marginBottom: 8,
  },

  // ✅ 본문 텍스트
  message: {
    ...FONT.body,
    color: COLORS.text_secondary,
    textAlign: 'center',
    marginBottom: 20,
  },

  // ✅ 버튼 영역
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },

  button: {
    marginLeft: 16,
  },

  // ✅ 취소 버튼
  cancel: {
    ...FONT.body,
    color: COLORS.text_muted,
  },

  // ✅ 확인 버튼
  confirm: {
    ...FONT.body,
    color: COLORS.button_active,
  },
});

export default AppDialog;
