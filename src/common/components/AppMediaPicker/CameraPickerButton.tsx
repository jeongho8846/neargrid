import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AppIcon from '@/common/components/AppIcon';
import AppText from '@/common/components/AppText';
import { SPACING } from '@/common/styles';

type Props = {
  onPress: () => void;
};

export default function CameraPickerButton({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <AppIcon name="camera" type="ion" variant="secondary" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
});
