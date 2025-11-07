import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useToastStore } from '../state/toastStore';
import AppText from './AppText';
import { COLORS, RADIUS, SPACING } from '../styles/tokens';

export default function AppToast() {
  const { toast, hideToast } = useToastStore();
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(50);

  useEffect(() => {
    if (!toast) return;

    // ✅ 토스트 등장 애니메이션
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // ✅ 2초 후 자동 사라짐
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => hideToast());
    }, 2000);

    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const backgroundColor =
    toast.type === 'success'
      ? COLORS.success
      : toast.type === 'error'
      ? COLORS.error
      : COLORS.info;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <AppText variant="body">{toast.message}</AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: SPACING.xl * 5,
    alignSelf: 'center',
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 5,
  },
});
