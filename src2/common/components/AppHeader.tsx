import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/tokens/colors';
import { SPACING } from '@/common/styles/tokens/spacing';
import { RADIUS } from '@/common/styles/tokens/radius';
import { SHADOW } from '@/common/styles/tokens/shadow';
import { useHeaderStore } from '@/common/state/headerStore';

export const HEADER_HEIGHT = 56;

type Props = {
  tKey?: string;
  leftIcon?: string;
  rightIcon?: string;
  transparent?: boolean;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  showBackButton: boolean; // ✅ 수동 제어 전용
};

export default function AppHeader({
  tKey,
  leftIcon = 'chevron-back',
  rightIcon,
  transparent = false,
  onPressLeft,
  onPressRight,
  showBackButton = false,
}: Props) {
  const visible = useHeaderStore(s => s.visible);
  const navigation = useNavigation();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(visible ? 0 : -HEADER_HEIGHT - 20, {
          duration: 250,
        }),
      },
    ],
    opacity: withTiming(visible ? 1 : 0, { duration: 250 }),
  }));

  return (
    <Animated.View
      style={[
        styles.safe,
        transparent ? styles.transparent : styles.solid,
        animatedStyle,
      ]}
    >
      <SafeAreaView edges={['top']} style={styles.innerSafe}>
        <View
          style={[
            styles.container,
            showBackButton ? styles.withBack : styles.centered,
          ]}
        >
          {/* 왼쪽 섹션 */}
          {showBackButton ? (
            <TouchableOpacity
              onPress={onPressLeft ?? navigation.goBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.side}
            >
              <AppIcon name={leftIcon} size={24} color={COLORS.text_primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.side} />
          )}

          {/* 타이틀 */}
          {tKey && (
            <AppText
              tKey={tKey}
              variant="title"
              style={showBackButton ? styles.titleLeft : styles.titleCenter}
            />
          )}

          {/* 오른쪽 섹션 */}
          <TouchableOpacity
            onPress={onPressRight}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.side}
          >
            {rightIcon && (
              <AppIcon name={rightIcon} size={22} color={COLORS.text_primary} />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

/* ===================== Styles ===================== */

const styles = StyleSheet.create({
  safe: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10,
  },
  innerSafe: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HEADER_HEIGHT,
    paddingHorizontal: SPACING.md,
  },
  withBack: {
    justifyContent: 'flex-start',
  },
  centered: {
    justifyContent: 'space-between',
  },
  titleLeft: {
    marginLeft: SPACING.sm,
  },
  titleCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  solid: {
    backgroundColor: COLORS.surface,
    ...SHADOW.soft,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  side: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.md,
  },
});
