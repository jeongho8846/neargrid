// 📄 src/screens/footprint/FootPrintScreen.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '@/common/styles/colors';

const FootPrintScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ing</Text>
    </View>
  );
};

export default FootPrintScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: COLORS.title,
  },
});
