// src/features/map/components/FootprintButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';

const FootprintButton: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        // ✅ 발자국 화면으로 이동
        // navigation.navigate('Footsteps');
      }}
      activeOpacity={0.8}
    >
      <AppIcon name="footsteps" type="ion" size={20} variant="primary" />
    </TouchableOpacity>
  );
};

export default FootprintButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.sheet_background,
    padding: 8,
    borderRadius: 10,
    width: 35,
    height: 35,
  },
});
