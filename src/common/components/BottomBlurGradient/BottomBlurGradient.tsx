import React, { ReactElement } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

interface BottomBlurGradientProps {
  height?: number;
  children?: ReactElement | ReactElement[] | null; // ✅ 타입 제한
  colors?: string[];
  locations?: number[];
  blurAmount?: number;
  blurOpacity?: number;
}

const BottomBlurGradient: React.FC<BottomBlurGradientProps> = ({
  height = 120,
  children,
  colors = [
    'rgba(0, 0, 0, 0)',
    'rgba(0, 0, 0, 0.3)',
    'rgba(0, 0, 0, 0.6)',
    'rgba(0, 0, 0, 0.95)',
    'rgba(0, 0, 0, 1)',
  ],
  locations = [0, 0.3, 0.5, 0.8, 1],
  blurAmount = 5,
  blurOpacity = 0.3,
}) => {
  return (
    <View style={[styles.container, { height }]}>
      <LinearGradient
        colors={colors}
        locations={locations}
        style={styles.gradient}
      />
      {Platform.OS === 'ios' && (
        <BlurView
          style={[styles.blurView, { opacity: blurOpacity }]}
          blurType="light"
          blurAmount={blurAmount}
          reducedTransparencyFallbackColor="white"
        />
      )}
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
};

export default BottomBlurGradient;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
