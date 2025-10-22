// src/features/thread/sheets/openThreadShareSheet.tsx
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import { SPACING } from '@/common/styles/spacing';

type Props = { threadId?: string | null };

export const openThreadShareSheet = ({ threadId }: Props) => {
  const { open } = useBottomSheetStore.getState();
  const link = `https://neargrid.ai/thread/${threadId}`;

  const CopyLinkRow: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      Clipboard.setString(link);
      setCopied(true);

      if (Platform.OS === 'android') {
        ToastAndroid.show('복사되었습니다', ToastAndroid.SHORT);
      } else {
        Alert.alert('복사되었습니다');
      }

      setTimeout(() => setCopied(false), 1200);
    };

    return (
      <View style={styles.linkRow}>
        <View style={styles.linkBox}>
          <AppText numberOfLines={1} style={styles.linkText}>
            {link}
          </AppText>
        </View>

        <TouchableOpacity
          style={[styles.iconBtn, copied && styles.iconBtnCopied]}
          onPress={handleCopy}
          activeOpacity={0.8}
        >
          <AppIcon
            type="ion"
            name={copied ? 'checkmark-circle-outline' : 'link-outline'}
            size={22}
            color={copied ? COLORS.error : COLORS.text}
          />
        </TouchableOpacity>
      </View>
    );
  };

  open(
    <View style={styles.container}>
      <CopyLinkRow />
    </View>,
    { snapPoints: ['16%'], initialIndex: 1 },
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  title: {
    ...FONT.title,
    color: COLORS.text,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  linkBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  linkText: {
    ...FONT.body,
    color: COLORS.text,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  iconBtnCopied: {
    borderColor: COLORS.text,
    backgroundColor: (COLORS as any).bg_success_light ?? '#EAF7EF',
  },
});
