import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, Dimensions } from 'react-native';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';

type AppToastProps = {
  visible: boolean;
  message: string;
  duration?: number; // 표시 시간 (ms)
  position?: 'top' | 'bottom' | 'center';
  onHide?: () => void;
};

const { height } = Dimensions.get('window');

const AppToast: React.FC<AppToastProps> = ({
  visible,
  message,
  duration = 2000,
  position = 'bottom',
  onHide,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => onHide && onHide());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, duration, onHide]);

  const getPosition = () => {
    switch (position) {
      case 'top':
        return { top: 60 };
      case 'center':
        return { top: height * 0.45 }; // ✅ 문자열 퍼센트 대신 실제 수치
      default:
        return { bottom: 100 };
    }
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, getPosition(), { opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.button_active,
    opacity: 0.9,
    zIndex: 9999,
  },
  text: {
    ...FONT.body,
    color: COLORS.text,
  },
});

export default AppToast;
