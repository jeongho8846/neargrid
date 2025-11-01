// 📄 src/common/components/AppMapView/controls/AppMapCurrentLocationButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';

type Props = {
  onPress: () => void;
};

const AppMapCurrentLocationButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <AppIcon name="locate-outline" type="ion" variant="onDark" size={22} />
    </TouchableOpacity>
  );
};

export default AppMapCurrentLocationButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.xl,
    backgroundColor: COLORS.button_surface,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
});
