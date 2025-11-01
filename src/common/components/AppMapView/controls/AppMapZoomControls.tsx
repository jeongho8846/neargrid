import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

const AppMapZoomControls = ({ onZoomIn, onZoomOut }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onZoomIn}>
        <AppIcon name="add" type="material" variant="onDark" size={22} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onZoomOut}>
        <AppIcon name="remove" type="material" variant="onDark" size={22} />
      </TouchableOpacity>
    </View>
  );
};

export default AppMapZoomControls;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.xl * 3, // 현재위치 버튼보다 위로
    borderRadius: 16,
    backgroundColor: COLORS.button_surface,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
